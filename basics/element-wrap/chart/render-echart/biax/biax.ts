import {checkForecast, numericalFormatting} from "../../../help/utils";
import singleCarts from "../common/aggregate";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";

/**
 * 绘制双轴图
 * @param chartOptions
 * @param options
 * @param chartDatas
 */
function biaxOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartDatas: Array<H3.Chart.ChartData>
) {
  const metricTypes = options.multiMetricType;
  const metricGroup = options.metricGroup;
  const chartsoptions: Array<any> = [];

  let series: Array<any> = [];
  const yAxis: Array<any> = [];
  let xAxis: Array<any> = [];
  let tooltip: any = {};
  let groupNameArray: any = {};
  const check = checkForecast(options);

  // 是否都是柱形图 （堆叠柱状和柱状）
  const bothbar = metricTypes && metricTypes.every(i => i === "bar" || i === "pileBar");
  if (metricTypes && metricTypes.length > 0) {
    metricTypes.forEach((metricType, index) => {
      groupNameArray = Object.assign({}, groupNameArray, chartDatas[index].groupNameArray);
      let chartOption: any = {};
      const singleOptions: any = Object.assign({}, options, {
        metric: metricGroup && [index] ? [...metricGroup[index]] : [],
        type: metricType
      });

      chartOption = singleCarts[singleOptions.type](chartOptions, singleOptions, chartDatas[index]);
      chartsoptions.push(chartOption);
      // 设置x轴边距
      chartOption.xAxis.boundaryGap = true;
      // 设置y轴的刻度尺 每个y轴都保持5个刻度
      chartOption.yAxis.splitNumber = 5;
      // 根据设置的最大值最小值 设置最终的最大值最小值和每个刻度的单位
      chartOption.yAxis.max = chartOption.yAxis.max
        ? chartOption.yAxis.max
        : chartDatas[index].maxMetric || null;
      
      chartOption.yAxis.min = chartOption.yAxis.min
        ? chartOption.yAxis.min
        : chartDatas[index].minMetric || null;
      // 根据设置的最大值最小值 设置最终的最大值最小值和每个刻度的单位
      const maxMetric = chartOption.yAxis.max ? chartOption.yAxis.max : chartDatas[index].maxMetric;
      const minMetric = chartOption.yAxis.min ? chartOption.yAxis.min : chartDatas[index].minMetric;
      if (maxMetric || minMetric) {
        if(maxMetric*minMetric > 0) {
          chartOption.yAxis.interval = (maxMetric - minMetric) / 5;
        } else {chartOption.yAxis.interval = (Math.abs(maxMetric) + Math.abs(minMetric)) / 5;}
      }
      // 当第二个y轴需要设置层级
      chartOption.series.forEach(i => {
        // 设置数据得y轴是第几个
        i.yAxisIndex = index;
        // 设置图表的层级
        i.z = metricType === "area" ? 0 : 1;
        // 如果都是柱形图设置柱子得宽度
        // if (bothbar) {
        //   let wid = Number(i.barWidth.replace("%", "")) / 2;
        //   wid = wid < 3 ? 3 : wid;
        //   i.barWidth = wid + "%";
        // }
      });
      series.push(...chartOption.series);
      yAxis.push(chartOption.yAxis);
      xAxis = [chartOption.xAxis];
      tooltip = chartOption.tooltip;
    });
  }
  // 重写tooltip
  tooltip.formatter = (params: any) => {
    const realName = options.dimension
      ? getAliaValue(options.dimension.uid, params[0].name, options.dataAlias)
      : "";
    const name = realName || params[0].name;
    let seriesName;
    let value;
    let dataIndex;
    let res = '{a|' + name + '\n}';
    params.forEach((item: any, index) => {
      let seriesIndex;
      dataIndex = item.dataIndex;
      if (options.groupDimension) {
        seriesIndex = series.find((i, num) => {
          return item.seriesIndex === num;
        }).yAxisIndex;
      } else {
        seriesIndex = series.find(i => i.name === item.seriesName).yAxisIndex;
      }
      const firstSeriesNum = series.filter(f => f.yAxisIndex === 0);
      const beforeIndex = seriesIndex === 0 ? 0 : firstSeriesNum ? firstSeriesNum.length : 0;
      let realSeriesName;
      if (options.groupDimension) {
        realSeriesName = options.groupDimension
          ? getAliaValue(options.groupDimension.uid, item.seriesName, options.dataAlias)
          : "";
        seriesName = realSeriesName || item.seriesName;
      } else {
        seriesName = groupNameArray
          ? groupNameArray[item.seriesName]
          : options.dataAlias[item.seriesName] || item.seriesName;
      }
      value = numericalFormatting(item, chartDatas[seriesIndex], options, beforeIndex);
      res += item.marker + '{a|' + seriesName + ': ' + value + '\n}'
    });
    if(check && chartDatas[0]){
      if(dataIndex > (chartDatas[0] as any).data.length - options.forecast.number -1) {
        res = '{a|预测数据 :\n}' + res;
      }
    }
    return res;
  };
  const latestOption: any = Object.assign({}, chartOptions, {
    series: series,
    yAxis: yAxis,
    xAxis: xAxis,
    tooltip: tooltip
  });
  return latestOption;
}

export default biaxOptions;
