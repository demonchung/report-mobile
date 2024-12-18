import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import { viewOptions, getAddressLink, fontSetting,getGeoMap,convertData } from "../../../help/utils";
import { black, fontColor } from "../common/options";
import { AddressType } from "@h3/report-mobile/basics/enum/filter-type";
import { getStrLen } from "@h3/report-mobile/basics/utils/string";
import addresses from "@h3/report-mobile/basics/enum/pca-code";
import { mapColorOptions } from "@h3/report-mobile/basics/enum/map";

/**
 * 绘制地图图表
 * @param chartOptions
 * @param options
 * @param chartData
 * @param vm
 * @param eChartInstance
 */
function mapOptions(
  chartOptions: any,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData,
  vm: any = null,
  eChartInstance
) {
  
  const metricFormatOptions =
    options.metric &&
    options.metric[0] &&
    options.metric[0].options &&
    options.metric[0].options.numberFormat
      ? options.metric[0].options.numberFormat
      : { comma: false, fraction: 0, percent: false };
  const meticName = options.metric[0] ? options.metric[0].alias || options.metric[0].name : "";
  const { tooltip, series, grid }: any = viewOptions(options, chartData, {
    tooltip: {
      trigger: "item",
      renderMode: "richText",
      formatter: (params) => {
        const name = params.name;
        let value = params.name !== "南海诸岛" ? params.value : "";
        if (params.name === "南海诸岛") {
          return '{a|'+ name + '}';
        }
        if(value){
           value = value ? convertNumber(value, metricFormatOptions) : value;
          return '{a|'+ name + '\n}' + 
                 '{a|'+ meticName + ' : ' + value + '}'
        }else{
          return '';
        }
      }
    },
    grid: {
      top: 10,
      right: 10,
      left: 10,
      bottom: 10
    },
    series: getSeries(options, chartData, eChartInstance)
  });
  const mapMode = options.mapMode;
  if (mapMode.mode === 'bubble') {  //如果是气泡图，需要做一些改动
    const bubbleOption = getBubleData(series, options, chartData, eChartInstance)
    Object.assign(chartOptions, {
      ...bubbleOption,
      // tooltip,
      // visualMap: getVisualMap(options, chartData),
      grid,
      graphic: getGraphic(options, chartData, vm),
    });
  } else {
    Object.assign(chartOptions, {
      tooltip,
      series,
      grid,
      visualMap: getVisualMap(options, chartData),
      graphic: getGraphic(options, chartData, vm)
    });
  }
  delete chartOptions.dataset;
  delete chartOptions.color;
  delete chartOptions.legend;
  
 
  return chartOptions;
}

// function getGeoMap(mapJson){
//   if(mapJson && mapJson.features){
//     var resMap = {};
//     mapJson.features.forEach((provice)=>{
//       const name = provice.properties.name;
//       const center = provice.properties.center;
//       if(name) resMap[name] = center;
//     })
//     return resMap;
//   }
//   return {};
// }

function getBubleData(series, options, chartData,eChartInstance) {
  const { mapName} = chartData;
  const { mapTheme, mapJson } = options;
  const theme = mapColorOptions[mapTheme.theme]
  const wrapHeight = eChartInstance.getHeight();
  const data = chartData.data;
  //（3）引入城市坐标
  const geoCoordMap = getGeoMap(mapJson);
  //（4）将数据和城市坐标对应上
  // var convertData = function (geoCoordMap,data) {
  //   var res:any = [];
  //   for (var i = 0; i < data.length; i++) {
  //     var geoCoord = geoCoordMap[data[i].name];
  //     if (geoCoord && data[i].value) {
  //       res.push({
  //         ...data[i],
  //         value: geoCoord.concat(data[i].value),
  //       });
  //     }
  //   }
  //   return res;
  // };
 

  // var max = 0;
  // // 动态设置气泡大小
  // data.forEach(function (itemOpt) {
  //   if (itemOpt.value > max) {
  //     max = itemOpt.value;
  //   }
  // });
  const { maxMetric, minMetric } = chartData;

  const max =
    minMetric === maxMetric ? ((maxMetric ? maxMetric * 1000 : 0) + 1000) / 1000 : maxMetric;
  const min = minMetric ? minMetric : 0;
  const size = mapName === "海南" ? "500%" : "100%";
  const center = mapName === "海南" ? ["110%", "260%"] : ["50%", "50%"];
  const fontSize = wrapHeight * 0.02;
  const symbolSize: any = parseFloat(fontSize.toString());
  const meticName = options.metric[0] ? options.metric[0].name : "";
  const metricFormatOptions =
  options.metric &&
    options.metric[0] &&
    options.metric[0].options &&
    options.metric[0].options.numberFormat
    ? options.metric[0].options.numberFormat
    : { comma: false, fraction: 0, percent: false };
  const option = {
    geo: {
      type: 'map',
      map: mapName === "全国" ? "china" : mapName,
      roam: true, // 是否开启鼠标缩放和平移漫游
      layoutCenter: center, //地图中心位置
      layoutSize: size, // 地图显示大小
      aspectScale: 0.75,
      itemStyle: {
        normal: {
          borderColor: theme.borderColor,
          areaColor: '#efefef',  //theme.mainColor, 写死了
          borderWidth: theme.borderWidth
        },
        emphasis: {
          show:true,
          areaColor: '#efefef'// 鼠标经过区域
        },
      },
      emphasis:{
        label:{
          show:false,
        }
      },
      tooltip: {
        show:false,
      },
    },
    tooltip: {
      trigger: 'item',
    },
    // 气泡大小
    visualMap: {
      show: true,
      realtime: false,
      calculable: true,
      type: "continuous",
      top: 0,
      text: [max, 1],
      min: 1,
      max: max,
      inRange: {
        color: mapColorOptions[mapTheme.theme]
        ? mapColorOptions[mapTheme.theme].mainColor
        : mapColorOptions.pro.mainColor,
        symbolSize: [0, symbolSize*2]
      },
      outOfRange: {
        color: '#efefef',
      },
      textStyle: {
        color: fontSetting(options) || options.defaultFontColor,
      }
    },
    //（1）series 的类型为散点图 scatter
    series: [
      {
        name: 'scatterMap',            // series名称
        type: 'scatter',          // series图表类型
        coordinateSystem: 'geo',  // series坐标系类型
        data: convertData(geoCoordMap,data),  // series数据内容  // 前面两个是坐标，后面是值
        //控制显示文本
        label: {
          normal: {
            show: true,
            fontSize: fontSize,
            color: fontSetting(options) || options.defaultFontColor,
            formatter: function (val) {
              let string = ``;
             
              //是否显示指标值
              if (options.mapDigitalSet.displayMetric) {
                const value = val.value[2] || 0;
                string += `${convertNumber(value, metricFormatOptions)}`;
                if (options.mapDigitalSet.displayDimension) {string += `\n`;}
              }
               //显示纬度值
              if(options.mapDigitalSet.displayDimension){
                string+= `${val.name}`;
              }
              return string
            },
          },
          emphasis: {
            label: {
              show: false,
            },
            show: true
          },
        },
        itemStyle: {
          normal: {
            color: '#8e7bff'
          }
        },
        tooltip: {
          show:true,
          trigger: 'item',
          backgroundColor:'rgba(0,0,0,0.8)',
          textStyle:{
            color:'#fff',
            fontSize: fontSize,
          },
          renderMode: 'richText',
          formatter: params => {
            const d = params.data;
            const value = d.name;
            const name = d.value[2];
            return '{a|'+ value + '\n}' + 
                   '{a|' + meticName + ' : ' + name + '}'
          }
        },
      },
    ]
  };

  // eChartInstance.on("datarangeselected",function(params){
  //   let chartOption = eChartInstance.getOption();
  //   let filterData = chartData.data.filter(item=> item.value >= params.selected[0] && item.value <= params.selected[1]);
  //   eChartInstance.setOption({
  //     series: {
  //       data: convertData(filterData)
  //     }
  //   });
  //   console.log(params,chartOption,filterData,'222');
  // });
  return option;
}
/**
 * 获取映射
 * @param options
 * @param chartData
 * @param vm
 */
function getGraphic(options, chartData, vm) {
  const country = { code: "100000", name: "全国" };
  // 面包屑
  if (!options.mapSource) {options.mapSource = {};}
  let link: Array<any> =
    options.mapSource.code === country.code
      ? [country]
      : getAddressLink(addresses, options.mapSource, country);

      let textList: any = [];

  let leftLength = 0;
  link.forEach((item, index) => {
    const name = (index === 0 ? "" : " / ") + item.name;
    const textItem = {
      type: "text",
      left: (index === 2 ? leftLength - 5 : leftLength) + "px",
      top: 0,
      style: {
        text: name,
        textAlign: "center",
        fill: link.length === index + 1 ? (fontSetting(options) || options.defaultFontColor): "#107FFF",
        font: '12px "Microsoft YaHei", sans-serif'
      },
      tooltip:{
        show:false,
      },
      onclick: function() {
        if (
          link.length !== index + 1 &&
          options.mapDrill &&
          options.mapDrill.drill !== "disabled"
        ) {
          let filters:any = [];
          if(item.code != '100000') {
            filters = [
              {
                field: options.dimension,
                formula: AddressType.Belong,
                text: [item.code]
              }
            ] 
          }
          (vm as any).clickChart(
            filters,
            {
              data: item,
              clickType:'graphic',//用来区分点击的区域
            }
          );
        }
      }
    };
    leftLength += getStrLen(name) * 6; // 计算
    textList.push(textItem);
   
  });
  return [
    {
      type: "group",
      left: "right",
      top: 10,
      children: textList.length > 1 ? textList : []
      // children: textList
    }
  ];
}
/**
 * 获取映射
 * @param options
 * @param chartData
 */
function getVisualMap(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData) {
  const { mapArea, mapDigitalSet, mapDrill, mapTheme } = options;
  const { maxMetric, minMetric } = chartData;

  const max = minMetric === maxMetric ? ((maxMetric ? maxMetric * 1000 : 0) + 1000) / 1000: maxMetric;
  const min = minMetric ? minMetric : 0;
  return {
    type: "continuous",
    min: min,
    max: max,
    top: 0,
    text: [max, min],
    show: true,
    realtime: false,
    calculable: true,
    inRange: {
      color: mapColorOptions[mapTheme.theme]
        ? mapColorOptions[mapTheme.theme].mainColor
        : mapColorOptions.pro.mainColor
    },
    outOfRange: {
      color: '#efefef',
    },
    textStyle: {
      color: fontSetting(options) || options.defaultFontColor,
    }
  };
}
/**
 * 获取系列列表，每个系列通过 type 决定自己的图表类型
 * @param options
 * @param chartData
 * @param eChartInstance
 */
function getSeries(options: H3.Chart.ChartOptions, chartData: H3.Chart.ChartData, eChartInstance) {
  const { mapName, data, dimensionArray, mapJson, maxDimension, maxMetric, minMetric } = chartData;
  const { mapArea, mapDigitalSet, mapDrill, mapTheme } = options;
  const theme = mapColorOptions[mapTheme.theme]
    ? mapColorOptions[mapTheme.theme]
    : mapColorOptions.pro;
  const wrapWidth = eChartInstance.getWidth();
  const wrapHeight = eChartInstance.getHeight();
  const metricFormatOptions =
    options.metric &&
      options.metric[0] &&
      options.metric[0].options &&
      options.metric[0].options.numberFormat
      ? options.metric[0].options.numberFormat
      : { comma: false, fraction: 0, percent: false };
  const size = mapName === "海南" ? "500%" : "100%";
  const center = mapName === "海南" ? ["110%", "260%"] : ["50%", "50%"];
  const fontSize = wrapHeight * 0.02;
  const optionData: any = [
    {
      type: "map",
      roam: true, // 是否开启鼠标缩放和平移漫游
      mapType: mapName === "全国" ? "china" : mapName,
      data: data,
      layoutCenter: center, //地图中心位置
      layoutSize: size, // 地图显示大小
      aspectScale: 0.75,
      label: {
        show: true,
        fontSize: fontSize,
        color: fontSetting(options) || options.defaultFontColor,
        formatter: (params) => {
          const name = options.mapDigitalSet.displayDimension ? params.name : "";
          let value = params.value;
          if (!options.mapDigitalSet.displayMetric) {
            if (value || value === 0) {
              return `${name}`;
            }
          }
          if (params.name === "南海诸岛") {
            return `${name}`;
          }
          if (value || value === 0) {
            value = convertNumber(value, metricFormatOptions);
            return `${value} \n ${name} `;
          } else {
            return "";
          }
        }
      },
      itemStyle: {
        borderColor: theme.borderColor,
        areaColor: '#efefef',  //theme.mainColor, 写死了
        borderWidth: theme.borderWidth
      },

      emphasis: {
        label: {
          show: true,
          color: fontSetting(options) || options.defaultFontColor
        },
        itemStyle: {
          areaColor: theme.hoverColor,
          borderWidth: theme.hoverBorderWidth,
          borderColor: theme.hoverBorderColor
        }
      }
    }
  ];
  return optionData;
}

export default mapOptions;
