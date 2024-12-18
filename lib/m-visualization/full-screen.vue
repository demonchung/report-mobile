<template>
  <div :class="[`${comPrefixCls}__item`, `${comPrefixCls}__item--full`]">
    <element-wrap-header
      v-if="chart.type !== 'longText'"
      :full-screen-status="fullScreenStatus"
      :chart="chart"
      :comPrefixCls="comPrefixCls"
      @full-screen="fullScreen"
    >
    </element-wrap-header>
    <element-wrap
      :chart="chart"
      :status="'report'"
      :refresh="true"
      :mode="true"
      :global="global"
    ></element-wrap>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import ElementWrap from './chart-warp';
import ElementWrapHeader from './header.vue';

const ReportPro = namespace('visualization');
@Component({
  name: 'h3-dashboard-mobile-full-screen',
  components: {
    ElementWrapHeader,
    ElementWrap
  }
})
export default class DashboardMobileFullScreen extends Vue {
  @Prop({
    default: 'h3-report-mobile'
  }) comPrefixCls!: string; // 父级样式
  @Prop({
    default: () => ({})
  }) chart!: H3.Report.Chart; // 图表
  @ReportPro.State('global') global!: H3.Report.Global;

  fullScreenStatus:boolean = true; // 全部状态

  @Provide() landscape: boolean = true;
  
  fullScreen(res: any) {
    this.$emit('full-screen', res);
  }
}
</script>
