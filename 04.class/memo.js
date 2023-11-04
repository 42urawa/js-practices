import enquirer from "enquirer";
import sqlite3 from "sqlite3";
import { runAsync, allAsync, closeAsync } from "./db_async_function.js";

const { Select } = enquirer;
const db = new sqlite3.Database("./memo.sqlite");

const option = process.argv.slice(2)[0];

class Executor {
  constructor(option) {
    this.option = option;
  }

  async execute() {
    let executor;
    let rows;

    try {
      rows = await allAsync(db, "SELECT content FROM memos");
    } catch (err) {
      console.error(err.message);
    }

    if (this.option === "-l") {
      executor = new ListExecutor(rows);
    } else if (this.option === "-r") {
      executor = new ReadExecutor(rows);
    } else if (option === "-d") {
      executor = new DeleteExecutor(rows);
    } else {
      executor = new CreateExecutor();
    }
    executor.execute();
  }
}

class ListExecutor {
  constructor(rows) {
    this.rows = rows;
  }

  async execute() {
    const headers = this.rows.map((row) => row.content.split("\n")[0]);
    headers.forEach((header) => console.log(header));
    await closeAsync(db);
  }
}

class ReadExecutor {
  constructor(rows) {
    this.rows = rows;
  }

  async execute() {
    const headers = this.rows.map((row) => row.content.split("\n")[0]);

    const prompt = new Select({
      name: "value",
      message: "Choose a memo you want to see:",
      choices: headers,
    });

    const answer = await prompt.run();
    const selectedContent = this.rows.find(
      (row) => row.content.split("\n")[0] === answer
    );
    console.log(selectedContent.content);

    await closeAsync(db);
  }
}

class DeleteExecutor {
  constructor(rows) {
    this.rows = rows;
  }

  async execute() {
    const headers = this.rows.map((row) => row.content.split("\n")[0]);

    const prompt = new Select({
      name: "value",
      message: "Choose a memo you want to delete:",
      choices: headers,
    });

    const answer = await prompt.run();

    const selectedContent = this.rows.find(
      (row) => row.content.split("\n")[0] === answer
    );

    try {
      await runAsync(
        db,
        "DELETE FROM memos WHERE content = (?)",
        selectedContent.content
      );
    } catch (err) {
      console.error(err.message);
    }

    await closeAsync(db);
  }
}

class CreateExecutor {
  execute() {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", async function (chunk) {
      try {
        await runAsync(db, "INSERT INTO memos VALUES (?)", chunk);
      } catch (err) {
        console.error(err.message);
      }

      await closeAsync(db);
    });
  }
}

const executor = new Executor(option);
executor.execute();
