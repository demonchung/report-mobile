<template>
  <div :class="`${prefixCls}`">
    <a-input-number
      :value="minValue"
      :class="`${prefixCls}-item`"
      @change="change($event, 0)"
      :placeholder="$r_language.Ddesign.stage_filter.pla_min"
    />
    <span style="margin: 0 4px"> 
      <h3-svg name="minus-stroke" color="#707481" w="14" h="14"></h3-svg>
    </span>
    <a-input-number
      :value="maxValue"
      :class="`${prefixCls}-item`"
      @change="change($event, 1)"
      :placeholder="$r_language.Ddesign.stage_filter.pla_max"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { InputNumber } from "@h3/antd-vue";
import FilterMixins from "@h3/report-mobile/basics/mixins/filter-mixins";
import Regexp from "@h3/report-mobile/basics/utils/regexp";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";

@Component({
  name: "h3-report-filter-element-range-input",
  components: {
    AInputNumber: InputNumber,
    H3Svg: Svg
  }
})
export default class ReportElementFilterRangeInput extends Mixins<FilterMixins>(FilterMixins) {
  prefixCls = `${this.comPrefixCls}__range-input`;
  _minValue: number | "" = ""; // 最小值
  _maxValue: number | "" = ""; // 最大值

  /**
   * 获取最小值
   */
  get minValue() {
    return this.value.length === 2 ? this.value[0] : "";
  }

  /**
   * 获取最大值
   */
  get maxValue() {
    return this.value.length === 2 ? this.value[1] : "";
  }

  /**
   * 修改值
   * @param value 值
   * @param index 第几个input
   */
  change(value: number, index: number) {
    if (!Regexp("NUMBER", value, true)) {return;}
    if (index === 1) {
      this._maxValue = value;
    } else {
      this._minValue = value;
    }
    const rangeText = [
      this._minValue || this._minValue === 0 ? String(this._minValue) : "",
      this._maxValue || this._maxValue === 0 ? String(this._maxValue) : ""
    ];
    this.emitValue(rangeText);
  }
  created() {}
}
</script>
