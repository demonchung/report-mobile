<template>
  <div :class="prefixCls">
    <a-select
      placeholder="请选择图表配色"
      notFoundContent="无匹配结果"
      :class="`${prefixCls}__select`"
      :value="innerValue"
      :getPopupContainer="getPopupContainer"
      @change="onChange"
    >
      <a-select-option v-for="item in themes" :key="item.type">
        <template v-for="(c, indexs) in item.colors">
          <div
            :class="`${colorSize}-color`"
            v-if="indexs < 6"
            :key="indexs"
            :style="{ backgroundColor: c }"
          ></div>
        </template>
      </a-select-option>
    </a-select>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Select } from "@h3/antd-vue";
import colors from "@h3/report-mobile/basics/enum/colors";

@Component({
  name: "h3-report-color-select",
  components: {
    ASelect: Select,
    ASelectOption: Select.Option
  }
})
export default class ColorSelect extends Vue {
  prefixCls = "h3-report-color-select";
  @Prop({ default: "" }) value!: string;
  @Prop({ default: "small" }) colorSize!: string;
  @Prop({ default: null }) colorArray!: Array<any>;

  get themes() {
    return this.colorArray ? this.colorArray : colors;
  }

  get innerValue() {
    return this.value;
  }

  set innerValue(val) {
    this.$emit("input", val);
  }

  getPopupContainer() {
    return this.$el;
  }

  onChange(value: any) {
    // value 是type
    const val: H3.Report.Theme = {
      type: value,
      colors: this.themes.find(i => i.type === value).colors || []
    };
    this.$emit("change", value);
    this.$emit("onChange", val);
  }
}
</script>

<style lang="less">
@import "./style.less";
</style>
