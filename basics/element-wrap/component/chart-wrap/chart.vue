<template>
  <h3-card
    ref="card"
    :delay="delay"
    v-if="chart.type === 'card'"
    :refresh="refresh"
    :customSort="chart.customSort"
    :class="[`${prefixCls}__body`]"
    :options="cardInstance"
    :chartData="chartData"
    :mobileMode="mobileMode"
    :global="global"
    @click="clickChart"
    @refresh-end="refreshEnd"
  >
  </h3-card>
  <h3-progress-bar
    v-else-if="chart.type === 'progressBar'"
    ref="progress"
    :delay="delay"
    :refresh="refresh"
    :class="[`${prefixCls}__body`]"
    :options="progressInstance"
    @click="clickChart"
    :chartData="chartData"
    @refresh-end="refreshEnd"
  ></h3-progress-bar>
  <List
    ref="list"
    v-else-if="chart.type === 'list'"
    :total="dataTotal"
    :delay="delay"
    :landscape="landscape"
    :alias="listInstance.alias"
    :datasource="listInstance.data"
    :columns="listInstance.columns"
    :fontColor="listInstance.fontColor"
    :columnsSetting="listInstance.columnsSetting"
    :static-column="listInstance.freezeHead.columnNumber"
    :order-number="listInstance.orderNumber"
    :pageSet="listInstance.pageSet"
    :fontSize="listInstance.fontSize"
    :freeze-head="listInstance.freezeHead"
    :list-text-align="listInstance.listTextAlign"
    :refresh="refreshListLoading"
    :class="[`${prefixCls}__body`]"
    :isTransparent="listInstance.isTransparent"
    :chartData="chartData"
    :global="global"
    :chart="chart"
    :setFontColor="fontColorSetting.fontColor"
    @changePage="refreshListData"
    @change-columns="changeColumns"
    @drill-down="drillDown"
    @click-chart="clickChart"
    @refresh-end="refreshEnd"
  >
  </List>
  <h3-pivot-table
    v-else-if="chart.type === 'table'"
    ref="table"
    :delay="delay"
    :class="[`${prefixCls}__body`]"
    :realData="tableInstance.data"
    :total="tableInstance.total"
    :alias="tableInstance.alias"
    :columns="tableInstance.columns"
    :rows="tableInstance.rows"
    :pageSet="tableInstance.pageSet"
    :fontColor="tableInstance.fontColor"
    :isTransparent="tableInstance.isTransparent"
    :metric="tableInstance.metric"
    :landscape="landscape"
    :fontSize="tableInstance.fontSize"
    :isNo="tableInstance.orderNumber.checked"
    :list-text-align="tableInstance.listTextAlign"
    :columnsSetting="tableInstance.columnsSetting"
    :fixedColHead="tableInstance.freezeHead.column"
    :fixedColNumber="tableInstance.freezeHead.rowNumber"
    :fixedRowHead="tableInstance.freezeHead.row"
    :uid="tableInstance.uid"
    :title="tableInstance.title"
    :chartData="chartData"
    :global="global"
    :chart="chart"
    @changePage="changePage"
    @click="clickChart"
    @change-columns="changeColumns"
    @refresh-end="refreshEnd"
  />
  <h3-crosstable
    v-else-if="chart.type === 'crosstable'"
    ref="crosstable"
    :delay="delay"
    :class="[`${prefixCls}__body`]"
    :realData="crosstableInstance.data"
    :total="crosstableInstance.total"
    :columnTotol="crosstableInstance.columnTotol"
    :alias="crosstableInstance.alias"
    :columns="crosstableInstance.columns"
    :list-text-align="tableInstance.listTextAlign"
    :rows="crosstableInstance.rows"
    :fontColor="crosstableInstance.fontColor"
    :isTransparent="crosstableInstance.isTransparent"
    :metric="crosstableInstance.metric"
    :landscape="landscape"
    :fontSize="tableInstance.fontSize"
    :isNo="crosstableInstance.moreOrderNumber.checked"
    :orderList="crosstableInstance.moreOrderNumber.uids"
    :columnsSetting="crosstableInstance.columnsSetting"
    :fixedColHead="crosstableInstance.freezeHead.column"
    :fixedRowHead="crosstableInstance.freezeHead.row"
    :fixedColNumber="crosstableInstance.freezeHead.rowNumber"
    :uid="crosstableInstance.uid"
    :title="crosstableInstance.title"
    :crossSummary="crosstableInstance.crossSummary"
    :pageSet="crosstableInstance.pageSet"
    :chartData="chartData"
    :global="global"
    :chart="chart"
    @changePage="refreshCrosstableData"
    @click="clickChart"
    @change-columns="changeColumns"
    @refresh-end="refreshEnd"
  />
  <Chart
    v-else-if="delayShow"
    ref="chart"
    :delay="delay"
    :refresh="true"
    :class="[`${prefixCls}__body`]"
    :options="chartInstance"
    :chartData="chartData"
    :api="api"
    @click="clickChart"
    @refresh-end="refreshEnd"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Inject } from "vue-property-decorator";
import Loading from "@h3/report-mobile/basics/components/loading";
import Chart from "../../chart/render-echart";
import List from "../../chart/list";
import H3Card from "../../chart/card";
import H3PivotTable from "../../chart/pivot-table";
import H3Crosstable from "../../chart/cross-table";
import { handleData } from "../../data/";
import ChartMixins from "@h3/report-mobile/basics/mixins/chart-mixins";
import { dashboardApi } from "@h3/report-mobile/basics/service/dashboard/";
import { ThemeColorType, chartTheme, paintsProDash } from "@h3/report-mobile/basics/enum/paint";
import H3ProgressBar from "../../chart/progress";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";

@Component({
  name: "h3-report-chart-wrap",
  components: {
    Chart,
    H3Card,
    Loading,
    H3PivotTable,
    H3Crosstable,
    List,
    H3ProgressBar
  }
})
export default class ReportChartWrap extends Mixins<ChartMixins>(ChartMixins) {
  @Prop({ default: null }) chart!: H3.Report.Chart;
  @Prop({ default: null }) global!: H3.Report.Global;
  @Prop({ default: null }) dataAlias!: { [key: string]: string }[];
  @Prop({ default: null }) data!: any;
  @Prop({ default: null }) source!: H3.Report.MapColumn | null;
  @Prop({ default: 200 }) delay!: number;
  @Prop({ default: 0 }) dataTotal!: number; // 明细表的总条数 其他图表暂时没有
  @Prop({ default: false }) refresh!: boolean;
  @Prop({ default: () => dashboardApi }) api!: H3.ReportAPI.Instance; // 请求实例
  @Prop({ default: false }) landscape!: boolean;
  @Prop({ default: false }) firstPaint!: boolean; // 是否首次渲染
  @Prop({ default: false }) mobileMode!: boolean; // 是否是移动端布局
  prefixCls = "h3-report-chart";
  // defaultListPageOption: H3.List.pageOptions = {
  //   pageSize: 10, // 页数大小
  //   pageIndex: 1 // 第几页
  // };
  // chartData!: H3.Chart.ChartData | Array<H3.Chart.ChartData>;
  crossPageOption = {
    pageSize: 10, // 页数大小
    pageIndex: 1, // 第几页
    colPageSize: 10,
    colPageIndex: 1
  };
  // 明细表局部loading
  refreshListLoading: boolean = false;
  // 交叉表局部loading
  refreshCrosstableLoading: boolean = false;

  convertedAlias: any = {};
  // 等别名数据处理完再渲染
  delayShow: boolean = false;
  /**
   * 字体大小
   */
  get fontSize() {
    const isTableType = this.chart && [ElementType.LIST, ElementType.CROSSTABLE, ElementType.TABLE].includes(this.chart.type);
    return this.chart &&
      this.chart.styles &&
      this.chart.styles.dataLabelFontSize &&
      !isMobile &&
      !this.mobileMode
      ? this.chart.styles.dataLabelFontSize.size
      : (isTableType && !isMobile && !this.mobileMode ? 13 : 12);
  }

  /**
   * 字体颜色对比
   */
  get fontColorSetting() {
    const globalFont = this.global.styles.fontSetting;
    const chartFont = this.chart.styles.fontSetting
      ? this.chart.styles.fontSetting
      : {
          titleColor: null,
          fontColor: null
        };
    let defaultFontColor = "";
    if (this.global && this.global.styles && this.global.styles.paintCoatTheme) {
      defaultFontColor = paintsProDash[this.global.styles.paintCoatTheme].fontColor;
    }
    return {
      titleColor: chartFont.titleColor || globalFont.titleColor,
      fontColor: chartFont.fontColor || globalFont.fontColor,
      defaultFontColor
    };
  }

  /**
   * 获取明细表实例
   */
  get listInstance() {
    let dimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.dimension) {
      dimension = this.chart.data.dimension.filter((item: H3.Report.FieldColumn) => item.type);
    }
    return {
      type: this.chart.type,
      data: this.data,
      alias: this.dataAlias,
      columns: dimension,
      orderNumber: this.chart.styles.orderNumber || {},
      freezeHead: this.chart.styles.freezeHead || {},
      listTextAlign: this.chart.styles.listTextAlign || {},
      columnsSetting:
        this.chart.data && this.chart.data.columns
          ? this.chart.data.columns
          : this.chart.columnsSetting
          ? this.chart.columnsSetting
          : [],
      uid: this.chart.uid,
      pageSet: this.chart.data.pageSet || {},
      fontSize: this.fontSize,
      fontColor: this.fontColorSetting.fontColor || this.fontColorSetting.defaultFontColor,
      isTransparent: ThemeColorType[this.global.styles.paintCoatTheme] === "dark"
    };
  }
  /**
   * 获取图表实例
   * 后续使用时，改用chartOptions
   */
  get chartInstance() {
    const colors = this.global.styles.theme ? this.global.styles.theme.colors : [];
    let dimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.dimension) {
      dimension = this.chart.data.dimension.filter((item: H3.Report.FieldColumn) => item.type);
    }
    let metric: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.metric) {
      metric = this.chart.data.metric.filter((item: H3.Report.FieldColumn) => item.type);
    }
    const axisY = this.chart.styles.axisY;
    if (axisY && axisY.rightYName && this.chart.type !== ElementType.BIAX) {
      axisY.rightYName = "";
    }
    return {
      type: this.chart.type,
      uid: this.chart.uid,
      data: this.data,
      mapSource: this.source,
      dataAlias: (this as any).$r_isWxwork ? this.convertedAlias : this.dataAlias,
      dimension: dimension ? dimension[0] : null,
      groupDimension: dimension ? dimension[1] : null,
      dimensionLimit: this.chart.styles.dimensionLimit,
      metric,
      metricGroup: this.chart.data.metricGroup,
      multiMetricType: this.chart.styles.multiMetricType,
      limit: this.chart.data.limit,
      linkage: this.chart.styles.linkage,
      fontSize: this.fontSize,

      colors:
        this.chart.styles.theme &&
        this.chart.styles.theme.colors &&
        this.chart.styles.theme.colors.length
          ? this.chart.styles.theme.colors
          : colors,
      direction: this.chart.styles.direction ? this.chart.styles.direction : null,
      metricRange: this.chart.styles.metricRange,
      multiRange: this.chart.styles.multiRange,
      dataLabel: this.chart.styles.dataLabel,
      dataLabelPileSum: this.chart.styles.dataLabelPileSum,
      multipleDataLabel: this.chart.styles.multipleDataLabel,
      legend: this.chart.styles.legend,
      axisX: this.chart.styles.axisX,
      axisY: axisY,
      axisYSet: this.chart.styles.axisYSet,
      splitLine: this.chart.styles.splitLine,
      chartSwitch: this.chart.data.chartSwitch,
      warningLine: this.chart.styles.warningLine,
      elementCoat: this.chart.styles.elementCoat,
      fontColor: this.fontColorSetting.fontColor,
      fontSetting: this.chart.styles.fontSetting,
      DataZoom: this.chart.styles.dataZoom,
      mapDrill: this.chart.styles.mapDrill,
      mapArea: this.chart.data.mapArea,
      mapTheme: this.chart.styles.mapTheme,
      mapMode: this.chart.styles.mapMode,
      conversion: this.chart.data.conversion,
      mapDigitalSet: this.chart.styles.mapDigitalSet,
      themeOptions: chartTheme[ThemeColorType[this.global.styles.paintCoatTheme]],
      isTransparent: ThemeColorType[this.global.styles.paintCoatTheme] === "dark",
      forecast: this.chart.data.forecast,
      sort: this.chart.data.sort,
      progressLabel: this.chart.styles.progressLabel,
      groupSetting: this.chart.data.groupSetting,
      customSort: this.chart.customSort,
      compareData: this.chart.data.compareData,
      invert: this.chart.data.invert ? this.chart.data.invert : null,
      mode: this.chart.data.invert ? this.chart.data.invert : null,
      pieMode: this.chart.styles.pieMode ? this.chart.styles.pieMode : { mode: "ring" },
      gaugeMode: this.chart.styles.gaugeMode ? this.chart.styles.gaugeMode : { mode: "in" },
      dataLabelPosition: this.chart.styles.dataLabelPosition
        ? this.chart.styles.dataLabelPosition
        : { position: "pie", detail: "out" },
      metricLabel:
        this.chart.styles.metricLabel !== undefined ? this.chart.styles.metricLabel : true,
      metricValue:
        this.chart.styles.metricValue !== undefined ? this.chart.styles.metricValue : true,
      lang: this.$r_languageType,
      defaultFontColor: this.fontColorSetting.defaultFontColor,
      isWxwork: (this as any).$r_isWxwork
    };
  }
  /**
   * 图表加载完
   */
  refreshEnd() {
    this.$emit("refresh-end");
  }
  /**
   * 获取图表实例
   */
  get cardInstance() {
    let metric: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.metric) {
      metric = this.chart.data.metric.filter((item: H3.Report.FieldColumn) => item.type);
    }
    return {
      type: this.chart.type,
      data: this.data,
      dataAlias: this.dataAlias,
      dimension: this.chart.data.dimension ? this.chart.data.dimension[0] : null,
      metric,
      customSort: this.chart.customSort,
      limit: this.chart.data.limit,
      cardMode: this.chart.styles.cardMode || { mode: "list" },
      cardSetting: this.chart.styles.cardSetting || { maxColumns: 4 },
      showTitle: this.chart.styles.metricLabel !== undefined ? this.chart.styles.metricLabel : true,
      size:
        this.chart.styles.adaptiveSize !== undefined ? this.chart.styles.adaptiveSize : "default",
      textAlign: this.chart.styles.textAlign !== undefined ? this.chart.styles.textAlign : "center",
      fontColor:
        this.fontColorSetting.fontColor ||
        (this.fontColorSetting.defaultFontColor === "#707481"
          ? "#121933"
          : this.fontColorSetting.defaultFontColor),
      isTransparent: ThemeColorType[this.global.styles.paintCoatTheme] === "dark"
    };
  }

  /**
   * 获取进度图实例
   */
  get progressInstance(): H3.Chart.ProgressBar {
    let colors =
      this.chart.styles &&
      this.chart.styles.theme &&
      this.chart.styles.theme.colors &&
      this.chart.styles.theme.colors.length
        ? this.chart.styles.theme.colors
        : [];

    if (!colors.length) {
      colors = this.global.styles.theme ? this.global.styles.theme.colors : [];
    }

    return {
      type: this.chart.type,
      uid: this.chart.uid,
      data: this.data,
      dataAlias: this.dataAlias,
      dimension: this.chart.data.dimension || [],
      metric: this.chart.data.metric || [],
      fontSize: this.fontSize,
      progressLabel: this.chart.styles.progressLabel,
      colors: colors,
      sortPercent: this.chart.data.sortPercent || 0,
      limit: this.chart.data.limit,
      fontColor: this.fontColorSetting.fontColor,
      isTransparent: ThemeColorType[this.global.styles.paintCoatTheme] === "dark",
      customSort: this.chart.customSort,
      defaultFontColor: this.fontColorSetting.defaultFontColor
    };
  }
  /**
   * 改变页码
   */
  changePage(data) {
    this.$emit("changePage", data);
  }
  /**
   * 下钻
   */
  drillDown(data) {
    this.$emit("drill-down", data);
  }
  /**
   * 获取表格实例
   */
  get tableInstance() {
    let dimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.dimension) {
      dimension = this.chart.data.dimension.filter((item: H3.Report.FieldColumn) => item.type);
    }
    let groupDimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.groupDimension) {
      groupDimension = this.chart.data.groupDimension.filter(
        (item: H3.Report.FieldColumn) => item.type
      );
    }
    let metric: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.metric) {
      metric = this.chart.data.metric.filter((item: H3.Report.FieldColumn) => item.type);
    }
    return {
      type: this.chart.type,
      data: this.data,
      alias: this.dataAlias,
      columns: dimension,
      rows: groupDimension,
      pageSet: this.chart.data.pageSet || { size: 10, rowSize: 10 },
      total:
        this.data && this.data.data
          ? this.data.data.length
          : this.data && this.data.summary
          ? 1
          : 0,
      metric,
      orderNumber: this.chart.styles.orderNumber || {},
      freezeHead: this.chart.styles.freezeHead || {},
      listTextAlign: this.chart.styles.listTextAlign || {},
      fontSize: this.fontSize,
      columnsSetting:
        this.chart.data && this.chart.data.columns
          ? this.chart.data.columns
          : this.chart.columnsSetting
          ? this.chart.columnsSetting
          : [],
      uid: this.chart.uid,
      title: this.chart.title,
      fontColor: this.fontColorSetting.fontColor || this.fontColorSetting.defaultFontColor,
      isTransparent: ThemeColorType[this.global.styles.paintCoatTheme] === "dark"
    };
  }

  /**
   * 获取交叉表实例
   */
  get crosstableInstance() {
    let dimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.dimension) {
      dimension = this.chart.data.dimension.filter((item: H3.Report.FieldColumn) => item.type);
    }
    let groupDimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.groupDimension) {
      groupDimension = this.chart.data.groupDimension.filter(
        (item: H3.Report.FieldColumn) => item.type
      );
    }
    let metric: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.metric) {
      metric = this.chart.data.metric.filter((item: H3.Report.FieldColumn) => item.type);
    }
    return {
      type: this.chart.type,
      data: this.data,
      alias: this.dataAlias,
      columns: dimension,
      rows: groupDimension,
      pageSet: this.chart.data.pageSet || {},
      fontSize: this.fontSize,
      total: this.data && this.data.total ? this.data.total : 0,
      columnTotol: this.data && this.data.columnTotal ? this.data.columnTotal : 0,
      metric,
      orderNumber: this.chart.styles.orderNumber || {},
      moreOrderNumber: this.chart.data.moreOrderNumber || {},
      freezeHead: this.chart.styles.freezeHead || {},
      listTextAlign: this.chart.styles.listTextAlign || {},
      columnsSetting:
        this.chart.data && this.chart.data.columns
          ? this.chart.data.columns
          : this.chart.columnsSetting
          ? this.chart.columnsSetting
          : [],
      uid: this.chart.uid,
      title: this.chart.title,
      fontColor: this.fontColorSetting.fontColor || this.fontColorSetting.defaultFontColor,
      crossSummary: this.chart.data.crossSummary ? this.chart.data.crossSummary : null,
      isTransparent: ThemeColorType[this.global.styles.paintCoatTheme] === "dark"
    };
  }
  initMapCallBack(obj) {
    return () => {
      this.refreshMapData(obj);
    };
  }
  /**
   * 图表点击
   * @param option  { filters, params }
   */
  clickChart(option: { filters: Array<H3.Report.FilterFieldColumn>; params: any }) {
    let mapCallBack; // 用来做地图的回调函数
    if (this.chart.type === "map" && option.params && option.params.data) {
      const data = option.params.data;
      const obj = {
        mapDrill: data
      };
      const clickType = option.params.clickType; //点击的是上方graphic会有这个值
      const jumpLink = this.chart.styles.jumpLink || [];
      //将地图下钻放在回调函数中 方便其它地方回调
      mapCallBack = this.initMapCallBack(obj);

      if (clickType === "graphic" || !jumpLink.length) {
        //直接执行地图逻辑
        if (this.chart.styles.mapDrill && this.chart.styles.mapDrill.drill !== "disabled") {
          mapCallBack();
        }
        this.$emit("click-chart", option);
      } else {
        if (this.chart.styles.mapDrill && this.chart.styles.mapDrill.drill !== "disabled") {
          option.params.mapCallBack = mapCallBack;
        }
        //option.params.mapCallBack = mapCallBack;
        this.$emit("click-chart", option);
      }
    } else {
      this.$emit("click-chart", option);
    }
  }
  /**
   * 刷新地图数据
   */
  refreshMapData(params) {
    this.$emit("load-chart-data", {
      isLoading: true, // 需要loading更新
      params,
      callback: () => {}
    });
  }
  /**
   * 刷新明细表分页数据
   */
  refreshListData(params) {
    // this.defaultListPageOption = params;
    this.refreshListLoading = true;
    this.changePage(params);
    this.$emit("load-chart-data", {
      isLoading: false,
      params,
      callback: () => {
        this.refreshListLoading = false;
      }
    });
  }
  /**
   * 刷新交叉表分页数据
   */
  refreshCrosstableData(params) {
    this.refreshCrosstableLoading = true;
    this.changePage(params);
    this.$emit("load-chart-data", {
      isLoading: false,
      params,
      callback: () => {
        this.refreshCrosstableLoading = false;
      }
    });
  }
  /**
   * 明细表/透视表 列宽更改
   */
  changeColumns(options) {
    // todo 移到data里面
    this.chart.columnsSetting = options;
    this.$emit("change", this.chart, options);
  }
  /**
   * 刷新图表视图样式
   */
  refreshViewStyles() {
    if (this.$refs.chart) {
      (this.$refs.chart as any).refreshChartStyles();
    }
    if (this.$refs.table) {
      (this.$refs.table as any).refreshTable();
    }
    if (this.$refs.crosstable) {
      (this.$refs.crosstable as any).refreshTable();
    }
    if (this.$refs.list) {
      (this.$refs.list as any).initList();
    }
    if (this.$refs.progress) {
      (this.$refs.progress as any).refreshProcess();
    }
  }
  /**
   * 刷新图表视图
   * !当新增了一种额外的图表时，务必在这里追加图表的初始化方法，否则无法主动更新图表
   */
  refreshChartView() {
    const chart: any = this.$refs.chart as Vue;
    const table: any = this.$refs.table as Vue;
    const crosstable: any = this.$refs.crosstable as Vue;
    const card: any = this.$refs.card as Vue;
    const list: any = this.$refs.list as Vue;
    const progress: any = this.$refs.progress as Vue;
    if (chart) {
      chart.delayInitChart();
    } else if (table) {
      table.initTableData();
    } else if (crosstable) {
      crosstable.initTableData();
    } else if (card) {
      card.initCard();
    } else if (list) {
      list.initList();
    } else {
      if (progress) {
        progress.initProgress();
      }
    }
  }
  /**
   * 统一数据处理
   */
  get chartData(): H3.Chart.ChartData | Array<H3.Chart.ChartData> {
    switch (this.chart.type) {
      case ElementType.TABLE:
        return handleData(this.tableInstance);
      case ElementType.CROSSTABLE:
        return handleData(this.crosstableInstance);
      case ElementType.LIST:
        return handleData(this.listInstance);
      case ElementType.CARD:
        return handleData(this.cardInstance);
      case ElementType.PROGRESSBAR:
        return handleData(this.progressInstance);
      default:
        return handleData(this.chartInstance);
    }
  }
  // mounted() {
  //   this.chartData = handleData(this.options);
  // }
  /**
   *  更新图表数据 只更新数据 不重新刷新
   */
  refrashByOptions() {
    const chart: any = this.$refs.chart as Vue;
    // const table: any = this.$refs.table as Vue;
    // const card: any = this.$refs.card as Vue;
    // const list: any = this.$refs.list as Vue;
    // const progress: any = this.$refs.progress as Vue;

    if (chart) {
      chart.refrashByOptions();
      // } else if (progress) {
      //   progress.initProgress();
    }
  }

  getOpenData(list) {
    return new Promise((resolve, reject) => {
      (window as any).top.WWOpenData.prefetch({ items: list }, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }
  /**
   *  别名对象重新设置
   * @param
   */
  async changeAlias(aliasData) {
    let alias = JSON.parse(JSON.stringify(aliasData));
    const itemArr: any = [];
    Object.keys(alias).forEach(key => {
      const type = this.getFieldType(key.split("_")[0]);
      type &&
        itemArr.push({
          type,
          id: alias[key]
        });
    });
    let result: any = await this.getOpenData(itemArr);
    if (result && result.items) {
      result.items.forEach(obj => {
        const datakey = Object.keys(aliasData).find(key => aliasData[key] === obj.id);
        if (datakey) {
          alias[datakey] = obj.data;
        }
      });
    }
    return alias;
  }
  /**
   * 获取字段类型
   * @param uid
   */
  getFieldType(uid) {
    const orgList = [261, 271];
    const userList = [260, 270];
    const dim = this.chart.data.dimension.find(
      item => item.uid.toUpperCase() === uid.toUpperCase()
    );
    if (dim && userList.includes(dim.dataType)) {
      return "userName";
    }
    if (dim && orgList.includes(dim.dataType)) {
      return "departmentName";
    }
    return "";
  }

  async created() {
    this.delayShow = false;
    if ((this as any).$r_isWxwork) {
      this.convertedAlias = await this.changeAlias(this.dataAlias);
    }
    this.delayShow = true;
  }
}
</script>
