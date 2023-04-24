var argv = require("minimist")(process.argv.slice(2));

const now = new Date();
const year = argv["y"] || now.getFullYear();
const month = argv["m"] || now.getMonth() + 1; // 0-11につきadd 1

// yearとmonthはnumber型
console.log([year, month]);
const headerText = `      ${month}月 ${year}\n日 月 火 水 木 金 土\n`;

let currentDay = new Date(year, month - 1, 1);
const spaceToTheLeftOfFirstDay = " ".repeat(currentDay.getDay() * 3);
console.log(headerText + spaceToTheLeftOfFirstDay);

const lastDay = new Date(year, month, 0);
// let calendarText = '';
let currentDate = 1;

// console.log(currentDate.toString());
while (currentDate <= lastDay.getDate()) {
  console.log(currentDate.toString().padStart(3, " "));
  currentDay.setDate(currentDate);
  if (currentDay.getDay() === 6) {
    console.log("\n");
  }
  currentDate++;
}
// console.log(firstDay.getDay().toString().padStart(3, " "));
// console.log(firstDay.getDay());

/*
■どこから書き始めるか？
⇒1日の曜日を取得
・日ならスペース0で配置、月ならスペース3で配置⇒repeat(曜日*3)でOK
■土曜で改行
・ループ毎に曜日をチェックするロジックで対応
■○から△まで、でループさせる
・△は次の月の0日でオブジェクトを取得


*/
