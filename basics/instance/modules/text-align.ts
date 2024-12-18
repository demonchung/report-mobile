import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportTextAlignModule extends Module implements H3.ReportModules.TextAlign {
  title: string = "文字位置";
  display: boolean = true;

  default: string = 'center';

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
    if (chartStyles && chartStyles.textAlign === undefined) {
      chartStyles.textAlign = this.default;
    }
  }
}
