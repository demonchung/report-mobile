import Module from "./module";

/**
 * 列表文字对齐方式
 */
export default class ReportListTextAlignModule extends Module implements H3.ReportModules.ListTextAlign {
  title: string = "对齐方式";
  display: boolean = true;

  default: H3.Report.ListTextAlign = {
    alignment: 'default'
  };

  constructor(def?: H3.Analysis.TextAlignModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.listTextAlign === undefined) {
      chartStyles.listTextAlign = this.default;
    }
  }
}
