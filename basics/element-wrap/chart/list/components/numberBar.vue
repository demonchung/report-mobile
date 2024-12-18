<template>
  <div :class="prefixCls">
    <div
      :class="[`${prefixCls}__text`,`${prefixCls}__text-left`]"
      :style="`color: ${ color.fontColor }; opacity: ${showValue? 1 : 0}; text-align: ${ textAlign }`"
    > {{ value }}</div>
    <!-- /存在负数/ -->
    <div v-if="getMinNumber < 0" :class="`${prefixCls}__two`"> 
      <div :class="`${prefixCls}__two-left`"> 
        <div
          v-if="isMinus(value)"
          :class="`${prefixCls}__two-left-bg`"
          :style="`width:${ getWidthPercent }%; background-color: ${ color.bgcolor }`"
        ></div>
        <div v-if="isMinus(value)" :class="`${prefixCls}__two-left-line`"></div>
      </div>
      <div :class="`${prefixCls}__two-right`">
        <div
          v-if="!isMinus(value)"
          :class="`${prefixCls}__two-right-bg`"
          :style="`width:${ getWidthPercent }%; background-color: ${ color.bgcolor }`"
        ></div>
        <div v-if="!isMinus(value)" :class="`${prefixCls}__two-right-line`"></div>
      </div>
    </div>
    <!-- /只有正数/ -->
    <div
      v-else
    >
      <div
        :class="`${prefixCls}__bg`"
        :style="`width:${ getWidthPercent }%; background-color: ${ color.bgcolor }`"
      ></div>
      <div
        :class="`${prefixCls}__line`"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
@Component({
  name :'h3-report-list-number-bar',
  components: {

  }
})
export default class ReportListNumberBar extends Vue{
  @Prop({ default: () => {} }) col!: any;
  @Prop({ default: () => {} }) value!: any;
  @Prop({ default: () => {} }) minMaxMap!: any;
  @Prop({ default: () => {} }) color!: any;
  @Prop({ default: () => {} }) conditionOption!: H3.Report.ConditionFormat;
  @Prop({ default: () => {} }) textAlign!: string;

  prefixCls: string = 'h3-report-list-number-bar';
  get showValue() {
    return this.conditionOption ? this.conditionOption.needDetail : true;
  }
  get getWidthPercent() {
    if(this.value){
      const val = this.getAbsNumber(this.value)
      const max = this.getMaxNumber;
      return Math.round(val/max * 10000) / 100.00;
    }
    return 0;
  }

  get getMaxNumber() {
    const a = Math.abs(this.minMaxMap[this.col.key].max);
    const b = Math.abs(this.minMaxMap[this.col.key].min);
    return a > b ? a : b;
  }

  get getMinNumber () {
    return this.minMaxMap[this.col.key].min;
  }
  getAbsNumber(number) {
    const regex = /%$/;
    const reg = /[,]/;
    if(typeof number === 'string' && number) {
      if (regex.test(number)) {
        number = parseFloat(number.replace(/,/g, '').replace(/%/g, '')) / 100;
      } else {
        const dotReg = /,/g;
        const percentReg = /%/g;
        number = number.replace(dotReg,'');
        number = number.replace(percentReg,'');
      } 
    }
    return Math.abs(number|| 0);
  }

  // 是否是负数
  isMinus(value) {
    if (typeof value === "number") {return value < 0;}
    return value && value.indexOf("-") > -1;
  }
}
</script>
<style scoped lang='less'>
  .h3-report-list-number-bar{
    width:100%;
    height:100%;
    position:relative;
    max-height: 18px; 
    z-index:0;
    &__text{
      position:relative;
      z-index: 10;
      color:#707481;
      padding:0 12px;
      line-height: 20px;
    }
    &__text-left{
      text-align: left;
    }
    &__bg{
      width:100%;
      height:100%;
      background:#647CFC;
      position: absolute;
      top: 0;
      z-index: 2;
    }
    &__line{
      width:100%;
      height:100%;
      position: absolute;
      top: 0;
      z-index: 1;
    //  background:#F1F2F4;
      border-radius:8px;
    }
    &__two{
      width:100%;
      height:100%;
      position: absolute;
      top: 0;
      display: flex;
      &-left,&-right{
        width:50%;
        display:inline-block;
        height:100%;
        position: relative;
        &-bg{
          position: relative;
          z-index: 2;
          background:#647CFC;
          height:100%;
        }
        &-line{
          position: absolute;
          top: 0;
          z-index: -1;
          width:100%;
          height:100%;
        //  background:#F1F2F4;
          border-radius:8px;
        }
      }
      &-left{
        &-bg{
          position:absolute;
          right:0;
          background:#FFC825;
        }
      }
    }
  }
</style>
