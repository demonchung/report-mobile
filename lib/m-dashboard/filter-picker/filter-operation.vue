<template>
  <div :class="`${prefixCls}`">
    <h3-radio-group
      v-model="filter.operation"
      layout="vertical"
      @change="changeOperation"
    >
      <h3-radio
        :key="item.value"
        v-for="item in formulaList"
        :value="item.value"
        :label="item.label"
      />
    </h3-radio-group>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Mutation, Action, State, namespace } from 'vuex-class';
import { H3Radio  } from '@h3/thinking-ui';
import FilterTypes,{ DateType } from '@h3/report-mobile/basics/enum/filter-type';

const ReportPro = namespace('report');
  @Component({
    name: 'h3-report-filter-formula',
    components: {
      H3Radio,
      H3RadioGroup: H3Radio.Group,
    }
  })
export default class ReportFilterFormula extends Vue {
    @Prop({ default: {} }) filter!: H3.Report.FilterPicker;
    prefixCls = 'h3-report-filter-formula';
    
    get formulaList() {
      return [
        {label:'等于',value:'Equal'},
        {label:'不等于',value:'NotEqual'},
      ]
    }
    /**
     *  公式改变时的处理
     * @param value
     */
    changeOperation(value: string) {
      if (this.filter.field.type === 'date' && this.filter.formula === DateType.Dynamic) {
        this.filter.operation = value;
      } else {
        this.filter.operation = '';
      }
      this.$emit('change', this.filter);
    }
}
</script>
<style lang="less">
  .h3-report-filter-formula {
    padding: 0 16px;
  }
</style>
