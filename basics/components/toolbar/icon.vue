<template>
  <div :class="`${prefixCls}`">
    <div v-if="isTile" :class="`${prefixCls}-wrap`">
      <span style="display: flex; align-items: center"> 
        <h3-svg 
          :name="iconMappings[option.value]"
          :color="color"
        ></h3-svg>
      </span>
      <span :class="`${prefixCls}__label`">{{ optionSpan.label }}</span>
    </div>
    <a-tooltip
      v-else
      :placement="placement"
      :getPopupContainer="getContainer"
      :arrowPointAtCenter="true"
    >
      <template slot="title" v-if="option.label">
        <span>{{ optionSpan.label }}</span>
      </template>
      <span style="display: flex; align-items: center"> 
        <h3-svg 
          :name="iconMappings[option.value]"
        ></h3-svg>
      </span>
      
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ToolsBarType } from "@h3/report-mobile/basics/enum/element-tools";
import { Tooltip } from "@h3/antd-vue";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
@Component({
  name: "h3-toolbar-icon",
  components: {
    ATooltip: Tooltip,
    H3Svg: Svg
  }
})
export default class ToolbarIcon extends Vue {
  @Prop({ default: {} }) option!: H3.Toolbar.Options;
  @Prop({ default: null }) getContainer!: () => HTMLDivElement;
  @Prop({ default: false }) isTile!: boolean;
  @Prop({ default: "top" }) placement!: string;
  @Prop({ default: "" }) color!: string;
  prefixCls: string = "h3-toolbar-icon";

  iconMappings: any = {
    [ToolsBarType.COPY]: "copy-stroke", // 复制
    [ToolsBarType.FULLSCREEN]: "fullscreen-stroke", // 全屏
    [ToolsBarType.EDIT]: "edit-stroke", // 编辑
    [ToolsBarType.REMOVE]: "delete-stroke", // 删除
    [ToolsBarType.REFRESH]: "a-arrow-syn-stroke1", // 刷新
    [ToolsBarType.SORT]: "arrow-sort-stroke", // 排序
    [ToolsBarType.FILTER]: "a-tool-filter-stroke1", // 筛选
    [ToolsBarType.LINKAGE]: "table-split-stroke_1", // 联动
    [ToolsBarType.NARROW]: "fullscreen-exit-stroke", // 退出全屏
    [ToolsBarType.EXPORT]: "download-stroke", // 导出
    [ToolsBarType.VISIBLE]: "eye-disabled-stroke", // 隐藏
    [ToolsBarType.CUSTOMSQL]: "a-tool-filter-stroke1", // 自定义SQL
    [ToolsBarType.UPLOAD]: "upload-stroke", // 上传
    [ToolsBarType.EDITIMAGE]: "edit-stroke", //展示模式
    [ToolsBarType.EDITWEB]: "field-attachment-stroke", // 编辑web组件
    [ToolsBarType.COMPARE]: "arrow-sort-stroke", // 对比漏斗图sort
    [ToolsBarType.RENAME]: "edit-stroke1", // 重命名
    [ToolsBarType.EDITTAB]: "edit-stroke", // 编辑
    [ToolsBarType.AIREMOVE]: "eliminate-stroke", // 清除
    [ToolsBarType.AITYPESET]: "rdashboard-stroke", // 切换图表类型
    [ToolsBarType.AISAVE]: "save-stoke", // 保存
    [ToolsBarType.AIEXPORT]: "tool-export-stroke", // AI图表导出, Excel, png
  };
  get optionSpan() {
    return this.$r_gt(this.option, this.$r_languageType);
  }
  /**
   * 触发点击事件
   */
  click(option: H3.Toolbar.Options, e?: Event) {
    this.$emit("click", option, e);
  }
}
</script>

<style lang="less" scrop>
.h3-toolbar-icon {
  font-size: 16px;
  color: inherit;
  &-wrap {
    display: flex;
    align-items: center;
  }
  &__self {
    padding: 6px;
  }
  &__label {
    color: #121933;
    font-size: 13px;
    padding-left: 8px;
    font-family: auto;
  }
}
</style>
