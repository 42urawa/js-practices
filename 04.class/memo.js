export class Memo {
  constructor(db) {
    this.db = db;
  }

  list = async () => {
    await this.createTable();

    const headers = await this.headers();

    return headers;
  };

  read = async (header) => {
    await this.createTable();

    const selectedMemo = await this.findTargetMemo(header);

    return selectedMemo.content;
  };

  delete = async (header) => {
    await this.createTable();

    const selectedMemo = await this.findTargetMemo(header);

    try {
      await this.run(
        "DELETE FROM memos WHERE content = (?)",
        selectedMemo.content
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  create = async (content) => {
    await this.createTable();

    await this.run("INSERT INTO memos (content) VALUES (?)", content);
  };

  createTable = async () => {
    await this.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    );
  };

  rows = async () => await this.all("SELECT content FROM memos");

  headers = async () =>
    (await this.rows()).map((row) => row.content.split("\n")[0]);

  findTargetMemo = async (header) =>
    (await this.rows()).find((row) => row.content.split("\n")[0] === header);

  run = (sql, ...params) =>
    new Promise((resolve, reject) => {
      this.db.run(sql, ...params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });

  all = (sql, ...params) =>
    new Promise((resolve, reject) => {
      this.db.all(sql, ...params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

  close = () =>
    new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
}
