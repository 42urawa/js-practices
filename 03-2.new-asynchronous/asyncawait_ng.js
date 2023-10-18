import { runAsync, allAsync, closeAsync } from "./function_ng.js";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

(async () => {
  try {
    await runAsync(
      db,
      "CREATE table IF NOT EXISTS books(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
    );
    const marioId = await runAsync(
      db,
      "INSERT INTO books(title) VALUES(?)",
      "mario",
      20
    );
    console.log(`id: ${marioId} が自動発番されました`);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      throw err;
    }
  }
  try {
    const luigeId = await runAsync(
      db,
      "INSERT INTO books(title) VALUES(?)",
      "luige"
    );
    console.log(`id: ${luigeId} が自動発番されました`);
    const rows = await allAsync(db, "SELECT * FROM games");
    rows.forEach((row) => {
      console.log(`${row.id} ${row.title}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      throw err;
    }
  }
  await runAsync(db, "DROP TABLE IF EXISTS books");
  await closeAsync(db);
})();
