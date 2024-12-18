import AxisChartModules from "./common/axis-chart";

import Modules from "../../modules";
import { handleDimensionsAndMetric, checkShowPileSum } from "./utils";
export default class BarChartModules extends AxisChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    
    // 柱图模式切换
    this.styles.barMode = new Modules.BarMode();
    
    // 堆叠汇总展示设置
    this.styles.dataLabelPileSum = new Modules.DataLabelPileSum();
    this.styles.dataLabelPileSum.display = checkShowPileSum(chart.data.metric);
    // 无指标范围
    if(this.styles.metricRange) {
      this.styles.metricRange.display = false;
      delete chart.styles.metricRange;
    }
    handleDimensionsAndMetric(this, chart);
    this.handleModules(chart, modules);
  }
}
