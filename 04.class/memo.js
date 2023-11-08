import enquirer from "enquirer";
import sqlite3 from "sqlite3";

const { Select } = enquirer;
const db = new sqlite3.Database("./memo.sqlite");
const option = process.argv.slice(2)[0];

class OptionController {
  #option;

  constructor(option) {
    this.#option = option;
  }

  async execute() {
    let executor;
    let rows;

    try {
      rows = await DBAccessor.allAsync(db, "SELECT content FROM memos");
    } catch (err) {
      console.error(err.message);
    }

    if (this.#option === "-l") {
      executor = new ListExecutor(rows);
    } else if (this.#option === "-r") {
      executor = new ReadExecutor(rows);
    } else if (this.#option === "-d") {
      executor = new DeleteExecutor(rows);
    } else {
      executor = new CreateExecutor();
    }

    await executor.execute();
  }
}

class ListExecutor {
  #rows;

  constructor(rows) {
    this.#rows = rows;
  }

  async execute() {
    const headers = this.#rows.map((row) => row.content.split("\n")[0]);
    headers.forEach((choice) => console.log(choice));

    await DBAccessor.closeAsync(db);
  }
}

class ReadExecutor {
  #rows;
  #message;

  constructor(rows) {
    this.#rows = rows;
    this.#message = "Choose a memo you want to see:";
  }

  async execute() {
    const choices = this.#rows.map((row) => row.content.split("\n")[0]);
    const enquirerAccessor = new EnquirerAccessor(choices, this.#message);
    const answer = await enquirerAccessor.executor();

    const selectedContent = this.#rows.find(
      (row) => row.content.split("\n")[0] === answer
    );
    console.log(selectedContent.content);

    await DBAccessor.closeAsync(db);
  }
}

class DeleteExecutor {
  #rows;
  #message;

  constructor(rows) {
    this.#rows = rows;
    this.#message = "Choose a memo you want to delete:";
  }

  async execute() {
    const choices = this.#rows.map((row) => row.content.split("\n")[0]);
    const enquirerAccessor = new EnquirerAccessor(choices, this.#message);
    const answer = await enquirerAccessor.executor();

    const selectedContent = this.#rows.find(
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
    }

    await DBAccessor.closeAsync(db);
  }
}

class CreateExecutor {
  execute() {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", async function (chunk) {
      try {
        await DBAccessor.runAsync(db, "INSERT INTO memos VALUES (?)", chunk);
      } catch (err) {
        console.error(err.message);
      }

      await DBAccessor.closeAsync(db);
    });
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

class EnquirerAccessor {
  #choices;
  #message;

  constructor(choices, message) {
    this.#choices = choices;
    this.#message = message;
  }

  async executor() {
    const prompt = new Select({
      name: "value",
      message: this.#message,
      choices: this.#choices,
    });

    return await prompt.run();
  }
}

const controller = new OptionController(option);
controller.execute();
