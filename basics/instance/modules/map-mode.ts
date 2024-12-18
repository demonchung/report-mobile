import Module from "./module";

const defaultMode = "area";

export default class ReportMapThemeModule extends Module implements H3.ReportModules.MapTheme {
  title: string = "地图类型";
  display: boolean = true;
  default: H3.Report.MapMode = {
    mode: defaultMode
  };

  constructor(def?: H3.Analysis.MapThemeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.mapMode === undefined) {
      chartStyles.mapMode = {
        mode: this.default.mode
      };
    }
  }
}
