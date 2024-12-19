<template>
  <div :class="`${comPrefixCls}__item-header`" :style="{ color: titleColor }">
    <slot name="title">
      <span :style="getStyles" :class="`${comPrefixCls}__item-title`">{{ layerTitle }}</span>
    </slot>
    <slot name="extra">
      <div :class="[`${comPrefixCls}__btns`, isDark? 'dark' : '']">
        <span
          @click="linkage(element)"
          :class="[`${comPrefixCls}__btns-item`]"
          :style="getStyles"
          v-if="showLinkage"
        >
          <h3-svg name="table-split-stroke_1"></h3-svg>
        </span>
        <span
          @click="refresh(element)"
          :class="[`${comPrefixCls}__btns-item`]"
          :style="getStyles"
        >
          <h3-svg name="arrow-reload-stroke"></h3-svg>
        </span>
        <span
          @click="fullScreen(element)"
          :class="[`${comPrefixCls}__btns-item`]"
          :style="getStyles"
        >
          <h3-svg v-if="!fullScreenStatus" name="arrows-spread-stroke"></h3-svg>
          <h3-svg v-else name="arrows-shrink-stroke"></h3-svg>
        </span>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ReportMutation, ReportAction } from "@h3/report-mobile/basics/store/dashboard/types";
import { message } from "@h3/antd-vue";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { H3Toast } from "@h3/thinking-ui";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
Vue.use(H3Toast);

const ReportPro = namespace("report");
@Component({
  name: "h3-dashboard-element-header",
  components: {
    H3Svg: Svg
  }
})
export default class DashboardElementHeader extends Vue {
  @Prop({
    default: ""
  })
  element!: H3.Report.BaseElement; // 图表
  @Prop({
    default: false
  })
  fullScreenStatus!: boolean; // 是否全屏
  @Prop({
    default: "h3-report-element"
  })
  comPrefixCls!: string;
  @Prop() global!: H3.Report.Global;
  @Prop({ default: false }) isDark!: boolean;
  @Prop({ default: () => [] }) chartLayers!: Array<H3.Report.chartLayer>;
  @ReportPro.Mutation(ReportMutation.RESIZECHARTVIEW) resizeChartView!: Function;
  @ReportPro.Action(ReportAction.SETCHARTLINKAGE) setChartLinkage!: Function; // 设置图表联动

  get getStyles() {
    let styles: any = "";
    const chart: H3.Report.Chart = this.element as H3.Report.Chart;
    const color =
      (chart.styles && chart.styles.fontSetting && chart.styles.fontSetting.titleColor) ||
      this.global.styles.fontSetting.titleColor;
    styles += `fill:${color}`;
    return styles;
  }

  get titleColor() {
    const chart: H3.Report.Chart = this.element as H3.Report.Chart;
    return (
      (chart.styles && chart.styles.fontSetting && chart.styles.fontSetting.titleColor) ||
      this.global.styles.fontSetting.titleColor
    );
  }

  get showLinkage() {
    return (
      this.element.type !== (ElementType.GAUGE as any) && this.element.type !== (ElementType.WEB as any)
    );
  }
  //图层列表
  get layerTitle() {
    const list =  this.getShowList(this.chartLayers, this.element.layerActiveIndex||0,  this.element.data.switchLayers);
    console.log(list);
    if(list.length > 0) {
      return list[list.length - 1].layerTitle||list[list.length - 1].title;
    }
    return this.element.title;
  }

   getShowList(arr, index, isFree) {
    if (!arr || !arr.length) {return [];} //如果只有一项，说明没有下钻功能
    const l = isFree ? arr.length : index + 1;
    return arr.slice(0, l);
  }
  /**
   * 取消联动
   */
  async linkage(element) {
    const res = await this.setChartLinkage({ chart: element, mode: "clear" });
    if (res) {
     // message.success("联动已取消");
     this.$toast.show({
        text: '联动已取消',
        duration: 1000
      })
    } else {
      //message.warning("当前没有图表与本图表联动");
      this.$toast.show({
        text: '当前没有图表与本图表联动',
        duration: 1000
      })
    }
  }

  /**
   * 刷新图表
   */
  refresh(element: H3.Report.BaseElement) {
    this.resizeChartView({ chart: element, type: "data" });
  }

  /**
   * 全屏预览功能
   */
  fullScreen(element: H3.Report.BaseElement) {
    this.$emit("full-screen", {
      element,
      fullScreenStatus: this.fullScreenStatus
    });
  }
}
</script>
