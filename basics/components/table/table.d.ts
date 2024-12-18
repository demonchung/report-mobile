declare namespace H3 {
  namespace Chart {
    interface Table {
      data: TableData // 图表数据
      columns: Array<H3.Report.FieldColumn>  // 维度
      colors: Array<string> // 颜色数组
      resizeState: boolean //跟新状态
      height: number // 高度
      dataAlias: {[key: string]: string} // 数据别名
    }
    interface TableData {
      rows: Array<any> // rows
      page: number // 表格当前页
      totals: number // 表格总数
    }
  }
}
