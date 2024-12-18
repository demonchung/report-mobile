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
    <a-tooltip 
      v-if="showToolTip" 
      placement="top" 
      :title="value[0]+' ~ '+value[1]"
    >
      <a-range-picker
        :format="dateFormat"
        :getCalendarContainer="getCurrentNode"
        :dropdownClassName="`${prefixCls}-picker`"
        :showTime="timeParams"
        :open="isOpen"
        :value="dateValue"
        :mode="mode"
        @openChange="handleOpenDateChange"
        @panelChange="handlePanelChange"
        @change="changeValue"
      >
        <template slot="renderExtraFooter">
          <a :class="`${comPrefixCls}__clear-btn`" @click="clearDate"> 清除 </a>
        </template>
      </a-range-picker>
    </a-tooltip>

    <a-range-picker
      v-else
      :format="dateFormat"
      :getCalendarContainer="getCurrentNode"
      :dropdownClassName="`${prefixCls}-picker`"
      :showTime="timeParams"
      :open="isOpen"
      :value="dateValue"
      :mode="mode"
      @openChange="handleOpenDateChange"
      @panelChange="handlePanelChange"
      @change="changeValue"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearDate"> 清除 </a>
      </template>
    </a-range-picker>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import FilterMixins from "@h3/report-mobile/basics/mixins/filter-mixins";
import { DatePicker, Select, Tooltip } from "@h3/antd-vue";
import { dateFormatList } from "@h3/report-mobile/basics/enum/filter-type";

import  {
  dateFilterType,
  DateFilterType,
  DateType,
  dateFilterTypeList,
  FormatDateType,
  DateFormatType
} from "@h3/report-mobile/basics/enum/filter-type";
import moment, { Moment } from "moment";
@Component({
  name: "h3-report-element-filter-range-date",
  components: {
    ARangePicker: DatePicker.RangePicker,
    ASelect: Select,
    ATooltip: Tooltip
  }
})
export default class ReportElementFilterDate extends Mixins<FilterMixins>(FilterMixins) {
  prefixCls = `${this.comPrefixCls}__date-wrap`;
  @Prop({ default: "" }) format!: string; // 格式
  @Prop() tiling!: boolean; // 是否平铺
  @Prop({ default: false }) showFilterFormatSelect!: boolean; // 是否展示筛选方式下拉选择框
  @Prop({ default: false }) showTip!: boolean;

  // 日期按钮是否能对日历做操作
  isOpenDate: boolean = false;
  // 日期的展示值 moment
  dateValue: Moment | Array<Moment | null> | null | any = null;

  //formatList: Array<{ label: string; value: string }> = formatDataList; // 筛选方式
get formatList(){
  return this.$r_gt(dateFormatList,this.$r_languageType)
}
get showToolTip() {
  if (this.showTip && this.value[0] && (this.format === "YMDHMS"|| this.format === "YMDHM")) {
      return true;
    } else {return false;}
  }
  /**
   *  监听值改变
   */
  @Watch("value", { immediate: true, deep: true })
  changeField(value: any) {
    if (value instanceof Array) {
      if (this.formula === DateType.Range && (value[0] || value[1])) {
        this.dateValue = this.getFormatDate(value);
      } else {
        this.dateValue = null;
      }
    }
  }
  /**
   *  时间选择参数
   */
  get timeParams() {
    return this.format === "YMDHM"
      ? {
          format: "HH:mm",
          defaultValue: [moment("00:00", "HH:mm"), moment("00:00", "HH:mm")]
        }
      : this.format === "YMDHMS" 
      ? {
          format: "HH:mm:ss",
          defaultValue: [moment("00:00:00", "HH:mm:ss"), moment("00:00:00", "HH:mm:ss")]
        } 
      : false;
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

  /**
   * 日期选择模型
   */
  get mode() {
    let f: any = "date";
    switch (this.format) {
      case DateFormatType.Y:
        f = ["year", "year"];
        break;
      case DateFormatType.YM:
        f = ["month", "month"];
        break;
      case DateFormatType.YMD:
        f = ["date", "date"];
        break;
      case DateFormatType.YMDHM:
        f = ["date", "date"];
        break;
      case DateFormatType.YMDHMS:
        f = ["date", "date"];
        break;
    }
    return f;
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
    }
    return f;
  }

  /**
   * 当期日改变了
   */
  handlePanelChange(value, mode) {
    this.dateValue = value;
    const v = value.map(m => m.format(this.dateFormat));
    this.emitValue(v);
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
  /*
   * 清除时间
   * */
  clearDate() {
    this.emitValue([]);
  }
  
  formatChange(value: string) {
    // this.tmpFilterPicker.format = value;
    this.clearDate();
    this.$emit("change-format", value);
  }
  /**
   * 计算格式化的时间
   */
  getFormatDate(value) {
    const start = value[0] || null;
    const end = value[1] || null;

    const startDate = start ? moment(start, this.dateFormat) : null;
    const endDate = end ? moment(end, this.dateFormat) : null;

    return [startDate, endDate];
  }
}
</script>
<style lang="less"></style>
