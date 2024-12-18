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
function stripeChartOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const { xAxis, yAxis, tooltip, series, graphic }: any = viewOptions(options, chartData, {
    xAxis: {
      inverse: true
    },
    yAxis: {
      position: "top"
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
  const dataZoom = getDataZoom(options, chartData);
  warningLine({ xAxis, yAxis, series }, chartData, options, "y");
  //chartOptions.grid.right = options.DataZoom && options.DataZoom.show ? "120" : "50";
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
      // barGap: "20%",
      // barWidth: max + "%",
      // barMinWidth: 1,
      barCategoryGap: "35%",
      emphasis: {
        focus: "series"
      },
      labelLayout: {
        hideOverlap: true
      },
      label: {
        // 数值显示开关
        show: options.dataLabel === null ? true : options.dataLabel,
        position: "right",
        offset: [0, 0],
        fontSize: options.fontSize,
        color: fontSetting(options) || options.defaultFontColor,
        formatter: (params: any) => {
          // 数值格式设置
          return numericalFormatting(params, chartData, options);
        }
      },
      barMinHeight: 1
      // barCategoryGap: "22px"
    };

    return optionData;
  });
}
export default stripeChartOptions;
