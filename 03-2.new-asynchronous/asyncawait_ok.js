import { runAsync, allAsync, closeAsync } from "./function_ok.js";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

(async () => {
  await runAsync(
    db,
    "CREATE table IF NOT EXISTS books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
  );
  const marioId = await runAsync(
    db,
    "INSERT INTO books(title) VALUES(?)",
    "mario"
  );
  console.log(`id: ${marioId} が自動発番されました`);

  const luigeId = await runAsync(
    db,
    "INSERT INTO books(title) VALUES(?)",
    "luige"
  );
  console.log(`id: ${luigeId} が自動発番されました`);

  const rows = await allAsync(db, "SELECT * FROM books");
  rows.forEach((row) => {
    console.log(`${row.id} ${row.title}`);
  });

  await runAsync(db, "DROP TABLE IF EXISTS books");
  await closeAsync(db);
})();
