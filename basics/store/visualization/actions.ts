import { ActionTree } from "vuex";
import { ReportState } from ".";
import {
  removeChart,
  getReport,
  getSchemaModel,
  loadChartData,
  saveReport
} from "../../service/visualization";
import { ReportAction } from "./types";
import InitGlobal from "../../instance/modules/global";
import ChartsInstance from "../../instance/element/instance";
import { handleSchemaModal } from "./help";
import ChartModules from "../../instance/element-modules/visualization";
const actions: ActionTree<ReportState, ReportState> = {
  /**
   * 获取报表主体数据
   * @param commit
   * @param dispatch
   * @param state
   * @param schemaCode
   */
  async [ReportAction.GETREPORT]({ commit, dispatch, state }, schemaCode: string) {
    state.schemaCode = schemaCode;
    const res = (await getReport(schemaCode)) as H3.ReportAPI.Response;
    if (res) {
      if (res.ReturnData && res.ReturnData.ReportStyle) {
        const report = res.ReturnData.ReportStyle;
        state.charts = report.charts;
        state.global = report.global;
        state.objectId = report.objectId;
        state.charts = state.charts || [];
      }
      state.charts.forEach((chartStr: string | H3.Report.Chart, index: number) => {
        let chart: H3.Report.Chart;
        if (typeof chartStr === "string") {
          chart = JSON.parse(chartStr as string);
        } else {
          chart = chartStr as H3.Report.Chart;
        }
        state.charts[index] = chart;
        ChartModules(chart);
      });
      state.charts.sort((prvChart: H3.Report.Chart, nextCHart: H3.Report.Chart) => {
        if (prvChart.i < nextCHart.i) {
          return 1;
        }
        if (prvChart.i > nextCHart.i) {
          return -1;
        }
        return 0;
      });

      if (typeof state.global === "string") {
        state.global = JSON.parse(state.global as any);
      }
      const global = InitGlobal(state.global);
      state.global = global.global;
      state.globalModules = global.modules;
    }
    await dispatch(ReportAction.GETSCHEMA, schemaCode);
    return new Promise((resolve, reject) => {
      if (res) {
        resolve();
      } else {
        reject();
      }
    });
  },
  /**
   * 新增图表
   * @param commit
   * @param state
   * @param chartType
   */
  [ReportAction.ADDCHART]({ commit, state }, chartType: H3.Report.ElementType) {
    const chart = new ChartsInstance(chartType);
    state.chartsData[chart.uid] = [];
    ChartModules(chart);
    return chart;
  },
  /**
   * 获取SchemaModel
   * @param commit
   * @param state
   * @param schemaCode
   */
  async [ReportAction.GETSCHEMA]({ commit, state }, schemaCode: string) {
    const res = await getSchemaModel(schemaCode);
    if (res) {
      state.schemas = [];
      const schemaModel: H3.ReportAPI.SchemaModel = res.ReturnData as H3.ReportAPI.SchemaModel;
      state.schemas = handleSchemaModal(schemaModel);
    }
    return state.schemas;
  },
  /**
   * 加载图表数据
   * @param commit
   * @param state
   * @param chart
   * @param mode
   */
  async [ReportAction.LOADCHARTDATA]({ commit, state }, { chart, mode }) {
    const key = mode ? `edit${chart.uid}` : chart.uid;
    let tmpChart: H3.Report.Chart | null = null;
    tmpChart = JSON.parse(JSON.stringify(chart)) as H3.Report.Chart;
    Object.keys(tmpChart.data).forEach((moduleKey: string) => {
      if (tmpChart) {
        if (tmpChart.data[moduleKey] instanceof Array) {
          tmpChart.data[moduleKey] = tmpChart.data[moduleKey].filter((item: any) => item.type);
        } else {
          if (!tmpChart.data[moduleKey]) {
            delete tmpChart.data[moduleKey];
          }
        } 
      }
    });
    tmpChart.data.filter = state.globalFilters;
    const res = await loadChartData(tmpChart);
    return new Promise(resolve => {
      if (res) {
        if (![404, 500, 600].includes(res.StatusCode)) {
          state.chartsData[key] = res.ReturnData.Pivot || res.ReturnData.Series;
          state.chartsAlias[key] = res.ReturnData.Alias;
          resolve({
            chartData: state.chartsData[key],
            chartAlias: state.chartsAlias[key]
          });
        } else {
          resolve(res.StatusCode);
        }
      } else {
        resolve(false);
      }
      resolve(false);
    });
  },
  /**
   * 获取图表数据
   * @param commit
   * @param state
   * @param chart
   * @param mode
   */
  async [ReportAction.GETCHARTDATA]({ dispatch, state }, { chart, mode }) {
    const chartData = state.chartsData[`edit${chart.uid}`] || state.chartsData[chart.uid];
    const chartAlias = state.chartsAlias[`edit${chart.uid}`] || state.chartsAlias[chart.uid];
    if (!chartData) {
      const res = await dispatch(ReportAction.LOADCHARTDATA, { chart, mode });
      return new Promise(resolve => {
        if (res instanceof Object) {
          resolve({
            chartData: res.chartData,
            chartAlias: res.chartAlias
          });
        } else if (typeof res === "number") {
          resolve(res);
        } else {
          resolve(false);
        }
      });
    }
    return {
      chartData,
      chartAlias
    };
  },
  /**
   * 保存图表
   * @param state
   * @param charts
   */
  async [ReportAction.SAVECHARTS]({ state }, charts: Array<H3.Report.Chart>) {
    let result = false;
    if (!charts) {charts = state.charts;}
    const report: H3.Report.Report = {
      charts,
      objectId: state.objectId,
      global: state.global
    };
    const res = (await saveReport(report)) as H3.ReportAPI.Response;
    if (res) {
      if (res.ReturnData.ObjectId) {
        state.objectId = res.ReturnData.ObjectId;
        result = true;
      }
    }
    return result;
  },
  /**
   * 保存图表
   * @param state
   * @param dispatch
   * @param chart
   */
  async [ReportAction.SAVECHART]({ dispatch, state }, chart: H3.Report.Chart) {
    const oldCharts = JSON.parse(JSON.stringify(state.charts));
    let activeChartIndex = state.charts.findIndex(
      (oldChart: H3.Report.Chart) => oldChart.uid === chart.uid
    );

    if (activeChartIndex > -1) {
      state.charts[activeChartIndex] = chart;
    } else {
      state.charts.unshift(chart);
      activeChartIndex = 0;
    }
    const res = await dispatch(ReportAction.SAVECHARTS, state.charts);
    if (!res) {
      state.charts = oldCharts;
    }
    return res;
  },
  /**
   * 删除图表
   * @param state
   * @param dispatch
   * @param chart
   */
  async [ReportAction.REMOVECHART]({ dispatch, state }, chart: H3.Report.Chart) {
    const chartIndex = state.charts.findIndex(
      (sChart: H3.Report.Chart) => sChart.uid === chart.uid
    );
    if (chartIndex > -1) {
      const res = (await removeChart(chart)) as H3.ReportAPI.Response;
      if (res) {
        state.charts.splice(chartIndex, 1);
      } else {
        return false;
      }
    }
    return true;
  }
};

export default actions;
