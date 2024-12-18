import BaseChartModules from './base';
export default class CardModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    if(this.data.metric) {
      this.data.metric.max = 1;
    }
    this.handleModules(chart, modules);
  }
}
