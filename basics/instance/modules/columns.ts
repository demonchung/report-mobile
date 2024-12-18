import Module from "./module";

/**
 * 滚动条设置模块
 */
export default class ReportColumnsModule extends Module implements H3.ReportModules.Columns {
  title: string = "拖拽列宽";
  display: boolean = true;
  
  default: Array<H3.Report.Column> = [];

  constructor(def?: H3.Analysis.ColumnsModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.columns === undefined) {
      chartData.columns = this.default;
    }
  }
}
