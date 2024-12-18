import Vue from "vue";
import { ActionTree } from "vuex";
import { AnalysisState } from ".";
import { analysisApi } from "@h3/report-mobile/basics/service/analysis/index";
import { handleSchemaModal, handleChartFieldDefaultValues, handleGlobalFilter } from "./help";
import { ReportAction, ReportMutation } from "./types";
import { TabState } from "@h3/report-mobile/basics/enum/module-state";
import { handleAnalysisResponse } from "./help";
import { AnalysisApis } from "@h3/report-mobile/basics/service/analysis/api-type";
import InitGlobal from "@h3/report-mobile/basics/instance/modules/global";
import { createNewChart } from "@h3/report-mobile/basics/instance/element-modules/analysis/create-chart";
import { uuid, guid } from "@h3/report-mobile/basics/utils/uid";

const actions: ActionTree<AnalysisState, AnalysisState> = {
  /**
   * 获取报表数据
   * @param commit
   * @param dispatch
   * @param state
   * @param shareStatus : 0 || 1 //0表示个人  1表示公共  不填表示默认，以后台返回的shareStatus为准
   */
  async [ReportAction.GETREPORT]({ commit, dispatch, state }, shareStatus?: TabState) {
    return new Promise((resolve, reject) => {
      analysisApi
        .getReportInfo(state.dataSourceId, state.ownerId, shareStatus)
        .then((res: H3.AnalysisAPI.reportInfo) => {
          commit(ReportMutation.RESETREPORT);
          const { objectId, elements, reqGlobal, share, chartsInfo } = handleAnalysisResponse(res);

          // let global = state.global;
          // if (reqGlobal) {
          //   const g = InitGlobal(JSON.parse(reqGlobal as string) as H3.Report.Global);
          //   if (g.global) {
          //     global = g.global;
          //   }
          // }
          state.chartsInfo = chartsInfo;
          state.objectId = objectId;
          state.charts.push(...elements);
          // 图表排序
          state.charts.sort((prvChart: H3.Report.Chart, nextCHart: H3.Report.Chart) => {
            if (prvChart.i < nextCHart.i) {
              return 1;
            }
            if (prvChart.i > nextCHart.i) {
              return -1;
            }
            return 0;
          });
          state.activeTab =
            shareStatus === 0 || shareStatus
              ? shareStatus
              : share === 0 || share
              ? share
              : TabState.PUBLIC;
          if(state.activeTab === 0) {
            state.privateObjectId = objectId;
          }
          if(state.activeTab === 1) {
            state.publicObjectId = objectId;
          }

          // state.global = global;
          // 外部来的筛选器给的是字段id, 必须先拿所有字段去校验!
          dispatch(ReportAction.LOADDATASOURCE, state.dataSourceId).then(() => {
            resolve(res);
          });
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  /**
   * 单独获取objectId，不做其它操作
   * @param commit
   * @param dispatch
   * @param state
   * @param shareStatus : 0 || 1 //0表示个人  1表示公共  不填表示默认，以后台返回的shareStatus为准
   */
  async [ReportAction.GETOBJECTID]({ commit, dispatch, state }, shareStatus?: TabState) {
    return new Promise((resolve, reject) => {
      analysisApi
        .getReportInfo(state.dataSourceId, state.ownerId, shareStatus)
        .then((res: H3.AnalysisAPI.reportInfo) => {
          state.objectId = res.objectId;
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  /**
   * 获取个人模块报表数据
   * @param commit
   * @param dispatch
   * @param state
   * @param dataSourceId
   */
  async [ReportAction.GETPERSONALREPORT]({ commit, dispatch, state }, dataSourceId: string) {},
  /**
   * 获取公共模块报表数据
   * @param commit
   * @param dispatch
   * @param state
   * @param dataSourceId
   */
  async [ReportAction.GETPUBLICREPORT]({ commit, dispatch, state }, dataSourceId: string) {},
  /**
   * 获取数据源
   * @param state
   * @param dispatch
   * @param dataSourceId
   */
  async [ReportAction.LOADDATASOURCE]({ commit, dispatch, state }, dataSourceId: string) {
    const id = dataSourceId || state.dataSourceId;
    // AI分析数据权限和个人保持一致
    const type = state.activeTab === TabState.PUBLIC ? "public" : "private";
    return new Promise<any>((resolve, reject) => {
      analysisApi
        .getDataSource(id,type)
        .then((res: Array<H3.DashboardAPI.SchemaModel>) => {
          res.forEach((schema: H3.ReportAPI.SchemaModel) => {
            state.dataSources[schema.schema.dataSourceId] = {
              dataSourceId: schema.schema.dataSourceId,
              displayName: schema.schema.displayName,
              properties: handleSchemaModal(schema),
              relationsFields: schema.relationFields
            };
            // 匹配字段的新名称
            handleChartFieldDefaultValues(state.charts, state.dataSources);

            // 如果有全局筛选条件没有设置的 就重新计算全局筛选条件
            if (state.originalFilters && state.originalFilters.length > 0) {
              commit(ReportMutation.SETGLOBALFILTER, state.originalFilters);
              state.originalFilters = [];
            }
            state.globalFilters = handleGlobalFilter(
              state.globalFilters,
              state.dataSources[state.dataSourceId]
            );
          });
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },
  /**
   * 获取图表数据
   * @param commit
   * @param state
   * @param chart
   */
  async [ReportAction.GETCHARTDATA]({ dispatch, state }, chart: H3.Report.Chart) {
    if (chart.dataSourceId) {
      if (!state.dataSources[chart.dataSourceId]) {
        await dispatch(ReportAction.LOADDATASOURCE, [
          {
            dataSourceId: chart.dataSourceId,
            useType: chart.useType
          }
        ]);
      }
      return state.dataSources[chart.dataSourceId];
    }
    return null;
  },
  /**
   * 保存所有图表
   * @param state
   * @param charts
   */
  async [ReportAction.SAVECHARTS]({ state }, charts: Array<H3.Report.Chart>) {
    // 可以吧当前激活的报表的uid存储，如果没有guid那么就在第一次保存的时候生成
    // 一个模块的新建图表的时候第一次需要调取保存所有图表的接口并生成guid作为报表id 并且作为图表的父id
    const postCharts: Array<any> = [];
    charts.forEach(chart => {
      postCharts.push({
        content: chart,
        corpId: state.corpId,
        objectId: chart.uid,
        parentObjectId: state.objectId
      });
    });
    const report = {
      attributes: "",
      charts: postCharts,
      corpId: state.corpId,
      dataSourceId: state.dataSourceId,
      global: "",
      objectId: state.objectId,
      ownerId: state.ownerId,
      shareStatus: state.activeTab,
      updateUser: state.ownerId,
      updateUserName: state.config.updateUserName ? state.config.updateUserName : state.ownerId
    };
    return new Promise<any>((resolve, reject) => {
      analysisApi
        .saveCharts(report)
        .then(res => {
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  /**
   * 保存图表
   * @param state
   * @param dispatch
   * @param chart
   */
  async [ReportAction.SAVECHART]({ dispatch, state }, chart: H3.Report.Chart) {
    // 第一次保存的时候如果报表没有datasourceID 就吧当前的id
    if (!chart.dataSourceId) {
      chart.dataSourceId = state.dataSourceId;
    }
    console.log("保存的chart ==", chart);
    const saveChartData = {
      content: chart,
      corpId: state.corpId,
      dataSourceId: state.dataSourceId,
      objectId: chart.uid,
      parentObjectId: state.objectId,
      updateUser: state.ownerId,
      updateUserName: state.config.updateUserName ? state.config.updateUserName : state.ownerId // 从氚云拿
    };
    return new Promise<any>((resolve, reject) => {
      analysisApi
        .saveChart(saveChartData)
        .then(res => {
          // 保存单个图表以后更新备份图表配置
          state.backupActiveChart = chart;
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  /**
   * 删除图表（单个或批量）
   * @param state
   * @param dispatch
   * @param objectId
   */
  [ReportAction.REMOVECHART]({ dispatch, state }, objectId: string | Array<string>) {
    if (typeof objectId == "string") {
      const chartIndex = state.charts.findIndex((chart: H3.Report.Chart) => chart.uid === objectId);
      if (chartIndex > -1) {
        return new Promise((resolve, reject) => {
          analysisApi[AnalysisApis.REMOVECHART](objectId)
            .then(res => {
              if (res) {
                // 同步图表个人信息,delete监听不到，多做了步设置
                Vue.set(state.chartsInfo, state.charts[chartIndex].uid, {});
                delete state.chartsInfo[state.charts[chartIndex].uid];
                state.charts.splice(chartIndex, 1);
                resolve(res);
              } else {
                reject(false);
              }
            })
            .catch(res => {
              reject(res);
            });
        });
      }
    } else {
      if (objectId.length) {
        return new Promise((resolve, reject) => {
          // todo
          analysisApi[AnalysisApis.REMOVECHARTS](objectId)
            .then(res => {
              resolve(res);
            })
            .catch(res => {
              reject(res);
            });
        });
      }
    } 
  },
  /**
   * 新增元件
   * @param commit
   * @param state
   * @param elementType 元件类型
   * @param oldElement 旧的元件（是否需要使用旧元件数据）
   */
  [ReportAction.ADDCHART]({ commit, state }, { elementType, oldElement }) {
    return createNewChart(elementType, oldElement);
  },
  /**
   * 获取图表长度
   */
  [ReportAction.GETCHARTSLENGTH]({ commit, state }) {
    return new Promise((resolve, reject) => {
      analysisApi[AnalysisApis.GETCHARTSLENGTH](state.dataSourceId, state.ownerId)
        .then(res => {
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  /**
   * 获取公共图表长度
   */
  [ReportAction.GETPUBLICCHARTSLENGTH]({ commit, state }) {
    return new Promise((resolve, reject) => {
      analysisApi[AnalysisApis.GETPUBLICCHARTSLENGTH](state.dataSourceId, state.ownerId)
        .then(res => {
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  
  /**
   * 保存排序
   * @param commit
   * @param chart
   * @param content 个人信息
   */
  [ReportAction.SAVEOWNERCHART]({ commit, state }, { chart, content }) {
    const data = {
      chartId: chart.uid,
      content: content,
      corpId: state.corpId,
      ownerId: state.ownerId
    };
    // 同步图表个人信息
    if (state.chartsInfo[chart.uid]) {
      state.chartsInfo[chart.uid].content = content;
    }
    return new Promise((resolve, reject) => {
      analysisApi[AnalysisApis.SAVEOWNERCHART](data)
        .then(res => {
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  /**
   * 更新元件
   * @param commit
   * @param state
   * @param elementType 元件类型
   * @param oldElement 旧的元件（是否需要使用旧元件数据）
   */
  [ReportAction.UPDATECHART]({ commit, state }, { elementType, oldElement }) {
    const chart = createNewChart(elementType, oldElement);
    state.activeChart = chart;
    return chart;
  },
  
  /**
   * 同时获取公共和个人信息
   */
  [ReportAction.GETPRIVATEANDPUBLISH]({ commit, state }) {
    if(!state.privateObjectId) {
      analysisApi
      .getReportInfo(state.dataSourceId, state.ownerId, 0)
      .then((res: H3.AnalysisAPI.reportInfo) => {
        state.privateObjectId = res.objectId;
      })
    }
    if(!state.publicObjectId) {
      analysisApi
      .getReportInfo(state.dataSourceId, state.ownerId, 1)
      .then((res: H3.AnalysisAPI.reportInfo) => {
        state.publicObjectId = res.objectId;
      })
    }  
  },

  /**
   * 
   * @param charts: [] 需要保存的图表数组
   * @param status : 是保存至公共还是还是个人
   */
  [ReportAction.ADDAICHARTS]({commit, state}, {charts, status}) {
    let sendCharts: any = [];
    
    //保存图表时, 公共和个人不一致
    const parentObjectId = state[`${status}ObjectId`];
    if (charts && charts.length && parentObjectId) {
      let copyCharts = JSON.parse(JSON.stringify(charts)) || [];
      copyCharts.forEach(ochart => {
        ochart.uid = guid();
        ochart.i = new Date().getTime();
        const newChart: any = {
          content: ochart,
          corpId: state.corpId,
          dataSourceId: state.dataSourceId,
          objectId: ochart.uid,
          parentObjectId: parentObjectId,
          updateUser: state.ownerId,
          updateUserName: state.config.updateUserName ? state.config.updateUserName : state.ownerId // 从氚云拿
        };
        sendCharts.push(newChart);
      })
    }
    return new Promise<any>((resolve, reject) => {
      analysisApi
        .addCharts(sendCharts)
        .then(res => {
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  
  /**
   * 
   * @param text  Ai对话内容
   * @param dataSourceId  高级数据源Id
   */
  [ReportAction.AICHAT]({ commit, state }, options) { 
    return new Promise((resolve, reject) => {
      analysisApi
        .aiChat(options)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default actions;
