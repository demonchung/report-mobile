import Module from "./module";

const defaultMode = "ring";

export default class ReportPieModeModule extends Module implements H3.ReportModules.PieMode {
  title: string = "饼图类型";
  display: boolean = true;
  default: H3.Report.PieMode = {
    mode: defaultMode
  };

  constructor(def?: H3.Analysis.PieModeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.pieMode === undefined) {
      chartStyles.pieMode = this.default;
    }
  }
}
