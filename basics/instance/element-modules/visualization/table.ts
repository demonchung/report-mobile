import BaseChartModules from "./base";
import Modules from "../../modules";

export default class TableModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    const dataSort: any = {
      dimension: null,
      groupDimension: null,
      metric: null,
      sort: null
    };
    let dimensionArr: any = [];
    let groupDimensionArr: any[] = [];

    this.data = Object.assign(dataSort, this.data, {
      groupDimension: new Modules.GroupDimension()
    });
    if (this.data.dimension) {
      this.data.dimension.supportedTypes = ["string", "date"];
      this.data.dimension.max = 25;
      this.data.dimension.title = "行维度";
    }
    if (chart.data.dimension) {
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
    if (this.data.groupDimension) {
      this.data.groupDimension.supportedTypes = ["string", "date"];
      this.data.groupDimension.max = 25;
      this.data.groupDimension.title = "列维度";
    }
    if (chart.data.groupDimension) {
      groupDimensionArr = chart.data.groupDimension.filter(item => item.type);
    }
    // 维度>=2时，隐藏数据显示设置功能
    if (dimensionArr.length + groupDimensionArr.length >= 2) {
      (this.data.limit as any).display = false;
      (chart.data.limit as any) = null;
    }
    if (this.data.metric) {
      this.data.metric.max = 25;
    }
    // 隐藏dimensionLimit - 维度数据设置
    if (this.styles.dimensionLimit) {
      this.styles.dimensionLimit.display = false;
      chart.styles.dimensionLimit = null;
    }
    if (this.data.dimension && this.data.metric && this.data.groupDimension) {
      this.data.groupDimension.change = (data: any) => this.initDimensionsAndMetric(this, data);
      this.data.dimension.change = (data: any) => this.initDimensionsAndMetric(this, data);
      this.data.metric.change = (data: any) => this.initDimensionsAndMetric(this, data);
    }
    this.handleModules(chart, modules);
  }

  /**
   * 处理基本两维一指标 or 一维多指标
   * @param modules
   * @param data
   */
  initDimensionsAndMetric(modules, data) {
    // 维度>=2时，隐藏数据显示设置功能
    let dimensionArr: any = [];
    let groupDimensionArr: any[] = [];
    if (data.dimension) {
      dimensionArr = data.dimension.filter(item => item.type);
    } else {
      dimensionArr = modules.inventedChartData.dimension.filter(item => item.type);
    }
    if (data.groupDimension) {
      groupDimensionArr = data.groupDimension.filter(item => item.type);
    } else {
      groupDimensionArr = modules.inventedChartData.groupDimension.filter(item => item.type);
    }
    if (dimensionArr.length + groupDimensionArr.length >= 2) {
      modules.data.limit.display = false;
    } else {
      modules.data.limit.display = true;
    }
    return {
      modules: modules,
      dataGroup: Object.assign(modules.inventedChartData, data)
    };
  }
}
