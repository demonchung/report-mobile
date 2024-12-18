import BaseChartModules from "./common/base";
import Modules from "../../modules";
import { handleInnerFilter, handleSort } from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";
export default class ScatterChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    // 维度设置
    if (this.data.dimension) {
      // 维度条数限制
      this.data.dimension.max = 2;
      this.data.dimension.change = (data: any) => {
        if (chart.data && chart.data.innerFilter) {
          handleInnerFilter(modules, chart);
        }
        if (chart.data && chart.data.sort) {
          handleSort(modules, chart);
        }
      };
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
      // 指标条数限制
      this.data.metric.max = 3;
    }
    // 图例设置
    this.styles.legend = new Modules.Legend();

   
    // 散点图不需要数据显示设置功能
    delete this.data.limit;
    this.handleModules(chart, modules);
  }
}
