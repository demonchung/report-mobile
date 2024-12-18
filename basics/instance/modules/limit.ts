import Module from "./module";

/**
 * 数据限制|数据保留模块
 */
export default class ReportLimitModule extends Module implements H3.ReportModules.Limit {
  //title: string = "数据显示设置";
  number?: number = 0;
  display: boolean = true;
  get title(){
    return this.$r_language.modules.Limit.classify
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData) {
      const limit: string | undefined = Object.keys(chartData).find(
        (key: string) => key === "limit"
      );
      if (!limit) {
        chartData.limit = null;
      }
      if (chartData.groupDimension && chartData.groupDimension.length) {
        this.display = false;
      }
    }
  }
}
