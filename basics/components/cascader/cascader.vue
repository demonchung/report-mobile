<!-- 级联选择器 -->
<template>
  <div v-clickoutside="handleFunction" :class="prefixCls">
    <cascader-menu
      v-for="tree in menuList"
      :chart="chart"
      :data="data"
      :source="source"
      :cascaderOptions="cascaderOptions"
      :key="'cascader-' + tree.key"
      :tree-node="tree"
      :expandTrigger="expandTrigger"
      :cascaderIndex="cascaderIndex"
      :cascaderMenuList="menuList"
    ></cascader-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import cascaderMenu from "./cascader-menu.vue";
import options from "@h3/report-mobile/basics/components/cascader/config";
import ClickOutSide from "vue-v-clickoutside";

@Component({
  name: "h3-report-cascader",
  components: {
    cascaderMenu
  },
  directives: {
    clickoutside: ClickOutSide
  }
})
export default class cascader extends Vue {
  @Prop({ default: () => ({}) }) data!: H3.Report.FieldColumn;
  @Prop({ default: () => ({}) }) chart!: H3.Report.Chart;
  @Prop({ default: () => "" }) source!: string;
  @Prop({ default: () => [] }) parentSource!: Array<H3.Report.FieldColumn>;
  @Prop({ default: () => {} }) cascaderOptions!: any;
  // domElement父级节点
  @Prop({ default: () => null }) domElement!: HTMLElement;
  // 父级节点点击的index
  @Prop({ default: () => 0 }) cascaderIndex!: number;
  // 次级菜单的展开方式，可选 'click' 和 'hover'
  @Prop({ default: () => "hover" }) expandTrigger!: string;
  // 级联选择器树节点列表
  @Prop({ default: () => [] }) cascaderMenuList!: Array<any>;
  prefixCls = "h3-report-cascader";

  /**
   * 监听父组件点击的dom节点
   * todo 临时去掉了deep:true
   */
  @Watch("domElement", { immediate: true })
  watchDomElement(element: HTMLElement) {
    // 添加禁止拖拽class
    element.classList.add("undrag");
    this.removeTitle(element);
  }

  /**
   * 获取级联选择器树节点列表
   */
  get Options(){
    return this.$r_gt(options,this.$r_languageType)
  }
  get menuList() {
    let menuList: Array<any> = [];
    const params = {
      chart: this.chart,
      data: this.data,
      source: this.source,
      isWxwork: this.$r_isWxwork,
    };
    menuList = this.Options.createChildData(params);
    return menuList;
  }

  /**
   * 删除h3-report-fields__field下的title组件
   */
  removeTitle(element: HTMLElement) {
    for (const i in (element as any).parentElement.children) {
      if (i === "length") {return;}
      if (
        (element as any).parentElement.children[i].className.indexOf("h3-report-cascader-title") >
        -1
      ) {
        (element as any).parentElement.removeChild((element as any).parentElement.children[i]);
      }
    }
  }

  /**
   * 子节点展开
   * @param treeNode
   * @param currNode
   */
  @Provide()
  treeNodeExpand(treeNode: Array<any>, currNode: any) {
    treeNode.forEach((child: any) => {
      if (child.level === currNode.level) {
        child.subShow = false;
      } else {
        this.treeNodeExpand(child.children, currNode);
      }
    });
    currNode.subShow = true;
  }

  /**
   * 子节点隐藏
   * @param treeNode
   */
  @Provide()
  treeNodeHide(treeNode: Array<any>) {
    treeNode.forEach((child: any) => {
      child.subShow = false;
    });
  }

  /**
   * 移除禁止拖拽class
   */
  @Provide()
  removeUndrag() {
    this.domElement.classList.remove("undrag");
  }

  /**
   * 隐藏cascader组件
   */
  @Provide()
  hideCascader() {
    this.$emit("hide-cascader");
  }

  /**
   * 点击元素外面才会触发的事件
   */
  handleFunction() {
    this.removeUndrag();
    this.hideCascader();
  }

  /**
   * 动态添加top
   */
  addTop() {
    const length = this.parentSource.length;
    (document.getElementsByClassName("h3-report-cascader")[0] as HTMLElement).style.marginTop =
      2 - 35 * (length - this.cascaderIndex - 1) + "px";
  }

  mounted() {
    // 动态添加top
    this.addTop();
  }
}
</script>

<style lang="less">
.h3-report-date-format__modal {
  .ant-modal-confirm-content {
    height: 323px;
    max-height: 323px;
    overflow: hidden;
  }
  
}
.h3-report-cascader {
  width: 185px;
  position: absolute;
  z-index: 100;
  padding: 4px 0;
  background: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
}
</style>
