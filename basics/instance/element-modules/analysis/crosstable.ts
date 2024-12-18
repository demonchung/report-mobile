import BaseChartModules from "./base";
import Modules from "../../modules";
import { handleAnalysisDimensionsAndMetric } from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";

export default class CrosstableModules extends BaseChartModules {
  constructor(
    chart: H3.Report.Chart,
    modules?: H3.Report.Global,
    defaultOptions?: H3.Analysis.ChartModules
  ) {
    super(chart, modules, defaultOptions);
    let dimensionArr: any = [];
    let groupDimensionArr: any[] = [];
    
    if (this.data.dimension) {
      this.data.dimension.max = 10;
    }
    if (this.data.metric) {
      this.data.metric.max = 10;
    }
    if (this.data.groupDimension) {
      this.data.groupDimension.max = 10;
    }
    if (chart.data.dimension) {
      if(chart.styles.freezeHead) {
        chart.styles.freezeHead.rowNumber = chart.data.dimension.length; 
      }
      dimensionArr = chart.data.dimension.filter(item => item.type);
      const removeIndex: Array<number> = [];
      const numberFields = chart.data.dimension.filter(
        (field: H3.Report.FieldColumn, index: number) => {
          if (field.type === "number") {
            removeIndex.push(index);
            return true;
          }
          return false;
        }
      );
      if (chart.data.metric) {
        chart.data.metric.push(...numberFields);
      }
      chart.data.dimension = chart.data.dimension.filter(
        (field: H3.Report.FieldColumn, index: number) => !removeIndex.includes(index)
      );
    }

    if (chart.data.groupDimension) {
      groupDimensionArr = chart.data.groupDimension.filter(item => item.type);
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
    return modules;
  }
}
