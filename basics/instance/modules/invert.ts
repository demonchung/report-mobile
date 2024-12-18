import Module from "./module";

/**
 * 数据限制|数据保留模块
 */
export default class ReportInvertModule extends Module implements H3.ReportModules.Invert {
  title: string = "转化率";
  display: boolean = true;
  show: boolean =  false;
  mode: 'next' | 'all' = 'next';
  default: H3.ReportModules.Invert = {
    show: false,
    mode: 'next'
  };

  constructor(def?: H3.Analysis.InvertModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.invert === undefined) {
      chartData.invert = this.default; 
    }
  }
}
