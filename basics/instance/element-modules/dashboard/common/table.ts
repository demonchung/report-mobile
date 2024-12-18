import Modules from "../../../modules";
import BaseChartModules from "./base";

import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import options from "@h3/report-mobile/dist/options";
import { handleInnerFilter, handleSort } from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";

export default class BaseTableModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    // 文本位置-左中右
    this.styles.listTextAlign = new Modules.ListTextAlign();
    // 分页设置
    this.data.pageSet = new Modules.PageSet();
    // 拖拽列宽
    this.data.columns = new Modules.Columns();
    // 字号设置
    this.styles.dataLabelFontSize = new Modules.DataLabelFontSize();
    this.styles.dataLabelFontSize.title = "表格字号大小";
    this.styles.dataLabelFontSize.sizeList = [12,13,14,16,18,20,22,24];
    this.styles.dataLabelFontSize.default.size = 13;
    if(chart.styles.dataLabelFontSize && chart.styles.dataLabelFontSize.size < 12) {
      chart.styles.dataLabelFontSize.size = 13;
    }
    // 表格类都没有图表配色
     delete this.styles.theme;
    // 冻结头处理
    this.styles.freezeHead = new Modules.FreezeHead();
    this.styles.freezeHead.displayRow = true;
    this.styles.freezeHead.displayColumn = true;
    this.styles.freezeHead.displayColumnNumber = false;
    this.styles.freezeHead.displayRowNumber = true;
    
    // 隐藏dimensionLimit - 维度数据设置
    if (this.styles.dimensionLimit) {
      this.styles.dimensionLimit.display = false;
      chart.styles.dimensionLimit = null;
    }
    // 隐藏数据限制功能
    if (this.data.limit) {
      this.data.limit.display = false;
      chart.data.limit = null;
    }
  
    // 图内筛选字段同步
    if (chart.data && chart.data.innerFilter) {
      handleInnerFilter(modules, chart);
    }
    // 排序字段同步
    if (chart.data && chart.data.sort) {
      handleSort(modules, chart);
    }
  }
}
