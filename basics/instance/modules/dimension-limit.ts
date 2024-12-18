import Module from './module';

/**
 * 维度数据限制模块
 */
export default class ReportDimensionLimitModule extends Module implements H3.ReportModules.DimensionLimit{
  title: string = '数据条数';
  number?: number = 0;
  display: boolean = true;
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if(chartStyles && !chartStyles.dimensionLimit) {
      chartStyles.dimensionLimit = null;
    }
  }
}
