import Module from "./module";

/**
 * 显示堆叠合计
 */
export default class ReportDataLabelPileSumModule extends Module
  implements H3.ReportModules.DataLabelPileSum {
  title: string = "显示堆叠合计";
  display: boolean = true;

  default: boolean = false;

  constructor(def?: H3.Analysis.DataLabelPileSumModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.dataLabelPileSum === undefined) {
      chartStyles.dataLabelPileSum = this.default;
    }
  }
}
