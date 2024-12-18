import Modules from "../../modules";
import { ElementType } from "../../../enum/chart-type";
import options from "../../../options";
import { handleInnerFilter } from "./utils";

export default class BaseChartModules implements H3.ReportModules.ChartModules {
  data: H3.ReportModules.ChartDataModules = {};
  styles: H3.ReportModules.ChartStylesModules = {};
  /**
   * 构建函数
   * @param chart
   * @param modules
   */
  constructor(
    chart: H3.Report.Chart,
    modules?: H3.Report.Global,
    defaultOptions?: H3.Analysis.ChartModules
  ) {
    // 初始化渲染data模块
    let dataModules: Array<string> = ["innerFilter"];
    let stylesModules: Array<string> = [];
    // 通过传入的模块配置 初始化对应的模块
    if (defaultOptions) {
      let moduleKey : any;
      for (moduleKey in defaultOptions) {
        if (defaultOptions.hasOwnProperty(moduleKey)) {
          const item = defaultOptions[moduleKey];
          if (item && !!item.parentNodeKey && item.parentNodeKey === "data") {
            dataModules.push(moduleKey);
          } else {
            stylesModules.push(moduleKey);
          }
        }
      }
    } else {
      dataModules = ["dimension", "metric"];
    }
    // 处理图内筛选器
    if (chart.data && chart.data.innerFilter) {
      handleInnerFilter(modules, chart);
    }
    this.initModules(chart, "data", dataModules, defaultOptions);
    this.initModules(chart, "styles", stylesModules, defaultOptions);
  }

  /**
   * 注册模块
   * @param chart
   * @param type
   * @param moduleKeys
   */
  initModules(
    chart: H3.Report.Chart,
    type: string,
    moduleKeys: string[],
    defaultOptions?: H3.Analysis.ChartModules
  ) {
    try {
      // 实例化组件
      moduleKeys.forEach((moduleKey: string) => {
        const def = defaultOptions && defaultOptions[moduleKey] ? defaultOptions[moduleKey] : null;
        // @ts-ignore
        this[type][moduleKey] = new Modules[
            moduleKey.replace(moduleKey[0], moduleKey[0].toLocaleUpperCase())
            ](def);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 处理模块初始化之后数据
   * @param chart
   * @param oModules 旧模块
   */
  handleModules(chart: H3.Report.Chart, oModules?: H3.Report.Global) {
    const dataKeys = Object.keys(this.data);
    const styleKeys = Object.keys(this.styles);
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
    Object.keys(modules).forEach((key: string) => {
      // 只针对明细表和透视表行列做控制
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
  }
}
