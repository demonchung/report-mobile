import { viewOptions, fontSetting } from "../../../help/utils";
import { lineColor } from "../common/options";
import { convertNumber, stringNumber } from "@h3/report-mobile/basics/utils/number";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";

/**
 * 绘制散点图（气泡图）
 * @param chartOptions
 * @param options
 * @param chartData
 */
function scatterOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const { xAxis, yAxis, tooltip, series, legend }: any = viewOptions(options, chartData, {
    xAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          //type: "dashed",
          type: [3, 6],
          width: 0.7
        }
      },
      axisLine: {
        lineStyle: {
          color: lineColor
        }
      },
      axisLabel: {
        color: fontSetting(options) || options.defaultFontColor
      }
    },
    yAxis: {
      axisTick: {
        show: false
      },
      axisLabel: {
        color: fontSetting(options) || options.defaultFontColor,
        formatter: (value: any) => {
          // 数值显示功能以第一个指标的设置为主
          const numberFormat = options.metric[0].options.numberFormat as H3.Report.NumberFormat;
          if (numberFormat) {
            value = convertNumber(value, numberFormat as any);
          }
          if (!numberFormat || (!numberFormat.fraction && !numberFormat.percent)) {
            value = stringNumber(value);
          }
          return value;
        }
      }
    },
    tooltip: {
      trigger: "item",
      renderMode: 'richText',
      formatter: (params: any) => {
        const realName = options.dimension
          ? getAliaValue(options.dimension.uid, params.data.slice(-2, -1)[0], options.dataAlias)
          : "";
        const seriesName = realName || params.data.slice(-2, -1);
        let res: any = params.marker + '{a|' + seriesName + '}'
        options.metric.forEach((metric, index: number) => {
          // 数值格式设置
          if (metric.options.numberFormat as H3.Report.NumberFormat) {
            const numberFormatValue = convertNumber(
              params.data[index],
              metric.options.numberFormat as H3.Report.NumberFormat
            );
            res += '{a|\n}' + '{a|'+ (metric.alias || metric.name) + ': ' + numberFormatValue + '}';
          } else {
            res += '{a|\n}' + '{a|'+ (metric.alias || metric.name) + ': ' + params.data[index] + '}';
          }
        });
        return res;
      }
    },
    series: getSeries(options, chartData)
  });

  Object.assign(chartOptions, {
    xAxis,
    yAxis,
    tooltip,
    series
  });
  return chartOptions;
}
/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  const maxSize = 50;
  let maxValue;
  const sizeMode = options.metric.length > 2;
  const tmpArr = [];
  if (sizeMode) {
    chartData.data.forEach(item => {
      item.forEach(son => {
        if (son[2]) {
          // @ts-ignore
          tmpArr.push(son[2]);
        }
      });
    });
    maxValue = Math.max(...tmpArr);
  }
  return chartData.data.map((item, index: number) => {
    return {
      type: "scatter",
      name: chartData.groupArray[index],
      data: item,
      symbolSize: data => {
        if (sizeMode) {
          if (maxValue) {
            const curSize = maxSize * (data[2] / maxValue);
            return curSize < 1 ? 1 : curSize;
          } else {
            return 0;
          }
        } else {
          return 15;
        }
      },
      itemStyle: {
        normal: {
          shadowBlur: 8,
          shadowColor: "rgba(25, 100, 150, 0.5)",
          shadowOffsetY: 2
        }
      }
    };
  });
}
export default scatterOptions;
