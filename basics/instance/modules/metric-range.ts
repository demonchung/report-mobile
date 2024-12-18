import Module from "./module";
/**
 * 指标范围实例
 */
export default class ReportMetricRangeModule extends Module
  implements H3.ReportModules.MetricRange {
  title: string = "自定义指标范围";
  display: boolean = true;

  default: H3.Report.MetricRange = {
    max: null,
    min: null
  };

  constructor(def?: H3.Analysis.MetricRangeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  /**
   * 处理图表数据
   * @param chart
   */
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && !chartStyles.metricRange) {
      chartStyles.metricRange = this.default;
    }
  }
}
