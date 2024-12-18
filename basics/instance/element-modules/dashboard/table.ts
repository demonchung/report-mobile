import BaseChartModules from "./common/base";
import BaseTableModules from "./common/table";
import Modules from "../../modules";
import options from "@h3/report-mobile/dist/options";
import {
  handleInnerFilter,
  handleSort,
  removeTargetValue
} from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";

export default class TableModules extends BaseTableModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    
    // 列维度设置
    this.data.groupDimension = new Modules.GroupDimension()
    if (this.data.groupDimension) {
      this.data.groupDimension.supportedTypes = ["string", "date", "address"];
      this.data.groupDimension.max = 25;
      this.data.groupDimension.title = "$r_language.design.DF_title.dim_colum$";
    }
    // 是否需要导出
    if (options.download.pivotTable) {
      this.styles.download = new Modules.Download();
    }
    // 序号设置
    this.styles.orderNumber = new Modules.OrderNumber();
    
   
    // 行维度设置
    if (this.data.dimension) {
      this.data.dimension.supportedTypes = ["string", "date", "address"];
      this.data.dimension.max = 25;
      this.data.dimension.title = "$r_language.design.DF_title.dim_row$";
      this.data.dimension.tip = "$r_language.design.DF_tip.table_RD$";
      // 对日期字段做初始化
      chart.data.dimension.forEach((item) => {
        const type = item.specialType ? item.specialType : item.type;
        if ((type === "date" && !item.options.format) || item.options.format === "YMDHMS") {
          item.options.format = "Y";
        }
        if ((type === "address" && !item.options.areaType) || item.options.areaType === "all") {
          item.options.areaType = "district";
        }
      });
    }

   
    // 指标设置
    if (this.data.metric) {
      this.data.metric.max = 25;
    }
    if(chart.data.metric) {
      removeTargetValue(chart.data.metric || []);
    }
  
   // change事件
    if (this.data.dimension && this.data.metric && this.data.groupDimension) {
      this.data.groupDimension.change = (data: any) =>
        this.initDimensionsAndMetric(this, chart, data);
      this.data.dimension.change = (data: any) => this.initDimensionsAndMetric(this, chart, data);
      this.data.metric.change = (data: any) => this.initDimensionsAndMetric(this, chart, data);
    }
     // 排序支持的类型
    if (this.data.sort) {
      this.data.sort.moduleTypes = ["dimension", "groupDimension"];
    }

    this.handleModules(chart, modules);
  }

  /**
   * 处理基本两维一指标 or 一维多指标
   * @param modules
   * @param chart
   * @param data
   */
  initDimensionsAndMetric(modules: TableModules, chart: H3.Report.Chart, data: any) {
    if (chart.data.dimension && chart.data.groupDimension) {
      // 透视图隐藏数据显示设置功能
      if (modules.data.limit) {
        modules.data.limit.display = false;
      }
    }
    let dimArr: any = [];
    if(data.dimension){
      dimArr = data.dimension.filter(item=> item.type === "date")
    }
    if(data.groupDimension){
      dimArr = data.groupDimension.filter(item=> item.type === "date")
    }
    if(!dimArr.length && chart.data && chart.data.metric){
      for(let i = 0; i < chart.data.metric.length; i++){
        delete chart.data.metric[i].options.ratio ;
      }
    }
    if (chart.data && chart.data.innerFilter) {
      handleInnerFilter(modules, chart);
    }
    if (chart.data && chart.data.sort) {
      handleSort(modules, chart);
    }
    return modules;
  }
}
