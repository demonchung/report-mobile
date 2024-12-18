import FieldMapping from "./field-mapping";

/**
 * 过滤器实例
 */
export default class ReportInnerFilterModule extends FieldMapping implements H3.ReportModules.InnerFilter {
  title = '过滤条件';
  max: number = 20;
  /**
   * 处理图表数据
   * @param chart
   */
  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && !chartData.innerFilter) {
      chartData.innerFilter = [];
    }
  }
}
