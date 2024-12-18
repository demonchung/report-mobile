import {
  viewOptions,
  fontSetting,
  numericalFormatting,
  warningLine,
  getDataZoom,
  checkForecast,
  getVisualMap
} from "../../../help/utils";
import { lineColor } from "../common/options";

/**
 * 绘制折线图表
 * @param chartOptions
 * @param options
 * @param chartData
 */
function lineChartOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const { xAxis, yAxis, tooltip, series, graphic }: any = viewOptions(options, chartData, {
    xAxis: {
      axisTick: {
        alignWithLabel: false,
        lineStyle: {
          color: lineColor
        }
      }
    },
    yAxis: "default",
    tooltip: "default",
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
  // 警戒线
  warningLine(chartOptions, chartData, options);
  return chartOptions;
}

/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  return chartData.groupArray.map((group: string) => {
    const optionData: any = {
      name: group,
      type: "line",
      emphasis: {
        focus: "series"
      },
      labelLayout: {
        hideOverlap: true
      },
      label: {
        // 数值显示开关
        show: options.dataLabel === null ? true : options.dataLabel,
        position: "top",
        fontSize: options.fontSize,
        color: fontSetting(options) || options.defaultFontColor,
        formatter: (params: any) => {
          // 数值格式设置
          const label = numericalFormatting(params, chartData, options);
          return label;
        }
      }
    };
    return optionData;
  });
}

export default lineChartOptions;
