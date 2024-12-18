<template>
  <div class="dynaMic_by_class">
    <div :class="`${prefixCls}`">
      <a-select
        :class="[`${prefixCls}-select`, dateType === 'Custom' ? `${prefixCls}-custom` : '']"
        :options="selectList"
        :value="dateType"
        placeholder="自定义"
        @change="changeType"
      >
      </a-select>
      <!-- //两个日期组件 -->
      <!-- 1:单个下拉日期组件 -->
      <dyna-date-picker
        v-if="dateType === 'Custom'"
        @change="changeDate"
        :defaultValue="dateValue"
      />
      <!-- 2:多个下拉日期组件 -->
      <!-- <dynaDateSelectPicker
        v-if="dateType === 'Custom' && !showFilterFormatSelect"
        @change="changeDate"
        :defaultValue="dateValue"
      /> -->
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import FilterMixins from "@h3/report-mobile/basics/mixins/filter-mixins";
import { DatePicker, Select, Checkbox } from "@h3/antd-vue";
import { formatDataList } from "@h3/report-mobile/basics/enum/filter-type";
import dynaDatePicker from '@h3/report-mobile/basics/components/dyna-date-picker';
import dynaDateSelectPicker from '@h3/report-mobile/basics/components/dyna-date-select-picker';
import {dateSelectList} from '@h3/report-mobile/basics/utils/dateMap';
import { fomatterValue } from '@h3/report-mobile/basics/utils/dyncmic-date-help';
import  {
  DateFilterType,
  DateType,
  dateFilterTypeList,
  FormatDateType,
} from "@h3/report-mobile/basics/enum/filter-type";
import moment, { Moment } from "moment";
import { start } from "repl";
@Component({
  name: "h3-report-element-filter-dynamic-date",
  components: {
    ARangePicker: DatePicker.RangePicker,
    ASelect: Select,
    ACheckbox:Checkbox,
    dynaDatePicker,
    dynaDateSelectPicker,
  }
})
export default class ReportElementFilterDate extends Mixins<FilterMixins>(FilterMixins) {
  prefixCls = `h3-report-element-filter-dynamic-date`;
  @Prop({ default: "" }) format!: string; // 格式
  @Prop() tiling!: boolean; // 是否平铺
  @Prop({ default: false }) showFilterFormatSelect!: boolean; // 是否展示筛选方式下拉选择框
  @Prop({ default: '' }) selectDateType!: string; // 快捷方式
  @Prop({ default: '' }) operation!: string; //是否是不等于
  @Prop({ default: '' }) showNotTipComponent!: string; // 是否显示不等于checkbox组件


  // 日期按钮是否能对日历做操作
  isOpenDate: boolean = false;
  // 日期的展示值 moment
  dateValue: Moment | Array<Moment | null> | null | any = null;

  formatList: Array<{ label: string; value: string }> = formatDataList; // 筛选方式
  //selectList:Array<any> =  dateSelectList;
  get selectList(){
    return this.$r_gt(dateSelectList,this.$r_languageType)
  }
  dateType:string = 'Custom'
  /**
   *  监听值改变
   */
  @Watch("value", { immediate: true, deep: true })
  changeField(value: any) {
    if (value instanceof Array) {
      if (this.formula === DateType.Dynamic) {
        this.dateValue = fomatterValue(value);
      } else {
        this.dateValue = null;
      }
    }
  }

  @Watch('selectDateType',{immediate:true,deep:true})
  changeDateType(newV){
    this.dateType = newV || 'Custom'
  }
  /**
   * 修改自定义，今天，昨天....
  */
  changeType(value){
    this.dateType = value;
    this.$emit('change-options',{
      selectDateType : value,
    })
    //其它值需要传递
    if(value!== 'Custom'){
      try {
        this.emitValue(JSON.parse(value))
      } catch (error) {}
    }
  }

  /**
   * 日期选择模型
   */
  get mode() {
    let f: any = "date";
    switch (this.format) {
      case FormatDateType.Date:
        f = ["date", "date"];
        break;
      case FormatDateType.Time:
        f = ["date", "date"];
        break;
      case FormatDateType.Month:
        f = ["month", "month"];
        break;
    }
    return f;
  }
  //需要改动 value:[['-','1','d'],['-','1','y']] 转化成['1d','-1y']
  forMatArr(value){
    if(value){
      const res:any =[];
      value.forEach((arr)=>{
        if(arr.includes(null)){
          res.push(null)
        }else{
          res.push(arr.join(""));
        }
      })
      return res;
    }
    return [null,null]
  }
  changeDate(value){
    if(value){
      const res = this.forMatArr(value)
      this.emitValue(res)
    }
  }
  /**
   *  改变日期的值处理
   * @param date
   * @param dateString
   */
  changeValue(date: Moment, dateString: string) {
    this.dateValue = date;
    this.emitValue(dateString);
  }
  /*
   * 清除时间
   * */
  clearDate() {
    this.emitValue([]);
  }
  formatChange(value: string) {
    // this.tmpFilterPicker.format = value;
    this.$emit("change-format", value);
  }
}
</script>
<style lang="less">
.h3-report-filter-modal .h3-report-element-filter-dynamic-date {
  display: flex;
  &-select{
      min-width: 90px;
      flex:1;
    }
  &-custom {
      margin-right: 10px;
    }
}
.h3-report-filter-picker .h3-report-element-filter-dynamic-date-select {
  width: 100%;
}
.h3-report-filter-element__date-wrap__red-tip{
  white-space: nowrap;
}
.h3-dashboard-chart-filter-value .dynaMic_by_class,.h3-report-stage-filter__value .dynaMic_by_class{
  display: flex;
  overflow: hidden;
  align-items: center;
  .h3-report-filter-element__date-wrap__red-tip{
    margin-top:0;
    margin-left: 10px;
  }
}
</style>
