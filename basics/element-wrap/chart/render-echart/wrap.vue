<template>
  <!-- <h3-scroll
    ref="scroll"
    v-if="isScrollY || isScrollX"
    :scrollYBtn="isScrollY"
    :scrollXBtn="isScrollX"
    :animate="animate"
    :scrollYBtnDirection="scrollYDirection"
    :scrollXBtnDirection="scrollXDirection"
    :resize="refresh"
    :buttonColor="'rgba(0,0,0,0.45)'"
  >
    <div :class="chartStyle" ref="chartBody"></div>
  </h3-scroll> -->
  <div
    ref="chartBody"
    :class="chartStyle"
  ></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { chartView, setChartByoptions } from "./echart";
import H3Scroll from "@h3/report-mobile/basics/components/scroll";
import { dashboardApi } from "@h3/report-mobile/basics/service/dashboard/";

@Component({
  name: "h3-report-chart-view",
  components: {
    H3Scroll
  }
})
export default class ReportChart extends Vue {
  @Prop({ default: () => ({}) }) options!: H3.Chart.ChartOptions;
  @Prop({ default: () => true }) refresh!: boolean;
  @Prop({ default: () => {} }) chartData!: H3.Chart.ChartData | Array<H3.Chart.ChartData>;
  @Prop({ default: () => true }) showDataZoom!: boolean;
  @Prop({ default: 200 }) delay!: number;
  @Prop({ default: () => dashboardApi }) api!: H3.ReportAPI.Instance; // 请求实例

  prefixCls = "h3-report-chart-view";
  chart!: any;
  lastInitChartTime = 0;
  isScrollY = false;
  isScrollX = false;
  animate = true;
  scrollYDirection = "right";
  scrollXDirection = "bottom";
  timer: any = 0;
  timer2: any = 0;

  get isInitChart() {
    return !(!this.options.data || !this.options.data.length);
  }
  get chartStyle() {
    return {
      "h3-report-chart-view": true,
      "h3-report-chart-view--no-linkage": this.options.linkage && !this.options.linkage.length
    };
  }
  /**
   * 图表刷新事件
   */
  refreshChartStyles() {
    if (!this.timer2) {
      clearTimeout(this.timer2);
      this.timer2 = setTimeout(() => {
        if (this.chart && this.refresh) {
          this.chart.resize();
          this.timer2 = 0;
        }
      }, this.delay);
    }
  }

  /**
   * 图表点击事件
   */
  clickChart(filters: Array<H3.Report.FilterFieldColumn>, params = null) {
    this.$emit("click", {
      filters,
      params
    });
  }

  initChart() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    if (!this.isInitChart) {return;}
    chartView(this.$refs.chartBody as HTMLDivElement, this.options, this.chartData,this, this.showDataZoom).then(
      (chart: any) => {
        this.chart = chart;
        this.$emit("refresh-end");
      }
    );
  }
  /**
   * 设置chart数据 局部刷新数据
   */
  refrashByOptions() {
    if (!this.chart) {return;}
    setChartByoptions(this.options, this, this.chart, this.chartData);
  }
  delayInitChart() {
    if (!this.isInitChart || !this.refresh) {return;}
    this.scrollYDirection = "right";
    this.scrollXDirection = "bottom";
    this.isScrollY = false;
    this.isScrollX = false;
    if (!this.options.direction || ["bottom", "top"].includes(this.options.direction)) {
      this.isScrollX = true;
      this.animate = true;
      this.scrollXDirection = "bottom";
    } else {
      this.isScrollY = true;
      this.animate = false;
      this.scrollYDirection = "right";
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.initChart();
      const scroll: any = this.$refs.scroll as Vue;
      if (scroll) {
        scroll.setScrollBar(null, true);
      }
    }, this.delay);
  }
  mounted() {
    this.delayInitChart();
  }
  created() {
  }
  destroyed() {
    this.chart = null;
  }
}
</script>
<style lang="less">
.h3-report-chart-view {
  width: 100%;
  height: 100%;
  padding: 0 12px 12px;
  box-sizing: border-box;
  > div {
    display: inline-flex;
  }
  &--no-linkage {
    canvas {
      cursor: default;
    }
  }
}
</style>
