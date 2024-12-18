import BaseChartModules from "./common/base";
import Modules from "../../modules";
import { handleInnerFilter, handleSort } from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";

export default class FunnelChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    // 图例
    this.styles.legend = new Modules.Legend();
    // 转化率
    this.data.conversion = new Modules.Conversion();
    // 字体大小
    this.styles.dataLabelFontSize = new Modules.DataLabelFontSize();
    if (this.data.groupDimension) {
      delete this.data.groupDimension;
      delete chart.data.groupDimension;
    }
    // 维度设置
    if (this.data.dimension) {
      this.data.dimension.max = 1;
      this.data.dimension.change = (data: any) => {
        if(data.dimension.length === 0 || data.dimension[0].type === "date"){
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
      this.data.metric.max = 1;
    }
    if (this.data.metric && this.data.sort && !chart.data.sort.length) {
      this.data.metric.change = ({ metric }) => {
        if (
          metric &&
          metric.length &&
          metric[0].uid &&
          chart.data.sort &&
          !chart.data.sort.length
        ) {
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
