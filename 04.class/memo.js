import enquirer from "enquirer";
import sqlite3 from "sqlite3";

const { Select } = enquirer;
const db = new sqlite3.Database("./memo.sqlite");
const option = process.argv.slice(2)[0];

class Memo {
  constructor(option) {
    this.option = option;
  }

  async init() {
    let rows;

    try {
      rows = await DBAccessor.allAsync(db, "SELECT content FROM memos");
    } catch (err) {
      console.error(err.message);
    }

    this.rows = rows;
  }

  headers() {
    return this.rows.map((row) => row.content.split("\n")[0]);
  }

  questionMessage() {
    if (this.option === "-r") {
      return "Choose a memo you want to see:";
    } else if (this.option === "-d") {
      return "Choose a memo you want to delete:";
    } else {
      return "";
    }
  }

  async execute() {
    if (this.option === "-l") {
      this.headers().forEach((header) => console.log(header));
      await DBAccessor.closeAsync(db);
    } else if (this.option === "-r") {
      const prompt = new Select({
        name: "value",
        message: this.questionMessage(),
        choices: this.headers(),
      });
      const answer = await prompt.run();

      const selectedContent = this.rows.find(
        (row) => row.content.split("\n")[0] === answer
      );

      console.log(selectedContent.content);
      await DBAccessor.closeAsync(db);
    } else if (this.option === "-d") {
      const prompt = new Select({
        name: "value",
        message: this.questionMessage(),
        choices: this.headers(),
      });
      const answer = await prompt.run();

      const selectedContent = this.rows.find(
        (row) => row.content.split("\n")[0] === answer
      );

      try {
        await DBAccessor.runAsync(
          db,
          "DELETE FROM memos WHERE content = (?)",
          selectedContent.content
        );
      } catch (err) {
        console.error(err.message);
      } finally {
        await DBAccessor.closeAsync(db);
      }
    } else {
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      await process.stdin.on("data", async function (chunk) {
        try {
          await DBAccessor.runAsync(db, "INSERT INTO memos VALUES (?)", chunk);
        } catch (err) {
          console.error(err.message);
        } finally {
          await DBAccessor.closeAsync(db);
        }
      });
    }
  }
}

class DBAccessor {
  static runAsync = (db, sql, ...params) => {
    return new Promise((resolve, reject) => {
      db.run(sql, ...params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  };

  static allAsync = (db, sql, ...params) => {
    return new Promise((resolve, reject) => {
      db.all(sql, ...params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  static closeAsync = (db) => {
    return new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
}

const memo = new Memo(option);
await memo.init();
await memo.execute();
