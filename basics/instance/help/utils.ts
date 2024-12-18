import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { ModuleType } from "@h3/report-mobile/basics/enum/chart-modules-type";
import { objectDeepCopy } from "@h3/report-mobile/basics/utils/object";
/**
 * 模块分组配置信息 适用于统计分析
 */
export const defaultGroupOptions: {
  title: string;
  key: string;
  childModules: ModuleType[];
}[] = [
  {
    title: "$r_language.Analysis.mudules.optionsTitle.compareDate$",
    key: "compareData",
    childModules: [ModuleType.CompareData]
  },
  {
    title: "$r_language.Analysis.mudules.optionsTitle.styleOption$",
    key: "styleOption",
    childModules: [
      ModuleType.GaugeMode,
      ModuleType.Theme,
      ModuleType.Legend,
      ModuleType.Limit,
      ModuleType.DataLabel,
      ModuleType.ProgressLabel,
      ModuleType.MetricValue,
      ModuleType.MetricLabel,
      ModuleType.Invert,
      ModuleType.MultipleDataLabel
    ]
  },
  
  {
    title: "$r_language.Analysis.mudules.optionsTitle.axisXOption$",
    key: "axisXOption",
    childModules: [ModuleType.AxisX]
  },
  {
    title: "$r_language.Analysis.mudules.optionsTitle.axisYOption$",
    key: "axisYOption",
    childModules: [ModuleType.MetricRange, ModuleType.AxisYSet, ModuleType.SplitLine]
  },
  {
    title: "$r_language.Analysis.mudules.optionsTitle.moreOrder$",
    key: "moreOrder",
    childModules: [ModuleType.MoreOrderNumber]
  } ,
  {
    title: "$r_language.Analysis.mudules.optionsTitle.mapDigitalDisplaySet$",
    key: "mapDigitalDisplaySet",
    childModules: [ModuleType.MapDigitalSet]
  },
  {
    title: "$r_language.Analysis.mudules.optionsTitle.crossSummary$",
    key: "crossSummary",
    childModules: [ModuleType.CrossSummary]
  } ,
];

/**
 * 获取模块组
 */
const getModulesGroup = (title, childModules, tip?, classify?) => {
  return {
    title: title,
    tip: tip,
    display: true,
    isGroup: true,
    classify: classify ||  null,
    childModules: childModules
  };
};

/***
 * 获取按照模块分组以后的功能模块模块群
 */
export const getChartModulesGroups = (
  modules: H3.Analysis.ChartModules,
  groupOtions: {
    title: string;
    tip?: string;
    key: string;
    classify?: string;
    childModules: ModuleType[];
  }[] = defaultGroupOptions
) => {
  const formateGroupModules:
    | { [key: string]: H3.Analysis.ModuleGroup }
    | H3.Analysis.ChartModules = objectDeepCopy(modules);

  groupOtions.forEach(g => {
    if (g.childModules) {
      let childModules: H3.Analysis.ChartModules = {};
      g.childModules.forEach(m => {
        if (formateGroupModules[m]) {
          childModules[m] = formateGroupModules[m];
          delete formateGroupModules[m];
        }
      });
      if (Object.keys(childModules).length > 0) {
        formateGroupModules[g.key] = getModulesGroup(g.title, childModules, g.tip,g.classify);
      }
    }
  });

  return formateGroupModules;
};

/**
 * 获取主图表类型
 * @param t 图表类型
 */
export const getMainType = t => {
  let type = t;
  switch (type) {
    case ElementType.BAR:
    case ElementType.PILEBAR:
    case ElementType.PILESTRIPE:
    case ElementType.STRIPE:
      type = ElementType.BAR;
      break;
    case ElementType.LINE:
    case ElementType.AREA:
      type = ElementType.LINE;
      break;
    default:
      break;
  }
  return type;
};
