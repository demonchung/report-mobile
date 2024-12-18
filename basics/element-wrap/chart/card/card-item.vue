<template>
  <div :class="[prefixCls]" :style="{minHeight: option.label ? '110px': '62px'}">
    <div :class="`${prefixCls}-inner`">
      <div :class="`${prefixCls}-box`" :style="itemStyles">
        <div :class="`${prefixCls}-label`" v-if="option.label">
          <Alias
            :value="option.label"
            :field="field"
          />
        </div>
        <div :class="`${prefixCls}-tip`" v-if="showTitle">
          {{ option.tip }}
        </div>
        <div :class="`${prefixCls}-value`" :style="{ fontSize: `${fontSize}px`}">
          {{ convertNumber(option.value,numberFormat) }}  
        </div>
      </div>
    </div>
    
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import H3Scroll from "@h3/report-mobile/basics/components/scroll";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";
import customSort from "@h3/report-mobile/basics/utils/customSort";
import { StringType, AddressType } from "@h3/report-mobile/basics/enum/filter-type";
import Alias from "@h3/report-mobile/basics/components/alias"


@Component({
  name: "h3-report-card-item",
  components: {
    H3Scroll,
    Alias
  }
})
export default class ReportCardItem extends Vue {
  @Prop({ default: () => ({}) }) option!: {label: string,value: string,tip: string};
  @Prop({ default: () => ('left') }) position!: string;
  @Prop({ default: () => ('') }) fontColor!: string;
  @Prop({ default: () => (20) }) fontSize!: number;
  @Prop({ default: () => (true) }) showTitle!: boolean;
  @Prop({ default: () => (4) }) maxColumns!: number;
  @Prop({ default: () => ({
        comma: false, // 千分符
        percent: false, // 百分比
        fraction: 0 // 小数位数 默认0
      })}) numberFormat!: H3.Report.NumberFormat;
  @Prop({ default: () => ({}) }) field!: any;
  
  prefixCls = "h3-report-card-item";
  positionMap= {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
  }
  convertNumber(value: any, numberFormat: H3.Report.NumberFormat) {
    return numberFormat ? convertNumber(value, numberFormat) : value;
  }
  get itemStyles() {
    return {
      'align-items': this.positionMap[this.position],
      color: this.fontColor
    }
  }
}
</script>
<style lang="less">
  .h3-report-card-item{
    min-height: 70px;
    overflow: hidden;
    border-radius: 4px;
    &-inner {
      height: 100%;
      // margin: 8px 4px;
      // border-radius: 12px;
      // padding-left: 12px;
      // padding-right: 12px;
      padding: 4px 4px;
      // background: rgba(209,211,228,0.2);
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
    }
    &-label { 
      font-size: 12px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    &-tip {
       font-size: 12px;
       opacity: 0.6;
      }
    &-value {
      line-height: 1;
      padding-top: 6px;
      font-weight: bold;
      font-size: 30px;
      font-family: D-DIN-Pro;
    }
    &-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      height: 100%;
      background: rgba(209,211,228,0.2);
      border-radius: 4px;
      padding: 12px;
    }
  }

  // .h3-report-card-item.center {
  //   justify-content: center;
  // }
  // .h3-report-card-item.left {
  //   padding-left: 0%;
  // }
  // .h3-report-card-item.right {
  //   justify-content: flex-end;
  //   //padding-right: 8%;
  // }
</style>
