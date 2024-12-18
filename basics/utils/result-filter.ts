import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { NumberType } from "@h3/report-mobile/basics/enum/filter-type";

/**
 * 结果筛选器 过滤结果
 */
function resultFilterData(data, chart: H3.Report.Chart) {
  if (!data) {return data;}
  const type = chart.type;
  const metricGroup = chart.data.metricGroup;
  const metric = chart.data.metric;
  // 是否是一维多标
  const isMultiMetrics = !chart.data.groupDimension && metric && metric.length > 0;
  // 明细表或者透视表或地图 没有结果筛选器
  if (type === ElementType.LIST || type === ElementType.TABLE || type === ElementType.MAP) {
    return data;
  } else if (type === ElementType.BIAX) {
    // 双轴图
    if (metricGroup && metricGroup.length > 0) {
      const metrics: H3.Report.FieldColumn[] = [];
      metricGroup.forEach((oMetric: H3.Report.FieldColumn[]) => metrics.push(...oMetric));
      const filtersMapBiax = handleResultOption(metrics);
      return filtersMapBiax.length > 0 ? handleResultFilter(data, filtersMapBiax) : data;
    }
    return data;
  } else {
    if (metric && metric.length > 0) {
      const filtersMap = handleResultOption(metric);
      return filtersMap.length > 0 ? handleResultFilter(data, filtersMap, isMultiMetrics) : data;
    }
  } 
  return data;
}

/**
 * 通过metric 格式化结果筛选器的配置
 * @param metric
 */
const handleResultOption = metric => {
  const filters = metric.filter(i => i.options.resultFilter && i.options.resultFilter.display);
  let filtersMap: Array<H3.Report.ResultFilterOption> = [];
  if (filters && filters.length > 0) {
    filtersMap = filters.map(m => {
      return {
        uid: m.uid,
        options: m.options.resultFilter as H3.Report.ResultFilter
      };
    });
  }
  return filtersMap;
};

/**
 * 处理筛选结果
 * @param data 原始数据
 * @param options 结果筛选条件
 */
function handleResultFilter(
  data: Array<any>,
  options: Array<H3.Report.ResultFilterOption>,
  isUnion: boolean = true
): Array<any> {
  const res = data.filter((f) => {
    let success = true;
    let successOr = false;
    options.forEach((o) => {
      const initData = f[o.uid];
      const optionRes = handleOption(o, initData);
      success = success && optionRes.success;
      successOr = successOr || optionRes.successOr;
    });
    return isUnion ? success : successOr;
  });

  return res;
}

/**
 * 处理
 * @param o 结果筛选器配置参数
 * @param initData 真实数据
 */
function handleOption(o: H3.Report.ResultFilterOption, initData) {
  let success = true;
  let successOr = false;
  switch (o.options.logic) {
    case NumberType.Equal:
      success =
        success && (initData === o.options.condition || (o.options.condition === 0 && !initData));
      successOr =
        successOr || initData === o.options.condition || (o.options.condition === 0 && !initData);
      break;
    case NumberType.NotEqual:
      const realRes: boolean =
        o.options.condition === 0 ? !!initData : initData !== o.options.condition;
      success = success && realRes;
      successOr = successOr || realRes;
      break;
    case NumberType.Above:
      success = success && initData > (o.options.condition as number);
      successOr = successOr || initData > (o.options.condition as number);
      break;
    case NumberType.NotBelow:
      success =
        success && (initData > (o.options.condition as number) || initData === o.options.condition);
      successOr =
        successOr || initData > (o.options.condition as number) || initData === o.options.condition;
      break;
    case NumberType.Below:
      success = success && initData < (o.options.condition as number);
      successOr = successOr || initData > (o.options.condition as number);
      break;
    case NumberType.NotAbove:
      success =
        success && (initData < (o.options.condition as number) || initData === o.options.condition);
      successOr =
        successOr || initData < (o.options.condition as number) || initData === o.options.condition;
      break;
    case NumberType.Range:
      const rule = JSON.parse(o.options.condition as string);
      const leftRule =
        rule.leftLogic === NumberType.Below
          ? rule.leftData < initData
          : rule.leftData < initData || rule.leftData === initData;
      const rightRule =
        rule.rightLogic === NumberType.Below
          ? initData < rule.rightData
          : initData < rule.rightData || initData === rule.rightData;
      success = success && leftRule && rightRule;
      successOr = successOr || (leftRule && rightRule);
      break;
    case NumberType.None:
      // 第一版是0的话 不算是为空
      // success = success && (!initData && initData !== 0);
      success = success && !initData;
      successOr = successOr || !initData;
      break;
    case NumberType.NotNone:
      // success = success && (initData !== null || initData !== undefined || initData);
      success = success && initData;
      successOr = successOr || initData;
      break;
    default:
      break;
  }
  return {
    success,
    successOr
  };
}

export { handleResultFilter, resultFilterData };

export default {
  handleResultFilter,
  resultFilterData
};
