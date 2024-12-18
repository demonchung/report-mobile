declare namespace H3 {
  namespace Tree {
    export interface TreeNode {
      title?: string // 显示名称
      key?: string // key
      children?: Array<TreeNode> // 子集
      folder?: boolean // 是否为目录
      open?: boolean // 是否展开
      icon?: string
      parent?: string // 父节点key
      checked?: boolean // 是否check
      selected?: boolean // 是否被选中
      hover?: boolean // 是否hover
      value?: string // 实际值
      isOpen?: boolean
      isHover?: boolean
    }
  }
}
