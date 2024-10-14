import enquirer from "enquirer";
import { cities } from "./cities.js";
import { months } from "./months.js";
import { SurveyControlService } from "./surveyControlService.js";

const { Select } = enquirer;
const minYear = 1976;

export class SurveyCLI {
  async execute() {
    const promptPrefecture = new Select({
      name: "prefecture",
      message: "都道府県を選んでください。",
      choices: Object.keys(cities),
    });
    const prefecture = await promptPrefecture.run();

    const promptCity = new Select({
      name: "city",
      message: "市町村を選んでください。",
      choices: Object.keys(cities[prefecture]),
    });
    const city = await promptCity.run();

    const baseYears = [];
    for (let year = new Date().getFullYear(); year >= minYear + 1; year--) {
      baseYears.push({ message: `${year} 年`, name: year });
    }
    const promptBaseYear = new Select({
      name: "baseYear",
      message: "基準年を選んでください。",
      choices: baseYears,
    });
    const baseYear = await promptBaseYear.run();

    const targetYears = [];
    for (let year = baseYear - 1; year >= minYear; year--) {
      targetYears.push({ message: `${year} 年`, name: year });
    }
    const promptTargetYear = new Select({
      name: "targetYear",
      message: "比較年を選んでください。",
      choices: targetYears,
    });
    const targetYear = await promptTargetYear.run();

    const promptMonth = new Select({
      name: "month",
      message: "基準月を選んでください。",
      choices: months,
    });
    const month = await promptMonth.run();

    const surveyControlService = new SurveyControlService({
      prefecture,
      city,
      baseYear,
      targetYear,
      month,
    });

    const template = await surveyControlService.fetchData();
    return template;
  }
}
