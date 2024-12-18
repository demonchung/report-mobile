import Module from "./module";

/**
 * 滚动条设置模块
 */
export default class ReportPageSetModule extends Module implements H3.ReportModules.PageSet {
  title: string = "页码设置";
  display: boolean = true;

  default: H3.Report.PageSet = {
    size: 10,
    rowSize: 10,
  };

  constructor(def?: H3.Analysis.PageSetModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.pageSet === undefined) {
      chartData.pageSet = this.default;
    }
  }
}
