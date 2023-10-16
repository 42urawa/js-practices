import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

const runAsync = (sql, ...params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, ...params, function (err) {
      if (err) {
        reject(err);
      } else {
        if (sql.startsWith("insert"))
          console.log(`id: ${this.lastID} が自動発番されました`);
        resolve(db);
      }
    });
  });
};

const allAsync = (sql, ...params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, ...params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows.forEach((row) => {
          console.log(`${row.id} ${row.title}`);
        });
        resolve(db);
      }
    });
  });
};

(async () => {
  try {
    await runAsync(
      "create table if not exists books(id integer primary key autoincrement, title text not null unique)"
    );
    await runAsync("insert into books(title) values(?)", "mario", 20);
  } catch (err) {
    console.error(err.message);
  }
  try {
    await runAsync("insert into books(title) values(?)", "luige");
    await allAsync("select * from games");
  } catch (err) {
    console.error(err.message);
  }
  await runAsync("drop table if exists books");
  db.close();
})();
