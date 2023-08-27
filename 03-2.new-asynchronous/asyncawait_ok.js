import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

const runAsync = (sql, ...params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, ...params, function (err) {
      if (sql.startsWith("insert"))
        console.log(`id: ${this.lastID} が自動発番されました`);
      resolve(db);
    });
  });
};

const allAsync = (sql, ...params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, ...params, (err, rows) => {
      rows.forEach((row) => {
        console.log(`${row.id} ${row.title}`);
      });
      resolve(db);
    });
  });
};

(async () => {
  await runAsync(
    "create table if not exists books(id integer primary key autoincrement, title text not null unique)"
  );
  await runAsync("insert into books(title) values(?)", "mario");
  await runAsync("insert into books(title) values(?)", "luige");
  await allAsync("select * from books");
  await runAsync("drop table if exists books");
  db.close();
})();
