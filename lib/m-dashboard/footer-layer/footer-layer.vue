<template>
  <div :class="[`${prefixCls}`]" v-if="layerList.length > 1">
    <a-breadcrumb separator="">
      <a-breadcrumb-item v-for="(item, index) in layerList" :key="index">
        <span
          @click="toggleLayer(index)"
          :class="[
            index === layerList.length - 1 ? `${prefixCls}-active-item` : `${prefixCls}-item`,
            isDark ? 'whiteColor' : 'darkColor'
          ]"
        >
          {{ item.layerTitle || item.title }} {{ index === layerList.length - 1 ? "" : "/ " }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Breadcrumb } from "@h3/antd-vue";
import { ReportAction, ReportMutation } from "@h3/report-mobile/basics/store/dashboard/types";
import { ThemeColorType } from "@h3/report-mobile/basics/enum/paint";
const Dashboard = namespace("report");
@Component({
  name: "h3-report-footer-layer",
  components: {
    ABreadcrumb: Breadcrumb,
    ABreadcrumbItem: Breadcrumb.Item
  }
})
export default class footerLayer extends Vue {
  @Prop({ default: () => [] }) filters!: Array<H3.Report.FilterFieldColumn>; // 外部传入的筛选条件
  @Prop({ default: null }) chart!: H3.Report.Chart;
  // 是否处于编辑状态
  @Dashboard.State("designMode") designMode!: boolean;
  // 编辑状态中展示的多图层
  @Dashboard.State("activeChartLayers") activeChartLayers!: Array<H3.Report.chartLayer>;
  // 外部展示的图层关系
  @Dashboard.State("chartRelations") chartRelations!: H3.Report.chartRelations;
  // 主页展示的图表
  @Dashboard.State("charts") charts!: Array<H3.Report.Chart>;
  @Dashboard.State("global") global!: H3.Report.Global;
  @Dashboard.Action(ReportAction.SETACTIVECHARTID) setActiveChartId!: Function;
  @Dashboard.Mutation(ReportMutation.SETACTIVECHART) setActiveChart!: Function;
  @Dashboard.Action(ReportAction.SETCHARTLAYERLINK) setChartLayerLink!: Function; //首页下钻
  @Dashboard.Action(ReportAction.SETDESIGNLAYERLINK) setDesignLayerLink!: Function; //设计时下钻

  prefixCls: string = "h3-report-footer-layer";
  //图层列表
  get layerList() {
    const chartId = this.chart.uid;
    if (this.designMode) {
      //设计器界面
      return this.getShowList(this.activeChartLayers, chartId);
    } else {
      return this.getDashedList(this.chartRelations[chartId], chartId);
    }
  }
  get isDark() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }
  //获取显示的列表
  getShowList(arr, chartId) {
    if (!arr || !arr.length) {return []; }//如果只有一项，说明没有下钻功能
    const index = arr.findIndex(el => el.uid === chartId);
    return index < 1 ? [] : arr.slice(0, index + 1);
  }
  getDashedList(arr, chartId) {
    if (!arr || !arr.length) {return []; }//如果只有一项，说明没有下钻功能
    const match = this.charts.find(c => c.uid === chartId);
    if (!match) {return [];}
    const layerActiveIndex = match.layerActiveIndex || 0;
    return layerActiveIndex < 1 ? [] : arr.slice(0, layerActiveIndex + 1);
  }
  toggleLayer(index) {
    const nowLength = this.layerList.length;
    //点击当前不刷新
    if (index === nowLength - 1) {
      return;
    }
    if (this.chart.layerFilter) {
      this.chart.layerFilter = this.chart.layerFilter.splice(0, index);
    }
    //设计页面和非设计页面的下钻不一样，需要与真实数据做区分
    if (this.designMode) {
      this.setDesignLayerLink({
        chart: this.chart,
        filters: [],
        activeIndex: index,
        type: "clickFooter"
      });
    } else {
      this.setChartLayerLink({
        chart: this.chart,
        filters: [],
        activeIndex: index,
        type: "clickFooter"
      });
    }
    this.$emit("change");
  }
  mounted() {}
}
</script>
<style lang="less">
.h3-report-footer-layer {
  width: 100%;
  height: 28px;
  position: relative;
  padding: 0 0 0 16px;
  font-size: 13px;
  z-index: 100;
  display: flex;
  align-items: center;
  &-item {
    font-size: 13px;
    cursor: pointer;
  }
  &-active-item {
    font-weight: bold;
    cursor: pointer;
  }
  &-item.whiteColor {
    color: #707481;
  }
  &-item.darkColor {
    color: #2b2121;
  }
  &-active-item.whiteColor {
    color: #ffffff;
  }
  &-active-item.darkColor {
    color: #000000;
  }
  &-item.darkColor:hover,
  &-active-item.darkColor:hover {
    color: #121933;
  }
  &-item.whiteColor:hover,
  &-active-item.whiteColor:hover {
    color: #ffffff;
  }
}
</style>
