import sqlite3 from "sqlite3";

Promise.resolve(new sqlite3.Database(":memory:"))
  .then((db) => {
    return new Promise((resolve) => {
      db.run(
        "create table if not exists books(id integer primary key autoincrement, title text not null unique)",
        () => resolve(db)
      );
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      db.run("insert into books(title) values(?)", "mario", function () {
        resolve(db);
        console.log(`id: ${this.lastID} が自動発番されました`);
      });
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      db.run("insert into books(title) values(?)", "luige", function () {
        resolve(db);
        console.log(`id: ${this.lastID} が自動発番されました`);
      });
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      db.all("select * from books", (err, rows) => {
        rows.forEach((row) => {
          console.log(`${row.id} ${row.title}`);
        });
        resolve(db);
      });
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      db.run("drop table if exists books", () => resolve(db));
    });
  })
  .then((db) => {
    db.close();
  });
