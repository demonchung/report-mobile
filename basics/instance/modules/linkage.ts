import Module from './module';

/**
 * 图表联动模块
 */
export default class ReportChartLinkageModule extends Module implements H3.ReportModules.Linkage{
  title: string = '图表联动';
  display: boolean = true;

  default: Array<H3.Report.Legend> = [];
  constructor(def?: H3.Analysis.LinkageModule) {
    super();
    // 改变默认值
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.linkage === undefined) {
      chartStyles.linkage = [];
    }
  }
}
