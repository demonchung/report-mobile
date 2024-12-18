<template>
  <div :class="`${comPrefixCls}__item-header`">
    <slot name="title">
      <label>{{ chart.title }}</label>
    </slot>
    <div :class="[`${comPrefixCls}__btns`]">
      <a @click="refresh(chart)">
        <h3-svg name="arrow-reload-stroke" w="14" h="14"></h3-svg>
      </a>
      <a @click="fullScreen(chart)">
        <span :class="fullScreenStyles"></span>
      </a>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { ReportMutation, ReportAction } from '@h3/report-mobile/basics/store/dashboard/types';
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";

const ReportPro = namespace('visualization');

@Component({
  name: 'h3-dashboard-element-header',
  components: {
    H3Svg: Svg
  }
})
export default class DashboardElementHeader extends Vue {
  @Prop({
    default: ()=> ({})
  }) chart!: H3.Report.Chart; // 图表
  @Prop({
    default: false
  }) fullScreenStatus!: boolean; // 是否全屏
  @Prop({
    default: 'h3-report-element'
  }) comPrefixCls!: string;
  @ReportPro.Mutation(ReportMutation.RESIZECHARTVIEW) resizeChartView!: Function;
  
  /**
   *是否全屏样式
   */ 
  get fullScreenStyles() {
    return {
      'h3yun_All': true,
      'fullscreen-o': !this.fullScreenStatus,
      'fullscreen-restore-o': this.fullScreenStatus
    };
  }
  /**
   * 刷新图表
   */
  refresh(chart: H3.Report.Chart) {
    this.resizeChartView({chart, type: 'data'});
  }

  /**
   * 全屏预览功能
   */
  fullScreen(chart: H3.Report.Chart) {
    this.$emit('full-screen', {
      chart,
      fullScreenStatus: this.fullScreenStatus
    });
  }
}
</script>
