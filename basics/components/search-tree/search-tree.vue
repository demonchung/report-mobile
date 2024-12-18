<template>
  <div :class="prefixCls">
    <div :class="[`${prefixCls}__search`]">
      <a-input placeholder="搜索" v-model="searchValue" @change="search">
        <a-icon slot="prefix" type="search" />
      </a-input>
    </div>
    <slot>
      <div ref="list" :class="[`${prefixCls}__list`]">
        <h3-tree
          v-if="!searchValue || getSearchList.length"
          :tile="true"
          :accord="false"
          :folderSelected="isSearchFolder"
          :open-keys="openKeys"
          :tree-list="getSourceList"
          :key-mappings="keyMappings"
          @node-click="nodeClick"
          @open-keys-end="openKeysEnd"
        >
          <template v-slot:node="{ treeNode, nodeIcon }">
            <h3-svg v-if="nodeIcon" :name="nodeIcon" color="#707481"></h3-svg>
            <div
              v-html="getHighlight(treeNode)"
              :class="`h3-menu-tree-item__word`"
              :data-key="treeNode[keyMappings.key]"
            ></div>
          </template>
        </h3-tree>
        <div v-else :class="[`${prefixCls}__empty`]">{{ empty }}</div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { Input, Icon, Modal, Tabs } from "@h3/antd-vue";
import H3Tree from "@h3/report-mobile/basics/components/tree";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
@Component({
  name: "h3-search-tree",
  components: {
    AInput: Input,
    AIcon: Icon,
    H3Tree,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    H3Svg: Svg
  }
})
export default class SearchTree extends Vue {
  @Prop({
    default: () => null
  })
  openKeys!: Array<string>;
  @Prop({
    default: () => []
  })
  list!: Array<H3.Tree.TreeNode>;
  @Prop({
    default: () => null
  })
  value!: H3.Tree.TreeNode | string;

  @Prop({
    default: () => false
  })
  isSearchFolder!: boolean; // 是否搜索文件夹

  @Prop({
    default: () => true
  })
  defaultScrollTop!: boolean; // 是否自动互动到展开处

  @Prop({ default: () => null }) mappings!: {
    [key in "title" | "key" | "parent" | "folder"]: string;
  };

  @Prop({
    default: () => "无查询结果"
  })
  empty!: string; // 是否搜索文件夹

  prefixCls: string = "h3-search-tree";
  searchValue = null;
  innerList: Array<H3.Tree.TreeNode> = [];

  activeNode: H3.Tree.TreeNode | null = null;

  @Watch("list", { immediate: true, deep: true })
  watchList() {
    this.innerList = JSON.parse(JSON.stringify(this.list));
  }

  get defaultNodeId() {
    return this.value && this.value instanceof Object
      ? this.value[this.keyMappings.key]
      : this.value;
  }

  get keyMappings() {
    return Object.assign(
      {
        title: "title",
        key: "key",
        parent: "parent",
        folder: "folder"
      },
      this.mappings
    );
  }
  /**
   * 获取数据源列表
   */
  get getSourceList() {
    let list: any = [];
    if (this.searchValue) {
      list = this.getSearchList;
    }  
    if (!this.searchValue && this.innerList.length) {
      if (this.value) {
        this.innerList.forEach((node: H3.Tree.TreeNode) => {
          // 如果数据源Id和当前数据源一致
          node.selected = node[this.keyMappings.key] === this.defaultNodeId;
        });
      }
      list = this.innerList;
    } 
    return list;
  }

  /**
   * 获取查询的列表
   */
  get getSearchList() {
    return this.innerList.filter((node: H3.Tree.TreeNode) => {
      return (
        (!node[this.keyMappings.folder] || this.isSearchFolder) &&
        node[this.keyMappings.title].includes(this.searchValue)
      );
    });
  }

  /**
   * 获取高亮显示文本
   * @param node
   */
  getHighlight(node: H3.Tree.TreeNode) {
    return this.searchValue
      ? node[this.keyMappings.title].replace(
          new RegExp(`(${this.searchValue})`),
          '<span class="highlight">$1</span>'
        )
      : node[this.keyMappings.title];
  }

  /**
   * 搜索的时候清空激活的节点
   */
  search() {
    this.$emit("input", null);
  }

  /**
   * 节点点击
   */
  nodeClick(node: H3.Tree.TreeNode) {
    this.$emit("input", node);
  }

  /**
   * 打开数据源node之后
   */
  openKeysEnd() {
    setTimeout(() => {
      if (this.value) {
        const ele = this.$el.querySelector(`[data-key="${this.value[this.keyMappings.key]}"]`);
        if (ele && this.defaultScrollTop) {
          const list = this.$refs.list as HTMLDivElement;
          const listRect = list.getBoundingClientRect();
          const eleRect = ele.getBoundingClientRect();
          list.scrollTop = eleRect.top - listRect.top;
        }
      }
    }, 100);
  }
}
</script>
