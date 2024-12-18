<!-- 级联选择器menu -->
<template>
  <div
    :class="prefixCls"
    @click="behaviorEvent('click')"
    @mouseover="behaviorEvent('mouseover')"
    @mouseleave="hideSubMenu"
  >
    <!-- 一级菜单 -->
    <cascader-item ref="cascaderItemRef" :tree-node="innerTreeNode"></cascader-item>
    <!-- 二级菜单 -->
    <div
      ref="cascaderMenuRef"
      v-show="innerTreeNode.children && innerTreeNode.children.length && innerTreeNode.subShow"
      :class="`${prefixCls}__list`"
      :style="{ top: subMenuTop, right: getStyleRight(innerTreeNode.level) }"
    >
      <h3-report-cascader-menu
        v-for="(subTree, index) in innerTreeNode.children"
        :treeNode="subTree"
        :key="index"
        :chart="chart"
        :data="data"
        :cascaderOptions="cascaderOptions"
        :source="source"
        :expandTrigger="expandTrigger"
        :cascaderIndex="cascaderIndex"
        :cascaderMenuList="cascaderMenuList"
      ></h3-report-cascader-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import CascaderItem from "./cascader-item.vue";
import methodOptions from "./handler";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ReportMutation } from "@h3/report-mobile/basics/store/dashboard/types";

const ReportPro = namespace("report");
@Component({
  name: "h3-report-cascader-menu",
  components: {
    CascaderItem
  }
})
export default class CascaderMenu extends Vue {
  @Prop({ default: () => ({}) }) data!: H3.Report.FieldColumn;
  @Prop({ default: () => ({}) }) chart!: H3.Report.Chart;
  @Prop({ default: () => "" }) source!: string;
  // 父级节点点击的index
  @Prop({ default: () => 0 }) cascaderIndex!: number;
  @Prop({ default: () => {} }) cascaderOptions!: any;
  // 级联选择器树节点列表
  @Prop({ default: () => ({}) }) treeNode!: any;
  // 次级菜单的展开方式，可选 'click' 和 'hover'
  @Prop({ default: () => "hover" }) expandTrigger!: string;
  // 级联选择器树节点列表
  @Prop({ default: () => [] }) cascaderMenuList!: Array<any>;
  // 注入 - 子节点展开
  @Inject({ default: () => {} }) treeNodeExpand!: Function;
  // 注入 - 子节点隐藏
  @Inject({ default: () => {} }) treeNodeHide!: Function;
  // 注入 - 隐藏cascader组件
  @Inject({ default: () => {} }) hideCascader!: Function;
  // 注入 - 移除禁止拖拽class
  @Inject({ default: () => {} }) removeUndrag!: Function;
  // vuex - 更新图表视图
  @ReportPro.Mutation(ReportMutation.RESIZECHARTVIEW) resizeChartView!: Function;
  // vuex - 设置数值格式
  @ReportPro.Mutation(ReportMutation.SETNUMBERFORMAT) setNumberFormat!: Function;
  // vuex - 设置结果筛选
  @ReportPro.Mutation(ReportMutation.SETRESULTFILTER) setResultFilter!: Function;
  // vuex - 设置结果筛选
  @ReportPro.Mutation(ReportMutation.SETDATEFORMAT) setDateFormat!: Function;
  // vuex - 设置条件格式
  @ReportPro.Mutation(ReportMutation.SETCONDITIONFORMAT) setConditionFormat!: Function;

  prefixCls = "h3-report-cascader-menu";
  // 子节点列表数据
  innerTreeNode: object = {};
  // 子菜单top
  subMenuTop: string = "";

  menuRight: number = 0;

  @Watch("treeNode", { immediate: true, deep: true })
  watchTreeNode() {
    this.innerTreeNode = this.treeNode;
  }

  /**
   * 计算层级距离右侧的距离
   * @param level
   */
  getStyleRight(level: number) {
    // 167为二级菜单的宽度，203为二级菜单离一级菜单的距离
    let distance: string = "";
    distance = 185 + 167 * (level - 1) + this.menuRight + "px";
    return distance;
  }

  /**
   * 参数配置
   */
  paramOptions() {
    // 数据集
    const params: H3.CascaderParam = {
      self: this,
      data: this.data,
      chart: this.chart,
      source: this.source,
      treeNode: this.treeNode,
      cascaderIndex: this.cascaderIndex,
      hideCascader: this.hideCascader,
      removeUndrag: this.removeUndrag,
      parentEl: this.cascaderOptions.parentEl,
      resizeChartView: this.cascaderOptions.resizeChartView,
      setNumberFormat: this.cascaderOptions.setNumberFormat,
      setResultFilter: this.cascaderOptions.setResultFilter,
      setDateFormat: this.cascaderOptions.setDateFormat,
      setTargetValue: this.cascaderOptions.setTargetValue,
      setConditionFormat: this.cascaderOptions.setConditionFormat
    };
    // 方法配置
    methodOptions(this.treeNode.method, params);
  }

  /**
   * mouseover事件
   */
  mouseoverItem() {
    if (this.treeNode.children.length) {
      // 展开级联选择器
      this.treeNodeExpand(this.cascaderMenuList, this.treeNode);
    }
  }

  /**
   * mouseleave事件 - 隐藏子级菜单
   */
  hideSubMenu() {
    this.treeNodeHide(this.cascaderMenuList);
  }

  /**
   * 计算menu的div节点的高度
   */
  countMenuHeight() {
    // 一级菜单div的top
    if ((this.$refs.cascaderItemRef as any).$el.getBoundingClientRect) {
      const top = (this.$refs.cascaderItemRef as any).$el.getBoundingClientRect().top;
      // 子级菜单高度
      const menuHeight = (this.$refs.cascaderMenuRef as any).offsetHeight;
      // 浏览器高度
      const bodyClientHeight = document.body.clientHeight;
      // 浏览器到子菜单的底部高度超过浏览器高度，则把子菜单底部贴边往上处理。
      if (top + menuHeight > bodyClientHeight) {
        this.subMenuTop = bodyClientHeight - menuHeight + "px";
      } else {
        this.subMenuTop = top + "px";
      }
    }
  }
  countRight() {
    const bodyClientWidth = document.body.clientWidth;
    const menuClientRect = this.$el.getBoundingClientRect();
    let left = 0;
    let width = 0;
    if (menuClientRect) {
      left = menuClientRect.left;
      width = menuClientRect.width;
      this.menuRight = bodyClientWidth - width - left;
    }
  }
  /**
   * 行为事件
   * @param event
   */
  behaviorEvent(event: string) {
    // 鼠标mouseover行为
    if (event == "mouseover") {
      // 级联选择器click or hover行为（注：expandTrigger只控制有子级的菜单）
      if (this.expandTrigger === "hover") {
        this.mouseoverItem();
      }
    } else {
      if (event == "click") {
        if (this.expandTrigger === "click") {
          this.mouseoverItem();
        } else {
          if (!this.treeNode.children.length) {
            this.paramOptions();
          }
        }
      }
    }
    
  }

  updated() {
    // 计算menu的div节点的高度
    this.countMenuHeight();
    this.countRight();
  }
}
</script>

<style lang="less">
.h3-report-cascader-menu {
  position: relative;
  &__list {
    width: 167px;
    position: fixed;
    z-index: 100;
    margin: 0;
    padding: 4px 0;
    background: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    i {
      position: absolute;
      right: 10px;
      font-size: 12px;
    }
    .right-o {
      top: 0;
      color: #c9ccd8;
    }
  }
}
</style>
