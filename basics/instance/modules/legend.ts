import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportLegendModule extends Module implements H3.ReportModules.Legend {
  title: string = "图例设置";
  display: boolean = true;
  checked: boolean = true;
  position: "top" | "bottom" | "left" | "right" = "top";

  default: H3.Report.Legend = {
    checked: this.checked,
    position: this.position
  };
  constructor(def?: H3.Analysis.LegendModule) {
    super();
    // 改变默认值
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.legend === undefined) {
      chartStyles.legend = this.default;
    }
  }
}
