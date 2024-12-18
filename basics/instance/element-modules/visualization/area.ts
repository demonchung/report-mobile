import BaseChartModules from './base';
import Modules from '../../modules';
import { handleDimensionsAndMetric } from './utils';
export default class AreaChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules ? : H3.Report.Global) {
    super(chart, modules);
    this.styles.metricRange = new Modules.MetricRange();
    handleDimensionsAndMetric(this, chart);
    this.handleModules(chart, modules);
  }
}
