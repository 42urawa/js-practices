import { runAsync, allAsync, closeAsync } from "./function_ok.js";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

runAsync(
  db,
  "CREATE table IF NOT EXISTS books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => runAsync(db, "INSERT INTO books(title) VALUES(?)", "mario"))
  .then((id) => {
    console.log(`id: ${id} が自動発番されました`);
  })
  .then(() => runAsync(db, "INSERT INTO books(title) VALUES(?)", "luige"))
  .then((id) => {
    console.log(`id: ${id} が自動発番されました`);
  })
  .then(() => allAsync(db, "SELECT * FROM books"))
  .then((rows) => {
    rows.forEach((row) => {
      console.log(`${row.id} ${row.title}`);
    });
  })
  .then(() => runAsync(db, "DROP TABLE IF EXISTS books"))
  .then(() => closeAsync(db));
