import { maxDimension, maxGroup } from "../options";
import customSort  from "@h3/report-mobile/basics/utils/customSort";
/**
 * 处理圆饼图表
 * @param options
 */
function handlePieData(options: H3.Chart.PieChartOptions): H3.Chart.ChartData {
  const dimensionLength = options.data.length;
  const dimensionArray: any = {};
  const groupLength = dimensionLength;
  let groupArray: any = [];
  let data = options.data;
  let total = 0;
  let maxMetric: number = 0;
  let minMetric: number = 0;
  const groupNum = options.dimensionLimit || maxGroup;
  if (groupLength > groupNum) {
    const mergeData: any = [];
    options.data.forEach((item: any, index: number) => {
      maxMetric = Math.max(maxMetric, item[options.metric[0].uid]);
      minMetric = Math.min(minMetric, item[options.metric[0].uid]);
      // 计算数值绝对值总和
      total += Math.abs(item[options.metric[0].uid] ? item[options.metric[0].uid] : 0);
      item[options.dimension.uid] = item[options.dimension.uid] || "为空";
      if (index < groupNum - 1) {
        groupArray.push(item[options.dimension.uid]);
        mergeData.push(item);
      } else {
        if (!mergeData[groupNum - 1]) {
          mergeData[groupNum - 1] = {};
          mergeData[groupNum - 1][options.dimension.uid] = "其他";
          mergeData[groupNum - 1][options.metric[0].uid] = 0;
        }
        mergeData[groupNum - 1][options.metric[0].uid] += item[options.metric[0].uid];
      }
    });
    groupArray.push("其他");
    data = mergeData;
  } else {
    groupArray = options.data.map((field: H3.Report.FieldColumn) => {
      maxMetric = Math.max(maxMetric, field[options.metric[0].uid]);
      minMetric = Math.min(minMetric, field[options.metric[0].uid]);
      // 计算数值绝对值总和
      total += Math.abs(field[options.metric[0].uid] ? field[options.metric[0].uid] : 0);
      return field[options.dimension.uid];
    });
  }
  let resultData:any = [];
  data.forEach((item)=>{
    const arr = [item[options.dimension.uid],item[options.metric[0].uid]]
    resultData.push(arr)
  })
  // 一维自定义排序
  const sortKeyValue = {};
  sortKeyValue[options.dimension.uid] = resultData;
  const sortRes = customSort(sortKeyValue,false,options.customSort)
  resultData = sortRes[options.dimension.uid]
  data = resultData;
  return {
    dimensionLength,
    dimensionArray,
    groupLength,
    groupArray,
    data,
    maxDimension,
    total,
    maxMetric,
    minMetric,
  };
}

export default handlePieData;
