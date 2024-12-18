declare namespace H3 {
  interface Table {
    tableId?: string 
    columns: Array<TableColumns> // 头
    data: Array<any>
    width?: number
    height: number
  }
  interface TableHeader{
    scrollLeft?: number
    columnsWidth: Array<number>
    columnsIds: Array<string>
    columns?: Array<TableColumns> // 头
    prefixCls?: string
    gutter?: boolean
    gutterWidth?: number
  }
  interface TableBody{
    columns?: Array<TableColumns> // 头
    columnsWidth: Array<number>
    columnsIds: Array<string>
    data: Array<any>
    prefixCls: string
    height: number
  }
  interface TableColumns {
    columnId: string //  行id
    prop: string // 绑定值
    label: string //列头显示
    width?: number // 宽度
    summary: boolean // 是否汇总
    formatter: Function // 格式化
    type: 'string' | 'number' | 'date' // 值类型
    summaryType: 'SUM' | 'AVG' | 'MAX' | 'MIN';
  }
}
