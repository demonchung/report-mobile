import BaseChartModules from './common/base';
import Modules from '../../modules';
import {handleInnerFilter, handleSort} from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";
export default class PieChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    // 维度值个数限制
    this.styles.dimensionLimit = new Modules.DimensionLimit();
    // 标签展示
    this.styles.multipleDataLabel = new Modules.MultipleDataLabel();
    // 图例设置
    this.styles.legend = new Modules.Legend();
    // 标签位置
    this.styles.dataLabelPosition = new Modules.DataLabelPosition();
    // 饼图类型切换
    this.styles.pieMode = new Modules.PieMode();
    // 字体大小
    this.styles.dataLabelFontSize = new Modules.DataLabelFontSize();
    if(this.data.groupDimension){
      delete this.data.groupDimension;
      delete chart.data.groupDimension;
    }
    
    // 隐藏limit - 数据显示设置
    if(this.data.limit) {
      delete this.data.limit;
      delete chart.data.limit;
    }
    // 指标设置
    if(this.data.metric){
      this.data.metric.max = 1;
      if(chart.data && chart.data.metric) {
        for(let i = 0; i < chart.data.metric.length; i++){
          delete chart.data.metric[i].options.ratio ;
        }
      }
      // 同步排序和筛选
      this.data.metric.change = (data: any) => {
        if (chart.data && chart.data.innerFilter) {
          handleInnerFilter(modules, chart);
        }
        if (chart.data && chart.data.sort) {
          handleSort(modules, chart);
        }
      }
    }
    // 维度设置
    if (this.data.dimension) {
      this.data.dimension.max = 1;
      this.data.dimension.change = (data: any) => {
        if (chart.data && chart.data.innerFilter) {
          handleInnerFilter(modules, chart);
        }
        if (chart.data && chart.data.sort) {
          handleSort(modules, chart);
        }
      };
      // 对日期字段做初始化
      chart.data.dimension.forEach((item, index) => {
        const type = item.specialType ? item.specialType : item.type;
        if ((type === "date" && !item.options.format) || item.options.format === "YMDHMS") {
          item.options.format = "Y";
        }
        if(type === 'address'&& (!item.options.areaType) || (item.options.areaType === "all")) {
          item.options.areaType = "district";
        }
        if (item.options && item.options.isComputeField && item.type === "number") {
          chart.data.dimension.splice(index, 1);
        }
      });
    }
    this.handleModules(chart, modules);
  }
}
