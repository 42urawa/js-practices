import { fileURLToPath } from "url";
import path from "path";
import pug from "pug";

export class SurveyView {
  constructor(result) {
    this.city = result.city;
    this.baseYear = result.baseYear;
    this.targetYear = result.targetYear;
    this.month = result.month;
    this.label = result.label;
    this.baseHighestTemperatures = result.baseHighestTemperatures;
    this.baseAverageTemperatures = result.baseAverageTemperatures;
    this.baseLowestTemperatures = result.baseLowestTemperatures;
    this.targetHighestTemperatures = result.targetHighestTemperatures;
    this.targetAverageTemperatures = result.targetAverageTemperatures;
    this.targetLowestTemperatures = result.targetLowestTemperatures;
  }

  createTemplate() {
    const calculateAverage = (temperatures) =>
      temperatures.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      ) / temperatures.length;

    const [
      averageOfBaseHighestTemperatures,
      averageOfBaseAverageTemperatures,
      averageOfBaseLowestTemperatures,
      averageOfTargetHighestTemperatures,
      averageOfTargetAverageTemperatures,
      averageOfTargetLowestTemperatures,
    ] = [
      calculateAverage(this.baseHighestTemperatures),
      calculateAverage(this.baseAverageTemperatures),
      calculateAverage(this.baseLowestTemperatures),
      calculateAverage(this.targetHighestTemperatures),
      calculateAverage(this.targetAverageTemperatures),
      calculateAverage(this.targetLowestTemperatures),
    ];

    const filePath = fileURLToPath(import.meta.url);
    const fileDir = path.dirname(filePath);
    const templateFilePath = path.join(fileDir, "/views/index.pug");

    const compiledFunction = pug.compileFile(templateFilePath);
    const template = compiledFunction({
      city: this.city,
      baseYear: this.baseYear,
      targetYear: this.targetYear,
      month: this.month,
      label: this.label.join(","),
      baseHighestTemperatures: this.baseHighestTemperatures.join(","),
      baseAverageTemperatures: this.baseAverageTemperatures.join(","),
      baseLowestTemperatures: this.baseLowestTemperatures.join(","),
      targetHighestTemperatures: this.targetHighestTemperatures.join(","),
      targetAverageTemperatures: this.targetAverageTemperatures.join(","),
      targetLowestTemperatures: this.targetLowestTemperatures.join(","),
      averageOfBaseHighestTemperatures,
      averageOfBaseAverageTemperatures,
      averageOfBaseLowestTemperatures,
      averageOfTargetHighestTemperatures,
      averageOfTargetAverageTemperatures,
      averageOfTargetLowestTemperatures,
    });

    return template;
  }
}
