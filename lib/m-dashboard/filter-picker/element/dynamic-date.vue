<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}__wrap`">
      <div :class="`${prefixCls}__content`">
        <div :class="`${prefixCls}__input`" @click="showDate('start', $event)">
          <div :class="`${prefixCls}__placeholder`" v-if="!textStartValue.length">
            {{ placeholderStart }}
          </div>
          <div :class="`${prefixCls}__text`" v-else>{{ transText(textStartValue) }}</div>
        </div>
        <div :class="`${prefixCls}__error`" v-if="false"></div>
      </div>
      <h3-svg name="minus-stroke" color="#707481"></h3-svg>
      <div :class="`${prefixCls}__content`">
        <div :class="`${prefixCls}__input`" @click="showDate('end', $event)">
          <div :class="`${prefixCls}__placeholder`" v-if="!textEndValue.length">
            {{ placeholderEnd }}
          </div>
          <div :class="`${prefixCls}__text`" v-else>{{ transText(textEndValue) }}</div>
        </div>
        <div :class="`${prefixCls}__error`" v-if="false"></div>
      </div>
    </div>
    <h3-picker
      v-model="dateVisible"
      :data="dateCaseList"
      maskClosable
      :value="defalutValue"
      flat
      @change="changeSelectList"
      @select="changeAndSubmit"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { H3DatetimePicker, H3Radio, H3Toast, H3Picker } from "@h3/thinking-ui";
import dateInput from "./date-input.vue";
import getDateList from "./datelist";
import { fomatterValue, fomaaterToLabel } from "@h3/report-mobile/basics/utils/dyncmic-date-help";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import FilterTypes, {
  dateFilterType,
  DateFilterType,
  DateType,
  FormatDateType
} from "@h3/report-mobile/basics/enum/filter-type";

const ReportPro = namespace("report");
@Component({
  name: "h3-report-filter-dynamic-date",
  components: {
    dateInput,
    H3DatetimePicker,
    H3Radio,
    H3RadioGroup: H3Radio.Group,
    H3Toast,
    H3Picker,
    H3Svg: Svg
  }
})
export default class ReportFilterRangeDate extends Vue {
  @Prop({ default: () => [] }) value!: Array<string | number | any>;
  @Prop({ default: () => [] }) field!: H3.Report.FieldColumn;
  @Prop({ default: "" }) formula!: string;
  @Prop({ default: "" }) format!: string;

  prefixCls = "h3-report-filter-range-date";
  placeholderStart: string = "开始时间";
  placeholderEnd: string = "结束时间";
  currentDateType: string = ""; // 当前日期先后类型
  textStartValue: Array<any> = []; // 实际值
  textEndValue: string = ""; // 实际值
  dateVisible: boolean = false; // 是否显示日期组件
  showToast: boolean = false; // 是否显示
  toastText: string = ""; // 吐司提示
  isNow: boolean = true; //是否选中的当前
  defalutValue: any = [];

  @Watch("value", { immediate: true, deep: true })
  changeValue(value: Array<string | number | any>) {
    if (value instanceof Array) {
      if (this.formula === DateType.Dynamic) {
        const defalutValueArr = fomatterValue(value);
        console.log(value, "value", defalutValueArr);
        this.textStartValue = defalutValueArr[0]
          ? defalutValueArr[0].includes(null)
            ? []
            : defalutValueArr[0]
          : [];
        this.textEndValue = defalutValueArr[1]
          ? defalutValueArr[1].includes(null)
            ? []
            : defalutValueArr[1]
          : [];
      }
    }
  }

  get dateCaseList() {
    return getDateList(this.isNow);
  }

  changeAndSubmit(val) {
    console.log(val, "----");
    if (this.currentDateType === "start") {
      this.textStartValue = val;
    } else {
      this.textEndValue = val;
    }
    this.changeDate();
  }
  //
  changeSelectList(val, column) {
    console.log(val, "changeSelectList");
    //如果选中的是当前
    if (val == "") {
      this.isNow = true;
    } else {
      this.isNow = false;
    }
  }

  transText(arr) {
    if (arr.length) {
      //return fomaaterToLabel(arr)
      const labalArr = fomaaterToLabel(arr);
      return this.$r_gt(labalArr, this.$r_languageType);
    }
    return "";
  }

  //需要改动 value:[['-','1','d'],['-','1','y']] 转化成['1d','-1y']
  forMatArr(value) {
    if (value) {
      const res: any = [];
      value.forEach(arr => {
        if (!arr.length || arr.includes(null)) {
          res.push(null);
        } else {
          res.push(arr.join(""));
        }
      });
      return res;
    }
    return [null, null];
  }
  /**
   * 选择日期  type: start/end
   */
  changeDate() {
    const textValue = this.forMatArr([this.textStartValue, this.textEndValue]);
    this.$emit("input", textValue);
  }

  /**
   * 展示日期
   * @param type
   */
  showDate(type: string) {
    this.currentDateType = type;
    this.defalutValue = type === "start" ? this.textStartValue : this.textEndValue;
    if (!this.defalutValue.length || (this.defalutValue.length && this.defalutValue[0] == "")) {
      this.isNow = true;
    } else {
      this.isNow = false;
    }
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
