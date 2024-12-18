<!-- 输入框组件 -->
<template>
  <div :class="prefixCls">
    <a-tooltip :getPopupContainer="getContainer" placement="top">
      <template slot="title" v-if="inputValue.length > 11">
        <span>{{ inputValue }}</span>
      </template>
      <template v-if="edit">
        <input
          ref="reportEditInput"
          :class="`${prefixCls}__main`"
          type="text"
          :id="inputID"
          :style="{ maxWidth: maxWidthValue + 'px', minWidth: minWidthValue + 'px' }"
          :value="innerValue"
          :maxlength="maxLength"
          @input="inputFun($event)"
          @blur="inputBlur($event)"
          @focus="inputFocus($event)"
        />
      </template>
      <div
        v-else
        :style="{ maxWidth: maxWidthValue + 'px', minWidth: minWidthValue + 'px' }"
        :class="`${prefixCls}__static`"
      >
        {{ inputValue }}
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from "vue-property-decorator";
import { setCaretPosition } from "@h3/report-mobile/basics/utils/global";
import { Tooltip } from "@h3/antd-vue";

@Component({
  name: "h3-edit-input",
  components: {
    ATooltip: Tooltip
  }
})
export default class EditInput extends Vue {
  @Prop({ default: () => 250 }) maxWidthValue!: number;
  @Prop({ default: () => 50 }) minWidthValue!: number;
  @Prop({ default: () => "" }) inputValue!: string;
  @Prop({ default: () => "" }) inputID!: string;
  @Prop({ default: 9999 }) maxLength!: number;
  @Prop({ default: true }) edit!: boolean;

  prefixCls: string = "h3-edit-input";
  innerValue = this.inputValue;

  @Watch("inputValue")
  handleValue(newVal, oldVal) {
    // 处理输入框宽度
    this.innerValue = newVal;
    this.handleInputWidth(newVal);
  }


  /**
   * tooltip挂载
   */
  getContainer() {
    return this.$el.parentElement;
  }
  /**
   * 输入框input事件
   * @param e
   */
  inputFun(e) {
    const val = e.target.value;
    if (val && val.length > this.maxLength) {
      return;
    }
    this.innerValue = val;
    this.handleInputWidth(this.innerValue);
    this.$emit("inputFun", this.innerValue);
  }
  /**
   * 输入框焦点事件
   * @param e
   */
  inputFocus(e) {
    this.$nextTick(() => {
      const element = this.$el.querySelector(".h3-edit-input__main") as HTMLInputElement;
      setCaretPosition(element, element.value.length);
    });

    this.$emit("inputFocus", e.target.value);
  }

  /**
   * 输入框失去焦点事件
   * @param e
   */
  inputBlur(e) {
    this.$emit("inputBlur", this.innerValue);
  }

  /**
   * 处理输入框宽度
   */
  handleInputWidth(val?: string) {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.fontSize = "14px";
    span.style.display = "inline-block";
    document.body.appendChild(span);

    span.innerText = this.innerValue || this.inputValue;

    const inputEl: any = document.getElementById(this.inputID) as HTMLElement;
    if (inputEl) {
      // 修改input宽度
      inputEl.style.width = span.clientWidth + 5 + "px";
      // 超过最大宽度，添加省略号css
      if (span.clientWidth > this.maxWidthValue) {
        inputEl.style.textOverflow = "ellipsis";
      } else {
        inputEl.style.textOverflow = "inherit";
      }
    }
    document.body.removeChild(span);
  }

  mounted() {
    // 处理输入框宽度
    if (this.edit) {
      this.handleInputWidth();
    }
  }
}
</script>

<style lang="less">
.h3-edit-input {
  &__main {
    width: auto;
    border: 0;
    outline: none;
    border-bottom: 1px dashed #8893a7;
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    text-overflow: inherit;
  }
  &__static {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .emptyDivClass {
    visibility: hidden;
    display: inline-block;
    position: absolute;
    z-index: 1;
  }
}
</style>
