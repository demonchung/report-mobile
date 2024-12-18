<template>
  <div :class="getClass" :style="getStyle">
    <div
      v-if="!loading && charts.length"
      v-h3-lazy-load="{ selector: `.${prefixCls}__item`, callback: lazyLoadChart, delay: 500 }"
      :class="getCanvasClass"
    >
      <h3-grid-layout
        ref="gridLayout"
        :layout="showCharts"
        :col-num="getLayoutOptions.colNum"
        :row-height="getLayoutOptions.rowHeight"
        :margin="getLayoutOptions.margin"
        :showGridLine="getLayoutOptions.showGridLine"
        :is-draggable="getLayoutOptions.draggable"
        :is-resizable="getLayoutOptions.resizable"
        :vertical-compact="true"
        :use-css-transforms="true"
        :responsive="getLayoutOptions.responsive"
      >
        <h3-grid-item
          v-for="(item, i) in showCharts"
          :style="getItemStyles"
          :class="[prefixCls + '__item', item.class]"
          :key="item.__key__"
          :id="item.dataSourceId"
          :handleActive="item.handleActive"
          :tabindex="i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :static="true"
          :data-id="item.uid"
          :minH="item.minH"
          :minW="item.minW"
          :maxH="item.maxH"
          :maxW="item.maxW"
        >
          <!-- 图表内容 -->
          <!-- @drill-down="drillDown" -->
          <h3-report-element
            ref="elementWrap"
            :element="item"
            :key="item.uid"
            :global="global"
            :refresh="false"
            :data-id="item.uid"
            :api="api"
            :comPrefixCls="prefixCls"
            @full-screen="fullScreen"
            @dblClickChart="dblClickChart"
            @clicktoNextLayer="clicktoNextLayer"
            @clickTableDetail="clickTableDetail"
            @changeActiveTab="changeActiveTab($event, item)"
          >
            <template v-if="item.type === 'tab'" slot="tabContent" slot-scope="{ data }">
              <h3-grid-layout
                :ref="item.uid"
                :layout="tabsMapping[item.uid][data].charts"
                :col-num="getLayoutOptions.colNum"
                :row-height="getLayoutOptions.rowHeight"
                :margin="getLayoutOptions.margin"
                :showGridLine="getLayoutOptions.showGridLine"
                :is-draggable="getLayoutOptions.draggable"
                :is-resizable="getLayoutOptions.resizable"
                :vertical-compact="true"
                :use-css-transforms="true"
                :responsive="getLayoutOptions.responsive"
              >
                <h3-grid-item
                  v-for="(params, i) in tabsMapping[item.uid][data].charts"
                  :style="getItemStyles"
                  :class="[prefixCls + '__item', params.class]"
                  :key="params.__key__"
                  :id="params.dataSourceId"
                  :handleActive="params.handleActive"
                  :tabindex="i"
                  :x="params.x"
                  :y="params.y"
                  :w="params.w"
                  :h="params.h"
                  :i="params.i"
                  :static="true"
                  :data-id="params.uid"
                  :minH="params.minH"
                  :minW="params.minW"
                  :maxH="params.maxH"
                  :maxW="params.maxW"
                >
                  <!-- 图表内容 -->
                  <!-- @drill-down="drillDown" -->
                  <h3-report-element
                    ref="elementWrap"
                    :element="params"
                    :key="params.uid"
                    :global="global"
                    :refresh="false"
                    :data-id="params.uid"
                    :api="api"
                    :comPrefixCls="prefixCls"
                    @full-screen="fullScreen"
                    @dblClickChart="dblClickChart"
                    @clicktoNextLayer="clicktoNextLayer"
                    @clickTableDetail="clickTableDetail"
                    @clickChart="clickChart"
                  />
                </h3-grid-item>
              </h3-grid-layout>
            </template>
          </h3-report-element>
        </h3-grid-item>
      </h3-grid-layout>
      <backdoor><br /></backdoor>
      <div @click="refreshCharts" :class="[`${prefixCls}__icon-wrap`, `${prefixCls}__refresh-btn`]">
        <h3-svg name="a-sync1" h="20" w="20"></h3-svg>
      </div>
      <filter-entry v-if="showFilter" :comPrefixCls="prefixCls" />
      <full-screen
        ref="fullScreen"
        v-if="fullScreenCharts"
        :comPrefixCls="prefixCls"
        :theme="getStyle"
        :global="global"
        :elements="fullScreenCharts"
        @full-screen="fullScreen"
        @clickTableDetail="clickTableDetail"
      />
      <h3-action-sheet
        v-model="showActionSheet"
        :menus="actionSheetMenus"
        :maskClosable="true"
        @select="clickActionSheetMenu"
        showCancel
      />
      <GlobalDetail
        v-if="showGlobalDetail"
        @close="showGlobalDetail = false"
        :globalDetailOption="globalDetailOption.tableDetail"
      ></GlobalDetail>
    </div>
    <div
      v-else-if="!loading && !charts.length"
      :class="[`${prefixCls}__canvas`, `${prefixCls}__canvas--empty`]"
    >
      <img src="@h3/report-mobile/basics/assets/common/m-empty.svg" />
      <label>当前页无图表，请先在电脑端配置图表</label>
    </div>
    <h3-loading v-else />
  </div>
</template>

<script lang="ts">
import "@h3/report-mobile/basics/components/language/main.js";
import { Component, Prop, Vue, Provide, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import "@h3/thinking-ui/dist/index.css";
import H3ReportElement from "./element";
import { H3GridLayout } from "@h3/awesome-ui";
import FilterEntry from "./filter-picker";
import FullScreen from "./full-screen.vue";
import { getNewReportState } from "@h3/report-mobile/basics/store/dashboard";
import { ReportMutation, ReportAction } from "@h3/report-mobile/basics/store/dashboard/types";
import H3Loading from "@h3/report-mobile/basics/components/loading";
import { judgeMobile } from "@h3/report-mobile/basics/utils/browser";
import H3LazyLoad from "@h3/report-mobile/basics/directives/lazy-load";
import { Color, paints } from "@h3/report-mobile/basics/enum/paint";
import options from "@h3/report-mobile/dist/options";
import { ReportState } from "@h3/report-mobile/basics/enum/report-state";
import Backdoor from "@h3/report-mobile/basics/components/mobile-backdoor";
import { dashboardApi } from "@h3/report-mobile/basics/service/dashboard";
import { CoatType, paintsPro, ThemeColorType } from "@h3/report-mobile/basics/enum/paint";
import GlobalDetail from "./globalDetail";
import { H3ActionSheet, H3Button } from "@h3/thinking-ui";
const ReportPro = namespace("report");
import errorMseeage from "./show-tip/show-tip";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
options.message = {
  error: errorMseeage.error
};

@Component({
  name: "h3-dashboard-mobile",
  components: {
    H3ReportElement,
    FullScreen,
    H3Loading,
    H3GridLayout,
    H3GridItem: H3GridLayout.Item,
    FilterEntry,
    Backdoor,
    GlobalDetail,
    H3Button,
    H3ActionSheet,
    H3Svg: Svg
  },
  directives: {
    H3LazyLoad
  }
})
export default class DashboardMobile extends Vue {
  @Prop({ default: null }) value!: string; // 报表标题
  @Prop({ default: null }) corpId!: string; // 公司Id
  @Prop({ default: null }) reportId!: string; // 报表Id
  @Prop({ default: () => false }) isWxwork!: boolean;
  @Prop({ default: () => ({}) }) config!: any; // 业务配置
  @Prop({ default: () => null }) integrateComponents!: Function; // 业务整合的服务
  @Prop({ default: () => null }) classification!: Function; // 字段类型分类
  @Prop({ default: () => null }) header!: any; // 头部控件
  @ReportPro.State("global") global!: H3.Report.Global;
  @ReportPro.State("charts") charts!: Array<H3.Report.Chart>;
  @ReportPro.State("tabsMapping") tabsMapping!: any;
  @ReportPro.Action(ReportAction.GETREPORT) getReport!: Function;
  @ReportPro.Mutation(ReportMutation.INITREPORT) initReport!: Function;
  @ReportPro.Mutation(ReportMutation.SETREPORTOPTIONS) setReportOptions!: Function;
  @ReportPro.Mutation(ReportMutation.RESIZECHARTVIEW) resizeChartView!: Function;
  @ReportPro.Action(ReportAction.SETDEFAULTGLOBAL) setDefaultGlobal!: Function;
  @ReportPro.Mutation(ReportMutation.UPDATETABMAPPING) updateTabMapping!: Function;
  @ReportPro.Mutation(ReportMutation.UPDATEMOBILETABMAP) updateMobileTabMap!: Function;

  AllowThemes = [
    "default",
    "theme5",
    "theme6",
    "theme7",
    "theme8",
    "theme9",
    "theme10",
    "theme11",
    "theme12"
  ];
  api = dashboardApi;
  getLayoutOptions: any = {
    draggable: false,
    margin: [8, 8],
    showGridLine: false,
    mask: true,
    editState: true,
    resizable: false,
    responsive: false,
    colNum: 16,
    rowHeight: 16
  };
  showCharts: any = [];
  showGlobalDetail: boolean = false;
  globalDetailOption: any = [];
  showActionSheet: boolean = false;
  actionSheetMenus: Array<any> = [
    {
      label: "详情",
      value: "detail"
    },
    {
      label: "下钻/联动",
      value: "next"
    }
  ];

  @Provide() isMobile = true;

  @Provide() getWxEnv = () => {
    return this.isWxwork;
  };
  /**
   * 监听环境变量
   */
  @Watch("isWxwork", { immediate: true })
  watchIsWxwork(val) {
    if ((this as any).r_envState) {
      (this as any).r_envState.entry = val ? "wxwork" : "";
    }
  }
  prefixCls = "h3-dashboard-mobile";
  loading = true;
  fullScreenCharts: H3.Report.Chart | null = null;

  get getItemStyles() {
    if (this.global.styles.paintCoatTheme === "default") {
      return { backgroundColor: this.global.styles.elementCoat.value };
    } else {
      return { backgroundColor: "transparent" };
    }
  }
  timer: any = null;
  /**
   * 是否展示过滤器
   */
  get showFilter() {
    return options.mobile && options.mobile.filter;
  }
  @Watch("charts")
  watchCharts(val) {
    if (val.length) {
      this.showCharts = this.handleChartsPositions();
      this.updateMobileTabMap(true);
      this.updateTabMapping();
    }
  }

  /**
   * 点击下钻时触发
   */
  clicktoNextLayer(e) {
    this.$nextTick(() => {
      this.showCharts = this.handleChartsPositions();
      this.updateTabMapping();
      this.updateMobileTabMap(true);
    });
  }
  handleChartsPositions() {
    let charts: Array<H3.Report.Chart> = this.charts.filter(
      (item: H3.Report.Chart | H3.Report.FilterPicker) => {
        return item.type !== "filterPicker";
      }
    );
    charts = charts.sort((chart1: H3.Report.Chart, chart2: H3.Report.Chart) => {
      if (chart1.y < chart2.y || (chart1.y === chart2.y && chart1.x < chart2.x)) {
        return -1;
      }
      return 1;
    });
    const hasMobileOptions = charts.some(item => item.mobileOptions && item.mobileOptions.position);
    if (hasMobileOptions) {
      charts = charts.map(item => Object.assign(item, item.mobileOptions.position));
    } else {
      charts = charts.map((item, index) => {
        item.mobileOptions.position = {
          x: 0,
          y: index * 10,
          w: 16,
          h: 10,
          i: item.i
        };
        item.mobileOptions.visible = true;
        return Object.assign(item, item.mobileOptions.position);
      });
    }
    return charts.filter(item => item.mobileOptions && item.mobileOptions.visible && !item.tabUid);
  }
  /**
   * 获取图表集合
   */
  get getCharts() {
    let charts: Array<H3.Report.Chart> = this.charts.filter(
      (item: H3.Report.Chart | H3.Report.FilterPicker) => {
        return item.type !== "filterPicker";
      }
    );
    charts = charts.sort((chart1: H3.Report.Chart, chart2: H3.Report.Chart) => {
      if (chart1.y < chart2.y || (chart1.y === chart2.y && chart1.x < chart2.x)) {
        return -1;
      }
      return 1;
    });
    const hasMobileOptions = charts.some(item => item.mobileOptions && item.mobileOptions.position);
    if (hasMobileOptions) {
      charts = charts.map(item => Object.assign(item, item.mobileOptions.position));
    } else {
      charts = charts.map((item, index) => {
        item.mobileOptions.position = {
          x: 0,
          y: index * 10,
          w: 16,
          h: 10,
          i: item.i
        };
        item.mobileOptions.visible = true;
        return Object.assign(item, item.mobileOptions.position);
      });
    }
    //  //获取图表最新位置
    // let checkCharts = charts.filter(item => item.mobileOptions && item.mobileOptions.visible);
    // let y = 0;
    // let h = 0;
    // let resultCharts: Array<H3.Report.Chart> = checkCharts.filter(
    //   (item: H3.Report.Chart) => {
    //     item.y = y + h;
    //     y = item.y;
    //     h = item.h;
    //     return item;
    //   }
    // );
    // return resultCharts;
    // this.showCharts = charts.filter(item => item.mobileOptions && item.mobileOptions.visible);
    return charts.filter(item => item.mobileOptions && item.mobileOptions.visible);
  }
  /**
   * 获取筛选器集合
   */
  get getFilters() {
    return this.charts.filter((item: H3.Report.Chart | H3.Report.FilterPicker) => {
      return item.type === "filterPicker";
    });
  }
  /**
   * 获取class
   */
  get getClass() {
    return {
      [this.prefixCls]: true,
      [judgeMobile() as string]: true,
      "h3-report-paint": this.global.styles.paintCoatTheme !== "default",
      [this.global.styles.paintCoatTheme]: true
    };
  }
  get getCanvasClass() {
    return {
      [`${this.prefixCls}__canvas`]: true,
      [`${this.prefixCls}__canvas--full`]: this.fullScreenCharts
    };
  }
  /**
   * 获取样式
   */
  get getStyle() {
    if (!this.global.styles.paintCoatTheme) {
      return true;
    }
    if (!this.AllowThemes.includes(this.global.styles.paintCoatTheme)) {
      return true;
    }
    const paintCoat: H3.Report.PaintCoat = this.global.styles.paintCoat;
    const picOpt: any = {
      transition: "all .3s"
    };
    if (paintCoat.type === CoatType.BGCOLOR) {
      Object.assign(picOpt, {
        background: paintCoat.value
      });
    } else {
      if (paintCoat.type === CoatType.BGPICTURE) {
        const bgUrl: string = require(`@h3/report-mobile/basics/assets/dashboard-pro/theme/${paintCoat.value}`);
        Object.assign(picOpt, {
          backgroundImage: "url(" + bgUrl + ")",
          "background-size": "100% 100%"
        });
      }
    }
    return picOpt;
  }

  /**
   * 下钻
   */
  drillDown(data) {
    this.$emit("drillDown", data);
  }
  /**
   * 刷新图表
   */
  refreshCharts() {
    clearTimeout(this.timer);
    this.showCharts = this.handleChartsPositions();
    let charts = this.showCharts;
    this.updateTabMapping();
    this.updateMobileTabMap(true);
    this.timer = setTimeout(() => {
      charts.forEach(chart => {
        this.resizeChartView && this.resizeChartView({ chart, type: "data" });
      });
    }, 700);
  }

  // 切换dom时
  changeActiveTab(tabInfo, chart) {
    const { currIndex, isChangeIdx } = tabInfo;
    // 切换tab时,图表不刷新问题
    this.$nextTick(() => {
      if (chart && isChangeIdx) {
        if (this.tabsMapping && this.tabsMapping[chart.uid] && this.tabsMapping[chart.uid][currIndex]) {
          const resCharts = this.tabsMapping[chart.uid][currIndex].charts;
          if (resCharts && resCharts.length) {
            resCharts.forEach((item: any) => {
              this.resizeChartView && this.resizeChartView({ chart: item, type: "data" });
            });
          }
        }
      }
    });
  }

  /**
   * 设置仪表盘配置项
   */
  setDashboardOptions(): void {
    const dashboardOptions: any = {};
    if (this.corpId) {
      dashboardOptions.corpId = this.corpId;
    }
    if (this.reportId) {
      dashboardOptions.reportId = this.reportId;
    }
    if (this.config) {
      dashboardOptions.config = this.config;
    }
    if (this.integrateComponents) {
      dashboardOptions.integrateComponents = this.integrateComponents;
    }
    if (this.classification) {
      dashboardOptions.classification = this.classification;
    }
    this.setReportOptions(Object.assign({}, options, dashboardOptions));
  }

  /** 图表懒加载
   * @param entries
   */
  lazyLoadChart(entries: Array<IntersectionObserverEntry>) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const chart: string = entry.target.getAttribute("data-id") as string;
      const type: string = !entry || entry.isIntersecting ? "load" : "";
      this.resizeChartView && this.resizeChartView({ chart, type });
    });
  }
  /**
   * 加载仪表盘
   */
  async loadDashboard() {
    this.loading = true;
    this.setDashboardOptions();
    this.getReport({ corpId: this.corpId, reportId: this.reportId, type: ReportState.DASHBOARD })
      .then(res => {
        this.$emit("title", res.title);
        // 兼容旧主题,还原默认样式
        if (!this.AllowThemes.includes(this.global.styles.paintCoatTheme)) {
          this.setDefaultGlobal();
        }
        this.showCharts = this.handleChartsPositions();
        this.qywxRefrash();
        this.$emit("report-loaded");
        this.loading = false;
        this.updateTabMapping();
        this.updateMobileTabMap(true);
      })
      .catch(() => {
        this.loading = false;
      });
  }

  fullScreen({ elements, fullScreenStatus }) {
    if (!fullScreenStatus) {
      this.fullScreenCharts = elements;
    } else {
      this.fullScreenCharts = null;
    }
    (this.$el as HTMLDivElement).classList.toggle(`${this.prefixCls}__full`);
  }
  /**
   * 主要用于table,list双击
   */
  dblClickChart(option) {
    console.log(option, "-=-==-=-双击");
  }
  clickChart(option, chart) {
    this.updateTabMapping();
    this.updateMobileTabMap(true);
  }
  clickActionSheetMenu(menu) {
    const value = menu ? menu.value : "cancel";
    switch (value) {
      case "detail":
        this.showGlobalDetail = true; //展示详情

        break;
      default:
        this.globalDetailOption.callBackRefreach(this.globalDetailOption.option); //下钻
        break;
    }
  }
  /**
   * op:所有参数集合
   * showAction //是否展示下拉选项
   */
  clickTableDetail(op, hasNextLayer) {
    this.globalDetailOption = op;
    if (op.element.type === "list" && hasNextLayer) {
      // 屏蔽关联子表字段的下钻和联动
      if (op.option.params.isRelations) {
        return;
      }
      const filters = op.option.filters || [];
      const hasAddress = filters.find(item => item.field.specialType === "address");
      if (hasAddress) {
        return (this.showGlobalDetail = true);
      }
    }
    if (
      hasNextLayer &&
      op.option.params.clickPosition !== "header" &&
      op.option.params.clickPosition !== "footer"
    ) {
      //选项展示
      this.showActionSheet = true;
    } else {
      //直接展示
      this.showGlobalDetail = true;
    }
  }
  async created() {
    if (!this.$store.state.report) {
      this.$store.registerModule("report", getNewReportState());
    } else {
      this.initReport();
    }
    await this.loadDashboard();
    this.updateTabMapping();
    this.updateMobileTabMap(true);
  }
  qywxRefrash() {
    console.log("企业微信方法------");
    //如果是企业微信，手动刷新
    let ua: any = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger" && ua.match(/wxwork/i) == "wxwork") {
      setTimeout(() => {
        console.log("刷新图表------");
        this.refreshCharts();
      });
    }
  }
  mounted() {
    this.$nextTick(() => {
      this.showCharts = this.handleChartsPositions();
      this.updateMobileTabMap(true);
      this.updateTabMapping();
    });
    if (window.top.WWOpenData && window.top.WWOpenData.initCanvas) {
      window.top.WWOpenData.initCanvas();
    }
  }
  destroyed(): void {
    //this.$store.unregisterModule('report');
  }
}
</script>
<style lang="less">
@import "./style/index.less";
</style>
