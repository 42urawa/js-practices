const sqlite3 = require("sqlite3");

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
      db.run("insert into books(title) values(?, ?)", "mario", 20, (err) => {
        if (err) console.error("マリオのデータを挿入できませんでした");
        resolve(db);
      });
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      db.run("insert into books(title) values(?)", "luige", () => resolve(db));
    });
  })
  .then((db) => {
    return new Promise((resolve) => {
      db.all("select * from games", (err, rows) => {
        if (err) {
          console.error("データの取得に失敗しました");
        } else {
          rows.forEach((row) => {
            console.log(`${row.id} ${row.title}`);
          });
        }
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
