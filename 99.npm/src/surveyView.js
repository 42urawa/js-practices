export class SurveyView {
  constructor(obj) {
    this.city = obj.city;
    this.baseYear = obj.baseYear;
    this.targetYear = obj.targetYear;
    this.month = obj.month;
    this.label = obj.label;
    this.baseHighestTemperatures = obj.baseHighestTemperatures;
    this.baseAverageTemperatures = obj.baseAverageTemperatures;
    this.baseLowestTemperatures = obj.baseLowestTemperatures;
    this.targetHighestTemperatures = obj.targetHighestTemperatures;
    this.targetAverageTemperatures = obj.targetAverageTemperatures;
    this.targetLowestTemperatures = obj.targetLowestTemperatures;
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

    // return template;
    return {
      averageOfBaseHighestTemperatures,
      averageOfBaseAverageTemperatures,
      averageOfBaseLowestTemperatures,
      averageOfTargetHighestTemperatures,
      averageOfTargetAverageTemperatures,
      averageOfTargetLowestTemperatures,
    };
  }
}
