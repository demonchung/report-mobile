import BaseChartModules from "./common/base";
import Modules from "../../modules";
import { handleInnerFilter, handleSort } from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";

export default class FunnelCompareChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    // 开启联动功能
    // this.styles.linkage = new Modules.Linkage();
    // 开启图例
    this.styles.legend = new Modules.Legend();
    // 开启转化率
    this.data.invert = new Modules.Invert();
    this.styles.metricLabel = new Modules.MetricLabel();
    this.styles.metricValue = new Modules.MetricValue();
    this.styles.dataLabelFontSize = new Modules.DataLabelFontSize();
    // 从有列维度的图表切换删除
    if (this.data.groupDimension) {
      delete this.data.groupDimension;
      delete chart.data.groupDimension;
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
    // 指标设置为25个
    if (this.data.metric) {
      this.data.metric.max = 25;
    }
    // 注册指标change事件
    if (this.data.metric && this.data.sort && !chart.data.sort.length) {
      if (chart.data.metric && chart.data.metric.length) {
        // chart.data.metric[0].options.order = 'desc';
        // chart.data.sort = [JSON.parse(JSON.stringify(chart.data.metric[0]))];
        // chart.data.sort[0].options.order = 'desc';
      }
      this.data.metric.change = ({ metric }) => {
        if (
          metric &&
          metric.length &&
          metric[0].uid &&
          chart.data.sort &&
          !chart.data.sort.length
        ) {
          // chart.data.sort = [JSON.parse(JSON.stringify(chart.data.metric[0]))];
          // chart.data.sort[0].options.order = 'desc';
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
