import * as echarts from "echarts/lib/echarts";
import {
  BarChart,
  LineChart,
  PieChart,
  FunnelChart,
  ScatterChart,
  RadarChart,
  MapChart,
  GaugeChart
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
  LegendScrollComponent,
  DataZoomComponent,
  VisualMapComponent,
  GraphicComponent,
  GeoComponent
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  FunnelChart,
  ScatterChart,
  RadarChart,
  MapChart,
  GaugeChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
  LegendScrollComponent,
  DataZoomComponent,
  VisualMapComponent,
  GraphicComponent,
  GeoComponent
]);
import {
  legendSetting,
  analysisChartData,
  viewOptions,
  handleBigData,
  newDataZoomEvent,
  getMapJson,
  getMeticFilter,
  getGeoMap,
  convertData
} from "../../help/utils";
import { handleData } from "../../data";
import mapAdjust from "../../help/mapAdjust";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { SpecialCity } from "@h3/report-mobile/basics/enum/special-map";
import H3Charts from "./common/aggregate";
import localstorage from "@h3/report-mobile/basics/components/localforage";
/**
 * 获取图表实例
 * @param container
 * @param options
 * @param vm
 * @param showDataZoom  // 获取默认是否大数据配置 todo 老统计分析不上datazoom 后期可以优化掉
 */
export const chartView = async (
  container: HTMLDivElement,
  options: H3.Chart.ChartOptions,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>,
  vm: any,
  showDataZoom: boolean = true
) => {
  let extendData: any;

  if (options.mapSource && isMapType(options)) {
    const { name, code } = options.mapSource;
    const mapJson = await getMapJsonByStorage(vm.api, code);
    options.mapJson = mapJson;
    echarts.registerMap(name === "全国" ? "china" : name, mapJson);
  }
  // const chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData> = handleData(options);
  let isBigData: boolean = false;
  if (!showDataZoom) {
    const bigDataOption = getDefaultBigData(chartData, options);
    const { animate, isScrollY, isScrollX } = bigDataOption;
    isBigData = bigDataOption.isBigData;
    (vm as any).isScrollY = isScrollY;
    (vm as any).isScrollX = isScrollX;
  }
  return new Promise(resolve => {
    vm.$nextTick(() => {
      if (!vm.$refs.chartBody) {return;}
      const echart = getEchart(vm, showDataZoom, chartData, isBigData, options);
      resolve(echart);
    });
  });
};

/**
 * 获取 option 整合数据
 */
export const setChartByoptions = (options: H3.Chart.ChartOptions, vm: any, echart: any,chartData:H3.Chart.ChartData | Array<H3.Chart.ChartData>) => {
  // const chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData> = handleData(options);
  let defaultOptions = getDefaultOptions(true, chartData, options);
  let chartsMap = Object.assign({}, H3Charts);
  let chartOptions = chartsMap[options.type](defaultOptions, options, chartData, vm, echart);
  echart.setOption(chartOptions);
};

/**
 * 获取地图json
 * @param name
 * @param code
 */
async function getMapJsonByStorage(fetchApi, code) {
  let mapJson = await localstorage.getItem(code);
  if (!mapJson) {
    mapJson = await getMapJson(fetchApi, code);
    localstorage.setItem(code, mapJson);
  }
  mapJson = mapAdjust(mapJson);
  return mapJson;
}

/**
 * 生成echart实例
 * @param vm
 * @param showDataZoom
 * @param chartData
 * @param isBigData
 * @param options
 */
function getEchart(vm, showDataZoom, chartData, isBigData, options) {
  const echart = echarts.init(vm.$refs.chartBody, null, { renderer: "canvas" });
  let defaultOptions = getDefaultOptions(true, chartData, options);
  let chartsMap = Object.assign({}, H3Charts);
  let chartOptions = chartsMap[options.type](defaultOptions, options, chartData, vm, echart);
  let myZoom;
  if (!showDataZoom && isBigData) {
    handleBigData(
      echart,
      chartOptions,
      (vm.$refs.scroll as any).$el.querySelector(".h3-scroll__content") as HTMLDivElement,
      chartData,
      options
    );
  }
  if (chartOptions) {
    echart.setOption(chartOptions);
  }

  echart.on("click", (params: any) => {
    if (allowClick(params, options)) {
      //处理气泡地图逻辑
      const isBobbleMap = options.type === "map" && options.mapMode.mode === "bubble";
      if (isBobbleMap && params.data) {
        params.data.value = params.data.value[2];
      }
      try {
        const chartClickposition = {
          x: params.event.event.pageX,
          y: params.event.event.pageY
        };
        params.chartClickposition = chartClickposition;
      } catch (error) {
        console.log(error);
      }
      const metricFilter = getMeticFilter(params, chartData, options);
      if (metricFilter) {params.metricFilter = metricFilter;}
      (vm as any).clickChart(analysisChartData(params, chartData, options), params);
    }
  });
  echart.dispatchAction({
    type: 'restore'
  });
  if (isMapType(options)) {
    let tmpSize;
    let doorMap;
    // if(options.mapMode.mode === 'bubble') {
      doorMap = getGeoMap(options.mapJson); 
    // } else {
      echart.on("georoam", function(params) {
        // 移动时屏蔽
        // if (params.dy || params.dx) {
        //   return;
        // }
        const chartOption = echart.getOption();
        const _zoom = chartOption.series[0].zoom;
        let fontSize = chartOption.series[0].label.fontSize;
        if (!tmpSize) {
          tmpSize = fontSize;
        }
        const value = Math.floor(tmpSize * _zoom * 0.9);
        fontSize = value > 18 ? 18 : value < 8 ? 8 : value;
        echart.setOption({
          series: {
            label: {
              fontSize: fontSize
            }
          },
          // 气泡地图自适应规则
          // visualMap: {
          //   inRange: {

          //   }
          // }
        });
        myZoom = _zoom;
      });
    // }
   
    echart.on("datarangeselected",function(params){
      // let chartOption = echart.getOption();
      let filterData = chartData.data.filter(item=> item.value >= params.selected[0] && item.value <= params.selected[1]);
      if(options.mapMode.mode === 'bubble') {
        filterData = convertData(doorMap,filterData)
      }
      echart.setOption({
        series: {
          data: filterData
        }
      });
    })
  }

  // 图表滚动条的保存提供数据
  if (showDataZoom) {
    echart.on("datazoom", params => {
      options.uid && newDataZoomEvent(options.uid, params);
    });
  }
  return echart;
}

/**
 * 处理图表点击事件
 * @param params
 * @param options
 */
function allowClick(params, options) {
  if (params.componentType === "graphic") {
    return false;
  }
  if (options.type === ElementType.MAP && params.data) {
    const data = params.data;
    if (SpecialCity.includes(data.code)) {
      return false;
    }
    if (data.code && data.code.slice(4, 6) !== "00") {
      return false;
    }
    if (options.mapDrill && options.mapDrill.drill) {
      const drill = options.mapDrill.drill;
      if (drill === "province" && data.code.slice(2, 6) !== "0000") {
        return false;
      }
      // if (drill === "disabled") {
      //   return false;
      // }
    }
  }
  if (options.type === ElementType.RADAR && params.event) {
    if (!params.event.topTarget.hasOwnProperty("__dimIdx")) {
      return false;
    }
  }
  return true;
}

/**
 * 获取图表的默认参数
 * @param animate
 * @param chartData
 * @param options
 */
function getDefaultOptions(
  animate,
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>,
  options: H3.Chart.ChartOptions
) {
  let defaultOptions: any = viewOptions(options, chartData, {
    grid: "default",
    legend: "default",
    dataset: "default",
    color: "default",
    animation: animate,
    textStyle: {
      fontFamily: "D-DIN",
    }
  });
  legendSetting(defaultOptions, options); // 图例设置
  return defaultOptions;
}

/**
 * 获取大数据的默认配置参数
 * @param chartData 图标数据
 * @param options 图标配置项
 */
function getDefaultBigData(
  chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>,
  options: H3.Chart.ChartOptions
) {
  const isArray = chartData instanceof Array;
  // 如果是数组的话先判断第一个是否超出, 未超出的话
  let targetChartData = isArray ? chartData[0] : chartData;
  let animate = true;
  let isBigData = false;
  let isScrollY = true;
  let isScrollX = true;
  // 类型包含
  if (
    [
      ElementType.BAR,
      ElementType.STRIPE,
      ElementType.LINE,
      ElementType.AREA,
      ElementType.BIAX
    ].includes(options.type) &&
    targetChartData.dimensionLength > targetChartData.maxDimension
  ) {
    animate = false;
    isBigData = true;
  } else {
    isScrollY = false;
    isScrollX = false;
  }
  if (
    ![ElementType.TABLE, ElementType.CROSSTABLE, ElementType.LIST, ElementType.CARD].includes(
      options.type
    )
  ) {
    isScrollY = false;
  }
  return {
    animate,
    isBigData,
    isScrollY,
    isScrollX
  };
}

/**
 * 依据当前数据，判断是否为地图类型
 * @param options
 */
const isMapType = options => {
  return options.type === "map";
};

export default chartView;
