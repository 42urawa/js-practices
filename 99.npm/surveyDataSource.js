const majorBlockNoDigit = 5;
const majorPageType = "s1";
const minorPageType = "a1";
const majorPageTotalColumns = 21;
const minorPageTotalColumns = 18;
const majorPageAverageTemperatureIndex = 6;
const minorPageAverageTemperatureIndex = 4;
const majorPageHighestTemperatureIndex = 7;
const minorPageHighestTemperatureIndex = 5;
const surveyDataStartIndex = 22;
const surveyDataEndIndex = -4;

export class SurveyDataSource {
  constructor(obj) {
    this.precNo = obj.precNo;
    this.blockNo = obj.blockNo;
    this.year = obj.year;
    this.month = obj.month;
  }

  static formatData(data) {
    return data.slice(surveyDataStartIndex, surveyDataEndIndex);
  }

  pageType() {
    return this.blockNo.length === majorBlockNoDigit
      ? majorPageType
      : minorPageType;
  }

  url() {
    return `https://www.data.jma.go.jp/stats/etrn/view/daily_${this.pageType()}.php?prec_no=${
      this.precNo
    }&block_no=${this.blockNo}&year=${this.year}&month=${this.month}`;
  }

  totalColumns() {
    return this.blockNo.length === majorBlockNoDigit
      ? majorPageTotalColumns
      : minorPageTotalColumns;
  }

  averageTemperatureIndex() {
    return this.blockNo.length === majorBlockNoDigit
      ? majorPageAverageTemperatureIndex
      : minorPageAverageTemperatureIndex;
  }

  highestTemperatureIndex() {
    return this.blockNo.length === majorBlockNoDigit
      ? majorPageHighestTemperatureIndex
      : minorPageHighestTemperatureIndex;
  }
}
