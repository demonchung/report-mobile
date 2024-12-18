<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import TreeItem from "./tree-item.vue";
import { CreateElement, VNode } from "vue";
import H3Draggable from "vuedraggable";

@Component({
  name: "h3-menu-tree",
  components: {
    TreeItem,
    H3Draggable
  }
})
export default class MenuTree extends Vue {
  @Prop({ default: () => [] }) treeNode!: H3.Tree.TreeNode;
  @Prop({ default: () => [] }) parentNode!: H3.Tree.TreeNode | null;
  @Prop({ default: () => true }) accord!: boolean; // 是否手风琴模式
  @Prop({ default: () => null }) folderIcon!: { [type in "open" | "close"]: string };
  @Prop({ default: () => null }) nodeIcon!: string;
  @Prop({ default: () => false }) multiple!: boolean; // 是否多选
  @Prop({ default: () => false }) folderSelected!: boolean; // 文件夹是否能选中
  @Prop({ default: () => false }) folderCheckbox!: boolean; // 文件夹是否有checkbox
  @Prop({ default: () => {} }) dragOptions!: any; // 
  @Prop({ default: () => false }) dragging!: boolean; // 是否可以拖拽
  @Prop({ default: () => ({}) }) mapping!: { [key: string]: string };
  @Inject({ default: () => {} }) treeDragStart!: Function;
  @Inject({ default: () => {} }) treeDragEnd!: Function;
  @Inject({ default: () => {} }) treeMove!: Function;
  @Inject({ default: () => {} }) treeMenuChange!: Function;
  // innerTreeNode: H3.Tree.TreeNode | undefined;
  innerTreeNode: any = {};
  prefixCls = "h3-menu-tree";
  // dragOptions = {
  //   group: "dragGroup",
  //   animation: 150,
  //   sort: true // 定义是否可以拖拽
  // };
  // 拖拽移动的节点信息
  moveNode: any = null;
  // 拖拽移动结束后的父节点ID
  moveNodeParentObjectId: string = "";

  @Watch("treeNode", { immediate: true, deep: true })
  watchTreeNode(node) {
    const defaultNode = {
      icon: "",
      open: false,
      selected: false, // 是否被选中
      checked: false,
      hover: false
    };
    Object.keys(this.mapping).forEach((key: string) => {
      defaultNode[key] = null;
    });
    const assignValue = Object.assign(defaultNode, this.treeNode);
    Object.keys(assignValue).forEach((key: string) => {
      // $set强制更新数据，否则监听不到treeNode
      this.$set(this.innerTreeNode, key, assignValue[key]);
    });
    if (this.parentNode) {
      this.innerTreeNode[this.mapping.parent] = this.parentNode[this.mapping.key];
    }
    // 判断是否为目录级
    if (Object.keys(this.innerTreeNode)[this.mapping.folder]) {
      this.innerTreeNode[this.mapping.folder] = true;
    }
  }

  @Watch("innerTreeNode.open")
  watchIsOpen(val: Boolean) {

    if (val) {
      this.$emit("parent-open");
    }
    this.$nextTick(() => {
      if (this.$refs.list) {
        (this.$refs.list as HTMLDivElement).classList.toggle("h3-menu-tree__list-open");
      }
    });
  }

  parentOpen() {
    (this.innerTreeNode as any).open = true;
  }

  /**
   * 拖拽开始
   * @param evt 拖拽自带属性
   */
  menuDragStart(evt: any) {
    // console.log('menuDragStart', evt);
    // 拖拽的目标节点信息
    // this.treeDragStart(evt, this.moveNode);
  }

  /**
   * 拖拽结束
   * @param evt 拖拽自带属性
   */
  menuDragEnd(evt: any) {
    // console.log('menuDragEnd', evt);
    this.treeDragEnd(evt);
  }
  /**
   * 节点拖拽开始
   * @param evt
   * @param moveNode 拖拽的目标节点信息
   */
  treeValueChange(evt) {
    // if(evt && evt.length && this.treeNode && this.treeNode.children) {
    //    let tmpChild = this.treeNode.children.find((child)=> {
    //      evt[0].parentObjectId === (child as any).objectId;
    //    });
    //    if(tmpChild) {
    //     // tmpChild.children = evt;

    //    }
    // }
          this.$emit("tree-drag-change", evt,this.treeNode);

  }
  /**
   *
   */
  treeMenuValueChange(evt,node) {
    // this.treeNode.children = evt;
    this.treeMenuChange(evt,node)
    // console.log('treeMenuValueChange-----', evt,node,this.treeNode);
  }
  /**
   * 节点拖拽时的
   * @param evt
   */
  treeMenuMove(evt) {
    this.moveNode = evt.draggedContext.element;
    console.log('tree-menu  treeMenuMove', evt);
    this.treeMove(evt);
  }

  /**
   * 节点拖动到另一个列表时
   * @param evt
   */
  treeRemove(evt) {
    // console.log(' ---treeRemove', evt, this.treeNode);
    // let child = this.treeNode.children || [];
    // child.splice(evt.oldIndex, 1);
    // this.treeMenuChange(child, this.treeNode);
  }
  /**
   *
   */
  treeAdd(evt) {
    // console.log("treeadd", evt, this.treeNode);
    // const formRoot = !evt.from.dataset.key && !evt.to.dataset.key;
    // if (formRoot) return;
    // let child = this.treeNode.children || [];
    // child.splice(evt.newIndex, 0, evt.item._underlying_vm_);
    // this.treeMenuChange(child, this.treeNode);
  }
  /**
   * 找父节点ObjectId
   */
  findParentObjectId(list, objectId) {
    for (const i of list.children) {
      if (i.objectId === objectId) {
        this.moveNodeParentObjectId = list.objectId;
        break;
      } else {
        if (i.children) {
          this.findParentObjectId(i, objectId);
        }
      }
    }
  }

  render(h: CreateElement) {
    if (!this.innerTreeNode) {return;}
    let dragArr: Array<any> = [];
    const menuTrees: Array<VNode> = [];
    let list: VNode | undefined;
    if (this.innerTreeNode.children && this.innerTreeNode.children.length) {
      this.innerTreeNode.children.forEach((tree: H3.Tree.TreeNode) => {
        menuTrees.push(
          h(MenuTree, {
            key: tree[this.mapping.key],
            props: Object.assign({}, this.$props, {
              dragOptions: this.dragOptions,
              treeNode: tree,
              parentNode: this.innerTreeNode
            }),
            on: {
              "parent-open": this.parentOpen,
              "tree-drag-change": this.treeMenuValueChange
            },
            scopedSlots: this.$scopedSlots
          })
        );
      });
    }
    // 能拖拽才渲染dragging
    if (this.dragging) {
      dragArr.push([
        h(
          H3Draggable,
          {
            attrs: {
              "data-key": this.treeNode[this.mapping.key]
            },
            props: {
              // list: this.treeNode.children,
              value: this.treeNode.children,
              options: this.dragOptions,
              move: this.treeMove
            },
            on: {
              input: this.treeValueChange,
              // start: this.menuDragStart,
              end: this.menuDragEnd,
              remove: this.treeRemove,
              move: this.treeMenuMove,
              add: this.treeAdd
            }
          },
          menuTrees
        )
      ]);
    } else {
      dragArr = menuTrees;
    }
    if (dragArr.length) {
      list = h(
        "div",
        {
          ref: "list",
          class: {
            "h3-menu-tree__list": true,
            "h3-menu-tree__list--dragging": this.dragging
          }
        },
        dragArr
      );
    }
    return h(
      "div",
      {
        class: {
          "h3-menu-tree": true
        }
      },
      [
        h(TreeItem, {
          props: Object.assign({}, this.$props, { treeNode: this.innerTreeNode }),
          scopedSlots: { node: this.$scopedSlots.node }
        }),
        list
      ]
    );
  }
}
</script>
