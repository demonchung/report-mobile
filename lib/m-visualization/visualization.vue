<template>
  <div :class="getStyles">
    <div v-if="!loading && charts.length" :class="[`${prefixCls}__canvas`]">
      <div
        v-for="chart in charts"
        :key="chart.uid"
        :class="[`${prefixCls}__item`]"
      >
        <element-wrap-header
          :chart="chart"
          :is-full-screen="false"
          :comPrefixCls="prefixCls"
          @full-screen="fullScreen"
        >
        </element-wrap-header>
        <element-wrap
          :chart="chart"
          :status="'report'"
          :global="global"
          :refresh="true"
          :mode="true"
        ></element-wrap>
      </div>
      <backdoor><br/></backdoor>
      <full-screen
        ref="fullScreen"
        v-if="getFullScreenChart"
        :comPrefixCls="prefixCls"
        :chart="getFullScreenChart"
        @full-screen="fullScreen"
      ></full-screen>
    </div>
    <div
      v-else-if="!loading && !charts.length"
      :class="[`${prefixCls}__canvas`, `${prefixCls}__canvas--empty`]"
    >
      <img src="@h3/report-mobile/basics/assets/common/m-empty.svg"/>
      <label>当前页无图表，请先在电脑端配置图表</label>
    </div>
    <h3-loading v-else></h3-loading>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import { namespace } from "vuex-class";
import ElementWrap from "./chart-warp";
import ElementWrapHeader from "./header.vue";
import FullScreen from "./full-screen.vue";
import { reportState } from "@h3/report-mobile/basics/store/visualization";
import { ReportMutation, ReportAction } from "@h3/report-mobile/basics/store/visualization/types";
import { judgeMobile } from "@h3/report-mobile/basics/utils/browser";
import H3Loading from "@h3/report-mobile/basics/components/loading";
import Backdoor from "@h3/report-mobile/basics/components/mobile-backdoor";

const Visualization = namespace("visualization");
@Component({
  name: "h3-visualization-mobile",
  components: {
    ElementWrap,
    ElementWrapHeader,
    FullScreen,
    H3Loading,
    Backdoor
  }
})
export default class VisualizationMobile extends Vue {
  @Prop({
    default: null
  })
  schemaCode!: string; // 列表schemaCode
  @Prop({
    default: () => []
  })
  @Prop({ default: () => false }) isWxwork!: boolean;
  filter!: Array<H3.Yun.Filter>; // 列表筛选条件
  @Visualization.State("global") global!: H3.Report.Global;
  @Visualization.State("charts") charts!: Array<H3.Report.Chart>;
  @Visualization.Action(ReportAction.GETREPORT) getReport!: Function;
  @Visualization.Mutation(ReportMutation.SETGLOBALFILTER) setGlobalFilter!: Function;
  @Visualization.Mutation(ReportMutation.RESETREPORT) resetReport!: Function;
  @Provide() isMobile = true;

  prefixCls = "h3-visualization-mobile";
  loading = true;
  fullScreenChart: any = null;

  @Watch("schemaCode")
  watchSchemaCode() {
    this.loadVisualization();
  }
  @Watch("filter", { deep: true })
  watchFilter(filter: Array<H3.Yun.Filter>) {
    if (filter) {
      this.setGlobalFilter(filter);
    } else {
      this.setGlobalFilter([]);
    }
  }
  get getStyles() {
    return [this.prefixCls, judgeMobile()];
  }
  get getFullScreenChart() {
    let chart: H3.Report.Chart | null = null;
    if (this.fullScreenChart) {
      chart = JSON.parse(JSON.stringify(this.fullScreenChart));
      if (chart) {chart.uid = `screen-${chart.uid}`;}
    }
    return chart;
  }
  /**
   * 加载列表分析
   */
  async loadVisualization() {
    this.loading = true;
    await this.getReport(this.schemaCode);
    this.$emit("visualization-loaded");
    this.loading = false;
  }

  fullScreen({ chart, fullScreenStatus }) {
    if (!fullScreenStatus) {
      this.fullScreenChart = chart;
    } else {
      this.fullScreenChart = null;
    }
    (this.$el as HTMLDivElement).classList.toggle(`${this.prefixCls}__full`);
  }
  async created() {
    this.$store.registerModule("visualization", reportState);
    this.resetReport();
    await this.loadVisualization();
    this.setGlobalFilter(this.filter);
  }
  destroyed(): void {
    this.$store.unregisterModule("visualization");
  }
}
</script>
<style lang="less">
@import "./style/index.less";
</style>
