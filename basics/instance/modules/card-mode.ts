import Module from "./module";

const defaultMode = "list";

export default class ReportCardModeModule extends Module implements H3.ReportModules.CardMode {
  title: string = "指标图类型";
  display: boolean = true;
  default: H3.Report.CardMode = {
    mode: defaultMode
  };

  constructor(def?: H3.Analysis.CardModeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.cardMode === undefined) {
      chartStyles.cardMode = this.default;
    }
  }
}
