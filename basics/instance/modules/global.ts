import Vue from "vue";
import Modules from ".";
import colors from "../../enum/colors";
import Module from "./module";
import { recursion, compare } from "../../utils/object-key-compare";
import { Color } from "@h3/report-mobile/basics/enum/paint";

const defaultOptions: H3.Report.Global = {
  data: {} as H3.Report.ChartDataGroup,
  styles: {
    theme: colors[0],
    paintCoatTheme: "default",
    paintCoat: {
      type: "bgColor",
      value: Color.PAINTCOATVALUE
    },
    elementCoat: {
      type: "bgColor",
      value: Color.ELEMENTCOATVALUE
    },
    fontSetting: {
      titleColor: Color.DARKTITLECOLOR,
      fontColor: null
    }
  }
};

class GlobalModules {
  data: H3.ReportModules.ChartDataModules = {};
  styles: H3.ReportModules.ChartStylesModules = {};
  constructor(global: H3.Report.Global) {
    const stylesModules = ["theme", "paintCoatTheme", "paintCoat", "elementCoat", "fontSetting"];
    this.initModules(global, "styles", stylesModules);
    this.initElementModules();
    this.handleModules(global);
  }

  initModules(global: H3.Report.Global, type: string, moduleKeys: string[]) {
    moduleKeys.forEach((moduleKey: string) => {
      // @ts-ignore
      this[type][moduleKey] = new Modules[
        moduleKey.replace(moduleKey[0], moduleKey[0].toLocaleUpperCase())
      ](global ? global[type] : null);
    });
  }
  initElementModules() {
    if (this.styles.paintCoat) {
      this.styles.paintCoat.defaultColor = Color.PAINTCOATVALUE;
    }
    if (this.styles.elementCoat) {
      this.styles.elementCoat.defaultColor = Color.ELEMENTCOATVALUE;
    }
    if (this.styles.fontSetting) {
      this.styles.fontSetting.defaultFontColor = Color.FONTCOLOR;
      this.styles.fontSetting.defaultTitleColor = Color.TITLECOLOR;
    }
  }
  /**
   * 处理模块初始化之后数据
   * @param global
   */
  handleModules(global: H3.Report.Global) {
    const dataKeys = Object.keys(this.data);
    const styleKeys = Object.keys(this.styles);
    if (global.data) {
      Object.keys(global.data).forEach((key: string) => {
        if (!dataKeys.includes(key) && global.data) {
          delete global.data[key];
        }
      });
    }
    Object.keys(global.styles).forEach((key: string) => {
      if (!styleKeys.includes(key)) {
        delete global.styles[key];
      }
    });
    [...Object.values(this.data), ...Object.values(this.styles)].forEach((module: Module) => {
      module.handleChartData((global as unknown) as H3.Report.Chart);
    });
  }
}

/**
 * 初始化全局配置
 */
export default (global: H3.Report.Global | any = { styles: {} }) => {
  // 对比 - 对象中的key并赋值初始值
  recursion(defaultOptions.styles, compare, [], defaultOptions.styles, global.styles);
  const modules = new GlobalModules(global);
  return { global, modules };
};
