import { fontSetting, viewOptions,legendSetting } from "../../../help/utils";
import { lineColor } from "../common/options";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { subStr, getStrLen, makeStr } from "@h3/report-mobile/basics/utils/string";
import { resolve } from "dns";

/**
 * 绘制圆饼图表
 * @param chartOptions
 * @param options
 * @param chartData
 */
function pieChartOptions(
  chartOptions: any,
  options: H3.Chart.PieChartOptions,
  chartData: H3.Chart.ChartData
) {
  const { tooltip, series }: any = viewOptions(options, chartData, {
    tooltip: {
      trigger: "item",
      renderMode: 'richText',
      formatter: (params: any) => {
        // 饼图数值格式设置options
        return pieMultipleDataLabel(params.data.actualValue,params.name,chartData, options, 0, params);
      }
    },
    series: getSeries(options, chartData),
    // legend: getLegend(options,chartData),
  });
  Object.assign(chartOptions, {
    tooltip,
    series,
    // legend
  });
  chartOptions.legend = getLegend(options,chartData);
  legendSetting(chartOptions,options);
  return chartOptions;
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
      groupArray.push(...chart.data);
      groupNameArray = Object.assign(groupNameArray, chart.groupNameArray);
    });
  } else {
    groupNameArray = (chartData as H3.Chart.ChartData).groupNameArray;
    groupArray = (chartData as H3.Chart.ChartData).data;
  }
  const nameToValueMapping: any = {};
  if(!(chartData instanceof Array)) {
    chartData.data.forEach((item)=> {
      nameToValueMapping[item[0]] = item[1];
    })
  }
  return {
    itemGap: 16,
    itemWidth: 8,
    textStyle: {
      color: fontSetting(options) || options.defaultFontColor
    },
    icon:'circle',
    type: "scroll",
    pageIconColor: options.isTransparent? '#aaaaaa' : '#2F4554', //翻页按钮的颜色
    pageIconInactiveColor: options.isTransparent? '#2F4554' : '#aaaaaa', //翻页按钮不激活时(即翻页到头时)的颜色
    pageIconSize: 12,
    pageTextStyle: {
      color: fontSetting(options) || options.defaultFontColor
    },
    bottom: 10,
    // 转字符串, 数字作为legend会无效
    data: groupArray.map(item=> item[0]+''),
    formatter: (name: string) => {
      let res = '';
      if(options.dataLabelPosition && options.dataLabelPosition.position === 'legend') {
        res = pieMultipleDataLabel(nameToValueMapping[name],name,chartData as any, options, 1,{});
      } else {
        res = getLengedValue(name, options, groupNameArray)
      }
      const strLength = getStrLen(res);
      maxLength = maxLength < strLength ? strLength : maxLength;
      return res;
    },
    show: options.legend ? (options.legend.checked === null ? true : options.legend.checked) : true,
    tooltip: {
      show: true,
      formatter: (params: any) => {
        if(options.dataLabelPosition && options.dataLabelPosition.position === 'legend') {
          return pieMultipleDataLabel(nameToValueMapping[params.name],params.name,chartData as any, options, 1, params)
        } else {
          return getLengedValue(params.name, options, groupNameArray);
        }
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
  // 二唯一指标时value为 具体值，需要通过groupDimension 次纬度的uid_value去拿到别名
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
//获取饼图半径
function radiusSetting(options) {
  if (options.dataLabelPosition && options.dataLabelPosition.position === "legend") {
    return options.pieMode && options.pieMode.mode === 'solid' ? '82%' : ['35%' , '82%'];
  } else {
    if (options.dataLabelPosition && options.dataLabelPosition.detail === "in") {
      return  options.pieMode && options.pieMode.mode === 'solid' ? '82%' : ['35%' , '82%'];
    } else {
      return  options.pieMode && options.pieMode.mode === 'solid' ? '72%' : ['25%' , '72%']
    }
  }
}

/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  const fontColor = fontSetting(options);
  let seriesCenter = ["50%", "50%"];
  if (options.legend && options.legend.position === "left") {
    seriesCenter = ["58%", "50%"];
  } else if (options.legend && options.legend.position === "right") {
    seriesCenter = ["40%", "50%"];
  }
   else {
    if (options.legend && options.legend.position === "bottom") {
      seriesCenter = ["50%", "45%"];
    }
    if (options.legend && options.legend.position === "top") {
      if (options.dataLabelPosition && options.dataLabelPosition.detail !== "in") {
        seriesCenter = ["50%", "50%"];
      } else {
        seriesCenter = ["50%", "53%"];
      }
    }
   } 
  const showLable =
    options.multipleDataLabel && options.dataLabelPosition
      ? !!(
          options.multipleDataLabel.dimensionLabel ||
          options.multipleDataLabel.metricLabel ||
          options.multipleDataLabel.percentLabel
        ) && options.dataLabelPosition.position !== "legend"
      : true;
  return {
    name: options.dimension.alias || options.dimension.name,
    type: "pie",
    center: seriesCenter,
    top: 14,
    // bottom: 15,
    // radius: [0, "50%"],
    radius: radiusSetting(options),
    // selectedMode: 'single',
    label: {
      fontSize: options.fontSize,
      color: options.dataLabelPosition.detail === 'in' ?   fontColor : (fontColor || options.defaultFontColor),
      position: options.dataLabelPosition && options.dataLabelPosition.detail === 'in' ? 'inner': 'outside',
      // 数值显示控制
      show: showLable,
     // textBorderColor: options.isTransparent?  '#000': '#fff',
     // textBorderWidth: 1,
     bleedMargin: options.isWxwork? -100 : 10,
     distanceToLabelLine: 2,
      formatter: (params: any) => {
        // 饼图数值格式设置options

        return pieMultipleDataLabel(params.data.actualValue,params.name,chartData, options, 1, params);
      }
    },
    labelLine: {
      lineStyle: {
        color: "rgba(133, 133, 133, 1)",
        width: 0.4
      },
      length: 12,
      length2: 12,
    },
    itemStyle: {
      borderColor: options.isTransparent? "rgba(40, 40, 40, 1)" : "rgba(255, 255, 255, 1)",
      borderWidth: 0.6,
    },
    emphasis: {
      scaleSize: 13
    },
    data: chartData.data.map((item: any) => ({
      name: item[0],
      value: Math.abs(item[1]),
      actualValue: item[1]
    }))
  };
}
/**
 * 饼图数值格式设置options
 * @param params
 * @param chartData
 * @param options
 * @param type
 */
function pieMultipleDataLabel(
  value: any,
  vName: any,
  chartData: H3.Chart.ChartData,
  options: H3.Chart.ChartOptions,
  type: number,
  params: any,
) {

  // 注：百分数计算方式（绝对值/绝对值总和）,value还是显示原始值
  let percent: any = Number((Math.abs(value) / (chartData.total as any)) * 100);
  percent = isNaN(percent) ? 0 : percent.toFixed(2);

  const aliaName = options.dimension
    ? getAliaValue(options.dimension.uid, vName, options.dataAlias)
    : "";
  
  const name = aliaName || vName || "为空";
  let res: string = "";
  let count: number = 0;
  let changeValue: any;
  // 没有勾选显示指标的时候，tooltip也要显示指标值
  const hideValue: any = convertNumber(
    value,
    (options.metric[0].options.numberFormat as H3.Report.NumberFormat) || {}
  );
  // 0-tooltip-format、1-series-label-format
  if (type === 0) {res = params.marker;}
  // 存在则为仪表盘、
  if (options.multipleDataLabel) {
    // 显示维度值
    if (options.multipleDataLabel.dimensionLabel) {
      res += name;
      count += 1;
    }
    // 显示指标值
    if (options.multipleDataLabel.metricLabel) {
      changeValue = convertNumber(
        value,
        (options.metric[0].options.numberFormat as H3.Report.NumberFormat) || {
          comma: false, // 千分符
          percent: false, // 百分比
          fraction: 0 // 小数位数 默认0
        }
      );
      count === 1 ? (res += "：" + changeValue) : (res += changeValue);
      count += 1;
    }
    // 显示百分比
    if (options.multipleDataLabel.percentLabel) {
      count === 0 ? (res += `${percent}%`) : (res += ` (${percent}%)`);
      count += 1;
    }
    // tooltip显示全部内容
    if (type === 0) {
      return params.marker + 
            '{a|'+ name + '\n}' + 
            '{a|'+ (changeValue ? changeValue : hideValue) + '\n}' +
            '{a|'+ `${percent}%` + '}'
    }
    return res;
  } else {
    return (res += name + "：" + value + ` (${percent}%)`);
  }
}

export default pieChartOptions;
