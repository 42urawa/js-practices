import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE IF NOT EXISTS books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run(
      "INSERT INTO books(title) VALUES(?, ?)",
      "mario",
      20,
      function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`id: ${this.lastID} が自動発番されました`);
        }
        db.run("INSERT INTO books(title) VALUES(?)", "luige", function () {
          console.log(`id: ${this.lastID} が自動発番されました`);
          db.all("SELECT * FROM games", function (err, rows) {
            if (err) {
              console.error(err.message);
            } else {
              rows.forEach((row) => {
                console.log(`${row.id} ${row.title}`);
              });
            }
            db.run("DROP TABLE IF EXISTS books", () => {
              db.close();
            });
          });
        });
      }
    );
  }
);
