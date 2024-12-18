import BaseChartModules from './common/base';
import Modules from '../../modules';
import { handleDimensionsAndMetric } from './utils';
export default class RadarChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules ? : H3.Report.Global) {
    super(chart, modules);
    handleDimensionsAndMetric(this, chart);
    // 指标范围
    this.styles.metricRange = new Modules.MetricRange();
    // 图例
    this.styles.legend = new Modules.Legend();
    // 标签
    this.styles.dataLabel = new Modules.DataLabel();
    // 分组系列设置
    this.data.groupSetting = new Modules.GroupSetting();
    // 字体大小
    this.styles.dataLabelFontSize = new Modules.DataLabelFontSize();
    // 隐藏limit - 数据显示设置
    if(this.data.limit){
      delete this.data.limit;
      delete chart.data.limit;
    }
    this.handleModules(chart, modules);
  }
}
