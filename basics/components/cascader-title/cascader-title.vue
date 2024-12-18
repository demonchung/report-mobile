<!-- 修改显示名 -->
<template>
  <div
    v-clickoutside="handleFunction"
    v-if="showTitle"
    :class="[prefixCls, customPrefixCls]"
  >
    <label :title="data.name" :class="`${prefixCls}__name`">{{ $r_language.config.CascaderTitle.labalTitle }}{{ data.tableName }} - {{ data.name }}</label>
    <a-input
      type="text"
      :placeholder="$r_language.config.CascaderTitle.TitlePla"
      :value="inputModel"
      @input="onInput"
    >
    </a-input>
    <div :class="`${prefixCls}__button`">
      <H3-button @click="cancel">{{ $r_language.normal.cancel }}</H3-button>
      <H3-button type="primary" @click="enter">{{ $r_language.normal.sure }}</H3-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Input } from "@h3/antd-vue";
import { H3Button } from "@h3/awesome-ui";
import ClickOutSide from "vue-v-clickoutside";
import { getStrLen } from "@h3/report-mobile/basics/utils/string";
import options from "@h3/report-mobile/dist/options";

@Component({
  name: "h3-report-cascader-title",
  components: {
    AInput: Input,
    H3Button
  },
  directives: {
    clickoutside: ClickOutSide
  }
})
export default class CascaderTitle extends Vue {
  // 重命名
  @Prop({ default: () => "" }) renameModel!: string;
  // 自定义样式名
  @Prop({ default: () => "" }) customPrefixCls!: string;
  // 维度、分组维度、指标。数据设置中其中一个字段data
  @Prop({ default: () => ({}) }) data!: H3.Report.FieldColumn;
  // 图表chart
  @Prop({ default: () => ({}) }) chart!: H3.Report.Chart;
  // 移除禁止拖拽class
  @Prop({ default: () => ({}) }) removeUndrag!: Function;
  // vuex - 更新图表视图
  @Prop({ default: () => ({}) }) resizeChartView!: Function;
  prefixCls = "h3-report-cascader-title";
  // 输入框model
  inputModel: string = "";
  // 是否显示title组件
  showTitle: boolean = true;

  @Watch("renameModel")
  watchRenameModel(val) {
    this.inputModel = val;
  }

  /**
   * change事件
   * @param e
   */
  onInput(e: any) {
    this.inputModel = e.target.value;
  }

  /**
   * 取消
   */
  cancel() {
    this.showTitle = false;
    this.removeUndrag();
  }

  /**
   * 确定
   */
  enter() {
    if (getStrLen(this.inputModel) > 32) {
      options.message.warning(this.$r_language.config.CascaderTitle.warn_titleLen);
      return false;
    }
    this.$set(this.data, "alias", this.inputModel);
    this.resizeChartView({ chart: this.chart, type: "view" });
    this.showTitle = false;
    this.removeUndrag();
  }

  /**
   * 点击元素外面才会触发的事件
   */
  handleFunction() {
    this.showTitle = false;
  }
}
</script>

<style lang="less">
.h3-report-cascader-title {
  position: absolute;
  padding: 10px;
  width: calc(100% - 32px);
  background: #fff;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  font-size: 14px;
  z-index: 100;

  &__name {
    display: inline-block;
    padding: 0 0 10px;
    width: 100%;
    color: #8893a7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }
  input {
    border-radius: 4px;
    border: 1px solid rgba(212, 215, 224, 1);
    ::placeholder {
      color: #c9ccd8;
      font-size: 14px;
    }
  }
  &__button {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    button:first-child {
      margin-right: 8px;
    }
  }
}
.h3-dashboard-rename {
  width: 420px;
  position: fixed;
  text-align: left;
  display: flex;
  flex-direction: column;
  padding: 24px;
  transform: translateY(10px);
}
</style>
