var argv = require("minimist")(process.argv.slice(2));

const now = new Date();
const year = argv["y"] || now.getFullYear();
const month = argv["m"] || now.getMonth() + 1;

const headerText = `      ${month}月 ${year}\n日 月 火 水 木 金 土\n`;

let currentDate = 1;
const spaceToTheLeftOfFirstDay = " ".repeat(
  new Date(year, month - 1, currentDate).getDay() * 3
);

const lastDate = new Date(year, month, 0).getDate();
let calendarText = "";

while (currentDate <= lastDate) {
  calendarText += currentDate.toString().padStart(2, " ") + " ";
  if (new Date(year, month - 1, currentDate).getDay() === 6) {
    calendarText += "\n";
  }
  currentDate++;
}

console.log(headerText + spaceToTheLeftOfFirstDay + calendarText);
