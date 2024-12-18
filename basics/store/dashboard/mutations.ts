import Vue from "vue";
import { MutationTree } from "vuex";
import { ReportProState } from ".";
import { ReportMutation } from "./types";
import ProChartModules from "../../instance/element-modules/dashboard";
import { checkShowPileSum } from "../../instance/element-modules/dashboard/utils";
import { dashboardApi } from "@h3/report-mobile/basics/service/dashboard/index.ts";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { guid } from "../../utils/uid";
import { buildTree } from "../utils/help";

const mutations: MutationTree<ReportProState> = {
  /**
   * 初始化报表数据 todo 暂时写一个环境，后续多种环境再变更
   * @param state
   */
  [ReportMutation.SETENV](state,env) {
    state.isWxwork = env
  },
  /**
   * 初始化报表数据
   * @param state
   */
  [ReportMutation.INITREPORT](state) {
    Object.assign(state, new ReportProState());
  },
  /**
   * 设置仪表盘标题
   * @param state
   * @param title
   */
  [ReportMutation.SETREPORTTITLE](state, title: string) {
    state.title = title;
  },
  [ReportMutation.SETLANGTYPE](state, type: string) {
    state.langType = type;
  },
  /**
   * 设置仪表盘Top
   * @param state
   * @param top
   */
  [ReportMutation.SETREPORTTOP](state, top: number) {
    state.reportTop = top;
  },
  /**
   * 设置仪表盘图表
   * @param state
   * @param charts
   */
  [ReportMutation.SETCHARTS](state, charts: Array<H3.Report.Chart>) {
    state.charts = charts;
  },
  /**
   * 设置仪表盘全局设置
   * @param state
   * @param global
   */
  [ReportMutation.SETGLOBAL](state, global: H3.Report.Global) {
    state.global = global;
  },
  /**
   * 设置仪表盘全局样式
   * @param state
   * @param global
   */
  [ReportMutation.SETGLOBALSTYLEBYKEY](state, { key, val }) {
    state.global.styles[key] = val;
  },
  /**
   * 设置仪表盘objectId
   * @param state
   * @param objectId
   */
  [ReportMutation.SETOBJECTID](state, objectId: string) {
    state.objectId = objectId;
  },
  /**
   * 设置标题
   * @param state
   * @param title
   */
  [ReportMutation.SETTITLE](state, title: string) {
    state.title = title;
  },
  /**
   * 删除指标触发事件
   * @param state
   * @param activeChart
   */
  [ReportMutation.DELETEMETRIC](state, activeChart: H3.Report.Chart) {
    // 删除指标，需要更新警戒线配置属性
    state.activeChart = activeChart;
    const warningLine = state.activeChart.styles.warningLine;
    let metric: H3.Report.FieldColumn | undefined;
    if (state.activeChart && warningLine) {
      warningLine.forEach((item: H3.Report.WarningLine, index: number) => {
        // 判断删除最后一个指标的情况
        if ((state.activeChart as any).data.metric.length > 0) {
          metric = (state.activeChart as any).data.metric.find((oMetric: H3.Report.FieldColumn) => {
            if (item.field === oMetric.uid) {return true;}
            return false;
          });
          if (metric === undefined) {
            delete (state.activeChart as any).styles.warningLine[index];
          }
        } else {
          delete (state.activeChart as any).styles.warningLine[index];
        }
      });
      // 过滤underfined值
      (state.activeChart as any).styles.warningLine = (state.activeChart as any).styles.warningLine.filter(
        item => item !== undefined
      );
    }
  },
  /**
   * 设置激活的图表
   * @param state
   * @param activeChart
   */
  [ReportMutation.SETACTIVECHART](state, activeChart: H3.Report.Chart) {
    state.activeChart = activeChart;
    state.activeModules = !activeChart || ProChartModules(activeChart);
    // 设计时，需要同步activeChartLayer
    if (state.designMode) {
      const matchIndex = state.activeChartLayers.findIndex(c => c.uid === activeChart.uid);
      if (matchIndex > -1) {
        state.activeChartLayers.splice(matchIndex, 1, activeChart);
      }
    }
    return state.activeChart;
  },
  /**
   * 设置预测功能显示隐藏
   * @param state
   * @param field
   */
  [ReportMutation.SETFORECAST](state, field) {
    if (
      field.options &&
      field.options.format &&
      state.activeModules &&
      state.activeModules.data &&
      state.activeChart &&
      state.activeChart.data &&
      state.activeChart.data.forecast &&
      state.activeModules.data.forecast &&
      field.type === "date"
    ) {
      if (["M", "MD", "D"].includes(field.options.format)) {
        state.activeModules.data.forecast.display = false;
        state.activeChart.data.forecast.show = false;
      } else {
        state.activeModules.data.forecast.display = true;
      }
    }
    // state.activeModules
  },
  /**
   * 设置所有图层切换功能
   * @param state
   * @param data
   */
  [ReportMutation.CHANGESWITCHLAYERS](state, data) {
    state.activeChartLayers.forEach(item => {
      item.data.switchLayers = data;
    });
  },

  /**
   * 清空激活的图表
   * @param state
   */
  [ReportMutation.CLEARACTIVECHART](state) {
    state.activeChart = null;
  },
  /**
   * 处理排序字段
   * （如果其他字段变更，查找排序字段是否存在，不存在就删除）
   * @param state
   * @param chart
   */
  [ReportMutation.HANDLESORT](state, chart: H3.Report.Chart) {
    if (state.activeChart && state.activeChart.data.sort && state.activeChart.data.sort.length) {
      const sortArr = state.activeChart.data.sort;
      let objArr: Array<H3.Report.FieldColumn> = [];
      if (state.activeChart.data.dimension) {
        objArr = objArr.concat(state.activeChart.data.dimension);
      }
      if (state.activeChart.data.groupDimension) {
        objArr = objArr.concat(state.activeChart.data.groupDimension);
      }
      if (state.activeChart.data.metric) {
        objArr = objArr.concat(state.activeChart.data.metric);
      }
      if (state.activeChart.data.metricGroup) {
        const metrics: Array<H3.Report.FieldColumn> = [];
        state.activeChart.data.metricGroup.forEach(m => {
          metrics.push(...m);
        });
        objArr = objArr.concat(metrics);
      }

      sortArr.forEach((sort: H3.Report.FieldColumn, index: number) => {
        const objIndex = objArr.findIndex(
          (obj: H3.Report.FieldColumn) =>
            obj.uid === sort.uid && obj.schemaCode === sort.schemaCode && obj.field === sort.field
        );
        if (objIndex < 0) {
          sortArr.splice(index, 1);
        } else {
          objArr[objIndex].options.order = sortArr[index].options.order;
          sortArr.splice(index, 1, objArr[objIndex]);
        }
      });
      // 解决二维一指标切换顺序的排序问题
      // if (state.activeChart.type !== 'list' && sortArr.length > 1) {
      //   sortArr.sort((last, current) => {
      //     let lastIndex: number = objArr.findIndex(i => i.uid === last.uid) || 0;
      //     let currentIndex: number = objArr.findIndex(i => i.uid === current.uid) || 0;
      //     return lastIndex - currentIndex;
      //   });
      //
      // }
    }
  },
  /**
   * 设置新增拖动的图表
   * @param state
   * @param chart
   */
  [ReportMutation.SETDRAGCHART](state, chart: H3.Report.Chart) {
    state.dragChart = chart;
  },
  /**
   * 保存上一次数据源ID
   * @param state
   * @param lastDataSourceNode
   */
  [ReportMutation.SETLASTDATASOURCE](state, lastDataSourceNode) {
    state.lastDataSourceNode = lastDataSourceNode;
  },
  /**
   * 设置拖动的字段
   * @param state
   * @param field
   */
  [ReportMutation.SETDRAGFIELD](state, field: H3.Report.FieldColumn) {
    state.dragField = field;
  },
  /**
   * 图表切换图层后,清除联动该图表的关联关系 
   * @param
   */
  [ReportMutation.CLEARCHARTSRELATION](state, chartData) {
    let uids: any = [];
    if (Array.isArray(chartData)) {
      uids = chartData.map(c => c.uid);
    } else {
      if (typeof chartData === "object" && state.chartRelations && state.chartRelations[chartData.uid]) {
        uids = state.chartRelations[chartData.uid].map((chart: any) => chart.uid);
      }
    }
    if (uids && uids.length) {
      state.charts.forEach((chart : any) => {
        if (chart.styles && chart.styles.linkage && chart.styles.linkage.length) {
          const reLinkage = chart.styles.linkage.filter(
            (uid, index) => !uids.includes(uid) || (uids.includes(uid) && uids.indexOf(uid) === 0),
          );
          chart.styles.linkage = reLinkage;
        }
      });
    }
  },
  /**
   * 清空图表关系
   * @param state
   * @param chart
   */
  [ReportMutation.CLEARCHARTRELATION](state, chart) {
    let uid;
    let chartIds;
    let oldDataSources;
    const dataSources = new Set();
    let difSourceId;
    const tmpDataSource = {
      dataSourceId: "",
      field: null
    };
    // 清空图表联动关系
    if (chart.styles && chart.styles.linkage) {
      chart.styles.linkage = [];
    }
    state.charts.forEach((item: any) => {
      if (item.styles && item.styles.linkage) {
        uid = item.styles.linkage.filter((param: any) => param !== chart.uid);
        item.styles.linkage = uid;
      }
      // 变更筛选联动关系
      if (item.type === "filterPicker" && item.chartIds.includes(chart.uid)) {
        chartIds = item.chartIds.filter((param: string) =>
          state.charts.find((data: any) => data.uid === param)
        );
        chartIds
          .map((chartId: string) => state.charts.find((param: any) => param.uid === chartId))
          .forEach((data) => {
            if (data.dataSourceId) {dataSources.add(data.dataSourceId);}
          });
        oldDataSources = new Set(
          item.dataSources.map((param: H3.Report.FilterDataSource) => param.dataSourceId)
        );
        // 减少数据源时，删除差集的数据源；
        if (oldDataSources.size > dataSources.size) {
          difSourceId = Array.from(oldDataSources).find((data) => !dataSources.has(data));
          const tmpChart = state.charts.find(
            (data: any) => data.dataSourceId === chart.dataSourceId && data.uid !== chart.uid,
          );
          if (tmpChart) {
            chart.filterPicker = (tmpChart as any).filterPicker;
          }
          item.dataSources.splice(
            item.dataSources.findIndex(data => data.dataSourceId === difSourceId),
            1
          );
        } else if (oldDataSources.size === dataSources.size) {
          difSourceId = Array.from(oldDataSources).find(data => !dataSources.has(data));
          if (difSourceId) {
            tmpDataSource.dataSourceId = chart.dataSourceId;
            chart.filterPicker = [];
            // 更改数据源时，替换当前字段，如果更改第一个，清空所有
            if (item.dataSources.findIndex(data => data.dataSourceId === difSourceId) === 0) {
              item.dataSources.forEach((data: any) => {
                data.field = null;
              });
            }
            item.dataSources.splice(
              item.dataSources.findIndex(data => data.dataSourceId === difSourceId),
              1,
              tmpDataSource
            );
          }
        } else {
          // 新增数据源， 新增字段
          difSourceId = Array.from(dataSources).find(data => !oldDataSources.has(data));
          if (difSourceId) {
            tmpDataSource.dataSourceId = chart.dataSourceId;
            tmpDataSource.dataSourceId = difSourceId;
            item.dataSources.push(tmpDataSource);
          }
        }
        item.chartIds = chartIds;
      }
    });
  },
  /**
   * 清空图表关系,用于新仪表盘
   * @param state
   * @param chart
   */
  [ReportMutation.CLEARCHARTANDFILTERRELATION](state, chart) {
    let uid;
    let chartIds;
    let oldDataSources;
    const dataSources = new Set();
    let difSourceId;
    const tmpDataSource = {
      dataSourceId: "",
      field: null,
      displayName: ""
    };
    // 清空图表联动关系
    if (chart.styles && chart.styles.linkage) {
      chart.styles.linkage = [];
    }
    state.charts.forEach((item: any) => {
      if (item.styles && item.styles.linkage) {
        uid = item.styles.linkage.filter((param: any) => param !== chart.uid);
        item.styles.linkage = uid;
      }
    });
    state.globalFilters.forEach(item => {
      // 变更筛选联动关系
      if (item.chartIds.includes(chart.uid)) {
        chartIds = item.chartIds.filter((param: string) =>
          state.charts.find((data: any) => data.uid === param)
        );
        chartIds
          .map((chartId: string) => state.charts.find((param: any) => param.uid === chartId))
          .forEach((data) => {
            if (data.dataSourceId) {dataSources.add(data.dataSourceId);}
          });
        oldDataSources = new Set(
          item.dataSources.map((param: H3.Report.FilterDataSource) => param.dataSourceId)
        );
        // 减少数据源时，删除差集的数据源；
        if (oldDataSources.size > dataSources.size) {
          difSourceId = Array.from(oldDataSources).find((data) => !dataSources.has(data));
          const tmpChart = state.charts.find(
            (data: any) => data.dataSourceId === chart.dataSourceId && data.uid !== chart.uid,
          );
          if (tmpChart) {
            chart.filterPicker = (tmpChart as any).filterPicker;
          }
          item.dataSources.splice(
            item.dataSources.findIndex(data => data.dataSourceId === difSourceId),
            1
          );
        } else if (oldDataSources.size === dataSources.size) {
          difSourceId = Array.from(oldDataSources).find(data => !dataSources.has(data));
          if (difSourceId) {
            tmpDataSource.dataSourceId = chart.dataSourceId;
            chart.filterPicker = [];
            // 更改数据源时，替换当前字段，如果更改第一个，清空所有
            if (item.dataSources.findIndex(data => data.dataSourceId === difSourceId) === 0) {
              item.dataSources.forEach((data: any) => {
                data.field = null;
              });
            }
            item.dataSources.splice(
              item.dataSources.findIndex(data => data.dataSourceId === difSourceId),
              1,
              tmpDataSource
            );
          }
        } else {
          // 新增数据源， 新增字段
          difSourceId = Array.from(dataSources).find(data => !oldDataSources.has(data));
          if (difSourceId) {
            tmpDataSource.dataSourceId = chart.dataSourceId;
            tmpDataSource.dataSourceId = difSourceId;
            item.dataSources.push(tmpDataSource);
          }
        }
        item.chartIds = chartIds;
      }
    });
  },
  /**
   * 设置报表服务配置项
   * @param state
   * @param field
   */
  [ReportMutation.SETREPORTOPTIONS](state, { corpId, reportId, config, integrate }) {
    if (corpId) {
      state.corpId = corpId;
    }
    if (reportId) {
      state.objectId = reportId;
    }
    state.config = config;
    state.integrateComponent = integrate;
    dashboardApi.setConfig({ corpId, config });
  },
  /**
   * 设置角色信息
   * @param state
   * @param role 角色信息
   */
  [ReportMutation.SETROLEOPTIONS](
    state,
    role: H3.Licence.Role<
      H3.Licence.DashboardAuthority,
      H3.Licence.DashboardAuthority,
      H3.Licence.DashboardAuthority
    >
  ) {
    state.role = role;
  },
  /**
   * 更新图表视图
   * @param state
   * @param field
   */
  [ReportMutation.RESIZECHARTVIEW](state, { chart, type }) {
    if(chart){
      const chartId = typeof chart === "string" ? chart : chart.uid;
      const viewStatus: any = state.chartViewStatus[chartId];
      if (!viewStatus) {return;}

      const fun: Function | undefined = viewStatus[type];
      if (fun instanceof Function) {
        viewStatus[type]();
      }
    }
  },
  [ReportMutation.RESIZECHARTSVIEW](state, { type }) {
    state.charts.forEach(chart => {
      const chartId = typeof chart === "string" ? chart : chart.uid;
      const viewStatus: any = state.chartViewStatus[chartId];
      if (!viewStatus) {return;}
      const fun: Function | undefined = viewStatus[type];
      if (fun instanceof Function) {
        viewStatus[type]();
      }
    });
  },
  [ReportMutation.SETNUMBERFORMAT](state, { numberFormat, metricIndex, groupIndex }) {
    if (state.activeChart) {
      if (state.activeChart.type === "list") {
        // 明细表只有dimension
        state.activeChart.data.dimension[metricIndex].options.numberFormat = numberFormat;
      } else if (state.activeChart.type === "biax") {
        // 双轴图的数据是在metricGroup中处理
        state.activeChart.data.metricGroup[groupIndex][
          metricIndex
        ].options.numberFormat = numberFormat;
      } else {
        state.activeChart.data.metric[metricIndex].options.numberFormat = numberFormat;
      }
    }
  },
  /**
   * 设置条件格式
   * @param state
   * @param params 设置内容
   */
  [ReportMutation.SETCONDITIONFORMAT](state, { params,chart, fieldIndex, conditionOptions, isApply }) {
    if (state.activeChart) {
      if (state.activeChart.type === "list") {
        // 明细表只有dimension
        state.activeChart.data.dimension[fieldIndex].options.conditionFormat = isApply;
        if (!state.activeChart.conditionFormats) {
          state.activeChart.conditionFormats = [];
        }
        const fieldIdx = state.activeChart.conditionFormats.findIndex(
          (item) => item.fieldUid === params.data.uid,
        );
        if (fieldIdx > -1) {
          state.activeChart.conditionFormats[fieldIdx] = conditionOptions;
        } else {
          state.activeChart.conditionFormats.push(conditionOptions);
        }
      }
    }
  },

  /**
   * 设置目标值格式
   * @param state
   * @param targetValue 设置内容
   * @param metricIndex 字段index
   */
  [ReportMutation.SETTARGETVALUE](state, { targetValue, metricIndex }) {
    if (state.activeChart) {
      state.activeChart.data.metric[metricIndex].options.targetValue = targetValue;
    }
  },

  /**
   * 设置结果筛选器
   * @param state
   * @param metricIndex 字段index
   * @param resultFilter 结果筛选器的数据
   */
  [ReportMutation.SETRESULTFILTER](state, { resultFilter, metricIndex, groupIndex }) {
    if (state.activeChart) {
      if (state.activeChart.type === "list") {
        // 明细表只有dimension
        state.activeChart.data.dimension[metricIndex].options.resultFilter = resultFilter;
      } else if (state.activeChart.type === "biax") {
        // 双轴图的数据是在metricGroup中处理
        state.activeChart.data.metricGroup[groupIndex][
          metricIndex
        ].options.resultFilter = resultFilter;
      } else {
        state.activeChart.data.metric[metricIndex].options.resultFilter = resultFilter;
      }
    }
  },
  /**
   * 设置结果筛选器
   * @param state
   * @param metricIndex 字段index
   * @param resultFilter 结果筛选器的数据
   */
  [ReportMutation.SETDATEFORMAT](state, { dateFormat, dimensionIndex }) {
    if (state.activeChart) {
      if (state.activeChart.type === "list") {
        state.activeChart.data.dimension[dimensionIndex].options.dateFormat = dateFormat;
      }
    }
  },
  /**
   * 设置结果筛选器
   * @param state
   * @param metricIndex 字段index
   * @param resultFilter 结果筛选器的数据
   */
  [ReportMutation.HANDLESTYLES](state) {
    if (state.activeChart) {
      if (state.activeChart.type === "pileBar" || state.activeChart.type === "pileStripe") {
        if (
          state.activeModules &&
          state.activeModules.styles &&
          state.activeModules.styles.dataLabelPileSum
        ) {
          const showPileSum = checkShowPileSum(state.activeChart.data.metric);
          state.activeModules.styles.dataLabelPileSum.display = showPileSum;
          if (state.activeChart.styles.dataLabelPileSum === true) {
            state.activeChart.styles.dataLabelPileSum = true;
          } else {
            state.activeChart.styles.dataLabelPileSum = false;
          }
          if (showPileSum === false) {
            state.activeChart.styles.dataLabelPileSum = false;
          }
        }
      }
    }
  },
  /**
   * 设置导出透视表预处理数据
   * @param state
   * @param field
   */
  [ReportMutation.SETTABLEEXPORTDATA](state, { uid, data }) {
    state.tableExportData[uid] = data;
  },
  /**
   * 设置图表数据
   * @param state
   * @param key
   * @param data
   */
  [ReportMutation.SETCHARTSDATA](state, { key, data }) {
    Vue.set(state.chartsData, key, data);
  },
  /**
   * 设置是否显示高级数据源
   * @param state
   * @param data
   */
  [ReportMutation.SETADVANCEDATASOURCE](state, data) {
    state.showAdvancedDataSource = data;
  },
  /**
   * 改变全局皮肤
   * @param state
   * @param theme
   */
  [ReportMutation.CHANGEGLOBALTHEME](state, { theme, colorTheme }) {
    state.charts.forEach((c, index) => {
      const isDataZoomChart = [
        ElementType.BAR,
        ElementType.LINE,
        ElementType.AREA,
        ElementType.BIAX,
        ElementType.PILEBAR,
        ElementType.PILESTRIPE,
        ElementType.STRIPE,
        ElementType.PERCENTPILEBAR,
        ElementType.PERCENTPILESTRIPE
      ].includes(c.type);
      const isChartHasColors = [
        ElementType.LIST,
        ElementType.TABLE,
        ElementType.CROSSTABLE,
        ElementType.BAR,
        ElementType.PILEBAR,
        ElementType.PERCENTPILEBAR,
        ElementType.STRIPE,
        ElementType.PILESTRIPE,
        ElementType.PERCENTPILESTRIPE,
        ElementType.LINE,
        ElementType.AREA,
        ElementType.BIAX,
        ElementType.FUNNEL,
        ElementType.FUNNELCOMPARE,
        ElementType.CARD,
        ElementType.PROGRESSBAR,
        ElementType.GAUGE,
        ElementType.PIE,
        ElementType.RADAR,
        ElementType.MAP,
        ElementType.SCATTER,
      ].includes(c.type);
      if (isDataZoomChart) {
        const chart = c as H3.Report.Chart;
        if (chart.styles && chart.styles.dataZoom) {
          chart.styles.dataZoom.theme = theme;
        }
      }
      if (isChartHasColors && colorTheme) {
        const chart = c as H3.Report.Chart;
        if (chart.styles && chart.styles.theme) {
          chart.styles.theme = colorTheme;
        }
        // 覆盖文字颜色
        if (chart.styles && chart.styles.fontSetting) {
          chart.styles.fontSetting.fontColor = '';
          chart.styles.fontSetting.titleColor = '';
        }
        if (chart.styles && chart.styles.elementCoat) {
          chart.styles.elementCoat.type = null;
          chart.styles.elementCoat.value = '';
        }
      }
      if (c.type === ElementType.MAP) {
        const chart = c as H3.Report.Chart;
        if (chart.styles && chart.styles.mapTheme) {
          chart.styles.mapTheme.theme = theme === "dark" ? "deep" : "blue";
        }
      }
    });
  },

  /**
   * 清空 重置仪表盘
   * @param state
   * @param data
   */
  [ReportMutation.RESERREPORT](state) {
    state.charts = [];
  },
  /**
   * 新增的临时组件
   * @param state
   * @param newElement 新增的组件
   */
  [ReportMutation.ADDNEWELEMENT](state, newElement) {
    state.charts.push(newElement);
  },
  /**
   * 更改当前的图表数据
   * @param state
   * @param data 更改的数据
   * @param moduleOptions 模块配置项
   */
  [ReportMutation.UPDATEACTIVECHART](
    state,
    {
      data,
      moduleOptions
    }: {
      data: any;
      moduleOptions: H3.Analysis.ModulesBase<any>;
    }
  ) {
    if (!state.activeChart) {return;}
    if (moduleOptions.parentNodeKey) {
      state.activeChart[moduleOptions.parentNodeKey][moduleOptions.moduleKey] = data;
    } else {
      state.activeChart[moduleOptions.moduleKey] = data;
    }
  },
  /**
   * 切换编辑模式
   * @param state
   * @param isDesignMode
   */
  [ReportMutation.TOGGLEDESIGNMODE](state, isDesignMode) {
    state.designMode = isDesignMode;
  },
  /**
   * 新增或更新仪表盘  ==========注意此处不添加带有parentUid的图表
   * @param state
   * @param chart
   */
  [ReportMutation.ADDORUPDATECHART](state, chart) {
    const charts = Array.isArray(chart) ? chart : [chart];
    charts.forEach(cChart => {
      if (!cChart.parentUid) {
        const index = state.charts.findIndex(item => item.uid === cChart.uid);
        if (index > -1) {
          cChart.__key__ = guid();
          state.charts.splice(index, 1, cChart);
        } else {
          state.charts.push(cChart);
        }
        // 同步tabsMapping
        if (cChart.tabUid && state.tabsMapping[cChart.tabUid]) {
          const tabIndex = state.tabsMapping[cChart.tabUid][cChart.tabIndex].charts.findIndex(
            (item) => item.uid === cChart.uid,
          );
          if (tabIndex > -1) {
            state.tabsMapping[cChart.tabUid][cChart.tabIndex].charts.splice(tabIndex, 1, cChart);
          }
        }
      }
    });
  },
  /**
   * 切换图表后更新图表对象
   * @param state 
   * @param chartsArr 
   * @returns 
   */
  [ReportMutation.COMBINECHARTS](state, chartsArr) {
    if (!chartsArr || chartsArr.length === 0) {return;}
    let filteredCharts: any = state.charts.filter((chart) => {
      return !chartsArr.some((obj) => obj.uid === chart.uid);
    });
    const newChart = buildTree(chartsArr);
    filteredCharts = filteredCharts.concat(newChart);
    state.charts = filteredCharts;
  },
  /**
   * 更新tab组件的映射
   * @param state
   * @param chart
   */
  [ReportMutation.UPDATETABMAPPING](state) {
      let mapping:any = {};
      let tabComponents = state.charts.filter((item)=> item.type === 'tab');
      tabComponents.forEach((item: H3.Report.Tab)=> {
        if(item.tabs && item.tabs.length > 0) {
          item.tabs.forEach((tab,i)=> {
           if(!mapping[item.uid]) {mapping[item.uid] = {};}
           if(!mapping[item.uid][i]) {mapping[item.uid][i] = {};}
            mapping[item.uid][i]['charts'] = state.charts.filter(chart=>  tab.chartIds.includes(chart.uid));
            mapping[item.uid][i]['chartIds'] = tab.chartIds;
          });
        }
      });
      state.tabsMapping = mapping;
  },

  [ReportMutation.SETCHARTSREVERT](state, copyCharts) {
    if (state.charts && state.charts.length) {
      state.charts.forEach((item: any) => {
        const c = copyCharts.find((a) => a.uid === item.uid);
        if (c) {
          item.x = c.x;
          item.y = c.y;
          item.w = c.w;
          item.h = c.h;
        }
      });
    }
  },

  /**
   * 更新移动端tab映射,移动端筛选过滤组件
   * @param state 
   */
  [ReportMutation.UPDATEMOBILETABMAP](state, mobileMode) {
    if (mobileMode) {
      let mapping: any = {};
      const orignMap = state.tabsMapping;
      Object.keys(orignMap).forEach((key) => {
        if (!mapping[key]) {mapping[key] = {};}

        Object.keys(orignMap[key]).forEach((map) => {
          if (!mapping[key][map]) {mapping[key][map] = {};}
          mapping[key][map]["charts"] = orignMap[key][map].charts.filter(
            (chart) => chart.type !== ElementType.FILTERPICKER,
          );
          mapping[key][map]["chartIds"] = mapping[key][map]["charts"].map((chart) => chart.uid);
        });
      });
      state.tabsMapping = mapping;
    }
  },
  
  /**
   * 删除tab组件图表
   * @param state
   */
 [ReportMutation.CLEARTABCHART](state, {chartUid,tabUid,activeIndex}) {
  if(!tabUid) {return;}
    let tabMapping = state.tabsMapping[tabUid][activeIndex];
    if(tabMapping) {
      const idx = tabMapping.chartIds.findIndex(id=> id === chartUid);
      const chartIdx = tabMapping.charts.findIndex(chart=> chart.uid === chartUid);
      if(chartIdx > -1) {
        tabMapping.charts.splice(chartIdx,1);
      }
      if(idx > -1) {
        tabMapping.chartIds.splice(idx,1);

      }
    
      
    }
},

  /**
   * 设置relation关系图
   */
  [ReportMutation.SETRELATIONCHART](state, relationChart) {
    state.chartRelations = relationChart;
  },

  /**
   * 更新 relation关系图 新增组件或者编辑组件都需要
   */
  [ReportMutation.UPDATERELATIONCHART](state, { chartId, layers }) {
    state.chartRelations[chartId] = layers;
    if (layers && layers.length) {
      layers.forEach((chart, index) => {
        if (index !== 0 && state.chartRelations[chart.uid]) {
          delete state.chartRelations[chart.uid];
        }
      });
    }
  },
  [ReportMutation.SETCHARTSRELATIONINTAB](state, dragChart) {
    if (dragChart && dragChart.type !== ElementType.TAB) {
      if (state.chartRelations && state.chartRelations[dragChart.uid]) {
        state.chartRelations[dragChart.uid].forEach((chart) => {
          if (dragChart.tabUid) {
            chart.tabUid = dragChart.tabUid;
            chart.tabIndex = dragChart.tabIndex;
          } else {
            delete chart.tabUid;
            delete chart.tabIndex;
          }
        });
      }
    }
  },
  /**
   * 通过id设置正在编辑中的图层
   */
  [ReportMutation.SETACTIVECHARTLAYERSBYID](state, chartId) {
    const nowChart = state.charts.find(cId => cId.uid === chartId);
    const activeChartLayers = state.chartRelations[chartId] || [nowChart];
    activeChartLayers.forEach(cChart => {
      cChart.filterPicker = activeChartLayers[0].filterPicker;
    });
    //从主页进入到设计器，需要拷贝一份数据
    state.activeChartLayers = activeChartLayers;
    state.activeChart = state.activeChartLayers[0];
  },

  /**
   * 删除relation关系图
   */
  [ReportMutation.DELETERELATIONCHART](state, chartId) {
    delete state.chartRelations[chartId];
  },
  /**
   * 更新正在编辑中的图表的重命名标题
   */
  [ReportMutation.SETCHARTSRENAME](state,{ chartUid, title}) {
    const activeChart: any = state.charts.find(item => item.uid === chartUid);
    if (activeChart) {
      activeChart.title = title;
      if (activeChart.children && activeChart.children.length) {
        activeChart.children.forEach(chart => {
          chart.title = title;
        })
      }
    }
    const charts = state.chartRelations[chartUid] || [];
      charts.length && charts.forEach(echart => {
        echart.title = title;
      });
  },
  /**
   * 切换图层结束后，不需要切换图层的顺序，只修改图层的数据
   * @param state 
   */
  [ReportMutation.UPDATECHARTLAYERSDATA](state, {oldCharts, newCharts}) {
    if (oldCharts && oldCharts.length && newCharts && newCharts.length) {
     const keyMap = ['__key__', 'uid', 'parentUid', 'tabIndex', 'tabUid','x', 'y', 'w', 'h']
      newCharts.forEach((chart, index) => {
        if (oldCharts[index]) {
          for (const key in chart) {
            if (!keyMap.includes(key)) {
              oldCharts[index][key] = chart[key];
            }
          }
          oldCharts[index].layerFilter = [];
        }
      });
      state.activeChartLayers = oldCharts;
    }
  },
  /**
   * 更新正在编辑中的图层
   */
  [ReportMutation.UPDATEACTIVECHARTLAYERS](state, { type, chart, key, value }) {
    switch (type) {
      case "add":
        if (
          state.activeChartLayers[0] &&
          state.activeChartLayers[0].data &&
          state.activeChartLayers[0].data.switchLayers
        ) {
          chart.data.switchLayers = state.activeChartLayers[0].data.switchLayers;
        }
        state.activeChartLayers.push(chart);
        break;
      case "delete":
        const index = state.activeChartLayers.findIndex((c) => c.uid === chart.uid);
        if (index > -1) {state.activeChartLayers.splice(index, 1);}
        break;
      case "reset": //此时的chart 是数组
        state.activeChartLayers = chart;
        break;
      default:
        //更新
        if (chart) {
          //只更新当前
          const Uindex = state.activeChartLayers.findIndex(c => c.uid === chart.uid);
          if (Uindex > -1) {
            if (key) {state.activeChartLayers[Uindex][key] = value;}
            if (!key) {state.activeChartLayers[Uindex] = chart;} //更新整个chart
          }
        } else {
          //activeChartLayer所有chart 都更新
          state.activeChartLayers.forEach(cChart => {
            cChart[key] = value;
          });
        }
        break;
    }
  },
  /**
   * 下钻仪表盘更新 ==========注意此处不添加带有parentUid的图表 和addOrUpdate 方法只差一个__key__
   * @param state
   * @param chart
   */
  [ReportMutation.UPDATELAYERFILTER](state, chart) {
    const charts = Array.isArray(chart) ? chart : [chart];
    charts.forEach(cChart => {
      if (!cChart.parentUid) {
        const index = state.charts.findIndex(item => item.uid === cChart.uid);
        if (index > -1) {
          state.charts.splice(index, 1, cChart);
        } else {
          state.charts.push(cChart);
        }
      }
    });
  },
  /**
   * 设置定时器
   */
  [ReportMutation.SETCHARTINTERVAL](state, charts) {
    const chartsArr = Array.isArray(charts) ? charts : [charts];
    chartsArr.length &&
      chartsArr.forEach(chart => {
        const time = chart.data.timer ? chart.data.timer.time : null;
        const chartId = chart.uid;
        if (time) {
          if (state.chartsTimer[chartId]) {clearInterval(state.chartsTimer[chartId]);}
          const intervalTimer = setInterval(() => {
            state.chartViewStatus[chartId].onlyGetData();
          }, time * 1000);
          state.chartsTimer[chartId] = intervalTimer;
        }
      });
  },
  /**
   * 清除定时器
   */
  [ReportMutation.CLEARCHARTINTERVAL](state, ids) {
    const chartIds = Array.isArray(ids) ? ids : [ids];
    chartIds.forEach(uid => {
      if (state.chartsTimer[uid]) {
        clearInterval(state.chartsTimer[uid]);
        delete state.chartsTimer[uid];
      }
    });
  },
  /**
   * 清除定时器
   */
  [ReportMutation.SETFULLSTATUS](state, status) {
    state.fullStatus = status;
  },

  //同步自定义排序
  [ReportMutation.SYNCCUTOMSORT](state) {
    if (state.activeChart && state.activeChart.customSort) {
      const dimentions = state.activeChart.data.dimension;
      if (state.activeChart.customSort) {
        const customSort = state.activeChart.customSort;
        customSort &&
          typeof customSort === "object" &&
          Object.keys(customSort).forEach(uid => {
            if (dimentions.findIndex(e => e.uid === uid) < 0) {
              customSort[uid] = [];
            }
          });
      }
    }
  },
  //同步自定义排序
  [ReportMutation.SYNCDIMENSIONSORT](state, { chart, dimensionIndex, bool, order, isFull }) {
    if (isFull) {
      chart.data.dimension[dimensionIndex].options.isCustomSort = bool;
      chart.data.dimension[dimensionIndex].options.order = order || "";
    } else if (chart && !state.designMode) {
      const uid = chart.uid;
      const metch: any = state.charts.find(c => c.uid === uid);
      if (metch) {
        metch.data.dimension[dimensionIndex].options.isCustomSort = bool;
        metch.data.dimension[dimensionIndex].options.order = order || "";
      }
    } else {
      if (state.activeChart) {
        state.activeChart.data.dimension[dimensionIndex].options.isCustomSort = bool;
        state.activeChart.data.dimension[dimensionIndex].options.order = order || "";
      }
    }
  },
  //同步数据对比
  [ReportMutation.SYNCCOMPAREDATA](state) {
    //设计模式下才生效
    if (state.designMode && state.activeChart) {
      state.activeChart.data.compareData = [];
    }
  },
  // 新增/修改埋点
  [ReportMutation.AddLOG](state,{key,params= {},data = {}}) {
    // window.addEventListener('load', () => {
    //   if (!window.performance) return
    //   console.log('window.performance==',window.performance)
    // })
    // 新增一条记录
    if(state.logs && !state.logs[key]) {
      state.logs[key] = {
        appName:'dashboard',
        corpId: state.corpId,
        data: {},
        userId: state.config && state.config.userId ? state.config.userId : '',
        createTime: Date.now(),
        startTime: Date.now(),
        extra: {},
        body: {},
        funcName: '',
        endTime: '',
        totalElapsed: '',
        traceId: ''
      }
    } else {
      Object.assign(state.logs[key],params);
      Object.assign(state.logs[key].data,data);
      if(state.logs[key].endTime) {
        state.logs[key].totalElapsed = state.logs[key].endTime - state.logs[key].createTime;
      }
    }
  },
  /**
   * 设置转换旧报表的配置
   */
  [ReportMutation.SETCONVERTREPORTINFO](state, options) {
    if (options) {
      if (options.corpId) {
        state.corpId = options.corpId;
      }
      if (options.reportCode) {
        state.reportCode = options.reportCode;
      }
      if (options.config) {
        state.config = options.config;
      }
      dashboardApi.setConfig({ 
        corpId: state.corpId, 
        config: state.config 
      });
    }
  }
};

export default mutations;
