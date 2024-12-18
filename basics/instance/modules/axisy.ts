import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportAxisYModule extends Module implements H3.ReportModules.AxisY {
  title: string = "坐标Y轴";
  display: boolean = true;
  labelTitle:string = "刻度";
  displayLabel: boolean = true; // 显示标签

  default: H3.Report.AxisY = {
    displayLabel: this.displayLabel,
    displayName: false,
    leftYName: null,
    rightYName: null,
  };

  /**
   * 构建函数
   * @param chart
   * @param modules
   */
  constructor(def?: H3.Analysis.AxisYModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.axisY === undefined) {
      chartStyles.axisY = this.default;
    }
  }
}
