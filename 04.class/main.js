import { Memo } from "./memo.js";

const option = process.argv.slice(2)[0];

const memo = new Memo(option);
await memo.init();
await memo.execute();
