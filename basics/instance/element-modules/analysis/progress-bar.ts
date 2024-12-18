import BaseChartModules from "./base";
import Modules from "../../modules";

export default class ProgressModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global, defaultOptions?: H3.Analysis.ChartModules) {
    super(chart, modules, defaultOptions);
  
    this.handleModules(chart, modules);
  }

}
