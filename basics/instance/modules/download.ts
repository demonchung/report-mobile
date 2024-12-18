import Module from "./module";

/**
 * 操作设置-导出
 */
export default class ReportChartDownloadModule extends Module implements H3.ReportModules.Download {
  title: string = "允许导出";
  display: boolean = true;

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && !chartStyles.download) {
      chartStyles.download = false;
    }
  }
}
