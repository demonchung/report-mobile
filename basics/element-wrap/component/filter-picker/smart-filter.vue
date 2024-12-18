<template>
  <div :class="prefixCls">
    <h3-filter-element
      v-if="filter.field"
      :filter="filter"
      :format ="chart.format"
      :chart-size = "chartSize" 
      :status ="status"
      @change-value="changeValue"
      @change-options="changeOptions"
      :chartId="chart.uid"
    ></h3-filter-element>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ElementType } from '@h3/report-mobile/basics/enum/chart-type';
import H3FilterElement from '@h3/report-mobile/basics/components/filter/filter-element.vue';

  @Component({
    name: 'h3-report-smart-filter',
    components: {
      H3FilterElement
    }
  })
export default class ReportSmartFilter extends Vue {
    @Prop() chart!: H3.Report.FilterPicker;
    @Prop({ default: '' }) status?: 'design' | 'report' | 'preview'; // 状态
    prefixCls = 'h3-report-smart-filter';
    timer: any = null;  // 定时器，延时筛选用
    chartSize: { h?: number, w?: number} = {};
    // 过滤条件
    get filter(){
      if (this.chart.type === ElementType.FILTERPICKER) {
        return {
          field: ((this.chart as H3.Report.FilterPicker).dataSources.length && (this.chart as H3.Report.FilterPicker).dataSources[0].field) ? (this.chart as H3.Report.FilterPicker).dataSources[0].field : (this.chart as H3.Report.FilterPicker).field,
          formula: (this.chart as H3.Report.FilterPicker).formula,
          text: (this.chart as H3.Report.FilterPicker).text,
          selectDateType:(this.chart as H3.Report.FilterPicker).selectDateType,
          operation:(this.chart as H3.Report.FilterPicker).operation,
        };
      }
    }
    
    // 监听公式改变
    @Watch('chart.formula', { deep: true })
    changeFormula(formula: string) {
      this.chart.formula = formula;
      if (this.status !== "design") {
        this.$emit('change', this.chart);
      }
    }
    /**
     * 改变值
     * @param value 筛选值
     */
    changeValue(value: Array<any>){
      this.chart.text = value;
      // this.setFilter()
      this.$emit('change', this.chart);
    }

    changeOptions(dataKeyValue){
      Object.keys(dataKeyValue).forEach((key)=>{
        this.chart[key] = dataKeyValue[key]
      })
      this.$emit('change', this.chart);
    }
   
    /**
     * 刷新过滤器
     */
    refreshFilterPicker() {
      setTimeout(() => {
        this.$set(this.chartSize, 'w', this.chart.w);
        this.$set(this.chartSize, 'h', this.chart.h);
      }, 50); // 动画延迟
    }
    mounted() {
      this.refreshFilterPicker();
      this.$emit('register-refresh', {
        view: this.refreshFilterPicker
      });
    }
}

</script>

