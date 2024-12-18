import BaseChartModules from "./base";
import Modules from "../../modules";
export default class GaugeChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global,defaultOptions?: H3.Analysis.ChartModules) {
    super(chart, modules, defaultOptions);
    // if(this.data.metric) {
    //   this.data.metric.max = 1;
    // }
   

    // if(chart.data.dimension && chart.data.dimension.length) {
    //   chart.data.dimension.splice(0,chart.data.dimension.length);
    // }
    // if(chart.data.groupDimension && chart.data.groupDimension.length) {
    //   chart.data.groupDimension.splice(0,chart.data.groupDimension.length);
    // }
    this.handleModules(chart, modules);
  }
}
