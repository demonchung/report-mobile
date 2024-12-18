import {
  viewOptions,
  fontSetting,
  numericalFormatting,
  warningLine,
  getDataZoom,
  legendSetting,
  checkForecast,
  getVisualMap
} from "../../../help/utils";
import { tooltipShadowColor } from "../common/options";

/**
 * 绘制条形图表
 * @param chartOptions
 * @param options
 * @param chartData
 */
function percentPileStripeChartOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const { xAxis, yAxis, tooltip, series, graphic }: any = viewOptions(options, chartData, {
    xAxis: {
      inverse: true
    },
    yAxis: {
      position: "top",
      max: 1
    },
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
  //console.log(1100,chartData)
  const dataZoom = getDataZoom(options, chartData);
  warningLine({ xAxis, yAxis, series }, chartData, options, "y");
  //chartOptions.grid.right = options.DataZoom && options.DataZoom.show ? "65" : "50";
  if(options.legend.checked === true && options.legend.position === "right"){
    chartOptions.grid.right = 137;
  }else{
    if(options.DataZoom && options.DataZoom.show){
      chartOptions.grid.right = 65;
    } else {chartOptions.grid.right = 50;}
  }
  chartOptions.grid.bottom = "32";
  chartOptions.legend.bottom = "10";
  chartOptions.legend.right = options.DataZoom && options.DataZoom.show ? "32" : "10";
  // handlePileBarValue(chartData, chartOptions);
  // x轴和y轴互换
  Object.assign(chartOptions, {
    xAxis: yAxis,
    yAxis: xAxis,
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
  return chartOptions;
}
/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  return chartData.groupArray.map((group: string) => {
    const max = Math.max(
      (100 - chartData.groupArray.length * 5) / chartData.groupArray.length,
      3.5
    );
    const optionData: any = {
      name: group,
      type: "bar",
      barMaxWidth: 60,
      barCategoryGap: "35%",
      labelLayout: {
        hideOverlap: true
      },
      // barGap: "20%",
      // barWidth: max + "%",
      // barMinWidth: 1,
      // barCategoryGap: "20%",
      emphasis: {
        focus: "series"
      },
      stack: "堆叠条形图图stack"
    };
    optionData.label = {
      // 数值显示开关
      show: options.dataLabel === null ? true : options.dataLabel,
      position: "inside",
      fontSize: options.fontSize,
      // offset: [30, 0],
      color: fontSetting(options),
      formatter: (params: any) => {
        // 数值格式设置
        //return numericalFormatting(params, chartData, options);
        let groupData;
        let value;
        groupData = chartData.metricRangeData[chartData.index + params.dataIndex] || [];
        let value1 = groupData[params.componentIndex];
        if (!value1 && value1 !== 0) {
          value1 = groupData[params.componentIndex] || 0;
        }
        options.metric.forEach((item, index) => {
          if (options.metric.length > 1) {
            if (params.componentIndex === index) {
              value1 = parseFloat(value1.toString()) * 100;
              value1 = Math.round(value1 * 100) / 100;
              const unit = "%";
              value = value1 + unit;
            }
          } else {
            // 等一个指标
            value1 = parseFloat(value1.toString()) * 100;
            value1 = Math.round(value1 * 100) / 100;
            const unit = "%";
            value = value1 + unit;
          }
        });
        return value;
      }
    };
    // barMinHeight: 1
    // barCategoryGap: "22px"
    return optionData;
  });
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
      publicOptions.yAxis.min = min;
    } else {
      publicOptions.yAxis.max = publicOptions.yAxis.max || null;
      publicOptions.yAxis.min = publicOptions.yAxis.min || null;
    }
  }
}

export default percentPileStripeChartOptions;
