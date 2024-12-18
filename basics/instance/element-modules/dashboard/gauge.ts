import BaseChartModules from "./common/base";
import Modules from "../../modules";
import {handleDimensionsAndMetric, removeTargetValue} from "./utils";
export default class GaugeChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    // 多个标签设置
    this.styles.progressLabel = new Modules.ProgressLabel();
    // 仪表图类型模式
    this.styles.gaugeMode = new Modules.GaugeMode();
    // 字体大小
    this.styles.dataLabelFontSize = new Modules.DataLabelFontSize();
    // 指标设置
    if(this.data.metric) {
      this.data.metric.max = 1;
      if(chart.data && chart.data.metric) {
        for(let i = 0; i < chart.data.metric.length; i++){
          delete chart.data.metric[i].options.ratio ;
        }
      }
    }
    // 无联动
    if(this.styles.linkage) {
      this.styles.linkage.display = false;
      delete chart.styles.linkage;
    }
    
    // 过滤空值默认不展示
    (this.data.filterNone as any).display = false;
    chart.data.filterNone = true;
    
    if(chart.data.dimension && chart.data.dimension.length) {
      chart.data.dimension.splice(0,chart.data.dimension.length);
    }
    if(chart.data.groupDimension && chart.data.groupDimension.length) {
      chart.data.groupDimension.splice(0,chart.data.groupDimension.length);
    }
    delete this.data.limit;
    this.handleModules(chart, modules);
  }
}
