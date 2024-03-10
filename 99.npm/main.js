import express from "express";
import open from "open";
import axios from "axios";
import https from "https";
import enquirer from "enquirer";
import { prefectures } from "./prefecture.js";
import { cities } from "./city.js";

const { Select } = enquirer;
const promptPrefecture = new Select({
  name: "value",
  message: "都道府県を選んでください。",
  choices: prefectures,
});

const prefecture = await promptPrefecture.run();

const promptCity = new Select({
  name: "value",
  message: "市町村を選んでください。",
  choices: Object.keys(cities[prefecture]),
});

const city = await promptCity.run();
const pointNumber = cities[prefecture][city];

let baseYears = ["本日"];
for (let year = new Date().getFullYear(); year >= 1976; year--) {
  baseYears.push(`${year} 年`);
}

const promptBaseYear = new Select({
  name: "value",
  message: "基準年を選んでください。",
  choices: baseYears,
});

let baseYear, month;
const answerBaseYear = await promptBaseYear.run();
if (answerBaseYear === "本日") {
  const today = new Date();
  baseYear = today.getFullYear();
  month = today.getMonth() + 1;
} else {
  baseYear = parseInt(answerBaseYear);

  const months = [
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
  const promptMonth = new Select({
    name: "value",
    message: "基準月を選んでください。",
    choices: months,
  });

  month = parseInt(await promptMonth.run());
}

const comparisonPeriods = [" 1 年前", " 5 年前", "10 年前", "30 年前"];
const promptComparisonPeriod = new Select({
  name: "value",
  message: "何年前の同月と比較しますか？",
  choices: comparisonPeriods,
});

const comparisonPeriod = parseInt(await promptComparisonPeriod.run());
const targetYear = Math.max(baseYear - comparisonPeriod, 1970);

const baseURL = `https://api.cultivationdata.net/past?no=${pointNumber}&year=${baseYear}&month=${month}`;
const targetURL = `https://api.cultivationdata.net/past?no=${pointNumber}&year=${targetYear}&month=${month}`;

const baseOptions = {
  method: "GET",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  url: baseURL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};
const targetOptions = {
  method: "GET",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  url: targetURL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};

const responses = await Promise.all([axios(baseOptions), axios(targetOptions)]);
const labels = Object.keys(responses[0].data[city]);

const data = responses.map((response) => {
  return Object.values(response.data[city]).map((obj) => obj["平均気温"]);
});

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
    <script>
      const text = "${city} の温暖化傾向（${comparisonPeriod}年前）";
      document.getElementById("title").textContent = text;
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ${JSON.stringify(labels)},
          datasets: [{
            label: '今',
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(255, 0, 0)',
            data: ${JSON.stringify(data[0])}, 
          },
          {
            label: '昔',
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 255)',
            data: ${JSON.stringify(data[1])}, 
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
