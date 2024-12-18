import { viewOptions, fontSetting, numericalFormatting } from "../../../help/utils";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import { tooltipShadowColor } from "../common/options";

/**
 * 绘制柱状图表
 * @param chartOptions
 * @param options
 * @param chartData
 */
function GaugeChartOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  const metric = options.metric[0];
  const data = chartData.data[0];

  const { tooltip, series }: any = viewOptions(options, chartData, {
    tooltip: {
      trigger: 'item',
      renderMode: 'richText',
      formatter: (params)=> {
        let showValue = params.data.value;
        const percent = data[2] === 0 ? "100%" : FormatPercent(showValue / data[2]);

        if (metric.options.numberFormat) {
          showValue = convertNumber(showValue, metric.options.numberFormat);
        }
        return '{a|实际值: '+ showValue + '\n}' +
               '{a|目标值: '+ FormatValue(data[2]) + '\n}' + 
               '{a|占比: '+ percent + '}'
      },
    },
    series: getSeries(options, chartData)
  });

  Object.assign(chartOptions, {
    tooltip,
    series
  });
  delete chartOptions.legend;
  return chartOptions;
}
/**
 * 将数值转为百分比，取2位小数
 * @param num
 * @returns
 */
function FormatPercent(num: number) {
  return ((num * 100).toFixed(2) + "%").replace(".00", "");
}
/**
 * 取值的2位小数
 * @param num
 * @returns
 */
function FormatValue(value: number) {
  return +parseFloat(value + "").toString()
    // .toFixed(2)
    
    // .replace(".00", "");
}

/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  const data = chartData.data[0];
  const showObj = options.progressLabel;
  let fakeValue;
  if (data[1] === 0 && data[2] === 0) {
    fakeValue = 0.000000000000000001;
  }
  const metric = options.metric[0];
  const modeOption = {
    radius: "85%",
    distance: 15,
    axisTickDistance:10,
    splitLineDistance: 10
  };
  if(options.gaugeMode && options.gaugeMode.mode  === 'out') {
    modeOption.radius = '65%',
    modeOption.distance = -15,
    modeOption.axisTickDistance = -24,
    modeOption.splitLineDistance=  -24
  }
  
  return {
    type: "gauge",
    // 太密集在小容器体验很差
    splitNumber: 4,
    // 默认半径太小
    radius: modeOption.radius,
    center: ["50%", "50%"],
    progress: {
      show: true
    },
    axisTick: {
      distance: modeOption.axisTickDistance, 
    },
    splitLine: {
      distance: modeOption.splitLineDistance,  
    },
    max: fakeValue || FormatValue(data[2]),
    axisLabel: {
      distance: modeOption.distance,
      show: showObj ? showObj.displayTarget : true,
      fontSize: options.fontSize,
      color: fontSetting(options) || options.defaultFontColor,
      formatter: value => {
        if (!metric || !metric.options.numberFormat) {
          return FormatValue(value);
        }
        return convertNumber(value, metric.options.numberFormat);
      }
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ["0%", "70%"],
      fontSize: options.fontSize + 2,
      color: fontSetting(options) || options.defaultFontColor,
      formatter: value => {
        let showValue = value;
        if (!fakeValue && metric.options.numberFormat) {
          showValue = convertNumber(value, metric.options.numberFormat);
        } else {
          if (fakeValue) {
            showValue = 0;
          }
        } 

        if (showObj) {
          // let percent = data[2] === 0 ? '100%' : (Math.floor((value/data[2])* 10000)/ 100) +  '%';
          const percent = data[2] === 0 ? "100%" : FormatPercent(value / data[2]);
          if (showObj.displayValue && showObj.displayPercent) {
            return `${showValue} (${percent})`;
          } else if (showObj.displayValue && !showObj.displayPercent) {
            return showValue;
          } else if (!showObj.displayValue && showObj.displayPercent) {
            return percent;
          } else {
            return "";
          }
        } else {
          return showValue;
        }
      }
    },
    data: [
      {
        value: fakeValue ? fakeValue : FormatValue(data[1]),
        name: data[0],
        title: {
          offsetCenter: ["0%", "20%"],
          fontSize: options.fontSize,
          color: fontSetting(options) || options.defaultFontColor
        }
      }
    ]
  };
}

export default GaugeChartOptions;
