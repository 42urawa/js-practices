import { MemoController } from "./memo-controller.js";

const option = process.argv.slice(2)[0];

const memoController = new MemoController(option);
await memoController.execute();
