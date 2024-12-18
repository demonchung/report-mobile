import BaseChartModules from "./base";
import { handleAnalysisDimensionsAndMetric } from "./utils";
export default class BarChartModules extends BaseChartModules {
  constructor(
    chart: H3.Report.Chart,
    modules?: H3.Report.Global,
    defaultOptions?: H3.Analysis.ChartModules
  ) {
    super(chart, modules, defaultOptions);
    handleAnalysisDimensionsAndMetric(this, chart);
    this.handleModules(chart, modules);
  }
}
