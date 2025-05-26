use core::num::traits::Pow;
use core::starknet::{ContractAddress, get_contract_address};
use sats::vault::vault_manager::{
    IVaultManagerDispatcher, IVaultManagerDispatcherTrait, IVesuVaultDispatcher,
    IVesuVaultDispatcherTrait, IERC20Dispatcher, IERC20DispatcherTrait,
};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_block_timestamp_global,
    start_cheat_caller_address, stop_cheat_caller_address, test_address,
};

const WBTC_TOKEN_ADDRESS: felt252 =
    0x03Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC;
const VESU_WBTC_VAULT: felt252 = 0x0692ae4c33153BEdC5ed7B90CfC1C30e2a6a87F48CBC07435D992B312434f35E;
const USDC_TOKEN_ADDRESS: felt252 =
    0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8;
fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
#[fork(url: "https://starknet-mainnet.public.blastapi.io/rpc/v0_8", block_tag: latest)]
fn test_cannot_increase_balance_with_zero_value() {
    let contract_address = deploy_contract("VaultManager");

    let dispatcher = IVaultManagerDispatcher { contract_address };

    let balance_before = dispatcher.get_weth_balance(get_contract_address());
    assert(balance_before == 0, 'Invalid balance');
    let usdc_funder = 0x042543c7d220465bd3f8f42314b51f4f3a61d58de3770523b281da61dbf27c8a;

    start_cheat_caller_address(
        USDC_TOKEN_ADDRESS.try_into().unwrap(), usdc_funder.try_into().unwrap(),
    );
    let usdc_dispatcher = IERC20Dispatcher {
        contract_address: USDC_TOKEN_ADDRESS.try_into().unwrap(),
    };
    usdc_dispatcher.transfer(contract_address, 200 * 10_u256.pow(2));
    stop_cheat_caller_address(USDC_TOKEN_ADDRESS.try_into().unwrap());

    let alice: felt252 = 0x026623928dbd7b2fb5480bdfb2796b8be6e33ea608531425278b47526eaf0263;
    // let bob = 0x026623928dbd7b2fb5480bdfb2796b8be6e33ea608531425278b47526eaf0264;
    start_cheat_caller_address(WBTC_TOKEN_ADDRESS.try_into().unwrap(), alice.try_into().unwrap());
    let wbtc_dispatcher = IERC20Dispatcher {
        contract_address: WBTC_TOKEN_ADDRESS.try_into().unwrap(),
    };
    wbtc_dispatcher.approve(contract_address, 200 * 10_u256.pow(5));
    println!(
        "allowance: {}", wbtc_dispatcher.allowance(alice.try_into().unwrap(), contract_address),
    );
    stop_cheat_caller_address(WBTC_TOKEN_ADDRESS.try_into().unwrap());

    start_cheat_caller_address(contract_address, alice.try_into().unwrap());
    // call vault manager deposit
    let amount = 100;
    let vesu_vault = IVesuVaultDispatcher { contract_address: VESU_WBTC_VAULT.try_into().unwrap() };
    let share_to_receive = vesu_vault.preview_deposit(amount * 10_u256.pow(8));
    println!("shares to recieve: {}", share_to_receive);

    dispatcher.deposit_btc(amount);
    dispatcher.deposit_btc(amount / 2 + 33333);

    let assset_to_receive = vesu_vault.preview_withdraw(share_to_receive);
    println!("assets to recieve: {}", assset_to_receive / 10_u256.pow(10));
    stop_cheat_caller_address(contract_address);

    start_cheat_caller_address(VESU_WBTC_VAULT.try_into().unwrap(), alice.try_into().unwrap());

    vesu_vault.approve(contract_address, vesu_vault.balance_of(alice.try_into().unwrap()));
    println!("allowance: {}", vesu_vault.allowance(alice.try_into().unwrap(), contract_address));
    stop_cheat_caller_address(VESU_WBTC_VAULT.try_into().unwrap());

    start_cheat_caller_address(
        USDC_TOKEN_ADDRESS.try_into().unwrap(), alice.try_into().unwrap(),
    );
    let usdc_dispatcher = IERC20Dispatcher {
        contract_address: USDC_TOKEN_ADDRESS.try_into().unwrap(),
    };
    usdc_dispatcher.approve(contract_address, 200 * 10_u256.pow(2));
    stop_cheat_caller_address(USDC_TOKEN_ADDRESS.try_into().unwrap());

    
    start_cheat_caller_address(contract_address, alice.try_into().unwrap());
    let usdc_deposit = dispatcher.get_weth_balance(alice.try_into().unwrap());
    println!("usdc_deposit: {}", usdc_deposit);

    let shares_deposit = dispatcher.get_shares(alice.try_into().unwrap());
    println!("shares_deposit: {}", shares_deposit);
    assert(shares_deposit == vesu_vault.balance_of(alice.try_into().unwrap()), 'Invalid shares');
    // dispatcher.withdraw_btc(vesu_vault.balance_of(alice.try_into().unwrap()));
    // dispatcher.withdraw_btc(33483);
    dispatcher.borrow_usdc(20);

    dispatcher.repay_usdc(20);
    stop_cheat_caller_address(contract_address);
    // 334830000000000
// 334830000000000
// 200000000000000000000
}
