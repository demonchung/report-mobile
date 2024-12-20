import Modules from "../../modules";

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
  modules.styles.dataLabel = new Modules.DataLabel();
  modules.data.dimension.max = 2;
  modules.data.metric.max = 25;
  initDimensionsAndMetric(modules, chart, {
    dimension: chart.data.dimension || [],
    metric: chart.data.metric || []
  });

  modules.data.dimension.change = (data: any) => initDimensionsAndMetric(modules, chart, data);
  modules.data.metric.change = (data: any) => initDimensionsAndMetric(modules, chart, data);
  // 隐藏dimensionLimit - 维度数据设置
  if (modules.styles.dimensionLimit) {
    modules.styles.dimensionLimit.display = false;
    chart.styles.dimensionLimit = null;
  }
}

/**
 * limit开关控制
 * @param modules
 * @param chart
 */
function limitControl(modules: any, chart: H3.Report.Chart, type: number) {
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
    } else {
      modules.data.metric.max = 25;
      // 多指标时
      if (modules.data.metricGroup && modules.data.metricGroup.data) {
        modules.data.metricGroup.data.forEach((d, index) => {
          modules.data.metricGroup.data[index].max = 25;
        });
      }
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
    const hasMoreMetric = chart.data.metricGroup.find(m => m && m.length > 1);
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
 * 处理维度指标改变，更新sort
 * @param modules
 * @param chart
 */
export function handleSort(modules: any, chart: H3.Report.Chart) {}
