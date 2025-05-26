use core::starknet::ContractAddress;
#[starknet::interface]
pub trait IERC20<TContractState> {
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256,
    ) -> bool;
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256);
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn balance_of(ref self: TContractState, owner: ContractAddress) -> u256;
    fn allowance(
        ref self: TContractState, owner: ContractAddress, spender: ContractAddress,
    ) -> u256;
}

#[starknet::interface]
pub trait IVesuVault<TContractState> {
    fn deposit(
        ref self: TContractState, amount: u256, receiver: ContractAddress,
    ) -> u256; // returns shares
    fn withdraw(
        ref self: TContractState, shares: u256, receiver: ContractAddress, owner: ContractAddress,
    ) -> u256; // returns amount
    fn total_assets(self: @TContractState) -> u256;
    fn preview_deposit(self: @TContractState, amount: u256) -> u256;
    fn preview_withdraw(self: @TContractState, amount: u256) -> u256;
    fn balance_of(ref self: TContractState, owner: ContractAddress) -> u256;
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256,
    ) -> bool;
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256);
    fn allowance(
        ref self: TContractState, owner: ContractAddress, spender: ContractAddress,
    ) -> u256;
}

#[starknet::interface]
pub trait IVaultManager<TContractState> {
    fn deposit_btc(ref self: TContractState, amount: u256);
    fn withdraw_btc(ref self: TContractState, shares_amount: u256);
    fn borrow_usdc(ref self: TContractState, amount: u256);
    fn repay_usdc(ref self: TContractState, amount: u256);
    fn get_weth_balance(ref self: TContractState, caller: ContractAddress) -> u256;
    fn get_usdc_debt(ref self: TContractState, caller: ContractAddress) -> u256;
    fn get_shares(ref self: TContractState, caller: ContractAddress) -> u256;
    fn withdraw_stuck_funds(ref self: TContractState, token_address: ContractAddress, recipient: ContractAddress, amount: u256); 
}

#[starknet::contract]
pub mod VaultManager {
    use core::num::traits::Pow;
    use core::starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use core::starknet::{
        ContractAddress, contract_address_const, get_caller_address, get_contract_address,
    };
    use pragma_lib::abi::{
        IPragmaABIDispatcher, IPragmaABIDispatcherTrait, ISummaryStatsABIDispatcher,
        ISummaryStatsABIDispatcherTrait,
    };
    use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};
    use sats::vault::vault_manager::{
        IVesuVaultDispatcher, IVesuVaultDispatcherTrait, IERC20Dispatcher, IERC20DispatcherTrait,
    };

    // Pragma Oracle address on Sepolia
    const PRAGMA_ORACLE_ADDRESS: felt252 =
        0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b;
    const KEY: felt252 = 6287680677296296772; // WBTC/USD 
    const ORACLE_PRECISION: u256 = 100_000_000;
    const PAIR_ID: felt252 = 18669995996566340; //felt252 conversion of "BTC/USD"
    const PRAGMA_DECIMALS: u32 = 8;
    const DECIMALS: u256 = 10_u256.pow(8);
    const VESU_WBTC_VAULT: felt252 =
        0x0692ae4c33153BEdC5ed7B90CfC1C30e2a6a87F48CBC07435D992B312434f35E;
    // const WBTC_TOKEN_ADDRESS:felt252 =
    // 0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141;
    const WBTC_TOKEN_ADDRESS: felt252 =
        0x03Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC;
    const USDC_TOKEN_ADDRESS: felt252 =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8;
    const ADMIN_ADDRESS: felt252 = 0x0621168D7810912DfedAdC51D65645f6a2ad52E14DC5c1e74BEC3b8F204FeB36;
    #[storage]
    struct Storage {
        pub user_btc_balance: Map<ContractAddress, u256>,
        pub user_usdc_debt: Map<ContractAddress, u256>,
        pub user_shares: Map<ContractAddress, u256>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl VaultManagerImpl of super::IVaultManager<ContractState> {
        fn deposit_btc(ref self: ContractState, amount: u256) {
            assert(amount > 0, 'Amount must be greater than 0');
            let caller = get_caller_address();

            // 1. Pull WBTC from user
            let erc20_dispatcher = IERC20Dispatcher {
                contract_address: WBTC_TOKEN_ADDRESS.try_into().unwrap(),
            };
            erc20_dispatcher.transfer_from(caller, get_contract_address(), (amount));

            // 3. Deposit into VesuVault with scaled amount
            let vesu_vault = IVesuVaultDispatcher {
                contract_address: VESU_WBTC_VAULT.try_into().unwrap(),
            };
            erc20_dispatcher.approve(VESU_WBTC_VAULT.try_into().unwrap(), amount);
            let shares = vesu_vault.deposit(amount, caller);
            // 4. Track shares
            let old_shares = self.user_shares.entry(caller).read();
            self.user_shares.entry(caller).write(old_shares + shares);

            // // 5. Track unscaled WBTC balance
            let current_balance = self.user_btc_balance.entry(caller).read();
            let new_balance = current_balance + amount;
            self.user_btc_balance.entry(caller).write(new_balance);
        }

        fn withdraw_btc(ref self: ContractState, shares_amount: u256) {
            let caller = get_caller_address();
            let current_balance = self.user_btc_balance.entry(caller).read();
            let user_debt = self.user_usdc_debt.entry(caller).read();

            // withdraw from vault to address
            let vesu_vault = IVesuVaultDispatcher {
                contract_address: VESU_WBTC_VAULT.try_into().unwrap(),
            };
            println!("balance_of vesu_vault token before: {}", vesu_vault.balance_of(caller));
            vesu_vault.transfer_from(caller, get_contract_address(), shares_amount);

            vesu_vault.approve(VESU_WBTC_VAULT.try_into().unwrap(), shares_amount);

            let amount = vesu_vault
                .withdraw(shares_amount, get_contract_address(), caller);
            // simulate new collateral balance after withdrawal
            let new_collateral_balance = current_balance - amount;
            let price_of_btc_usd = self.get_btc_price();
            let value = new_collateral_balance * price_of_btc_usd;
            let volatility = self.get_btc_volatility();
            let cdr = self.compute_cdr(volatility);
            let required_collateral = user_debt * cdr;

            assert(value >= required_collateral, 'Insufficient collateral');
            self.user_btc_balance.entry(caller).write(new_collateral_balance);

            // update shares
            let new_shares = self.user_shares.entry(caller).read() - shares_amount;
            self.user_shares.entry(caller).write(new_shares);

            // transfer wbtc to caller
            let erc20_dispatcher = IERC20Dispatcher {
                contract_address: WBTC_TOKEN_ADDRESS.try_into().unwrap(),
            };
            erc20_dispatcher.transfer(caller, amount);
        }

        fn borrow_usdc(ref self: ContractState, amount: u256) {
            let caller = get_caller_address();
            let btc_collateral_balance = self.user_btc_balance.entry(caller).read();
            assert(btc_collateral_balance > 0, 'Insufficient collateral');
            let btc_price = self.get_btc_price();
            let collateral_value = btc_collateral_balance * btc_price;
            let volatility = self.get_btc_volatility();
            let cdr = self.compute_cdr(volatility);
            let max_borrow = collateral_value / cdr;
            assert(amount <= max_borrow, 'Exceeds max borrow limit');

            let current_debt = self.user_usdc_debt.entry(caller).read();
            let new_debt = current_debt + amount;
            self.user_usdc_debt.entry(caller).write(new_debt);

            // send usdc to caller
            let erc20_dispatcher = IERC20Dispatcher {
                contract_address: USDC_TOKEN_ADDRESS.try_into().unwrap(),
            };
            erc20_dispatcher.transfer(caller, amount);
        }

        fn repay_usdc(ref self: ContractState, amount: u256) {
            let caller = get_caller_address();
            let current_debt = self.user_usdc_debt.entry(caller).read();
            assert(amount <= current_debt, 'Exceeds max repay limit');
            // send usdc to caller
            let erc20_dispatcher = IERC20Dispatcher {
                contract_address: USDC_TOKEN_ADDRESS.try_into().unwrap(),
            };
            erc20_dispatcher.transfer_from(caller, get_contract_address(), amount);
            let new_debt = current_debt - amount;
            self.user_usdc_debt.entry(caller).write(new_debt);
        }

        fn get_weth_balance(ref self: ContractState, caller: ContractAddress) -> u256 {
            let balance = self.user_btc_balance.entry(caller).read();
            balance
        }

        fn get_usdc_debt(ref self: ContractState, caller: ContractAddress) -> u256 {
            let debt = self.user_usdc_debt.entry(caller).read();
            debt
        }

        fn get_shares(ref self: ContractState, caller: ContractAddress) -> u256 {
            let shares = self.user_shares.entry(caller).read();
            shares
        }

        fn withdraw_stuck_funds(ref self: ContractState, token_address: ContractAddress, recipient: ContractAddress, amount: u256) {
            assert(self.is_admin(get_caller_address()), 'Not authorized');
            let erc20_dispatcher = IERC20Dispatcher {
                contract_address: token_address,
            };
            erc20_dispatcher.transfer(recipient, amount);
        }
        


    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn get_btc_price(ref self: ContractState) -> u256 {
            let asset_data_type = DataType::SpotEntry(KEY);
            let oracle = IPragmaABIDispatcher {
                contract_address: PRAGMA_ORACLE_ADDRESS.try_into().unwrap(),
            };
            let response: PragmaPricesResponse = oracle
                .get_data(asset_data_type, AggregationMode::Median(()));
            let price_of_btc_usd = self
                .normalize_price(response.price.into(), response.decimals.into());
            price_of_btc_usd.into()
        }

        fn get_btc_volatility(ref self: ContractState) -> u256 {
            let (volatility, decimals) = self
                .compute_volatility(DataType::SpotEntry(PAIR_ID), AggregationMode::Median(()));
            let scaled_volatility = self.normalize_price(volatility.into(), decimals);
            scaled_volatility.into()
        }

        fn compute_volatility(
            ref self: ContractState, data_type: DataType, aggregation_mode: AggregationMode,
        ) -> (u128, u32) {
            let SUMMARY_STATS_ADDRESS: ContractAddress = contract_address_const::<
                0x049eefafae944d07744d07cc72a5bf14728a6fb463c3eae5bca13552f5d455fd,
            >();

            let start_tick = starknet::get_block_timestamp() - 604800;
            let end_tick = starknet::get_block_timestamp();

            let num_samples = 200;
            let summary_dispatcher = ISummaryStatsABIDispatcher {
                contract_address: SUMMARY_STATS_ADDRESS,
            };
            let (volatility, decimals) = summary_dispatcher
                .calculate_volatility(
                    data_type, start_tick, end_tick, num_samples, aggregation_mode,
                );

            return (volatility, decimals); // will return the volatility multiplied by 10^decimals
        }

        fn normalize_price(ref self: ContractState, price: u256, decimals: u32) -> u256 {
            let scale = PRAGMA_DECIMALS - decimals;
            let scaled_factor = 10_u256.pow(scale);
            let scaled_price = price * scaled_factor;
            scaled_price
        }


        fn compute_cdr(ref self: ContractState, volatility: u256) -> u256 {
            let base: u256 = 150;
            base + volatility
        }

        fn is_admin(ref self: ContractState, caller: ContractAddress) -> bool {
            caller == ADMIN_ADDRESS.try_into().unwrap()
        }
    }
}
