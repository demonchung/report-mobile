import Module from "./module";

/**
 * 数据限制|数据保留模块
 */
export default class ReportAxisyNameModule extends Module implements H3.ReportModules.AxisyName {
  title?: string = '';
  display: boolean = true;
  default: H3.Report.AxisyName = {
    displayName: true, // 显示标题
    defaultName: '', //左轴标题
    rightYName: '', // 右轴标题
  };
 constructor(def?: H3.Analysis.AxisyName) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.axisyName === undefined) {
      chartStyles.axisyName = this.default;
    }
  }
}
