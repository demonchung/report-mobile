
import { checkForecast, handleForecast } from "../../help/utils";
import { getObjArrSortResult } from "@h3/report-mobile/basics/utils/customSort";
import {  processMutliDims,processOneDim} from "../common/utils";

/**
 * 处理柱状图表数据
 * @param options
 */
function handleCardData(options: H3.Chart.ChartOptions): H3.Chart.ChartData {
  const tData = options.data;
  let result: any = {};
  // 1维1指标
  if (options.dimension && options.metric) {
    result = processOneDim(options,tData,{isPile: false});
    result.total = getSummary(options,tData);
   
  } else { 
    if(!options.dimension && options.metric.length) {
      result = processMetrics(options,tData);
    } 
}

  return result;
}

function getSummary(options,data) {
  const metric = options.metric? options.metric[0] : null;
  let summary = 0;
  data.forEach((item: any) => {
    if (item[metric.uid] === null || item[metric.uid] === undefined) {return;}
    switch (metric.options.aggregateType) {
      case "SUM":
      case "AVG":
        summary += parseFloat(item[metric.uid]);
        break;
      case "MAX":
        summary = Math.max(summary, parseFloat(item[metric.uid]));
        break;
      case "MIN":
        summary = Math.min(summary, parseFloat(item[metric.uid]));
        break;
      default:
        summary += parseFloat(item[metric.uid]);
        break;
    }
  });
  if (metric.options.aggregateType === "AVG") {
    summary = parseFloat((summary / data.length) as any);
  } 
  return summary;
}

function processMetrics(options: H3.Chart.ChartOptions, tData) {
  const data = options.metric.map((m) => {
    return [m.alias || m.name, tData[0][m.uid]];
  });
  const numberList:any = [];
  const groupNameArray:any = [];
  let maxMetric =  0;
  let minMetric =  0;
  let total = 0;
  // 没有维度,按指标顺序排好数据
  options.metric.forEach((m,index)=> {
    numberList.push(tData[0][m.uid]);
    total += tData[0][m.uid];
    maxMetric = Math.max(maxMetric,tData[0][m.uid]);
    minMetric = Math.min(maxMetric,tData[0][m.uid]);
    groupNameArray.push(m.alias || m.name);
  });
  const metricRangeData = data.map((item) => item.slice(1, item.length));
  const groupArray = groupNameArray;

  return  {
    dimensionLength : 0,
    dimensionArray: [],
    groupLength : groupArray.length,
    groupArray,
    groupNameArray,
    maxMetric,
    minMetric,
    data,
    metricRangeData,
    total
  };

}

export default handleCardData;
