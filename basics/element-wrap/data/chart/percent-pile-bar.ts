import { maxDimension, maxGroup } from "../options";
import { checkForecast, handleForecast } from "../../help/utils";
import customSort, { handleMetricRange, getObjArrSortResult } from "@h3/report-mobile/basics/utils/customSort";
import { processOneDim,handleData} from "../common/utils";


/**
 * 堆叠图
 * @param options
 */
function handlePercentPileBarData(options: H3.Chart.ChartOptions): H3.Chart.ChartData {

  let tData = options.data;
  let chartData: H3.Chart.ChartData;
  if (checkForecast(options)) {
    const res = handleForecast(options, true);
    tData = options.data.concat(res);
  }
  // 处理一维数据
  chartData = processOneDim(options,tData,{isPile: false,metricKeySuffix: '_PERCENT'});
  //处理堆叠百分比的特殊数据 这里的指标实际展示和tooltip展示需要用两套数据
  const { metricRangeData } = handleData(tData, options.metric, options.dimension);
  Object.assign(chartData, {
    mRangeDate: metricRangeData,
  });
  return chartData;
}


export default handlePercentPileBarData;
