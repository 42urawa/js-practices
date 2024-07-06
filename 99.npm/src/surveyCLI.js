import enquirer from "enquirer";
import puppeteer from "puppeteer";
import { cities } from "./cities.js";
import { months } from "./months.js";
import { SurveyDataSource } from "./surveyDataSource.js";

const { Select } = enquirer;
const minYear = 1976;

export class SurveyCLI {
  async execute() {
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

    const precNo = cities[prefecture][city].precNo;
    const blockNo = cities[prefecture][city].blockNo;

    const [baseSurveyDataSource, targetSurveyDataSource] = [
      new SurveyDataSource({
        precNo,
        blockNo,
        year: baseYear,
        month,
      }),
      new SurveyDataSource({
        precNo,
        blockNo,
        year: targetYear,
        month,
      }),
    ];

    // Since it is inefficient to have each surveyDataSource object do the scraping,
    // the SurveyCLI class is used to do it all together.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(baseSurveyDataSource.url());

    const basePageData = await page.$$eval("td", (elements) =>
      elements.map((e) => e.textContent),
    );

    await page.goto(targetSurveyDataSource.url());

    const targetPageData = await page.$$eval("td", (elements) =>
      elements.map((e) => e.textContent),
    );

    await browser.close();

    const totalColumns = baseSurveyDataSource.totalColumns();
    const dateIndex = 0;
    const averageTemperatureIndex =
      baseSurveyDataSource.averageTemperatureIndex();
    const highestTemperatureIndex =
      baseSurveyDataSource.highestTemperatureIndex();
    const baseFormattedData = SurveyDataSource.formatData(basePageData);
    const targetFormattedData = SurveyDataSource.formatData(targetPageData);

    // Includes leap year support
    const labels = (
      baseFormattedData.length >= targetFormattedData.length
        ? baseFormattedData
        : targetFormattedData
    )
      .filter((_, i) => i % totalColumns === dateIndex)
      .map((v) => v + "日");

    const collectTemperatures = (baseData, index) =>
      baseData
        .filter((_, i) => i % totalColumns === index)
        // for irregular character
        .map((v) => parseFloat(v));

    const [
      baseAverageTemperatures,
      baseHighestTemperatures,
      targetAverageTemperatures,
      targetHighestTemperatures,
    ] = [
      collectTemperatures(baseFormattedData, averageTemperatureIndex),
      collectTemperatures(baseFormattedData, highestTemperatureIndex),
      collectTemperatures(targetFormattedData, averageTemperatureIndex),
      collectTemperatures(targetFormattedData, highestTemperatureIndex),
    ];

    const [averageTemperatureData, highestTemperatureData] = [
      [baseAverageTemperatures, targetAverageTemperatures],
      [baseHighestTemperatures, targetHighestTemperatures],
    ];

    return {
      labels,
      averageTemperatureData,
      highestTemperatureData,
      city,
      baseYear,
      targetYear,
      month,
    };
  }
}
