import { fontSetting, numericalFormatting, viewOptions } from "../../../help/utils";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { getStrLen } from "@h3/report-mobile/basics/utils/string";

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
  const { series, tooltip }: any = viewOptions(options, chartData, {
    tooltip: {
      trigger: "item",
      formatter: (params: any)=> {}
    },
    series: getSeries(options, chartData)
  });
  Object.assign(chartOptions, {
    series,
    tooltip,
    graphic: getGraphic(options,chartData),
  });
  return chartOptions;
}
/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 * @param item
 * @param index
 * @param mode
 */
function getBaseSeries(
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData,
  item,
  index,
  series = {}
) {
  const baseSeries = {
    type: "funnel",
    name: chartData.groupArrayData[index],
    min: 0,
    minSize: "1%",
    maxSize: "100%",
    width: "25%",
    sort: "none",
    left: 26 * index + 24 + "%",
    funnelAlign: index ? "left" : "right",
    data: chartData.groupArrayData.map((uid: any) => ({
      name: (chartData as any).groupNameArray[uid],
      value: item[uid]
    })),
    label: {
      show:
        options.dataLabel === null || options.dataLabel === undefined ? true : options.dataLabel,
      position:  index ? "insideLeft" : "insideRight",
      fontSize: options.fontSize,
      color: fontSetting(options),
      formatter: (params: any) => {
        // 数值格式设置
        return funnelNumberFormat(options, params);
      }
    }
  };
  return Object.assign({}, baseSeries, series);
}

function getMaxMetric(data: any) {
  let max = 0;
  if (data && data.length) {
    data.forEach((item) => {
      const numArray: any = Object.values(item).filter((i) => typeof i === "number");
      const t = Math.max(...numArray);
      max = t > max ? t : max;
    });
  }
  return max;
}

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d"); 
  (context as any).font = font;
  const metrics = (context as any).measureText(text);
  return metrics.width + 10;
}

/**
 * @param text: 文本内容
 * @param isMinus: 是否左侧
*/
function getLeftValue(text,isMinus?){
  const length = text.length;
  return length * 13;
}
function getName(value,options) {
  const aliaName = options.dimension
  ? getAliaValue(options.dimension.uid, value, options.dataAlias)
  : "";
  let res =  aliaName || ((value || value === 0) ? value : '');
  if(!options.isWxwork && res.length > 20) {
    res = res.substr(0,20) + '...'
  } 
  return res;
}
/** 
 * 编写 title
 */
function getGraphic(options, chartData) {
  const resData = getCompareData(options, chartData, options.dimension.uid);
  const aliasArr = [
    resData[0] ? getName(resData[0][options.dimension.uid], options) : "",
    resData[1] ? getName(resData[1][options.dimension.uid], options) : "",
  ];
  if (!resData.length) {return [];}
  const graphData: any = [
    {
      type: "group",
      left: "center",
      top: 30,
      width: '100%',
      children:[
        {
          type:'text',
          top: 0,
          right: '50%',
          style: {
            text:  resData[0] ? ((aliasArr[0] || aliasArr[0] === 0) ? aliasArr[0]:'为空'): '',
            textAlign: "right",
            fill: fontSetting(options) || (options.isTransparent? '#fffff' : '#707481'),
            font: `${options.fontSize}px "Microsoft YaHei", sans-serif`
          },
        },
        {
          type:'text',
          top: 0,
          left: '51%',
          style: {
            text:  (resData[1] ? ((aliasArr[1] || aliasArr[1] === 0) ? aliasArr[1] :'为空') : ''),
            textAlign: "left",
            fill: fontSetting(options) || (options.isTransparent? '#fffff' : '#707481'),
            font: `${options.fontSize}px "Microsoft YaHei", sans-serif`
          },
        }
      ],
    },
  ];
  return  graphData;
}
/**
 * 过滤数字 类型
*/
function getChartFilterData(options,resData){
  if(options.metric.length){
    options.metric.forEach((m)=>{
      const uid = m.uid;
      resData.forEach((d)=>{
        if(d[uid] === null){
          d[uid] = 0;
        }
      })
    })
  }
  return resData;
}
/**
 * 通过 compareData 获取 chartData 
*/

function getCompareData(options,chartData,targetUid){
  let resData:any = [];
  if(options.compareData && options.compareData.length){
    options.compareData.forEach((d) => {
      let match!: boolean;
      if(!d && d !== 0) {
        match = chartData.data.find(e=>e[targetUid] === '' || e[targetUid] === null);
      } else {
        match = chartData.data.find(e=>e[targetUid] === d);
      }
      // 兼容氚云
      if (match) {resData.push(match);}
    });
  }
  if (resData.length < 2) {
    resData = chartData.data.slice(0, 2);
  }
  resData = getChartFilterData(options,resData);
  return resData;
}

/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  const seriesArray: any = [];
  let resData: any = [];
  resData = getCompareData(options,chartData,options.dimension.uid)

  const max = getMaxMetric(resData);
  // 生成最顶部漏斗图
  resData.forEach((d, index) => {
    const dataList = chartData.groupArrayData.map((uid: any, index) => d[uid]);
    const ds = {
      z: 3,
      labelLine: {
        show: false
      },
      max,
      tooltip: {
        show: true,
        renderMode: 'richText',
        formatter: (params: any) => {
          // 数值格式设置
          const uid = options.dimension.uid;
          options.dimension.needAlias = options.dimension.type === 'number' ? false :  options.dimension.needAlias;
          const name = options.dimension.needAlias && d[uid] ? options.dataAlias[`${uid.toLowerCase()}_${d[uid]}`] : (d[uid] || d[uid] === 0) ? d[uid]: '为空';
          const alias : any = funnelNumberFormat(options, params);
          const value = (alias || alias === 0) ? alias : '为空';
          let nextValue = conversionFormat(dataList, params.dataIndex, "next");
          let allValue = conversionFormat(dataList, params.dataIndex, "all");
          nextValue = nextValue ? '占上一层百分比: '+ nextValue : nextValue;
          allValue =  allValue ? '占第一层百分比: '+ allValue : allValue;
          return params.marker + 
          '{a|'+ name + '\n}' + 
          '{a|'+ value + '\n}' + 
          '{a|'+ nextValue + '\n}' + 
          '{a|'+ allValue + '}';
        }
      }
    };
    const bs = getBaseSeries(options, chartData, d, index, ds);
    seriesArray.push(bs);
  });
  // 由于漏斗图label只能显示一个位置 要用相同图层遮罩
  if (options.invert && options.invert.show && options.invert.mode) {
    resData.forEach((d, index) => {
      const dataList = chartData.groupArrayData.map((uid: any, index) => d[uid]);
      const ds = {
        max,
        labelLine: {
          show: false
        },
        label: {
          show:
            options.dataLabel === null || options.dataLabel === undefined
              ? true
              : options.dataLabel,
          position: index ? "rightTop" : "leftTop",
          fontSize: options.fontSize,
          formatter: (params: any) => {
            // 数值格式设置
            return  conversionFormat(
              dataList,
              params.dataIndex,
              options.invert && options.invert.mode ? options.invert.mode : "next",
              true
            );
          }
        },
        data: chartData.groupArrayData.map((uid: any, index) => ({
          name: (chartData as any).groupNameArray[uid],
          value: d[uid]
        }))
      };
      const bs = getBaseSeries(options, chartData, d, index, ds);
      seriesArray.push(bs);
    });
  }

  return seriesArray;
}
/**
 * 格式化转化率
 */
function conversionFormat(data, index, mode, showText: boolean = false) {
  const cur = data[index];
  const next = mode === "next" ? data[index - 1] : data[0];
  let text = showText ? "转换率:" : "";
  if (index) {
    if (!next) {
      text += "--";
    } else if (!cur && next) {
      text += 0 + "%";
    } else {
      text += ((cur / next) * 100).toFixed(2) + "%";
    }
    return text;
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
  const tip = options.metricValue && options.metricLabel ? ':' : '';
  const value = options.metricValue ? (params.value ||  params.value === 0 ? params.value : "为空") : '';
  const showName = options.metricLabel ? name  : "";
  let res= showName + tip + value;
  if(options.metricValue) {
    options.metric.forEach((metric, index) => {
      if (params.dataIndex === index) {
        // 数值格式设置
        if (metric.options.numberFormat as H3.Report.NumberFormat) {
          res =
            showName +":"+ convertNumber(value, metric.options.numberFormat as H3.Report.NumberFormat);
        } else {
          res = showName + ":" + value;
        }
      }
    
    });
  }

  return res;
}
export default funnelChartOptions;
