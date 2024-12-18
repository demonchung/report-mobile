import { ElementType } from "../../enum/chart-type";
import { guid } from "@h3/report-mobile/basics/utils/uid.ts";
import Field from "@/pc/analysis/component/field";
import Vue from "vue";
import moment, { Moment } from 'moment';

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
    const schemaCode = item.associationCode;
    if (schemaCodes.includes(schemaCode)) {return;}
    const relationSchema = relationSchemas.find(
      (oRelation: H3.ReportAPI.Schema) => oRelation.schemaCode === schemaCode
    );
    if (relationSchema && !relation) {
      relationFields.push(...groupSchema(relationSchema, relationSchemas, item.displayName, true));
    }
    const field: H3.Report.FieldColumn = {
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
        associationCode: item.associationCode,
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
        options: {}
      };
    }
  );
  return fields;
};

/**
 * 转是展示透视表
 * @param chart
 */
const ifShowTable = (chart: H3.Report.Chart) => {
  return (
    [...chart.data.dimension, ...(chart.data.groupDimension as any)].filter((item: any) => item)
      .length && chart.data.metric.filter((item: any) => item.type).length
  );
};
/**
 * 处理数据
 * @param schemaModel 数据模型
 */
export const handleSchemaModal = (schemaModel: H3.ReportAPI.SchemaModel) => {
  relationFields = [];
  // schemaCodes = [];
  // let fields = groupSchema(schemaModel.schema, schemaModel.relationSchemas || []);
  let fields = getSchemaFields(schemaModel.schema);
  // 处理关联表/子表的字段集合
  if (
    schemaModel.relationFields &&
    schemaModel.relationFields.length &&
    schemaModel.relationSchemas &&
    schemaModel.relationSchemas.length
  ) {
    schemaModel.relationFields.forEach(item => {
      // schemaCodes.push(item.relSchemaCode);
      const schema = (schemaModel.relationSchemas as Array<H3.ReportAPI.Schema>).find(
        (field) => field.schemaCode === item.relSchemaCode,
      );
      if (schema) {
        const list = getSchemaFields(schema, item.mainFieldName, item.mainField, true);
        relationFields = relationFields.concat(list);
      }
    });
  }
  // 当没有关联关系时，处理关联表字段
  if((!schemaModel.relationFields || !schemaModel.relationFields.length) && schemaModel.relationSchemas &&
    schemaModel.relationSchemas.length) {
      schemaModel.relationSchemas.forEach((schema: H3.ReportAPI.Schema) => {
        const list = getSchemaFields(schema, null, null, true);
        relationFields = relationFields.concat(list);
      })
    }
  relationFields.sort((prvField: H3.Report.FieldColumn, nextField: H3.Report.FieldColumn) =>
    prvField.tableName.localeCompare(nextField.tableName)
  );
  fields = fields.concat(relationFields);
  return fields;
};
export const checkChartMethod = (chart) => {
  if (!chart) {return false;}
  // if (!(chart.typet === ElementType.FILTERPICKER
  //   || chart.typet === ElementType.IMAGE
  //   || chart.typet === ElementType.WEB
  //   || chart.typet === ElementType.LONGTEXT
  //   )) return
  switch (chart.type) {
    case `${ElementType.CARD}`:
    case `${ElementType.GAUGE}`:
    case `${ElementType.PROGRESSBAR}`:
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
 * 全局过滤器转换
 * @param filters
 */
export const transformFilter = (filters: Array<H3.Report.FilterPicker>) => {
  let globalFilters: Array<H3.Report.GlobalFilter> = [];
  globalFilters = filters.map(filter => {
    if (filter.field.type === "date") {
      changeFormat(filter);
    }
    return {
      uid: filter.uid ? filter.uid : guid(),
      title: filter.title,
      chartIds: filter.chartIds, // 图表ids
      dataSources: filter.dataSources, // 数据类型
      format: filter.format, // 筛选格式
      field: filter.field,
      formula: filter.formula, // 筛选公式
      text: filter.text, // 筛选文本
      filterLinkages:filter.filterLinkages, //筛选联动
      selectDateType: filter.selectDateType,  //筛选时间类型
      operation:filter.operation,
    };
  });
  return globalFilters;
};
  export function changeFormat(filter) {
    const format = {
      Date: [{old: "Date", new: "YMD"}],
      Month:[{old: "Month", new: "YM"}],
      Time: [{old: "Time", new: "YMDHM"}]
    } 
    const moments = {
      YMD: "YYYY-MM-DD",
      YMDHM: "YYYY-MM-DD HH:mm",
      YM: "YYYY-MM"
    }
    //兼容日期筛选旧数据问题
    if (["Date", "Month", "Time"].includes(filter.format) && !["Dynamic", "NotNone", "None"].includes(filter.formula)) {
      filter.format = format[filter.format][0].new;
      if (filter.field && filter.field.options) {
        filter.field.options.format = filter.format;
      }
      if (filter.dataSources && filter.dataSources.length) {
        filter.dataSources.forEach(item =>{
        if (item && item.field && item.field.options) { 
         item.field.options.format = filter.format;
        }
      });
      }
        filter.text.forEach((text,index) => {
          if (filter.text[index] === "") {
            filter.text[index] = "";
          } else {
            filter.text[index] = moment(text).format(moments[filter.format]);
          }
      });
    }
    //兼容动态筛选旧数据问题
    if (["Date", "Month", "Time"].includes(filter.format) && ["Dynamic", "NotNone", "None"].includes(filter.formula)) {
      filter.format = "YMD";
    }
    return filter;
   }


/**
 * 仪表盘跳转参数添加以及转换
*/
function jumpLinkTrans(sendChart: H3.Report.Chart){
  //不需要处理的图表
  const notIncludeChart = [ElementType.WEB, ElementType.IMAGE, ElementType.FILTERPICKER,ElementType.LONGTEXT,ElementType.TAB];
  const {type, styles } = sendChart;
  if(!notIncludeChart.includes(type) && styles){
    const jumpLink = styles.jumpLink ? JSON.stringify(styles.jumpLink || []) : '';
    return {
      jumpingRules: jumpLink,
    }
  }
}

/**
 * 转换保存单图表的数据结构
 */
export const transformPostCharts = (
  charts: Array<H3.Report.Chart | H3.Report.LongText | H3.Report.FilterPicker | H3.Report.Image | H3.Report.Tab>,
  state
): Array<H3.ReportAPI.PostChart> => {
  const postCharts: Array<any> = charts.map(item => {
    const position: H3.Report.ElementPosition = {
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      i: item.i
    };
    let data: any;
    let styles: any;
    if (item.type === ElementType.LONGTEXT) {
      data = { content: (item as H3.Report.LongText).content || "" };
      styles = "";
    } else if (item.type === ElementType.FILTERPICKER) {
      data = {
        chartIds: (item as H3.Report.FilterPicker).chartIds,
        dataSources: (item as H3.Report.FilterPicker).dataSources,
        format: (item as H3.Report.FilterPicker).format,
        formula: (item as H3.Report.FilterPicker).formula,
        field: (item as H3.Report.FilterPicker).field,
        text: (item as H3.Report.FilterPicker).text,
        filterLinkages:(item as H3.Report.FilterPicker).filterLinkages,
        selectDateType:(item as H3.Report.FilterPicker).selectDateType,  //筛选时间类型
        operation:(item as H3.Report.FilterPicker).operation,
      };
      styles = "";
    } else if(item.type === ElementType.IMAGE ||item.type === ElementType.WEB) {
      data = { 
        content: (item as H3.Report.Image).content || "",
        fileName: (item as H3.Report.Image).fileName,
        showMode: (item as H3.Report.Image).showMode || 'draw',
      };
    } else if(item.type === ElementType.TAB) {
      data = { 
        tabs: (item as H3.Report.Tab).tabs,
        visibleTitle: (item as H3.Report.Tab).visibleTitle,
      };
    } else  {
      data = (item as H3.Report.Chart).data;
      styles = (item as H3.Report.Chart).styles;
    }
    // 添加下钻用的parentUid
    if (item.parentUid) {
      data.parentUid = item.parentUid;
    }
    if (item.layerTitle) {
      data.layerTitle = item.layerTitle;
    }
    if ((item as H3.Report.Chart).relations) {
      data.relations = (item as H3.Report.Chart).relations;
    }
    if ((item as H3.Report.Chart).dynamicParams) {
      data.dynamicParams = (item as H3.Report.Chart).dynamicParams;
    }
    //这儿做数据保存处理
    const jumpLinkSendData = jumpLinkTrans(item as H3.Report.Chart)
    // delete styles.jumpLink;
    console.log(JSON.stringify((item as H3.Report.Chart).customSort || {}))

    const notIncludeChart = [ElementType.WEB, ElementType.IMAGE, ElementType.FILTERPICKER,ElementType.LONGTEXT,ElementType.TAB];
    if (notIncludeChart.includes(item.type)) {
      item.conditionFormats = [];
    }
    return {
      authorization: item.authorization,
      content: "",
      corpId: state.corpId,
      data: JSON.stringify(data),
      customSort: JSON.stringify((item as H3.Report.Chart).customSort || {}),
      dataSourceId: item.dataSourceId,
      deleteStatus: 0,
      objectId: state.objectId,
      position: JSON.stringify(position),
      styles: JSON.stringify(styles),
      title: item.title,
      mobileOptions: JSON.stringify((item as H3.Report.Chart).mobileOptions || {}),
      type: item.type,
      useType: item.useType,
      uuid: item.uid,
      ...jumpLinkSendData,
      formulas: JSON.stringify(item.formulas || null),
      conditionFormats: JSON.stringify(item.conditionFormats || []),
      mainTable: item.mainTable
    };
  });

  return postCharts;
};
