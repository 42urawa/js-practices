import { cities } from "./cities.js";
import { SurveyDataSource } from "./surveyDataSource.js";
import { SurveyView } from "./surveyView.js";

export class SurveyControlService {
  constructor(answer) {
    this.prefecture = answer.prefecture;
    this.city = answer.city;
    this.baseYear = answer.baseYear;
    this.targetYear = answer.targetYear;
    this.month = answer.month;
  }

  async fetchData() {
    const precNo = cities[this.prefecture][this.city].precNo;
    const blockNo = cities[this.prefecture][this.city].blockNo;

    const surveyDataSource = new SurveyDataSource({
      precNo,
      blockNo,
      baseYear: this.baseYear,
      targetYear: this.targetYear,
      month: this.month,
    });

    const {
      label,
      baseHighestTemperatures,
      baseAverageTemperatures,
      baseLowestTemperatures,
      targetHighestTemperatures,
      targetAverageTemperatures,
      targetLowestTemperatures,
    } = await surveyDataSource.read();

    const surveyView = new SurveyView({
      city: this.city,
      baseYear: this.baseYear,
      targetYear: this.targetYear,
      month: this.month,
      label,
      baseHighestTemperatures,
      baseAverageTemperatures,
      baseLowestTemperatures,
      targetHighestTemperatures,
      targetAverageTemperatures,
      targetLowestTemperatures,
    });

    const template = surveyView.createTemplate();
    return template;
  }
}
