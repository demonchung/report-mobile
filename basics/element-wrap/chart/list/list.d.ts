declare namespace H3 {
  namespace List {
    /**
     * 表头 渲染信息
     */
    interface TitleOptions {
      alias: string; // 标题别名
      name: string; // 字段名称本名
      width?: number; // 表格宽度
      leafNum?: number; // 栏数
      allowDrag?: boolean; // 是否允许拖拽
      isLeaf: boolean; // 是否是叶子节点
      key: string; // 字段ID
    }

    /**
     * 每列信息
     */
    interface SortHeadOptions {
      width: number; // 表格宽度
      key: string; // 字段ID
      needAlias?: Boolean; // 是否是别名字段
      options?: any;
      type: string;
    }

    /**
     * 分页器回调参数
     */
    interface pageOptions {
      pageSize: number; // 页数大小
      pageIndex: number; // 第几页
    }
    /**
     * 明细表存储列宽结构
     */
    interface columnSetting {
      key: string; // 字段uid，序号用特殊的key表示
      width: number; // key表示字段uid,
    }
  }
}
