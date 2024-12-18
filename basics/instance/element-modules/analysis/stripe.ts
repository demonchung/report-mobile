import BaseChartModules from "./base";
import Modules from "../../modules";
import { handleAnalysisDimensionsAndMetric } from "./utils";
export default class StripeChartModules extends BaseChartModules {
  constructor(
    chart: H3.Report.Chart,
    modules?: H3.Report.Global,
    defaultOptions?: H3.Analysis.ChartModules
  ) {
    super(chart, modules, defaultOptions);

    chart.styles.direction = "right";
    handleAnalysisDimensionsAndMetric(this, chart);
    this.handleModules(chart, modules);
  }
}
