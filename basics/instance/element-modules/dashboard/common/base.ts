import Modules from "../../../modules";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import options from "@h3/report-mobile/dist/options";
import { handleInnerFilter, handleSort } from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";

export default class BaseChartModules implements H3.ReportModules.ChartModules {
  data: H3.ReportModules.ChartDataModules = {};
  styles: H3.ReportModules.ChartStylesModules = {};
  /**
   * 构建函数
   * @param chart
   * @param modules
   */
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    // 初始化渲染data模块
    const dataModules = [
      "chartTitle",
      "chartSwitch",
      "dimension",
      "metric",
      "sort",
      "limit",
      "filter",
      "filterNone",
      "innerFilter",
      "switchLayers",
      "compareData",
    ];
    if (options.timerOptions.open) {dataModules.push("timer");}
    const stylesModules = ["theme", "elementCoat", "fontSetting", "linkage"];
    if (options.jumpDashboard.open) {stylesModules.push("jumpLink");}
    // 处理图内筛选器
    if (chart.data && chart.data.innerFilter) {
      handleInnerFilter(modules, chart);
    }
    // 处理图内排序设置
    if (chart.data && chart.data.sort) {
      handleSort(modules, chart);
    }
    this.initModules(chart, "data", dataModules);
    this.initModules(chart, "styles", stylesModules);
  }

  /**
   * 注册模块
   * @param chart
   * @param type
   * @param moduleKeys
   */
  initModules(chart: H3.Report.Chart, type: string, moduleKeys: string[]) {
    moduleKeys.forEach((moduleKey: string) => {
      // @ts-ignore
      this[type][moduleKey] = new Modules[
        moduleKey.replace(moduleKey[0], moduleKey[0].toLocaleUpperCase())
      ]();
    });
  }

  /**
   * 处理模块初始化之后数据
   * @param chart
   * @param oModules 旧模块
   */
  handleModules(chart: H3.Report.Chart, oModules?: H3.Report.Global) {
    const dataKeys = Object.keys(this.data);
    const styleKeys = Object.keys(this.styles);
    styleKeys.push("openGroupFilter");
    Object.keys(chart.data).forEach((key: string) => {
      if (!dataKeys.includes(key) && key !== "title") {
        delete chart.data[key];
      }
    });
    Object.keys(chart.styles).forEach((key: string) => {
      if (!styleKeys.includes(key)) {
        delete chart.styles[key];
      }
    });
    const modules = Object.assign({}, this.data, this.styles);
    // 集成方自定义表格行列数量
    Object.keys(modules).forEach((key: string) => {
      if (
        [ElementType.LIST, ElementType.TABLE,ElementType.CROSSTABLE].includes(chart.type) &&
        options.charts[chart.type] &&
        options.charts[chart.type][key] &&
        modules[key].max
      ) {
        modules[key].max = options.charts[chart.type][key];
      }
      modules[key].handleChartData(chart);
    });
    if (oModules) {
      Object.keys(oModules).forEach((moduleType: string) => {
        Object.keys(oModules[moduleType]).forEach((module: string) => {
          chart[moduleType][module] = oModules[moduleType][module];
        });
      });
    }

    // 多余条件格式设置
    if (chart.type !== ElementType.LIST) {
      if (chart.data && chart.data.dimension && chart.data.dimension.length) {
        chart.data.dimension.forEach((item, index) => {
          if (item.options.conditionFormat) {
            delete item.options.conditionFormat;
          }
        }); 
        if (chart.conditionFormats) {
          chart.conditionFormats = [];
        }
       }
    }
  }
}
