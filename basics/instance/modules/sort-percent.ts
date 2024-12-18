import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportSortPercentModule extends Module implements H3.ReportModules.SortPercent {
  title: string = "进度值排序";
  display: boolean = false;
  default: number = 0;

  constructor(def?: H3.Analysis.SortPercentModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.sortPercent === undefined) {
      chartData.sortPercent = this.default;
    }
  }
}
