const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(":memory:");

db.run(
  "create table if not exists books(id integer primary key autoincrement, title text not null unique)",
  (err) => {
    db.run("insert into books(title) values(?)", "mario", () => {
      db.run("insert into books(title) values(?)", "luige", () => {
        db.all("select * from books", (err, rows) => {
          rows.forEach((row) => {
            console.log(`${row.id} ${row.title}`);
          });
          db.run("drop table if exists books", () => {
            db.close();
          });
        });
      });
    });
  }
);
