<template>
  <div :class="`${prefixCls}`">
    <h3-radio-group
      v-if="showRadio"
      v-model="textValue"
      layout="vertical"
      @change="changeDateType"
    >
      <h3-radio
        class="custom-radio"
        :value="customType.value"
        :label="customType.label"
        :key="customType.value"
      >
        <div>{{ customType.label }}</div>
        <div class="date-input-wrap">
          <date-input
            v-model="dateValue"
            :placeholder="placeholderText"
            @click="showDate"
          >
            <h3-svg 
              name="field-date-stroke"
              w="18"
              h="18"
              color="#707481"
            ></h3-svg>
          </date-input>
        </div>
      </h3-radio>
      <h3-radio
        v-for="item in selectList"
        :value="item.value"
        :label="item.label"
        :key="item.value"
      />
    </h3-radio-group>
    <date-input
      v-else
      v-model="dateValue"
      :placeholder="placeholderText"
      @click="showDate"
    >
      <h3-svg 
        name="field-date-stroke"
        w="14"
        h="14"
        color="#707481"
      ></h3-svg>
    </date-input>
    <h3-datetime-picker
      v-model="dateVisible"
      :value="dateValue"
      :format="dateFormat"
      @select="changeDate"
      maskClosable
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { H3DatetimePicker, H3Radio } from "@h3/thinking-ui";
import dateInput from "./date-input.vue";
import FilterTypes, {
  dateFilterType,
  DateFilterType,
  DateType,
  FormatDateType,
  DateFormatType
} from "@h3/report-mobile/basics/enum/filter-type";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";

const ReportPro = namespace("report");
@Component({
  name: "h3-report-filter-date",
  components: {
    dateInput,
    H3DatetimePicker,
    H3Radio,
    H3RadioGroup: H3Radio.Group,
    H3Svg: Svg
  }
})
export default class ReportFilterDate extends Vue {
  @Prop({ default: () => [] }) value!: Array<string | number | any>;
  @Prop({ default: () => [] }) field!: H3.Report.FieldColumn;
  @Prop({ default: "" }) formula!: string;
  @Prop({ default: "" }) format!: string;

  prefixCls = "h3-report-filter-date";
  placeholderText: string = "选择时间";
  dateValue: string | null = null; // 日期格式的值
  textValue: string = ""; // 实际值
  dateVisible: boolean = false; // 是否显示日期组件

  @Watch("value", { immediate: true, deep: true })
  changeValue(value: Array<string | number | any>) {
    if (value.length) {
      const tmpValue: { label: string; value: string } | undefined = dateFilterType.find(
        (item: any) => item.value === value[0]
      );
      if (!tmpValue) {
        this.dateValue = value[0];
        this.textValue = this.formula === DateType.Equal ? DateFilterType.Custom : value[0];
      } else {
        this.dateValue = null;
        this.textValue = value[0];
      }
    } else {
      this.dateValue = null;
      this.textValue = this.formula === DateType.Equal ? DateFilterType.Custom : "";
    }
  }

  /**
   * 展示自定义日期列表
   */
  get showRadio() {
    return this.formula === DateType.Equal;
    // return ![DateType.Range, DateType.None, DateType.NotNone].includes(this.formula as any)
  }

  /**
   * 日期操作列表（月份的时候只有本月和上月还有自定义）
   */
  get selectList(): Array<{ value: string; label: string }> {
    const m = [DateFilterType.ThisMonth, DateFilterType.LastMonth];
    return this.format === FormatDateType.Month
      ? dateFilterType.filter(d => m.includes(d.value))
      : this.dateTypeList;
  }
  /**
   * 自定义日期列表
   */
  get dateTypeList() {
    return dateFilterType.filter(item => {
      return item.value !== DateFilterType.Custom;
    });
  }
  /**
   * 自定义日期
   */
  get customType() {
    return dateFilterType.find(item => {
      return item.value === DateFilterType.Custom;
    });
  }
  /**
   * 日期组件格式
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
   * 选择日期
   * @param value 日期
   */
  changeDate(value: string) {
    this.dateValue = value;
    this.textValue = this.formula === DateType.Equal ? DateFilterType.Custom : value;
    this.$emit("input", value);
  }
  /**
   * 更改日期
   *  @param value 自定义日期
   */
  changeDateType(value: string) {
    this.textValue = value;
    const tmpValue = value === DateFilterType.Custom ? this.dateValue : value;
    this.$emit("input", tmpValue);
  }
  /**
   * 展示日期
   */
  showDate() {
    this.dateVisible = true;
  }
  created() {}
}
</script>
<style lang="less">
.h3-report-filter-date {
  padding: 16px;
  &__input {
  }
  &__content {
  }
  .date-input-wrap {
    padding-bottom: 12px;
  }
  .custom-radio {
    height: 88px;
    .h3think-radio__wrap {
      height: 50%;
      display: flex;
      align-self: normal;
    }
  }
}
</style>
