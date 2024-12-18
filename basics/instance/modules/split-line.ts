import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportSplitLineModule extends Module implements H3.ReportModules.SplitLine {
  title: string = "网格线";
  display: boolean = true;
  default: boolean = true;
  constructor(def?: H3.Analysis.SplitLineModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.splitLine === undefined) {
      chartStyles.splitLine = this.default;
    }
  }
}
