import {
  fontSetting,
  numericalFormatting,
  warningLine,
  viewOptions,
  getDataZoom,
  checkForecast,
  getVisualMap
} from "../../../help/utils";
import { tooltipShadowColor } from "../common/options";
import Metric from "@/pc/dashboard/modules/metric";

/**
 * 绘制堆叠柱状图表
 * @param chartOptions
 * @param options
 * @param chartData
 */
function PercentPileBarChartOptions(
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
  return chartOptions;
}
const getAliaValue = (key: string, value: string, alias: any) => {
  const keyLowerCase = key.toLowerCase();
  const k = `${keyLowerCase}_${value}`;
  return alias ? (alias[k] !== undefined ? alias[k] : value) : value;
};
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
      emphasis: {
        focus: "series"
      },
      barMaxWidth: 60,
      barCategoryGap: "35%",
      labelLayout: {
        hideOverlap: true
      },
      // barGap: "20%",
      // barWidth: max + "%",
      // barCategoryGap: "20%",
      stack: "堆叠柱状图stack"
    };
    optionData.label = {
      color: fontSetting(options),
      // 数值显示开关
      show: options.dataLabel === null ? true : options.dataLabel,
      fontSize: options.fontSize,
      position: "inside",
      formatter: (params: any) => {
        // todo
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
    // 柱条最小高度
    // optionData.barMinHeight = 1;
    // 柱子间距
    // optionData.barCategoryGap = "22px";

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
      //publicOptions.yAxis.max = publicOptions.yAxis.max || null;
      publicOptions.yAxis.max = 1;
      publicOptions.yAxis.min = publicOptions.yAxis.min || null;
    }
  }
}

export default PercentPileBarChartOptions;
