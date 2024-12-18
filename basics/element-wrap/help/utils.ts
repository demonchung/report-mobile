import { convertNumber, stringNumber } from "@h3/report-mobile/basics/utils/number";
import { tooltipBgColor, lineColor, tooltipShadowColor } from "../chart/render-echart/common/options";
import { subStr, getStrLen, makeStr } from "@h3/report-mobile/basics/utils/string";
import { StringType, AddressType } from "@h3/report-mobile/basics/enum/filter-type";
import { addCNFormat } from "@h3/report-mobile/basics/utils/date";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { forecastData } from "@h3/report-mobile/basics/utils/forecast";
import Alias from "@h3/report-mobile/basics/components/alias"
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";


/**
 * 生成图表配置
 * @param options
 * @param chartData
 * @param config  对图表属性做配置,提供7个默认配置tooltip，xAxis，yAxis，legend，dataset，color，grid
 *  例： {
 *           tooltip: 'default',             // ‘default’使用tooltip默认配置
 *           xAxis: {
 *               axisLine: {  show: false } // 在提供默认的配置上扩展axisLine: {  show: false }，已有这个属性，则会覆盖掉
 *              }
 *           radar: {
 *                radius: '55%'             // 新增radar配置
 *           }
 *        }
 */
function viewOptions(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>,
  config: any
) {
  const chartOptions: any = {};
  const chartConfigMap = {
    tooltip: getTooltip(options, chartData),
    xAxis: getXAxis(options, chartData as H3.Chart.ChartData),
    yAxis: getYAxis(options, chartData as H3.Chart.ChartData),
    legend: getLegend(options, chartData),
    dataset: getDataset(options, chartData),
    color: options.colors,
    grid: getGrid(options, chartData),
    graphic: getGraphic(options,chartData),
  };
  // await setLegendTooltip(chartConfigMap.legend);
  Object.keys(config).forEach((key: string) => {
    // config { key : value}  1. value为'default'，用默认的配置 2 .value 等于Object，扩展默认配�3. value为其它类型，以其它为准
    if (chartConfigMap[key]) {
      chartOptions[key] =
        config[key] === "default"
          ? chartConfigMap[key]
          : Object.prototype.toString.call(config[key]) === "[object Object]"
          ? Object.assign(chartConfigMap[key], config[key])
          : config[key];
    } else {
      chartOptions[key] = config[key];
    }
  });
  return chartOptions;
}

/**
 *  获取tooltip
 * @param options
 * @param chartData
 */
function getTooltip(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>
) {
  const check = checkForecast(options);
  return {
    trigger: "axis",
    backgroundColor: tooltipBgColor,
    extraCssText: "padding: 10px;border-radius: 4px; background: rgba(18,25,51,0.85);",
    borderColor: "rgba(0, 0, 0, 0)",
    confine: true,
    // triggerOn:'click',
    transitionDuration: 0.1,
    textStyle: {
      color: "#fff",
      fontSize: 12
    },
    renderMode: 'richText',
    // position: (pos, params, dom, rect, size) => {
    //   // 0.05为grid.right边距的值
    //   let pw = size.viewSize[0] - pos[0] - size.contentSize[0] * 0.05;
    //   let x =
    //     pw >= size.contentSize[0]
    //       ? pos[0]
    //       : size.viewSize[0] - size.contentSize[0] - size.contentSize[0] * 0.1;
    //   let y =
    //     pos[1] >= size.contentSize[1]
    //       ? pos[1] - size.contentSize[1] * 0.92
    //       : size.contentSize[1] * 0.08;
    //   return [x, y];
    // },
    formatter: (params: any, index) => {
      // 类别与X轴的别名取相同
      const aliaName = options.dimension
        ? getAliaValue(options.dimension.uid, params[0].name, options.dataAlias)
        : "";
      const name = aliaName || params[0].name;
      let seriesName;
      let value;
      let dataIndex;
      let res = "";
      res += "{a|" + name + "\n}";
      const paramsSize = params.length - 1;
      const pileSum = options.dataLabelPileSum && options.dataLabelPileSum === true;
      // 是否设置了显示堆叠合计
      if (pileSum) {
        const sumName = "合计";
        const sum = processPileSum(params[0].data);
        res += "{b|" + sumName + ": " + sum.toFixed(2) + "\n}";
      }
      params.forEach((item: any) => {
        dataIndex = item.dataIndex;
        if (pileSum) {
          if (item.componentIndex == paramsSize) {
            return;
          }
        }
        const aliaValueName = options.groupDimension
          ? getAliaValue(options.groupDimension.uid, item.seriesName, options.dataAlias)
          : "";
        seriesName = (chartData as H3.Chart.ChartData).groupNameArray
          ? (chartData as any).groupNameArray[item.seriesName]
          : aliaValueName || item.seriesName;
        value = numericalFormatting(item, chartData as H3.Chart.ChartData, options);
        if (index + 1 === params.length) {
          res += item.marker + '{c|' + seriesName + ': ' + value + '}';
        } else {
          res += item.marker + '{c|' + seriesName + ': ' + value + '\n}';
        }
      });
      if (check && chartData && (chartData as any).data) {
        if (dataIndex > (chartData as any).data.length - options.forecast.number - 1) {
          res = '{d|' + '预测数据 : ' + '\n}' + res;
        }
      }
      return res;
    },
    axisPointer: {
      shadowStyle: {
        color: tooltipShadowColor
      }
    }
  };
}

function processPileSum(row: any[]): number {
  let pileSum: number = 0;
  row.forEach((cell: number, index: number) => {
    // 最后一个是合计值展示值，不要计算在合计值里面了
    if (index === row.length - 1) {
      return;
    }
    if (typeof cell === "number") {
      const metric = row[index];
      // 堆叠图最大值需要累加计算
      pileSum += metric || 0;
    }
  });
  return pileSum;
}

/**
 * 
 * 转换Y轴标题字符串 
 */
function axisyNameSetting(axisyName,option) {
  const oValue: any = axisyName;
  let resultVal = '';
  if (oValue) {
    const stripeSeries: any = ['stripe','percentPileStripe','pileStripe']; //条形图系列图表类型
    if (stripeSeries.includes(option.type)) {
      resultVal = oValue;
    } else {
      const resultArr = oValue.split('').map(char => [char, '\n']).flat();
      resultArr.pop(); // 删除最后一个换行符
      resultVal = resultArr.join('');
    }
  }
  return resultVal;
}
/**
 * 判断当前渲染数据为双轴图的哪条轴
 */
function judgeLeftOrRight(option) {
  let index;
  if (option.multiMetricType && option.multiMetricType.length) {
    const typeIndex = option.multiMetricType.indexOf(option.type);
    index = typeIndex > -1 ? typeIndex : 0;
  } else {
    index = 0;
  }
  return !!index;
}

function getGraphic(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>
) {
  if (
    ![
      ElementType.BAR,
      ElementType.PILEBAR,
      ElementType.PERCENTPILEBAR,
      ElementType.STRIPE,
      ElementType.PILESTRIPE,
      ElementType.PERCENTPILESTRIPE,
      ElementType.LINE,
      ElementType.AREA,
      ElementType.BIAX,
    ].includes(options.type)
  )
    {return;}

  const axisyIndex = judgeLeftOrRight(options); //false:左轴，true右轴 判断双轴图
  const stripeSeries: any = ["stripe", "percentPileStripe", "pileStripe"]; //条形图系列图表类型
  const isStripe = stripeSeries.includes(options.type);
  let leftLength: any = isStripe ? "center" : 3;
  let topLength: any = isStripe ? 5 : "center";
  let rightLength: any = 3;
  if (options.legend.checked && options.legend.position === 'top' && isStripe) {
    topLength = 25;
  }
  if (options.legend.checked && options.legend.position === 'left' && !isStripe) {
    leftLength = 100;
  }
  if (options.legend.checked && options.legend.position === 'right' && !isStripe) {
    rightLength = 108;
  }
  const graphData: any = [
    {
      type: "group",
      z: 20,
      left: leftLength,
      top: topLength,
      children: [
        {
          type: "text",
          style: {
            fill: fontSetting(options) || options.defaultFontColor,
            lineHeight: 16,
            overflow: 'break',
            text: options.axisY && options.axisY.displayName ? axisyNameSetting(options.axisY.leftYName,options) || '' : '',
            fontSize: 12,
            fontWeight: 600
          }
        }
      ]
    },
    {
      type: "group",
      z: 20,
      right: rightLength,
      top: topLength,
      children: [
        {
          type: "text",
          style: {
            fill: fontSetting(options) || options.defaultFontColor,
            lineHeight: 16,
            overflow: 'break',
            text: options.axisY && options.axisY.displayName ? axisyNameSetting(options.axisY.rightYName,options) || '' : '',
            fontSize: 12,
            fontWeight: 600
          }
        }
      ]
    }
  ];
  //graphData = characterSplitDisplay(graphData, options);
  return  graphData;
}
/**
 * Y轴标题字符串拆分，不同字符不同显示方式
 * graphData含两个对象，第一个对象为常用显示轴,以及双轴图的左轴,第二个对象仅在双轴图的右轴显示
 */
function characterSplitDisplay(oGraphData, options: H3.Chart.ChartOptions) {

}

/**
 *  获取tooltip
 * @param options
 * @param chartData
 */
function getDataZoom(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>
) {
  let axisx: any = {
    xAxisIndex: [0],
    bottom: 8,
    height: "20",
    brushSelect: false // 刷选功能，新版本支持按住鼠标左键后框选出选中部分
  };
  if (
    options.type === "stripe" ||
    options.type === "pileStripe" ||
    options.type === "percentPileStripe"
  ) {
    axisx = {
      yAxisIndex: [0],
      width: "20",
      right: 8
    };
  }

  const colorOptions = {
    backgroundColor: "#ffffff",
    borderColor: "rgba(231, 231, 231, 1)",
    fillerColor: "rgba(80, 130, 228, 0.05)",
    lineStyleColor: "rgba(231, 231, 231, 1)",
    areaStyleColor: "#F1F1F1",
    handleStyleColor: "rgba(192, 200, 203, 1)",
    textStyleColor: "#333"
  };
  if (options.DataZoom && options.DataZoom.theme === "dark") {
    colorOptions.backgroundColor = "#2A2A2A";
    colorOptions.fillerColor = "rgba(255, 255, 255, 0.12)";
    colorOptions.borderColor = "#575757";
    colorOptions.lineStyleColor = "#575757";
    colorOptions.areaStyleColor = "#434343";
    colorOptions.handleStyleColor = "#A7A7A7";
    colorOptions.textStyleColor = "#A7A7A7";
  }

  return [
    {
      type: "slider",
      start: options.DataZoom ? options.DataZoom.start : 0,
      end: options.DataZoom ? options.DataZoom.end : 100,
      brushSelect: false, // 刷选功能，新版本支持按住鼠标左键后框选出选中部分
      ...axisx,
      show: options.DataZoom ? options.DataZoom.show : false,
      backgroundColor: colorOptions.backgroundColor,
      borderColor: colorOptions.borderColor,
      fillerColor: colorOptions.fillerColor,
      textStyle: {
        color: colorOptions.textStyleColor
      },
      labelFormatter: (value) => {
        const tmpValue = (chartData instanceof Array ? chartData[0] : chartData).data[value][0];
        const aliaName = options.dimension
          ? getAliaValue(options.dimension.uid, tmpValue, options.dataAlias)
          : "";
        const dataAlias = aliaName || tmpValue;
        return dataAlias;
      },
      dataBackground: {
        lineStyle: {
          color: colorOptions.lineStyleColor,
          opacity: 1
        },
        areaStyle: {
          color: colorOptions.areaStyleColor,
          opacity: 0.5
        }
      },
      handleStyle: {
        color: colorOptions.handleStyleColor
      }
      // handleIcon:
      //   "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
      // handleSize: "80%",
      // handleStyle: {
      //   color: "#fff",
      //   shadowBlur: 3,
      //   shadowColor: "rgba(0, 0, 0, 0.6)",
      //   shadowOffsetX: 2,
      //   shadowOffsetY: 2
      // }
    },
    {
      type: "inside",
      ...axisx,
      disabled: options.DataZoom ? !options.DataZoom.show : true
    }
  ];
}
/**
 *  获取xAxis
 * @param options
 * @param chartData
 */
function getXAxis(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>
) {
  let axisLineShow: boolean = true;
  let axisLabelShow: boolean = true;
  if (options.axisX) {
    axisLineShow = options.axisX.displayAxisX === null ? true : options.axisX.displayAxisX;
    axisLabelShow = options.axisX.displayLabel === null ? true : options.axisX.displayLabel;
  }

  return {
    type: "category",
    axisLabel: {
      formatter: (value: string, index) => {
        // x轴永远是dimension的值,使用dimension的uid拼value取别名
        const aliaName = options.dimension
          ? getAliaValue(options.dimension.uid, value, options.dataAlias)
          : "";
        const dataAlias = aliaName || value;
        const limitDataAlias = subStr(dataAlias, 14, true);
        // 刻度竖直显示时，限制高度，保证图表的正常显示
        return options.axisX && options.axisX.direction === "endwise"
          ? limitDataAlias.split("").join("\n")
          : dataAlias;
      },
      color: fontSetting(options) || options.defaultFontColor,
      rotate: mapAxisRotate(options),
      // fontSize: options.fontSize,
      show: axisLabelShow
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: lineColor
      }
    },
    axisLine: {
      lineStyle: {
        color: lineColor
      },
      show: axisLineShow
    }
  };
}
/**
 *  计算坐标轴刻度角度
 * @param options
 */
function mapAxisRotate(options: H3.Chart.ChartOptions): number {
  let rotate: number = 0;
  if (options.axisX && options.axisX.direction) {
    if (options.axisX.direction === "leftBank") {
      rotate = 45;
    } else {
      if (options.axisX.direction === "rightBank") {
        rotate = -45;
      }
    } 
  }
  return rotate;
}
/**
 *  获取yAxis
 * @param options
 * @param chartData
 */
function getYAxis(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  const rangeData = metricRangeMatrixing(options, chartData);
  return {
    type: "value",
    axisLabel: {
      show: options.axisY === undefined ? true : !!options.axisY.displayLabel,
      // fontSize: options.fontSize,
      formatter: (value: any) => {
        // 数值显示功能以第一个指标的设置为主

        const numberFormat = options.metric[0].options.numberFormat as H3.Report.NumberFormat;
        // if (numberFormat) {
        //   value = convertNumber(value, numberFormat as any);
        // }
        if (options.type === "percentPileBar" || options.type === "percentPileStripe") {
          const unit = "%";
          return value * 100 + unit;
        } else {
          if (numberFormat) {
            value = convertNumber(value, numberFormat as any);
          }
        } 
        if (!numberFormat || (!numberFormat.fraction && !numberFormat.percent)) {
          value = stringNumber(value);
        }

        return value;
      },
      color: fontSetting(options) || options.defaultFontColor
      // rotate: 0
    },
    min: rangeData.min,
    max: rangeData.max,
    axisTick: {
      show: false
    },
    axisLine: {
      show: options.axisYSet === undefined ? false : !!options.axisYSet,
      lineStyle: {
        color: lineColor
      }
    },
    splitLine: {
      show: options.splitLine === undefined ? true : !!options.splitLine,
      lineStyle: {
        color: options.themeOptions.splitLine.lineStyle,
        //type: "dashed",
        type: [3, 6],
        width: 0.7,
      }
    }
  };
}

/**
 *  获取gird
 * @param options
 * @param chartData
 */
function getGrid(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>
) {
  return {
    top:  options.fontSize > 22 ? 30 : 24,
    right: 20,
    left: 20,
    bottom: 12,
    containLabel: true // 区域是否包含坐标轴的刻度标签
  };
}

/**
 *  获取dataset
 * @param options
 * @param chartData
 * @param dataSource
 */
function getDataset(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>
) {
  let dataSource;
  const realSource: Array<any> = [];
  let datas: Array<any> = [];
  if (chartData instanceof Array) {
    chartData.forEach((chart: H3.Chart.ChartData) => {
      datas.push(chart.data);
    });
    const length = datas.length;
    if (length > 0) {
      datas[0].forEach((d, index) => {
        let item = [...d];
        let i = 1;
        while (i < length) {
          const splice = datas[i][index].slice(1, datas[i][index].length);
          item = [...item, ...splice];
          i += 1;
        }
        realSource.push(item);
      });
    }
    dataSource = realSource;
  } else {
    dataSource = (chartData as H3.Chart.ChartData).data;
  }
  return {
    source: dataSource
  };
}
/**
 *  获取异步设置Legend
 */
function setLegendTooltip(legend) {
  setTimeout(() => {
    if (legend.maxLength && legend.maxLength >= 12) {
      legend.tooltip.show = true;
    }
  }, 0);
}
/**
 *  获取Legend
 * @param options
 * @param chartData
 */
function getLegend(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>
) {
  let groupArray: Array<any> = [];
  let groupNameArray: any = {};
  let maxLength: number = 0;
  if (chartData instanceof Array) {
    chartData.forEach((chart: H3.Chart.ChartData) => {
      groupArray.push(...chart.groupArray);
      groupNameArray = Object.assign(groupNameArray, chart.groupNameArray);
    });
  } else {
    groupNameArray = (chartData as H3.Chart.ChartData).groupNameArray;
    groupArray = (chartData as H3.Chart.ChartData).groupArray;
  }
  return {
    itemGap: 16,
    itemWidth: 8,
    textStyle: {
      color: fontSetting(options) || options.defaultFontColor
    },
    icon: "circle",
    type: "scroll",
    bottom: 10,
    pageIconColor: options.isTransparent? '#aaaaaa' : '#2F4554', //翻页按钮的颜色
    pageIconInactiveColor: options.isTransparent? '#2F4554' : '#aaaaaa', //翻页按钮不激活时(即翻页到头时)的颜色
    pageIconSize: 12,
    pageTextStyle: {
      color: fontSetting(options) || options.defaultFontColor
    },
    data: groupArray,
    formatter: (value: string) => {
      const legendValue = getLengedValue(value, options, groupNameArray);
      const strLength = getStrLen(legendValue);
      maxLength = maxLength < strLength ? strLength : maxLength;
      if (options.isWxwork) {
        return legendValue;
      } else {
        return subStr(legendValue, 12, true);
      }
    },
    show: options.legend ? (options.legend.checked === null ? true : options.legend.checked) : true,
    tooltip: {
      show: true,
      formatter: (obj: any) => {
        return getLengedValue(obj.name, options, groupNameArray);
      },
      confine: true
    }
  };
}

/**
 * 图例格式化
 * @param value
 */
function getLengedValue(value, options, groupNameArray) {
  // 二唯一指标时value为具体值，需要通过groupDimension 次纬度的uid_value去拿到别名
  // 一唯一指标和一纬多指标时，value为Uid，没有groupDimension 次纬度，通过groupNameArray[uid]拿值
  // 漏斗图/饼图只有一唯一指标所以用 options.dimension作为纬度图例
  const realName = options.groupDimension
    ? getAliaValue(options.groupDimension.uid, value, options.dataAlias)
    : options.dimension
    ? getAliaValue(options.dimension.uid, value, options.dataAlias)
    : "";
  const legendValue: string =
    groupNameArray && groupNameArray[value] ? groupNameArray[value] : realName ? realName : value;
  return legendValue;
}
/**
 * 图例设置
 * @param chartOptions
 * @param options
 */
function legendSetting(chartOptions: any, options: H3.Chart.ChartOptions) {
  if (options.legend) {
    const position = options.legend.position;
    if (options.legend.checked) {
      chartOptions.legend[position] = position;
      if (position === "top" || position === "bottom") {
        chartOptions.legend.orient = "horizontal";
        chartOptions.legend.left = "left";
      } else {
        chartOptions.legend.top = "middle";
        chartOptions.legend.orient = "vertical";
      }
      chartOptions.grid.bottom = options.DataZoom && options.DataZoom.show ? "40" : "12";
      switch (position) {
        case "top":
          chartOptions.grid.top =options.fontSize > 22 ? "46":"42";
          break;
        case "bottom":
          chartOptions.legend.bottom = options.DataZoom && options.DataZoom.show ? "32" : "10";
          chartOptions.grid.bottom = options.DataZoom && options.DataZoom.show ? "64" : "32";
          break;
        case "left":
          chartOptions.grid.left = "120";
          break;
        case "right":
          chartOptions.grid.right = "125";
          break;
        default:
          break;
      }
    } else {
      chartOptions.grid.bottom = options.DataZoom && options.DataZoom.show ? "46" : "12";
    }
  }
}

/**
 * 自定义范围数值换算
 * @param options
 * @param chartData
 * @param isGetOriginal 是否取原始值
 */
function metricRangeMatrixing(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData,
  isGetOriginal: boolean = false
) {
  let min: any;
  let max: any;
  if (isGetOriginal) {
    min = options.metricRange
      ? options.metricRange.min || chartData.minMetric
      : chartData.minMetric;
    max = options.metricRange
      ? options.metricRange.max || chartData.maxMetric
      : chartData.maxMetric;
  } else {
    min = options.metricRange ? options.metricRange.min : null;
    max = options.metricRange ? options.metricRange.max : null;
  }
  if (
    options.multiMetricType &&
    options.multiMetricType.length > 0 &&
    options.multiRange &&
    options.multiRange.length > 0
  ) {
    const index = options.multiMetricType.findIndex((i) => i === options.type);
    min = options.multiRange[index] ? options.multiRange[index].min : null;
    max = options.multiRange[index] ? options.multiRange[index].max : null;
  }
  if (min && !max) {
    const numLen =
      parseInt((chartData.maxMetric as any).toString().replace("-", ""), 10).toString().length -
        1 || 1;
    max = Math.ceil((chartData.maxMetric as any) / Math.pow(10, numLen)) * Math.pow(10, numLen);
    if (max <= min) {
      const minLen = parseInt(min.toString().replace("-", ""), 10).toString().length - 1 || 1;
      max = (Math.ceil((min as any) / Math.pow(10, minLen)) + 1) * Math.pow(10, minLen);
    }
  } else if (max < 0 && !min && max) {
    const numLen = parseInt(max.toString().replace("-", ""), 10).toString().length - 1 || 1;
    min = (Math.floor((max as any) / Math.pow(10, numLen)) - 1) * Math.pow(10, numLen);
  } else {
    if (max === 0) {
      min = -100;
    }
  } 
  // 判断输入的最小值如果比原始值还大，则最小值变为原始值
  // if (chartData.minMetric && min > chartData.minMetric) {
  //   min = chartData.minMetric;
  // }
  return { max, min };
}

/**
 * 获取最大指标的显示值
 * @param chartOptions
 * @param options
 * @param chartData
 */
function getMaxMetricLength(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData
) {
  let length = 0;
  const numberFormat = options.metric[0].options.numberFormat as H3.Report.NumberFormat;
  if (numberFormat && (numberFormat.fraction || numberFormat.percent) && chartData.maxMetric) {
    if (chartData.maxMetric) {
      const pow = Math.pow(10, Math.ceil(chartData.maxMetric).toString().length - 1);
      const maxMetricLabel = chartOptions.yAxis.axisLabel.formatter(
        Math.ceil(chartData.maxMetric / pow) * pow
      );
      const span = document.createElement("span");
      span.innerText = maxMetricLabel;
      document.body.appendChild(span);
      length = span.offsetWidth + 10;
      document.body.removeChild(span);
    }
  }
  return length;
}

/**
 * 数值格式设置
 * @param params
 * @param chartData
 * @param options
 * @param beforeIndex 真实数据index的前置index  用于复合图表-双轴图
 *   ['bar', 'stripe', 'area', 'line', 'pileBar','pileStripe']
 */
function numericalFormatting(
  params: any,
  chartData: H3.Chart.ChartData,
  options: H3.Chart.ChartOptions,
  beforeIndex: number = 0
) {
  let groupData;
  if (options.type === "percentPileBar" || options.type === "percentPileStripe") {
    groupData = chartData.mRangeDate[chartData.index + params.dataIndex] || [];
  } else {
    groupData = chartData.metricRangeData[chartData.index + params.dataIndex] || [];
  }
  //let groupData = chartData.metricRangeData[chartData.index + params.dataIndex] || [];
  let value = groupData[params.componentIndex - beforeIndex];
  let metricGroupItem: Array<H3.Report.FieldColumn> = [];
  if (!value && value !== 0) {
    value = groupData[params.componentIndex - beforeIndex + 1] || 0;
  }
  if (options.metricGroup && options.metricGroup.length) {
    metricGroupItem = beforeIndex > 0 ? options.metricGroup[1] : options.metricGroup[0];
    // 多维情况下需要区分
    if (chartData.groupLength > 0) {
      metricGroupItem.forEach((item, index) => {
        if (
          params.componentIndex - beforeIndex < chartData.groupLength &&
          (item.options.numberFormat as H3.Report.NumberFormat)
        ) {
          value = convertNumber(value, item.options.numberFormat as H3.Report.NumberFormat);
        }
      });
    } else {
      metricGroupItem.forEach((item, index) => {
        // beforeIndex 正对于双轴图 多轴计算第几个指标
        if (
          params.componentIndex - beforeIndex === index &&
          (item.options.numberFormat as H3.Report.NumberFormat)
        ) {
          value = convertNumber(value, item.options.numberFormat as H3.Report.NumberFormat);
        }
      });
    }
  } else {
    options.metric.forEach((item, index) => {
      if (item.options.numberFormat) {
        if (options.metric.length > 1) {
          if (params.componentIndex === index) {
            value = convertNumber(value, item.options.numberFormat as H3.Report.NumberFormat);
          }
        } else {
          // 等一个指标
          value = convertNumber(value, item.options.numberFormat as H3.Report.NumberFormat);
        }
      }
    });
  }
  return value;
}

/**


 
/**
 * 处理警戒线自定义指标范围
 * @param options
 * @param chartData
 * @param chartOptions
 * @param line
 */
function handleMarkLineMetricRange(
  chartData: H3.Chart.ChartData,
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  line: H3.Report.WarningLine
) {
  let labelValue; // label展示值
  let axisValue; // 坐标刻度的值
  if (line.type === "dynamic") {
    axisValue = getMarkLineValue(chartData, options, line);
    labelValue = axisValue;
    options.metric.forEach(item => {
      if (line.field === item.uid && item.options && item.options.percent === "PERCENT") {
        labelValue = Number(labelValue) * 100 + "%";
      }
    });
  } else {
    labelValue = line.value;
    if (/%$/.test(`${line.value}`)) {
      axisValue = Number(`${line.value}`.replace("%", "")) / 100;
    } else {
      axisValue = labelValue;
    }
  }
  if (line.numberFormat) {
    labelValue = convertNumber(labelValue, line.numberFormat as any);
  }
  // 取整数，echart对某些太精确的小数位，坐标轴刻度自动计算会有问题
  const rangeAxisValue = axisValue < 0 ? Math.floor(axisValue) : Math.ceil(axisValue);
  if (
    axisValue > (chartData as any).maxMetric &&
    !(options.metricRange && options.metricRange.max)
  ) {
    if (chartOptions.yAxis.max) {
      chartOptions.yAxis.max =
        chartOptions.yAxis.max > axisValue ? chartOptions.yAxis.max : rangeAxisValue;
    } else {
      chartOptions.yAxis.max = rangeAxisValue;
    }
  }
  if (
    axisValue < (chartData as any).minMetric &&
    !(options.metricRange && options.metricRange.min)
  ) {
    if (chartOptions.yAxis.min) {
      chartOptions.yAxis.min =
        chartOptions.yAxis.min < axisValue ? chartOptions.yAxis.min : rangeAxisValue;
    } else {
      chartOptions.yAxis.min = rangeAxisValue;
    }
  }
  if (options.metricRange) {
    if (options.metricRange.max && axisValue > options.metricRange.max) {
      axisValue = options.metricRange.max;
    }
    if (options.metricRange.min && axisValue < options.metricRange.min) {
      axisValue = options.metricRange.min;
    }
  }
  return { axisValue, labelValue };
}
/**
 * 动态模式计算警戒线值
 * @param chartData
 * @param line
 * @param options
 */
function getMarkLineValue(
  chartData: H3.Chart.ChartData,
  options: H3.Chart.ChartOptions,
  line: H3.Report.WarningLine
) {
  let markLineValue;
  let fieldData = [];

  if (options.groupDimension && options.groupDimension.field && options.metric.length) {
    for (const value of chartData.metricRangeData) {
      fieldData = fieldData.concat(value);
    }
  } else {
    const tmpIndex = chartData.groupArray.findIndex((uid: string) => line.field === uid);
    if (tmpIndex === 0 || tmpIndex) {
      fieldData = chartData.metricRangeData.map(data => {
        return data[tmpIndex];
      });
    }
  }
  switch (line.aggregate) {
    case "max":
      markLineValue = Math.max(...fieldData);
      break;
    case "min":
      markLineValue = Math.min(...fieldData);
      break;
    case "average":
      let total = 0;
      fieldData.forEach(num => {
        total += num;
      });
      markLineValue = total / fieldData.length;
      break;
    default:
      break;
  }
  return markLineValue;
}
/**
 * 构造警戒线data数据
 * @param chartOptions
 * @param line
 * @param chartData
 * @param options
 * @param axis
 */
function createWarningLineData(
  chartOptions: any,
  line: H3.Report.WarningLine,
  chartData: H3.Chart.ChartData,
  options: H3.Chart.ChartOptions,
  axis: "x" | "y"
) {
  const { axisValue, labelValue } = handleMarkLineMetricRange(chartData, chartOptions, options, line);
  const optJson: any = {
    lineStyle: {
      normal: {
        width: 1,
        type: "dashed",
        color: line.color
      }
    },
    label: {
      formatter: param => {
        const value: number = labelValue;
        if (line.is_title && line.is_value) {
          return line.title + ": " + value;
        } else {
          return line.is_title ? line.title : value;
        }
      }
    }
  };
  if (axis === "x") {
    optJson.yAxis = axisValue;
  } else {
    optJson.xAxis = axisValue;
  }
  return optJson;
}

/**
 * 警戒线配置
 * @param chartOptions
 * @param chartData
 * @param options
 * @param axis 警戒线在x轴/y轴
 */
function warningLine(
  chartOptions: any,
  chartData: H3.Chart.ChartData,
  options: H3.Chart.ChartOptions,
  axis: "x" | "y" = "x"
) {
  const warningOpt: any = {
    silent: true, // 关闭响应和触发鼠标事件
    symbol: [], // 去除箭头
    label: {
      position: "middle" // 数值显示在中间
    },
    data: []
  };
  // 判断存在字段，列表分析没有该字段和警戒线功能
  if (options.warningLine) {
    options.warningLine.forEach((item: H3.Report.WarningLine) => {
      // 警戒线markLine属性添加在series[0]中
      const dateItem = createWarningLineData(chartOptions, item, chartData, options, axis);
      if (!chartOptions.series[0].markLine) {
        // 警戒线前置配置
        chartOptions.series[0].markLine = warningOpt;
      }
      chartOptions.series[0].markLine.data.push(dateItem);
    });
  }
}

/**
 * 字体设置
 * @param options
 */
function fontSetting(options: H3.Chart.ChartOptions) {
  const defaultColor: any = null;
  return options.fontColor ? options.fontColor : defaultColor;
}
/**
 * 获取地图数据
 */
function getGeoMap(mapJson){
  if(mapJson && mapJson.features){
    const resMap = {};
    mapJson.features.forEach((provice)=>{
      const name = provice.properties.name;
      const center = provice.properties.center;
      if (name) {resMap[name] = center;}
    });
    return resMap;
  }
  return {};
}
/**
 * 转换地图气泡数据
 */
function convertData(geoCoordMap,data) {
  const res:any = [];
  for (let i = 0; i < data.length; i++) {
    const geoCoord = geoCoordMap[data[i].name];
    if (geoCoord && data[i].value) {
      res.push({
        ...data[i],
        value: geoCoord.concat(data[i].value),
      });
    }
  }
  return res;
}
/**
 * 处理大数据
 * @param chart
 * @param chartOptions
 * @param container
 * @param chartDatas
 * @param options
 */
function handleBigData(
  chart: any,
  chartOptions: any,
  container: HTMLDivElement,
  chartDatas: H3.Chart.ChartData | Array<H3.Chart.ChartData>,
  options: H3.Chart.ChartOptions
) {
  const isArray = chartDatas instanceof Array;
  let chartData: H3.Chart.ChartData;
  const otherChartData: H3.Chart.ChartData = isArray ? chartDatas[1] : null;
  chartData = isArray ? chartDatas[0] : chartDatas;
  chartData.data = chartOptions.dataset.source;

  if (chartData.dimensionLength > chartData.maxDimension) {
    container.style.position = "relative";
    let div = document.createElement("div");
    let scrollDirection = "X";
    // 判断是否为横向出现滚动条
    if (!options.direction || ["bottom", "top"].includes(options.direction)) {
      div.style.width = (chartData.dimensionLength / chartData.maxDimension) * 100 + "%";
      div.style.height = "1px";
      scrollDirection = "X";
    } else {
      div.style.height = (chartData.dimensionLength / chartData.maxDimension) * 100 + "%";
      div.style.width = "1px";
      scrollDirection = "Y";
    }
    div.style.position = "absolute";
    div.style.top = "0px";
    div.style.left = "0px";
    div.style.zIndex = "-1";
    container.appendChild(div);
    let warp = container.firstChild as HTMLDivElement;
    warp.style.position = "absolute";
    warp.style.top = "0px";
    warp.style.left = "0px";
    // 监听滚动条方向
    let pi: number = 0;
    container.addEventListener(
      "scroll",
      (e: Event) => {
        // 判断滚动条生成方向，X or Y方向
        if (scrollDirection == "X") {
          const left = container.scrollLeft;
          const width = (e.target as HTMLDivElement).clientWidth;
          warp.style.left = left + "px";
          pi = Math.round((left / width) * chartData.maxDimension);
          pi = isNaN(pi) ? 0 : pi;
          chartOptions.dataset.source = chartData.data.slice(pi, chartData.maxDimension + pi);
        } else {
          const top = container.scrollTop;
          const height = (e.target as HTMLDivElement).clientHeight;
          warp.style.top = top + "px";
          pi = Math.round((top / height) * chartData.maxDimension);
          pi = isNaN(pi) ? 0 : pi;
          chartOptions.dataset.source = chartData.data.slice(pi, chartData.maxDimension + pi);
        }
        chartData.index = pi;
        if (otherChartData) {
          otherChartData.index = pi;
        }
        chart.setOption(chartOptions);
      },
      false
    );
  }
  chartOptions.dataset.source = chartData.data.slice(0, chartData.maxDimension);
}

function getCompareData(options, chartData, targetUid) {
  let resData: any = [];
  if (options.compareData && options.compareData.length) {
    options.compareData.forEach((d) => {
      const metch = chartData.data.find((e) => e[targetUid] === d);
      if (metch) {resData.push(metch);}
    });
  }
  if (resData.length < 2) {
    resData = chartData.data.slice(0, 2);
  }
  return resData;
}
/**
 * 解析图表数据
 */
function analysisChartData(params: any, chartData, options: H3.Chart.ChartOptions) {
  const linkageList: any[] = [];
  if (!options.dimension) {
    return linkageList;
  }
  const dimensionFilter = getFilterData(options.dimension, chartData, options, params, params.name);
  if (dimensionFilter) {
    linkageList.push(dimensionFilter);
  }
  // 判断是否有groupDimension，有则为2维，无则1维
  if (options.groupDimension) {
    const groupDimensionFilter = getFilterData(
      options.groupDimension,
      chartData,
      options,
      params,
      params.seriesName,
      true
    );
    if (groupDimensionFilter) {
      linkageList.push(groupDimensionFilter);
    }
  }
  return linkageList;
}
/**
 * 只做指标的值跳转需要用到指标filter
 */
function getMeticFilter(params: any, chartData, options: H3.Chart.ChartOptions) {
  try {
    const data = JSON.parse(JSON.stringify(chartData.data || []));
    const meticLength = options.metric.length || 0;
    let res: any = [];
    const fields = options.metric || [];
    if (options.type === "radar") {
      const topIndex = params.event.topTarget.__dimIdx;
      const text = params.data.value[topIndex];
      res.push({
        text: [text || 0],
        field: fields[0], //目前只有一个指标
        formula: "Equal"
      });
    } else if (params.componentSubType === "scatter") {
      let texts = params.value.slice(0, meticLength);
      texts.length &&
        texts.forEach((t, i) => {
          const obj = {
            text: [t || 0],
            field: fields[i],
            formula: "Equal"
          };
          res.push(obj);
        });
    } else if (options.type === "funnelCompare") {
      const dimensionUid = options.dimension.uid;
      const compareData = options.compareData.length
        ? options.compareData
        : data.slice(0, 2).map(d => {
            return d[dimensionUid];
          });
      const compareD = compareData[params.componentIndex];
      const clickData = data.find(el => el[dimensionUid] === compareD);
      if (clickData) {
        fields.length &&
          fields.forEach((f) => {
            const obj = {
              text: [clickData[f.uid]],
              field: f,
              formula: "Equal"
            };
            res.push(obj);
          });
      }
    } else {
      let dimensionLength = 0;
      if (options.dimension) {dimensionLength++;}
      // 如果是漏斗图 params.value 是数组
      let nowText = "";
      if (options.type == "biax") {
        nowText = params.value[params.componentIndex + dimensionLength];
        const metricGroup = [].concat(...(options.metricGroup as any));
        metricGroup.forEach(mt => {
          res.push({
            text: [nowText],
            field: mt,
            formula: "Equal"
          });
        });
        return res;
      }
      nowText = Array.isArray(params.value)
        ? data[params.dataIndex][params.componentIndex + dimensionLength]
        : params.value;
      if (options.groupDimension) {
        // 如果是二维一指标
        res.push({
          text: [nowText],
          field: fields[0],
          formula: "Equal"
        });
      } else {
        //一维二指标
        const meticIndex = params.componentIndex;
        res.push({
          text: [nowText],
          field: fields[meticIndex],
          formula: "Equal"
        });
      }
    }
    return res;
  } catch (error) {
    return [];
  }
}

// 获取过滤数据
function getFilterData(field, chartData, options, params, name, isGroup?) {
  const type = field.specialType ? field.specialType : field.type;
  let formula: string = StringType.Equal;
  let text = name === "为空" ? [""] : [name];
  if (options.type === "radar") {
    if (params.event.topTarget.hasOwnProperty("__dimIdx")) {
      if (isGroup) {
        text = [params.data.name];
      } else {
        const tmp = chartData.dimensionArray
          .slice(0, 1)
          .concat(...chartData.dimensionArray.slice(1, chartData.dimensionArray.length).reverse());
        text = [tmp[params.event.topTarget.__dimIdx]];
      }
      if (type === "address") {
        formula = AddressType.Belong;
        const tmpData = options.data
          .slice(0, 1)
          .concat(...options.data.slice(1, options.data.length).reverse());
        // 找到对应的字段，获取adcode
        if (
          tmpData[params.event.topTarget.__dimIdx] &&
          tmpData[params.event.topTarget.__dimIdx][`${field.uid}_ADCODE`]
        ) {
          text = [tmpData[params.event.topTarget.__dimIdx][`${field.uid}_ADCODE`]];
        }
      }
      if (text.length) {
        text = text[0] === "为空" || text[0] === " " ? [""] : text;
        formula = text[0] ? formula : AddressType.None;
      }
    } else {
      text = [];
    }
  } else if (options.type === "funnelCompare") {
    const compareData = getCompareData(options, chartData, options.dimension.uid);
    const tmp = compareData[params.componentIndex][`${options.dimension.uid}_ADCODE`]
      ? compareData[params.componentIndex][`${options.dimension.uid}_ADCODE`]
      : compareData[params.componentIndex][options.dimension.uid];
    text = [tmp];
  } else {
    if (type === "address") {
      // 找到对应的字段，获取adcode
      const fItem = options.data.find((item) => item[field.uid] === name && name !== "为空");
      if (fItem) {
        text = [fItem[`${field.uid}_ADCODE`]];
      }
    }
  }
  if (type === "address") {
    formula = AddressType.Belong;
  }

  if (options.type === "map") {
    if (params.data) {
      text = [params.data.code];
    } else {
      return false;
    }
  }

  if (options.type !== "map" && params.componentSubType === "scatter" && !isGroup) {
    text = params.value.slice(-2, -1);
  }
  const labels: any = [];
  try {
    if (text.length) {
      text.forEach((f) => {
        const nowF = Array.isArray(field) ? field[0] : field;
        const key = `${nowF.uid.toLowerCase()}_${f}`;
        if (options.dataAlias[key]) {labels.push(options.dataAlias[key]);}
      });
    }
  } catch (error) {
    console.log("getFilterData函数问题");
  }
  const filter: H3.Report.FilterFieldColumn = {
    field,
    formula,
    text,
    labels
  };
  return filter;
}
/**
 * 获取图表数据
 */
function getMapJson(api: any, code: string | number) {
  // 不足六位，补齐0
  const key = makeStr(code, "0", 6);
  return new Promise<any>((resolve, reject) => {
    api
      .getMapJson(key)
      .then((res: Object) => {
        resolve(res);
      })
      .catch(res => {});
  });
}

/**
 * 根据指定地址，获取地址面包屑
 * @param list
 * @param target
 * @param top
 */
function getAddressLink(list, target, top) {
  top.level = 0;
  let his: any = [top]; // 缓存数据,减少循环
  let flag: boolean = false;
  let rev = (data, size, parent) => {
    for (let i = 0, length = data.length; i < length; i++) {
      if (flag) {return;}
      const item = data[i];
      item.level = parent.level + 1;
      if (item.code == size.code) {
        his.splice(parent.level + 1, his.length);
        his.push({ code: item.code, name: item.name });
        flag = true;
        return;
      } else {
        if (item.children) {
          his[item.level] = { code: item.code, name: item.name };
          rev(item.children, size, item);
        }
      }
    }
  };
  rev(list, target, top);
  return his;
}

/**
 *
 * 设置全局windos时间监听
 */
function newDataZoomEvent(uid: string, params: any) {
  let myEvent = new CustomEvent(`DatazoomChange-${uid}`, {
    detail: params
  });
  // 随后在对应的元素上触发该事件
  if (window.dispatchEvent) {
    window.dispatchEvent(myEvent);
  } else {
    (window as any).fireEvent(myEvent);
  }
}

/**
 * 样式映射
 */

function getVisualMap(options, chartData) {
  return {
    show: false,
    dimension: 0,
    pieces: [
      {
        lte: chartData.data.length - options.forecast.number - 1,
        opacity: 1,
        colorAlpha: 1
      },
      {
        gt: chartData.data.length - options.forecast.number - 1,
        lte: chartData.data.length,
        colorAlpha: 0.5,
        opacity: 0.5
      }
    ]
  };
}
/**
 * 检查是否可以做预测
 */
function checkForecast(options) {
  if (
    options.forecast &&
    options.forecast.show &&
    options.forecast.number &&
    options.dimension &&
    options.dimension.type === "date" &&
    options.data &&
    options.data.length &&
    ((options.metric && options.metric.length) || options.metricGroup) &&
    !(options.groupDimension && options.groupDimension.field)
  ) {
    const tmpField = options.sort.find((item) => item.uid === options.dimension.uid);
    return tmpField && tmpField.options && tmpField.options.order === "asc";
  }
}
/**
 * 预测功能
 */
function handleForecast(options, isPercent?) {
  let dates;
  const dataMap: any = {};
  let resMap: any = {};
  const res: any = [];
  const num = options.forecast.number;
  // 取最后一位做预测
  const lastDate = options.data[options.data.length - 1][options.dimension.uid];
  if (lastDate) {
    dates = addCNFormat(lastDate, num);
    resMap[options.dimension.uid] = dates;
  }
  if (isPercent) {
    options.metric.forEach(function(m, i) {
      options.data.forEach(item => {
        if (!dataMap[m.uid]) {
          dataMap[m.uid] = [item[m.uid]];
          dataMap[`${m.uid}_PERCENT`] = [item[`${m.uid}_PERCENT`]];
        } else {
          dataMap[m.uid].push(item[m.uid]);
          dataMap[`${m.uid}_PERCENT`].push(item[`${m.uid}_PERCENT`]);
        }
      });
      resMap[m.uid] = forecastData(dataMap[m.uid], num, false);
    //  resMap[`${m.uid}_PERCENT`] = forecastData(dataMap[`${m.uid}_PERCENT`], num, true);
    });
    resMap = handleForecastProportionData(resMap,options,num);
  } else {
    options.metric.forEach(function(m, i) {
      options.data.forEach(item => {
        if (!dataMap[m.uid]) {
          dataMap[m.uid] = [item[m.uid]];
        } else {
          dataMap[m.uid].push(item[m.uid]);
        }
      });
      resMap[m.uid] = forecastData(dataMap[m.uid], num, false);
    });
  }

  for (let i = 0; i < num; i++) {
    Object.keys(resMap).forEach(k => {
      if (res[i]) {
        res[i][k] = resMap[k][i];
      } else {
        res[i] = {
          [k]: resMap[k][i]
        };
      }
    });
  }
  return res;
}

/**
 * 计算百分比堆叠图指标预测数据中的占比数据
 */
 function handleForecastProportionData(res, options, num) {
  const sumMertic: any = []; //各个指标数据总和
  if (res[options.dimension.uid]) {
    res[options.dimension.uid].forEach((dim, dindex) =>{
    let total = 0;
    options.metric.forEach((m, mindex) =>{
      total = total + Math.abs(res[m.uid][dindex]) ;
    });
    sumMertic.push(total);
  });
  }
  
  options.metric.forEach((metric, index) =>{
    res[`${metric.uid}_PERCENT`] = [];
    for (let i = 0 ; i < num; i++) { 
      const percent = Math.abs(res[metric.uid][i]) / sumMertic[i];
      res[`${metric.uid}_PERCENT`].push( Math.floor(percent * 1000 ) / 1000);
    }
  })
  return res;
}

export {
  viewOptions, // 统一初始化配置方法
  legendSetting, // 图例设置
  metricRangeMatrixing, // 计算指标范围
  numericalFormatting, // 数值格式设置
  warningLine, // 警戒线设置
  fontSetting, // 字体设置
  handleBigData, // 处理大数据情况
  analysisChartData, // 解析图表数据
  getMaxMetricLength, // 获取最大指标的显示值
  getDataZoom, // echarts滚动条
  newDataZoomEvent, // 缩略轴变动时出发自定义事件
  getMapJson, // 获取地图Json
  getAddressLink, // 获取地图Json
  checkForecast,
  getVisualMap,
  handleForecast,
  getMeticFilter,
  processPileSum, //处理堆叠合计计算
  getGeoMap,
  convertData
};

export default {
  viewOptions, // 统一初始化配置方法
  legendSetting, // 图例设置
  metricRangeMatrixing, // 计算指标范围
  numericalFormatting, // 数值格式设置
  warningLine, // 警戒线设置
  fontSetting, // 字体设置
  handleBigData, // 处理大数据情况
  analysisChartData, // 解析图表数据
  getMaxMetricLength, // 获取最大指标的显示值
  getDataZoom, // echarts滚动条
  newDataZoomEvent, // 缩略轴变动时出发自定义事件
  getMapJson, // 获取地图Json
  getAddressLink, // 获取地址链路
  checkForecast, // 检查是否可以做预测
  getVisualMap, // 数据样式映射
  handleForecast, // 预测
  getMeticFilter,
  getGeoMap,
  convertData
};
