import {MutationTree} from 'vuex';
import {ReportState} from '.';
import { handleFilters } from './help';
import {ReportMutation} from './types';

const mutations: MutationTree<ReportState> = {
  /**
   * 重置报表
   */
  [ReportMutation.RESETREPORT](state) {
    state.schemaCode = '';
    state.schemas = [];
    state.globalModules = {
      styles: {}
    };
    state.activeChart = null;
    state.chartsData = {};
    state.objectId = '';
    state.charts = [];
    state.global = {
      styles: {
      }
    } as any;
    state.globalFilters = [];

  },
  /**
   * 设置激活的图表
   * @param state
   * @param activeChart
   */
  [ReportMutation.SETACTIVECHART](state, activeChart: H3.Report.Chart) {
    state.activeChart = activeChart;
    return state.activeChart;
  },
  /**
   * 设置全局筛选条件
   * @param state
   * @param filter
   */
  [ReportMutation.SETGLOBALFILTER](state, filter:Array<H3.Yun.Filter>) {
    state.globalFilters = handleFilters(state.schemas, filter);
  },
  /**
   * 更新全部图表
   * @param state
   * @param charts
   */
  [ReportMutation.UPDATECHARTS](state, charts :Array<H3.Report.Chart>) {
    state.charts = charts;
  },
  /**
   * 更新图表视图
   * @param state
   * @param field
   */
  [ReportMutation.RESIZECHARTVIEW](state, {chart, type}) {
    const viewStatus: any = state.chartViewStatus[chart.uid];
    if (viewStatus) {
      if (type === 'view' && viewStatus.view instanceof Function) {
        viewStatus.view();
      } else {
        if (type === 'data' && viewStatus.data instanceof Function) {
          viewStatus.data();
        }
      } 
    }
  },
  /**
   * 处理排序字段
   * （如果其他字段变更，查找排序字段是否存在，不存在就删除）
   * @param state
   */
  [ReportMutation.HANDLESORT](state) {
    if(state.activeChart && state.activeChart.data.sort && state.activeChart.data.sort.length) {
      const sortArr = state.activeChart.data.sort;
      let objArr: Array<H3.Report.FieldColumn> = [];
      if(state.activeChart.data.dimension){
        objArr = objArr.concat(state.activeChart.data.dimension);
      }
      if(state.activeChart.data.groupDimension){
        objArr = objArr.concat(state.activeChart.data.groupDimension);
      }
      if(state.activeChart.data.metric){
        objArr = objArr.concat(state.activeChart.data.metric);
      }
      sortArr.forEach((sort: H3.Report.FieldColumn, index: number)=> {
        const objIndex = objArr.findIndex((obj: H3.Report.FieldColumn) => (obj.schemaCode === sort.schemaCode && obj.uid === sort.uid));
        if(objIndex < 0){
          sortArr.splice(index, 1);
        }else {
          objArr[objIndex].options.order = sortArr[index].options.order;
          sortArr.splice(index, 1, objArr[objIndex]);
        }
      });
    }
  }
};

export default mutations;
