<template>
  <div :class="`${prefixCls}`">
    <h3-multi-input
      :items ="value"
      @multi-input="changeText"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch,Mixins } from 'vue-property-decorator';
import FilterMixins from '@h3/report-mobile/basics/mixins/filter-mixins';
import H3MultiInput from '@h3/report-mobile/basics/components/multi-input/multi-input.vue';

  @Component({
    name: 'h3-report-element-filter-multi-input',
    components: {
      H3MultiInput
    }
  })
export default class ReportElementFilterMultiInput extends Mixins<FilterMixins>(FilterMixins) {
    prefixCls = `${this.comPrefixCls}__multi-input`;
    /**
     * 值改变
     * @value 改变值
     */
    changeText(value: Array<string>) {
      this.emitValue(value);
    }
}
</script>



