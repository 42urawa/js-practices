import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE table IF NOT EXISTS books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books(title) VALUES(?)", "mario", function () {
      console.log(`id: ${this.lastID} が自動発番されました`);
      db.run("INSERT INTO books(title) VALUES(?)", "luige", function () {
        console.log(`id: ${this.lastID} が自動発番されました`);
        db.all("SELECT * FROM books", (_, rows) => {
          rows.forEach((row) => {
            console.log(`${row.id} ${row.title}`);
          });
          db.run("DROP TABLE IF EXISTS books", () => {
            db.close();
          });
        });
      });
    });
  }
);
