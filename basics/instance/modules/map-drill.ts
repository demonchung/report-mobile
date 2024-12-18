import Module from "./module";

export default class ReportMapDrillModule extends Module implements H3.ReportModules.MapDrill {
  title: string = "地图钻取";
  display: boolean = true;
  default: H3.Report.MapDrill = {
    drill: "city"
  };

  constructor(def?: H3.Analysis.MapDrillModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.mapDrill === undefined) {
      chartStyles.mapDrill = this.default;
    } 
  }
}
