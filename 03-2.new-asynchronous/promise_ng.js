import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

const runAsync = (sql, ...params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, ...params, function (err) {
      if (err) console.error(err);
      if (sql.startsWith("insert"))
        console.log(`id: ${this.lastID} が自動発番されました`);
      resolve(db);
    });
  });
};

const allAsync = (sql, ...params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, ...params, (err, rows) => {
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
};

runAsync(
  "create table if not exists books(id integer primary key autoincrement, title text not null unique)"
)
  .then(() => {
    return runAsync("insert into books(title) values(?)", "mario", 20);
  })
  .then(() => {
    return runAsync("insert into books(title) values(?)", "luige");
  })
  .then(() => {
    return allAsync("select * from games");
  })
  .then(() => {
    return runAsync("drop table if exists books");
  })
  .then((db) => {
    return db.close();
  });
