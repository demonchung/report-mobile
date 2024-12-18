import { fontSetting, numericalFormatting, viewOptions } from "../../../help/utils";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import options from "../common/options";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";

/**
 * 绘制漏斗图
 * @param chartOptions
 * @param options
 * @param chartData
 */
function funnelChartOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const dataArray = chartData.data.map((item) => item[options.metric[0].uid]);
  const { tooltip, series }: any = viewOptions(options, chartData, {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        // 数值格式设置
        if (params.seriesIndex === 1) {
          return conversionFormat(dataArray, params.dataIndex, options.lang);
        } else {
          return params.marker + funnelNumberFormat(options, params);
        }
      }
    },
    series: getSeries(options, chartData)
  });
  Object.assign(chartOptions, {
    tooltip,
    series
  });
  console.log(chartOptions, "chartOptions==",options);
  return chartOptions;
}

/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  const dataArray = chartData.data.map((item) => item[options.metric[0].uid]);
  const series = {
    name: options.dimension.alias || options.dimension.name,
    type: "funnel",
    min: 0,
    minSize: "1%",
    maxSize: "80%",
    sort: "none",
    left: options.legend && options.legend.position === "left" ? 125 : 80,
    right: options.legend && options.legend.position === "right" ? 125 : 80,
    emphasis: {
      label: {
        fontSize: options.fontSize + 2,
      }
    },
    top: isMobile ? 25 : 42,
    bottom: isMobile ? 10 : 22,
  };
  const firstSeries = Object.assign({}, series, {
    z: 3,
    label: {
      show:
        options.dataLabel === null || options.dataLabel === undefined ? true : options.dataLabel,
      position: "inside",
      fontSize: options.fontSize,
      color: fontSetting(options),
      formatter: (params: any) => {
        // 数值格式设置
        return funnelNumberFormat(options, params);
      }
    },
    data: chartData.data.map((item: any) => ({
      name: item[options.dimension.uid],
      value: item[options.metric[0].uid]
    }))
  });
  let seriesArray: any = [firstSeries];
  if (options.conversion) {
    const secondSeries = Object.assign({}, series, {
      labelLine: {
        length: 40
      },
      label: {
        show:
          options.dataLabel === null || options.dataLabel === undefined ? true : options.dataLabel,
          fontSize: options.fontSize,
        position: "rightTop",
        formatter: (params: any) => {
          // 数值格式设置
          return conversionFormat(dataArray, params.dataIndex, options.lang);
        }
      },
      data: chartData.data.map((item: any, index) => {
        const option: any = {
          name: item[options.dimension.uid],
          value: item[options.metric[0].uid]
        };
        // 屏蔽最后一个label
        if (index === 0) {
          Object.assign(option, {
            label: {
              show: false
            }
          });
        }
        return option;
      })
    });
    seriesArray = [firstSeries, secondSeries];
  }
  return seriesArray;
}
/**
 * 格式化转化率
 * @param chartOptions
 */
function conversionFormat(data, index, lang) {
  if (index) {
    if (!data[index] && data[index - 1]) {
      return (lang === "cn" ? "转化率: " : "Conversion Rate: ") + 0 + "%";
    } else if (!data[index - 1]) {
      return (lang === "cn" ? "转化率: " : "Conversion Rate: ") + "--";
    } else {
      return (
        (lang === "cn" ? "转化率: " : "Conversion Rate: ") +
        ((data[index] / data[index - 1]) * 100).toFixed(2) +
        "%"
      );
    }
  } else {
    return "";
  }
}
/**
 * 格式化显示
 * @param options
 * @param params
 */
function funnelNumberFormat(options: H3.Chart.ChartOptions, params: any) {
  // 数值格式设置
  const aliaName = options.dimension
    ? getAliaValue(options.dimension.uid, params.name, options.dataAlias)
    : "";
  const name = aliaName || params.name;
  const value = params.value ? params.value : 0;
  let res;
  options.metric.forEach((metric, index) => {
    if (params.componentIndex === index) {
      // 数值格式设置
      if (metric.options.numberFormat as H3.Report.NumberFormat) {
        res =
          name + "：" + convertNumber(value, metric.options.numberFormat as H3.Report.NumberFormat);
      } else {
        res = name + "：" + value;
      }
    }
  });
  return res;
}
export default funnelChartOptions;
