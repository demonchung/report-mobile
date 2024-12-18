import AxisChartModules from "./common/axis-chart";

import Modules from "../../modules";
import { handleDimensionsAndMetric, changeForecast } from "./utils";
import { handleInnerFilter, handleSort, handleLimit,limitControl} from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";
export default class BarChartModules extends AxisChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
  
    // 无警戒线功能
    if(this.styles.warningLine) {
      this.styles.warningLine.display = false;
      delete chart.styles.warningLine;
    }
    // 无指标范围
    if(this.styles.metricRange) {
      this.styles.metricRange.display = false;
      delete chart.styles.metricRange;
    }

  
    // 兼容图表切换后属性不一致的问题
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
        if ((type === "address" && !item.options.areaType) || item.options.areaType === "all") {
          item.options.areaType = "district";
        }
        if (item.options && item.options.isComputeField && item.type === "number") {
          chart.data.dimension.splice(index, 1);
        }
      });
    }
    // 指标设置
    if (this.data.metric) {
      this.data.metric.max = 25;
      if (chart.data.metric && chart.data.metric.length > 1) {
        // 1维多标，隐藏limit功能
        limitControl(this, chart, 0);
      }else {
        if(chart.data.metric && chart.data.metric.length === 1){
          limitControl(this,chart,1);
        }
      } 

      if(chart.data && chart.data.metric){
        for(let i = 0; i < chart.data.metric.length; i++){
          (chart.data.metric[i].options as any).numberFormat.comma = false;
          (chart.data.metric[i].options as any).numberFormat.percent = false;
          (chart.data.metric[i].options as any).numberFormat.fraction = false;
        }
      }
    }
    // 注册预测事件
    if (this.data.forecast) {
      this.data.forecast.change = (data: any) => changeForecast(modules, chart, data);
    }
    // 注册指标change事件
    if (this.data.metric && this.data.sort && !chart.data.sort.length) {
      if (chart.data.metric && chart.data.metric.length) {
      }
      this.data.metric.change = ({ metric }) => {
        if (
          metric &&
          metric.length &&
          metric[0].uid &&
          chart.data.sort &&
          !chart.data.sort.length
        ) {
        }
        if (chart.data.metric && chart.data.metric.length > 1) {
          // 1维多标，隐藏limit功能
          limitControl(this, chart, 0);
        }else {
          if(chart.data.metric && chart.data.metric.length === 1){
            limitControl(this,chart,1);
          }
        } 
        
        if (chart.data && chart.data.innerFilter) {
          handleInnerFilter(modules, chart);
        }
        return {
          modules: this,
          dataGroup: chart.data
        };
      };
    }
    this.handleModules(chart, modules);
  }
}
