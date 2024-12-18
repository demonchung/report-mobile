<template>
  <div
    :class="getClass"
    v-h3-lazy-load="{ selector: `.h3-dashboard-mobile__item`, callback: lazyLoadChart, delay: 500 }"
    :style="getStyles"
  >
    <h3-loading v-if="loading" />
    <h3-report-element
      v-else
      :corpId="corpId"
      :element="element"
      :global="global"
      :refresh="true"
      :data-id="element && element.uid"
      :status="'report'"
      :comPrefixCls="mobilePrefixCls"
      @full-screen="fullScreen"
      @drill-down="drillDown"
    >
      <slot name="title" slot="title" />
      <slot name="extra" slot="extra" />
    </h3-report-element>
    <full-screen
      ref="fullScreen"
      v-if="fullScreenElements"
      :comPrefixCls="mobilePrefixCls"
      :theme="getStyles"
      :global="global"
      :elements="fullScreenElements"
      @full-screen="fullScreen"
    />
  </div>
</template>

<script lang="ts">
import "@h3/report-mobile/basics/components/language/main.js";
import { Component, Mixins, Provide, Prop, Watch } from "vue-property-decorator";
import H3Loading from "@h3/report-mobile/basics/components/loading";
import H3ReportElement from "./element";
import FullScreen from "./full-screen.vue";
import H3LazyLoad from "@h3/report-mobile/basics/directives/lazy-load";
import SingleChartMixins from "@h3/report-mobile/basics/mixins/mobile-single-chart-mixins";

@Component({
  name: "h3-single-chart",
  components: {
    H3ReportElement,
    FullScreen,
    H3Loading
  },
  directives: {
    H3LazyLoad
  }
})
export default class ReportShow extends Mixins<SingleChartMixins>(SingleChartMixins) {
  mobilePrefixCls = "h3-dashboard-mobile";
  fullScreenElements: H3.Report.BaseElement | null = null;

  @Provide() isMobile = true;
  /**
   * 监听环境变量
   */
  @Watch("isWxwork", { immediate: true })
  watchIsWxwork(val) {
    if ((this as any).r_envState) {
      (this as any).r_envState.entry = val ? "wxwork" : "";
    }
  }
  drillDown(data) {
    this.$emit("drillDown", data);
  }
  /**
   * 全屏回调事件
   * @param chart
   * @param fullScreenStatus
   */
  fullScreen({ elements, fullScreenStatus }) {
    if (!fullScreenStatus) {
      this.fullScreenElements = elements;
    } else {
      this.fullScreenElements = null;
    }
    (document.body as HTMLDivElement).classList.toggle(`${this.mobilePrefixCls}__full`);
    this.$emit("full-screen", !fullScreenStatus);
  }
  mounted() {
    if (window.top.WWOpenData && window.top.WWOpenData.initCanvas) {
      window.top.WWOpenData.initCanvas();
    }
  }
}
</script>
<style lang="less">
@import "./style/index.less";
.h3-single-chart {
  display: flex;
  height: 100%;
  background: #ffffff;
  .h3-dashboard-mobile__item {
    flex: 1;
    height: 100%;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }
  *,
  :after,
  :before {
    box-sizing: border-box;
  }
  .h3-report-chart__placeholder {
    width: 100%;
    background: #ffffff;
  }
}
</style>
