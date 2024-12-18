
import { checkForecast, handleForecast } from "../../help/utils";
import { getObjArrSortResult } from "@h3/report-mobile/basics/utils/customSort";
import {  processMutliDims,processOneDim} from "../common/utils";

/**
 * 处理柱状图表数据
 * @param options
 */
function handleBarData(options: H3.Chart.ChartOptions): H3.Chart.ChartData {
  let tData = options.data;
  let result;
  // 符合预测功能,新增预测数据
  if (checkForecast(options)) {
    const res = handleForecast(options);
    tData = options.data.concat(res);
  }
  // 先对数据做自定义排序,再进去二维分组, 这块需重构自定义排序,之前写法是先处理数据再处理自定义排序,应该先对返回值排序
  if(options.groupDimension && options.groupDimension.options && options.groupDimension.options.isCustomSort) {
    tData = getObjArrSortResult(tData,options.groupDimension.uid,options.customSort[options.groupDimension.uid]);
  }
  // 二维图表
  if (options.groupDimension && options.groupDimension.field && options.metric.length) {
    result = processMutliDims(options,tData,{isPile:false});
  // 一维图表
  } else {
    result = processOneDim(options,tData,{isPile: false});
  }
  return result;
}


export default handleBarData;
