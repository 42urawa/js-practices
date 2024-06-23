import puppeteer from "puppeteer";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url1 =
    "https://www.data.jma.go.jp/stats/etrn/view/daily_s1.php?prec_no=44&block_no=47662&year=2021&month=08";
  // const url1 =
  //   "https://zenn.dev/nobokko/articles/idea_jma_prec_no_and_block_no";
  // const url2 =
  //   "https://www.data.jma.go.jp/gmd/cpd/monitor/dailyview/graph_mkhtml_d.php?&n=47662&p=91&s=3&r=2&y=2017&m=6&d=30&e=0&k=0";

  await page.goto(url1);

  // const dates = (
  //   await page.$$eval("th", (list) => list.map((e) => e.textContent))
  // ).slice(0);

  const data1 = (
    await page.$$eval("td", (list) => list.map((e) => e.textContent))
  ).slice(22, -4);
  // .slice(22);
  // console.log(data1);

  const averageTemperatures1 = data1.filter((v, i) => i % 21 === 6);
  console.log(averageTemperatures1);

  // const data1 = (
  //   await page.$$eval("td", (list) => list.map((e) => e.textContent))
  // ).slice(183);

  // const precNos = data1.filter((v, i) => i % 3 === 0);
  // const blockNos = data1.filter((v, i) => i % 3 === 1);
  // const names = data1.filter((v, i) => i % 3 === 2);

  // console.log(names.length);
  // for (let i = 0; i < 1794; i++) {
  //   console.log(
  //     `${names[i]}:{precNo: ${precNos[i]}, blockNo: "${blockNos[i]}",},`,
  //   );
  // }

  // await page.goto(url2);

  // const data2 = (
  //   await page.$$eval("td", (list) => list.map((e) => e.textContent))
  // ).slice(4);

  // const averageTemperatures2 = data2.filter((v, i) => i % 4 === 0);
  // const highestTemperatures2 = data2.filter((v, i) => i % 4 === 1);

  // console.log(dates);
  // console.log(highestTemperatures1);
  // console.log(averageTemperatures2);
  // console.log(highestTemperatures2);

  await browser.close();
};

main();
