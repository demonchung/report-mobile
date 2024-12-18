import BaseChartModules from "./common/base";

import {
  handleAnalysisDimensionsAndMetric,
  handleDimensionsAndMetric,
  handleInnerFilter,
  handleSort
} from "../dashboard/utils";
import Modules from "@h3/report-mobile/basics/instance/modules";
export default class MapChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    this.styles.mapDigitalSet = new Modules.MapDigitalSet();
    // 地图钻取设置
    this.styles.mapDrill = new Modules.MapDrill();
    // 地图主题
    this.styles.mapTheme = new Modules.MapTheme(); 
    // 地图样式类型切换
    this.styles.mapMode = new Modules.MapMode();
    // 地图范围
    this.data.mapArea = new Modules.MapArea();
    (this.data.filterNone as any).display = false;
    chart.data.filterNone = true;
   
    if(this.data.groupDimension){
      delete this.data.groupDimension;
      delete chart.data.groupDimension;
    }
    // 维度设置
    if (this.data.dimension) {
      this.data.dimension.max = 1;
      this.data.dimension.supportedTypes = ["address"];
      // 零时处理 日期字段 统一为年月日
      chart.data.dimension.forEach((d) => {
        const type = d.specialType ? d.specialType : d.type;
        if (type === "address") {
          delete d.options.areaType;
        }
      });
      this.data.dimension.change = (data: any) => {
        if (chart.data && chart.data.innerFilter) {
          handleInnerFilter(modules, chart);
        }
        if (chart.data && chart.data.sort) {
          handleSort(modules, chart);
        }
      }
    }
    // 指标设置
    if (this.data.metric) {
      this.data.metric.max = 1;
      this.data.metric.supportedTypes = ["string", "date", "number", "address"];
      this.data.metric.change = (data: any) => {
        if (chart.data && chart.data.innerFilter) {
          handleInnerFilter(modules, chart);
        }
        if (chart.data && chart.data.sort) {
          handleSort(modules, chart);
        }
      }
    }
   
    // 不需要数据显示设置功能
    delete this.data.limit;
    delete this.styles.theme;
    // 数据联动
    this.data.mapArea.change = item => {
      if (item.mapArea.area === "province" && (chart.styles as any).mapDrill.drill === "province") {
        (chart.styles as any).mapDrill.drill = "city";
      }
      if (item.mapArea.area === "city" && (chart.styles as any).mapDrill.drill !== "disabled") {
        (chart.styles as any).mapDrill.drill = "disabled";
      }
    };
    
    this.handleModules(chart, modules);
  }
}
