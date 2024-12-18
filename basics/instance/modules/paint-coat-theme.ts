import Module from './module';

/**
 * 数据显示设置模块
 */
export default class ReportPaintCoatThemeModule extends Module implements H3.ReportModules.PaintCoatTheme {
  title: string = '仪表盘样式';
  display: boolean = true;
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.GlobalCoatGroup = chart.styles as H3.Report.GlobalCoatGroup;
    if (!chartStyles.paintCoatTheme) {
      chartStyles.paintCoatTheme = 'default';
    }
  }
}
