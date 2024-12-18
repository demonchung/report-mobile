<template>
  <div :class="`${prefixCls}`">
    <a-select
      :class="[`${prefixCls}-select`]"
      :options="formatList"
      :defaultValue="format"
      @change="formatChange"
      v-show="showFilterFormatSelect"
    >
    </a-select>
    <a-time-picker
      :format="dateFormat"
      :value="startValue"
      :dropdownClassName="`${prefixCls}-picker`"
      :getCalendarContainer="getCurrentNode"
      popupClassName = "date-time-picker"
      @change="changeStartValue"
      :showToday="false"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearStartDate"> 清除 </a>
      </template>
    </a-time-picker>
    <span :class="`${comPrefixCls}__wavy-line`"> ~ </span>
    <a-time-picker
      :format="dateFormat"
      :value="endValue"
      :dropdownClassName="`${prefixCls}-picker`"
      popupClassName = "date-time-picker"
      :getCalendarContainer="getCurrentNode"
      @change="changeEndValue"
      :showToday="false"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearEndDate"> 清除 </a>
      </template>
    </a-time-picker>
  </div>
</template>
  <script lang="ts">
  import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
  
  import FilterMixins from "@h3/report-mobile/basics/mixins/filter-mixins";
  import { DatePicker, Select, TimePicker } from "@h3/antd-vue";
  import { DateType, FormatDateType, dateFormatList, DateFormatType } from "@h3/report-mobile/basics/enum/filter-type";
  import moment, { Moment } from "moment";
  @Component({
    name: "h3-report-element-filter-range-time",
    components: {
      ADatePicker: DatePicker,
      ASelect: Select,
      ATimePicker: TimePicker,
    }
  })
  export default class ReportElementFilterDate extends Mixins<FilterMixins>(FilterMixins) {
    prefixCls = `${this.comPrefixCls}__date-wrap`;
    @Prop({ default: "" }) format!: string; // 格式
    @Prop() tiling!: boolean; // 是否平铺
    @Prop({ default: false }) showFilterFormatSelect!: boolean; // 是否展示筛选方式下拉选择框
    // 日期按钮是否能对日历做操作
    isOpenDate: boolean = false;
    // 开始日期 moment
    startValue: Moment | Array<Moment | null> | null | any = null;
    // 结束日期 moment
    endValue: Moment | Array<Moment | null> | null | any = null;
    // 日期的展示值 string
    dateValue: Array<string | null> | null | any = [];
   
    get formatList(){
    return this.$r_gt(dateFormatList,this.$r_languageType)
  }
    /**
     *  监听值改变，在范围日历和单范围日历切换需要
     */
    @Watch("value", { immediate: true, deep: true })
    changeField(value: any) {
      if (value instanceof Array && this.formula === DateType.Range) {
        this.startValue = this.format === "HM"
          ? value[0]
            ? moment(value[0], "HH:mm")
            : null
          : value[0]
          ? moment(value[0], "HH:mm:ss")
          : null;
        this.endValue = this.format === "HM"
          ? value[1]
            ? moment(value[1], "HH:mm")
            : null
          : value[1]
          ? moment(value[1], "HH:mm:ss")
          : null;
        if (value[0] || value[1]) {
          this.dateValue = [value[0] ? value[0] : "", value[1] ? value[1] : ""];
        } else {
          this.dateValue = [];
        }
      }
    }
    
    /**
     *  弹窗组件当前挂载节点
     */
    getCurrentNode() {
      return this.tiling ? this.$el.parentNode : document.body;
    }

    formatChange(value: string) {
    this.clearEndDate();
    this.clearStartDate();
    this.$emit("change-format", value);
  }
    /**
     *  日期格式
     */
    get dateFormat() {
      let f = "HH:mm";
      switch (this.format) {
        case DateFormatType.HM:
        f = "HH:mm";
        break;
      case DateFormatType.HMS:
        f = "HH:mm:ss";
        break;
      }
      return f;
    }
  
    /**
     *  改变开始日期的值处理
     * @param date
     * @param dateString
     */
    changeStartValue(date: Moment, dateString: string) {
      this.startValue = date;
      this.$set(this.dateValue,  0 , dateString);
      this.emitValue(this.dateValue);
    }
    changeEndValue(date: Moment, dateString: string) {
      this.endValue = date;
      this.$set(this.dateValue,  1 , dateString);
      this.emitValue(this.dateValue);
    }
  
    /*
     * 清除时间
     * */
    clearStartDate() {
      this.$set(this.dateValue, 0, "");
      this.emitValue(this.dateValue);
    }
    clearEndDate() {
      this.$set(this.dateValue, 1, "");
      this.emitValue(this.dateValue);
    }
  }
  </script>
  <style lang="less">
  
  .h3-report-filter-picker .h3-report-filter-element__date-wrap .ant-time-picker {
    width: 111px !important;
  }
  .h3-report-filter-modal .h3-report-filter-element__date-wrap .ant-time-picker {
    width: 203px !important;
  }
  .h3-report-stage-filter__value .h3-report-filter-element__wavy-line {
    padding: 0 3px 0 24px;
  }
</style>
  