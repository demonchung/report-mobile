<template>
  <div :class="`${prefixCls}`">
    <h3-input
      v-model="minValue"
      :placeholder = "placeholderMin"
      type="number"
      :wait="0"
      @change="changeFirstText"
      @blur="blur"
      :maxlength = "20"
    />
    <span style="display:flex; align-items:center"> 
      <h3-svg name="minus-stroke" color="#707481"></h3-svg>
    </span>
    <h3-input
      v-model="maxValue"
      :placeholder = "placeholderMax"
      type="number"
      :wait="0"
      @change="changeSecondText"
      @blur="blur"
      :maxlength = "20"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Mutation, Action, State, namespace } from 'vuex-class';
import { H3Input,H3Toast  } from '@h3/thinking-ui';
import Regexp from '@h3/report-mobile/basics/utils/regexp';
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import FilterTypes from '@h3/report-mobile/basics/enum/filter-type';

const ReportPro = namespace('report');
  @Component({
    name: 'h3-report-filter-input',
    components: {
      H3Input,
      H3Toast,
      H3Svg: Svg
    }
  })
export default class ReportFilterRangeInput extends Vue {
    @Prop({ default: ()=> [] }) value!: Array<string | number | any>;
    @Prop({ default:  ()=> [] }) field!: H3.Report.FieldColumn;    
    @Prop({ default: '' }) formula!: string;
    prefixCls = 'h3-report-filter-range-input';
    placeholderMin: string = '最小值';
    placeholderMax: string = '最大值';
    minValue: string = '';    // 最小值
    oldMinValue: string= '';  // 暂存值
    maxValue: string= '';     // 最大值
    oldMaxValue: string= '';  // 暂存值

    @Watch('value', { immediate: true, deep: true })
    changeValue(value: Array<string | number | any>) {
      if(value.length === 2) {
        this.minValue = value[0];
        this.maxValue = value[1];
      } else {
        this.minValue = '';
        this.maxValue = '';
        this.oldMinValue= '';
        this.oldMaxValue= '';
      }
    }
    
    /**
     * 修改值
     * @param text
     */
    changeFirstText(text: string) {
      if (!Regexp('NUMBER', text, true)) {
        this.minValue = this.oldMinValue;
      } else {
        this.oldMinValue = this.minValue;
      }
    }
    /**
     * 修改值
     * @param text
     */
    changeSecondText(text: string) {
      if (!Regexp('NUMBER', text, true)) {
        this.maxValue = this.oldMaxValue;
      } else {
        this.oldMaxValue = this.maxValue;
      }
    }
   
    /**
     * 失去焦点
     */
    blur() {
        const rangeText = [this.minValue,this.maxValue];
        this.$emit('input',rangeText)
    }
    created() {}
}
</script>
<style lang="less">
  .h3-report-filter-range-input {
    display: flex;
    padding: 16px;
    .h3think-input {
      height: 28px;
      padding: 0 8px 0 8px !important;
    }
    .h3think-input .h3think-input__input {
      text-align: center;
    }
    .h3think-input.h3think-input--border {
      background-color: #fff;
      border-radius: 14px;
    }
    .straightline{
      display: flex;
      align-items: center;
      color: #999;
      padding: 0 8px;
    }
  }
</style>
