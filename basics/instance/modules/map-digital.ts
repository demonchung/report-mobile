import Module from "./module";

export default class ReportMapDigitalModule extends Module
  implements H3.ReportModules.MapDigitalSet {
  title: string = "数值标签显示设置";
  display: boolean = true;
  default: H3.Report.MapDigitalSet = {
    displayDimension: true,
    displayMetric: false
  };

  constructor(def?: H3.Analysis.MapDigitalSetModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.mapDigitalSet === undefined) {
      chartStyles.mapDigitalSet = this.default;
    }
  }
}
