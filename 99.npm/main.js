import express from "express";
import open from "open";
import enquirer from "enquirer";
import puppeteer from "puppeteer";
import { cities } from "./cities.js";
import { months } from "./months.js";
import { SurveyPoint } from "./surveyPoint.js";

const { Select } = enquirer;
const minYear = 1976;
const surveyDataStartIndex = 22;
const surveyDataEndIndex = -4;

const main = async () => {
  const promptPrefecture = new Select({
    name: "value",
    message: "都道府県または地方を選んでください。",
    choices: Object.keys(cities),
  });

  const prefecture = await promptPrefecture.run();

  const promptCity = new Select({
    name: "value",
    message: "市町村を選んでください。",
    choices: Object.keys(cities[prefecture]),
  });

  const city = await promptCity.run();
  const baseYears = [];
  for (let year = new Date().getFullYear(); year >= minYear + 1; year--) {
    baseYears.push(`${year} 年`);
  }

  const promptBaseYear = new Select({
    name: "value",
    message: "基準年を選んでください。",
    choices: baseYears,
  });

  const baseYear = (await promptBaseYear.run()).replace(/[^0-9]/g, "");

  const targetYears = [];
  for (let year = baseYear - 1; year >= minYear; year--) {
    targetYears.push(`${year} 年`);
  }

  const promptTargetYear = new Select({
    name: "value",
    message: "比較年を選んでください。",
    choices: targetYears,
  });

  const targetYear = (await promptTargetYear.run()).replace(/[^0-9]/g, "");

  const promptMonth = new Select({
    name: "value",
    message: "基準月を選んでください。",
    choices: months,
  });

  const month = (await promptMonth.run()).replace(/[^0-9]/g, "");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const precNo = cities[prefecture][city].precNo;
  const blockNo = cities[prefecture][city].blockNo;

  const baseSurveyPoint = new SurveyPoint({
    precNo,
    blockNo,
    year: baseYear,
    month,
  });
  const targetSurveyPoint = new SurveyPoint({
    precNo,
    blockNo,
    year: targetYear,
    month,
  });

  await page.goto(baseSurveyPoint.url());

  const baseData = (
    await page.$$eval("td", (elements) => elements.map((e) => e.textContent))
  ).slice(surveyDataStartIndex, surveyDataEndIndex);

  const totalColumns = baseSurveyPoint.totalColumns();
  const dateIndex = 0;
  const averageTemperatureIndex = baseSurveyPoint.averageTemperatureIndex();
  const highestTemperatureIndex = baseSurveyPoint.highestTemperatureIndex();

  const labels = baseData
    .filter((_, i) => i % totalColumns === dateIndex)
    .map((v) => v + "日");

  const baseAverageTemperatures = baseData.filter(
    (_, i) => i % totalColumns === averageTemperatureIndex,
  );

  const baseHighestTemperatures = baseData.filter(
    (_, i) => i % totalColumns === highestTemperatureIndex,
  );

  await page.goto(targetSurveyPoint.url());

  const targetData = (
    await page.$$eval("td", (elements) => elements.map((e) => e.textContent))
  ).slice(surveyDataStartIndex, surveyDataEndIndex);

  await browser.close();

  const targetAverageTemperatures = targetData.filter(
    (_, i) => i % totalColumns === averageTemperatureIndex,
  );

  const targetHighestTemperatures = targetData.filter(
    (_, i) => i % totalColumns === highestTemperatureIndex,
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

  app.get("/", (_, res) => {
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
          const baseLabel = "${baseYear} 年 ${month} 月";
          const targetLabel = "${targetYear} 年 ${month} 月";
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
};

main();
