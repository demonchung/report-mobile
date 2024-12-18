<template>
  <div :class="`${prefixCls}`">
    <a-input-number
      :value="inputValue"
      :placeholder = "$r_language.components.numberInPla"
      @change = "change"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch,Mixins } from 'vue-property-decorator';
import FilterMixins from '@h3/report-mobile/basics/mixins/filter-mixins';
import { InputNumber } from "@h3/antd-vue";

import Regexp from '@h3/report-mobile/basics/utils/regexp';

@Component({
  name: 'h3-report-element-number-filter-input',
  components: {
    AInputNumber: InputNumber
  }
})
export default class ReportElementFilterInput extends Mixins<FilterMixins>(FilterMixins) {
  prefixCls = `${this.comPrefixCls}__input`;

  /**
   * 获取输入值
   */
  get inputValue() {
    return this.value.length ? this.value[0] : "";
  }

  /**
   * 修改值
   * @param value
   */
  change(value) {
    if (!Regexp("NUMBER", value, true)) {return;}
    this.emitValue(String(value));
  }

  created() {}
}
</script>
<style lang="less">
</style>


