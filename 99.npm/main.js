import express from "express";
import open from "open";
import enquirer from "enquirer";
import puppeteer from "puppeteer";
import { prefectures } from "./prefectures.js";
import { cities } from "./cities.js";
import { months } from "./months.js";

const { Select } = enquirer;
const minYear = 1976;

const promptPrefecture = new Select({
  name: "value",
  message: "都道府県または地方を選んでください。",
  choices: prefectures,
});

const prefecture = await promptPrefecture.run();

const promptCity = new Select({
  name: "value",
  message: "市町村を選んでください。",
  choices: Object.keys(cities[prefecture]),
});

const city = await promptCity.run();
const precNo = cities[prefecture][city].precNo;
const blockNo = cities[prefecture][city].blockNo;

const baseYears = [];
for (let year = new Date().getFullYear(); year >= minYear + 1; year--) {
  baseYears.push(`${year} 年`);
}

const promptBaseYear = new Select({
  name: "value",
  message: "基準年を選んでください。",
  choices: baseYears,
});

const baseYearLabel = await promptBaseYear.run();
const baseYear = baseYearLabel.replace(/[^0-9]/g, "");

const targetYears = [];
for (let year = baseYear - 1; year >= minYear; year--) {
  targetYears.push(`${year} 年`);
}

const promptTargetYear = new Select({
  name: "value",
  message: "比較年を選んでください。",
  choices: targetYears,
});

const targetYearLabel = await promptTargetYear.run();
const targetYear = targetYearLabel.replace(/[^0-9]/g, "");

const promptMonth = new Select({
  name: "value",
  message: "基準月を選んでください。",
  choices: months,
});

const monthLabel = await promptMonth.run();
const month = monthLabel.replace(/[^0-9]/g, "").padStart(2, "0");

const browser = await puppeteer.launch();
const page = await browser.newPage();

const pageType = blockNo.length === 5 ? "s1" : "a1";
const columnNum = pageType === "s1" ? 21 : 18;
const averageTemperatureColumnIndex = pageType === "s1" ? 6 : 4;
const highestTemperatureColumnIndex = pageType === "s1" ? 7 : 5;

const baseURL = `https://www.data.jma.go.jp/stats/etrn/view/daily_${pageType}.php?prec_no=${precNo}&block_no=${blockNo}&year=${baseYear}&month=${month}`;
const targetURL = `https://www.data.jma.go.jp/stats/etrn/view/daily_${pageType}.php?prec_no=${precNo}&block_no=${blockNo}&year=${targetYear}&month=${month}`;

await page.goto(baseURL);

const baseData = (
  await page.$$eval("td", (list) => list.map((e) => e.textContent))
).slice(22, -4);

// console.log(baseData);

const labels = baseData
  .filter((v, i) => i % columnNum === 0)
  .map((v) => v + "日");

// console.log(labels);

const baseAverageTemperatures = baseData.filter(
  (v, i) => i % columnNum === averageTemperatureColumnIndex,
);

const baseHighestTemperatures = baseData.filter(
  (v, i) => i % columnNum === highestTemperatureColumnIndex,
);

// console.log(baseAverageTemperatures);

await page.goto(targetURL);

const targetData = (
  await page.$$eval("td", (list) => list.map((e) => e.textContent))
).slice(22, -4);

const targetAverageTemperatures = targetData.filter(
  (v, i) => i % columnNum === averageTemperatureColumnIndex,
);

const targetHighestTemperatures = targetData.filter(
  (v, i) => i % columnNum === highestTemperatureColumnIndex,
);

const averageTemperaturedata = [
  baseAverageTemperatures,
  targetAverageTemperatures,
];
const highestTemperaturedata = [
  baseHighestTemperatures,
  targetHighestTemperatures,
];

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>GlobalWarmingSurvey</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <h1 id="title"></h1>
    <canvas id="myChart" width="300" height="100"></canvas>
    <canvas id="myChart2" width="300" height="100"></canvas>
    <script>
      const text = "${city} の温暖化傾向（上：平均気温　下：最高気温）";
      const baseLabel = "${baseYearLabel + monthLabel}";
      const targetLabel = "${targetYearLabel + monthLabel}";
      document.getElementById("title").textContent = text;
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ${JSON.stringify(labels)},
          datasets: [{
            label: baseLabel,
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(255, 0, 0)',
            data: ${JSON.stringify(averageTemperaturedata[0])},
          },
          {
            label: targetLabel,
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 255)',
            data: ${JSON.stringify(averageTemperaturedata[1])},
          }]
        },
        options: {}
      });
      var ctx2 = document.getElementById('myChart2').getContext('2d');
      var myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: ${JSON.stringify(labels)},
          datasets: [{
            label: baseLabel,
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(255, 0, 0)',
            data: ${JSON.stringify(highestTemperaturedata[0])},
          },
          {
            label: targetLabel,
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 255)',
            data: ${JSON.stringify(highestTemperaturedata[1])},
          }]
        },
        options: {}
      });
    </script>
  </body>
  </html>

  `);
});

app.listen(port, () => {
  console.log(`Server is runnnin on port ${port}`);
});

open(`http://localhost:${port}`);
