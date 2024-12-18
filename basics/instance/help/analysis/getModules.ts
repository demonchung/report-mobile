import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { ModuleType } from "@h3/report-mobile/basics/enum/chart-modules-type";
import { ChartModulesOptions } from "./chart-modules-options";
import { defaultOptions } from "../default-modules-options";
import { getMainType } from "../utils";
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
  const realType = getMainType(chartType);
  ChartModulesOptions[realType].forEach((m) => {
    if (defaultOptions[m]) {
      moduleOptions[m] = JSON.parse(JSON.stringify(defaultOptions[m]));
    }
  });
  // todo 等统计分析支持地址字段就可以删掉
  if(moduleOptions[ModuleType.Dimension]) {
    moduleOptions[ModuleType.Dimension].supportedTypes = ["string", "date"];
  }
  if(moduleOptions[ModuleType.GroupDimension]) {
    moduleOptions[ModuleType.GroupDimension].supportedTypes = ["string", "date"];
  }
  if(moduleOptions[ModuleType.Metric]) {
    moduleOptions[ModuleType.Metric].supportedTypes = ["string", "number", "date"];
  }
  if(moduleOptions[ModuleType.Filter]) {
    moduleOptions[ModuleType.Filter].supportedTypes = ["string", "number", "date", "address"];
  } 
  if( moduleOptions[ModuleType.Sort]) {
    moduleOptions[ModuleType.Sort].supportedTypes = ["string", "number", "date"];
  }
  if(moduleOptions[ModuleType.MetricGroup]) {
    moduleOptions[ModuleType.MetricGroup].data.forEach((item=> {
      item.supportedTypes = ["string", "number", "date"];
    }));
  }

  switch (realType) {
    // 柱状图 折线图
    case ElementType.BAR:
    case ElementType.LINE:
      break;
    // 饼图
    case ElementType.PIE:
      // moduleOptions[ModuleType.Legend].default ={}
      break;
    // 雷达图
    case ElementType.RADAR:
      break;
    case ElementType.PROGRESSBAR:
      const dimensionChange = (chart: H3.Report.Chart, chartModules) => {
        if(!(chart.data && chart.data.dimension && chart.data.dimension.length && chart.data.dimension[0].type === "date"))
        {
          for(let i = 0; i < chart.data.metric.length; i++){
            delete chart.data.metric[i].options.ratio ;
          }
        }  
      };
      moduleOptions[ModuleType.Dimension].change = dimensionChange;
    break;
      case ElementType.CROSSTABLE:
        const change = (chart: H3.Report.Chart, chartModules) => {
          let rowIds:any = [];
          let columnIds:any = [];
          if(chart.data.dimension && chart.data.dimension.length > 1) {
            rowIds = chart.data.dimension.slice(0,chart.data.dimension.length -1).map(item=> item.uid)
          }
          if(chart.data.groupDimension && chart.data.groupDimension.length > 1) {
            columnIds = chart.data.groupDimension.slice(0,chart.data.groupDimension.length -1).map(item=> item.uid)
          }
          if(chart.data.crossSummary) {
            if(chart.data.crossSummary.rowSummaries) {
              chart.data.crossSummary.rowSummaries.forEach((item)=> {
                if(item.dimIds) {
                  item.dimIds = item.dimIds.filter(id=>rowIds.includes(id))
                }
              })
            }
          }
          if(chart.data.crossSummary) {
            if(chart.data.crossSummary.columnSummaries) {
              chart.data.crossSummary.columnSummaries.forEach((item)=> {
                if(item.dimIds) {
                  item.dimIds = item.dimIds.filter(id=>columnIds.includes(id))
                }
              })
            }
          } 
        };
        // moduleOptions[ModuleType.FreezeHead].displayRowNumber = true;
        moduleOptions[ModuleType.Dimension].title = "$r_language.Analysis.design.fieldName.rowDim$";
        moduleOptions[ModuleType.Dimension].tip = "$r_language.Analysis.design.fieldName.ctip_rd$";
        moduleOptions[ModuleType.GroupDimension].tip = "$r_language.Analysis.design.fieldName.ctip_cd$";
        moduleOptions[ModuleType.PageSet].display = false;

        moduleOptions[ModuleType.Dimension].change = change;
        moduleOptions[ModuleType.GroupDimension].change = change;

     
        break;
    // 透视图
    case ElementType.TABLE:
      moduleOptions[ModuleType.Dimension].title = "$r_language.Analysis.design.fieldName.rowDim$";
      moduleOptions[ModuleType.Dimension].tip = "$r_language.Analysis.design.fieldName.tip_tableC$";
      break;
    // 指标图
    case ElementType.CARD:
      const dataChange = (chart: H3.Report.Chart, chartModules) => {
        if (chart.data.dimension.length === 0) {
          if (chartModules[ModuleType.Limit]) {
            chartModules[ModuleType.Limit].display = false;
          }
          if (chartModules[ModuleType.Limit]) {
            chartModules[ModuleType.Sort].display = false;
          }
        } else {
          chartModules[ModuleType.Limit].display = true;
          chartModules[ModuleType.Sort].display = true;
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
    case ElementType.GAUGE: 
      moduleOptions[ModuleType.Dimension].display = false;
      
      break;
    default:
      break;
  }
  // moduleOptions[ModuleType.Filter].display = false;

  // 自定义处理
  if (customSetting) {
    moduleOptions = customSetting(moduleOptions);
  }

  return moduleOptions;
};
