import { fontSetting, metricRangeMatrixing, viewOptions } from "../../../help/utils";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { lineColor } from "../common/options";

/**
 * 绘制雷达图
 * @param chartOptions
 * @param options
 * @param chartData
 */
function radarChartOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const rangeData = metricRangeMatrixing(options, chartData, true);
  // 保留第一个，颠倒数组。目前没有属性直接修改顺时针展示，只能改变展示数据
  let reverseDimensionArray: Array<any> = [];
  if (chartData.dimensionArray.length) {
    reverseDimensionArray = chartData.dimensionArray
      .slice(0, 1)
      .concat(...chartData.dimensionArray.slice(1, chartData.dimensionArray.length).reverse());
  }

  let radarCenter = ["50%", "50%"];
  if (options.legend && options.legend.position === "left") {
    radarCenter = ["60%", "50%"];
  } else {
    if (options.legend && options.legend.position === "right") {
      radarCenter = ["40%", "50%"];
    }
  } 
  const { tooltip, series, radar }: any = viewOptions(options, chartData, {
    tooltip: {
      renderMode: 'richText',
      formatter: (params: any) => {
        return radarNumberFormat(params, chartData, options);
      }
    },
    radar: {
      shape: 'circle',
      splitLine: {
        lineStyle: {
          //type: 'dashed',
          type: [3, 6],
          color: lineColor,
          width: 0.7
        }
      },
      axisLine: {
        lineStyle:{
          opacity: 0,
        }
      },
      name: {
        textStyle: {
          fontSize: options.fontSize,
          color: fontSetting(options)
        }
      },
      radius: "60%",
      indicator: reverseDimensionArray.map((dimension: string) => {
        const aliaName = options.dimension
          ? getAliaValue(options.dimension.uid, dimension, options.dataAlias)
          : "";
        return {
          name: aliaName ? aliaName : dimension,
          max: rangeData.max * 1.25,
          min: rangeData.min
        };
      }),
      center: radarCenter
    },
    series: getSeries(options, chartData)
  });

  Object.assign(chartOptions, {
    tooltip,
    series,
    radar
  });

  return chartOptions;
}
/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  return {
    type: "radar",
    tooltip: {
      trigger: "item"
    },
    label: {
      // 数值显示开关
      show: options.dataLabel === null ? true : options.dataLabel,
      fontSize: options.fontSize,
      color: fontSetting(options) || options.defaultFontColor,
      formatter: (params: any) => {
        // 保留第一个，颠倒数组。目前没有属性直接修改顺时针展示，只能改变展示数据
        let reverseMetricRangeData = [];
        if (chartData.metricRangeData[params.dataIndex].length) {
          reverseMetricRangeData = chartData.metricRangeData[params.dataIndex]
            .slice(0, 1)
            .concat(
              ...chartData.metricRangeData[params.dataIndex]
                .slice(1, chartData.metricRangeData[params.dataIndex].length)
                .reverse()
            );
        }
        let value: any = reverseMetricRangeData[params.dimensionIndex];
        options.metric.forEach((metric, indexs) => {
          if (options.metric.length === 1) {
            // 数值格式设置
            if (metric.options.numberFormat as H3.Report.NumberFormat) {
              value = convertNumber(value, metric.options.numberFormat as H3.Report.NumberFormat);
            }
          } else {
            if (params.dataIndex === indexs) {
              // 数值格式设置
              if (metric.options.numberFormat as H3.Report.NumberFormat) {
                value = convertNumber(value, metric.options.numberFormat as H3.Report.NumberFormat);
              }
            }
          }
        });
        return value;
      }
    },
    areaStyle: {normal: {}},
    data: chartData.groupArray.map((group: string, index: number) => {
      let reverseData: Array<any> = [];
      if (chartData.data[index].length) {
        reverseData = chartData.data[index]
          .slice(0, 1)
          .concat(...chartData.data[index].slice(1, chartData.data[index].length).reverse());
      }
      return {
        value: reverseData,
        name: group
      };
    })
  };
}
/**
 * 雷达图格式化显示
 * @param params
 * @param chartData
 * @param options
 */
function radarNumberFormat(
  params: any,
  chartData: H3.Chart.ChartData,
  options: H3.Chart.ChartOptions
) {
  const realName = options.groupDimension
    ? getAliaValue(options.groupDimension.uid, params.name, options.dataAlias)
    : "";

  const name = chartData.groupNameArray
    ? chartData.groupNameArray[params.name]
    : realName || params.name;
  let dimensionName;
  let res = '{a|' + name + '\n}';
  chartData.metricRangeData[params.dataIndex].forEach((item: any, index: number) => {
    dimensionName = chartData.dimensionArray[index];
    let tmpItem = item ? item : 0;
    const aliaDimensionName = options.dimension
      ? getAliaValue(options.dimension.uid, dimensionName, options.dataAlias)
      : "";
    dimensionName = aliaDimensionName ? aliaDimensionName : dimensionName;
    options.metric.forEach((metric, number) => {
      if (options.metric.length === 1) {
        // 数值格式设置
        if (metric.options.numberFormat as H3.Report.NumberFormat) {
          tmpItem = convertNumber(tmpItem, metric.options.numberFormat as H3.Report.NumberFormat);
        }
        res += params.marker + '{b|' + dimensionName + ': ' + tmpItem + '\n}';
      } else {
        if (params.dataIndex === number) {
          // 数值格式设置
          if (metric.options.numberFormat as H3.Report.NumberFormat) {
            tmpItem = convertNumber(tmpItem, metric.options.numberFormat as H3.Report.NumberFormat);
          }
          res += params.marker + '{b|' + dimensionName + ': ' + tmpItem + '\n}';
        }
      }
    });
  });
  return res;
}

export default radarChartOptions;
