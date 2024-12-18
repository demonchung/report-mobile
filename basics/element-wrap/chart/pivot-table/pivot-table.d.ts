declare namespace H3 {
  namespace PivotTable {
    interface Table {
      columns: Array<H3.Report.FieldColumn>; // 列头
      rows: Array<H3.Report.FieldColumn>; // 行头
      metric: Array<H3.Report.FieldColumn>; // 指标
      alias: any;
      isNo: boolean; //是否有序号
      realData: Data; // 数据
      fixed?: boolean; // 是否固定列头
      width?: number;
      height: number;
    }
    interface TableHeader {
      prefixCls: string;
      tableRows: Array<Array<string>>;
      tableColumnsWidths: Array<number>;
      scrollLeft: number;
    }
    interface TableScroll {
      prefixCls: string;
      tableColumnsWidths: Array<number>;
      tableColumns: Array<string>;
      height: number;
      bodyRows: Array<any>;
    }
    interface TableFooter {
      prefixCls: string;
      summary: Array<number>;
      tableColumnsWidths: Array<number>;
      scrollLeft: number;
    }
    interface Column {
      label: string; //列头显示
      width?: number; // 宽度
      formatter: Function; // 格式化
    }

    interface Data {
      data: Array<any>; // 汇总数据
      rows: { [key: string]: any }; // 列数据
      columns: { [key: string]: any }; // 列数据
      summary: Array<any>; // 汇总数据
    }
    /**
     * 透视表存储列宽结构
     */
    interface columnSetting {
      key: string; // 字段uid，序号用特殊的key表示
      width: number; // key表示字段uid,
    }
  }
}
