import Module from "./module";

/**
 * 滚动条设置模块
 */
export default class ReportForecastModule extends Module implements H3.ReportModules.Forecast {
  title: string = "指标预测";
  display: boolean = true;
  numberTitle: string = "预测期数";

  default: H3.Report.Forecast = {
    show: false,
    number: 2
  };

  constructor(def?: H3.Analysis.ForecastModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.forecast === undefined) {
      chartData.forecast = this.default;
    }
  }
}
