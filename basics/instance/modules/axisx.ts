import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportAxisXModule extends Module implements H3.ReportModules.AxisX {
  title: string = "坐标X轴";
  display: boolean = true;
  displayAxisX: boolean = true; // 显示坐标轴
  displayLabel: boolean = true; // 显示标签
  direction: "crosswise" | "endwise" | "leftBank" | "rightBank" = "crosswise"; // 方向

  default: H3.Report.AxisX = {
    displayAxisX: this.displayAxisX,
    displayLabel: this.displayLabel,
    direction: this.direction
  };

  /**
   * 构建函数
   * @param chart
   * @param modules
   */
  constructor(def?: H3.Analysis.AxisXModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.axisX === undefined) {
      chartStyles.axisX = this.default;
    }
  }
}
