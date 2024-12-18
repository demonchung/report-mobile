import Module from "./module";

/**
 * 数据限制|数据保留模块
 */
export default class ReportCrossSummaryModule extends Module implements H3.ReportModules.CrossSummary {
  title: string = "转化率";
  display: boolean = true;
  columnSummaries: Array<H3.Report.Summaries>= [];
  rowSummaries:Array<H3.Report.Summaries>= [];
  columnSummary =  true;
  columnSummaryPosition = 0;
  rowSummary= true;// 行汇总是否展示，true或者没有表示要展示，false表示不展示
  rowSummaryPosition= 0; // 行汇总位置，0或者没有表示下边，1表示上边
  default: H3.ReportModules.CrossSummary = {
    columnSummaries: [],
    rowSummaries: [],
    columnSummary: true,
    columnSummaryPosition: 0,
    rowSummary: true,// 行汇总是否展示，true或者没有表示要展示，false表示不展示
    rowSummaryPosition: 0, // 行汇总位置，0或者没有表示下边，1表示上边
  };

  constructor(def?: H3.Analysis.CrossSummaryModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.crossSummary === undefined) {
      chartData.crossSummary = this.default; 
    }
  }
}
