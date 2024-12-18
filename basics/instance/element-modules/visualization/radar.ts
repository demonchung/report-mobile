import BaseChartModules from './base';
import { handleDimensionsAndMetric } from './utils';
export default class RadarChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules ? : H3.Report.Global) {
    super(chart, modules);
    handleDimensionsAndMetric(this, chart);
    // 隐藏limit - 数据显示设置
    if(this.data.limit){
      delete this.data.limit;
      delete chart.data.limit;
    }
    this.handleModules(chart, modules);
  }
}
