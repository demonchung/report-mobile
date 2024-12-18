import {
  fontSetting,
  numericalFormatting,
  warningLine,
  viewOptions,
  getDataZoom,
  checkForecast,
  getVisualMap,
  processPileSum
} from "../../../help/utils";
import { tooltipShadowColor } from "../common/options";

/**
 * 绘制堆叠柱状图表
 * @param chartOptions
 * @param options
 * @param chartData
 */
function pileBarChartOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const { xAxis, yAxis, tooltip, series, graphic }: any = viewOptions(options, chartData, {
    xAxis: "default",
    yAxis: "default",
    tooltip: {
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: tooltipShadowColor
        }
      }
    },
    series: getSeries(options, chartData),
    graphic: 'default',
  });

  const dataZoom = getDataZoom(options, chartData);

  Object.assign(chartOptions, {
    xAxis,
    yAxis,
    tooltip,
    series,
    dataZoom,
    graphic
  });
  if (checkForecast(options)) {
    const visualMap = getVisualMap(options, chartData);
    Object.assign(chartOptions, {
      visualMap
    });
  }
  // 警戒线功能
  warningLine(chartOptions, chartData, options);
  // 堆叠图处理负数值 - 临时方案（等Echart更新修复BUG后，需要去除该方法）
  handlePileBarValue(chartData, chartOptions);
  // 在2维度1指标时当设置指标的"汇总结果显示"为"显示为占比"时组内占比最大值为100%
  if (options.groupDimension && options.metric && options.metric.length) {
    if (options.metric[0].options.percent && options.metric[0].options.percent === "PERCENT") {
      chartOptions.yAxis.max = 1;
    }
  }
  return chartOptions;
}
/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  const series = chartData.groupArray.map((group: string) => {
    //const max = Math.max((100 - chartData.groupArray.length * 5) / chartData.groupArray.length, 3.5);
    const optionData = createSeriesItem(group, options);
    optionData.label = {
      color: fontSetting(options),
      fontSize: options.fontSize,
      // 数值显示开关
      show: options.dataLabel === null ? true : options.dataLabel,
      position: "inside",
      formatter: (params: any) => {
        // 数值格式设置
        return numericalFormatting(params, chartData, options);
      }
    };
    // 柱条最小高度
    // optionData.barMinHeight = 1;
    // 柱子间距
    // optionData.barCategoryGap = "22px";
    return optionData;
  });
  // 堆叠合计显示
  if (options.dataLabelPileSum === true) {
    const pileSumSeries = createSeriesItem("合计", options);
    pileSumSeries.barGap = "-100%";
    pileSumSeries.stack = "";
    pileSumSeries.zlevel = -1;
    pileSumSeries.label = {
      show: true, //显示数值
      position: "top", //  位置设为top
      formatter: (params: any) => {
        const sum = processPileSum(params.data);
        return (Number(sum.toFixed(2)) * 100) / 100;
      },
      fontSize: options.fontSize + 1,
      textStyle: { color: fontSetting(options) || options.defaultFontColor}, //设置数值颜色
      fontWeight: 600
    };
    pileSumSeries.itemStyle = {
      normal: {
        color: "rgba(128, 128, 128, 0)" // 设置背景颜色为透明
      }
    };
    series.push(pileSumSeries);
  }
  return series;
}

function createSeriesItem(name: string, options: H3.Chart.ChartOptions) {
  const optionData: any = {
    name: name,
    type: "bar",
    barMaxWidth: 60,
    barCategoryGap: "35%",
    labelLayout: {
      hideOverlap: true
    },
    emphasis: {
      focus: "series"
    },
    stack: "堆叠柱状图stack"
  };
  return optionData;
}
/**
 * 堆叠图处理负数值
 * @param chartData
 * @param publicOptions
 */
function handlePileBarValue(chartData: H3.Chart.ChartData, publicOptions: any) {
  if (chartData.data.length === 1) {
    let count: any = null;
    chartData.data.forEach((item: number, index: number) => {
      if (index !== 0 && item < 0) {
      //  count !== null ? (count > item ? (count = item) : count) : (count = item);
        count = (count !== null) ? (count > item ? item : count) : item;
      }
    });
    publicOptions.yAxis.min = count;
  } else {
    let count: any = null;
    const arr: Array<number> = [];
    let min: any;
    chartData.data.forEach((data: Array<any>) => {
      if (data.length > 2) {
        data.forEach((item: any, index: number) => {
          if (index !== 0 && item < 0) {
            count += item;
            if (index === data.length - 1) {
              arr.push(count);
            }
          }
        });
      }
    });
    if (arr.length !== 0) {
      min = Math.min.apply(null, arr);
      if(!publicOptions.yAxis.min){
        publicOptions.yAxis.min = min;
      }
      //publicOptions.yAxis.min = min;//
    } else {
      publicOptions.yAxis.max = publicOptions.yAxis.max || null;
      publicOptions.yAxis.min = publicOptions.yAxis.min || null;
    }
  }
}

export default pileBarChartOptions;
