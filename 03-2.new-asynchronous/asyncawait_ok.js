const sqlite3 = require("sqlite3");

(async () => {
  const db = new sqlite3.Database(":memory:");

  await new Promise((resolve) => {
    db.run(
      "create table if not exists books(id integer primary key autoincrement, title text not null unique)",
      () => resolve(db)
    );
  });

  await new Promise((resolve) => {
    db.run("insert into books(title) values(?)", "mario", () => resolve(db));
  });

  await new Promise((resolve) => {
    db.run("insert into books(title) values(?)", "luige", () => resolve(db));
  });

  await new Promise((resolve) => {
    db.all("select * from books", (err, rows) => {
      rows.forEach((row) => {
        console.log(`${row.id} ${row.title}`);
      });
      resolve(db);
    });
  });

  await new Promise((resolve) => {
    db.run("drop table if exists books", () => resolve(db));
  });

  db.close();
})();
