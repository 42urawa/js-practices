import axios from "axios";
import https from "https";
import enquirer from "enquirer";
import { prefectures } from "./prefecture.js";
import { cities } from "./city.js";
import { type } from "os";
const { Select } = enquirer;

const promptPrefecture = new Select({
  name: "value",
  message: "都道府県を選んでください。",
  choices: prefectures,
});

const prefecture = await promptPrefecture.run();
console.log(cities[prefecture]);

const promptCity = new Select({
  name: "value",
  message: "市町村を選んでください。",
  choices: Object.keys(cities[prefecture]),
});

const city = await promptCity.run();
console.log(city, cities[prefecture][city]);

let baseYears = ["今年"];
for (let year = 2023; year >= 1980; year--) {
  baseYears.push(`${year} 年`);
}

const promptBaseYear = new Select({
  name: "value",
  message: "基準年を選んでください。",
  choices: baseYears,
});

const baseYear = parseInt(
  await promptBaseYear.run(),
  // .replace(" 年", "").trim(),
);
console.log(baseYear, typeof baseYear);

const baseMonths = [
  " 1 月",
  " 2 月",
  " 3 月",
  " 4 月",
  " 5 月",
  " 6 月",
  " 7 月",
  " 8 月",
  " 9 月",
  "10 月",
  "11 月",
  "12 月",
];
const promptBaseMonth = new Select({
  name: "value",
  message: "基準月を選んでください。",
  choices: baseMonths,
});

const baseMonth = parseInt(
  await promptBaseMonth.run(),
  // .replace("月", "").trim(),
);
console.log(baseMonth, typeof baseMonth);

const comparisonPeriods = [" 1 年前", " 5 年前", "10 年前", "30 年前"];
const promptComparisonPeriod = new Select({
  name: "value",
  message: "何年前の同月と比較しますか？",
  choices: comparisonPeriods,
});

const comparisonPeriod = parseInt(
  await promptComparisonPeriod.run(),
  // .replace("年前", "").trim(),
);
console.log(comparisonPeriod, typeof comparisonPeriod);

const url = "https://api.cultivationdata.net/past?no=47598&year=2022&month=8";
const options = {
  method: "GET",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  url,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};

try {
  const res = await axios(options);
  console.log(res.data);
} catch (err) {
  console.error(err);
}
