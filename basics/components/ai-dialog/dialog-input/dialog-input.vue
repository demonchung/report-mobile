<template>
  <div :class="[prefixCls, isFocus? 'focusingOn' : '']">
    <a-text-area
      ref="inputRef"
      :rows="3"
      :class="[`${prefixCls}__input`]"
      :placeholder="placeholder"
      :maxLength="500"
      :title="innerValue"
      v-model="innerValue"
      @blur="onBlur"
      @focus="onFocus"
      @change="onChange"
      @pressEnter="outFocus"
    >
    </a-text-area>
    <!-- <div :class="[`${prefixCls}__suggests`]" v-if="showSuggests">
      <div :class="[`${prefixCls}__suggests-title`]"> {{ suggestTitle }}</div>
      <div 
        v-for="(suggest) in suggests" 
        :key="suggest" 
        :class="[`${prefixCls}__suggests-item`]"
        @mousedown="mousedown($event)"
        @click="select(suggest)"
      >
        ·&nbsp;{{ suggest }}
      </div>
    </div> -->
    <div :class="[`${prefixCls}__suffix`]">
      <!-- <span :class="[`${prefixCls}__clear`]" @click="clear($event)">
        <h3-svg 
          name="cross-stroke" 
          w="14" 
          h="14"
        ></h3-svg>
      </span>  -->
      <span :class="[`${prefixCls}__send`, innerValue? 'filled': '']" @click="submit($event)">
        <h3-svg name="sending-full" color="#FFFFFF"></h3-svg>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Input } from "@h3/antd-vue";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";

@Component({
  name: "h3-dialog-input",
  components: {
    ATextArea: Input.TextArea,
    H3Svg: Svg
  }
})
export default class DialogInput extends Vue {
  // @Prop({ default:  () => "" }) value!: string; // 输入框的值
  @Prop({ default: () => ""  }) placeholder!: string;  // 输入框的占位符
  @Prop({ default: () => [] }) suggests!: Array<string>; // 数据分析智能推荐

  prefixCls: string = "h3-dialog-input";

  innerValue: string = "";
  
  isHandleBlur: boolean = false;

  suggestTitle = "您可以从下面选择一个问题进行数据分析";

  // 输入框是否聚焦
  isFocus: boolean = false;

  //原来由showPanel控制, 但添加一个显示条件,没有选项也不显示
  get showSuggests() {
    // return this.suggests.length > 0;
    return false;
  }

  mousedown(e) {
    e.preventDefault();
  }
  onChange(e) {
    this.innerValue = e.target.value;
  }
  /**
   * 回车失焦
   */
   outFocus(e) {
     
      this.$emit("chat", this.innerValue);
      this.$nextTick(() => {
        this.innerValue = "";
    });
    this.toBlur();
  }
  
  toBlur() {
    this.$nextTick(() => {
        this.$refs.inputRef && (this.$refs.inputRef as any).blur();
        this.isFocus = false;
    });
  }

  /**
   * 失去焦点
   */
  onBlur(e) {
    this.isFocus = false;
  }
  /** 
   * 获得焦点
   */
  onFocus(e) {
    this.isFocus = true;
  //  this.$emit("focus", e.target.value);
  }
  /**
   * 清空
   */
  // clear(e) {
  //   this.innerValue = "";
  //   if (this.$refs.inputRef) {
  //     setTimeout(() => {
  //       (this.$refs.inputRef as any).focus();
  //     }, 160);
  //   }
  // }

  /**
   * 选择数据分析智能推荐的某一项
   */
  select(value) {
    this.$emit("chat", value);
  }
  /**
   * 请求数据生成图表
   */
   submit(e) {
    this.$emit("chat", this.innerValue);
    this.innerValue = "";
  }

  mounted() {
    // this.innerValue = this.value;
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
