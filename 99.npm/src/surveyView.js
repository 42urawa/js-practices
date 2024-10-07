export class SurveyView {
  constructor(obj) {
    this.label = obj.label;
    this.baseAverageTemperatures = obj.baseAverageTemperatures;
    this.baseHighestTemperatures = obj.baseHighestTemperatures;
    this.targetAverageTemperatures = obj.targetAverageTemperatures;
    this.targetHighestTemperatures = obj.targetHighestTemperatures;
    this.city = obj.city;
    this.baseYear = obj.baseYear;
    this.targetYear = obj.targetYear;
    this.month = obj.month;
  }

  createTemplate() {
    const calculateAverage = (temperatures) =>
      temperatures.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      ) / temperatures.length;

    const [
      averageOfBaseAverageTemperatures,
      averageOfBaseHighestTemperatures,
      averageOfTargetAverageTemperatures,
      averageOfTargetHighestTemperatures,
    ] = [
      calculateAverage(this.baseAverageTemperatures),
      calculateAverage(this.baseHighestTemperatures),
      calculateAverage(this.targetAverageTemperatures),
      calculateAverage(this.targetHighestTemperatures),
    ];

    // const template = `
    //   <html>
    //   <head>
    //     <title>GlobalWarmingSurvey</title>
    //     <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    //   </head>
    //   <body>
    //     <h1 id="title"></h1>
    //     <h2 id="average"></h2>
    //     <canvas id="averageTemperatureChart" width="300" height="100"></canvas>
    //     <h2 id="highest"></h2>
    //     <canvas id="highestTemperatureChart" width="300" height="100"></canvas>
    //     <script>
    //       const titleText = "${
    //         this.city
    //       } の温暖化傾向（上：平均気温  下：最高気温）";
    //       const averageText = "平均気温の平均上昇値：${
    //         Math.round(
    //           (averageOfBaseAverageTemperatures -
    //             averageOfTargetAverageTemperatures) *
    //             10,
    //         ) / 10 || "-"
    //       } ℃";
    //       const highestText = "最高気温の平均上昇値：${
    //         Math.round(
    //           (averageOfBaseHighestTemperatures -
    //             averageOfTargetHighestTemperatures) *
    //             10,
    //         ) / 10 || "-"
    //       } ℃";
    //       const baseLabel = "${this.baseYear} 年 ${this.month} 月";
    //       const targetLabel = "${this.targetYear} 年 ${this.month} 月";
    //       document.getElementById("title").textContent = titleText;
    //       document.getElementById("average").textContent = averageText;
    //       document.getElementById("highest").textContent = highestText;
    //       const averageTemperatureCtx = document.getElementById('averageTemperatureChart').getContext('2d');
    //       const averageTemperatureChart = new Chart(averageTemperatureCtx, {
    //         type: 'line',
    //         data: {
    //           labels: ${JSON.stringify(this.label)},
    //           datasets: [{
    //             label: baseLabel,
    //             backgroundColor: 'rgb(0, 0, 0)',
    //             borderColor: 'rgb(255, 0, 0)',
    //             data: ${JSON.stringify(this.baseAverageTemperatures)},
    //           },
    //           {
    //             label: targetLabel,
    //             backgroundColor: 'rgb(0, 0, 0)',
    //             borderColor: 'rgb(0, 0, 255)',
    //             data: ${JSON.stringify(this.targetAverageTemperatures)},
    //           }]
    //         },
    //         options: {}
    //       });
    //       const highestTemperatureCtx = document.getElementById('highestTemperatureChart').getContext('2d');
    //       const highestTemperatureChart = new Chart(highestTemperatureCtx, {
    //         type: 'line',
    //         data: {
    //           labels: ${JSON.stringify(this.label)},
    //           datasets: [{
    //             label: baseLabel,
    //             backgroundColor: 'rgb(0, 0, 0)',
    //             borderColor: 'rgb(255, 0, 0)',
    //             data: ${JSON.stringify(this.baseHighestTemperatures)},
    //           },
    //           {
    //             label: targetLabel,
    //             backgroundColor: 'rgb(0, 0, 0)',
    //             borderColor: 'rgb(0, 0, 255)',
    //             data: ${JSON.stringify(this.targetHighestTemperatures)},
    //           }]
    //         },
    //         options: {}
    //       });
    //     </script>
    //   </body>
    //   </html>
    // `;

    // return template;
    return {
      averageOfBaseAverageTemperatures,
      averageOfTargetAverageTemperatures,
      averageOfBaseHighestTemperatures,
      averageOfTargetHighestTemperatures,
    };
  }
}
