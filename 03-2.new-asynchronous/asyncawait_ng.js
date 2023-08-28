import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

(async () => {
  await new Promise((resolve) => {
    db.run(
      "create table if not exists books(id integer primary key autoincrement, title text not null unique)",
      () => resolve(db)
    );
  });

  await new Promise((resolve) => {
    db.run("insert into books(title) values(?, ?)", "mario", 20, (err) => {
      if (err) console.error(err);
      resolve(db);
    });
  });

  await new Promise((resolve) => {
    db.run("insert into books(title) values(?)", "luige", () => resolve(db));
  });

  await new Promise((resolve) => {
    db.all("select * from games", (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        rows.forEach((row) => {
          console.log(`${row.id} ${row.title}`);
        });
      }
      resolve(db);
    });
  });

  await new Promise((resolve) => {
    db.run("drop table if exists books", () => resolve(db));
  });

  db.close();
})();