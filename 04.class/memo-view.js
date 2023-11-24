export class MemoView {
  constructor(showedData) {
    this.showedData = showedData;
  }

  show = () => {
    console.log(this.showedData);
  };
}
