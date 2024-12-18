
import {
  viewOptions,
  fontSetting,
  numericalFormatting,
  warningLine,
  getDataZoom, checkForecast, getVisualMap
} from "../../../help/utils";

/**
 * 绘制面积图表
 * @param chartOptions
 * @param options
 * @param chartData
 */
function areaChartOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const { xAxis, yAxis, tooltip, series, graphic }: any = viewOptions(options, chartData, {
    xAxis: { boundaryGap: false },
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
 * 十六进制转rgba
 */
function colorRgba(sHex, alpha = 1) {
  // 十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  let innerAlpha: any = alpha;
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4 || sColor.length === 5) {
      let sColorNew = '#';
      for (let i = 1; i < sColor.length; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 如果有透明度再执行
    if (sColor.length === 9) {
      innerAlpha = (parseInt('0x' + sColor.slice(7, 9))/255).toFixed(2)
    }
    //  处理六位的颜色值
    const sColorChange: any = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',' + innerAlpha + ')'
  } else {
    return sColor
  }
}
/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  return chartData.groupArray.map((group: string,index:number) => {
    const optionData: any = { name: group, type: "line", stack: "总量", areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 1, color: colorRgba(options.colors[index],0.1) // 0% 处的颜色
        }, {
          offset: 0, color: options.colors[index] // 100% 处的颜色
        }],
        global: false // 缺省为 false
      }
      }
    };
    optionData.label = {
      // 数值显示开关
      show: options.dataLabel === null ? true : options.dataLabel,
      position: "top",
      fontSize: options.fontSize,
      color: fontSetting(options) || options.defaultFontColor,
      formatter: (params: any) => {
        // 数值格式设置
        return numericalFormatting(params, chartData, options);
      }
    };
    return optionData;
  });
}
export default areaChartOptions;
