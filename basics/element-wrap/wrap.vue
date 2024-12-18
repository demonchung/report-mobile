<template>
  <component
    :is="getElementType"
    :chart="chart"
    :status="status"
    :refresh="refresh"
    :global="global"
    :corpId="corpId"
    :api="api"
    :editable="editable"
    :delay="delay"
    :filters="filters"
    :relations="relations"
    :dataSources="dataSources"
    :autType="autType"
    :startLog="startLog"
    :mobileMode="mobileMode"
    :globalFilters="globalFilters"
    @change="change"
    @click-chart="clickChart"
    @upload-chart="uploadChart"
    @register-refresh="registerRefresh"
    @update-charts-data="updateChartsData"
    @refresh-end="refreshEnd"
    @changePage="changePage"
    @drill-down="drillDown"
    @getAlias="getAlias"
    @log="log"
    @changeActiveTab="changeActiveTab"
  >
    <template slot="tabContent" slot-scope="{data}">
      <slot name="tabContent" :data="data"></slot>
    </template>
  </component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ChartWrap from "./component/chart-wrap";
import FilterPicker from "./component/filter-picker";
import LongText from "./component/long-text/long-text.vue";
import ReportImage from "./component/image";
import ReportWeb from "./component/web";
import ReportTab from "./component/tabs";
import { ReportState } from "@h3/report-mobile/basics/enum/report-state";

@Component({
  name: "h3-report-element-wrap",
  components: {
    ChartWrap,
    FilterPicker,
    LongText,
    ReportImage,
    ReportWeb,
    ReportTab
  }
})
export default class ReportElementWrap extends Vue {
  @Prop({ default: null }) chart!: H3.Report.Chart;
  @Prop({ default: null }) global!: H3.Report.Global;
  @Prop({ default: 200 }) delay!: number;
  @Prop() api!: H3.ReportAPI.Instance;
  @Prop({ default: '' }) autType!: string;
  @Prop({ default: false }) startLog!: boolean;
  @Prop() corpId!: string;
  @Prop({ default: ReportState.DESIGN }) status!: ReportState;
  @Prop({ default: true }) refresh!: boolean;
  @Prop({ default: () => [] }) filters!: Array<H3.Report.FilterFieldColumn>; // 外部传入的筛选条件
  @Prop({ default:  ()=> []  }) relations!: Array<H3.Report.RelationField>;
  @Prop({ default:  ()=> {}  }) dataSources!: { [dataSourceId: string]: any };
  @Prop({ default: true }) editable!: boolean; // 是否可以编辑表盘
  @Prop({ default: false }) mobileMode!: boolean; //是否是移动段布局
  @Prop({ default: () => [] }) globalFilters!: Array<H3.Report.GlobalFilter>

  /**
   * 获取元件类型
   */
  get getElementType() {
    switch (this.chart && this.chart.type) {
      case "longText":
        return "long-text";
      case "filterPicker":
        return "filter-picker";
      case "image":
        return "report-image";
      case "web":
        return "report-web";
      case "tab":
        return "report-tab";
      default:
        return "chart-wrap";
  
    }
  }
  /**
   * 图表加载完
   */
  refreshEnd() {
    this.$emit("refresh-end");
  }
  uploadChart(chart) {
    this.$emit('upload-chart',chart);
  }
  changeActiveTab(tabInfo) {
    this.$emit('changeActiveTab',tabInfo);
  }
  /**
   * 修改chart
   * @param chart
   */
  change(chart: H3.Report.FilterPicker | H3.Report.LongText | H3.Report.Chart,options) {
    this.$emit("change", chart,options);
  }
   /**
   * 改变页码
   */
  changePage(data) {
    this.$emit('changePage',data);
  }
  /**
   * 图表点击
   *    * @param option  { filter, params }
   */
  clickChart(option: { filters: Array<H3.Report.FieldColumn>; params: any }) {
    this.$emit("click-chart", option);
  }
  /**
   * 图表注册刷新事件
   */
  updateChartsData(data: any) {
    this.$emit("update-charts-data", data);
  }
  log(data) {
      this.$emit("log", data);
  }
  /**
   * 下钻
   */
  drillDown(data) {
    this.$emit("drill-down", data);
  }
  /**
   * 图表注册刷新事件
   */
  registerRefresh(events) {
    this.$emit("register-refresh", events);
  }
  /**
   * 获取别名
  */
  getAlias(data){
    this.$emit('getAlias',data)
  }
}
</script>
