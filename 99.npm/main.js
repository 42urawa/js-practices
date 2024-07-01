import express from "express";
import open from "open";
import puppeteer from "puppeteer";
import { SurveyCLI } from "./surveyCLI.js";

const surveyDataStartIndex = 22;
const surveyDataEndIndex = -4;

const main = async () => {
  const surveyCLI = new SurveyCLI();
  const [baseSurveyPoint, targetSurveyPoint, city] = await surveyCLI.execute();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(baseSurveyPoint.url());

  const baseData = (
    await page.$$eval("td", (elements) => elements.map((e) => e.textContent))
  ).slice(surveyDataStartIndex, surveyDataEndIndex);

  await page.goto(targetSurveyPoint.url());

  const targetData = (
    await page.$$eval("td", (elements) => elements.map((e) => e.textContent))
  ).slice(surveyDataStartIndex, surveyDataEndIndex);

  await browser.close();

  const totalColumns = baseSurveyPoint.totalColumns();
  const dateIndex = 0;
  const averageTemperatureIndex = baseSurveyPoint.averageTemperatureIndex();
  const highestTemperatureIndex = baseSurveyPoint.highestTemperatureIndex();

  // 閏年対応含む
  const labels = (baseData.length >= targetData.length ? baseData : targetData)
    .filter((_, i) => i % totalColumns === dateIndex)
    .map((v) => v + "日");

  const collectTemperatures = (baseData, index) =>
    baseData
      .filter((_, i) => i % totalColumns === index)
      // イレギュラー文字対策
      .map((v) => parseFloat(v));

  const baseAverageTemperatures = collectTemperatures(
    baseData,
    averageTemperatureIndex,
  );
  const baseHighestTemperatures = collectTemperatures(
    baseData,
    highestTemperatureIndex,
  );
  const targetAverageTemperatures = collectTemperatures(
    targetData,
    averageTemperatureIndex,
  );
  const targetHighestTemperatures = collectTemperatures(
    targetData,
    highestTemperatureIndex,
  );

  const averageTemperatureData = [
    baseAverageTemperatures,
    targetAverageTemperatures,
  ];

  const highestTemperatureData = [
    baseHighestTemperatures,
    targetHighestTemperatures,
  ];

  const calculateAverage = (temperatures) =>
    temperatures.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    ) / temperatures.length;

  const averageOfBaseAverageTemperatures = calculateAverage(
    baseAverageTemperatures,
  );
  const averageOfTargetAverageTemperatures = calculateAverage(
    targetAverageTemperatures,
  );
  const averageOfBaseHighestTemperatures = calculateAverage(
    baseHighestTemperatures,
  );
  const averageOfTargetHighestTemperatures = calculateAverage(
    targetHighestTemperatures,
  );

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
        <h2 id="average"></h2>
        <canvas id="myChart" width="300" height="100"></canvas>
        <h2 id="highest"></h2>
        <canvas id="myChart2" width="300" height="100"></canvas>
        <script>
          const titleText = "${city} の温暖化傾向（上：平均気温　下：最高気温）";
          const averageText = "平均気温の平均上昇値：${
            Math.round(
              (averageOfBaseAverageTemperatures -
                averageOfTargetAverageTemperatures) *
                10,
            ) / 10
          } ℃";
          const highestText = "最高気温の平均上昇値：${
            Math.round(
              (averageOfBaseHighestTemperatures -
                averageOfTargetHighestTemperatures) *
                10,
            ) / 10
          } ℃";
          const baseLabel = "${baseSurveyPoint.year} 年 ${
            baseSurveyPoint.month
          } 月";
          const targetLabel = "${targetSurveyPoint.year} 年 ${
            targetSurveyPoint.month
          } 月";
          document.getElementById("title").textContent = titleText;
          document.getElementById("average").textContent = averageText;
          document.getElementById("highest").textContent = highestText;
          var ctx = document.getElementById('myChart').getContext('2d');
          var myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: baseLabel,
                backgroundColor: 'rgb(0, 0, 0)',
                borderColor: 'rgb(255, 0, 0)',
                data: ${JSON.stringify(averageTemperatureData[0])},
              },
              {
                label: targetLabel,
                backgroundColor: 'rgb(0, 0, 0)',
                borderColor: 'rgb(0, 0, 255)',
                data: ${JSON.stringify(averageTemperatureData[1])},
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
                data: ${JSON.stringify(highestTemperatureData[0])},
              },
              {
                label: targetLabel,
                backgroundColor: 'rgb(0, 0, 0)',
                borderColor: 'rgb(0, 0, 255)',
                data: ${JSON.stringify(highestTemperatureData[1])},
              }]
            },
            options: {}
          });
        </script>
      </body>
      </html>
    `);
  });

  const server = app.listen(port, () => {
    console.log(`Server is runnnin on port ${port}`);
    console.log(`"This will exit in 10 seconds."`);
  });

  open(`http://localhost:${port}`);

  setTimeout(() => {
    server.close();
  }, 10000);
};

main();
