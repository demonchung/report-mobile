import BaseChartModules from "./common/base";
import Modules from "../../modules";
import { handleInnerFilter, handleSort } from "./utils";

export default class ProgressModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    // 多种标签展示设置
    this.styles.progressLabel = new Modules.ProgressLabel();
    // 数据限制
    this.data.limit = new Modules.Limit();
     // 进度值排序
    this.data.sortPercent = new Modules.SortPercent();
    // 字体大小
    this.styles.dataLabelFontSize = new Modules.DataLabelFontSize();
    this.styles.dataLabelFontSize.sizeList = [12,14,16,18,20,22,24];
    if(chart.styles.dataLabelFontSize && chart.styles.dataLabelFontSize.size < 12) {
      chart.styles.dataLabelFontSize.size = 12;
    }
    // 维度设置
    if (this.data.dimension) {
      this.data.dimension.max = 1;
    }

    
    //指标设置
    if (this.data.metric) {
      this.data.metric.max = 10;
    }
    if (chart.data && chart.data.innerFilter) {
      handleInnerFilter(modules, chart);
    }
    if (chart.data && chart.data.sort) {
      handleSort(modules, chart);
    }

    this.handleDimensionAndMetric(chart,this);
    this.handleModules(chart, modules);
  }

  /**
   * 处理维度和指标变化
   * @param chart
   */
  handleDimensionAndMetric(chart: H3.Report.Chart,modules) {
    if (chart.data.dimension) {
      // 只有1维1指标展示维度限制
      if (chart.data.dimension.length !== 1 || chart.data.metric.length !== 1) {
        (this.data.limit as any).display = false;
        chart.data.limit = null;
      } else {
        (this.data.limit as any).display = true;
      }

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

    // 维度变化时，只有1维1指标展示维度限制
    (this.data.dimension as any).change = (result: any) => {
      if(result.dimension.length === 1 && chart.data.metric.length === 1) {
        if(chart.data.sortPercent) {
           chart.data.sortPercent = 0;
         }
      }
      if (result.dimension.length !== 1 || chart.data.metric.length !== 1) {
        (this.data.limit as any).display = false;
        chart.data.limit = null;
      } else {
        (this.data.limit as any).display = true;
      }
      if(result.dimension.length === 0 || result.dimension[0].type === "date"){
        if(chart.data && chart.data.metric) {
        for(let i = 0; i < chart.data.metric.length; i++){
          delete chart.data.metric[i].options.ratio ;
        }
      }
      }
      if (chart.data && chart.data.innerFilter) {
        handleInnerFilter(modules, chart);
      }
      if (chart.data && chart.data.sort) {
        handleSort(modules, chart);
      }
    };
    // 指标变化时，只有1维1指标展示维度限制
    (this.data.metric as any).change = (result: any) => {
      if(result.metric.length === 1 && chart.data.dimension.length === 1) {
        if(chart.data.sortPercent) {
           chart.data.sortPercent = 0;
         }
      }
      if (result.metric.length !== 1 || chart.data.dimension.length !== 1) {
        (this.data.limit as any).display = false;
        chart.data.limit = null;
        
      } else {
        (this.data.limit as any).display = true;
      }
      if (chart.data && chart.data.innerFilter) {
        handleInnerFilter(modules, chart);
      }
      if (chart.data && chart.data.sort) {
        handleSort(modules, chart);
      }
    };
  }
}
