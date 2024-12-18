<template>
  <div class="h3-tree">
    <H3Draggable
      v-if="dragging"
      :data-key="null"
      :value="renderTreeList"
      :move="treeMove"
      v-bind="defaultDragOptions"
      @input="treeValueChange($event)"
      @start="treeDragStart"
      @end="treeDragEnd"
      @remove="treeRemove"
    >
      <TreeMenu
        v-for="tree in renderTreeList"
        :key="`h-${tree[mapping.key]}`"
        :treeNode="tree"
        :mapping="mapping"
        :parentNode="null"
        :accord="accord"
        :folderIcon="folderIcon"
        :nodeIcon="nodeIcon"
        :multiple="multiple"
        :folderSelected="folderSelected"
        :folderCheckbox="folderCheckbox"
        :dragOptions="defaultDragOptions"
        :dragging="dragging"
        @tree-drag-change="dragChange($event, tree)"
      >
        <slot
          slot="node"
          slot-scope="{ treeNode, nodeIcon, nodeElement }"
          name="node"
          :treeNode="treeNode"
          :nodeIcon="nodeIcon"
          :nodeElement="nodeElement"
        >
        </slot>
      </TreeMenu>
    </H3Draggable>
 <!-- @tree-drag-change="dragChange($event, tree)" -->
      <!-- :dragOptions="defaultDragOptions" -->
      <!-- :dragging="dragging" -->
      
    <TreeMenu
      v-else
      v-for="tree in renderTreeList"
      :key="`h-${tree[mapping.key]}`"
      :treeNode="tree"
      :mapping="mapping"
      :parentNode="null"
      :accord="accord"
      :folderIcon="folderIcon"
      :nodeIcon="nodeIcon"
      :multiple="multiple"
      :folderSelected="folderSelected"
      :folderCheckbox="folderCheckbox"
      :dragging="dragging"
    >
      <slot
        slot="node"
        slot-scope="{ treeNode, nodeIcon, nodeElement }"
        name="node"
        :treeNode="treeNode"
        :nodeIcon="nodeIcon"
        :nodeElement="nodeElement"
      >
      </slot>
    </TreeMenu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import TreeMenu from "./tree-menu.vue";
import TreeItem from "./tree-item.vue";
import { CreateElement } from "vue";
import H3Draggable from "vuedraggable";

@Component({
  name: "h3-tree",
  components: {
    TreeMenu,
    TreeItem,
    H3Draggable
  }
})
export default class Tree extends Vue {
  @Prop({ default: () => [] }) treeList!: Array<H3.Tree.TreeNode>; // 树节点列表
  // @Prop({ default: () => ([]) }) value !: Array<H3.Tree.TreeNode>; // 树节点列表
  @Prop({ default: () => [] }) openKeys!: Array<string>; // 要打开的keys
  @Prop({ default: () => false }) tile!: boolean; // 是否平铺模式
  @Prop({ default: () => true }) accord!: boolean; // 是否手风琴模式
  @Prop({ default: () => false }) multiple!: boolean; // 是否多选
  @Prop({ default: () => false }) folderSelected!: boolean; // 文件夹是否能选中
  @Prop({ default: () => false }) folderCheckbox!: boolean; // 文件夹是否有checkbox
  @Prop({
    default: () => ({
      open: "report-icon folder-open-fill",
      close: "report-icon folder-fill"
    })
  })
  folderIcon!: { [type in "open" | "close"]: string }; // 文件夹节点icon
  @Prop({ default: () => null }) nodeIcon!: string; // 子节点icon

  @Prop({ default: () => {} }) dragOptions!: boolean; // 拖拽配置
  @Prop({ default: () => false }) dragging!: boolean; // 是否可以拖拽
  @Prop({ default: () => false }) disabled!: boolean; // 是否禁用拖拽
  @Prop({ default: () => ({}) }) keyMappings!: {
    [key in "title" | "key" | "parent" | "folder"]: string;
  }; // key mapping映射
  @Prop({
    default: () => {
      return true;
    }
  })
  allowNodeDrag!: Function; // 拖拽过程中判断是否允许可拖拽的函数
  prefixCls = "h3-tree";
  innerNodeList: { [treeKey: string]: H3.Tree.TreeNode } = {};
  checkedNodeList = {};
  defaultDragOptions = {
    group: "dragGroup",
    animation: 150,
    disabled: false,
    sort: true, // 定义是否可以拖拽
  };
  moveNode: any = null;
  toList: any = null;
  fromList: any = null;
  openTimer: any = null;

  // 真正渲染的数据序列 内部数据
  renderTreeList: Array<H3.Tree.TreeNode> = [];

  // 监听title
  @Watch("disabled")
  watchDisable(val: boolean) {
    this.defaultDragOptions.disabled = val;
  }

  dragChange(evt, tree) {
    console.log(evt,tree,'dragChange事件');
    this.treeMenuChange(evt, tree);
  }

  /**
   * 处理数据格式
   */
  setRenderTreeList() {
    const tmpList: Array<H3.Tree.TreeNode> = JSON.parse(JSON.stringify(this.treeList));
    let backUpList = [...tmpList];
    let fristFlod = tmpList.filter(i => !i[this.mapping.parent]);
    if (fristFlod.length < 1) {
      fristFlod = [...tmpList];
    }
    const indexArr = [];

    if (this.tile) {
      const findChild = item => {
        if (!backUpList || backUpList.length < 1) {
          return [];
        }
        backUpList = backUpList.filter(t => item[this.mapping.key] !== t[this.mapping.parent]);
        return tmpList.filter(t => item[this.mapping.key] === t[this.mapping.parent]);
      };
      const setChild = (item) => {
        if (!item[this.mapping.folder]) {return item;}
        const child = findChild(item);
        let tempChild = [...child];
        if (child && child.length > 0) {
          tempChild = setList(child);
        }
        item.children = tempChild;
        return item;
      };
      const setList = (list: Array<H3.Tree.TreeNode>): Array<H3.Tree.TreeNode> => {
        list.forEach((l, index) => {
          list[index] = setChild(l);
        });
        return list;
      };
      return setList(fristFlod);
    }
    return tmpList;
  }



  // get innerTreeList() {
  //   let tmpList: Array<H3.Tree.TreeNode | null> = JSON.parse(JSON.stringify(this.treeList));
  //   // 文件夹的列表
  //   const indexArr = [];

  //   if (this.tile) {
  //     const setNode = (node, list, indexList: Array<number> = []) => {
  //       list.forEach((nNode: H3.Tree.TreeNode, index) => {
  //         if (node[this.mapping.key] === nNode[this.mapping.parent]) {
  //           node.str = node.str || "";
  //           node.str += nNode[this.mapping.key] + ",";
  //           node.children = node.children || [];
  //           node.children.push(nNode);
  //           indexList.push(index);
  //           setNode(nNode, list, indexList);
  //         }
  //       });
  //       return indexList;
  //     };
  //     tmpList.forEach((node: H3.Tree.TreeNode) => {
  //       if (!node[this.mapping.folder]) {
  //         delete node.children;
  //       }
  //       setNode(node, tmpList, indexArr);
  //     });
  //     indexArr.forEach((index: number) => {
  //       tmpList[index] = null;
  //     });
  //     tmpList = tmpList.filter(node => node);
  //   }
  //   return tmpList;
  // }
  get mapping() {
    return Object.assign(
      {
        title: "title",
        key: "key",
        parent: "parent",
        folder: "folder"
      },
      this.keyMappings
    );
  }
  @Watch("openKeys")
  watchOpenKeys() {
    console.log('openKeys更改')
    this.$nextTick(()=> {
       this.handleOpenKeys();
    });
  }

  @Watch("treeList")
  watchTreeList(newList,oldList) {
    
    if(!this.tile) {
      this.renderTreeList = this.treeList;
      this.$nextTick(()=> {
         this.handleOpenKeys();
      });
      return;
    }
    if(!this.dragging) {
      this.initValue();
    }
  }

  @Watch("dragging")
  watchDragging(val) {
    if(val) {
      this.initValue();
    }
  }
  

  @Provide()
  addFolderList(node: H3.Tree.TreeNode) {
    this.innerNodeList[node[(this.mapping as any).key]] = node;
  }
  @Provide()
  nodeClick(node: H3.Tree.TreeNode) {
    node.selected = true;
    Object.keys(this.innerNodeList).forEach((key: string) => {
      if (
        key !== node[(this.mapping as any).key].toString() &&
        this.innerNodeList[key].selected == node.selected
      ) {
        this.innerNodeList[key].selected = false;
      }
    });
    this.$emit("node-click", node);
  }
  @Provide()
  treeNodeExpand(treeNode: H3.Tree.TreeNode) {
    if (treeNode.open && this.accord && this.treeList) {
      Object.values(this.innerNodeList).forEach((child: H3.Tree.TreeNode) => {
        if (child[(this.mapping as any).key] !== treeNode[(this.mapping as any).key]) {
          child.open = false;
        }
      });
    }
    this.$emit("folder-click", treeNode);
  }
  @Provide()
  multipleClick(node: H3.Tree.TreeNode) {
    node.checked = !node.checked;
    if (node.checked) {
      this.checkedNodeList[node[(this.mapping as any).key]] = node;
    } else {
      delete this.checkedNodeList[node[(this.mapping as any).key]];
    }
    // folderSelected - 目录可选
    if (this.folderSelected) {
      this.allUpChecked(node);
      this.allDownChecked(node);
      this.$emit("multiple-click", {
        node,
        selected: Object.values(this.checkedNodeList).map(
          (tree: H3.Tree.TreeNode) => tree[(this.mapping as any).key]
        )
      });
    } else {
      this.$emit("multiple-click", { node, selected: this.checkedNodeList });
    }
  }
  @Provide()
  nodeHover(node: H3.Tree.TreeNode) {
    this.$emit("node-hover", node);
  }
  /**
   * 向下处理节点状态
   */
  allDownChecked(node: H3.Tree.TreeNode) {
    if (node.children && node.children.length) {
      node.children.forEach((tree: H3.Tree.TreeNode) => {
        const iTree = this.innerNodeList[tree[(this.mapping as any).key]];
        iTree.checked = !iTree.checked;
        if (iTree.checked) {
          this.checkedNodeList[iTree[(this.mapping as any).key]] = iTree;
        } else {
          delete this.checkedNodeList[iTree[(this.mapping as any).key]];
        }
        this.allDownChecked(tree);
      });
    }
  }

  /**
   * 向上处理节点状态
   */
  allUpChecked(node: H3.Tree.TreeNode) {
    if (node[(this.mapping as any).parent] || node[(this.mapping as any).parent] === (0 as any)) {
      const parentNode = this.innerNodeList[node[(this.mapping as any).parent]] as any;
      let difference = false;
      parentNode.children.forEach((tree: H3.Tree.TreeNode) => {
        const bTree = this.innerNodeList[tree[(this.mapping as any).key]];
        if (node.checked != bTree.checked) {difference = true;}
      });
      if (!difference) {
        parentNode.checked = node.checked;
        if (parentNode.checked) {
          this.checkedNodeList[parentNode[(this.mapping as any).key]] = parentNode;
        } else {
          delete this.checkedNodeList[parentNode[(this.mapping as any).key]];
        }
        this.allUpChecked(parentNode);
      }
    }
  }
  /**
   * 树转平铺
   */
  preOrder(list) {
    return list.reduce((res, node) => {
      res.push(node);
      if (node.children) {res = res.concat(this.preOrder(node.children));}
      return res;
    }, []);
  }
  /**
   * 处理需要打开的keys
   */
  handleOpenKeys() {
    const opened = false;
    let list = this.preOrder(Object.values(this.innerNodeList));
    list.forEach((node)=> {
      if(this.openKeys.includes(node.objectId || node.key)) {
        node.open = true;
      }
    })

    this.$nextTick(() => {
      if (opened) {
        this.$emit("open-keys-end");
      }
    });
  }

  /**
   * 节点拖拽开始
   * @param evt
   */
  @Provide()
  treeValueChange(evt) {
    console.log("dragging-input",evt);
    this.renderTreeList = evt;
  }

  /**
   * 目录自节点改变排序
   */
  @Provide()
  treeMenuChange(evt, tree) {
    // console.log('treeMenuChange=========',evt,tree);
    this.$set(tree, "children", evt);
    this.$set(tree, "open", true);
    this.treeValueChange(this.renderTreeList);
  }

  /**
   * 节点拖拽开始
   * @param evt
   */
  @Provide()
  treeDragStart(evt) {
    console.log('dragging-start', evt);
  }

  /**
   * 节点拖拽结束
   * @param evt
   */
  @Provide()
  treeDragEnd(evt) {
    console.log('dragging-end', evt);
    const params = {
      list: this.renderTreeList,
      moveNode: this.moveNode,
      to: this.toList && this.toList.key ? this.toList.key : null,
      from: this.fromList && this.fromList.key ? this.fromList.key : null
    };
    const node = this.renderTreeList.find(item=> (item as any).objectId  === this.moveNode.objectId);
    if(node) {
      console.log('改变目标节点的父节点');
      (node as any).parentObjectId = params.to;
    }
    this.$emit("tree-drag-change", params);
  }

  /**
   * 节点拖拽时的
   * @param evt
   */
  @Provide()
  treeMove(evt) {
    this.moveNode = evt.draggedContext.element;
    this.toList = evt.to.dataset;
    this.fromList = evt.from.dataset;
    if (this.allowNodeDrag) {
      return this.allowNodeDrag(evt);
    }
  }

  /**
   * 节点拖动到另一个列表时
   * @param evt
   */
  treeRemove(evt) {
    // console.log('dragging-treeRemove',evt);
  }

  /**
   * 初始化数据
   */
  initValue() {
    if(this.dragOptions) {
       this.defaultDragOptions = Object.assign({},this.defaultDragOptions,this.dragOptions);
      //  console.log(this.defaultDragOptions,'this.defaultDragOptions')
    }
    this.renderTreeList = this.setRenderTreeList();
  }
  // delayOpenKeys() {
  //     clearTimeout(this.openTimer);
  //       this.openTimer = setTimeout(() => {
  //       this.handleOpenKeys();
  //   }, 50);
  // }
  // updated() {
  //   console.log(333)
  //   clearTimeout(this.openTimer);
  //   this.openTimer = setTimeout(() => {
  //     this.handleOpenKeys();
  //   }, 50);
  // }
  
  addNode(node) {
    console.log(node, this.renderTreeList, "addNode===");
    const tnode = this.nodeTransformTreeNode(node);
    if (node.parentObjectId) {
      this.loop(this.renderTreeList, node.parentObjectId, (fnode) => {
        fnode.open = true;
        fnode.children.push(tnode);
        // this.handleOpenKeys();
      });
    } else {
      this.renderTreeList.push(tnode);
    }
  }
  deleteNode(node) {
    console.log(node,'删除节点');
     if(node.parentObjectId) {
       this.loop(this.renderTreeList,node.parentObjectId,(fnode)=> {
          fnode.open = true;
           if(fnode.children && fnode.children.length) {
              const nodeIndex = fnode.children.findIndex((item)=> (item as any).objectId === node.objectId);
              if(nodeIndex > -1) {
                  fnode.children.splice(nodeIndex,1);
              }
           }
      });
    } else {
      const nodeIndex = this.renderTreeList.findIndex((item)=> (item as any).objectId === node.objectId);
      if(nodeIndex > -1) {
        this.renderTreeList.splice(nodeIndex,1);
      }
    }
  }
  moveChild(node) {
    if(node.parentObjectId) {
       this.loop(this.renderTreeList,node.parentObjectId,(fnode)=> {
           fnode.children.push(...node.children.splice(0,node.children.length));
      });
    } else {
      this.renderTreeList.push(...node.children.splice(0,node.children.length))
    }
   
  }
  changeNode(node,options) {
    // if(node.parentObjectId) {
    //   this.loop(this.renderTreeList,node.parentObjectId,(fnode)=> {
    //    fnode.open = true;
    // });
    // }
    this.loop(this.renderTreeList,node.objectId,(fnode)=> {
      // fnode.open = true;
      
      Object.assign(fnode,options);
    });
    // this.handleOpenKeys();

  }
  /**
   * 查找指定节点
   */
  loop(data, key, callback) {
      
      for (let i = 0; i < data.length; i++) {
        if (data[i].objectId == key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          this.loop(data[i].children, key, callback )
        }
      }
    }

    getparentlist(code, tree) {
      let arr = [] //要返回的数组
      for (let i = 0; i < tree.length; i++) {
        const item = tree[i];
        arr = [];
        arr.push(item.objectId); //保存当前节点id
        if (code == item.objectId) { //判断当前id是否是默认id
          return arr; //是则退出循环、返回数据
        } else { //否则进入下面判断，判断当前节点是否有子节点数据
          if (item.children && item.children.length > 0) {
                    //合并子节点返回的数据
            arr = arr.concat(this.getparentlist(code, item.children)); 
            if (arr.includes(code)) { //如果当前数据中已包含默认节点，则退出循环、返回数据
              return arr;
            }
          }
        }
      }
    }

  /**
   * 节点变为树节点
   */
  nodeTransformTreeNode(node) {
    let cnode = JSON.parse(JSON.stringify(node));
    cnode = Object.assign({
      children: node.nodeType === 0 ? [] : null,
      folder: node.nodeType === 0,
      rename: node.nodeType === 0
    },cnode);
    return cnode;
  }

  mounted() {
    this.handleOpenKeys();
    this.initValue();
    this.$emit('logonEvent',{
      moveChild: this.moveChild,
      add:  this.addNode,
      delete:  this.deleteNode,
      change:  this.changeNode,
    })
  }
}
</script>
<style lang="less">
@import "./style/index.less";
</style>
