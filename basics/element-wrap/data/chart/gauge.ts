import { maxDimension, maxDimensionColumns, maxGroup } from "../options";

/**
 * 处理柱状图表数据
 * @param options
 */
function handleGuageData(options: H3.Chart.ChartOptions): H3.Chart.ChartData {
  const data: any = [];
  const dimensionLength: number = 0;
  const dimensionArray: any = [];
  let groupArray: any = [];
  let maxMetric: number = 0;
  let minMetric: number = 0;
  const groupNameArray: any = {};
  const groupLength = 0;
  const metricRangeData = {};
  let total: any = [];
  if (options.metric && options.metric.length && !options.dimension) {
    const field = options.metric[0];
    let targerField: any;
    let value = 0;
    let target = 0;
    let tmp: any;
    groupNameArray[field.uid] = field.alias || field.name;
    groupArray = [field.uid];
    if (options.data.length) {
      tmp = options.data.find(item => item[field.uid] || item[field.uid] === 0) || {};
      value = tmp[field.uid] || 0;
      minMetric = value;
      maxMetric = value;
      target = value;
      if (field.options && field.options.targetValue) {
        if (field.options.targetValue.valueType === "fixed") {
          if (field.options.targetValue.constValue && field.options.targetValue.constValue != 0) {
            target = field.options.targetValue.constValue;
          }
        } else {
          if (field.options.targetValue.field) {
            targerField = field.options.targetValue.field;
            tmp =
              options.data.find(item => item[targerField.uid] || item[targerField.uid] === 0) || {};
            target = tmp[targerField.uid] || 0;
          }
        }
      }
    }
    data[0] = [groupNameArray[field.uid], value, target];
    total = [value];
  }
  const chartData: H3.Chart.ChartData = {
    dimensionLength,
    dimensionArray,
    groupLength,
    groupArray,
    groupNameArray,
    maxMetric,
    minMetric,
    index: 0,
    data,
    metricRangeData,
    maxDimension,
    total
  };
  return chartData;
}

export default handleGuageData;
