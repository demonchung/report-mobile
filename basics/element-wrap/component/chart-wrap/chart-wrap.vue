<template>
  <div :class="prefixCls" :style="getStyle">
    <loading v-if="loading"/>
    <template v-else>
      <chart-wrap-placeholder
        v-if="showPlaceholder"
        :chart="chart"
        :com-prefix-cls="prefixCls"
        :data="isData"
        :error-msg="errMsg"
        :is-load-data="isLoadData"
        :global="global"
      />
      <chart
        v-else
        ref="chart"
        :chart="chart"
        :global="global"
        :dataAlias="dataAlias"
        :data="innerData"
        :source="source"
        :api="api"
        :delay="delay"
        :data-total="dataTotal"
        :refresh="refresh"
        :landscape="landscape"
        :firstPaint="firstPaint"
        :startLog="startLog"
        :mobileMode="mobileMode"
        :globalFilters="globalFilters"
        @click-chart="clickChart"
        @dblClickChart="dblClickChart"
        @refresh-end="refreshEnd"
        @load-chart-data="loadChartData"
        @change="changeChart"
        @changePage="changePage"
        @drill-down="drillDown"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import Loading from "@h3/report-mobile/basics/components/loading";
import { dashboardApi } from "@h3/report-mobile/basics/service/dashboard/";
import ChartMixins from "@h3/report-mobile/basics/mixins/chart-mixins";
import { ReportState } from "@h3/report-mobile/basics/enum/report-state";
import { ResizeSensor } from "css-element-queries";
import ChartWrapPlaceholder from "./placeholder.vue";
import Chart from "./chart.vue";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { handleChartRequestParams } from "@h3/report-mobile/basics/utils/report-element";
import { resultFilterData } from "@h3/report-mobile/basics/utils/result-filter";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";
import Toast from "@h3/report-mobile/basics/components/toast"
import { throttle } from 'lodash';
Vue.use(Toast);


@Component({
  name: "h3-report-chart-wrap",
  components: {
    Chart,
    Loading,
    ChartWrapPlaceholder
  }
})
export default class ReportChartWrap extends Mixins<ChartMixins>(ChartMixins) {
  @Prop({ default: null }) chart!: H3.Report.Chart;
  @Prop({ default: null }) global!: H3.Report.Global;
  @Prop({ default:  ()=> {}  }) dataSources!: { [dataSourceId: string]: any };
  @Prop({ default: () => dashboardApi }) api!: H3.ReportAPI.Instance;
  @Prop({ default: ReportState.DESIGN }) status!: ReportState;
  @Prop({ default: false }) refresh!: boolean;
  @Prop({ default: '' }) autType!: string;
  @Prop({ default: null }) computedStyle!: any;
  @Prop({ default: false }) landscape!: boolean;

  @Prop({ default: 200 }) delay!: number;
  @Prop({ default: null }) corpId!: string;
  @Prop({ default: null }) data!: any;
  @Prop({ default: false }) startLog!: boolean;
  @Prop({ default: false }) mobileMode!: boolean;
  @Prop({ default: () => [] }) globalFilters!: Array<H3.Report.GlobalFilter>

  
  prefixCls = "h3-report-chart";
  dataAlias = {};
  source: H3.Report.MapColumn | null = null; // 数据来源，暂时只有地图类型有
  innerData: any = null;
  updateTimer: any = 0;
  loading = false;
  errMsg: string | boolean = false;
  // 明细表的总条数 其他图表暂时没有
  dataTotal: number = 0;
  isLoadData = false;
  wrapWidth = 0;
  resizeSensor: ResizeSensor | null = null;
  firstPaint: boolean = true; //
  errorMessage: any;

  @Watch("data", { immediate: true })
  watchData() {
    if (this.data) {
      this.isLoadData = true;
      this.innerData = this.data;
    }
  }
  /**
   * 是否展示占位图
   */
  get showPlaceholder() {
    let show = true;
    if (
      this.chart &&
      this.checkChart &&
      this.isLoadData &&
      !this.errMsg &&
      this.isData &&
      this.isData.length 
     ) {
      show = false;
    }
    return show;
  }

  /**
   * 获取图表wrap样式
   */
  get getStyle() {
    const paintCoatTheme = this.global && this.global.styles.paintCoatTheme;
    const style: any = {};
    if (this.computedStyle) {
      if (this.computedStyle.height) {
        style.height = `${this.computedStyle.height}px`;
      }
      if (this.computedStyle.width) {
        style.width = `${this.computedStyle.width}px`;
      }
    }
    style.backgroundColor = paintCoatTheme === "default" ? "inherit" : "transparent";
    return style;
  }
  /**
   * 判断图表是否有数据
   */
  get isData() {
    let data: any = null;
    if (this.innerData) {
      if (this.chart.type === "table" || this.chart.type === "crosstable") {
        if (this.innerData.data || this.innerData.summary) {
          data = this.innerData.data || this.innerData.summary;
        }
      } else {
        data = this.innerData;
      }
    }

    return data;
  }
  /**
   * 表格列宽改变
   */
  changeChart(chart: H3.Report.Chart, options) {
    this.$emit("change", chart, options);
  }
  /**
   * 改变页码
   */
  changePage(data) {
    this.$emit('changePage',data);
  }
  /**
   * 下钻
   */
  drillDown(data) {
    this.$emit("drill-down", data);
  }
  
  emitLog(type,data: any= null) {
    if(this.firstPaint) {
      let params:any = {type};
      if(data) {
        Object.assign(params,data);
      }
      this.$emit('log',params); 
    }
  }
  /**
   * 图表加载完
   */
  refreshEnd() {
    this.emitLog('end');
    this.firstPaint = false;
    this.$emit("refresh-end");
  }
  /**
   * 图表点击
   *    * @param option  { filter, params }
   */
  clickChart(option: { filters: Array<H3.Report.FieldColumn>; params: any }) {
    this.$emit("click-chart", option);
  }
  dblClickChart(option){
    this.$emit("dblClickChart", option);
  }
  /**
   * 刷新图表视图
   */
  refreshChartView() {
    if (this.$refs.chart) {
      (this.$refs.chart as any).refreshChartView();
    }
  }
  /**
   * 加载图表数据
   */
  loadChartData({ isLoading, params, callback }: any = { isLoading: true }) {
    this.$emit("before-update-data");
    if (!this.checkChart) {return;}
    clearTimeout(this.updateTimer);
    this.loading = isLoading;
    this.updateTimer = setTimeout(async () => {
      this.handleChartData(params, callback);
    }, this.delay);
  }
  /**
   * 只刷新图表视图渲染
   */
  refreshViewStyles() {
    if (this.$refs.chart) {
      (this.$refs.chart as any).refreshViewStyles();
    }
  }
  getAggregateChart(chart) {
    let resultChart = JSON.parse(JSON.stringify(chart));
    resultChart.dimension.length && resultChart.dimension.forEach((item) => {
      if (item.type === 'number' && item.options.aggregateType) {
        resultChart.metric.push(item);
      }
    });
    resultChart.dimension = [];
    return resultChart;
  }


  /**
   * 加载图表数据
   */
  handleChartData(params?: any, callback?: Function) {
    let dataSources: any = this.dataSources;
    if(this.dataSources[(this.chart as any).dataSourceId] === null) {
      this.loading = false;
       this.errMsg = "error-chart";
      return;
    }
    const sendChart: H3.ReportAPI.Chart = handleChartRequestParams(
      this.chart,
      params,
      this.filters,
      dataSources,
      this.globalFilters
    );
    const oldTime = Date.now();
    this.api
      .getChartData(sendChart, this.corpId,this.$r_languageType,this.autType)
      .then((res: H3.DashboardAPI.ChartRealData) => {
        if(this.firstPaint) {
           this.emitLog('mergin', { 
            params: {
              traceId: res.traceId,
              funcName: res.url
            },
            data: {
               interfaceTime: Date.now() - oldTime 
            }});
          //  this.$emit('log',{type: 'mergin',data : { traceId: res.traceId,url: res.url }}) 
        }
        if (!(window as any).H3reportChartDatas) {(window as any).H3reportChartDatas = {};}
        (window as any).H3reportChartDatas[this.chart.uid] = res.series;
        this.errMsg = false;
        this.innerData = resultFilterData(res.series, this.chart) || [];
        this.dataAlias = res.alias || {};
        this.$emit('getAlias',this.dataAlias)
        this.dataTotal = res.total || 0;
        this.loading = false;
        this.source = res.source || null;
        this.isLoadData = true;

        if (sendChart.type === ElementType.LIST) {
          const aggregateChart = this.getAggregateChart(sendChart);
          if (aggregateChart.metric.length) {
            this.api
            .getChartData(aggregateChart, this.corpId,this.$r_languageType,this.autType)
            .then((result: any) => {
              console.log('底部汇总', result);
              this.$set(this.chart, 'listSummary', result.series);
            })
          }
        } 
        callback && callback();
        res && this.$emit("update-charts-data", this.innerData);
      })
      .catch(res => {
        this.errMsg = res.code;
        this.innerData = [];
        this.dataAlias = {};
        this.dataTotal = 0;
        this.loading = false;
        this.isLoadData = true;
        callback && callback();
        if (res && isMobile ) { 
          console.log(Vue.prototype)
          this.errorMessage = res.errorMessage;
          //this.$toasts(this.errorMessage)
      } 
      })
  }
  
  /**
   * 刷新图表
   */
  refreshChart() {
    if (!this.checkChart) {return;}
    if (this.isLoadData) {
      this.refreshChart();
    } else {
      this.loadChartData();
    }
  }
  /**
   * 只加载一次图表
   */
  onlyLoadChart() {
    if (!this.isLoadData) {
      this.emitLog('start');
      this.loadChartData();
    }
  }
  checkNeedrefreshChart (type){
    return (
      // type === ElementType.TABLE || 
      // type === ElementType.CROSSTABLE || 
      // type === ElementType.LIST ||
      type === ElementType.PROGRESSBAR || 
      type === ElementType.CARD) 
  }
  /**
   * 只获取数据
   */
  onlyGetData({ isLoading, params, callback }: any = { isLoading: true }) {
    this.handleChartData(params, () => {
      callback && callback();
      if (this.$refs.chart) {
        (this.$refs.chart as any).refrashByOptions();
      }
    });
  }
  /**
   * 注册函数
   */
  registerFun() {
    if (this.chart) {
      this.$emit("register-refresh", {
        data: this.loadChartData,
        view: this.refreshChartView,
        load: this.onlyLoadChart,
        onlyGetData: this.onlyGetData,
        refreshViewStyles: this.refreshViewStyles
      });
    }
  }
  handleResize(e) {
    if (e.width !== this.wrapWidth && !(this.checkNeedrefreshChart(this.chart.type))) {
      this.wrapWidth = e.width;
      this.refreshViewStyles();
    }
  }
  created() {
    this.registerFun();
  }
  mounted() {
    if (this.refresh) {
      this.refreshChart();
    }
   

    this.wrapWidth = this.$el.clientWidth;
    // this.resizeSensor = new ResizeSensor(this.$el as HTMLDivElement, e => {
    //   if (e.width !== this.wrapWidth && !(this.checkNeedrefreshChart(this.chart.type))) {
    //     this.wrapWidth = e.width;
    //     this.refreshViewStyles();
    //   }
    // });
    this.handleResize = throttle(this.handleResize, 500); // 使用throttle函数进行函数节流
    this.resizeSensor = new ResizeSensor(this.$el as HTMLDivElement, this.handleResize);
  }

  destroyed() {
    if (this.resizeSensor) {
      this.resizeSensor.detach();
    }
  }
}
</script>
