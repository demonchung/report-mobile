import Module from './module';

/**
 * 数据显示设置模块
 */
export default class ReportWarningLineModule extends Module implements H3.ReportModules.WarningLine{
  title: string = '警戒线';
  display: boolean = true;
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (!chartStyles.warningLine) {
      chartStyles.warningLine = [];
    }
  }
}
