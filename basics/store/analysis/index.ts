import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
import { TabState } from "@h3/report-mobile/basics/enum/module-state";
import initGlobal from "@h3/report-mobile/basics/instance/modules/global";
import { ModuleState } from "@h3/report-mobile/basics/enum/module-state";

Vue.use(Vuex);
export class AnalysisState implements H3.Report.ReportAnalysisState {
  // 企业id
  corpId: string = "";
  // 平台传入的参数
  config: any = {};
  // 拥有者id
  ownerId: string = "";
  // 数据源id
  dataSourceId: string = "";
  // 当前激活的报表的id 例如：个人模块的objectId
  objectId: string = "";
  publicObjectId: string = ""; //公共模块的objectId
  privateObjectId: string = ""; //个人模块的objectId

  // 当前激活的区域
  activeTab: TabState = TabState.PUBLIC;
  // 图表的相关信息
  chartsInfo: { [key: string]: H3.Analysis.ChartInfo } = {};
  // 当前激活报表的所有图表集合
  charts: Array<H3.Report.Chart> = [];
  // 全局的配置信息 类似于样式
  global: H3.Report.Global = initGlobal({
    styles: {}
  } as any).global;
  // 当前激活的图表 类似于当前编辑的图表 当前放大的图表 没有在设计池中时为空
  activeChart: H3.Report.Chart | null = null;
  // 备份的当前激活图表，如果返回时将清除之前的操作
  backupActiveChart: H3.Report.Chart | null = null;
  // 当前激活的展示状态 展示 预览 设计
  activeViewStatus: ModuleState = ModuleState.VIEW;
  // 刷新图表方法
  chartViewStatus = {};
  // 全局筛选器，需要监听外部筛选条件
  globalFilters: Array<H3.Report.FilterFieldColumn> = [];
  // 没有格式化过的筛选条件
  originalFilters: Array<H3.Yun.Filter> = [];
  // 获取的数据 （没必要）
  chartsData: { [key: string]: Array<any> } = {};
  // 数据源详情 事实上统计分析在一个生命周期内只有一个数据源
  dataSources: { [dataSourceId: string]: H3.Report.DataSource } = {};
  // 全局模块 （没有）
  globalModules: H3.ReportModules.ChartModules = {
    styles: {}
  };
  // 图表别名？
  chartsAlias: { [key: string]: { [key: string]: string } } = {};
  // 是否是企微环境
  isWxwork = false;
}
const state = new AnalysisState();

export const analysisState = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default new Vuex.Store<AnalysisState>({
  modules: {
    analysisState: analysisState
  }
});
