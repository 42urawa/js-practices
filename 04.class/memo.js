var argv = require("minimist")(process.argv.slice(2));
const { Select } = require("enquirer");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./memo.sqlite");

if (argv["l"]) {
  db.each("SELECT content FROM memos", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(`${row.content.split("\n")[0]}`);
  });
} else if (argv["r"]) {
  let memos = ["apple", "grape", "watermelon", "cherry", "orange"];
  db.all("SELECT content FROM memos", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    memos = row.map((content) => content["content"].split("\n")[0]);
  });
  const prompt = new Select({
    name: "memo",
    message: "Choose a note you want to see:",
    choices: memos,
  });

  prompt
    .run()
    .then((answer) => console.log("Answer:", answer))
    .catch(console.error);
} else if (argv["d"]) {
  console.log("Choose a note you want to delete:");
} else {
  db.all("SELECT content FROM memos", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row.map((content) => content["content"]));
  });
}

// const insertStmt = db.prepare("INSERT INTO memos (content) VALUES (?)");
//
// const multilineMessage = "Hello,\nThis is a multiline message.";
// insertStmt.run(multilineMessage);
//
// insertStmt.finalize();

db.close();
