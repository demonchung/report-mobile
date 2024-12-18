import Modules from "../../modules";

/**
 *  检查是否展示堆叠合计
 * @param metrics
 * @returns
 */
export function checkShowPileSum(metrics: Array<H3.Report.FieldColumn>): boolean {
  if (metrics) {
    let showPileSum = true;
    metrics.forEach((item, index) => {
      if (item.options && item.options.percent === "PERCENT") {
        showPileSum = false;
        return;
      }
    });
    return showPileSum;
  }
  return false;
}

/**
 * 统计分析初始化基本两维一指标 or 一维多指标
 * @param modules
 * @param chart
 */
export function handleAnalysisDimensionsAndMetric(modules: any, chart: H3.Report.Chart) {
  modules.data.dimension.max = 2;
  modules.data.metric.max = 25;
  initDimensionsAndMetric(
    modules,
    chart,
    {
      dimension: chart.data.dimension || [],
      metric: chart.data.metric || []
    },
    false
  );
}
/**
 * 初始化基本两维一指标 or 一维多指标
 * @param modules
 * @param chart
 */
export function handleDimensionsAndMetric(modules: any, chart: H3.Report.Chart) {
  modules.data.dimension.max = 2;
  modules.data.metric.max = 25;
  initDimensionsAndMetric(modules, chart, {
    dimension: chart.data.dimension || [],
    metric: chart.data.metric || []
  });
  removeTargetValue(chart.data.metric || []);
  modules.data.dimension.change = (data: any) => initDimensionsAndMetric(modules, chart, data);
  modules.data.metric.change = (data: any) => initDimensionsAndMetric(modules, chart, data);
  if (modules.data.forecast) {
    modules.data.forecast.change = (data: any) => changeForecast(modules, chart, data);
  }
  // 隐藏dimensionLimit - 维度数据设置
  if (modules.styles.dimensionLimit) {
    modules.styles.dimensionLimit.display = false;
    chart.styles.dimensionLimit = null;
  }
  if (
    chart.data.dimension &&
    chart.data.dimension[0] &&
    chart.data.dimension[0].options &&
    chart.data.dimension[0].type === "date" &&
    chart.data.dimension[0].options.format &&
    chart.data.forecast
  ) {
    if (["M", "MD", "D"].includes(chart.data.dimension[0].options.format)) {
      modules.data.forecast.display = false;
      chart.data.forecast.show = false;
    }
  }
}

/**
 * 还原指标目标值设置
 */
export function removeTargetValue(metric) {
  if (metric && metric.length) {
    metric.forEach(item => {
      if (item.options && item.options.targetValue) {
        delete item.options.targetValue;
      }
    });
  }
}
/**
 * 预测功能联动
 * @param modules
 * @param chart
 * @param data
 */
export function changeForecast(modules, chart, data) {
  if (chart.data && chart.data.forecast && data.data.show) {
    if (
      chart.data.sort &&
      chart.data.dimension.length &&
      chart.data.dimension[0].type === "date" &&
      !chart.data.sort.length
    ) {
      const tmpField = chart.data.sort.find(item => item.uid === chart.data.dimension[0].uid);
      if (tmpField) {
        tmpField.options.order = "asc";
      } else {
        const field = JSON.parse(JSON.stringify(chart.data.dimension[0]));
        field.options.order = "asc";
        chart.data.sort.push(field);
      }
    }
  }
}
/**
 * limit开关控制
 * @param modules
 * @param chart
 */
export function limitControl(modules: any, chart: H3.Report.Chart, type: number) {
  if (modules.data.limit) {
    // 0-隐藏、1-显示
    if (type === 0) {
      modules.data.limit.display = false;
      chart.data.limit = null;
    } else {
      modules.data.limit.display = true;
    }
  }
}

/**
 * 处理基本两维一指标 or 一维多指标
 * @param modules
 * @param chart
 * @param data
 * @param changeLimit
 */
function initDimensionsAndMetric(modules, chart, data, changeLimit: boolean = true) {
  // 操作维度触发项
  if (data.dimension) {
    if (data.dimension.length > 1) {
      modules.data.metric.max = 1;
      // 多指标时
      if (modules.data.metricGroup && modules.data.metricGroup.data) {
        modules.data.metricGroup.data.forEach((d, index) => {
          modules.data.metricGroup.data[index].max = 1;
        });
      }
      let dimArr: any = [];
      dimArr = data.dimension.filter(item=> item.type === "date")
      if(!dimArr.length && chart.data && chart.data.metric){
        for(var i = 0; i < chart.data.metric.length; i++){
          delete chart.data.metric[i].options.ratio ;
        }
      }
    } else {
      modules.data.metric.max = 25;
      // 多指标时
      if (modules.data.metricGroup && modules.data.metricGroup.data) {
        modules.data.metricGroup.data.forEach((d, index) => {
          modules.data.metricGroup.data[index].max = 25;
        });
      }
      if(data.dimension.length === 0 || data.dimension[0].type !== "date"){
        if(chart.data && chart.data.metric) {
          for(var i = 0; i < chart.data.metric.length; i++){
            delete chart.data.metric[i].options.ratio ;
          }
        }
        if(chart.data && chart.data.metricGroup) {
          if(chart.data.metricGroup[0]){
          for(var i = 0; i < chart.data.metricGroup[0].length; i++){
              delete chart.data.metricGroup[0][i].options.ratio ;
          }
          }
          if(chart.data.metricGroup[1]){
            for(var i = 0; i < chart.data.metricGroup[1].length; i++){
                delete chart.data.metricGroup[1][i].options.ratio ;
            }
            }
        }
      }
    }

    // 对日期字段做初始化
    if (chart.data.dimension) {
      chart.data.dimension.forEach((item, index) => {
        const type = item.specialType ? item.specialType : item.type;
        if ((type === "date" && !item.options.format) || item.options.format === "YMDHMS") {
          item.options.format = "Y";
        }
        if ((type === "address" && !item.options.areaType) || item.options.areaType === "all") {
          item.options.areaType = "district";
        }
        if (item.options && item.options.isComputeField && item.type === "number") {
          chart.data.dimension.splice(index, 1);
        }
      });
    }
  }
  // 操作指标触发项
  if (data.metric) {
    if (data.metric.length > 1) {
      modules.data.dimension.max = 1;
    } else {
      modules.data.dimension.max = 2;
    }
  }
  // 操作指标集合的
  if (data.metricGroup) {
    const hasMoreMetric = data.metricGroup.find(m => m && m.length > 1);
    if (hasMoreMetric) {
      // 如果发现一个维度有超过一个的 那么只能是一维多指标
      modules.data.dimension.max = 1;
    } else {
      modules.data.dimension.max = 2;
    }
  }
  if (changeLimit) {
    handleLimit(modules, chart, {
      dimension: chart.data.dimension || [],
      metric: chart.data.metric || []
    });
  }
  if (chart.data && chart.data.innerFilter) {
    handleInnerFilter(modules, chart);
  }
  if (chart.data && chart.data.sort) {
    handleSort(modules, chart);
  }
  return modules;
}

export function handleLimit(modules, chart, data) {
  // 操作维度触发项
  if (data.dimension) {
    if (data.dimension.length > 1) {
      // 2维1标，隐藏limit
      limitControl(modules, chart, 0);
    } else {
      if (chart.data.metric && chart.data.metric.length > 1) {
        // 1维多标，隐藏limit功能
        limitControl(modules, chart, 0);
      } else {
        // 1维1标，显示limit功能
        limitControl(modules, chart, 1);
      }
    }
  }
  // 操作指标集合的
  if (data.metricGroup) {
    const hasMoreMetric = chart.data.metricGroup.find(m => m && m.length > 1);
    if (hasMoreMetric) {
      limitControl(modules, chart, 0);
    }
  }
}
/**
 * 初始化基本两维一指标 or 一维多指标 多轴图
 * @param modules
 * @param chart
 */
export function handleDimensionsAndMetricGroup(modules: any, chart: H3.Report.Chart) {
  modules.data.dimension.max = 2;
  initDimensionsAndMetric(modules, chart, {
    dimension: chart.data.dimension || [],
    metric: chart.data.metric || []
  });
  modules.data.dimension.change = (data: any) => initDimensionsAndMetric(modules, chart, data);
  modules.data.metricGroup.change = (data: any) => initDimensionsAndMetric(modules, chart, data);
  if (modules.data.forecast) {
    modules.data.forecast.change = (data: any) => changeForecast(modules, chart, data);
  }
  // 隐藏dimensionLimit - 维度数据设置
  if (modules.styles.dimensionLimit) {
    modules.styles.dimensionLimit.display = false;
    chart.styles.dimensionLimit = null;
  }
}
/**
 * 处理维度指标改变，更新innerFilter
 * @param modules
 * @param chart
 */
export function handleInnerFilter(modules: any, chart: H3.Report.Chart) {
  const allFields: any = [];
  let bixMetric: Array<H3.Report.FieldColumn> = [];
  const maps = ["dimension", "metric", "groupDimension"];
  maps.forEach((item) => {
    if (chart.data[item] && chart.data[item].length) {
      allFields.push(...chart.data[item]);
      if (item === "metric") {
        allFields.push(...chart.data[item]);
      } else {
        allFields.push(
          ...chart.data[item].filter(
            field => field.type !== "date" || field.options.format === "YMDHMS"
          )
        );
      }
    }
  });
  if (chart.data.metricGroup) {
    chart.data.metricGroup.forEach(m => {
      bixMetric = [...bixMetric, ...m];
    });
  }
  if (bixMetric.length) {
    allFields.push(...bixMetric);
  }
  if (chart.data && chart.data.innerFilter) {
    const list: any = chart.data.innerFilter.filter((item) => {
      return !!allFields.find((field) => item.field.uid === field.uid);
    });
    chart.data.innerFilter.splice(0, chart.data.innerFilter.length, ...list);
  }
}
/**
 * 处理冲突的字段
 */
export function handleSortConflict(chart) {
  if (chart.type === "table" || chart.type === "crosstable") {
    if (
      chart.data.dimension &&
      chart.data.dimension.length &&
      chart.data.dimension[chart.data.dimension.length - 1] &&
      chart.data.sort
    ) {
      const lf = chart.data.dimension[chart.data.dimension.length - 1];
      const hasMetricSort = chart.data.metric.some((item) => {
        const sc = chart.data.sort.find(
          (s) => s.field === item.field && s.schemaCode === item.schemaCode && s.uid === item.uid,
        );
        if (sc && sc.options) {
          return !!sc.options.order;
        }
      });
      if (hasMetricSort) {
        delete lf.options.order;
        const num = chart.data.sort.findIndex((item) => {
          return (
            lf.field === item.field && lf.schemaCode === item.schemaCode && lf.uid === item.uid
          );
        });
        if (num > -1) {
          chart.data.sort.splice(num, 1);
        }
      }
    }
  } else {
  }
}

/**
 * 处理小计
 * @param modules
 * @param chart
 */
export function handleCrossSummary(modules: any, chart: H3.Report.Chart) {
  // chart.data.crossSummary
  let rowIds: any = [];
  let columnIds: any = [];
  if (chart.data.dimension && chart.data.dimension.length > 1) {
    rowIds = chart.data.dimension.slice(0, chart.data.dimension.length - 1).map(item => item.uid);
  }
  if (chart.data.groupDimension && chart.data.groupDimension.length > 1) {
    columnIds = chart.data.groupDimension
      .slice(0, chart.data.groupDimension.length - 1)
      .map(item => item.uid);
  }
  if (chart.data.crossSummary) {
    if (chart.data.crossSummary.rowSummaries) {
      chart.data.crossSummary.rowSummaries.forEach(item => {
        if (item.dimIds) {
          item.dimIds = item.dimIds.filter(id => rowIds.includes(id));
        }
      });
    }
  }
  if (chart.data.crossSummary) {
    if (chart.data.crossSummary.columnSummaries) {
      chart.data.crossSummary.columnSummaries.forEach(item => {
        if (item.dimIds) {
          item.dimIds = item.dimIds.filter(id => columnIds.includes(id));
        }
      });
    }
  }
}
/**
 * 处理维度指标改变，更新sort
 * @param modules
 * @param chart
 */
export function handleSort(modules: any, chart: H3.Report.Chart) {
  const allFields: any = [];
  let bixMetric: Array<H3.Report.FieldColumn> = [];
  handleSortConflict(chart);
  const maps = ["dimension", "metric", "groupDimension"];
  maps.forEach((item) => {
    if (chart.data[item] && chart.data[item].length) {
      allFields.push(...chart.data[item]);
    }
  });
  if (chart.data.metricGroup) {
    chart.data.metricGroup.forEach(m => {
      bixMetric = [...bixMetric, ...m];
    });
  }
  if (bixMetric.length) {
    allFields.push(...bixMetric);
  }
  if (chart.data && chart.data.sort) {
    const list: any = chart.data.sort.filter((item) => {
      return !!allFields.find((field) => item.uid === field.uid);
    });
    chart.data.sort.splice(0, chart.data.sort.length, ...list);
  }
}
