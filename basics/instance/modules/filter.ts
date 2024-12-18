import FieldMapping from "./field-mapping";

/**
 * 过滤器实例
 */
export default class ReportScreenModule extends FieldMapping implements H3.ReportModules.Filter {
  title = "$r_language.design.DF_title.filter$";
  max: number = 20;
  supportedTypes: string[] = ["string", "date", "number", "address"];
  isSupportedAggregate = true;
  /**
   * 处理图表数据
   * @param chart
   */
  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && !chartData.filter) {
      chartData.filter = [];
    }
  }
}
