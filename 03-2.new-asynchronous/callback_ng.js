const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(":memory:");

db.run(
  "create table if not exists books(id integer primary key autoincrement, title text not null unique)",
  (err) => {
    db.run("insert into books(title) values(?, ?)", "mario", 20, (err) => {
      if (err) console.error("マリオのデータを挿入できませんでした");
      db.run("insert into books(title) values(?)", "luige", (err) => {
        db.all("select * from games", (err, rows) => {
          if (err) {
            console.error("データの取得に失敗しました");
          } else {
            rows.forEach((row) => {
              console.log(`${row.id} ${row.title}`);
            });
          }
          db.run("drop table if exists books", (err) => {
            if (err) console.error(err);
            db.close();
          });
        });
      });
    });
  }
);
