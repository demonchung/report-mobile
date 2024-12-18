import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportMetricValueModule extends Module implements H3.ReportModules.MetricValue {
  title: string = "$r_language.modules.MetricLabel.valueTitle$";
  display: boolean = true;

  default: boolean = true;

  constructor(def?: H3.Analysis.MetricValueModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.metricValue === undefined) {
      chartStyles.metricValue = this.default;
    }
  }
}
