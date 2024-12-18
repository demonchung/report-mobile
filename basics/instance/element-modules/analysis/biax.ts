import BaseChartModules from "./base";
import { handleAnalysisDimensionsAndMetric } from "./utils";

/**
 * 双轴图
 */
export default class BiaxModules extends BaseChartModules {
  constructor(
    chart: H3.Report.Chart,
    modules?: H3.Report.Global,
    defaultOptions?: H3.Analysis.ChartModules
  ) {
    super(chart, modules, defaultOptions);
    this.handleModules(chart, modules);
  }
}
