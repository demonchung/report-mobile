import Module from "./module";

const defaultMode = "in";

export default class ReportGaugeModeModule extends Module implements H3.ReportModules.GaugeMode {
  title: string = "仪表图类型";
  display: boolean = true;
  default: H3.Report.GaugeMode = {
    mode: defaultMode
  };

  constructor(def?: H3.Analysis.GaugeModeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.gaugeMode === undefined) {
      chartStyles.gaugeMode = {
        mode: this.default.mode
      };
    }
  }
}
