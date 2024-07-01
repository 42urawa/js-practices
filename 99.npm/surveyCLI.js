import enquirer from "enquirer";
import { cities } from "./cities.js";
import { months } from "./months.js";
import { SurveyPoint } from "./surveyPoint.js";

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

    return [baseSurveyPoint, targetSurveyPoint, city];
  }
}
