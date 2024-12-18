<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import { Mutation, Action, State, namespace } from 'vuex-class';
import options from '@h3/report-mobile/dist/options';
import FilterTypes, { dateFilterType, DateType, dateFilterTypeList } from '@h3/report-mobile/basics/enum/filter-type';
import Filter from './element'
const ReportPro = namespace('report');
  @Component({
    name: 'h3-report-filter-element',
    components: {
      ...Filter
    }
  })
export default class SetFilter extends Vue {
    prefixCls = 'h3-report-filter-element';
    @Prop({ default: {} }) filter!: H3.Report.FilterPicker;


    /**
     *  值改变
     * @param value
     */
    valueChange(value:any) {
      if (value === '' || value === null) {
        this.filter.text.splice(0,this.filter.text.length);
      } else if (value instanceof Array) {
        this.filter.text.splice(0,this.filter.text.length,...value);
      } else {
        this.filter.text.splice(0,this.filter.text.length,value);
      }
      this.$emit('change', this.filter);
    }
    /**
     *  改变文本框及日期的值处理
     * @param value
     * @param index
     */
    
    /**
     * 生成组件
     */
    generatingComponent() {
      if (['None', 'NotNone'].includes(this.filter.formula)) {
        return null;
      }
      switch (this.filter.field.type) {
        case 'date':
          if (this.filter.formula === 'Range') {
            return 'FilterRangeDate'; // 范围输入框
          } else if(this.filter.formula === DateType.Dynamic) {
            return 'DynamicDate'  //动态筛选
          } else {
            return 'FilterDate'; // 单行文本输入框
          }
        case 'number':
          if (this.filter.formula === 'Range') {
            return 'FilterRangeInput'; // 范围输入框
          } else {
            return 'FilterInput'; // 单行文本输入框
          }
        case 'string':
          if (!['In', 'NotIn'].includes(this.filter.formula)) {
            return 'FilterInput'; // 单行文本输入框
          } else {
            return 'FilterMultiInput'; // 多项文本输入框
          }
      }
    }
    
    render(h: CreateElement) {
      const ValueComponent = () => {
        let component;
        let componentProps: H3.Report.FilterFieldExtend = {
          field: this.filter.field,
          formula: this.filter.formula,
          value: this.filter.text[0] ? this.filter.text : [],
        };
        if (typeof options.integrateComponents === 'function' && options.integrateComponents(this.filter.field, this.filter.formula,this.filter.format)) {
           component =  options.integrateComponents(this.filter.field, this.filter.formula,this.filter.format);
        } else {
           component = this.generatingComponent();
           componentProps.format = this.filter.format;
        }
        let extendProps: any = {
          selectDateType: this.filter.selectDateType || 'Custom',
          operation: this.filter.operation || '',
        };
        if (this.filter.field.type === "date") {
          extendProps.selectDateType =  this.filter.selectDateType || 'Custom',
          extendProps.operation = this.filter.operation || ''
        }
        // 为了不修改前面的value，对动态筛选值做特殊处理
        if(this.filter.formula === DateType.Dynamic){
          extendProps.value = this.filter.text
        }
        Object.assign(componentProps, extendProps);
        if(component) {
          return  h(component, {
            props: componentProps,
            on: {
              input: (value: any) => {
                this.valueChange(value);
              }
            }
          });
        } else {
          return null
        }
      };
      return ValueComponent();
    }
    
    created() {
    }
  }
</script>
<style lang="less">
</style>
