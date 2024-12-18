import FieldMapping from "./field-mapping";

/**
 * 维度实例
 */
export default class ReportGroupDimensionModule extends FieldMapping
  implements H3.ReportModules.GroupDimension {
  display = true;
  default: Array<H3.Report.FieldColumn> = [];

  constructor(def?: H3.Analysis.GroupDimensionModule) {
    super("二级维度");
    this.supportedTypes = ["string", "date","number"];
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
      if (!chartData.groupDimension) {
        chartData.groupDimension = this.default;
      } else {
        if (chartData.groupDimension) {
          if (chartData.groupDimension.length > this.max) {
            chartData.groupDimension = chartData.groupDimension.slice(0, this.max);
          }
          chartData.groupDimension = chartData.groupDimension.filter((field: H3.Report.FieldColumn) =>
            this.supportedTypes.includes(field.type)
          );
        }
      } 
    }
  }
}
