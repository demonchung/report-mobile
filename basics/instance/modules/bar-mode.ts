import Module from "./module";

const defaultMode = "bar";

export default class ReportBarModeModule extends Module implements H3.ReportModules.BarMode {
  title: string = "图表类型";
  display: boolean = true;
  default: H3.Report.BarMode = {
    mode: defaultMode
  };

  constructor(def?: H3.Analysis.BarModeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.barMode === undefined) {
      chartStyles.barMode = {
        mode: this.default.mode
      };
    }
  }
}
