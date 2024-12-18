/**
 * 氚云数据特殊处理
 */


// 数据项的逻辑类型
enum BizDataType
{
  // 空值
  Unspecified = -1,
  // 逻辑型
  Bool = 1,
  // 日期型
  DateTime = 5,
  // 双精度数值型
  Double = 7,
  // 整数
  Int = 9,
  // 长整数
  Long = 11,
  // 长文本
  String = 13,
  // 短文本
  ShortString = 14,
  // 二进制流
  ByteArray = 20,
  // 图片类型
  Image = 23,
  // 未指定类型的附件
  File = 24,
  // 时间段型
  TimeSpan = 25,
  // 参与者（单人）
  Unit = 26,
  // 参与者（多人）
  UnitArray = 27,
  // Html
  Html = 30,
  // Xml
  Xml = 32,
  // 业务对象
  BizObject = 40,
  // 业务对象数组
  BizObjectArray = 41,
  // 业务结构
  BizStructure = 42,
  // 业务结构数组
  BizStructureArray = 43,
  // 关联到其他的对象，这种字段在表单上通常是以开窗查询的形式出现
  Association = 50,
  // 关联对象数组
  AssociationArray = 51,
  // 地图类型,存json格式：{Address:"",Point:{lat:32323.43,lng:323.232}}
  Map = 55,
  // 地址类型,存json格式:{"Province":"福建省","City":"泉州市","Town":"惠安县","Detail":"32323"}
  Address = 56,
  // 公式型控件
  Formula = 57
}

/**
 * 处理数据类型
 * @param type
 */
const handleSchemaType = (type: number) => {
  let fieldType:string | boolean = '';
  switch (type) {
    case BizDataType.Unit:
    case BizDataType.String:
    case BizDataType.ShortString:
    case BizDataType.Address:
      fieldType = 'string';
      break;
    case BizDataType.DateTime:
      fieldType = 'date';
      break;
    case BizDataType.Int:
    case BizDataType.Long:
    case BizDataType.Double:
      fieldType = 'number';
      break;
    default:
      fieldType = 'other';
      break;
  }
  return fieldType;
};
let relationFields : Array<H3.Report.FieldColumn> = [];
let schemaCodes : Array<string> = [];
/**
 * 数据分组
 * @param schema 表数据
 * @param relationSchemas 关联表数据
 * @param tableName  显示表名称
 * @param relation  是否关联表
 */
const groupSchema = (schema: any, relationSchemas: Array<any>, tableName: string | null = null, relation: number = 0) => {
  const fields: Array<H3.Report.FieldColumn> = [];
  schemaCodes.push(schema.SchemaCode);
  schema.Properties.forEach((item: any) => {
    if (
      !relation && [BizDataType.Association, BizDataType.BizObject, BizDataType.BizObjectArray].includes(item.DataType) ||
      relation === 1 && [BizDataType.BizObject, BizDataType.BizObjectArray].includes(item.DataType)
    ) {
      const schemaCode = item.AssociationSchemaCode !== '' ? item.AssociationSchemaCode : item.Name;
      if (!schemaCodes.includes(schemaCode)) {
        const relationSchema = relationSchemas.find((relation: any) => relation.SchemaCode === schemaCode);
        if (relationSchema) {
          relationFields = relationFields.concat(groupSchema(relationSchema, relationSchemas, item.DisplayName, (relation + 1)));
        }
      }
    }
    if (['Status', 'ObjectId', 'WorkflowInstanceId', 'IconId', 'ParentObjectId'].includes(item.Name)) {
      item.Visible = false;
    }
    const type = handleSchemaType(item.DataType);
    if (type) {
      const field: any = {
        uid: '',
        parentSchemaCode: schema.ParentSchemaCode,
        schemaCode: schema.SchemaCode,
        tableName: tableName || schema.DisplayName,
        tableId: schema.TableName,
        field: item.Name,
        specialType: item.specialType || "",
        name: item.DisplayName,
        dataType: item.DataType,
        visible: item.Visible,
        type: type,
        options: {}
      };
      fields.push(field);
    }
  });
  return fields;
};

/**
 * 处理数据
 * @param schemaModel 数据模型
 */
export const handleSchemaModal = (schemaModel: any) => {
  relationFields = [];
  schemaCodes = [];
  let fields = groupSchema(schemaModel.Schema, schemaModel.RelationSchemas);
  relationFields.sort((prvField: H3.Report.FieldColumn, nextField: H3.Report.FieldColumn)=> prvField.tableName.localeCompare(nextField.tableName));
  fields = fields.concat(relationFields);
  return fields;
};
/**
 * 处理过滤条件
 */
export function handleFilters(schemas: Array<H3.Report.FieldColumn>, filters: Array<H3.Yun.Filter>): Array<H3.Report.FilterFieldColumn> {
  const globalFilters: Array<H3.Report.FilterFieldColumn> = [];
  let filterItem: H3.Report.FilterFieldColumn;
  filters.forEach((param: H3.Yun.Filter) => {
    const field = schemas.find((schema: H3.Report.FieldColumn) => schema.schemaCode === param.schemaCode && schema.field === param.field);
   
    if (field) {
      filterItem = {
        field: JSON.parse(JSON.stringify(field)),
        formula: param.formula,
        text: param.value
      };
      globalFilters.push(filterItem);
    }
  });
  return globalFilters;
}
