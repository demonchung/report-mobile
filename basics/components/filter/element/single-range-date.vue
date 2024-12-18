<template>
  <div :class="`${prefixCls}`">
    <a-date-picker
      :format="dateFormat"
      :getCalendarContainer="getCurrentNode"
      :showTime="startTimeParams"
      :open="isOpen"
      :value="startValue"
      :showToday="false"
      :disabledDate="disabledStartDate"
      :class="{ [`${prefixCls}-single`]: true, active: toggleOpen }"
      :dropdownClassName="`${comPrefixCls}__single-picker-${toggleOpen ? 'active' : 'hide'}`"
      placeholder="起始日期"
      @openChange="handleOpenDateChange"
      @change="changeValue"
      @click.native="handleSelect(true)"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearDate"> 清除 </a>
      </template>
    </a-date-picker>
    <span :class="`${comPrefixCls}__wavy-line`"> ~ </span>
    <a-date-picker
      :format="dateFormat"
      :getCalendarContainer="getCurrentNode"
      :showTime="endTimeParams"
      :open="isOpen"
      :value="endValue"
      :showToday="false"
      :disabledDate="disabledEndDate"
      :class="{ [`${prefixCls}-single`]: true, active: !toggleOpen }"
      :dropdownClassName="`${comPrefixCls}__single-picker-${toggleOpen ? 'hide' : 'active'}`"
      placeholder="结束日期"
      @openChange="handleOpenDateChange"
      @change="changeValue"
      @click.native="handleSelect(false)"
    >
      <template slot="renderExtraFooter">
        <a :class="`${comPrefixCls}__clear-btn`" @click="clearDate"> 清除 </a>
      </template>
    </a-date-picker>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";

import FilterMixins from "@h3/report-mobile/basics/mixins/filter-mixins";
import { DatePicker } from "@h3/antd-vue";
import { DateType, FormatDateType } from "@h3/report-mobile/basics/enum/filter-type";
import moment, { Moment } from "moment";
@Component({
  name: "h3-report-element-filter-range-date",
  components: {
    ADatePicker: DatePicker
  }
})
export default class ReportElementFilterDate extends Mixins<FilterMixins>(FilterMixins) {
  prefixCls = `${this.comPrefixCls}__date-wrap`;
  @Prop({ default: "" }) format!: string; // 格式
  @Prop() tiling!: boolean; // 是否平铺
  // 日期按钮是否能对日历做操作
  isOpenDate: boolean = false;
  // 开始日期 moment
  startValue: Moment | Moment[] | null = null;
  // 结束日期 moment
  endValue: Moment | Moment[] | null = null;
  // 日期的展示值 string
  dateValue: Array<string | null> | null | any = [];
  // 单范围日历的切换 true/false 左边/右边
  toggleOpen: boolean = true;
  timeParams: any = {
    format: "HH:mm",
    disabledHours: this.disabledHours,
    disabledMinutes: this.disabledMinutes
  };
  /**
   *  监听值改变，在范围日历和单范围日历切换需要
   */
  @Watch("value", { immediate: true, deep: true })
  changeField(value: any) {
    if (value instanceof Array && this.formula === DateType.Range) {
      this.startValue = this.showTimeFlag
        ? value[0]
          ? moment(value[0], "YYYY-MM-DD HH:mm")
          : null
        : value[0]
        ? moment(value[0], "YYYY-MM-DD")
        : null;
      this.endValue = this.showTimeFlag
        ? value[1]
          ? moment(value[1], "YYYY-MM-DD HH:mm")
          : null
        : value[1]
        ? moment(value[1], "YYYY-MM-DD")
        : null;
      if (value[0] || value[1]) {
        this.dateValue = [value[0] ? value[0] : "", value[1] ? value[1] : ""];
      } else {
        this.dateValue = [];
      }
    }
  }

  /**
   *  开始时间选择参数
   */
  get startTimeParams() {
    return this.showTimeFlag
      ? Object.assign({}, this.timeParams, { defaultValue: moment("00:00", "HH:mm") })
      : false;
  }
  /**
   *  结束时间选择参数
   */
  get endTimeParams() {
    return this.showTimeFlag
      ? Object.assign({}, this.timeParams, { defaultValue: moment("23:59", "HH:mm") })
      : false;
  }

  /**
   *  组件是否打开
   */
  get isOpen() {
    return this.tiling ? true : this.isOpenDate;
  }
  /**
   *  组件是否打开
   *  @bol  点击left/right true/false
   */
  handleSelect(bol: boolean) {
    this.toggleOpen = bol;
  }
  /**
   *  弹窗组件当前挂载节点
   */
  getCurrentNode() {
    return this.tiling ? this.$el.parentNode : document.body;
  }
  /**
   *  禁用开始日期
   */
  disabledStartDate(startValue: Moment | null) {
    const { endValue } = this;
    if (!startValue || !endValue) {
      return false;
    }
    return this.showTimeFlag
      ? (endValue as Moment).isBefore(startValue, "day")
      : (endValue as Moment).isSameOrBefore(startValue, "day");
  }
  /**
   *  禁用结束日期
   */
  disabledEndDate(endValue: Moment | null) {
    const { startValue } = this;
    if (!endValue || !startValue) {
      return false;
    }
    return this.showTimeFlag
      ? (startValue as Moment).isAfter(endValue, "day")
      : (startValue as Moment).isSameOrAfter(endValue, "day");
  }
  /**
   *  禁用部分小时
   */
  disabledHours() {
    const { startValue } = this;
    const { endValue } = this;
    const hours: Array<any> = [];
    if (startValue && endValue && (startValue as Moment).isSame(endValue as Moment, "day")) {
      const endHour = parseInt((endValue as Moment).format("HH"));
      const startHour = parseInt((startValue as Moment).format("HH"));
      if (this.toggleOpen) {
        for (let i = endHour < 23 ? endHour + 1 : endHour; i < 24; i++) {
          hours.push(i);
        }
      } else {
        for (let i = 0; i < startHour; i++) {
          hours.push(i);
        }
      }
    }
    return hours;
  }
  /**
   *  禁用部分分钟
   */
  disabledMinutes(selectedHour: number) {
    const { startValue } = this;
    const { endValue } = this;
    const minutes: Array<any> = [];
    if (startValue && endValue && (startValue as Moment).isSame(endValue as Moment, "day")) {
      const endHour = parseInt((endValue as Moment).format("HH"));
      const startHour = parseInt((startValue as Moment).format("HH"));
      const endMinute = parseInt((endValue as Moment).format("mm"));
      const startMinute = parseInt((startValue as Moment).format("mm"));
      if (this.toggleOpen) {
        if (selectedHour === endHour) {
          for (let i = endMinute; i < 60; i++) {
            minutes.push(i);
          }
        }
      } else {
        if (selectedHour === startHour) {
          for (let i = 0; i <= startMinute; i++) {
            minutes.push(i);
          }
        }
      }
    }
    return minutes;
  }
  /**
   *  精确: 日期 / 日期时间
   */
  get showTimeFlag() {
    return this.format === "Time";
  }
  /**
   *  日期格式
   */
  get dateFormat() {
    let f = "YYYY-MM-DD";
    switch (this.format) {
      case FormatDateType.Date:
        f = "YYYY-MM-DD";
        break;
      case FormatDateType.Time:
        f = "YYYY-MM-DD HH:mm";
        break;
      case FormatDateType.Month:
        f = "YYYY-MM";
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
   *  改变开始日期的值处理
   * @param date
   * @param dateString
   */
  changeValue(date: Moment, dateString: string) {
    if (this.toggleOpen) {
      this.startValue = date;
    } else {
      this.endValue = date;
    }
    this.$set(this.dateValue, this.toggleOpen ? 0 : 1, dateString);
    this.emitValue(this.dateValue);
  }

  /*
   * 清除时间
   * */
  clearDate() {
    this.$set(this.dateValue, this.toggleOpen ? 0 : 1, "");
    this.emitValue(this.dateValue);
  }
}
</script>
<style lang="less"></style>
