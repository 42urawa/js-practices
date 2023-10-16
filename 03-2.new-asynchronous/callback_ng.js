import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

db.run(
  "create table if not exists books(id integer primary key autoincrement, title text not null unique)",
  () => {
    db.run(
      "insert into books(title) values(?, ?)",
      "mario",
      20,
      function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`id: ${this.lastID} が自動発番されました`);
        }
        db.run("insert into books(title) values(?)", "luige", function () {
          console.log(`id: ${this.lastID} が自動発番されました`);
          db.all("select * from games", function (err, rows) {
            if (err) {
              console.error(err.message);
            } else {
              rows.forEach((row) => {
                console.log(`${row.id} ${row.title}`);
              });
            }
            db.run("drop table if exists books", () => {
              db.close();
            });
          });
        });
      }
    );
  }
);
