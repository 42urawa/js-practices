import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

const runAsync = (sql, callback, ...params) => {
  db.run(sql, ...params, callback);
};

const allAsync = (sql, callback, ...params) => {
  db.all(sql, ...params, callback);
};

new Promise((resolve) => {
  runAsync(
    "create table if not exists books(id integer primary key autoincrement, title text not null unique)",
    () => resolve(db)
  );
})
  .then((db) => {
    return new Promise((resolve) => {
      runAsync(
        "insert into books(title) values(?)",
        function () {
          resolve(db);
          console.log(`id: ${this.lastID} が自動発番されました`);
        },
        "mario"
      );
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      runAsync(
        "insert into books(title) values(?)",
        function () {
          resolve(db);
          console.log(`id: ${this.lastID} が自動発番されました`);
        },
        "luige"
      );
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      allAsync("select * from books", (err, rows) => {
        rows.forEach((row) => {
          console.log(`${row.id} ${row.title}`);
        });
        resolve(db);
      });
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      runAsync("drop table if exists books", () => resolve(db));
    });
  })
  .then((db) => {
    db.close();
  });
