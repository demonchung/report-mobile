import Module from "./module";

/**
 * 滚动条设置模块
 */
export default class ReportCompareDataModule extends Module implements H3.ReportModules.CompareData {
  title: string = "维度对比值";
  display: boolean = true;
  
  default: Array<string> = [];

  constructor(def?: H3.Analysis.CompareDataModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.compareData === undefined) {
      chartData.compareData = this.default;
    }
  }
}
