import Module from "./module";

/**
 * 图表配色主题实例
 */

export default class ReportThemeModule extends Module implements H3.ReportModules.Theme {
  title = "颜色主题";
  display: boolean = true;

  default: H3.Report.Theme = {
    colors: [],
    type: ""
  };

  constructor(def?: H3.Analysis.ThemeModule) {
    // 改变默认值
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  /**
   * 处理图表数据
   * @param chart
   */
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && !chartStyles.theme) {
      chartStyles.theme = this.default;
    }
  }
}
