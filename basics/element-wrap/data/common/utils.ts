import { maxDimension, maxDimensionColumns, maxGroup } from "../options";
import { forecastData } from "@h3/report-mobile/basics/utils/forecast";
import { addCNFormat } from "@h3/report-mobile/basics/utils/date";
import { checkForecast, getDataZoom, handleForecast } from "../../help/utils";
import customSort, { handleMetricRange, getObjArrSortResult } from "@h3/report-mobile/basics/utils/customSort";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";

/**
 * 处理二维柱图
 * @param options
 */
function processMutliDims(options, tData, { isPile = false }): H3.Chart.ChartData {
  let data: any;
  let dimensionLength: number = 0;
  let dimensionArray: any = [];
  let groupArray: any = [];
  let maxMetric: number = 0;
  let minMetric: number = 0;
  let groupNameArray: any = null;
  let groupLength = 0;
  let metricRangeData;
  let total: any;
  let fields: any = {};
  let group = {};
  // 处理特定数据
  ({
    groupArray,
    groupLength,
    dimensionArray,
    dimensionLength,
    minMetric,
    maxMetric,
    group,
    fields,
    total
  } = handleGroup({ data: tData, options, isPile }));

  //二维自定义排序
  const sortRes = handleGroupCustomSort({ options, groupArray, dimensionArray });

  if (sortRes[options.dimension.uid]) {dimensionArray = sortRes[options.dimension.uid];}
  if (sortRes[options.groupDimension.uid]) {groupArray = sortRes[options.groupDimension.uid];}

  ({ data, metricRangeData } = handleGroupData(
    dimensionArray,
    options.metricRange,
    group,
    fields,
    isPile
  ));

  //二维自定义排序修改metricRangeData数据
  if (options.groupDimension.options.isCustomSort) {
    metricRangeData = handleMetricRange(metricRangeData, group, groupArray, data);
  }
  const maxDms = getMaxDimension(maxDimension, maxDimensionColumns, groupLength);

  const chartData: H3.Chart.ChartData = {
    dimensionLength,
    dimensionArray,
    groupLength,
    groupArray,
    groupNameArray,
    maxMetric,
    minMetric,
    data,
    index: 0,
    metricRangeData,
    maxDimension: maxDms,
    total
  };
  return chartData;
}
/**
 * 处理一维柱图
 * @param options
 */
function processOneDim(
  options,
  tData,
  { isPile = false, metricKeySuffix = "" }
): H3.Chart.ChartData {
  let data: any;
  let dimensionLength: number = 0;
  let dimensionArray: any = [];
  let groupArray: any = [];
  let maxMetric: number = 0;
  let minMetric: number = 0;
  let groupNameArray: any = null;
  const groupLength = 0;
  let metricRangeData;
  let total: any;
  // 处理分组数据
  ({ groupArray, groupNameArray } = getGroupArray(options.metric));
  // 处理特定数据
  ({ total, metricRangeData, dimensionArray, dimensionLength, data } = handleData(
    tData,
    options.metric,
    options.dimension,
    metricKeySuffix
  ));
  // 一维自定义排序
  ({ data, metricRangeData } = handleCustomSort(options, data, metricRangeData));

  // 获取指标最大最小值
  ({ minMetric, maxMetric } = getMinAndMax(data, options.metricRange, isPile));

  const maxDms = getMaxDimension(maxDimension, maxDimensionColumns, groupLength);

  const chartData: H3.Chart.ChartData = {
    dimensionLength,
    dimensionArray,
    groupLength,
    groupArray,
    groupNameArray,
    maxMetric,
    minMetric,
    data,
    index: 0,
    metricRangeData,
    maxDimension: maxDms,
    total
  };
  return chartData;
}

// 处理空值
function defaultEmpty(data) {
  return data === 0 ? "0" : data || "为空";
}

/**
 * 处理原始数据
 *  */

function handleData(source, metrics, firstDimension, metricKeySuffix = "") {
  let data;
  let fields = {};
  let dimension;
  let total: any = [];
  let dimensionArray: any = [];
  let metricRangeData: any = {};
  source.forEach((item: any, rowIndex: number) => {
    item[firstDimension.uid] = defaultEmpty(item[firstDimension.uid]);
    // 为了解决数字维度带来的Object对象自动排序
    dimension = "tmp_" + item[firstDimension.uid];
    if (!fields[dimension]) {fields[dimension] = [dimension];}
    dimensionArray[rowIndex] = dimension;
    metrics.forEach((metric: H3.Report.FieldColumn, index: number) => {
      const num = item[metric.uid + metricKeySuffix];
      // 计算数值绝对值总和
      total[index] = total[index] || 0;
      total[index] += num;
      metricRangeData[dimension] = metricRangeData[dimension] || [];
      metricRangeData[dimension][index] = metricRangeData[dimension][index] || 0;
      metricRangeData[dimension][index] += num;
      fields[dimension][index + 1] = fields[dimension][index + 1] || 0;
      fields[dimension][index + 1] += num;
    });
  });
  data = Object.values(fields).map((item: Array<any>) => {
    item[0] = item[0].replace("tmp_", "");
    return item;
  });
  metricRangeData = Object.values(metricRangeData);
  return {
    data,
    dimensionArray,
    total,
    metricRangeData,
    dimensionLength: data.length
  };
}

// 处理自定义排序
function handleCustomSort(options, data, metricRangeData) {
  const firstDimension = options.dimension;

  if (firstDimension.options && firstDimension.options.isCustomSort) {
    const sortKeyValue = {};
    sortKeyValue[firstDimension.uid] = data;
    const sortRes = customSort(sortKeyValue, false, options.customSort, options.dataAlias);
    data = sortRes[firstDimension.uid];
    metricRangeData = sortRes.metricRangeData || metricRangeData;
  }
  return { data, metricRangeData };
}

// 获取分组内容
function getGroupArray(metric) {
  let groupArray: any = [];
  let groupNameArray = {};
  groupArray = metric.map((field: H3.Report.FieldColumn) => {
    groupNameArray[field.uid] = field.alias || field.name;
    return field.uid;
  });
  return {
    groupNameArray,
    groupArray
  };
}
// 获取指标最大最小值
function getMinAndMax(data, metricRange, isPile?) {
  let maxMetric: number = 0;
  let minMetric: number = 0;
  data.forEach((item: any, rowIndex: number) => {
    let maxMetricSum: number = 0;
    item.forEach((cell: number, index: number) => {
      if (typeof cell === "number") {
        // 堆叠最大值按累计来算
        if (isPile) {
          maxMetricSum += item[index] || 0;
        } else {
          if (metricRange && metricRange.max !== null && cell > (metricRange as any).max) {
            item[index] = metricRange.max;
          } else {
             if (metricRange && metricRange.min !== null && cell < (metricRange as any).min) {
              item[index] = metricRange.min;
            } 
          }
          maxMetric = Math.max(maxMetric, item[index] || 0);
        }
        minMetric = Math.min(minMetric, item[index] || 0);
      }
    });
    if (isPile) {maxMetric = Math.max(maxMetric, maxMetricSum);}
  });
  return {
    minMetric,
    maxMetric
  };
}
// 获取最大维度数
function getMaxDimension(maxDms, maxDmsColumns, groupLength = 0) {
  let maxDims = maxDms;
  maxDims = parseInt((maxDmsColumns / groupLength).toString(), 10);
  maxDims = maxDims > maxDimension || isNaN(maxDims) ? maxDimension : maxDims;
  return maxDims;
}
// 处理二维图表的必要数据
function handleGroup({ data, options, isPile }) {
  const group = {};
  let groupName;
  const mergeGroup: Array<string> = [];
  const fields: any = {};
  let field: any = {};
  let dimension;
  let total = {};
  let groupArray: any = [];
  let groupLength = 0;
  let dimensionArray: any = [];
  let dimensionLength: number = 0;
  let maxMetric: number = 0;
  let minMetric: number = 0;
  const metrics = options.metric;
  const firstDms = options.dimension;
  const groupDms = options.groupDimension;
  const maxLimitGroup =
    options.groupSetting && options.groupSetting.limit ? options.groupSetting.limit : maxGroup;
  const showGroupOther = !options.groupSetting || options.groupSetting.showOther;
  data.forEach((item: any) => {
    if (!isPile) {maxMetric = Math.max(maxMetric, item[metrics[0].uid] || 0);}
    minMetric = Math.min(minMetric, item[metrics[0].uid] || 0);
    // 计算数值总和
    item[firstDms.uid] = defaultEmpty(item[firstDms.uid]);
    dimension = "tmp_" + item[firstDms.uid];
    if (!fields[dimension]) {fields[dimension] = {};}
    item[groupDms.uid] = defaultEmpty(item[groupDms.uid]);
    groupName = item[groupDms.uid];
    if (!Object.keys(group).includes(groupName)) {
      if (Object.keys(group).length < maxLimitGroup) {
        group[groupName] = 0;
      } else { 
          if (!mergeGroup.includes(groupName)) {
          mergeGroup.push(groupName);
        } 
      }
    }
    field = fields[dimension];
    if (mergeGroup.includes(groupName) && showGroupOther) {
      groupName = "其他";
    }
    field[groupName] = field[groupName] || 0;
    field[groupName] += item[metrics[0].uid];
    total[dimension] = total[dimension] || 0;
    total[dimension] += item[metrics[0].uid];
  });
  if (isPile) {
    Object.keys(total).forEach(key => {
      // 最大值
      maxMetric = Math.max(maxMetric, total[key]);
    });
  }
  if (mergeGroup.length && showGroupOther) {
    group["其他"] = 0;
  }
  groupArray = Object.keys(group);
  groupLength = groupArray.length;
  dimensionArray = Object.keys(fields).map(key => key.replace("tmp_", ""));
  dimensionLength = dimensionArray.length;
  return {
    maxMetric,
    minMetric,
    groupArray,
    groupLength,
    dimensionArray,
    dimensionLength,
    group,
    fields,
    total
  };
}
// 处理二维自定义排序
function handleGroupCustomSort({ options, groupArray, dimensionArray }) {
  const sortKeyValue = {};
  const firstDms = options.dimension;
  const groupDms = options.groupDimension;
  if (groupDms.options.isCustomSort) {sortKeyValue[groupDms.uid] = groupArray;}
  if (firstDms.options.isCustomSort) {sortKeyValue[firstDms.uid] = dimensionArray;}
  return customSort(sortKeyValue, true, options.customSort, options.dataAlias);
}
// 获取二维图表数据
function handleGroupData(dimensionArray, metricRange, group, fields, isPile) {
  let metricRangeData: any = Array.from({ length: Object.keys(fields).length }, () => []);
  let data = dimensionArray.map((key: string, rowIndex: number) => {
    if (metricRange && (metricRange.min || metricRange.max)) {
      return [
        key,
        ...Object.values(Object.assign({}, group, fields["tmp_" + key])).map(
          (metric: number, index: number) => {
            metricRangeData[rowIndex][index] = metric;
            if (!isPile) {
              if (metricRange && metricRange.max !== null && metric > (metricRange as any).max) {
                return metricRange.max;
              } else { 
                  if (
                  metricRange &&
                  metricRange.min !== null &&
                  metric < (metricRange as any).min
                ) {
                  return metricRange.min;
                } 
              }
            }
            return metric;
          }
        )
      ];
    } else {
      Object.values(Object.assign({}, group, fields["tmp_" + key])).forEach(
        (metric: number, index: number) => {
          metricRangeData[rowIndex][index] = metric;
        }
      );
      return [key, ...Object.values(Object.assign({}, group, fields["tmp_" + key]))];
    }
  });

  return {
    data,
    metricRangeData
  };
}

export {
  handleData,
  handleCustomSort,
  getMinAndMax,
  getMaxDimension,
  getGroupArray,
  handleGroupData,
  handleGroup,
  handleGroupCustomSort,
  processMutliDims,
  processOneDim
};

export default {
  handleData,
  handleCustomSort,
  getMinAndMax,
  getMaxDimension,
  getGroupArray,
  handleGroupData,
  handleGroup,
  handleGroupCustomSort,
  processMutliDims,
  processOneDim
};
