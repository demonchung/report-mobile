import BaseChartModules from './base';
export default class FunnelChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules ? : H3.Report.Global) {
    super(chart, modules);
    if(chart.data.metric) {
      chart.data.sort = chart.data.metric;
    }
    if(this.data.sort) {
      this.data.sort.disabled = true;
      if(chart.data.sort && chart.data.sort.length) {
        chart.data.sort.forEach((sort: H3.Report.FieldColumn) => {
          sort.options.order = 'desc';
        });
      }
    }
    
    if (this.data.dimension) {
      this.data.dimension.max = 1;
    }
    if(this.data.metric) {
      this.data.metric.max = 1;
      this.data.metric.change = ({ metric }) => {
        if(metric && metric.length && metric[0].uid && chart.data.sort ) {
          metric[0].options.order = 'desc';
          chart.data.sort = metric;
        }
        return {
          modules: this,
          dataGroup: chart.data
        }
      };
    }
    
    this.handleModules(chart, modules);
  }
}
