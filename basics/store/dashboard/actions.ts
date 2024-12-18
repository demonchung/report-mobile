import { ActionTree } from "vuex";
import { ReportProState } from ".";
import { dashboardApi } from "../../service/dashboard/index";
import { ReportAction, ReportMutation } from "./types";
import InitGlobal from "../../instance/modules/global";
import {
  handleSchemaModal,
  transformFilter,
  transformPostCharts,
  checkChartMethod,
  changeFormat
} from "./help";
import { guid } from "../../utils/uid";
import { dateCNFormat } from "../../utils/date";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { ReportState } from "@h3/report-mobile/basics/enum/report-state";
import {
  handleChartFieldDefaultValues,
  registerElement,
  handleReportResponse,
  handleChartConstruction,
  getRelationChart
} from "../utils/help";
import { paintsProDash, ThemeType } from "@h3/report-mobile/basics/enum/paint";
import { ModuleState } from "@h3/report-mobile/basics/enum/module-state";
import { filter } from "vue/types/umd";
import { sqlParamsToFilter, filterToSqlParams } from "@h3/report-mobile/basics/utils/sqlParamsToFilter";
let loadReportList: any = {};

const actions: ActionTree<ReportProState, ReportProState> = {
  /**
   * 保存报表
   * @param commit
   * @param state
   * @param chartType
   */
  async [ReportAction.SAVEREPORT]({ commit, dispatch, state }) {
    const charts: Array<any> = [];
    const filterPickers: Array<H3.Report.FilterPicker> = [];
    if (!state.title) {
      state.title = "未命名的仪表盘";
    }
    state.charts.forEach((chart: H3.Report.Chart) => {
      if (chart.type === ElementType.FILTERPICKER) {
        filterPickers.push(chart as any);
      }
      chart.handleActive = false;
      delete chart.linkageFilter;
      delete chart.layerFilter;
      delete chart.filterPicker;
      // 明细表的分页信息 不保存
      // delete chart.pageSize;
      delete chart.pageIndex;
      delete chart.mapSource;
      if (chart.edit) {chart.edit = false;}
      charts.push({
        uuid: chart.uid,
        content: JSON.stringify(chart),
        corpId: state.corpId,
        objectId: state.objectId
      });
    });
    const report: H3.Report.Report = {
      objectId: state.objectId,
      title: state.title,
      attributes: "{}",
      charts,
      global: JSON.stringify(state.global)
    };
    filterPickers.forEach((filterPicker: H3.Report.FilterPicker) => {
      dispatch(ReportAction.SETFILTERPICKER, { filterPicker, isRefresh: false });
    });
    return dashboardApi.saveReport(report);
  },
  /**
   * 生成新报表
   * @param commit
   * @param state
   * @param chartType
   */
  async [ReportAction.GENERATEREPORT]({ commit, dispatch, state }) {
    const charts: Array<any> = [];
    if (!state.title) {
      state.title = "未命名的仪表盘";
    }
    const report: H3.Report.Report = {
      objectId: state.objectId,
      title: state.title,
      attributes: "{}",
      global: JSON.stringify(state.global)
    };
    return dashboardApi.generateReport(report);
  },
  /**
   * 处理埋点接口
   * @param commit
   * @param state
   */
  async [ReportAction.LOGTRACE]({ commit, dispatch, state }) {
    const logs: Array<any> = [];

    return dashboardApi.logTrace(logs);
  },

  /**
   * 新增元件
   * @param commit
   * @param state
   * @param elementType 元件类型
   * @param oldElement 旧的元件（是否需要使用旧元件数据）
   */
  [ReportAction.ADDELEMENT]({ commit, state }, { elementType, oldElement }) {
    return registerElement(elementType, oldElement);
  },

  async [ReportAction.GETFILTERREPORT]({ commit, dispatch, state }, { corpId, objectId, type }) {
    if (objectId) {
      return new Promise((resolve, reject) => {
        dashboardApi
          .getFilterReport(corpId, objectId, state.langType)
          .then((res: H3.DashboardAPI.ReportData) => {
            resolve(res);
          })
          .catch(res => {
            reject(res);
          });
      });
    }
  },
  /**
   * 获取仪表盘配置信息
   * @param commit
   * @param dispatch
   * @param state
   * @param corpId
   * @param reportId
   * @param type
   */
  async [ReportAction.GETREPORT]({ commit, dispatch, state }, { corpId, reportId, type }) {
    if (reportId) {
      return new Promise((resolve, reject) => {
        loadReportList[reportId] = loadReportList[reportId] || [];
        dashboardApi.setConfig({ corpId });
        dashboardApi
          .getReport(corpId, reportId, state.langType)
          .then((res: H3.DashboardAPI.ReportData) => {
            const {
              title,
              objectId,
              elements,
              reqGlobal,
              schemaCodes,
              filterPickers,
              globalFilters,
              chartRelations
            } = handleReportResponse(res);
            const { global, modules } = InitGlobal(
              (JSON.parse(reqGlobal as string) as H3.Report.Global) ||
                (JSON.parse(JSON.stringify(state.global)) as H3.Report.Global)
            );
            elements.forEach(element => {
              element.__key__ = guid();
              if (element.jumpingRules) {
                const jumpLinkArr = JSON.parse(element.jumpingRules || "[]");
                element.styles.jumpLink = Array.isArray(jumpLinkArr) ? jumpLinkArr : [];
                delete element.jumpingRules; //多余的
              }
              state.chartViewStatus[element.uid] = state.chartViewStatus[element.uid] || {};
              if (element.data && element.data.innerFilter) {
                element.data.innerFilter.forEach(filter => {
                  if (filter.field.type === "date" && filter.text) {
                    const date: string = filter.text[0];
                    const a = RegExp(/:/);
                    if (filter.field.options.format === "YMDHMS" && !a.test(date)) {
                      filter.field.options.format = "YMD";
                    }
                  }
                });
              }
            });
            state.globalFilters = transformFilter(globalFilters);
            const saveAttributes = true;
            dispatch(ReportAction.UPDATEGLOBALFILTERS, {saveAttributes, corpId, reportId })
            .then(() => {
              state.globalFilters.forEach((filterPicker: H3.Report.FilterPicker) => {
                dispatch(ReportAction.SETFILTERPICKER, { filterPicker, charts: elements });
              });
            })
            .catch(() => {
              reject(false);
            });
            filterPickers.forEach((filterPicker: H3.Report.FilterPicker) => {
              dispatch(ReportAction.SETFILTERPICKER, { filterPicker, charts: elements });
            });
            filterPickers.forEach((cfilter, index) => {
              if (cfilter && cfilter.field && cfilter.field.type === "date") {
                cfilter = changeFormat(cfilter);
              }
            });
            commit(ReportMutation.SETRELATIONCHART, chartRelations);
            // 有图表筛选器（旧数据转换）
            if (globalFilters.length) {
              // chartFilterPickers.forEach((item)=> {
              //   dispatch(ReportAction.REMOVESINGLECHART, item.uid);
              // });
              // dispatch(ReportAction.SETATTRIBUTES, { globalFilters: filterPickers });
            }
            state.globalModules = modules;
            state.global = global;
            state.reports[reportId] = {
              elements,
              global,
              title
            };
            // 处理请求之后的⌚️
            const handleLoaded = () => {
              //判断当前加载的报表配置信息是否被多个单例图表引用，如果引用调用回调函数执行方法
              while (loadReportList[reportId] && loadReportList[reportId].length) {
                loadReportList[reportId].shift()(state.reports[reportId]);
              }
              delete loadReportList[reportId];
              handleChartFieldDefaultValues(elements, state.dataSources);
              state.reports[reportId] = {
                elements,
                global,
                title,
                url: res.url,
                traceId: res.traceId
              };
              state.title = title;
              state.objectId = objectId;
              state.charts.push(...elements);
              elements.forEach(element => {
                commit(ReportMutation.CLEARCHARTSRELATION, element);
              });
              resolve(state.reports[reportId]);
            };
            // if (Object.values(schemaCodes).length) {
            //   dispatch(ReportAction.LOADDATASOURCE, Object.values(schemaCodes))
            //     .then(() => {
            //       handleLoaded();
            //     })
            //     .catch(() => {
            //       reject(false);
            //     });
            // } else {
            handleLoaded();
            // }
          })
          .catch(res => {
            if (loadReportList[reportId]) {
              loadReportList[reportId] = null;
            }
            reject(res);
          });
      });
    } else {
      state.title = "未命名的仪表盘";
      state.objectId = `u${guid()}`.replace(/-/gi, "");
      return null;
    }
  },
  /*
  * 获取转换后的仪表盘配置信息--用于迁移氚云旧报表的功能
  */
 async [ReportAction.GETCONVERTREPORT]({ commit, dispatch, state }, { corpId, reportCode }) {
   if (reportCode) {
     return new Promise((resolve, reject) => {
       dashboardApi
         .getConvertReport(corpId, reportCode, state.langType)
         .then((res: H3.DashboardAPI.ConvertModel) => {
           if (res.chartPage) {
             const {
               title,
               objectId,
               elements,
               reqGlobal,
               schemaCodes,
               filterPickers,
               globalFilters,
               chartRelations
             } = handleReportResponse(res.chartPage);
             const { global, modules } = InitGlobal(
               (JSON.parse(reqGlobal as string) as H3.Report.Global) ||
                 (JSON.parse(JSON.stringify(state.global)) as H3.Report.Global)
             );
             elements.forEach(element => {
               element.__key__ = guid();
               state.chartViewStatus[element.uid] = state.chartViewStatus[element.uid] || {};
               if (element.data && element.data.innerFilter) {
                 element.data.innerFilter.forEach((filter: any) => {
                   if (filter.field.type === "date" && filter.text) {
                     const date: string = filter.text[0];
                     const a = RegExp(/:/);
                     if (filter.field.options.format === "YMDHMS" && !a.test(date)) {
                       filter.field.options.format = "YMD";
                     }
                   }
                 });
               }
             });
             state.globalFilters = transformFilter(globalFilters);
              const saveAttributes = false;
             dispatch(ReportAction.UPDATEGLOBALFILTERS, {saveAttributes, corpId, reportCode })
            .then(() => {
              state.globalFilters.forEach((filterPicker: H3.Report.FilterPicker) => {
                dispatch(ReportAction.SETFILTERPICKER, { filterPicker, charts: elements });
              });
            })
            .catch(() => {
              reject(false);
            });
            filterPickers.forEach((filterPicker: H3.Report.FilterPicker) => {
              dispatch(ReportAction.SETFILTERPICKER, { filterPicker, charts: elements });
            });
            filterPickers.forEach((cfilter, index) => {
              if (cfilter && cfilter.field && cfilter.field.type === "date") {
                cfilter = changeFormat(cfilter);
              }
            });
            commit(ReportMutation.SETRELATIONCHART, chartRelations);
             state.globalModules = modules;
             state.global = global;
             // 处理请求之后的⌚️
             const handleLoaded = () => {
               handleChartFieldDefaultValues(elements, state.dataSources);
               state.title = title;
               state.objectId = objectId;
               state.charts.push(...elements);
               elements.forEach(element => {
                 commit(ReportMutation.CLEARCHARTSRELATION, element);
               });
             };
             handleLoaded();
             resolve(res);
           }
         })
         .catch(res => {
           reject(res);
         });
     });
   } else {
     
     return null;
   }
 },

  /**
   * 请求数据源接口检验动态参数更新状态，同时更新全局筛选器
   */
  async [ReportAction.UPDATEGLOBALFILTERS]({ commit, dispatch, state },{saveAttributes, corpId, reportId}) {
    // 将全局筛选器按数据源id分组
    const groupedFilters: { [dataSourceId: string]: Array<H3.Report.GlobalFilter> } = {};

    state.globalFilters.forEach((gFilter: H3.Report.GlobalFilter) => {
      const dataSourceId = gFilter.dataSources[0].dataSourceId;
      groupedFilters[dataSourceId] = groupedFilters[dataSourceId] || [];
      if(gFilter.dataSources.length === 1 &&
        gFilter.dataSources[0].sqlParams &&
        gFilter.dataSources[0].sqlParams === 1) {
          groupedFilters[dataSourceId].push(gFilter);
        }
    });
    // 先把groupedFilters中值为为空数组或者为undefined的key删除
    Object.keys(groupedFilters).forEach((key) => {
      if (!groupedFilters[key].length) {
        delete groupedFilters[key];
      }
    });
    // 数据源id获取数据源，先从state获取，如果找不到数据源的id存储为数组请求LOADDATASOURCE接口更新state的dataSources
    const dataSourceIds = Object.keys(groupedFilters).filter((key) => !state.dataSources[key]);

    if (dataSourceIds.length) {
      const dataSourceIdPayloads = dataSourceIds.map((dataSourceId) => ({
        dataSourceId,
        useType: 100, // 由于动态参数仅存在Sql数据源，所以useType为100
      }));
      const orignFilters = JSON.parse(JSON.stringify(state.globalFilters));
      await dispatch(ReportAction.LOADDATASOURCE, dataSourceIdPayloads).then(() => {
        // 调用mutation更新全局筛选器
        dispatch(ReportAction.UPDATESQLPARAMS).then(() => {
          const newFilters = JSON.parse(JSON.stringify(state.globalFilters));
          // 调用方法保存数据
          if (saveAttributes && JSON.stringify(orignFilters) !== JSON.stringify(newFilters)) {
            dispatch(ReportAction.SETATTRIBUTES, {
              globalFilters: state.globalFilters
            }).then(() => {});
          }
        })
      });
    }

  },
  /**
   * 
   */
  async [ReportAction.UPDATESQLPARAMS]({ commit, dispatch, state }){
    const chartIdsMap = {};

    state.globalFilters.forEach((filter, index) => {
      if (filter.dataSources.some((item) => item.sqlParams && item.sqlParams === 1)) {
        const dataSourceId = filter.dataSources[0].dataSourceId;
        chartIdsMap[dataSourceId] = filter.chartIds || [];
        const dataSource = state.dataSources[dataSourceId];
        if (dataSource) {
          const sqlParams = JSON.parse(JSON.stringify(dataSource.sqlParams)) || [];
          const sqlParam = sqlParams.find((item) => filter.field && item.field === filter.field.field && item.dataType === filter.field.dataType);

          if (!sqlParam) {
            state.globalFilters = state.globalFilters.filter((item) => item.uid !== filter.uid);
          }
        }
      }
    });

    Object.keys(chartIdsMap).forEach((dataSourceId) => {
      const chartIds = chartIdsMap[dataSourceId];
      const dataSource = state.dataSources[dataSourceId];

      if (dataSource) {
        const sqlParams = JSON.parse(JSON.stringify(dataSource.sqlParams)) || [];

        sqlParams.forEach((sqlParam) => {
          const filterExists = state.globalFilters.some((item) => 
            item.field && 
            item.field.field === sqlParam.field && 
            item.dataSources[0].dataSourceId === dataSourceId
          );

          if (!filterExists) {
            const createFilter = sqlParamsToFilter(sqlParam, dataSource);
            createFilter.chartIds = [...chartIds];
            state.globalFilters.push(createFilter);
          }
        });
      }
    });
  },
  /**
   * 获取仪表盘明细
   * @param commit
   * @param dispatch
   * @param state
   * @param corpId
   * @param reportId
   * @param type
   */
  async [ReportAction.GETREPORTDETAIL](
    { commit, dispatch, state },
    { corpId, reportId, type = ReportState.DESIGN }
  ) {
    let res;
    // 判断是否有加载完毕的报表配置
    if (state.reports[reportId]) {
      res = state.reports[reportId];
    }
    // 判断是否有加载中的报表配置
    else if (loadReportList[reportId]) {
      return new Promise<any>((resolve, reject) => {
        loadReportList[reportId].push(resolve);
      });
    } else {
      return new Promise<any>((resolve, reject) => {
        dispatch(ReportAction.GETREPORT, { corpId, reportId, type })
          .then(result => {
            resolve(result);
          })
          .catch(() => {
            resolve(false);
          });
      });
    }
    return res;
  },

  async [ReportAction.GETCHARTS]({ state }, objectIds: Array<string>) {
    return new Promise((resolve, reject) => {
      dashboardApi
        .getCharts(objectIds, state.langType)
        .then(res => {
          if (res && res[0]) {
            let element: H3.Report.BaseElement = handleChartConstruction(res[0], 0);
            if (element.formulas) {
              element.formulas = JSON.parse(element.formulas) || [];
            }
            element = registerElement(element.type, element);
            const id = element.objectId || "";
            state.singleChartsMap[id]
              ? state.singleChartsMap[id].push(element)
              : (state.singleChartsMap[id] = [element]);
            resolve(element);
          } else {
            resolve(null);
            //reject(res);
          }
        })
        .catch(res => {
          reject(res);
        });
    });
  },
  /**
   * 获取数据源列表
   * @param state
   * @param dispatch
   * @param corpId
   */
  async [ReportAction.GETDATASOURCELIST]({ dispatch, state }) {
    if (!state.dataSourceList) {
      await dashboardApi
        .getSourceList(state.langType)
        .then((res: Array<H3.DashboardAPI.DataSourceNode>) => {
          state.dataSourceList = res;
        })
        .catch(() => {
          state.dataSourceList = [];
        });
    }
    return state.dataSourceList;
  },
  async [ReportAction.GETADVANCEDLIST]({ dispatch, state }) {
    if (!state.advancedList) {
      await dashboardApi
        .getAdvancedList(state.langType)
        .then((res: Array<H3.DashboardAPI.DataSourceNode>) => {
          state.advancedList = res;
        })
        .catch(() => {
          state.advancedList = [];
        });
    }
    return state.advancedList;
  },
  /**
   * 获取数据源
   * @param state
   * @param dispatch
   * @param chart
   */
  async [ReportAction.GETDATASOURCE]({ dispatch, state }, chart: H3.Report.Chart) {
    if (chart.dataSourceId) {
      if (!state.dataSources[chart.dataSourceId]) {
        await dispatch(ReportAction.LOADDATASOURCE, [
          {
            dataSourceId: chart.dataSourceId,
            useType: chart.useType
          }
        ]);
      }
      const mainTable = state.dataSources[chart.dataSourceId].mainTable || "";
      if (state.activeChartLayers && state.activeChartLayers.length) {
        state.activeChartLayers.forEach(item => {
          item.mainTable = mainTable;
        });
      }
      chart.mainTable = mainTable;
      return state.dataSources[chart.dataSourceId];
    }
    return null;
  },
  /**
   * 获取数据源
   * @param state
   * @param dispatch
   * @param dataSourceIds
   */
  async [ReportAction.LOADDATASOURCE]({ dispatch, state }, dataSourceIds: Array<any>) {
    return new Promise<any>((resolve, reject) => {
      dashboardApi
        .getDataSource(dataSourceIds, state.langType)
        .then((res: Array<H3.DashboardAPI.SchemaModel>) => {
          res.forEach((schema: H3.ReportAPI.SchemaModel) => {
            state.dataSources[schema.schema.dataSourceId] = {
              dataSourceId: schema.schema.dataSourceId,
              displayName: schema.schema.displayName,
              mainTable: schema.schema.tableName,
              properties: handleSchemaModal(schema),
              relationsFields: schema.relationFields,
              dynamicParams: schema.dynamicParams,
              sqlParams: schema.sqlParams
            };
          });
          resolve(true);
        })
        .catch(res => {
          if(dataSourceIds && dataSourceIds[0]&& dataSourceIds[0].dataSourceId) {
            (state.dataSources[dataSourceIds[0].dataSourceId] as any) = null;
          }
          reject(res.code);
        });
    });
  },
  /**
   * 设置图表联动
   * @param state
   * @param dispatch
   * @param chart
   * @param filters H3.Report.FilterFieldColumn
   * @param mode  params: linkage clear
   */
  [ReportAction.SETCHARTLINKAGE](
    { commit, dispatch, state },
    { chart, filters = [], mode = "linkage", charts = null }
  ) {
    let res = false;
    if (mode === "linkage") {
      if (!state.linkage[chart.uid]) {state.linkage[chart.uid] = {};}
      if (chart.layerActiveIndex) {
        state.linkage[chart.uid][chart.layerActiveIndex] = "filter";
      } else {
        state.linkage[chart.uid]['0'] = "filter";
      }
      res = true;
    } else {
      if (JSON.stringify(state.linkage[chart.uid]) === "{}") {
        delete state.linkage[chart.uid];
      }
      if (state.linkage[chart.uid]) {
        if (chart.layerActiveIndex) {
          if (state.linkage[chart.uid][chart.layerActiveIndex]) {
            delete state.linkage[chart.uid][chart.layerActiveIndex];
            res = true;
          }
        } else {
          if (state.linkage[chart.uid]['0']) {
            delete state.linkage[chart.uid]['0'];
            res = true;
          }
        }
      }
    }
    // filters.forEach((filter: H3.Report.FilterFieldColumn) => {
    //   if (filter.field.type == "date") {
    //     filter.text = dateCNFormat(filter.text[0]);
    //     filter.formula = "Range";
    //   }
    // });
    if (res) {
      (charts || state.charts).forEach((linkageChart: H3.Report.Chart) => {
        if (chart.styles.linkage && chart.styles.linkage.includes(linkageChart.uid)) {
          //commit(ReportMutation.DELETELINKFILTER, { chart: linkageChart ,index, filters});
          let newfilter: any = [];
          if (filters && filters.length) {
          newfilter =  filters.filter(linkfilter => (!linkfilter.field.options.isComputeField));
          }
          linkageChart.linkageFilter = newfilter;
            commit(ReportMutation.RESIZECHARTVIEW, { chart: linkageChart, type: "data" });
        }
      });
    }
    return res || false;
  },
  /**
   * 设置下钻联动
   * 重要说明  ========== 更新始终是通过父chart更新，只是动态更换父chart内部数据
   */
  [ReportAction.SETCHARTLAYERLINK](
    { commit, dispatch, state },
    { chart, filters = [], activeIndex, type }
  ) {
    // filters.forEach((filter: H3.Report.FilterFieldColumn) => {
    //   if (filter.field.type == "date") {
    //     filter.text = dateCNFormat(filter.text[0]);
    //     filter.formula = "Range";
    //   }
    // });
    const chartIndex = type == "next" ? chart.layerActiveIndex + 1 || 1 : activeIndex;
    const chartId = chart.uid;
    // console.log(state.activeChartLayers,'state.activeChartLayers==')
    const layerFilter = chart.layerFilter.concat(filters);
    const nowChart = state.chartRelations[chartId]
      ? state.chartRelations[chartId][chartIndex]
      : null;
    if (!nowChart) {return;}
    nowChart.filterPicker = chart.filterPicker;
    const changeTargetChart = {
      ...chart,
      customSort: nowChart.customSort,
      layerFilter: layerFilter,
      type: nowChart.type,
      styles: nowChart.styles,
      filterPicker: nowChart.filterPicker,
      data: nowChart.data,
      layerActiveIndex: chartIndex,
      conditionFormats: nowChart.conditionFormats,
    };
    // 修改定时器 存在就更新，否则就删除
    const time = nowChart.data.timer ? nowChart.data.timer.time : null;
    if (time && state.fullStatus === ModuleState.FULLSCREEN) {
      commit(ReportMutation.SETCHARTINTERVAL, changeTargetChart);
    } else {
      commit(ReportMutation.CLEARCHARTINTERVAL, chartId);
    }
    if (checkChartMethod(changeTargetChart)) {
      commit(ReportMutation.UPDATELAYERFILTER, changeTargetChart);
      commit(ReportMutation.RESIZECHARTVIEW, { chart: chart, type: "data" });
      commit(ReportMutation.UPDATETABMAPPING, {state});
    }
  },
  /**
   *  设计时下钻设置
   */
  [ReportAction.SETDESIGNLAYERLINK](
    { commit, dispatch, state },
    { chart, filters = [], activeIndex, type }
  ) {
    // filters.forEach((filter: H3.Report.FilterFieldColumn) => {
    //   if (filter.field.type == "date") {
    //     filter.text = dateCNFormat(filter.text[0]);
    //     filter.formula = "Range";
    //   }
    // });
    const chartIndex =
      type == "next"
        ? state.activeChartLayers.findIndex(c => c.uid === chart.uid) + 1
        : activeIndex;
    const layerFilter = chart.layerFilter.concat(filters);
    const nowChart = state.activeChartLayers[chartIndex];
    if (!nowChart) {return;}
    nowChart.layerFilter = layerFilter;
    nowChart.filterPicker = chart.filterPicker;
    commit(ReportMutation.SETACTIVECHART, nowChart);
  },
  /**
   * 设置筛选器
   * @param dispatch
   * @param state
   * @param filterPicker
   * @param charts
   */
  [ReportAction.SETFILTERPICKER](
    { commit, state },
    { filterPicker, charts = state.charts, isRefresh = true }
  ) {
    const filters: { [dataSoureId: string]: Array<H3.Report.FilterFieldColumn> } = {};
    // 获取每个源的筛选字段
    filterPicker.dataSources.forEach((filterDataSource: any) => {
      if (filterDataSource.field) {
        filters[filterDataSource.dataSourceId] = filters[filterDataSource.dataSourceId] || [];
        if (
          ["None", "NotNone", "Dynamic"].includes(filterPicker.formula) ||
          (filterPicker.formula === "Range" && filterPicker.text[0] && filterPicker.text[1]) ||
          (filterPicker.formula !== "Range" && filterPicker.text[0])
        ) {
          //自定义排序
          if (filterPicker.formula === "Dynamic") {
            if (filterPicker.text.length === 2) {
              if (filterPicker.text[0] !== null || filterPicker.text[1] !== null) {
                filters[filterDataSource.dataSourceId].push({
                  field: filterDataSource.field,
                  formula: filterPicker.formula,
                  text:
                    filterPicker.text[0] && filterPicker.text[0] instanceof Object
                      ? filterPicker.text.map(item => item.value)
                      : filterPicker.text,
                  operation: filterPicker.operation //处理 不等于
                });
              }
            }
          } else {
            filters[filterDataSource.dataSourceId].push({
              field: filterDataSource.field,
              formula: filterPicker.formula,
              text:
                filterPicker.text[0] && filterPicker.text[0] instanceof Object
                  ? filterPicker.text.map(item => item.value)
                  : filterPicker.text,
              operation: filterPicker.operation //处理 不等于
            });
          }
        }
      }
    });
    // 设置每个图表对应源的过滤字段
    filterPicker.chartIds.forEach((chartId: string) => {
      const chart = charts.find((item: H3.Report.Chart) => item.uid === chartId) as H3.Report.Chart;
      if (chart && !chart.filterPicker) {
        chart.filterPicker = {};
      }
      if (chart && chart.filterPicker) {
        chart.filterPicker[filterPicker.uid] = chart.dataSourceId
          ? filters[chart.dataSourceId]
            ? filters[chart.dataSourceId]
            : []
          : [];
        if (isRefresh) {
          commit(ReportMutation.RESIZECHARTVIEW, { chart, type: "data" });
        }
      }
    });
  },
  /**
   * 删除筛选器条件
   * @param dispatch
   * @param state
   * @param filterPicker
   */
  [ReportAction.REMOVEFILTERPICKER]({ commit, state }, filterPicker: H3.Report.FilterPicker) {
    filterPicker.chartIds.forEach((chartId: string) => {
      const chart = state.charts.find(
        (item: H3.Report.Chart) => item.uid === chartId
      ) as H3.Report.Chart;
      if (chart && chart.filterPicker) {
        if (chart.filterPicker[filterPicker.uid] && chart.filterPicker[filterPicker.uid].length) {
          chart.filterPicker[filterPicker.uid] = [];
          commit(ReportMutation.RESIZECHARTVIEW, { chart, type: "data" });
        }
      }
    });
  },
  /**
   * 删除仪表盘
   * @param dispatch
   * @param state
   */
  [ReportAction.REMOVEREPORT]({ commit, state }, { corpId, reportId, type }) {
    dashboardApi.removeReport(corpId, reportId, state.langType).then(res => {
      // 删除仪表盘之后的操作
    });
  },
  /**
   * 通过id设置当前激活的图表
   * @param state
   * @param id 图表id
   */
  [ReportAction.SETACTIVECHARTID]({ commit, state }, id) {
    const chart = state.charts.find(c => c.uid === id);
    if (chart) {
      commit(ReportMutation.SETACTIVECHART, chart);
    }
  },
  /**
   * 更新全局筛选器
   * @param state
   * @param globalFilters
   */
  [ReportAction.UPDATEGLOBALFILTER]({ dispatch, state }, { filter, update }) {
    state.globalFilters = filter;
    if (update) {
      dispatch(ReportAction.SETATTRIBUTES, {
        globalFilters: filter
      }).then(() => {});
    }
  },
  /**
   * 保存全局属性
   * @param globalFilters
   */
  [ReportAction.SETATTRIBUTES]({ commit, state }, { globalFilters }) {
    const attributes = {
      globalFilters,
    };
    const strAttributes = JSON.stringify(attributes);
    return new Promise<any>((resolve, reject) => {
      dashboardApi
        .setAttributes(strAttributes, state.objectId, state.langType)
        .then(res => {
          if (res.data) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  },
  /**
   * 删除单个图表
   * @param param0
   * @param chartId 图表uid
   */
  [ReportAction.REMOVESINGLECHART]({ commit, state }, chartId: string) {
    return new Promise<any>((resolve, reject) => {
      dashboardApi
        .removeSingleChart(chartId, state.langType)
        .then((res: H3.DashboardAPI.ChartRealData) => {
          //删除定时器
          commit(ReportMutation.CLEARCHARTINTERVAL, chartId);
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },

  /**
   * 删除单个/多个图表
   * @param param0
   * @param chartId 图表uid
   */
  [ReportAction.BETCHREMOVECHARTS]({ commit, state }, chartIds: Array<string>,) {
    return new Promise<any>((resolve, reject) => {
      dashboardApi
        .betchRemoveChart(chartIds, state.langType)
        .then((res: H3.DashboardAPI.ChartRealData) => {
          //删除定时器
          commit(ReportMutation.CLEARCHARTINTERVAL, chartIds);
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },
  /**
   * 保存单个/或多个图表
   * @param param0
   * @param charts 保存的图表
   */
  [ReportAction.ADDSINGLECHART]({ commit, state }, charts: Array<H3.Report.Chart>) {
    const c: Array<H3.ReportAPI.PostChart> = transformPostCharts(charts, state);
    return new Promise<any>((resolve, reject) => {
      dashboardApi
        .addSingleChart(c, state.langType)
        .then((res: H3.DashboardAPI.ChartRealData) => {
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },
  /**
   * 新增一个或多个图表
   * @param param0
   * @param charts 图表详情
   */
  [ReportAction.UPDATESINGLECHART]({ commit, state }, charts: Array<H3.Report.Chart>) {
    const c: Array<H3.ReportAPI.PostChart> = transformPostCharts(charts, state);
    return new Promise<any>((resolve, reject) => {
      dashboardApi
        .updateSingleChart(c, state.langType)
        .then((res: H3.DashboardAPI.ChartRealData) => {
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },
   /**
   * 新增一个或多个图表
   * @param param0
   * @param charts 图表详情
   */
  [ReportAction.UPDATETABSERVER]({ commit, state }, chartUid) {
    const chart = state.charts.find((item) => item.uid === chartUid);
    if (chart) {
      const c: Array<H3.ReportAPI.PostChart> = transformPostCharts([chart as H3.Report.Tab], state);
      return new Promise<any>((resolve, reject) => {
        dashboardApi
          .updateSingleChart(c, state.langType)
          .then((res: H3.DashboardAPI.ChartRealData) => {
            resolve(true);
          })
          .catch(res => {
            reject(res.code);
          });
      });
    }
  },
  /**
   * 更新图表标题
   * @param chart 更新的图表
   * @param title 更新的
   */
  [ReportAction.UPDATESINGLECHARTTITLE](
    { commit, state },
    { chart, title }: { chart: H3.Report.Chart; title: string }
  ) {
    return new Promise<any>((resolve, reject) => {
      dashboardApi
        .updateChartTitle(chart.uid, title, state.langType)
        .then(() => {
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },
  /**
   * 切换图表类型的操作
   * @param elementType 切换的图表类型
   * @param oldElement 旧的图表参数
   */
  [ReportAction.CHANGECHARTTYPE](
    { commit, dispatch, state },
    {
      elementType,
      oldElement
    }: {
      elementType: ElementType;
      oldElement: H3.Report.Chart;
    }
  ) {
    return dispatch(ReportAction.ADDELEMENT, { elementType, oldElement }).then(newElement => {
      const index = state.charts.findIndex(
        (tChart: H3.Report.Chart) => tChart.uid === oldElement.uid
      );
      if (index > -1) {
        state.charts.splice(index, 1, newElement);
        commit(ReportMutation.SETACTIVECHART, state.charts[index]);
      } else {
        newElement.__key__ = oldElement.__key__;
        commit(ReportMutation.SETACTIVECHART, newElement);
      }
    });
  },
  /**
   * 批量保存移动端布局
   * @param elements 图表参数
   */
  [ReportAction.UPDATEMOBILEOPTIONS](
    { commit, dispatch, state },
    elements: Array<H3.Report.BaseElement>
  ) {
    return new Promise<any>((resolve, reject) => {
      const data = elements.map(e => {
        return {
          objectId: e.uid,
          mobileOptions: JSON.stringify({
            position: {
              x: e.x,
              y: e.y,
              w: e.w,
              h: e.h,
              i: e.i
            },
            visible: (e as any).mobileOptions.visible
          })
        };
      });
      dashboardApi
        .updateMobileOptions(data, state.langType)
        .then(() => {
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },
  /**
   * 批量保存全局布局
   * @param elements 图表参数
   */
  [ReportAction.UPDATEPOSITIONS](
    { commit, dispatch, state },
    elements: Array<H3.Report.BaseElement>
  ) {
    return new Promise<any>((resolve, reject) => {
      const data = elements.map(e => {
        return {
          objectId: e.uid,
          position: JSON.stringify({
            x: e.x,
            y: e.y,
            w: e.w,
            h: e.h,
            i: e.i
          })
        };
      });
      dashboardApi
        .updatePositions(data, state.langType)
        .then(() => {
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },
  /**
   * 切换图表类型的操作
   * @param elementType 切换的图表类型
   * @param oldElement 旧的图表参数
   */
  [ReportAction.UPDATEGLOBALSTYLES]({ commit, dispatch, state }) {
    return new Promise<any>((resolve, reject) => {
      const id = state.objectId;
      const style = JSON.stringify(state.global);

      dashboardApi
        .updateGlobalStyles(id, style, state.langType)
        .then(() => {
          resolve(true);
        })
        .catch(res => {
          reject(res.code);
        });
    });
  },

  /**
   * 切换图表类型的操作
   * @param elementType 切换的图表类型
   * @param oldElement 旧的图表参数
   */
  [ReportAction.UPDATECHARTS]({ commit, dispatch, state }) {
    return new Promise<any>((resolve, reject) => {
      // let id = state.objectId;
      // dashboardApi
      //   .updateGlobalStyles(id, style)
      //   .then(() => {
      //     resolve(true);
      //   })
      //   .catch(res => {
      //     reject(res.code);
      //   });
    });
  },

  /**
   * 设置仪表盘全局设置
   * @param state
   */
  [ReportAction.SETDEFAULTGLOBAL]({ commit, state }) {
    const theme = Object.keys(paintsProDash).map((m) => {
      return Object.assign({}, paintsProDash[m]);
    })[0];
    const newStyle: H3.Report.GlobalCoatGroup = Object.assign({}, state.global.styles, {
      // 仪表盘主题 - 赋值
      paintCoatTheme: "default",
      // 仪表盘背景色 - 赋值
      paintCoat: {
        type: theme.paintCoatType,
        value: theme.paintCoatValue
      },
      // 组件背景色 - 赋值
      elementCoat: {
        type: theme.elementCoatType,
        value: theme.elementCoatValue
      },
      // 字体颜色
      fontSetting: {
        titleColor: theme.titleColor,
        fontColor: theme.fontColor
      }
    });
    const newGlobal: H3.Report.Global = Object.assign({}, state.global, {
      styles: newStyle
    });
    state.global = newGlobal;
    commit(ReportMutation.CHANGEGLOBALTHEME, { theme: "light" });
  },

  async [ReportAction.CHECKCOMPUTE]({ dispatch, state }, { formula, fields }) {
    const compute: H3.DashboardAPI.Compute = {
      expression: formula,
      fieldPrefix: "@@",
      fields: fields
    };
    return dashboardApi.checkCompute(compute, state.langType);
  },

  /**
   * 更新全局动态参数--删除、新增、修改图表组件时调用
   * @param chartUid 图表uid
   * @param currentDataSourceId 当前数据源id
   * @param operateType 操作类型--delete, add, update，copy，需要根据不同的操作类型做不同处理
   * @param parentId 当前图表的父图表id，如果是复制图表，则需要传入父图表id
   */
  [ReportAction.UPDATESQLPARAMSINGLOBAL]({ commit, dispatch, state },{ chartUid, currentDataSourceId, operateType, parentId }) {

    if (!chartUid || !currentDataSourceId) {return;}
    const operate = operateType;
    let globalFilters = JSON.parse(JSON.stringify(state.globalFilters));
    const dataSource = state.dataSources ? state.dataSources[currentDataSourceId] : null;
    switch (operate) {
      case 'delete':
        // 删除图表时，如果该图表的数据源在全局动态参数中存在，则删除该图表uid。如果该数据源的全局动态参数中无图表uid，则删除该全局动态参数。
        globalFilters.forEach((gFilter: H3.Report.GlobalFilter) => {
          if (!gFilter.dataSources || !gFilter.dataSources.length || !gFilter.chartIds || !gFilter.chartIds.length) {
            globalFilters = globalFilters.filter((item: any) => item.uid !== gFilter.uid);
            return;
          }
          const index = gFilter.dataSources.findIndex((item: any) => 
            item.dataSourceId === currentDataSourceId && item.sqlParams && item.sqlParams === 1
          );
          if (index > -1) {
            const chartIndex = gFilter.chartIds.findIndex((item: any) => item === chartUid);
            if (chartIndex > -1) {
              gFilter.chartIds.splice(chartIndex, 1);
            }
            if (!gFilter.chartIds.length) {
              globalFilters = globalFilters.filter((item: any) => item.uid !== gFilter.uid);
            }
          }
        });
        break;
      case 'update':
      case 'add':
        // 新增前如果图表存在过滤的chartIds中，但过滤的数据源与当前数据源不一致，则删除该图表uid
        globalFilters.forEach((gFilter: H3.Report.GlobalFilter) => {
          // 先通过chartIds判断是否该图表已存在过滤器中
          if (!gFilter.dataSources || !gFilter.dataSources.length || !gFilter.chartIds || !gFilter.chartIds.length) {
            globalFilters = globalFilters.filter((item: any) => item.uid !== gFilter.uid);
          } else {
            const chartIndex = gFilter.chartIds.findIndex((item: any) => item === chartUid);
            if (chartIndex > -1) {
              // 再通过数据源id判断是否该图表的数据源与当前数据源一致
              const dataSourceIndex = gFilter.dataSources.findIndex((item: any) => 
              item.dataSourceId === currentDataSourceId);
              if (dataSourceIndex === -1) {
                gFilter.chartIds.splice(chartIndex, 1);

                if (!gFilter.chartIds.length) {
                  globalFilters = globalFilters.filter((item: any) => item.uid !== gFilter.uid);
                }
              }
            }
          }
        });
        // 用数据源id去数据源中查找，有多少个动态参数，就加多少个动态参数，如果已存在，则在chartIds中新增一个图表uid
        if (dataSource && dataSource.sqlParams && dataSource.sqlParams.length) {
          dataSource.sqlParams.forEach((sqlParam: any) => {
            const index = globalFilters.findIndex((item: any) => 
              item.dataSources && 
              item.dataSources.length && 
              item.dataSources.some((s: any) => s.dataSourceId === currentDataSourceId && s.sqlParams && s.sqlParams === 1) &&
              item.field.field === sqlParam.field
            );
            if (index > -1) {
              if (!globalFilters[index].chartIds.includes(chartUid)) { 
                globalFilters[index].chartIds.push(chartUid);
              }
            } else {
              const createFilter = sqlParamsToFilter(sqlParam, dataSource);
              createFilter.chartIds = [chartUid];
              globalFilters.push(createFilter);
            }
          });
        }
        break;
      case 'copy':
        // 遍历globalFilters，如果有哪个筛选器的chartIdS中包含parentId，且数据源id与当前数据源id一致，且sqlParams为1，则添加chartUid
        globalFilters.forEach((gFilter: H3.Report.GlobalFilter) => {
          if (gFilter.chartIds && gFilter.chartIds.length) {
            const chartIndex = gFilter.chartIds.findIndex((item: any) => item === parentId);
            if (chartIndex > -1) {
              if (gFilter.dataSources && gFilter.dataSources.length) {
                const dataSourceIndex = gFilter.dataSources.findIndex((item: any) => item.dataSourceId === currentDataSourceId && item.sqlParams && item.sqlParams === 1);
                if (dataSourceIndex > -1) {
                  if (!gFilter.chartIds.includes(chartUid)) { 
                    gFilter.chartIds.push(chartUid);
                  }
                }
              }
            }
          }
        });
        break;
      default:
        break;
    }

    state.globalFilters = globalFilters;
    // 调用方法保存数据
    dispatch(ReportAction.SETATTRIBUTES, {
      globalFilters: globalFilters
    }).then(() => {});
  }
};

export default actions;
