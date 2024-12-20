/**
 * 地图特殊情况说明
 * 1. 有四个市，下级都是行政编码为10位的（镇，县，区）
 *    儋州  东莞 中山 嘉峪关
 *    这几个本来地图geojson包是空的，后来补全了,目前可下钻，地址范围下拉框也可选择到 
 *    下级有数据都会归为这个市。
 *    
 * 2. 直辖市，县
 *    直辖市（例如重庆）下级会有直辖市和县，再下级才会是区。
 *    处理逻辑 : (1)直接跳过直辖市和县，返回的直接是区的数据 (2)下钻也是直接可以看到区 (3)地址范围下拉框不能选择下级。
 * 3. 省直辖县级行政区划 
 *    文件路径@h3/report-mobile/basics/enum/pca-code.js, 一些省会有省直辖县级行政区划，把部分市（实际行政编码为区级）归为省直辖县级行政区划，
 *    例如 ```{ code: "460000", 
 *          name: "海南省",
           children: [
      {  code: "460100",name: "海口市", children: [ 区级数据 ] },
      {  code: "460200",name: "三亚市",children: [区级数据 ] },
      { code: "460300", name: "三沙市", children: [ 区级数据 ] },
      { code: "460400",name: "儋州市", children: [ 行政编码为10位 ]},
      { code: "469000",name: "省直辖县级行政区划",children: [ 市级数据（编码为区级编码）]}]}```
 *     处理逻辑：
 *    （1）下钻的共有逻辑，区级都是不给下钻的，所以 [省直辖县级行政区划] 下级的是区都是不给下钻的，json包也没这些数据
 *     (2) 地址范围下拉框 屏蔽掉 [直辖市][县][省直辖县级行政区划]。
 *      未解决问题:业务规则 地址范围为自动会选择最大的那个市。如果选择到【省直辖县级行政区划】，目前会没有数据（需要统一的解决方案）
 * 4. 台湾问题
 *    （1）补齐了json地图，可下钻 (2) 地址范围下拉框可选
 * 5.  东沙群岛
 *     json地图包有的地址，地址列表（墨斗）里面没有的地址 ，限制下钻。只是展示
 * 6. 南海诸岛 
 *     echart自带。只显示地图。没有功能
 * 7.  海南省问题
 *     处理：由于海域过大，特意放大定位到岛上。
 * 8.  文字大小问题
 *      处理: 根据容器大小初始化大小,随滚动设置文字大小，
/**
 * 处理折线图表数据
 * @param options
 */
function handleMapData(options: H3.Chart.ChartOptions): H3.Chart.ChartData {
  let data: any = [];
  let dimensionLength: number = 0;
  const dimensionArray: any = [];
  const maxDimension: any = 25;
  let groupArray: any = [];
  const groupLength = 0;
  let maxMetric;
  let minMetric;
  const groupNameArray: any = {};
  const total: any = [];
  let metricRangeData = {};
  let fields = {};
  let dimensionKey;
  const mapName = options.mapSource && options.mapSource.name ? options.mapSource.name : "";

  groupArray = options.metric.map((field: H3.Report.FieldColumn) => {
    groupNameArray[field.uid] = field.alias || field.name;
    return field.uid;
  });

  options.data.forEach((item: any, rowIndex: number) => {
    item[options.dimension.uid] = item[options.dimension.uid] || "为空";
    if (typeof item[options.dimension.uid] === "object") {
      dimensionKey = item[options.dimension.uid].code;
    }
    if (!fields[dimensionKey]) {fields[dimensionKey] = [item[options.dimension.uid]];}
    dimensionArray[rowIndex] = item[options.dimension.uid];
    options.metric.forEach((metric: H3.Report.FieldColumn, index: number) => {
      const num = item[metric.uid];
      // 计算数值绝对值总和
      total[index] = total[index] || 0;
      total[index] += num;
      metricRangeData[dimensionKey] = metricRangeData[dimensionKey] || [];
      metricRangeData[dimensionKey][index] = metricRangeData[dimensionKey][index] || 0;
      metricRangeData[dimensionKey][index] += num;
      fields[dimensionKey][index + 1] = fields[dimensionKey][index + 1] || 0;
      fields[dimensionKey][index + 1] += num;
    });
  });

  Object.values(fields).forEach((item: Array<any>) => {
    if (typeof item[0] === "object" && (item[1] === 0 || item[1])) {
      data.push(Object.assign(item[0], { value: item[1] }));
    }
  });
  dimensionLength = data.length;
  metricRangeData = Object.values(metricRangeData);
  data.forEach((item: any, index: number) => {
    maxMetric = maxMetric === 0 || maxMetric ? Math.max(maxMetric, item.value || 0) : item.value;
    minMetric = minMetric === 0 || minMetric ? Math.min(minMetric, item.value || 0) : item.value;
  });
  if (maxMetric === minMetric) {
    maxMetric = (maxMetric * 1000 + 1000) / 1000;
  }
  return {
    dimensionLength,
    dimensionArray,
    maxDimension,
    groupArray,
    groupLength,
    mapName,
    maxMetric,
    minMetric,
    data
  };
}

export default handleMapData;
