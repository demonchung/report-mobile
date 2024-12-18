declare namespace H3 {
  namespace DashboardAPI {
    /**
     * Schema数据模型
     */
    export interface SchemaModel {
      schema: Schema; // 主数据模型
      relationSchemas: Array<Schema> | null; // 子表或者关联表数据模型
      dynamicParams: Array<DynamicParams> | null;
      sqlParams: Array<H3.Report.SqlParam> | null;
    }
    export interface DynamicParams {
      "dataType": string,
      "field": string,
      "name": string,
      "operator": string,
      "type": string,
      "values": any[]
    }
    export interface Compute {
      expression: string,
      fieldPrefix: string,
      fields: Array<FormulaFieldModel>
    }
    export interface FormulaFieldModel {
      field: string,
      name: string,
      mainField: string,
      schemaCode: string,
      tableId: string,
      type: string,
      dataType: string,
      alias: string,
      needAlias: string,
    }

    
    /**
     * 数据源列表
     */
    export interface DataSourceNode {
      dataSourceId: string;
      displayName: string;
      nodeType: number; // 0 文件夹 1是节点
      useType?: H3.Report.ChartUseType;
      objectId: string;
      parentObjectId: string;
      corpId: string;
      status: number | null;
      // children?: Array<DataSourceNode>
    }
    /**
     * Schema
     */
    export interface Schema {
      dataSourceId: string; // 数据源Id
      schemaCode: string; // 模型Id
      displayName: string; // 显示名称
      tableName: string; // 表名称
      parentSchemaCode: string; // 夫模型Id
      properties: Array<Properties>; // 表字段集
      visible: boolean; // 是否展示
    }

    /**
     * 模型字段
     */
    export interface Properties {
      name: string; //名称
      visible: boolean; // 是否显示
      type: string; // 字段类型
      displayName: string; //显示名称
      dataType: number; // 数据类型
      needAlias: boolean; // 是否需要别名
      associationCode: string; // 关联SchemaCode
    }

    /**
     * 图表数据 todo注释
     */
    interface ReportData {
      attributes: string;
      charts: Array<ChartViewData>;
      corpId: string;
      global: string;
      objectId: string;
      title: string;
      traceId?: string,
      url?: string
    }
    /**
     * 图表数据 todo注释
     */
    interface ChartViewData {
      // 老版本的content
      content: string;
      // 企业id
      corpId: string;
      // 图表权限
      authorization: number;
      // 数据源id
      dataSourceId: string;
      // 数据信息 包含文本组件的内容
      data: string;
      // 仪表盘reportid
      objectId: string;
      // 定位信息
      position: string;
      // 移动端配置
      mobileOptions: string;
      // 样式配置信息 只有图表类型有
      styles?: string;
      // 标题
      title: string;
      // 组件类型
      type: string;
      // useType
      useType: number;
      // 图表uid
      uuid: string;
    }
    /**
     * 图表数据 todo注释
     */
    interface ChartRealData {
      alias?: { [key: string]: string };
      originDatas?: Array<{ [key: string]: any }>;
      series: any;
      tableHeaders?: Array<TableHeaders>;
      total?: number;
      source?: any;
      traceId?: string;
      url?:string,
    }
    /**
     * 表格头部数据 todo注释
     */
    interface TableHeaders {
      driveTable: boolean;
      id: string;
      name: string;
      parentId: string;
      tableHeaders: Array<TableHeaders>;
      total: number;
    }

    /**
     * 旧报表转换后的仪表盘数据结构
     */
    interface ConvertModel { 
      migration: MigrationModel; //迁移记录信息
      chartPage: ReportData; //转换后仪表盘信息
    }
    interface MigrationModel {
      id?:	String; //标志，与chartPage的objectId一一对应
      status?: Number; //迁移状态， 0:表示迁移失败 1:迁移中 2:迁移成功 3:迁移部分成功
      corpId?: String; //企业标志corpId
      appCode?: String; //旧报表所在的应用编码
      reportCode?: String; //旧报表的编码
      reportName?: String; //旧报表名称
      charts?:	Array<MigrationChartModel> //图表迁移状态信息
    }
    interface MigrationChartModel {
      id:	String; //迁移的图表编码与chartPage里面的chart的uuid对应
      status?: Number; //迁移状态， 0:表示迁移失败 1:迁移中 2:迁移成功 3:迁移部分成功
      parentId?:	String; //MigrationModel的标志
      corpId?: String; //企业标志corpId
      reportCode?:	String; //旧报表的编码
      dataSourceId?:	String; //旧报表图表对应的数据源
      widgetId?:	String; //旧报表图表的标志
      title?: String; //旧报表图表名称
      content?: String; //图表迁移的内容
      reason?: String; //图表迁移的状态信息，内部是一个json数组，如["迁移成功"]
    }
    interface ChartPageModel {
      corpId?: String; //企业标志corpId
      objectId?: String; //仪表盘标志
      title?: String; //仪表盘名称
      attributes?:	String; //仪表盘全局过滤筛选配置信息
      global?: String; //仪表盘全局配置信息
      charts?:	Array<any> //仪表盘图表信息
    }
  }
}
