<template>
  <div :class="[`${prefixCls}`]">
    <h3-modal
      v-model="modalNoCancelVisible"
      :showCancel="false"
      confirmText="确定"
      @confirm="toClose"
    >
      <div :class="`${prefixCls}__body`" v-if="globalDetailOption&& globalDetailOption.length">
        <div v-for="(header, index) in globalDetailOption" :key="index">
          <div :class="`${prefixCls}__body__content`">
            <div :class="`${prefixCls}__body__content__left`" v-if="header.label">
              {{ header.label }}
            </div>
            <div :class="`${prefixCls}__body__content__right`">
              {{ header.value || '-' }}
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        暂无内容
      </div> 
    </h3-modal>

    
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ReportAction, ReportMutation } from "@h3/report-mobile/basics/store/dashboard/types";
import { ThemeColorType } from "@h3/report-mobile/basics/enum/paint";
import { H3Modal  } from '@h3/thinking-ui';


const Dashboard = namespace("report");
@Component({
  name: "h3-report-global-globalDetail",
  components: {
    H3Modal,
  }
})
export default class footerLayer extends Vue {
  @Prop({ default:()=> {} }) globalDetailOption!: Object;
  // 主页展示的图表
  @Dashboard.State("charts") charts!: Array<H3.Report.Chart>;
  @Dashboard.State("global") global!: H3.Report.Global;

  prefixCls: string = "h3-dashboard-mobile__globalDetail";
  modalNoCancelVisible:Boolean = true;
  toClose(){
    this.$emit('close')
  }
  //图层列表
  get isDark() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }
  mounted() {}
}
</script>
<style lang="less">
.h3-dashboard-mobile__globalDetail {
  // width: 100%;
  // height: 100%;
  // position: fixed;
  // top:0;
  // left:0;
  // font-size: 13px;
  // z-index: 100;
  // background:white;
  // z-index: 1000;
  &__body{
    width:100%;
    height:calc(100% - 60px);
    overflow: hidden;
    overflow-y: auto;
    &__content{
      font-size: 14px;
      margin-bottom:16px;
      &__left,&__right{
        font-size: 14px;
        text-align:left;
      }
      &__left{
        color:#121933;
        line-height:28px;
      }
      &__right{
        height:auto;
        color:#707481;
        line-height:23px;
      }
    }
    &__content:last-child{
      margin-bottom: 0;
    }
  }
}
</style>
