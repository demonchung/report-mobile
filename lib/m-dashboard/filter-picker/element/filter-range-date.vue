<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}__wrap`">
      <div :class="`${prefixCls}__content`">
        <div :class="`${prefixCls}__input`" @click="showDate('start', $event)">
          <div :class="`${prefixCls}__placeholder`" v-if="!textStartValue">
            {{ placeholderStart }}
          </div>
          <div :class="`${prefixCls}__text`" v-else>{{ textStartValue }}</div>
        </div>
        <div :class="`${prefixCls}__error`" v-if="false"></div>
      </div>
      <h3-svg name="minus-stroke" color="#707481"></h3-svg>
      <div :class="`${prefixCls}__content`">
        <div :class="`${prefixCls}__input`" @click="showDate('end', $event)">
          <div :class="`${prefixCls}__placeholder`" v-if="!textEndValue">{{ placeholderEnd }}</div>
          <div :class="`${prefixCls}__text`" v-else>{{ textEndValue }}</div>
        </div>
        <div :class="`${prefixCls}__error`" v-if="false"></div>
      </div>
    </div>
    <h3-datetime-picker
      v-model="dateVisible"
      :value="dateValue"
      :format="dateFormat"
      @select="changeDate"
      :startDate="startDate"
      :endDate="endDate"
      maskClosable
    />
    <h3-toast
      :visible="showToast"
      :maskClosable="true"
      @hide="hideToast"
      :auto-hide="true"
      :duration="2000"
      :text="toastText"
      mask
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { H3DatetimePicker, H3Radio, H3Toast } from "@h3/thinking-ui";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import dateInput from "./date-input.vue";
import FilterTypes, {
  dateFilterType,
  DateFilterType,
  DateType,
  FormatDateType,
  DateFormatType
} from "@h3/report-mobile/basics/enum/filter-type";

const ReportPro = namespace("report");
@Component({
  name: "h3-report-filter-range-date",
  components: {
    dateInput,
    H3DatetimePicker,
    H3Radio,
    H3RadioGroup: H3Radio.Group,
    H3Toast,
    H3Svg: Svg
  }
})
export default class ReportFilterRangeDate extends Vue {
  @Prop({ default: () => [] }) value!: Array<string | number | any>;
  @Prop({ default: () => [] }) field!: H3.Report.FieldColumn;
  @Prop({ default: "" }) formula!: string;
  @Prop({ default: "" }) format!: string;

  prefixCls = "h3-report-filter-range-date";
  placeholderStart: string = "开始日期";
  placeholderEnd: string = "结束日期";
  currentDateType: string = ""; // 当前日期先后类型
  textStartValue: string = ""; // 实际值
  textEndValue: string = ""; // 实际值
  dateVisible: boolean = false; // 是否显示日期组件
  showToast: boolean = false; // 是否显示
  toastText: string = ""; // 吐司提示

  @Watch("value", { immediate: true, deep: true })
  changeValue(value: Array<string | number | any>) {
    if (value.length === 2) {
      this.textStartValue = value[0] ? value[0] : "";
      this.textEndValue = value[1] ? value[1] : "";
    } else {
      this.textStartValue = "";
      this.textEndValue = "";
    }
  }

  get startDate() {
    if (this.currentDateType === "end" && this.textStartValue) {
      return this.textStartValue;
    } else {
      return null;
    }
  }
  get endDate() {
    if (this.currentDateType === "start" && this.textEndValue) {
      return this.textEndValue;
    } else {
      return null;
    }
  }
  get showRadio() {
    return this.formula === DateType.Equal;
  }

  get dateValue() {
    return this.currentDateType === "start" ? this.textStartValue : this.textEndValue;
  }

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
   * 检查日期
   * @param value 当前选择日期
   */
  checkDate(value: string): boolean {
    if (this.currentDateType === "start") {
      if (this.textEndValue) {
        if (new Date(this.textEndValue.replace(/-/g, "\/")) < new Date(value.replace(/-/g, "\/"))) {
          this.showToast = true;
          this.toastText = "开始日期大于结束日期";
          return false;
        }
      }
    } else {
      if (this.textStartValue) {
        if (
          new Date(this.textStartValue.replace(/-/g, "\/")) > new Date(value.replace(/-/g, "\/"))
        ) {
          this.showToast = true;
          this.toastText = `结束日期小于开始日期`;
          return false;
        }
      }
    }
    return true;
  }
  /**
   * 关闭吐司
   */
  hideToast(value: boolean) {
    this.showToast = value;
  }
  /**
   * 选择日期
   */
  changeDate(value: string) {
    const res: boolean = this.checkDate(value);
    if (!res) {return;}
    if (this.currentDateType === "start") {
      this.textStartValue = value;
    } else {
      this.textEndValue = value;
    }
    if (this.textStartValue && this.textEndValue) {
      const textValue = [this.textStartValue, this.textEndValue];
      this.$emit("input", textValue);
    }
  }

  /**
   * 展示日期
   * @param type
   */
  showDate(type: string) {
    this.currentDateType = type;
    this.dateVisible = true;
  }

  created() {}
}
</script>
<style lang="less">
.h3-report-filter-range-date {
  padding: 16px;
  &__wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  &__content {
    width: 46%;
  }
  &__placeholder {
    color: #999;
  }
  &__text {
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__input {
    background-color: #fff;
    height: 28px;
    line-height: 26px;
    text-align: center;
    border-radius: 14px;
    border: 1px solid rgba(235, 237, 242, 1);
    font-size: 12px;
  }
  &__error {
    text-align: center;
    font-size: 14px;
    color: #ff4384;
    padding-top: 4px;
  }
  .straightline {
    display: flex;
    align-items: center;
    max-width: 8%;
    font-size: 12px;
    color: #999;
    padding: 0 4px;
  }
}
</style>
