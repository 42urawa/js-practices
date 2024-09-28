import { cities } from "./cities.js";
import { SurveyDataSource } from "./surveyDataSource.js";
import { SurveyView } from "./surveyView.js";

export class SurveyControlService {
  constructor(obj) {
    this.prefecture = obj.prefecture;
    this.city = obj.city;
    this.baseYear = obj.baseYear;
    this.targetYear = obj.targetYear;
    this.month = obj.month;
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
      baseAverageTemperatures,
      baseHighestTemperatures,
      targetAverageTemperatures,
      targetHighestTemperatures,
    } = await surveyDataSource.read();

    const surveyView = new SurveyView({
      label,
      baseAverageTemperatures,
      baseHighestTemperatures,
      targetAverageTemperatures,
      targetHighestTemperatures,
      city: this.city,
      baseYear: this.baseYear,
      targetYear: this.targetYear,
      month: this.month,
    });

    const template = surveyView.createTemplate();

    return template;
  }
}
