declare namespace H3 {
  namespace DataSourceAPI {
    interface DataSourceNode {
      corpId?: string; // 公司ID
      displayName?: string; // 显示名称
      nodeType?: number; // 节点类型 0-表示组节点，1-表示数据源节点
      objectId?: string; //数据源Id
      parentObjectId: string; // 数据源父节点Id
      status?: number; //节点状态0-表示正常，1-表示异常
      creationDate?: string; //创建时间
      updateDate?: string; //修改时间
      sort?: number; //排序字段
      dateSourceType?: number; // 100普通数据源 200自定义sql数据源
      children?: null | Array<DataSourceNode>;
      folder?: boolean;
    }
    export interface Model {
      main: ModelGroup;
      subs: Array<ModelGroup>;
      relationFields: Array<RelationField> | null;
      id: string; // 源节点ID
    }
    export interface RelationField {
      mainField: string;
      mainFieldName: string;
      relField: string;
      relFieldName: string;
      relations: any;
      relSchemaCode: string;
    }

    export interface ModelGroup {
      corpId?: string;
      dataConnectionId: string;
      displayName: string;
      groupObjectId?: string;
      objectId?: string;
      refName: string;
      schemaCode: string;
      tableName?: string;
      fields: Array<Field>;
    }
    export interface Field {
      displayName: string;
      name: string;
      objectId: string;
      schemaCode: string;
      type: string;
      bizDataType: number;
      needAlias?: boolean;
      mainField?: string;
      dataType?: number | string;
    }
    export interface Compute {
      expression: string;
      fieldPrefix: string;
      fields: Array<ComputeField>;
    }
    export interface ComputeField {
      id: string;
      text: string;
      type: string;
    }
    export interface Preview {
      data: Array<PreviewField>;
      headers: Array<PreviewHeader>;
      dataSourceInfo: PreviewInfo;
    }
    export interface PreviewField {
      field: string | number | Date;
    }
    export interface PreviewHeader {
      name: string;
      title: string;
      type: string;
      dataType? : string;
    }
    export interface PreviewInfo {
      createDate: string | Date; // 创建日期
      updateDate: string | Date; // 最后更新时间
      creator: string;
      totalCount: number; //总数据条数
      showCount: number; // 显示条数
    }
  }
}
