import Vue from "vue";
import { MutationTree } from "vuex";
import { AnalysisState } from ".";
import { handleFilters, handleGlobalFilter, handleFilterStructure } from "./help";
import { ReportAction, ReportMutation } from "./types";
import { createChartModules } from "@h3/report-mobile/basics/instance/element-modules/analysis/create-chart";
import { analysisApi } from "@h3/report-mobile/basics/service/analysis";

const mutations: MutationTree<AnalysisState> = {
  /**
   * 初始化报表数据 todo 暂时写一个环境，后续多种环境再变更
   * @param state
   */
  [ReportMutation.SETENV](state, env) {
    state.isWxwork = env;
  },
  /**
   * 设置统计分析服务配置项
   * @param state
   * @param corpId
   * @param ownerId
   * @param config
   * @param dataSourceId
   */
  [ReportMutation.SETANALYSISINFO](state, { corpId, ownerId, config, dataSourceId }) {
    if (corpId) {
      state.corpId = corpId;
    }
    if (ownerId) {
      state.ownerId = ownerId;
    }
    if (dataSourceId) {
      state.dataSourceId = dataSourceId;
    }
    state.config = config;
    analysisApi.setConfig({ corpId, config });
  },
  /**
   * 设置激活区域
   * @param state
   * @param activeTab
   */
  [ReportMutation.SETACTIVETAB](state, activeTab) {
    state.activeTab = activeTab;
  },
  /**
   * 设置激活区域
   * @param state
   * @param activeTab
   */
  [ReportMutation.SETALIAS](state, { chartId, alias }) {
    state.chartsAlias[chartId] = alias;
  },

  /**
   * 重置报表
   */
  [ReportMutation.RESETREPORT](state, resetGlobalFilters: boolean = false) {
    state.activeChart = null;
    state.charts = [];
    state.chartsInfo = {};
    // 刷新统计分析时如果有全局筛选器不刷新
    if (resetGlobalFilters) {
      state.globalFilters = [];
      // state.dataSourceId = '';
    }
    state.chartViewStatus = {};
    state.objectId = "";
    state.dataSources = {};
    // state.originalFilters = [];
  },

  /**
   * 设置激活的图表
   * @param state
   * @param activeChart
   */
  [ReportMutation.SETACTIVECHART](state, activeChart: H3.Report.Chart) {
    if (!state.backupActiveChart) {
      state.backupActiveChart = JSON.parse(JSON.stringify(activeChart));
    }
    state.activeChart = activeChart;
    if (activeChart) {
      createChartModules(activeChart);
    }
    return state.activeChart;
  },

  /**
   * 更新图表视图
   * @param state
   * @param chart/chartId
   * @param type
   */
  [ReportMutation.RESIZECHARTVIEW](state, { chartId, type }) {
    const viewStatus: any = state.chartViewStatus[chartId];
    if (!viewStatus) {
      return;
    }
    const fun: Function | undefined = viewStatus[type];
    if (fun instanceof Function) {
      viewStatus[type]();
    }
  },
  /**
   * 设置全局筛选条件
   * @param state
   * @param filter
   */
  [ReportMutation.SETGLOBALFILTER](state, filter: Array<H3.Yun.Filter>) {
    if (state.dataSources && state.dataSourceId && state.dataSources[state.dataSourceId]) {
      state.globalFilters = handleFilterStructure(
        state.dataSources[state.dataSourceId].properties,
        filter
      );
    } else {
      state.originalFilters = filter;
    }
  },

  /**
   * 拖拽排序图表
   * @param state
   */
  [ReportMutation.DRAGCHARTS](state, { newIndex, oldIndex }) {
    let charts = state.charts;
    charts.splice(newIndex, 0, charts.splice(oldIndex, 1)[0]);
  },
  /**
   * 设置图表
   * @param state
   */
  [ReportMutation.SETCHARTS](state, charts) {
    state.charts = charts;
  },
  /**
   * 重置激活图表参数
   * @param state
   */
  [ReportMutation.RESETACTIVECHART](state) {
    state.activeChart = JSON.parse(JSON.stringify(state.backupActiveChart));
    // 重新刷新图表
  },
  /**
   * 重置全局筛选器
   * @param state
   */
  [ReportMutation.RESETGLOBALFILTER](state) {
    state.globalFilters = [];
  },
};

export default mutations;
