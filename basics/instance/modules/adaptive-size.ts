import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportAdaptiveSizeModule extends Module implements H3.ReportModules.AdaptiveSize {
  title: string = "比例大小";
  display: boolean = true;

  default: string = 'default';

  constructor(def?: H3.Analysis.AdaptiveSizeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.adaptiveSize === undefined) {
      chartStyles.adaptiveSize = this.default;
    }
  }
}
