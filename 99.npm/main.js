import express from "express";
import open from "open";
import { SurveyCLI } from "./surveyCLI.js";

const main = async () => {
  const surveyCLI = new SurveyCLI();
  const {
    labels,
    averageTemperatureData,
    highestTemperatureData,
    city,
    baseYear,
    targetYear,
    month,
  } = await surveyCLI.execute();

  const calculateAverage = (temperatures) =>
    temperatures.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    ) / temperatures.length;

  const [
    averageOfBaseAverageTemperatures,
    averageOfTargetAverageTemperatures,
    averageOfBaseHighestTemperatures,
    averageOfTargetHighestTemperatures,
  ] = [
    calculateAverage(averageTemperatureData[0]),
    calculateAverage(averageTemperatureData[1]),
    calculateAverage(highestTemperatureData[0]),
    calculateAverage(highestTemperatureData[1]),
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
          const baseLabel = "${baseYear} 年 ${month} 月";
          const targetLabel = "${targetYear} 年 ${month} 月";
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
