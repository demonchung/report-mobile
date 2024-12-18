declare namespace H3 {
  namespace Report {
    export interface FilterFieldExtend{
      formula: string // 过滤公式
      field: FieldColumn // 过滤字段
      value: Array<string | number | any> // 过滤条件
      format?: string, // 格式化
      isExternal?: boolean, // 是否有查看所有数据的权限
      chartId?:string,//当前chartID
    }
  }
}
