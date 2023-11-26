import { MemoCLI } from "./memo-cli.js";

const option = process.argv.slice(2)[0];

const memoCLI = new MemoCLI(option);
await memoCLI.execute();
