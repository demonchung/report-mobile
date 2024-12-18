import { TabState } from "@h3/report-mobile/basics/enum/module-state";
import { createNewChart } from "../../instance/element-modules/analysis/create-chart";
import { uuid } from "@h3/report-mobile/basics/utils/uid";
import options from "@h3/report-mobile/dist/options";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { NumberType, StringType } from "@h3/report-mobile/basics/enum/aggregate-type-ds";

/**
 * 处理返回数据
 * @param report
 */
export const handleAnalysisResponse = (report: H3.AnalysisAPI.reportInfo) => {
  const elements: Array<H3.Report.Chart> = [];
  const chartsInfo: { [key: string]: any } = {};
  if (report.charts && report.charts.length) {
    report.charts.forEach((chart: any) => {
      let element: H3.Report.Chart = chart.content;
      let chartInfo: H3.Analysis.ChartInfo = {};
      chartInfo = Object.assign(
        {
          updateDate: chart.updateDate,
          updateUser: chart.updateUser,
          updateUserName: chart.updateUserName
        },
        chart.ownerChartInfo ? chart.ownerChartInfo : {}
      );
      chartsInfo[element.uid] = chartInfo;
      element = createNewChart(element.type, element) as H3.Report.Chart;
      elements.push(element);
    });
  }
  return {
    objectId: report.objectId,
    elements,
    reqGlobal: report.global.trim(),
    share: report.shareStatus,
    chartsInfo
  };
};

let relationFields: Array<H3.Report.FieldColumn> = [];
let schemaCodes: Array<string> = [];
/**
 * 数据分组
 * @param schema 表数据
 * @param relationSchemas 关联表数据
 * @param tableName  显示表名称
 * @param relation  是否关联表
 */
const groupSchema = (
  schema: H3.ReportAPI.Schema,
  relationSchemas: Array<H3.ReportAPI.Schema>,
  tableName: string | null = null,
  relation = false
) => {
  const fields: Array<H3.Report.FieldColumn> = [];
  schemaCodes.push(schema.schemaCode);
  schema.properties.forEach((item: H3.ReportAPI.Properties) => {
    const schemaCode = item.associationCode || item.name;
    if (schemaCodes.includes(schemaCode)) {
      return;
    }
    const relationSchema = relationSchemas.find(
      (oRelation: H3.ReportAPI.Schema) => oRelation.schemaCode === schemaCode
    );
    if (relationSchema) {
      relationFields.push(...groupSchema(relationSchema, relationSchemas, item.displayName, true));
    }
    const field: H3.Report.FieldColumn = {
      uid: "",
      schemaCode: schema.schemaCode,
      tableName: tableName || schema.displayName,
      tableId: schema.tableName,
      field: item.name,
      name: item.displayName,
      dataType: item.dataType,
      specialType: item.specialType || "",
      visible: item.visible,
      type: item.type.toLocaleLowerCase(),
      alias: "",
      needAlias: item.needAlias,
      relation,
      options: {}
    };
    fields.push(field);
  });
  return fields;
};

/**
 * 转换原始字段为前端通用字段
 * @param schema 表数据
 * @param tableName 表名
 * @param mainField 关联字段的标识
 * @param relation  是否关联表
 */
const getSchemaFields = (
  schema: H3.ReportAPI.Schema,
  tableName: string | null = null,
  mainField: string | null = null,
  relation = false
) => {
  const fields: Array<H3.Report.FieldColumn> = schema.properties.map(
    (item: H3.ReportAPI.Properties) => {
      return {
        uid: "",
        schemaCode: schema.schemaCode,
        tableName: tableName || schema.displayName,
        parentSchemaCode: schema.parentSchemaCode,
        tableId: schema.tableName,
        field: item.name,
        name: item.displayName,
        dataType: item.dataType,
        visible: item.visible,
        primaryKey: item.primaryKey,
        specialType: item.specialType || "",
        type: item.type.toLocaleLowerCase(),
        alias: "",
        needAlias: item.needAlias,
        relation,
        mainField: mainField || "",
        options: {},
        status: item.status
      };
    }
  );
  return fields;
};
/**
 * 处理数据
 * @param schemaModel 数据模型
 */
export const handleSchemaModal = (schemaModel: H3.ReportAPI.SchemaModel) => {
  relationFields = [];
  schemaCodes = [];
  let fields = getSchemaFields(schemaModel.schema);
  // 处理关联表/子表的字段集合
  if (
    schemaModel.relationFields &&
    schemaModel.relationFields.length &&
    schemaModel.relationSchemas &&
    schemaModel.relationSchemas.length
  ) {
    schemaModel.relationFields.forEach(item => {
      if (!schemaCodes.includes(item.relSchemaCode)) {
        schemaCodes.push(item.relSchemaCode);
        const schema = (schemaModel.relationSchemas as Array<H3.ReportAPI.Schema>).find(
          field => field.schemaCode === item.relSchemaCode
        );
        if (schema) {
          const list = getSchemaFields(schema, item.mainFieldName, item.mainField, true);
          relationFields = relationFields.concat(list);
        }
      }
    });
  }
  relationFields.sort((prvField: H3.Report.FieldColumn, nextField: H3.Report.FieldColumn) =>
    prvField.tableName.localeCompare(nextField.tableName)
  );
  fields = fields.concat(relationFields);
  return fields;
};

/**
 * 处理过滤条件
 */
export function handleFilters(
  schemas: Array<H3.Report.FieldColumn>,
  filters: Array<H3.Yun.Filter>
): Array<H3.Report.FilterFieldColumn> {
  const globalFilters: Array<H3.Report.FilterFieldColumn> = [];
  let filterItem: H3.Report.FilterFieldColumn;
  filters.forEach((param: H3.Yun.Filter) => {
    const field = schemas.find(
      (schema: H3.Report.FieldColumn) =>
        schema.schemaCode === param.schemaCode && schema.field === param.field
    );
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

/**
 * 递归处理过滤条件--匹配字段
 * @param filter 过滤条件可能含ands和ors
 * @param schemas 数据源字段
 */
function processFilter(filter: H3.Yun.Filter, schemas: Array<H3.Report.FieldColumn>) {
  const field = schemas.find(
    (schema: H3.Report.FieldColumn) =>
      schema.schemaCode === filter.schemaCode && schema.field === filter.field
  );
  // 如果没有找到字段，就必须有ands或ors数组, 且数组有值, 否则返回null
  if (
    !field &&
    (!filter.ands || filter.ands.length === 0) &&
    (!filter.ors || filter.ors.length === 0)
  ) {
    return null;
  }

  const filterItem: H3.Report.FilterFieldColumn = {
    field: field ? JSON.parse(JSON.stringify(field)) : null,
    formula: filter.formula,
    text: filter.value,
    ands: [],
    ors: []
  };

  if (filter.ands && filter.ands.length > 0) {
    filter.ands.forEach((andFilter: H3.Yun.Filter) => {
      const andFilterItem = processFilter(andFilter, schemas);
      if (andFilterItem) {
        if (!filterItem.ands) {
          filterItem.ands = [];
        }
        filterItem.ands.push(andFilterItem);
      }
    });
  }

  if (filter.ors && filter.ors.length > 0) {
    filter.ors.forEach((orFilter: H3.Yun.Filter) => {
      const orFilterItem = processFilter(orFilter, schemas);
      if (orFilterItem) {
        if (!filterItem.ors) {
          filterItem.ors = [];
        }
        filterItem.ors.push(orFilterItem);
      }
    });
  }

  return filterItem;
}
/**
 * 处理过滤条件 -- 根据信息匹配字段
 * @param schemas 数据源
 * @param filters 外部传入的过滤条件
 */
export function handleFilterStructure(
  schemas: Array<H3.Report.FieldColumn>,
  filters: Array<H3.Yun.Filter>
): Array<H3.Report.FilterFieldColumn> {
  const globalFilters: Array<H3.Report.FilterFieldColumn> = [];
  filters.forEach((filter: H3.Yun.Filter) => {
    const filterItem = processFilter(filter, schemas);
    if (filterItem) {
      globalFilters.push(filterItem);
    }
  });
  return globalFilters;
}

/**
 * 处理图表字段同步数据源的字段默认值
 * @param elements
 * @param dataSources
 */
export function handleChartFieldDefaultValues(
  elements: H3.Report.Chart[],
  dataSources: { [dataSourceId: string]: H3.Report.DataSource }
) {
  elements.forEach((element: H3.Report.BaseElement) => {
    const chart = element as H3.Report.Chart;
    const chartData: H3.Report.ChartDataGroup = chart.data;
    const chartFields: H3.Report.FieldColumn[] = [];
    if (chart.dataSourceId && dataSources[chart.dataSourceId]) {
      const dataSourceFields: H3.Report.FieldColumn[] = dataSources[chart.dataSourceId].properties;
      if (chartData.dimension && chartData.dimension.length) {
        chartFields.push(...chartData.dimension);
      }
      if (chartData.groupDimension && chartData.groupDimension.length) {
        chartFields.push(...chartData.groupDimension);
      }
      if (chartData.metric && chartData.metric.length) {
        chartFields.push(...chartData.metric);
      }
      if (chartData.sort && chartData.sort.length) {
        chartFields.push(...chartData.sort);
      }
      if (chartData.metricGroup && chartData.metricGroup.length) {
        chartData.metricGroup.forEach((metric: H3.Report.FieldColumn[]) => {
          chartFields.push(...metric);
        });
      }
      if (chartData.filter && chartData.filter.length) {
        chartData.filter.forEach((filter: H3.Report.FilterFieldColumn) => {
          if (filter instanceof Array) {
            if (filter && filter.length) {
              filter.forEach(f => {
                chartFields.push(f.field);
              });
            }
          } else {
            chartFields.push(filter.field);
          }
        });
      }
      dataSourceFields.forEach((dataSourceField: H3.Report.FieldColumn) => {
        chartFields.forEach((chartField: H3.Report.FieldColumn, index: number) => {
          if (
            chartField.field === dataSourceField.field &&
            chartField.schemaCode === dataSourceField.schemaCode
          ) {
            Object.assign(chartField, dataSourceField, {
              uid: chartField.uid,
              alias: chartField.alias,
              options: chartField.options
            });
          }
        });
      });
    }
  });
}

/**
 * 获取完数据源之后处理全局筛选器
 * @param globalFilter
 * @param dataSources
 */
export function handleGlobalFilter(
  globalFilter: Array<H3.Report.FilterFieldColumn>,
  dataSources: H3.Report.DataSource
) {
  // 过滤掉数据源中不存在的字段
  return globalFilter.filter(i => {
    return dataSources.properties.find(d => {
      return d.schemaCode === i.field.schemaCode && d.field === i.field.field;
    });
  });
}
/**
 * 校验表格类图表维度指标是否符合要求
 * @param chart
 */
const ifShowTable = (chart: H3.Report.Chart) => {
  return (
    [...chart.data.dimension, ...(chart.data.groupDimension as any)].filter((item: any) => item)
      .length && chart.data.metric.filter((item: any) => item.type).length
  );
};

/**
 * 检验图表参数是否可以成功渲染
 * @param chart 转换后的图表实例
 */
const checkChart = (chart: H3.Report.Chart) => {
  if (!chart) {
    return false;
  }
  // 检验图表类型是否支持
  const allowTypes = [
    ElementType.BAR,
    ElementType.PILEBAR,
    ElementType.STRIPE,
    ElementType.LINE,
    ElementType.CARD,
    ElementType.PIE,
    ElementType.MAP
  ];
  if (!allowTypes.includes(chart.type)) {
    return false;
  }
  // 维度字段不能是数字类型
  if (chart.data.dimension.some(item => item.type === "number")) {
    return false;
  }
  //地址字段只能用于地图
  if (chart.type === ElementType.MAP) {
    if (
      !chart.data.dimension.every(item => item.type === "address" || item.specialType === "address")
    ) {
      return false;
    }
  } else {
    if (
      chart.data.dimension.some(item => item.type === "address" || item.specialType === "address")
    ) {
      return false;
    }
  }
  // 暂时不支持多维度
  if (chart.data.dimension.length && chart.data.dimension.length > 1) {
    return false;
  }
  // 检验图表类型维度指标数量是否符合
  switch (chart.type) {
    case `${ElementType.CARD}`:
    case `${ElementType.PROGRESSBAR}`:
    case `${ElementType.GAUGE}`:
      return chart.data.metric.length;
    case `${ElementType.TABLE}`:
    case `${ElementType.CROSSTABLE}`:
      return ifShowTable(chart);
    case `${ElementType.LIST}`:
      return chart.data.dimension.length;
    case `${ElementType.SCATTER}`:
      return chart.data.dimension.length && chart.data.metric.length > 1;
    case `${ElementType.BIAX}`:
      return chart.data.dimension.length && chart.data.metricGroup.every(i => i.length > 0);
    default:
      return chart.data.dimension.length && chart.data.metric.length;
  }
};

/**
 * @param resData AI返回图表数据
 * @param dataSourceId 数据源ID
 * 转化组件数据·结构
 */
const handleAIChartStructure = (resData, dataSourceId, dataSources) => {
  // 创建新的图表组件实例
  const element = createNewChart(resData.chartType || ElementType.BAR) as H3.Report.Chart;
  // 设置图表组件数据源ID
  element.dataSourceId = dataSourceId;
  if (resData.title) {
    element.title = resData.title;
  }
  // 从表结构中获取字段属性，创建新的指标--维度实例
  if (resData.dimension && resData.dimension.length) {
    const dimension: any = [];
    resData.dimension.forEach(item => {
      const field = createDMField(item, "dimension", dataSources);
      if (field) {
        dimension.push(field);
      }
    });
    element.data.dimension = dimension;
  }
  if (resData.metric && resData.metric.length) {
    const metric: any = [];
    resData.metric.forEach(item => {
      const field = createDMField(item, "metric", dataSources);
      if (field) {
        metric.push(field);
      }
    });
    element.data.metric = metric;
    const hasMetricSort = element.data.metric.some(
      mfield => mfield && mfield.options && mfield.options.order
    );
    // 因维度指标排序互斥,所以当生成的图表类型中,指标含排序时,将维度的排序字段清除
    if (hasMetricSort) {
      element.data.dimension.forEach(dfield => {
        if (dfield && dfield.options && dfield.options.order) {
          delete dfield.options.order;
        }
      });
    }
  }
  // 设置图表排序字段
  if (element.data.metric.length > 0) {
    if (!element.data.sort) {
      element.data.sort = [];
    }
    element.data.metric.forEach(mfield => {
      if (mfield.options.order) {
        element.data.sort.push(mfield);
      }
    });
  }
  if (element.data.dimension.length > 0) {
    if (!element.data.sort) {
      element.data.sort = [];
    }
    element.data.dimension.forEach(dfield => {
      if (dfield.options.order) {
        element.data.sort.push(dfield);
      }
    });
  }

  return element;
};

/**
 *
 * @param resField 根据AI返回的字段(不标准字段), 从数据源中获取标准字段数据, 并创建新的指标--维度实例
 * @param dataSources 数据源 --表结构
 */
const createDMField = (resField, moduleKey, dataSources) => {
  let result;
  if (dataSources.properties && dataSources.properties.length) {
    // 对象数组中找到包含特定值的 name 属性的对象，而且希望对中文、数字和英文进行不区分大小写的匹配
    const searchValue = resField.name;
    // 创建正则表达式进行模糊匹配
    const regex = new RegExp(searchValue, "i");
    // 从表结构中获取字段属性,目前仅支持到主表
    const originalField: H3.Report.FieldColumn = dataSources.properties.find(
      (obj: H3.Report.FieldColumn) => {
        const nameMatch = regex.test(obj.name);
        return nameMatch && !obj.mainField && obj.visible;
      }
    );
    let field = JSON.parse(JSON.stringify(originalField));
    if (field) {
      if (!field.uid) {
        field.uid = uuid(8, 16);
      }
      if (moduleKey === "metric") {
        let tmpField: any = null;
        // 判断字段格式设置有没有默认值，有就使用默认值
        if (options.fieldsOptions && options.fieldsOptions.length) {
          tmpField = options.fieldsOptions.find(item => {
            return item.schemaCode === field.schemaCode && item.field === field.field;
          });
        }
        if (tmpField && !field.options.numberFormat) {
          const numberFormat = tmpField.numberFormat || {};
          field.options.numberFormat = {
            comma: numberFormat.comma ? numberFormat : false,
            percent: numberFormat.percent ? numberFormat.percent : false,
            fraction: numberFormat.fraction ? numberFormat.fraction : null
          };
        } else {
          if (!field.options.numberFormat) {
            field.options.numberFormat = {
              comma: false,
              percent: false,
              fraction: null
            };
          }
        }
      }
      if (resField.sort) {
        field.options.order = resField.sort;
      }
      switch (field.type) {
        case "string":
          if (moduleKey === "metric") {
            field.options.aggregateType =
              resField.format && checkAggregateType(field.type, resField.format)
                ? resField.format
                : "COUNT";
          }
          break;
        case "date":
          if (moduleKey === "metric") {
            field.options.aggregateType =
              resField.format && checkAggregateType(field.type, resField.format)
                ? resField.format
                : "COUNT";
          } else {
            field.options.format = resField.format ? resField.format : "Y";
          }
          break;
        case "number":
          field.options.aggregateType =
            resField.format && checkAggregateType(field.type, resField.format)
              ? resField.format
              : "SUM";
          break;
        default:
          break;
      }
      return field;
    }
  }
  return result;
};

/**
 * 返回当前维度指标汇总方式是否符合字段类型应有的汇总方式
 * @param fieldType 字段类型
 * @param aggregateType 汇总方式
 */
const checkAggregateType = (fieldType, aggregateType) => {
  let result = false;
  if (fieldType) {
    switch (fieldType) {
      case "string":
        result = [StringType.COUNT, StringType.COUNTDISTINCT].includes(aggregateType);
        break;
      case "date":
        result = [StringType.COUNT, StringType.COUNTDISTINCT].includes(aggregateType);
        break;
      case "number":
        result = [
          NumberType.AVG,
          NumberType.COUNT,
          NumberType.COUNTDISTINCT,
          NumberType.MAX,
          NumberType.MIN,
          NumberType.SUM
        ].includes(aggregateType);
        break;
      default:
        break;
    }
  }
  return result;
};
