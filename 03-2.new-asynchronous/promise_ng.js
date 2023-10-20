import sqlite3 from "sqlite3";
import { runAsync, allAsync, closeAsync } from "./function.js";

const db = new sqlite3.Database(":memory:");

runAsync(
  db,
  "CREATE TABLE IF NOT EXISTS books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => runAsync(db, "INSERT INTO books(title) VALUES(?)", "mario", 20))
  .then((id) => {
    console.log(`id: ${id} が自動発番されました`);
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      throw err;
    }
  })
  .then(() => runAsync(db, "INSERT INTO books(title) VALUES(?)", "luige"))
  .then((id) => {
    console.log(`id: ${id} が自動発番されました`);
    return allAsync(db, "SELECT * FROM games");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(`${row.id} ${row.title}`);
    });
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      throw err;
    }
  })
  .then(() => runAsync(db, "DROP TABLE IF EXISTS books"))
  .then(() => closeAsync(db));
