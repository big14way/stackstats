import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { json } from "starknet";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getCompiledCode(filenameA: string) {
  const AsierraFilePath = path.join(
    __dirname,
    `../target/dev/${filenameA}.contract_class.json`
  );
  const AcasmFilePath = path.join(
    __dirname,
    `../target/dev/${filenameA}.compiled_contract_class.json`
  );

  const codeA = [AsierraFilePath, AcasmFilePath].map(async (filePath) => {
    const file = await fs.readFile(filePath);
    return json.parse(file.toString("ascii"));
  });
  const [AsierraCode, AcasmCode] = await Promise.all(codeA);

  return {
    AsierraCode,
    AcasmCode,
  };
}
