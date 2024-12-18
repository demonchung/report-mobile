import Module from "./module";

export default class ReportProgressModule extends Module implements H3.ReportModules.ProgressLabel {
  display: boolean = true;
  title: string = "标签";

  default: H3.Report.ProgressLabel = {
    displayValue: true,
    displayPercent: true,
    displayTarget: true
  };

  displayValue: boolean = true;
  displayPercent: boolean = true;
  displayTarget: boolean = true;

  constructor(def?: H3.Analysis.ProgressModule) {
    super();
    if (def) {
      Object.keys(def).forEach(k => {
        this[k] = def[k];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartStyleGroup = chart.styles;
    if (chartData && chartData.progressLabel === undefined) {
      chartData.progressLabel = this.default;
    }
  }
}
