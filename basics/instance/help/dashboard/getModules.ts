import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { ModuleType } from "@h3/report-mobile/basics/enum/chart-modules-type";
import { ChartModulesOptions } from "./chart-modules-options";
import { defaultOptions } from "../default-modules-options";
import { getMainType } from "../utils";
// import { anaiysisColors } from "@h3/report-mobile/basics/enum/colors";
/**
 * 初始化示例
 */
const BaseModules: H3.Analysis.ChartModules | any = {
  chartSwitch: {
    display: true
  }
};
/**
 * 统计分析 获取基础图表类型的配置项
 * @param chartType 图表类型
 */
export const getBaseModules = (
  chartType: ElementType = ElementType.BAR,
  customSetting?: (p: H3.Analysis.ChartModules) => {}
): H3.Analysis.ChartModules => {
  let moduleOptions = JSON.parse(JSON.stringify(BaseModules));
  ChartModulesOptions[chartType].forEach(m => {
    if (defaultOptions[m]) {
      moduleOptions[m] = JSON.parse(JSON.stringify(defaultOptions[m]));
    }
  });
  switch (chartType) {
    // 柱状图 折线图
    case ElementType.BAR:
      break;
    case ElementType.LINE:
      break;
    // 饼图
    case ElementType.PIE:
    // moduleOptions[ModuleType.FontSetting].displayFontSize = true;
      break;
    // 雷达图
    case ElementType.RADAR:
      break;
    // 透视图
    case ElementType.TABLE:
      moduleOptions[ModuleType.FreezeHead].rowTitle = "冻结行维度";
      moduleOptions[ModuleType.FreezeHead].rowNumberTitle = "冻结行维度数";
      moduleOptions[ModuleType.FreezeHead].columnTitle =
        "$r_language.modules.FreezeHead.columnTitle_sheet$";
      moduleOptions[ModuleType.Dimension].title = "行维度";
      moduleOptions[ModuleType.Dimension].tip = "【行维度】是对透视表行数据做分类的依据";
      break;
    // 指标图
    case ElementType.CARD:
      const dataChange = (chart: H3.Report.Chart, chartModules) => {
        if (chart.data.dimension.length === 0) {
          if (chartModules[ModuleType.Limit]) {
            chartModules[ModuleType.Limit].display = false;
          }
          if (chartModules[ModuleType.Sort]) {
            chartModules[ModuleType.Sort].display = false;
          }
          if (chartModules[ModuleType.FilterNone]) {
            chartModules[ModuleType.FilterNone].display = false;
          }
          if (chartModules[ModuleType.MetricLabel]) {
            chartModules[ModuleType.MetricLabel].display = true;
          }
        } else {
          chartModules[ModuleType.Limit].display = true;
          chartModules[ModuleType.Sort].display = true;
          chartModules[ModuleType.MetricLabel].display = false;
          chartModules[ModuleType.FilterNone].display = true;
        }
      };
      moduleOptions[ModuleType.Dimension].change = dataChange;
      moduleOptions[ModuleType.Metric].change = dataChange;
      break;
    // 漏斗图
    case ElementType.FUNNEL:
      // moduleOptions[ModuleType.Sort].display = false;
      break;
    // 气泡图
    case ElementType.SCATTER:
      break;
    // 双轴图
    case ElementType.BIAX:
      break;

    case ElementType.MAP:
      moduleOptions[ModuleType.Dimension].supportedTypes = ["address"];
      // console.log("mapOptions:", moduleOptions[ModuleType.ChartSwitch]);
      break;
    case ElementType.CROSSTABLE:
      moduleOptions[ModuleType.FreezeHead].rowTitle = "冻结行维度";
      moduleOptions[ModuleType.FreezeHead].rowNumberTitle = "冻结行维度数";
      moduleOptions[ModuleType.FreezeHead].columnTitle =
        "$r_language.modules.FreezeHead.columnTitle_sheet$";
      moduleOptions[ModuleType.Dimension].title = "行维度";
      moduleOptions[ModuleType.Dimension].tip = "【行维度】是对交叉表行数据做分类的依据";
      moduleOptions[ModuleType.GroupDimension].tip = "【列维度】是对交叉表列数据做分类的依据";
      break;
    default:
      break;
  }
  // moduleOptions[ModuleType.Theme].default = false;

  // 自定义处理
  if (customSetting) {
    moduleOptions = customSetting(moduleOptions);
  }

  return moduleOptions;
};
