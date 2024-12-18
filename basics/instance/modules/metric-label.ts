import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportMetricLabelModule extends Module implements H3.ReportModules.MetricLabel {
  title: string = "$r_language.modules.MetricLabel.title$";
  display: boolean = true;

  default: boolean = true;

  constructor(def?: H3.Analysis.MetricLabelModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.metricLabel === undefined) {
      chartStyles.metricLabel = this.default;
    }
  }
}
