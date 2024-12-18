import Module from "./module";

/**
 * 多种类数据显示设置模块
 */
export default class ReportMultipleDataLabelModule extends Module
  implements H3.ReportModules.MultipleDataLabel {
  title: string = "数值标签显示设置";
  display: boolean = true;

  default: H3.Report.MultipleDataLabel = {
    dimensionLabel: true,
    metricLabel: true,
    percentLabel: true
  };

  constructor(def?: H3.Analysis.MultipleDataLabelModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    if (chart.styles && !chart.styles.multipleDataLabel) {
      chart.styles.multipleDataLabel = this.default;
    }
  }
}
