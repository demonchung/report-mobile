declare namespace H3 {
  namespace ReportAPI {
    export interface Response {
      Successful: boolean;
      ErrorMessage: string | null;
      Logined: boolean;
      ReturnData: any;
      DataType: number;
      StatusCode: number;
      message: string;
    }

    export interface ProResponse {
      code: string;
      msg?: string;
      data?: any;
      time?: string;
    }

    export interface FetchResponse {
      code: string;
      msg?: string;
      data?: any;
      time?: string;
    }

    /**
     * API配置
     */
    interface APIConfig {
      corpId?: string | null; // 公司或者社团的ID
      config?: any; // 请求配置项
      host?: string | null; // URL host 地址
      errorTips?: Function | null; // 错误提示函数
      complete?: Function | null; // 成功回调函数
      error?: Function | null; // 错误回调函数
    }

    /**
     * 单图表保存 提交的图表数据解构
     */
    interface PostChart {
      authorization: number; // 权限
      content?: string; // 内容 新版不建议使用
      corpId: string;
      data: string | H3.Report.ChartDataGroup | any;
      dataSourceId: string;
      deleteStatus: 0;
      objectId: string;
      position: string | H3.Report.ElementPosition;
      styles: string | H3.Report.ChartStyleGroup;
      title: string;
      type: string;
      useType: H3.Report.ChartUseType | null;
      uuid: string;
      customSort: string;
      jumpingRules:string;
      mainTable: string; // 后台冗余主表信息
    }
    /**
     * Schema数据模型
     */
    export interface SchemaModel {
      schema: Schema; // 主数据模型
      relationSchemas: Array<Schema> | null; // 子表或者关联表数据模型
      relationFields: Array<RelationField> | null; // 字段的关联关系
      dynamicParams: Array<DynamicParams> | null;
      sqlParams: Array<H3.Report.SqlParam> | null;
    }
    /**
     * 动态字段
     */
    export interface DynamicParams {
      "dataType": string,
      "field": string,
      "name": string,
      "operator": string,
      "type": string,
      "values": any[]
    }
    /**
     * 字段的关联关系
     */
    export interface RelationField {
      mainField: string
      mainFieldName: string
      relField: string
      relFieldName: string,
      relations: any,
      relSchemaCode: string
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
      specialType?: string; // 数据类型
      needAlias: boolean; // 是否需要别名
      primaryKey: boolean; // 主键
      associationCode: string; // 关联SchemaCode
      status: number; // 字段状态， 0：表示非用户配置字段，1：表示用户配置的字段
    }

    /**
     * 数据源列表 - 模型字段
     */
    export interface PropertiesList {
      DisplayName: string; // 二级菜单名称
      DataSourceId: string; // 二级菜单数据源ID
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
      sort: number;
    }

    /**
     * 加载图表数据发送模型
     */
    export interface Chart {
      title: string; // 图表标题
      type: H3.Report.ElementType; // 图表样式
      dataSourceId: string | null; // 数据源Id
      useType: number | null; // 数据源连接类型
      authorization: number | null; // 数据权限 0, 1
      pageSize?: number | null; // 分页大小 保存时要删掉
      pageIndex?: number | null; // 获取第几页 保存时要删掉
      dimension: Array<H3.Report.FieldColumn>; // 维度(行维度)
      groupDimension?: Array<H3.Report.FieldColumn>; // 维度(列维度)
      metric: Array<H3.Report.FieldColumn>; // 指标
      sort: Array<H3.Report.FieldColumn>; // 排序
      filter?: Array<H3.Report.FilterFieldColumn>; // 过滤
      having?: Array<H3.Report.FilterFieldColumn>; // 结果过滤
      limit?: number | null; // 数据显示
      crossSummary?: H3.Report.CrossSummary; // 小计
      mapDrill?: H3.Report.MapColumn;
      filterNone?: boolean | null;
      mapArea?: {
        area: string;
        province?: H3.Report.MapColumn;
        city?: H3.Report.MapColumn;
      };
      relations?: Array<any> | null; // 关联关系
      dynamicParams?: Array<any> | null; // 动态参数
      options?: any;
      serialDimIds?: Array<string>;
      id?: string; // 图表id
      mainTable?: string; // 主表
      sqlParams?: Array<H3.Report.SqlParam> | null; // sql动态参数
    }

    /**
     * 但图表保存的chart接口
     */
    export interface SingleChart {
      content: string;
      corpId: string;
      deleteStatus: number;
      objectId: string;
      uuid: string;
    }
  }
}
