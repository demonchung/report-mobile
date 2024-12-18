import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportFilterNoneModule extends Module implements H3.ReportModules.FilterNone {
  title: string = "过滤";
  display: boolean = true;

  default: boolean = true;

  constructor(def?: H3.Analysis.FilterNoneModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.filterNone === undefined) {
      chartData.filterNone = this.default;
    }
  }
}
