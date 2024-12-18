<template>
  <div :class="`${prefixCls}`">
    <h3-input
      v-model="inputValue"
      :placeholder = "$r_language.normal.input"
      @input = "changeText($event)"
      :maxlength = "200"
      :allowClear= "true"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch,Mixins } from 'vue-property-decorator';
import FilterMixins from '@h3/report-mobile/basics/mixins/filter-mixins';
import { Input } from '@h3/antd-vue';
import Regexp from '@h3/report-mobile/basics/utils/regexp';

@Component({
  name: 'h3-report-element-filter-input',
  components: {
    H3Input: Input
  }
})
export default class ReportElementFilterInput extends Mixins<FilterMixins>(FilterMixins) {
    prefixCls = `${this.comPrefixCls}__input`;
    _inputValue: string = ''; // 实际值
  
    /**
     * 获取输入值
     */
    get inputValue() {
      return this.value.length ? this.value[0] : '';
    }
    /**
     * 设置输入值
     */
    set inputValue(value) {
      this._inputValue = value;
    }
   
    /**
     * 修改值
     * @param text
     */
    changeText(text: any) {
      this._inputValue = text.target.value;
      this.emitValue(this._inputValue.trim())
    }
    
    created() {
      
    }
}
</script>
<style lang="less">
</style>


