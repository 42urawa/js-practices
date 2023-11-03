#!/usr/bin/env node

import pkg from "enquirer";
import sqlite3 from "sqlite3";
import { runAsync, allAsync, closeAsync } from "./db_async_function.js";

const { Select } = pkg;
const db = new sqlite3.Database("./memo.sqlite");

const option = process.argv.slice(2)[0];

class Executor {
  constructor(option) {
    this.option = option;
  }

  async execute() {
    if (this.option === "-l") {
      const rows = await allAsync(db, "SELECT content FROM memos");
      const headers = rows.map((row) => row.content.split("\n")[0]);

      headers.forEach((header) => console.log(header));

      await closeAsync(db);
    } else if (this.option === "-r") {
      const rows = await allAsync(db, "SELECT content FROM memos");
      const headers = rows.map((row) => row.content.split("\n")[0]);

      const prompt = new Select({
        name: "value",
        message: "Choose a note you want to see:",
        choices: headers,
      });

      const answer = await prompt.run();
      const selectedContent = rows.find(
        (row) => row.content.split("\n")[0] === answer
      );
      console.log(selectedContent.content);

      await closeAsync(db);
    } else if (option === "-d") {
      const rows = await allAsync(db, "SELECT content FROM memos");
      const headers = rows.map((row) => row.content.split("\n")[0]);

      const prompt = new Select({
        name: "value",
        message: "Choose a note you want to see:",
        choices: headers,
      });

      const answer = await prompt.run();

      const selectedContent = rows.find(
        (row) => row.content.split("\n")[0] === answer
      );

      await runAsync(
        db,
        "DELETE FROM memos WHERE content = (?)",
        selectedContent.content
      );

      await closeAsync(db);
    } else {
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", async function (chunk) {
        await runAsync(db, "INSERT INTO memos VALUES (?)", chunk);
        await closeAsync(db);
      });
    }
  }
}

const executor = new Executor(option);
executor.execute();
