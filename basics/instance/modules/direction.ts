import Module from './module';
/**
 * 数据限制模块
 */
export default class ReportDirectionModule extends Module implements H3.ReportModules.Direction{
  title: string = '图表方向设置';
  display: boolean = true;
  handleChartData(chart: H3.Report.Chart): void {
    chart.styles.direction = 'bottom';
  }
}
