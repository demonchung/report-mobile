<template>
  <component
    :is="getElementType"
    :corpId="corpId"
    :chart="chart"
    :status="status"
    :refresh="refresh"
    :global="global"
    :api="api"
    :dataSources="dataSources"
    :landscape="landscape"
    :globalFilters="globalFilters"
    @click-chart="clickChart"
    @drill-down="drillDown"
    @dblClickChart="dblClickChart"
    @register-refresh="registerRefresh"
    @changePage="changePage"
    @update-charts-data="updateChartsData"
    @changeActiveTab="changeActiveTab"
  >
    <template slot="tabContent" slot-scope="{data}">
      <slot name="tabContent" :data="data"></slot>
    </template>
  </component>
</template>

<script lang="ts">
// 移除了antd的所有引用
import { Component, Prop, Vue } from "vue-property-decorator";
import ChartWrap from "./component/chart-wrap";
import LongText from "./component/long-text/long-text.vue";
import ReportImage from "./component/image";
import ReportWeb from "./component/web";
import reportTab from "./component/tabs";

@Component({
  name: "h3-report-element-wrap",
  components: {
    ChartWrap,
    LongText,
    ReportImage,
    ReportWeb,
    reportTab
  }
})
export default class ReportElementWrap extends Vue {
  @Prop({ default: null }) corpId!: string;
  @Prop() api!: H3.ReportAPI.Instance;
  @Prop({ default: null }) chart!: H3.Report.Chart;
  @Prop({ default: null }) global!: H3.Report.Global;
  @Prop({ default: "design" }) status!: "design" | "report" | "preview";
  @Prop({ default: true }) refresh!: boolean;
  @Prop({ default:  ()=> {}  }) dataSources!: { [dataSourceId: string]: any };
  @Prop({ default: false }) landscape!: boolean;
  @Prop({ default: () => [] }) globalFilters!: Array<H3.Report.GlobalFilter>;
  
  /**
   * 获取元件类型
   */
  get getElementType() {
    if (this.chart && this.chart.type === "longText") {
      return "long-text";
    } else if(this.chart && this.chart.type === "image") {
      return "reportImage";
    } else if(this.chart && this.chart.type === "web") {
      return "ReportWeb";
    } else if (this.chart && this.chart.type === "tab") {
      return "reportTab";
    } else {
      return "chart-wrap";
    }
  }
  /**
   * 图表注册刷新事件
   */
  updateChartsData(data: any) {
    this.$emit("update-charts-data", data);
  }
  /**
   * 图表点击
   *    * @param option  { filter, params }
   */
  clickChart(option: { filters: Array<H3.Report.FieldColumn>; params: any }) {
    // console.log(option,'-=-=')
    this.$emit("click-chart", option);
  }
  dblClickChart(option){
    this.$emit('dblClickChart',option)
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
  /**
   * 图表注册刷新事件
   */
  registerRefresh(events) {
    this.$emit("register-refresh", events);
  }
  
  changeActiveTab(tabInfo) {
    this.$emit("changeActiveTab", tabInfo);
  }

}
</script>
