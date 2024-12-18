import AxisChartModules from "./common/axis-chart";

import Modules from "../../modules";
import { handleDimensionsAndMetric } from "./utils";
export default class LineChartModules extends AxisChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);

    handleDimensionsAndMetric(this, chart);
    this.handleModules(chart, modules);
  }
}
