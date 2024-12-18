import { maxDimension, maxDimensionColumns, maxGroup } from "../options";
import { checkForecast, handleForecast } from "../../help/utils";
import customSort, { handleMetricRange, getObjArrSortResult } from "@h3/report-mobile/basics/utils/customSort";
import {  processMutliDims,processOneDim} from "../common/utils";

/**
 * 堆叠图
 * @param options
 */
 function handleStripeData(options: H3.Chart.ChartOptions): H3.Chart.ChartData {
  let tData = options.data;
  let result;
  if (checkForecast(options)) {
    const res = handleForecast(options);
    tData = options.data.concat(res);
  }
  // 先对数据做自定义排序,再进去二维分组, 这块需重构自定义排序,之前写法是先处理数据再处理自定义排序,应该先对返回值排序
  if (options.groupDimension && options.groupDimension.options && options.groupDimension.options.isCustomSort) {
    tData = getObjArrSortResult(
      tData,
      options.groupDimension.uid,
      options.customSort[options.groupDimension.uid]
    );
  }
  if (options.groupDimension && options.groupDimension.field && options.metric.length) {
    result = processMutliDims(options,tData,{isPile: true});
  } else {
    result = processOneDim(options,tData,{isPile: true});
  }
  handlePileSum(result,options,tData);
  return result;
}


// 堆叠合计处理
function handlePileSum(chartData: H3.Chart.ChartData,options: H3.Chart.ChartOptions, data: any[],) {
  chartData.data.forEach((item: any, rowIndex: number) => {
    let pileSum: number = 0;
    item.forEach((cell: number, index: number) => {
      if (typeof cell === "number") {
        const metric = item[index];
        // 堆叠图最大值需要累加计算
        if (metric > 0) {
          pileSum += metric;
        }
      }
    });
    // 堆叠合计值放在每一个计算完之后的最后一个值[['A01',1,2,3],['A02',110,100,210]]
    if (options.dataLabelPileSum === true) {
      item.push(pileSum);
      chartData.metricRangeData[rowIndex].push(pileSum);
    }
  });
}



export default handleStripeData;
