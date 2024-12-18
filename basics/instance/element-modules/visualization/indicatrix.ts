import BaseChartModules from './base';
export default class FunnelChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules ? : H3.Report.Global) {
    super(chart, modules);
    // // 隐藏sort - 排序显示设置
    // if(this.data.sort) {
    //   this.data.sort.display = false;
    // }
    if (this.data.dimension) {
      this.data.dimension.max = 1;
    }
    if(this.data.metric) {
      this.data.metric.max = 1;
      this.data.metric.change = (data: any) => {
        if(data && data.length && data[0].uid && chart.data.sort ) {
          chart.data.sort = data;
          data[0].options.order = 'desc';
        }
      };
    }
    this.handleModules(chart, modules);
  }
}
