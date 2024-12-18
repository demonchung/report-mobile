import {maxDimension, maxFunnelGroup } from '../options';
import customSort  from "@h3/report-mobile/basics/utils/customSort";

/**
 * 处理漏斗图表
 * @param options
 */
function handleFunnelData(options: H3.Chart.ChartOptions) : H3.Chart.ChartData {
  const dimensionLength = options.data.length;
  const dimensionArray: any = {};
  const groupLength = dimensionLength;
  let groupArray: any = [];
  let groupArrayData: any = [];
  const groupNameArray: any = {};
  const data = options.data;
  let total = 0;
  let maxMetric: number = 0;
  let minMetric: number = 0;
  const groupNum = maxFunnelGroup;
  // 数据超过10条后额外处理
  // if (groupLength > groupNum) {
  //   const mergeData: any = [];
  //   options.data.forEach((item: any, index: number) => {
  //     maxMetric = Math.max(maxMetric, item[options.metric[0].uid] || 0);
  //     minMetric = Math.min(minMetric, item[options.metric[0].uid] || 0);
  //     // 计算数值总和
  //     total += item[options.metric[0].uid];
  //     if (index < groupNum - 1) {
  //       groupArray.push(item[options.dimension.uid]);
  //       mergeData.push(item);
  //     } else {
  //       if (!mergeData[groupNum - 1]) {
  //         mergeData[groupNum - 1] = {};
  //         mergeData[groupNum - 1][options.metric[0].uid] = 0;
  //         mergeData[groupNum - 1][options.dimension.uid] = '其他';
  //       }
  //       mergeData[groupNum - 1][options.metric[0].uid] += item[options.metric[0].uid];
  //     }
  //   });
  //   groupArray.push('其他');
  //   data = mergeData;
  // } else {
    groupArray = options.data.map((field: H3.Report.FieldColumn) => {
      maxMetric = Math.max(maxMetric, field[options.metric[0].uid] || 0);
      minMetric = Math.min(minMetric, field[options.metric[0].uid] || 0);
      // 计算数值总和
      total += field[options.metric[0].uid];
      return field[options.dimension.uid]
    })
  // }
  groupArrayData = options.metric.map((field: H3.Report.FieldColumn) => {
    groupNameArray[field.uid] = field.alias || field.name;
    return field.uid;
  });
  groupArray =   options.metric.map((field: H3.Report.FieldColumn) => {
    return  field.alias || field.name
  });
  // // 一维自定义排序
  // const demotionId = options.dimension.uid;
  // if(demotionId){
  //   const nameArr:any = [];
  //   let mapKeyValue = {};
  //   data.length && data.map((obj)=>{
  //     mapKeyValue[obj[demotionId]] = obj;
  //     nameArr.push(obj[demotionId])
  //   })
  //   //二维自定义排序
  //   const sortKeyValue = {};
  //   sortKeyValue[demotionId] = nameArr;
  //   const sortRes = customSort(sortKeyValue,true,options.customSort);
  //   const newData = sortRes[demotionId];
  //   const resData:any = [];
  //   newData && newData.length && newData.forEach((name)=>{
  //     resData.push(mapKeyValue[name])
  //   })
  //   groupArray = newData;
  //   data = resData;
  // }
  return {
    dimensionLength,
    dimensionArray,
    groupLength,
    groupArray,
    data,
    maxDimension,
    total,
    maxMetric,
    minMetric,
    groupNameArray,
    groupArrayData
  }
}

export default handleFunnelData;
