import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

export class ReportState implements H3.Report.ReportEasyState{
  schemaCode = '';
  schemas: Array<H3.Report.FieldColumn> = [];
  globalModules: H3.ReportModules.ChartModules = {
    styles: {}
  };
  activeChart: H3.Report.Chart | null = null;
  chartsData: { [key: string]: Array<any> } = {};
  chartsAlias: { [key: string]: {[key: string]: string } } = {};
  objectId: string = '';
  chartViewStatus = {};
  charts: Array<H3.Report.Chart> = [];
  global: H3.Report.Global = {
    styles: {
    }
  };
  globalFilters: Array<H3.Report.FilterFieldColumn> = [];
}
const state = new ReportState();

export const reportState =  {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default new Vuex.Store<ReportState>({
  modules: {
    visualization: reportState
  }
});
