import Module from "./module";

export default class ReportMapAreaModule extends Module implements H3.ReportModules.MapArea {
  title: string = "显示范围";
  display: boolean = true;
  default: H3.Report.MapArea = {
    area: "all"
  };

  constructor(def?: H3.Analysis.MapAreaModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.mapArea === undefined) {
      chartData.mapArea = this.default;
    }
  }
}
