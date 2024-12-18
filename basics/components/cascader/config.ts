/**
 * 该文件处理显示、数据构造
 */

import enumType, { DateType } from "@h3/report-mobile/basics/enum/aggregate-type";
import ratio from "@h3/report-mobile/basics/enum/ratio";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";

/**
 * 枚举映射
 * @param item
 * @param data
 */
const enumTypeData = function(item: H3.CascaderNode, enumData: Array<any> = [], funName: string) {
  enumData.forEach((enumItem: any, index: number) => {
    const child: any = {
      displayName: enumItem.label,
      subShow: false,
      isShow: true,
      level: 2,
      method: { funName: funName },
      children: [],
      checked: index === 0 ? true : false,
      value: enumItem.value
    };
    // 同/环比分析、默认不选中
    if (funName === "ratioAnalyze") {child.checked = false;}
    (item as any).children.push(child);
  });
};

/**
 * 修改项 - 赋值
 * @param item
 * @param param
 */
const assignValue = function(item: H3.CascaderNode, param: any, source: string) {
  (item as any).children.forEach(child => {
    // 汇总方式
    if (source === "aggregateType") {
      if (param.data.specialType === "address") {
        if (param.source === "dimension" || param.source === "groupDimension") {
          child.value === param.data.options.areaType
            ? (child.checked = true)
            : (child.checked = false);
        } else {
          child.value === param.data.options.aggregateType
            ? (child.checked = true)
            : (child.checked = false);
        }
      } else if (param.data.type === "number") {
        child.value === param.data.options.aggregateType
          ? (child.checked = true)
          : (child.checked = false);
      } else if (
        (param.source === "dimension" || param.source === "groupDimension") &&
        param.data.type === "date"
      ) {
        child.value === param.data.options.format
          ? (child.checked = true)
          : (child.checked = false);
      } else {
        child.value === param.data.options.aggregateType
          ? (child.checked = true)
          : (child.checked = false);
      }
    }
    // 汇总结果
    else if (source === "aggregateResult") {
      param.data.options && child.value === param.data.options.percent
        ? (child.checked = true)
        : (child.checked = false);
    }
    // 同/环比分析
    else {
      if (source === "ratioAnalyze") {
        child.value === param.data.options.ratio ? (child.checked = true) : (child.checked = false);
      }
    } 
  });
};

/**
 * 汇总方式处理
 * @param item
 * @param data
 * todo 需要改造 代码逻辑过于冗余,不好维护
 */
const handleAggregateType = function (item: H3.CascaderNode, param: any) {
  if (param.chart.type === ElementType.LIST) {
    // 明细表 - 不存在汇总方式
    // item.isShow = false;
    if (param.data.specialType === "address") {
      item.displayName = "$r_language.config.menulistName.format$"; //数据格式
      enumTypeData(item, enumType.listAddress, "aggregateType");
    } else if (param.data.type === "number") {
      item.isShow = true;
      item.displayName = "汇总方式"; //明细表汇总方式
      enumTypeData(item, enumType.listNumber, "aggregateType");
    } else {
      item.isShow = false;
    }
  } else if (param.chart.type === ElementType.MAP) {
    if (param.source === "metric") {
      if (param.data.type === "number") {
        if (param.data.options.isAggregate) {
          item.isShow = false;
        } else {
          enumTypeData(item, enumType.addressToNumber, "aggregateType");
        }
      } else {
        enumTypeData(item, enumType.string, "aggregateType");
      }
    } else {
      item.isShow = false;
    }
  } else {
    // 地址字段维度有汇总方式，指标不支持汇总方式
    if (param.data.specialType === "address") {
      if (param.source === "dimension" || param.source === "groupDimension") {
        enumTypeData(item, enumType.address, "aggregateType");
        // 指标 - 日期字段隐藏
      } else {
        // 维度 - 日期字段
        enumTypeData(item, enumType.string, "aggregateType");
      }
    } else if (param.data.type === "string") {
      if (param.source === "dimension" || param.source === "groupDimension") {
        item.isShow = false;
      } else {
        enumTypeData(item, enumType.string, "aggregateType");
      }
      // 字符串字段隐藏
    } else if (param.data.type === "date") {
      if (
        param.data.options &&
        param.data.options.aggregateType &&
        param.source.indexOf("metric") != -1
      ) {
        // 指标 - 日期字段隐藏
        enumTypeData(item, enumType.string, "aggregateType");
      } else {
        // 维度 - 日期字段
        enumTypeData(item, enumType.date, "aggregateType");
      }
    } else {
      if (param.data.type === "number") {
        if (param.data.options.isAggregate) {
          item.isShow = false;
        }
        if (param.source === "dimension") {
          item.isShow = false;
        }
        // 指标 - 数值字段
        if (param.chart.type === ElementType.MAP) {
          enumTypeData(item, enumType.addressToNumber, "aggregateType");
        } else {
          enumTypeData(item, enumType.number, "aggregateType");
        }
      }
    }
  }
  // 修改项 - 赋值
  assignValue(item, param, "aggregateType");
};

/**
 * 汇总结果处理
 */
const handleAggregateTypeResult = function (
  item: H3.CascaderNode,
  param: any,
  menuList: Array<H3.CascaderNode>
) {
  const dimensionLength = param.chart.data.dimension.length;
  const metricLength = param.chart.data.metric.length;
  // 指标图 - 0维1标 - 没有汇总结果显示功能
  if (param.chart.type === ElementType.CARD && dimensionLength === 0 && metricLength === 1) {
    item.isShow = false;
  }
  if (
    param.chart.type === ElementType.PERCENTPILEBAR ||
    param.chart.type === ElementType.PERCENTPILESTRIPE
  ) {
    item.isShow = false;
  }
  // 进度图 - 0维不展示汇总结果显示
  // else if (param.chart.type === ElementType.PROGRESSBAR && dimensionLength === 0) {
  //   item.isShow = false;
  // }
  // 透视图、饼图、明细表、散点、地图、仪表图、进度图 - 没有汇总结果显示功能
  else {
    if (
      param.chart.type === ElementType.TABLE ||
      param.chart.type === ElementType.CROSSTABLE ||
      param.chart.type === ElementType.PIE ||
      param.chart.type === ElementType.LIST ||
      param.chart.type === ElementType.SCATTER ||
      param.chart.type === ElementType.MAP ||
      param.chart.type === ElementType.GAUGE ||
      param.chart.type === ElementType.PROGRESSBAR
    ) {
      item.isShow = false;
    }
  }

  // 指标 指标和指标组 - 只有指标才存在汇总结果显示功能
  if (param.source.indexOf("metric") < 0) {
    item.isShow = false;
  }
  // 汇总方式 - 求和、计数才有汇总结果显示功能
  (menuList[1] as any).children.forEach((child: any) => {
    if (child.checked) {
      if (child.value !== "SUM" && child.value !== "COUNT") {
        item.isShow = false;
      }
    }
  });
  enumTypeData(item, enumType.aggregateResult, "aggregateResult");
  // 修改项 - 赋值
  assignValue(item, param, "aggregateResult");
};

/**
 * 同/环比分析（维度中有且只有一个日期字段时才可以使用同/环比分析，指标字段只支持总和/计数）
 * @param node
 * @param param
 */
const handleRatioAnalyze = function (node: H3.CascaderNode, param: any) {
  // 维度 - 不存在同/环比分析功能  指标和指标组
  if (param.source.indexOf("metric") < 0 || param.chart.type === "funnelCompare") {
    node.isShow = false;
  } else {
    let sum: number = 0;
    const newDimensionArr: Array<any> = [];
    // 维度
    param.chart.data.dimension.forEach(item => {
      if (item.type === "date") {
        sum += 1;
        newDimensionArr.push(item);
      }
    });
    // 分组维度
    if (param.chart.data.groupDimension) {
      param.chart.data.groupDimension.forEach(item => {
        if (item.type === "date") {
          sum += 1;
          newDimensionArr.push(item);
        }
      });
    }
    // 等于1且等于总和值/计数时，才显示同/环比分析
    if (
      sum === 1 &&
      (param.data.options.aggregateType === "SUM" ||
        param.data.options.aggregateType === "COUNT" ||
        param.data.options.aggregateType === "COUNTDISTINCT")
    ) {
      const index = newDimensionArr[0].options.format;
      // 为支持旧报表的新日期汇总方式暂不支持配置同环比分析
      const disabledFormat = [DateType.Q, DateType.QM, DateType.QMD, DateType.YQM, DateType.YQMD];
      if (disabledFormat.includes(index)) {
        node.isShow = false;
      }
      enumTypeData(node, ratio[index], "ratioAnalyze");
    } else {
      node.isShow = false;
    }
    // 饼图,百分比堆积图暂时隐藏同环比分析功能,
    if (
      param.chart.type === ElementType.PIE ||
      param.chart.type === ElementType.SCATTER ||
      param.chart.type === ElementType.PERCENTPILEBAR ||
      param.chart.type === ElementType.PERCENTPILESTRIPE
    ) {
      node.isShow = false;
    }
  }
  // 修改项 - 赋值
  assignValue(node, param, "ratioAnalyze");
};

/**
 * 显示数值格式设置
 * @param params
 */
const showNumberFormat = function (item: H3.CascaderNode, param: any) {
  // 散点图 - 没有数值格式设置
  //百分比堆叠图暂时关闭数值格式设置功能
  if (param.chart.type === ElementType.SCATTER || 
    param.chart.type === ElementType.PERCENTPILEBAR ||
    param.chart.type === ElementType.PERCENTPILESTRIPE) {
    item.isShow = false;
  }
  // 指标 或者指标组 - 只有指标才存在数值格式设置
  if (param.source.indexOf("metric") < 0) {
    item.isShow = false;
  }
  // 明细表 数值格式设置
  if (param.chart.type === ElementType.LIST && param.data.type === "number") {
    item.isShow = true;
  }
};

/**
 * 显示数值格式设置
 * @param params
 */
const showResultFilter = function (item: H3.CascaderNode, param: any) {
  // 明细表 - 没有数值格式设置
  if (
    param.chart.type === ElementType.LIST ||
    param.chart.type === ElementType.TABLE ||
    param.chart.type === ElementType.CROSSTABLE ||
    param.chart.type === ElementType.MAP
  ) {
    item.isShow = false;
  }
  // 散点图 - 没有数值格式设置
  // if (param.chart.type === 'scatter') {
  //   item.isShow = false;
  // }
  // 指标 或者指标组- 只有指标才存在数值格式设置
  if (param.source.indexOf("metric") < 0) {
    item.isShow = false;
  }
};

/**
 * 隐藏字段
 */
const handleHiddenField = (item: H3.CascaderNode, param: any) => {
  if (param.chart.type === ElementType.LIST) {
    // 只有明细表的字段有这个功能
    item.isShow = true;
    item.checked = param.data && param.data.options && param.data.options.hidden;
  }
};
/**
 * 显示为数据条  只提供给number类型的维度使用
 */
const handleTransformBar = (item: H3.CascaderNode, param: any) => {
  // if (param.chart.type === ElementType.LIST && param.data && param.data.type === "number") {
  //   item.isShow = true;
  //   item.checked = param.data && param.data.options && param.data.options.transformBar;
  // }
};

/**
 * 明细表日期格式设置
 * @param item
 * @param params
 */
const handleDateFormat = (item: H3.CascaderNode, param: any) => {
  if (param.chart.type === ElementType.LIST && param.data.type === "date") {
    // 只有明细表的字段有这个功能
    item.isShow = true;
  }
};

/**
 * 目标值设置
 * @param item
 * @param param
 */
const handleTargetValue = (item: H3.CascaderNode, param: any) => {
  if (
    param.source === "metric" &&
    (param.chart.type === ElementType.PROGRESSBAR || param.chart.type === ElementType.GAUGE)
  ) {
    item.isShow = true;
  }
};

/**
 * 条件格式设置
 * @param item
 * @param param
 */
 const handleConditionFormat = (item: H3.CascaderNode, param: any) => {
  if (
    param.source === "dimension" && param.chart.type === ElementType.LIST
  ) {
    // 企微环境的人员和部门显示编码, 会导致条件设置不生效, 
    // 由于报表仅能区分人员部门字段为string类型, 无法针对企微环境的人员和部门字段进行区分, 所以企微环境文本类型的字段不显示条件设置
    if (param.isWxwork) {
      item.isShow = param.data.type === "number";
    } else {
      item.isShow = (param.data.type === "number" || param.data.type === "string");
    }
  }
 }

/**
 * 构造menuList子集数据
 * @param data
 */
const createChildData = function (params: {
  chart: H3.Report.Chart;
  data: H3.Report.FieldColumn;
  source: string;
}) {
  const menuList: Array<H3.CascaderNode> = [
    {
      key: "title",
      //displayName: "修改显示名",
      displayName: "$r_language.config.menulistName.title$",
      isShow: true,
      subShow: false,
      level: 1,
      method: { funName: "title" },
      children: []
    },
    {
      key: "hiddenField",
      //displayName: " 隐藏字段",
      displayName: "$r_language.config.menulistName.hiddenField$",
      isShow: false,
      subShow: false,
      level: 1,
      checked: false,
      method: { funName: "hiddenField" },
      children: []
    },
    {
      key: "aggregateType",
      isShow: true,
      //displayName: "汇总方式",
      displayName: "$r_language.config.menulistName.aggregateType$",
      subShow: false,
      level: 1,
      children: []
    },
    {
      key: "aggregateResult",
      isShow: true,
      //displayName: "汇总结果显示",
      displayName: "$r_language.config.menulistName.aggregateResult$",
      subShow: false,
      level: 1,
      children: []
    },
    {
      key: "ratioAnalyze",
      isShow: true,
      //displayName: "同/环比分析",
      displayName: "$r_language.config.menulistName.ratioAnalyze$",
      subShow: false,
      level: 1,
      children: []
    },
    {
      key: "numberFormat",
      isShow: true,
      //displayName: "数值格式设置",
      displayName: "$r_language.config.menulistName.numberFormat$",
      subShow: false,
      level: 1,
      method: { funName: "numberFormat" },
      children: []
    },
    {
      key: "resultFilter",
      isShow: true,
      //displayName: "结果筛选器1",
      displayName: "$r_language.config.menulistName.resultFilter$",
      subShow: false,
      level: 1,
      method: { funName: "resultFilter" },
      children: []
    },
    {
      key: "dateFormat",
      isShow: false,
      //displayName: "日期格式设置",
      displayName: "$r_language.config.menulistName.dateFormat$",
      subShow: false,
      level: 1,
      method: { funName: "dateFormat" },
      children: []
    },
    {
      key: "targetValue",
      isShow: false,
      //displayName: "目标值",
      displayName: "$r_language.config.menulistName.targetValue$",
      subShow: false,
      level: 1,
      method: { funName: "targetValue" },
      children: []
    },
    {
      key: "transformBar",
      //displayName: "显示为数据条",
      displayName: "$r_language.config.menulistName.transformBar$",
      isShow: false,
      subShow: false,
      level: 1,
      checked: false,
      method: { funName: "transformBar" },
      children: []
    },
    {
      key: "conditionFormat",
      isShow: false,
      displayName: "条件格式设置",
      subShow: false,
      level: 1,
      method: { funName: "conditionFormat" },
      children: []
    }
  ];
  menuList.forEach((item: H3.CascaderNode) => {
    switch (item.key) {
      // 汇总方式
      case "aggregateType":
        handleAggregateType(item, params);
        break;
      // 汇总结果显示
      case "aggregateResult":
        handleAggregateTypeResult(item, params, menuList);
        break;
      // 同/环比分析
      case "ratioAnalyze":
        handleRatioAnalyze(item, params);
        break;
      // 数值格式设置
      case "numberFormat":
        showNumberFormat(item, params);
        break;
      // 数值类型结果筛选器设置
      case "resultFilter":
        showResultFilter(item, params);
        break;
      // 明细表隐藏字段
      case "hiddenField":
        handleHiddenField(item, params);
        break;
      // 明细表日期格式设置
      case "dateFormat":
        handleDateFormat(item, params);
        break;
      // 目标值设定设置
      case "targetValue":
        handleTargetValue(item, params);
        break;
      // 目标值设定设置
      case "transformBar":
        handleTransformBar(item, params);
        break;
      // 条件格式设置
      case "conditionFormat":
        handleConditionFormat(item, params);
        break;  
      default:
        break;
    }
  });
  return menuList;
};

export default {
  createChildData
};
