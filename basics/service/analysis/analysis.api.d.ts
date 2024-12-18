declare namespace H3 {
  namespace AnalysisAPI {
    /**
     * reportInfo
     */
    export interface reportInfo {
      attributes: string;
      charts: Array<ChartInfo>;
      corpId: string;
      dataSourceId: string;
      global: string;
      objectId: string;
      ownerId: string;
      shareStatus: 0 | 1; // 0 表示私人的，1 表示公共的
      title?: string;
      updateDate?: Date | string;
      updateUser?: string;
      updateUserName?: string;
    }

    /**
     * 图表信息
     */
    export interface ChartInfo {
      content: any;
      corpId: string;
      dataSourceId: string;
      objectId: string;
      parentObjectId: string;
      updateDate?: Date | string;
      updateUser?: string;
      updateUserName?: string;
    }
    /**
     * 排序模型
     */
    export interface OwnerChart {
      chartId: string;
      content: any;
      corpId: string;
      ownerId: string;
    }
    /**
     * 图表数据
     */
    interface ChartRealData {
      alias?: { [key: string]: string };
      originDatas?: Array<{ [key: string]: any }>;
      series: any;
      tableHeaders?: Array<TableHeaders>;
      total?: number;
    }

    /**
     * 表格头部数据
     */
    interface TableHeaders {
      driveTable: boolean;
      id: string;
      name: string;
      parentId: string;
      tableHeaders: Array<TableHeaders>;
      total: number;
    }
  }
}
