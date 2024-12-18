import BaseChartModules from "./common/base";
import { removeTargetValue } from "./utils";
import Modules from "@h3/report-mobile/basics/instance/modules";
export default class CardModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
      // 指标标签展示设置
      this.styles.metricLabel = new Modules.MetricLabel();
      // 设置文字比例大小
      this.styles.adaptiveSize = new Modules.AdaptiveSize();
      // 文字位置
      this.styles.textAlign = new Modules.TextAlign();
      this.styles.cardSetting = new Modules.CardSetting();
      this.styles.cardMode = new Modules.CardMode();
   
    this.handleChange(chart);
    // 没有维度时,不展示切换模式功能
    if(this.styles.cardMode) {
      this.styles.cardMode.display = !!(chart.data.dimension && chart.data.dimension.length > 0) 
    }
   
    if (chart.data.metric) {
      removeTargetValue(chart.data.metric || []);
    }
  
    // 没有图表配色
    delete this.styles.theme;
    this.handleDimensionAndMetric(chart);
    this.handleModules(chart, modules);
  }
  /**
   * 初始化
   * @param chart
   */
  handleDimensionAndMetric(chart) {
    if (chart.data.dimension) {
      this.handleChangeModeOrDim(chart);

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
    
    (this.data.dimension as any).change = (result: any) => {
  
      this.handleChange(chart);
     
      if(result.dimension.length === 0 || result.dimension[0].type === "date") {
        if(chart.data && chart.data.metric) {
        for(let i = 0; i < chart.data.metric.length; i++){
          delete chart.data.metric[i].options.ratio ;
          }
        }
      }
    let allDimension: any = [];
    let allMetric: any = [];
    allDimension = result.dimension.map(item=> item.uid);
    allMetric = (chart.data.metric.map(item=> item.uid)).concat(allDimension);
    chart.data.innerFilter = chart.data.innerFilter.filter(item=> {allMetric.includes(item.uid)}); 
    if(this.styles.cardMode) {
      this.styles.cardMode.display = !!(chart.data.dimension && chart.data.dimension.length > 0) 
    }
    this.handleChangeModeOrDim(chart);
  };
    (this.styles.cardMode as any).change = (result: any) =>{
      if(result === 'card') {
        this.labelSetting(true); 
      } else {
        this.labelSetting(false); 
      }
      this.dataSetting(true); 
    }
    (this.data.metric as any).change = (result: any) => {
      this.handleChange(chart);
      this.handleChangeModeOrDim(chart);
    };
  }
  // 标签是否显示
  labelSetting(boolean) {
    (this.styles.metricLabel as any).display = boolean;
    (this.styles.textAlign as any).display = boolean;
    (this.styles.adaptiveSize as any).display = boolean;
    (this.styles.cardSetting as any).display = boolean;
  }
  // 数据功能是否显示 
  dataSetting(boolean) {
    (this.data.limit as any).display = boolean;
    (this.data.filterNone as any).display = boolean;
  }
  // 当模式或者维度变化时，功能的变化
  handleChangeModeOrDim(chart) {
    if (chart.data.dimension.length < 1) {
      this.labelSetting(true); 
      this.dataSetting(false); 
      chart.data.limit = null;
    } else {
      if(chart.styles.cardMode &&chart.styles.cardMode.mode === 'card') {
        this.labelSetting(true); 
      } else {
        this.labelSetting(false); 
      }     
      this.dataSetting(true); 
    }
  }
 
  /**
   * 处理指标维度变化的影响范围
   */
  handleChange(chart) {
 // 指标设置
    if(this.data.metric) {
      if (chart.data && chart.data.dimension.length ) {
        this.data.metric.max = 1;
      } else {
        this.data.metric.max = 20;
      }
    }
    if(this.data.dimension && this.styles.linkage) {
      if(chart.data && chart.data.dimension && chart.data.dimension.length) {
        // 无联动
        this.styles.linkage.display = true;
      } else {
        this.styles.linkage.display = false;
        chart.styles.linkage = [];
      }
      if (chart.data && chart.data.metric &&  chart.data.metric.length > 1 ) {
        this.data.dimension.max = 0;
      } else {
        this.data.dimension.max = 1;
      }
    }
  }
}
