<template>
  <div :class="`${prefixCls}`">
    <h3-input
      v-model="minValue"
      :maxlength = "20"
      :class="`${prefixCls}-item`"
      @input="changeText($event,0)"
      placeholder = "最小值"
    />
    <span> 
      <h3-svg name="minus-stroke" color="#707481" w="14" h="14"></h3-svg>
    </span>
    <h3-input
      v-model="maxValue"
      :class="`${prefixCls}-item`"
      :maxlength = "20"
      @input="changeText($event,1)"
      placeholder = "最大值"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch,Mixins } from 'vue-property-decorator';
import { Mutation, Action, State, namespace } from 'vuex-class';
import { Input } from '@h3/antd-vue';
import FilterMixins from '@h3/report-mobile/basics/mixins/filter-mixins';
import Regexp from '@h3/report-mobile/basics/utils/regexp';
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
@Component({
  name: 'h3-report-filter-element-range-input',
  components: {
    H3Input: Input,
    H3Svg: Svg
  }
})
export default class ReportElementFilterRangeInput extends Mixins<FilterMixins>(FilterMixins) {
    prefixCls = `${this.comPrefixCls}__range-input`;
    _minValue: string = '';    // 最小值
    _maxValue: string= '';     // 最大值

  /**
   * 获取最小值
   */
  get minValue() {
    return this.value.length === 2 ? this.value[0] : "";
  }
  /**
   * 设置最小值
   */
  set minValue(value) {
    this._minValue = value;
  }
  /**
   * 获取最大值
   */
  get maxValue() {
    return this.value.length === 2 ? this.value[1] : "";
  }
  /**
   * 设置最大值
   */
  set maxValue(value) {
    this._maxValue = value;
  }

  /**
   * 修改值
   * @param text
   */
  changeText(text: Event, index: number) {
    if (!Regexp("NUMBER", (text.target as any).value, true)) {return;}
    if (index === 1) {
      this._maxValue = (text.target as any).value;
    } else {
      this._minValue = (text.target as any).value;
    }
    const rangeText = [this._minValue, this._maxValue];
    this.emitValue(rangeText);
  }
  created() {}
}
</script>

