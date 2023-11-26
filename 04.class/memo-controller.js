import sqlite3 from "sqlite3";
import enquirer from "enquirer";
import { Memo } from "./memo.js";

const { Select } = enquirer;

export class MemoController {
  constructor(option) {
    this.option = option;
    const db = new sqlite3.Database("./memo.sqlite");
    this.memo = new Memo(db);
  }

  async execute() {
    if (this.option === "-l") {
      await this.list();
    } else if (this.option === "-r") {
      await this.read();
    } else if (this.option === "-d") {
      await this.delete();
    } else {
      await this.create();
    }
  }

  list = async () => {
    const headers = await this.memo.list();

    if (headers.length <= 0) {
      console.log("メモは1件もありません");
    } else {
      console.log(headers.join("\n"));
    }

    await this.memo.close();
  };

  read = async () => {
    const headers = await this.memo.list();

    if (headers.length <= 0) {
      console.log("メモは1件もありません");
    } else {
      const prompt = new Select({
        name: "value",
        message: "Choose a memo you want to see:",
        choices: headers,
      });

      const answer = await prompt.run();
      const content = await this.memo.read(answer);

      console.log(content);
    }

    await this.memo.close();
  };

  delete = async () => {
    const headers = await this.memo.list();

    if (headers.length <= 0) {
      console.log("メモは1件もありません");
    } else {
      const prompt = new Select({
        name: "value",
        message: "Choose a memo you want to delete:",
        choices: headers,
      });

      const answer = await prompt.run();
      await this.memo.delete(answer);

      console.log("選択したメモを削除しました");
    }

    await this.memo.close();
  };

  create = async () => {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", async (content) => {
      await this.memo.create(content);
      console.log("メモを1件作成しました");
      await this.memo.close();
    });
  };
}
