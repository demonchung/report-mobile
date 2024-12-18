import BaseChartModules from "./common/base";
import BaseTableModules from "./common/table";

import Modules from "../../modules";
import options from "@h3/report-mobile/dist/options";
import {
  handleInnerFilter,
  handleSort,
  handleCrossSummary,
  removeTargetValue
} from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";

export default class CrosstableModules extends BaseTableModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    
    // 列维度
    this.data.groupDimension = new Modules.GroupDimension();
    if (this.data.groupDimension) {
      this.data.groupDimension.supportedTypes = ["string", "date", "address"];
      this.data.groupDimension.max = 10;
      this.data.groupDimension.title = "$r_language.design.DF_title.dim_colum$";
      this.data.groupDimension.tip = "$r_language.design.DF_tip.cross_CD$";
    }
    // 是否需要导出
    if (options.download.crosstable) {
      this.styles.download = new Modules.Download();
    }
    // 汇总设置
    this.data.crossSummary = new Modules.CrossSummary();
    // 自定义字段排序
    this.data.moreOrderNumber = new Modules.MoreOrderNumber();
   
    // 维度设置
    if (this.data.dimension) {
      this.data.dimension.supportedTypes = ["string", "date", "address"];
      this.data.dimension.max = 10;
      this.data.dimension.title = "$r_language.design.DF_title.dim_row$";
      this.data.dimension.tip = "$r_language.design.DF_tip.cross_RD$";
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
      this.data.metric.max = 10;
    }
    if(chart.data.metric) {
      removeTargetValue(chart.data.metric || []);
    }
    // 汇总设置,兼容空值的默认值
    if(chart.data && chart.data.crossSummary) {
      if(chart.data.crossSummary.columnSummary === undefined) {
        chart.data.crossSummary.columnSummary = true;
      }
      if(chart.data.crossSummary.rowSummaryPosition === undefined) {
        chart.data.crossSummary.rowSummaryPosition = 0;
      }
      if(chart.data.crossSummary.rowSummary === undefined) {
        chart.data.crossSummary.rowSummary = true;
      }
      if(chart.data.crossSummary.columnSummaryPosition === undefined) {
        chart.data.crossSummary.columnSummaryPosition = 0;
      }
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
  initDimensionsAndMetric(modules: CrosstableModules, chart: H3.Report.Chart, data: any) {
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

    if (chart.data && chart.data.moreOrderNumber && chart.data.moreOrderNumber.uids) {
      const existArray = chart.data.dimension.map((item) => item.uid);
      chart.data.moreOrderNumber.uids = (chart.data.moreOrderNumber.uids as any).filter((uid) => {
        return existArray.includes(uid);
      })
    }
    if (chart.data && chart.data.innerFilter) {
      handleInnerFilter(modules, chart);
    }
    if (chart.data && chart.data.sort) {
      handleSort(modules, chart);
    }
    if (chart.data && chart.data.crossSummary) {
      handleCrossSummary(modules, chart);
    }
    return modules;
  }
}
