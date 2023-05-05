const argv = require("minimist")(process.argv.slice(2));
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
  db.close();
} else if (argv["r"]) {
  db.all("SELECT content FROM memos", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    row.map(
      (contentObject) =>
        (contentObject["name"] = contentObject["content"].split("\n")[0])
    );

    const prompt = new Select({
      name: "value",
      message: "Choose a note you want to see:",
      choices: row,
    });

    prompt
      .run()
      .then((answer) => {
        const selectedContent = row.find((choice) => choice.name === answer);
        console.log(selectedContent.content);
      })
      .catch(console.error);
    db.close();
  });
  // } else if (true) {
} else if (argv["d"]) {
  db.all("SELECT content FROM memos", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    row.map(
      (contentObject) =>
        (contentObject["name"] = contentObject["content"].split("\n")[0])
    );

    const prompt = new Select({
      name: "value",
      message: "Choose a note you want to delete:",
      choices: row,
    });

    prompt
      .run()
      .then((answer) => {
        const selectedContent = row.find((choice) => choice.name === answer);
        db.run(
          "delete from memos where content = (?)",
          selectedContent.content,
          (err) => {
            if (err) {
              console.error(err.message);
            }
            db.close();
          }
        );
      })
      .catch(console.error);
  });
} else {
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  // stdinがなんか読み込んだ時に呼ばれる.
  process.stdin.on("data", function (chunk) {
    //実際のchunkは予期せぬ位置で細切れに入ってくる.
    db.run("insert into memos values (?)", chunk);
    db.close();
  });
}
