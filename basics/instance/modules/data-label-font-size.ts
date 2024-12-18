import Module from "./module";

/**
 * 标签文字大小模块
 */
export default class ReportDataLabelFontSizeModule extends Module
  implements H3.ReportModules.DataLabelFontSize {
  title: string = "标签字号";
  display: boolean = true;
  sizeList: Array<number> = [6,8,10,12,14,16,18,20,22,24];
  default: H3.Report.DataLabelFontSize = {
    size: 12
  };

  constructor(def?: H3.Analysis.DataLabelFontSizeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    if (chart.styles && !chart.styles.dataLabelFontSize) {
      chart.styles.dataLabelFontSize = this.default;
    }
  }
}
