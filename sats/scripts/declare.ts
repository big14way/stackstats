import { Account, Contract, RpcProvider, stark,  CallData  } from "starknet";
import * as dotenv from "dotenv";
import { getCompiledCode } from "./utils";
dotenv.config();

async function main() {
  const provider = new RpcProvider({
    nodeUrl: process.env.RPC_ENDPOINT,
  });

  console.log("ACCOUNT_ADDRESS=", process.env.DEPLOYER_ADDRESS);
  const privateKey0 = process.env.DEPLOYER_PRIVATE_KEY ?? "";
  const accountAddress0: string = process.env.DEPLOYER_ADDRESS ?? "";
  const account0 = new Account(provider, accountAddress0, privateKey0);
  console.log("Account connected.\n");

  let AsierraCode, AcasmCode;

  try {
    ({ AsierraCode, AcasmCode } = await getCompiledCode("sats_VaultManager"));
  } catch (error: any) {
    console.log("Failed to read contract files");
    console.log(error);
    process.exit(1);
  }
  console.log("declaring contracts...\n");
 
  const calldata = new CallData(AsierraCode.abi);
  const constructor = calldata.compile("constructor", []);
  const coursedeclareResponse = await account0.declareAndDeploy({
    contract: AsierraCode,
    casm: AcasmCode,
    constructorCalldata: constructor,
    salt: stark.randomAddress(),
  });

// Connect the new contract instance:
const myTestContract = new Contract(
    AsierraCode.abi,
    coursedeclareResponse.deploy.contract_address,
    provider
  );
  console.log('Test Contract Class Hash =', coursedeclareResponse.declare.class_hash);
  console.log('✅ Test Contract connected at =', myTestContract.address);
  console.log(
    "Vault Manager Contract declared with classHash =",
    coursedeclareResponse.declare.class_hash
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
