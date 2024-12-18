import AxisChartModules from "./common/axis-chart";

import Modules from "../../modules";
import { handleDimensionsAndMetric } from "./utils";
export default class StripeChartModules extends AxisChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);

  
    // 柱图模式
    this.styles.barMode = new Modules.BarMode();
    
    handleDimensionsAndMetric(this, chart);
    this.handleModules(chart, modules);
  }
}
