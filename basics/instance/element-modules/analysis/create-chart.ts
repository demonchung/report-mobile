import ChartsInstance from "../../element/instance";
import ChartModules from "../analysis";
import { getBaseModules } from "@h3/report-mobile/basics/instance/help/analysis";

/**
 * 创建图表实例
 * @param chartType
 * @param oldChart  旧的图表数据
 */
export const createNewChart = (chartType, oldChart?: H3.Report.Chart) => {
  let newChart: H3.Report.Chart;
  // 初始化新的图表
  newChart = new ChartsInstance(chartType, oldChart);
  // 获取以及配置好的默认配置
  const defaultOpt = getBaseModules(chartType);
  // 初始化图表模块实例
  ChartModules(newChart as any, oldChart, defaultOpt);
  return newChart;
};

/**
 * 创建图表模块实例
 * @param chart 获取图表配置模型的图表
 * @param oldChart  旧的图表数据
 */
export const createChartModules = (chart: H3.Report.Chart, oldChart?: H3.Report.Chart) => {
  const defaultOpt = getBaseModules(chart.type);
  // 初始化图表模块实例
  const m = ChartModules(chart, oldChart, defaultOpt);
  return m;
};
