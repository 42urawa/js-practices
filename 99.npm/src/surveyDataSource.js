import puppeteer from "puppeteer";

const majorBlockNoDigit = 5;
const majorPageType = "s1";
const minorPageType = "a1";
const majorPageTotalColumns = 21;
const minorPageTotalColumns = 18;
const labelDateIndex = 0;
const majorPageAverageTemperatureIndex = 6;
const majorPageHighestTemperatureIndex = 7;
const minorPageAverageTemperatureIndex = 4;
const minorPageHighestTemperatureIndex = 5;
const surveyDataStartIndex = 22;
const surveyDataEndIndex = -4;

export class SurveyDataSource {
  constructor(obj) {
    this.precNo = obj.precNo;
    this.blockNo = obj.blockNo;
    this.baseYear = obj.baseYear;
    this.targetYear = obj.targetYear;
    this.month = obj.month;
  }

  async read() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(this.url(this.baseYear));
    const basePageData = await page.$$eval("td", (elements) =>
      elements.map((e) => e.textContent),
    );

    await page.goto(this.url(this.targetYear));
    const targetPageData = await page.$$eval("td", (elements) =>
      elements.map((e) => e.textContent),
    );

    await browser.close();

    const baseFormattedData = this.formatData(basePageData);
    const targetFormattedData = this.formatData(targetPageData);

    // Includes leap year support
    const label = (
      baseFormattedData.length >= targetFormattedData.length
        ? baseFormattedData
        : targetFormattedData
    )
      .filter((_, i) => i % this.totalColumns() === labelDateIndex)
      .map((v) => v + "日");

    const collectTemperatures = (formattedData, index) =>
      formattedData
        .filter((_, i) => i % this.totalColumns() === index)
        // for irregular character
        .map((v) => parseFloat(v));

    const [
      baseAverageTemperatures,
      baseHighestTemperatures,
      targetAverageTemperatures,
      targetHighestTemperatures,
    ] = [
      collectTemperatures(baseFormattedData, this.averageTemperatureIndex()),
      collectTemperatures(baseFormattedData, this.highestTemperatureIndex()),
      collectTemperatures(targetFormattedData, this.averageTemperatureIndex()),
      collectTemperatures(targetFormattedData, this.highestTemperatureIndex()),
    ];

    return {
      label,
      baseAverageTemperatures,
      baseHighestTemperatures,
      targetAverageTemperatures,
      targetHighestTemperatures,
    };
  }

  url(year) {
    return `https://www.data.jma.go.jp/stats/etrn/view/daily_${this.pageType()}.php?prec_no=${
      this.precNo
    }&block_no=${this.blockNo}&year=${year}&month=${this.month}`;
  }

  formatData(pageData) {
    return pageData.slice(surveyDataStartIndex, surveyDataEndIndex);
  }

  pageType() {
    return this.blockNo.length === majorBlockNoDigit
      ? majorPageType
      : minorPageType;
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
