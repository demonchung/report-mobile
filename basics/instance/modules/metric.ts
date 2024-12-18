import FieldMapping from "./field-mapping";
import reportOptions from "@h3/report-mobile/dist/options";

/**
 * 指标实例
 */
export default class ReportMetricModule extends FieldMapping implements H3.ReportModules.Metric {
  title = "$r_language.design.DF_title.metric$";
  display = true;
  max = 0;
  default: Array<H3.Report.FieldColumn> = [];
  constructor(def?: H3.Analysis.MetricModule) {
    super();
    this.supportedTypes = reportOptions.charts.metric.supportedTypes;
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
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData) {
      if (!chartData.metric) {
        chartData.metric = this.default;
      } else {
        if (this.max && chartData.metric) {
          if (chartData.metric.length > this.max) {
            chartData.metric = chartData.metric.slice(0, this.max);
          }
          chartData.metric = chartData.metric.filter((field: H3.Report.FieldColumn) =>
            // this.supportedTypes.includes(field.type)
            field.specialType
            ? this.supportedTypes.includes(field.specialType)
            : this.supportedTypes.includes(field.type)
          );
        }
      } 
    }
  }
}
