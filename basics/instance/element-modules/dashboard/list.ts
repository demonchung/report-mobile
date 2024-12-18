import BaseChartModules from "./common/base";
import BaseTableModules from "./common/table";
import Modules from "../../modules";
import options from "@h3/report-mobile/dist/options";
import { handleInnerFilter, handleSort } from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";
/**
 * 明细表
 */
export default class ListModules extends BaseTableModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    // 设置维度属性
    if (this.data.dimension) {
      this.data.dimension.title = "$r_language.design.DF_title.dim_list$";
      this.data.dimension.max = 25;
      this.data.dimension.supportedTypes = ["string", "date", "number", "address"];
      this.data.dimension.batch = true;
      // change事件,当维度改变时触发
      this.data.dimension.change = (data: any) => this.initDimensions(this, chart, data);
    }
    // 隐藏指标
    if (this.data.metric) {
      this.data.metric.display = false;
    }
    // 无过滤空值
    (this.data.filterNone as any).display = false;
    chart.data.filterNone = true;

  
    // 是否需要导出
    if (options.download.list) {
      this.styles.download = new Modules.Download();
    }
    // 明细表的序号开放自定义名称功能
    this.styles.orderNumber = new Modules.OrderNumber();
    this.styles.orderNumber.displayOrderName = true;
    // 从透视图切换成明细表时 带上序号
    if (
      chart.styles.orderNumber &&
      chart.styles.orderNumber.checked &&
      !chart.styles.orderNumber.orderName
    ) {
      chart.styles.orderNumber.orderName = chart.styles.orderNumber.orderName
        ? chart.styles.orderNumber.orderName
        : "序号";
    }
    // 明细表对冻结表头功能的设置
    if(this.styles.freezeHead) {
      this.styles.freezeHead.displayRow = false;
      this.styles.freezeHead.displayColumn = true;
      this.styles.freezeHead.displayColumnNumber = true;
      this.styles.freezeHead.displayRowNumber = false;
      this.styles.freezeHead.columnNumber = 0;
    }
    // 从透视图切换成明细表时 带上固定列
    if (chart.styles.freezeHead && chart.styles.freezeHead.column) {
      chart.styles.freezeHead.columnNumber = chart.styles.freezeHead.columnNumber
        ? chart.styles.freezeHead.columnNumber
        : 0;
    }
    // 处理其它图表切换成明细表时,纠正属性
    if (modules && modules.data) {
        if (modules.data.dimension) {
          chart.data.dimension = [...modules.data.dimension];
        }
        if (modules.data.groupDimension && modules.data.groupDimension.length > 0) {
          chart.data.dimension.push(...modules.data.groupDimension);
          chart.data.groupDimension = [];
        }
        if (modules.data.metric && modules.data.metric.length > 0) {
          chart.data.metric = [];
        }
        // 零时处理 日期字段 统一为年月日
        chart.data.dimension.forEach(d => {
          const type = d.specialType ? d.specialType : d.type;
          if (type === "date") {
            d.options.format = "YMDHMS";
          }
          if (type === "address") {
            // d.options.areaType = "all";
          }
          if(type === 'address'&& !d.options.areaType) {
            d.options.areaType = "all";
          }
          if (type !== "number" && d.options.numberFormat) {
            // 使用于切换图表时 产生的数字格式设置
            delete d.options.numberFormat;
          }
          if (type === "number" && !d.options.hasOwnProperty("aggregateType")) {
            d.options.aggregateType = '';
          }
        });
    }

    this.handleModules(chart, modules);
  }
  /**
   * 处理基本两维一指标 or 一维多指标
   * @param modules
   * @param chart
   * @param data
   */
  initDimensions(modules, chart: H3.Report.Chart, data: any) {
    if (chart.data && chart.data.innerFilter) {
      handleInnerFilter(modules, chart);
    }
    if (chart.data && chart.data.sort) {
      handleSort(modules, chart);
    }
    return modules;
  }
}
