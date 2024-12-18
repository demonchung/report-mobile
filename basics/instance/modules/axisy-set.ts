import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportAxisYSetModule extends Module implements H3.ReportModules.AxisYSet {
  title: string = "坐标轴";
  display: boolean = true;
  default: boolean = true;

  constructor(def?: H3.Analysis.AxisYSetModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.axisYSet === undefined) {
      chartStyles.axisYSet = this.default;
    }
  }
}
