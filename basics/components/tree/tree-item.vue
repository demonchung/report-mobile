<template>
  <div 
    :class="{'h3-menu-tree-item': true, 'h3-menu-tree-item--selected': treeNode.selected}"
    @click="click"
    @mousemove="mousemove"
  >
    <slot
      name="node"
      :treeNode="treeNode"
      :nodeIcon="nodeIconStyle"
      :nodeElement="getNodeElement"
    >
      <span v-if="nodeIconStyle" :class="nodeIconStyle"></span>
      <div :class="`${prefixCls}__word`">{{ treeNode[mapping.title] }}</div>
    </slot>
    <h3-checkbox
      v-if="multiple && getFolderCheckbox"
      :class="[`${prefixCls}__checkbox`]"
      :checked="treeNode.checked"
      @click.stop
      @change.stop="treeCheckbox"
    ></h3-checkbox>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import { Checkbox } from '@h3/antd-vue';

@Component({
  name: 'h3-menu-tree-item',
  components: {
    H3Checkbox: Checkbox,
  }
})

export default class Tree extends Vue {
  @Prop({ default: () => ({}) }) treeNode !: H3.Tree.TreeNode;
  @Prop({ default: () => null }) folderIcon !: {[type in 'open' | 'close']: string};
  @Prop({ default: () => null }) nodeIcon !: string;
  @Prop({ default: () => false }) multiple !: boolean; // 是否多选
  @Prop({ default: () => false }) folderSelected !: boolean; // 文件夹是否能选中
  @Prop({ default: () => false }) folderCheckbox !: boolean; // 文件夹是否有checkbox
  @Prop({ default: () => ({}) }) mapping !: { [key: string]: string };
  @Inject({ default: () => {} }) nodeClick !: Function;
  @Inject({ default: () => {} }) nodeHover !: Function;
  @Inject({ default: () => {} }) multipleClick !: Function;
  @Inject({ default: () => {} }) treeNodeExpand !: Function;
  @Inject({ default: () => {} }) addFolderList !: Function;
  prefixCls = 'h3-menu-tree-item';

  @Watch('tree', { immediate: true })
  watchTreeNode() {
    this.addFolderList(this.treeNode);
  }
  getNodeElement() {
    return this.$el;
  }
  get nodeIconStyle() {
    let style = null;
    if (!this.folderIcon) {
      return style;
    } else {
      if (this.treeNode[this.mapping.folder]) {
        style = this.treeNode.open ? this.folderIcon.open : this.folderIcon.close;
      } else {
        style = this.nodeIcon ? this.nodeIcon : null;
      }
    }
    return style;
  }

  get getFolderCheckbox () {
    if (this.folderCheckbox) {
      return true;
    } else {
      return !this.treeNode[this.mapping.folder];
    }
  }

  treeCheckbox() {
    this.multipleClick(this.treeNode);
  }
  mousemove() {
    this.nodeHover(this.treeNode);
  }
  click() {
    this.treeNode.open = !this.treeNode.open;
    if (!this.treeNode[this.mapping.folder] || this.folderSelected) {
      this.nodeClick(this.treeNode);
    }
    if(this.treeNode[this.mapping.folder]){
      this.treeNodeExpand(this.treeNode);
    }
  }
}
</script>
