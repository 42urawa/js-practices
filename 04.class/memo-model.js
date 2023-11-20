import enquirer from "enquirer";
const { Select } = enquirer;

export class MemoModel {
  constructor(db) {
    this.db = db;
  }

  list = async () => {
    await this.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    );

    const headers = await this.headers();
    headers.forEach((header) => console.log(header));

    await this.close();
  };

  read = async () => {
    await this.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    );

    if (!(await this.rows()).length) {
      console.log("メモは1件もありません");
      await this.close();
      return;
    }

    const prompt = new Select({
      name: "value",
      message: "Choose a memo you want to see:",
      choices: await this.headers(),
    });

    const selectedContent = await this.findTargetMemo(prompt);
    console.log(selectedContent.content);

    await this.close();
  };

  delete = async () => {
    await this.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    );

    if (!(await this.rows()).length) {
      console.log("メモは1件もありません");
      await this.close();
      return;
    }

    const prompt = new Select({
      name: "value",
      message: "Choose a memo you want to delete:",
      choices: await this.headers(),
    });

    const selectedContent = await this.findTargetMemo(prompt);

    try {
      await this.run(
        "DELETE FROM memos WHERE content = (?)",
        selectedContent.content
      );
    } catch (err) {
      console.error(err.message);
    } finally {
      await this.close();
    }
  };

  create = async () => {
    await this.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    );

    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    await process.stdin.on("data", async (chunk) => {
      try {
        await this.run("INSERT INTO memos (content) VALUES (?)", chunk);
      } catch (err) {
        console.error(err.message);
      } finally {
        await this.close();
      }
    });
  };

  rows = async () => await this.all("SELECT content FROM memos");

  headers = async () =>
    (await this.rows()).map((row) => row.content.split("\n")[0]);

  findTargetMemo = async (prompt) => {
    const answer = await prompt.run();
    return (await this.rows()).find(
      (row) => row.content.split("\n")[0] === answer
    );
  };

  run = (sql, ...params) => {
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

  all = (sql, ...params) => {
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

  close = () => {
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
