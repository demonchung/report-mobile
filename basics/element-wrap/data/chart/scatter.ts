import { maxDimension, maxGroup } from "../options";

/**
 * 处理散点图图表
 * @param options
 */
function handleScatterData(options: H3.Chart.ChartOptions): H3.Chart.ChartData {
  const dimensionLength = 0;
  const dimensionArray: any = {};
  let groupArray: Array<any> = [];
  const groupNameArray: any = null;
  const groupLength = 0;
  let maxMetric: number = 0;
  let minMetric: number = 0;
  let total: number = 0;
  let data: Array<any> = [];
  let arr: any = [];
  let groupArr: any = [];
  let avgMetric = 0;
  // 散点图本没有占比及数值格式设置功能，兼容之前开启设置的脏数据
  if (options.metric.length) {
    options.metric.forEach((metric: H3.Report.FieldColumn, index: number) => {
      if (metric.options.numberFormat) {
        metric.options.numberFormat.comma = false;
        metric.options.numberFormat.percent = false;
      }
    });
  }
  if (options.groupDimension) {
    const tmp = {};
    options.data.forEach((row: any) => {
      //let groupName = row[options.groupDimension.uid];
      let groupName = row[options.groupDimension.uid] === 0 ? "0" : row[options.groupDimension.uid] || "为空";
      if (!groupArray.includes(groupName)) {
        if (groupArray.length < maxGroup - 1) {
          groupArray.push(groupName);
        } else {
          groupName = "为空";
        }
      }
      
      tmp[groupName] = tmp[groupName] || [];
      arr = tmp[groupName];
      groupArr = [];
      options.metric.forEach((metric: H3.Report.FieldColumn, index: number) => {
        if (index === 1) {
          maxMetric = Math.max(maxMetric, row[metric.uid]);
          minMetric = Math.min(minMetric, row[metric.uid]);
        }
        groupArr.push(row[metric.uid]);
        if (index === 2) {
          total += row[metric.uid];
        }
      });
      row[options.dimension.uid] = row[options.dimension.uid] === 0 ? "0" : row[options.dimension.uid] || "为空";
      groupArr.push(row[options.dimension.uid], row[options.groupDimension.uid]);
      arr.push(groupArr);
    });
    groupArray = Object.keys(tmp);
    data = Object.values(tmp);
  } else {
    options.data.forEach((row: any) => {
      arr = [];
      options.metric.forEach((metric: H3.Report.FieldColumn, index: number) => {
        if (index === 1) {
          maxMetric = Math.max(maxMetric, row[metric.uid]);
          minMetric = Math.min(minMetric, row[metric.uid]);
        }
        arr.push(row[metric.uid]);
        if (index === 2) {
          total += row[metric.uid];
        }
      });
      row[options.dimension.uid] = row[options.dimension.uid] === 0 ? "0" : row[options.dimension.uid] || "为空";
      arr.push(row[options.dimension.uid], options.dimension.name);
      data.push(arr);
    });
    data = [data];
    groupArray.push(options.dimension.name);
  }
  avgMetric = total / options.data.length;
  return {
    data,
    dimensionLength,
    dimensionArray,
    groupArray,
    groupLength,
    groupNameArray,
    maxDimension,
    avgMetric,
    maxMetric,
    minMetric
  };
}
export default handleScatterData;
