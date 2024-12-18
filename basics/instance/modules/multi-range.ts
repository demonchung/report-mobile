import Module from './module';

/**
 * 多组极限值设定
 */
export default class ReportMultiRangeModule extends Module{
  title: string = '自定义指标范围';
  display: boolean = true;

  // 每个图标选择的数据
  data: Array<H3.ReportModules.MetricRange> = [{
    title: "$r_language.modules.MultiRange.titleL$",
    display: true,
  }, {
    title: "$r_language.modules.MultiRange.titleR$",
    display: true,
  }]

  handleChartData(chart: H3.Report.Chart): void {
    if (chart.styles && !chart.styles.multiRange) {
      chart.styles.multiRange = [{
        min: null,
        max: null
      }, {
        min: null,
        max: null
      }]
    } else {
      
    }
  }
}
