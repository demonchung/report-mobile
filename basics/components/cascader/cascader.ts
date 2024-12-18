declare namespace H3 {
  interface CascaderNode {
    key?: string; // 一级菜单key
    isShow?: boolean; // 是否显示item本身
    displayName?: string; // item本身名称
    subShow?: boolean; // 子级菜单是否显示
    level?: number; // 层级统计
    method?: object; // 方法配置，例：method: { funName: 'title' },
    checked?: boolean; // 子级菜单选中
    children?: Array<H3.CascaderNode>; // 子级菜单数据集
    value?: any; // 同环比数值
  }

  interface CascaderParam {
    self: any; // menu菜单，this
    parentEl: any; // wrap parent el
    data: H3.Report.FieldColumn; // 图表chart的data数据
    chart: H3.Report.Chart; // 图表chart
    source: string; // 来源（dimension/groupDimension/metric）
    treeNode: H3.CascaderNode; // cascader树菜单节点
    cascaderIndex: number; // 父级节点点击的index
    hideCascader: Function; // 隐藏cascader组件
    removeUndrag: Function; // 移除禁止拖拽class
    resizeChartView: Function; // 更新图表视图
    setNumberFormat: Function; // 设置数值格式
    setResultFilter: Function; // 设置结果筛选器
    setDateFormat: Function; // 设置明细表设置日期格式
    setTargetValue: Function; // 设置目标值格式
    setForecast: Function; // 设置目标值格式,
    setConditionFormat: Function; // 设置条件格式
    langType: string;
  }
}
