import sqlite3 from "sqlite3";
import { MemoModel } from "./memo-model.js";
import { MemoView } from "./memo-view.js";

export class MemoController {
  constructor(option) {
    this.option = option;
    const db = new sqlite3.Database("./memo.sqlite");
    this.memoModel = new MemoModel(db);
  }

  async execute() {
    let showedMemoData;

    if (this.option === "-l") {
      showedMemoData = await this.memoModel.list();
    } else if (this.option === "-r") {
      showedMemoData = await this.memoModel.read();
    } else if (this.option === "-d") {
      showedMemoData = await this.memoModel.delete();
    } else {
      showedMemoData = await this.memoModel.create();
    }

    const memoView = new MemoView(showedMemoData);
    memoView.show();
  }
}
