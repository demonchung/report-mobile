<template>
  <div :class="`${prefixCls}`">
    <a-select
      :class="[`${prefixCls}-select`]"
      :options="formatList"
      :defaultValue="format || 'YMD'"
      @change="formatChange"
      v-show="showFilterFormatSelect"
    >
    </a-select>
    <!-- <a-select
      v-show="showCustomTime"
      :class="[`${prefixCls}-select`, agileValue === 'Custom' ? `${prefixCls}-custom` : '']"
      :options="selectList"
      :value="agileValue"
      placeholder="自定义"
      @change="agileTimeChange"
    >
    </a-select> -->
    <a-date-picker
      v-if="showDatePicker"
      :format="dateFormat"
      :value="dateValue"
      :dropdownClassName="`${prefixCls}-picker`"
      :getCalendarContainer="getCurrentNode"
      :open="isOpen"
      :showTime="timeParams"
      @openChange="handleOpenDateChange"
      @change="changeValue"
      :showToday="false"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearDate"> 清除 </a>
      </template>
    </a-date-picker>

    <a-date-picker
      v-if="agileValue === 'Custom' && format === 'Y'"
      :format="dateFormat"
      :value="dateValue"
      :dropdownClassName="`${prefixCls}-picker`"
      :getCalendarContainer="getCurrentNode"
      :open="isOpen"
      :mode="mode"
      @openChange="handleOpenDateChange"
      @panelChange="handlePanelChange"
      @change="changeValue"
      :showToday="false"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearDate"> 清除 </a>
      </template>
    </a-date-picker>

    <a-month-picker
      v-if="agileValue === 'Custom' && format === 'YM'"
      :format="dateFormat"
      :value="dateValue"
      :dropdownClassName="`${prefixCls}-picker`"
      :getCalendarContainer="getCurrentNode"
      :open="isOpen"
      :showTime="timeParams"
      @openChange="handleOpenDateChange"
      @change="changeValue"
      :showToday="false"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearDate"> 清除 </a>
      </template>
    </a-month-picker>

    <a-time-picker
      v-if="showTimePicker"
      :format="dateFormat"
      :value="dateValue"
      :dropdownClassName="`${prefixCls}-picker`"
      :getCalendarContainer="getCurrentNode"
      popupClassName = "date-time-picker"
      :open="isOpen"
      :showTime="timeParams"
      @openChange="handleOpenDateChange"
      @change="changeValue"
      :showToday="false"
      style="width: 100% !important"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearDate"> 清除 </a>
      </template>
    </a-time-picker>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import FilterMixins from "@h3/report-mobile/basics/mixins/filter-mixins";
import { Select, DatePicker, TimePicker } from "@h3/antd-vue";
import { dateFilterType, DateFilterType, FormatDateType,DateType } from "@h3/report-mobile/basics/enum/filter-type";
import moment, { Moment } from "moment";
import { DateFormatType, dateFormatList } from "@h3/report-mobile/basics/enum/filter-type";
@Component({
  name: "h3-report-element-filter-single-date",
  components: {
    ADatePicker: DatePicker,
    AMonthPicker: DatePicker.MonthPicker,
    ATimePicker: TimePicker,
    ASelect: Select,
    ASelectOptGroup: Select.OptGroup,
    ASelectOption: Select.Option
  }
})
export default class ReportElementFilterSingleDate extends Mixins<FilterMixins>(FilterMixins) {
  prefixCls = `${this.comPrefixCls}__date-wrap`;
  @Prop({ default: "" }) format!: string; // 格式
  @Prop() tiling!: boolean; // 是否平铺
  @Prop({ default: false }) showFilterFormatSelect!: boolean; // 是否展示筛选方式下拉选择框

  // 日期按钮是否能对日历做操作
  isOpenDate: boolean = false;
  // 日期的展示值 moment
  dateValue: Moment | Array<Moment | null> | null | any = null;
  // 自定义日期实际值-默认Today
  agileValue: string = "";

  get mode() {
    return this.format === 'Y'? "year" : "date";
  }
  //formatList: Array<{ label: string; value: string }> = formatDataList; // 筛选方式
  get formatList(){
    return this.$r_gt(dateFormatList,this.$r_languageType)
  }
  // 日期操作列表（月份的时候只有本月和上月还有自定义）
  get selectList(): Array<{ value: string; label: string }> {
    const m = [DateFilterType.Custom, DateFilterType.ThisMonth, DateFilterType.LastMonth];
    return this.format === FormatDateType.Month
      ? dateFilterType.filter(d => m.includes(d.value))
      : dateFilterType;
  }
 
   showCustomTime() {
     return ![DateType.Range, DateType.None, DateType.NotNone].includes(this.formula as any)
   }
  /**
   * 监听格式的变化
   */
  @Watch("format")
  onFormulaChanged(newVal, oldVal) {
    if (newVal === FormatDateType.Month) {
      this.agileValue = this.selectList[0].value;
    }
  }

  /**
   *  监听值改变
   */
  @Watch("value", { immediate: true, deep: true })
  changeField(value: any) {
    console.log(11,value)
    if (value instanceof Array) {
      const tmpTimeValue: { label: string; value: string } | undefined = dateFilterType.find(
        (item: any) => item.value === value[0]
      );
      if (tmpTimeValue) {
        this.agileValue = tmpTimeValue.value;
      } else {
        this.agileValue = "Custom";
        if (value[0]) {
          switch (this.format) {
            case DateFormatType.Y:
              this.dateValue = moment(value[0], "YYYY");
              break;
            case DateFormatType.YM:
              this.dateValue = moment(value[0], "YYYY-MM");
              break;
            case DateFormatType.YMD:
              this.dateValue = moment(value[0], "YYYY-MM-DD");
              break;
            case DateFormatType.YMDHM:
              this.dateValue = moment(value[0], "YYYY-MM-DD HH:mm");
              break;
            case DateFormatType.YMDHMS:
              this.dateValue = moment(value[0], "YYYY-MM-DD HH:mm:ss");
              break;
            case DateFormatType.HM:
              this.dateValue = moment(value[0], "HH:mm");
              break;
            case DateFormatType.HMS:
              this.dateValue = moment(value[0], "HH:mm:ss");
              break;
          }
        } else {
          this.dateValue = null;
        }
      }
    }
  }
  formatChange(value: string) {
    // this.tmpFilterPicker.format = value;
    this.clearDate();
    this.$emit("change-format", value);
  }
  /**
   *  时间选择参数
   */
  get timeParams() {
    return this.format === "YMDHM"
      ? {
          format: "HH:mm",
          defaultValue: moment("00:00", "HH:mm")
        }
      : this.format === "YMDHMS" 
      ? {
          format: "HH:mm:ss",
          defaultValue: moment("00:00:00", "HH:mm:ss")
        } 
      : false;
  }

  get showDatePicker() {
    return this.agileValue === 'Custom' && 
    (this.format === 'YMD' || this.format === 'YMDHM' || this.format === 'YMDHMS' || this.format === '') ? true : false;
  }
  get showTimePicker() {
    return this.agileValue === 'Custom' && 
    (this.format === 'HM' || this.format === 'HMS') ? true : false;
  }

  /**
   *  组件是否打开
   */
  get isOpen() {
    return this.tiling ? true : this.isOpenDate;
  }
  /**
   *  弹窗组件当前挂载节点
   */
  getCurrentNode() {
    return this.tiling ? this.$el.parentNode : document.body;
  }

  get showTimeFlag() {
    return this.format === "Time";
  }
  /**
   *  日期格式
   */
  get dateFormat() {
    let f = "YYYY-MM-DD";
    switch (this.format) {
      case DateFormatType.Y:
        f = "YYYY";
        break;
      case DateFormatType.YM:
        f = "YYYY-MM";
        break;
      case DateFormatType.YMD:
        f = "YYYY-MM-DD";
        break;
      case DateFormatType.YMDHM:
        f = "YYYY-MM-DD HH:mm";
        break;
      case DateFormatType.YMDHMS:
        f = "YYYY-MM-DD HH:mm:ss";
        break;
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
   *  处理日期展开关闭
   */
  handleOpenDateChange(open: boolean) {
    this.isOpenDate = open;
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
  //年份选择器修改值处理
  handlePanelChange(value, mode) {
    this.dateValue = value;
    const v = value.format(this.dateFormat);
    this.emitValue(v);
    this.isOpenDate = false;
  }
  /*
   * 清除时间
   * */
  clearDate() {
    this.emitValue(null);
  }
  /**
   *  自定义日期改变
   * @param value
   */
  agileTimeChange(value: string) {
    this.agileValue = value;
    this.dateValue = null;
    const tmpValue: string = value !== DateFilterType.Custom ? value : this.dateValue;
    this.emitValue(tmpValue);
  }
}
</script>
