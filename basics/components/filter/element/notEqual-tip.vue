<template>
  <div :class="`${prefixCls}`">
    <div
      v-if="showFilterFormatSelect"
      :class="`${prefixCls}__red-tip`"
      style="margin-top:10px;"
    >
      <a-checkbox :checked=" operation=='NotEqual'" @change="onChangeNotEqual">
        不等于该动态筛选范围
      </a-checkbox>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch,Mixins } from 'vue-property-decorator';
import FilterMixins from '@h3/report-mobile/basics/mixins/filter-mixins';
@Component({
  name: 'h3-report-element-filter-not-equal-tip',
  components: {
    
  }
})
export default class ReportElementFilterDate extends Mixins<FilterMixins>(FilterMixins) {
  @Prop({ default: false }) showFilterFormatSelect!: boolean; // 是否展示筛选方式下拉选择框

  prefixCls='h3-report-element-filter-not-equal-tip';

  onChangeNotEqual(event){
    const value  = event.target.checked ? 'NotEqual' : 'Equal' ;
    this.$emit('change-options',{
      operation: value
    })
  }
}
</script>
<style lang="less">
</style>


