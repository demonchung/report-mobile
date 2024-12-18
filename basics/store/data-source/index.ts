import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
Vue.use(Vuex);

export class ReportDataSourceState implements H3.Report.ReportDataSourceState {
  corpId: string = "";
  config: any = {};
  dataSourceId: string = "";
  groupId: string = "";
  isWxwork = false;
  title: string = ""; // 高级数据源标题
  activeNode: H3.Falls.Node | null = null; // 当前激活节点
  options: H3.Falls.CustomOptions = {}; // 自定义配置
  nodes: Array<H3.Falls.Node> = []; // 流程节点集合
  edges: Array<H3.Falls.Edge> = []; // 流程关系
  models: Array<H3.Falls.Model> = []; // 模型
  merges: Array<H3.Falls.Merge> = []; // 追加合并
  relations: Array<H3.Falls.Relation> = []; // 关联
  computes: Array<H3.Falls.Compute> = []; // 设置字段
  filters: Array<H3.Falls.Filter> = []; // 过滤
  groups: Array<H3.Falls.Group> = []; // 分组汇总
  output: H3.Falls.Output | null = null; // 输出节点
  originalNodes: Array<any> = []; // 原始节点信息
  originalEdges: Array<any> = []; // 原始连接线信息
  fieldsMapping: Array<any> = []; // 字段映射
  isEdit: boolean = false;
  cachePreviewList: {[key: string]: any} = {};
  integrateComponents: Function | null = null; // 业务集成相关
  langType = "cn";
  performanceLimit : any= {}; // 普通高级数据源的配置限制信息
}
const state = new ReportDataSourceState();

export const dataSourceState = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
