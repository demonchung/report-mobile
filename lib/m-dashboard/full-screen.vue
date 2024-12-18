<template>
  <div>
    <div :class="`${comPrefixCls}__item--mask`"></div>
    <h3-report-element
      v-if="isShow"
      :class="[
        `${comPrefixCls}__item`,
        `${comPrefixCls}__item--full`,
        landscape && `${comPrefixCls}__item--landscape`
      ]"
      :style="getFullScreenElementStyle"
      :full-screen-status="fullScreenStatus"
      :element="getFullScreenElement"
      :global="global"
      :comPrefixCls="comPrefixCls"
      :landscape="landscape"
      @drill-down="drillDown"
      @full-screen="fullScreen"
      @clickChart="clickChart"
      @clickTableDetail="clickTableDetail"
    >
      <template slot="customFooter">
        <FooterLayer
          :chart="getFullScreenElement"
          :index="activeIndex"
          :chartLayers="copyCharts"
          @click="changeChartByFilter"
          :isDark="isDark"
        />
      </template>
    </h3-report-element>
    <div :class="[`${comPrefixCls}__item--opera`]" @click="toggleLandscape">
      <h3-svg name="screen-flipping-stoke" w="28" h="28"></h3-svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ReportMutation, ReportAction } from "@h3/report-mobile/basics/store/dashboard/types";
// import { namespace } from "vuex-class";
import H3ReportElement from "./element";
import { Color } from "@h3/report-mobile/basics/enum/paint";
import FooterLayer from "@h3/report-mobile/basics/components/footer-layer";

import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import {
  // CoatType, paintsPro,
  ThemeColorType
} from "@h3/report-mobile/basics/enum/paint";
import { dateCNFormat } from "@h3/report-mobile/basics/utils/date";
const Dashboard = namespace('report');
@Component({
  name: "h3-dashboard-mobile-full-screen",
  components: {
    H3ReportElement,
    FooterLayer,
    H3Svg: Svg

  }
})
export default class DashboardMobileFullScreen extends Vue {
  @Prop({ default: "h3-report-mobile" }) comPrefixCls!: string; // 父级样式
  @Prop({ default: () => ({}) }) element!: H3.Report.BaseElement; // 图表
  @Prop({ default: () => [] }) elements!: Array<H3.Report.BaseElement>; // 图表所有数据 包括下钻数据
  @Prop({ default: null }) theme!: string; // 图表背景
  @Prop({ default: null }) global!: H3.Report.Global;
  @Dashboard.Mutation(ReportMutation.RESIZECHARTVIEW) resizeChartView!: Function;

  fullScreenStatus: boolean = true; // 全部状态
  activeIndex: number = 0;
  isShow: boolean = true;
  copyCharts: Array<H3.Report.Chart> = [];
  landscape: boolean = false; // 是否是伪横屏，如果是则滑动手势方向翻转
  @Provide() isMobile = true;

  fullScreen(res: any) {
    this.$emit("full-screen", res);
  }
  /**
   * 获取全屏图表样式
   */
  get getFullScreenElementStyle() {
    let itemStyle = "";
    if (this.getFullScreenElement) {
      itemStyle = this.getItemStyle(this.getFullScreenElement);
    }
    return itemStyle.indexOf(Color.THEMEELEMENTCOATVALUE) > -1 ? this.theme : itemStyle;
  }
  /**
   * 获取全屏图表
   */
  get getFullScreenElement() {
    return this.copyCharts[this.activeIndex];
  }

  drillDown(options) {
    this.$emit('drill-down',options);
  }

  clickChart(params) {
    const index = params.activeIndex;
    if (index) {
      //点击的下面的面包屑进来的
      this.activeIndex = index;
    } else {
      //点击的图表进来的
      if (params.type === "next" && this.activeIndex + 1 <= this.copyCharts.length - 1) {
        const layerFilter = this.copyCharts[this.activeIndex].layerFilter || [];
        const pFilters = JSON.parse(JSON.stringify(params.filters)) || [];
        // pFilters.forEach((filter: H3.Report.FilterFieldColumn) => {
        //   if (filter.field.type == "date") {
        //     filter.text = dateCNFormat(filter.text[0]);
        //     filter.formula = "Range";
        //   }
        // });
        this.activeIndex++;
        this.copyCharts[this.activeIndex].layerFilter = layerFilter.concat(pFilters);
        this.refreshChart();
      }
    }
  }
  // 重置图表
  refreshChart() {
    this.isShow = false;
    this.$nextTick(() => {
      this.isShow = true;
    });
  }
  get isDark() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }

  /**
   * 点击底部面包屑options:{
    * chart: this.chart,
    *filters: [],
    *activeIndex: index,
    *type: "clickFooter"
   * }
      
  */
  changeChartByFilter(options) {
    const index = options.activeIndex;
    this.activeIndex = index;
    const layerFilter = options.chart.layerFilter;
    this.copyCharts[index].layerFilter = layerFilter;
    this.refreshChart();
  }
  /**
   * 获取图表样式
   */
  getItemStyle(element: H3.Report.BaseElement): string {
    const chart: H3.Report.Chart = element as H3.Report.Chart;
    const value =
      (chart.styles && chart.styles.elementCoat && chart.styles.elementCoat.value) ||
      this.global.styles.elementCoat.value;
    return `background-color:${value}`;
  }

  clickTableDetail(options, hasLayer) {
    this.$emit("clickTableDetail", options, hasLayer);
  }
  /**
   * 手动切换横屏/竖屏模式
   */
  toggleLandscape() {
    this.landscape = !this.landscape;
    this.resizeChartView({ chart: this.getFullScreenElement, type: "data" });
    console.log(this.landscape);
  }

  created() {
    this.copyCharts = JSON.parse(JSON.stringify(this.elements));
  }
}
</script>
