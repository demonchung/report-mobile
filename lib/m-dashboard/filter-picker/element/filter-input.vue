<template>
  <div :class="`${prefixCls}`">
    <h3-input
      v-model="inputValue"
      :type="inputType"
      :placeholder="placeholderText"
      :wait="0"
      @change="changeText"
      @blur="blur($event)"
      :maxlength="200"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { H3Input } from "@h3/thinking-ui";
import Regexp from "@h3/report-mobile/basics/utils/regexp";


const ReportPro = namespace("report");
@Component({
  name: "h3-report-mobile-filter-input",
  components: {
    H3Input
  }
})
export default class ReportFilterInput extends Vue {
  @Prop({ default: () => [] }) value!: Array<string | number | any>;
  @Prop({ default: () => [] }) field!: H3.Report.FieldColumn;
  @Prop({ default: "" }) formula!: string;
  prefixCls = "h3-report-mobile-filter-input";
  inputValue: string = ""; // 实际值
  oldValue: string = ""; // 暂存值

  @Watch("value", { immediate: true, deep: true })
  changeValue(value: Array<string | number | any>) {
    this.inputValue = value.length
      ? value[0].constructor === Object
        ? (value[0] as { value: string; label: string }).value
        : value[0]
      : "";
    this.oldValue = "";
  }
  /**
   *  输入框空状态提示
   */
  get placeholderText() {
    return this.field.type === "number" ? "请输入数值" : "请输入";
  }
  /**
   *  输入框类型
   */
  get inputType() {
    return this.field.type === "number" ? "number" : "text";
  }
  /**
   * 修改值
   * @param text
   */
  changeText(text: string) {
    if (this.field.type === "number") {
      if (!Regexp("NUMBER", text, true)) {
        this.inputValue = this.oldValue;
      } else {
        this.oldValue = this.inputValue;
      }
    }
  }

  /**
   * 失去焦点再格式化
   */
  blur() {
    this.$emit("input", this.inputValue);
  }
  created() {}
}
</script>
<style lang="less">
.h3-report-mobile-filter-input {
  padding: 16px;
  .h3think-input {
    height: 28px;
    padding: 0 8px 0 16px !important;
  }
  .h3think-input.h3think-input--border {
    background-color: #fff;
    border-radius: 14px;
  }
}
</style>
