import enquirer from "enquirer";
import sqlite3 from "sqlite3";

const { Select } = enquirer;
const db = new sqlite3.Database("./memo.sqlite");

export class Memo {
  constructor(option) {
    this.option = option;
    this.dataAccessor = new DataAccessor(db);
  }

  async init() {
    try {
      this.rows = await this.dataAccessor.allAsync("SELECT content FROM memos");
    } catch (err) {
      console.error(err.message);
    }
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
      await this.dataAccessor.closeAsync();
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
      await this.dataAccessor.closeAsync();
    } else if (this.option === "-d") {
      const prompt = new Select({
        name: "value",
        message: this.questionMessage(),
        choices: this.headers(),
      });
      const answer = await prompt.run();

      await this.dataAccessor.delete(answer, this.rows);
    } else {
      await this.dataAccessor.create();
    }
  }
}

class DataAccessor {
  constructor(db) {
    this.db = db;
  }

  delete = async (answer, rows) => {
    const selectedContent = rows.find(
      (row) => row.content.split("\n")[0] === answer
    );

    try {
      await this.runAsync(
        "DELETE FROM memos WHERE content = (?)",
        selectedContent.content
      );
    } catch (err) {
      console.error(err.message);
    } finally {
      await this.closeAsync();
    }
  };

  create = async () => {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    await process.stdin.on("data", async (chunk) => {
      try {
        await this.runAsync("INSERT INTO memos VALUES (?)", chunk);
      } catch (err) {
        console.error(err.message);
      } finally {
        await this.closeAsync();
      }
    });
  };

  runAsync = (sql, ...params) => {
    return new Promise((resolve, reject) => {
      this.db.run(sql, ...params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  };

  allAsync = (sql, ...params) => {
    return new Promise((resolve, reject) => {
      this.db.all(sql, ...params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  closeAsync = () => {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
}
