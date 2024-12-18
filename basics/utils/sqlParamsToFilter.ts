
import data from "@h3/report-mobile/basics/element-wrap/data";
import { guid } from "@h3/report-mobile/basics/utils/uid";
/**
 * sqlParams对象转换为filter对象
 */
function sqlParamsToFilter(sqlParams: H3.Report.SqlParam, dataSource) {
  const relation = sqlParams.options && sqlParams.options.relation ? sqlParams.options.relation : null;
  const filter: H3.Report.GlobalFilter = {
    uid: guid(),
    title: "",
    chartIds: [], // 图表ids
    dataSources: [], // 数据类型
    format: "", // 筛选格式
    formula: "", // 筛选公式
    text: [] // 筛选文本
  }

  const field: any = {
    dataType: sqlParams.dataType,
    field: sqlParams.field,
    mainField: '',
    name: sqlParams.name,
    needAlias: false,
    options: {},
    schemaCode: relation && relation.schemaCode? relation.schemaCode: '',
    tableId: relation && relation.tableCode? relation.tableCode: '',
    tableName: relation && relation.schemaName? relation.schemaName: '',
    type: sqlParams.type,
    relation: relation? true: false,
  }
  if (dataSource) {
    filter.dataSources.push({
      dataSourceId: dataSource.dataSourceId,
      displayName: dataSource.displayName,
      field: field,
      sqlParams: 1
    });
  }
  filter.field = field;
  filter.format = sqlParams.options && sqlParams.options.format? sqlParams.options.format: '';
  filter.formula = sqlParams.operator;
  filter.operation = sqlParams.operation;
  filter.text = sqlParams.values;
  filter.title = sqlParams.name;
  return filter;
}

/**
 * filter对象转换为sqlParams对象
 */
function filterToSqlParams(filter: H3.Report.GlobalFilter) {
  if (!filter.field) return null;
  const sqlParams: H3.Report.SqlParam = {
    dataType: filter.field.dataType,
    field: filter.field.field,
    name: filter.title ? filter.title: filter.field.name,
    operator: filter.formula,
    operation: filter.operation,
    type: filter.field.type,
    values: filter.text
  }
  if (filter.format) {
    sqlParams.options = {
      format: filter.format
    }
  }
  if (filter.field.options && filter.field.options.format) {
    sqlParams.options = {
      format: filter.field.options.format
    }
  }
  if (filter.field.relation) {
    if (!sqlParams.options) {
      sqlParams.options = {};
    }
    sqlParams.options.relation = {
      schemaCode: filter.field.schemaCode,
      schemaName: filter.field.tableName,
      tableCode: filter.field.tableId,
      fieldCode: '',
      fieldName: ''
    }
  }
  return sqlParams;
}

export default {
  sqlParamsToFilter,
  filterToSqlParams
};
export { sqlParamsToFilter, filterToSqlParams };
