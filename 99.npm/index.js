import puppeteer from "puppeteer";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url1 =
    "https://www.data.jma.go.jp/gmd/cpd/monitor/dailyview/graph_mkhtml_d.php?&n=47662&p=91&s=3&r=2&y=2018&m=6&d=30&e=0&k=0";
  const url2 =
    "https://www.data.jma.go.jp/gmd/cpd/monitor/dailyview/graph_mkhtml_d.php?&n=47662&p=91&s=3&r=2&y=2017&m=6&d=30&e=0&k=0";

  await page.goto(url1);

  const dates = (
    await page.$$eval("th", (list) =>
      list.map((e) => e.textContent.trim().replace(/\d{4}年/i, "")),
    )
  ).slice(6);

  const data1 = (
    await page.$$eval("td", (list) => list.map((e) => e.textContent))
  ).slice(4);

  const averageTemperatures1 = data1.filter((v, i) => i % 4 === 0);
  const highestTemperatures1 = data1.filter((v, i) => i % 4 === 1);

  await page.goto(url2);

  const data2 = (
    await page.$$eval("td", (list) => list.map((e) => e.textContent))
  ).slice(4);

  const averageTemperatures2 = data2.filter((v, i) => i % 4 === 0);
  const highestTemperatures2 = data2.filter((v, i) => i % 4 === 1);

  console.log(dates);
  console.log(averageTemperatures1);
  console.log(highestTemperatures1);
  console.log(averageTemperatures2);
  console.log(highestTemperatures2);

  await browser.close();
};

main();
