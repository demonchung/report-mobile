import Module from "./module";

/**
 * 多种类数据显示设置模块
 */
export default class ReportDataLabelPositionModule extends Module
  implements H3.ReportModules.DataLabelPosition {
  title: string = "数值标签显示设置";
  display: boolean = true;
  default: H3.Report.DataLabelPosition = {
    position: 'pie',
    detail: 'out'
  };

  constructor(def?: H3.Analysis.DataLabelPositionModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    if (chart.styles && !chart.styles.dataLabelPosition) {
      chart.styles.dataLabelPosition = this.default;
    }
  }
}
