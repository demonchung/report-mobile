import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportDataLabelModule extends Module implements H3.ReportModules.DataLabel {
  title: string = "显示数值";
  display: boolean = true;

  default: boolean = true;

  constructor(def?: H3.Analysis.DataLabelModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.dataLabel === undefined) {
      chartStyles.dataLabel = this.default;
    }
  }
}
