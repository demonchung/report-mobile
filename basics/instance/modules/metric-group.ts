import FieldMapping from "./field-mapping";

/**
 * 多组指标实例
 */
export default class ReportMetricGroupModule extends FieldMapping
  implements H3.ReportModules.MetricGroup {
  title = "";
  display = true;
  max = 2;
  data: Array<H3.ReportModules.Metric> = [
    {
      canRepeat: true,
      title: "$r_language.design.DF_title.metric_left$",
      max: 20,
      min: 1,
      supportedTypes: ["string", "date", "number", "address"],
      display: true
    },
    {
      canRepeat: true,
      title: "$r_language.design.DF_title.metric_right$",
      max: 20,
      min: 1,
      supportedTypes: ["string", "date", "number", "address"],
      display: true
    }
  ];
  default: Array<Array<H3.Report.FieldColumn>> = [[], []];

  constructor(def?: H3.Analysis.MetricGroupModule) {
    super();
    // 改变默认值
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
      if (!chartData.metricGroup) {
        chartData.metricGroup = this.default;
      } else {
        if (this.max && chartData.metricGroup) {
          if (chartData.metricGroup.length > this.max) {
            chartData.metricGroup = chartData.metricGroup.slice(0, this.max);
          }
          chartData.metricGroup = chartData.metricGroup.map(metric => {
            return metric.filter((field: H3.Report.FieldColumn) =>
              this.supportedTypes.includes(field.type)
            );
          });
        }
      } 
    }
  }
}
