import sqlite3 from "sqlite3";
import { MemoModel } from "./memo-model.js";

export class MemoController {
  constructor(option) {
    this.option = option;
    const db = new sqlite3.Database("./memo.sqlite");
    this.memoModel = new MemoModel(db);
  }

  async execute() {
    if (this.option === "-l") {
      await this.memoModel.list();
    } else if (this.option === "-r") {
      await this.memoModel.read();
    } else if (this.option === "-d") {
      await this.memoModel.delete();
    } else {
      await this.memoModel.create();
    }
  }
}
