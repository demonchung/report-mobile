import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { getUrlNodeId } from "@h3/report-mobile/basics/utils/url";
import { filterToSqlParams } from "@h3/report-mobile/basics/utils/sqlParamsToFilter";

/**
 * 图表所用字段
 * @param chart
 * @param includeGlobal  是否需要包含全局筛选器以及下钻等
 * @param obviateFormulas 是否需要排除计算公式字段，图表配置时两张表关联同一张表，则两表的字段不可共用，计算字段同理
 */
function getChartFields(chart, includeGlobal = true, obviateFormulas = false) {
  if (!chart) {return;}
  const chartData: H3.Report.ChartDataGroup = chart.data;
  const chartFields: H3.Report.FieldColumn[] = [];
  if (chart.dataSourceId) {
    if (includeGlobal) {
      if (chart.filterPicker && Object.values(chart.filterPicker).length) {
        Object.values(chart.filterPicker).forEach((filters: any) => {
          filters.forEach(filter => {
            chartFields.push(filter.field);
          });
        });
      }
      if (chart.linkageFilter) {
        chart.linkageFilter.forEach(item => item && chartFields.push(item.field));
      }
      if (chart.layerFilter) {
        chart.layerFilter.forEach(item => item && chartFields.push(item.field));
      }
    }
    if (chartData.dimension && chartData.dimension.length) {
      chartFields.push(...chartData.dimension);
    }
    if (chartData.groupDimension && chartData.groupDimension.length) {
      chartFields.push(...chartData.groupDimension);
    }
    if (chartData.metric && chartData.metric.length) {
      chartData.metric.forEach(item => {
        const targetValue = item.options.targetValue;
        if (targetValue && targetValue.valueType === "dynamic" && targetValue.field) {
          const fieldUid = targetValue.field.uid;
          if (!chartData.metric.some(m => m.uid === fieldUid)) {
            chartFields.push(targetValue.field);
          }
        }
      });
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
          if (filter.length) {
            filter.forEach(item =>{ chartFields.push(item.field); });
          }
        } else {
          chartFields.push(filter.field);
        }
      });
    }
  }
  // console.log(18)
  // if (!obviateFormulas) {
  //   let chartFormulas : any;
  //   if(!chart.formulas) {
  //     chartFormulas = [];
  //   } else {
  //     chartFormulas = JSON.parse(JSON.stringify(chart.formulas));
  //   }
  //   if (chartFormulas && chartFormulas.length) {
  //     chartFormulas.forEach(formula => {
  //       if (formula.fields && formula.fields.length) {
  //         formula.fields.forEach(field =>{
  //           chartFields.push(field);
  //         })
  //       }
  //     })
  //   }
  // }
 // 计算字段用了关联表的字段，需要把关联表的字段也加进来
  if (chartFields && chartFields.length && chart.formulas && chart.formulas.length) {
    let fieldInFormula = [];
    chartFields.forEach(field => {
      if (field && field.options && field.options.isComputeField) {
        const comfield = chart.formulas.find((item) => item.id === field.field);
        if (comfield && comfield.fields && comfield.fields.length) {
          fieldInFormula = fieldInFormula.concat(comfield.fields);
        }
      }
    });
    if (fieldInFormula && fieldInFormula.length) {
      fieldInFormula.forEach((field: any) => {
        const isSame = chartFields.find(
          (item) =>
            item.field === field.field &&
            item.mainField === field.mainField &&
            item.tableId === field.tableId,
        );
        if (!isSame) {
          chartFields.push(field);
        }
      })
    }
  }
  return chartFields;
}

/**
 * 获取图表关联关系
 * @param element
 * @param relations
 */
function getElementRelation(element: H3.Report.Chart, relations): { [key: string]: any } {
  const chart = element as H3.Report.Chart;
  const chartFields: H3.Report.FieldColumn[] = getChartFields(chart);
  const mapping: { [key: string]: any } = {};
  if (relations && relations.length) {
    chartFields.forEach((chartField: H3.Report.FieldColumn, index: number) => {
      if (chartField.mainField && !mapping[chartField.mainField]) {
        const resItem = relations.find((item) => item.relSchemaCode === chartField.schemaCode);
        if (resItem) {
          mapping[chartField.mainField] = resItem.relations;
        }
      }
    });
  }
  return mapping;
}
/**
 * 处理图表字段同步数据源的字段默认值
 * @param elements
 * @param relations
 */
function handleRelationFields(elements, relations) {
  elements.forEach((element: H3.Report.BaseElement) => {
    if (
      ![
        ElementType.LONGTEXT,
        ElementType.FILTERPICKER,
        ElementType.IMAGE,
        ElementType.WEB
      ].includes(element.type)
    ) {
      const chartFields: H3.Report.FieldColumn[] = getChartFields(element);
      if (relations && relations.length) {
        let mapping: { [key: string]: any } = {};
        chartFields.forEach((chartField: H3.Report.FieldColumn, index: number) => {
          if (chartField.mainField && !mapping[chartField.mainField]) {
            const resItem = relations.find(
              (item) =>
                item.relSchemaCode === chartField.schemaCode &&
                item.mainField === chartField.mainField
            );
            if (resItem) {
              mapping[chartField.mainField] = resItem.relations;
            }
          }
        });
        (element as H3.Report.Chart).relations = [].concat(...Object.values(mapping));
      }
    }
  });
}

function handleSort(sort) {
  if (sort && sort.length) {
    return sort.filter(e => e.options.order !== "custom");
  }
  return sort;
}
/**
 * 处理图表请求后台参数
 * @param chart
 * @param params
 * @param externalFilters // 外部传入的筛选器
 * @param dataSources 数据源
 * @param globalFilters 全局筛选器
 */
function handleChartRequestParams(
  chart: H3.Report.Chart,
  params?: any,
  externalFilters?: Array<H3.Report.FilterFieldColumn>,
  dataSources: { [dataSourceId: string]: any } = {},
  globalFilters?: Array<H3.Report.GlobalFilter>
): H3.ReportAPI.Chart {
  const oChart: H3.Report.Chart = JSON.parse(JSON.stringify(chart));
  // handleRelationFields();
  // 如果有全部的关联关系, 拿所有关联关系去过滤,否则拿chart本身的relations
  if (oChart && dataSources[(oChart as any).dataSourceId]) {
    handleRelationFields([oChart], dataSources[(oChart as any).dataSourceId].relationsFields);
  } else {
    oChart.relations = oChart.relations ? oChart.relations : null;
  }

  if (oChart.type === "list" || oChart.type === "crosstable") {
    oChart.pageSize =
      oChart.data.pageSet && oChart.data.pageSet.size ? oChart.data.pageSet.size : 10;
    oChart.pageIndex = oChart.pageIndex ? oChart.pageIndex : 1;
  }
  if (oChart.type === "progressBar" || oChart.type === "gauge") {
    // 进度图、仪表盘，将目标值的字段放到指标中一起请求
    const metric = oChart.data.metric;
    oChart.data.metric.forEach(item => {
      const targetValue = item.options.targetValue;
      if (targetValue && targetValue.valueType === "dynamic" && targetValue.field) {
        const fieldUid = targetValue.field.uid;
        if (!metric.some(m => m.uid === fieldUid)) {
          metric.push(targetValue.field);
        }
      }
    });
    oChart.data.metric = metric;
  }
  const dataFilter = changeGroupFilter(oChart.data.filter);
  //todo 转换chart.data.filter
  let sendChart: H3.ReportAPI.Chart = {
    title: oChart.title,
    id: oChart.uid,
    authorization: oChart.authorization,
    dataSourceId: oChart.dataSourceId,
    useType: oChart.useType,
    type: oChart.type as any,
    dimension: oChart.data.dimension,
    groupDimension: oChart.data.groupDimension,
    dynamicParams: getDyList(oChart.dynamicParams),
    metric: oChart.data.metric,
    filter: dataFilter,
    sort: oChart.data.sort,
    limit: oChart.data.limit,
    pageSize: oChart.pageSize,
    pageIndex: oChart.pageIndex,
    relations: oChart.relations || null,
    mainTable: oChart.mainTable || '',
    options: {}
  };
  if (oChart.data && oChart.data.filterNone !== undefined) {
    sendChart.filterNone = oChart.data.filterNone;
  }
  if (oChart.type === "list") {
    sendChart.filter = [...(sendChart.filter || []), ...(oChart.data.innerFilter || [])];
  } else {
    sendChart.having = oChart.data.innerFilter;
  }

  if (params) {
    Object.assign(sendChart, params);
  }
  if (oChart.type === "map") {
    if (!sendChart.options.map) {sendChart.options.map = {};}
    if (oChart.data && oChart.data.mapArea) {
      sendChart.options.map.mapArea = oChart.data.mapArea;
    }
    if (params) {
      Object.assign(sendChart.options.map, params);
    }
    delete (sendChart as any).mapDrill;
  }

  if (oChart.type === "crosstable") {
    delete (sendChart as any).colPageSize;
    delete (sendChart as any).colPageIndex;
    sendChart.options.cross = {
      pageSize:
        oChart.data.pageSet && oChart.data.pageSet.rowSize ? oChart.data.pageSet.rowSize : 10,
      pageIndex: params && params.colPageIndex ? params.colPageIndex : 1
    };
    sendChart.options.cross.crossSummary = handleCrossSummary(oChart.data.crossSummary);
    if (oChart.data && oChart.data.moreOrderNumber) {
      sendChart.options.cross.serialDimIds = oChart.data.moreOrderNumber.checked
        ? oChart.data.moreOrderNumber.uids
        : [];
    }
  }

  if (oChart.data.metricGroup && oChart.data.metricGroup.length) {
    // todo: 可能不兼容 IE11 和 edge
    let realMetric: Array<H3.Report.FieldColumn> = [];
    oChart.data.metricGroup.forEach(m => {
      realMetric = [...realMetric, ...m];
    });
    sendChart.metric = realMetric;
  }
  if (externalFilters) {
    sendChart.filter = [...(sendChart.filter || []), ...externalFilters];
  }

  const dataSource = dataSources[(oChart as any).dataSourceId];
  const {sqlParams, filterPickers} = removeFilterWithSqlParams(globalFilters, oChart.filterPicker, sendChart.dataSourceId);
  if (sqlParams && sqlParams.length) {
    sendChart.sqlParams = sqlParams;
    //1.如果sqlParams中的对象values为空数组，则通过field从dataSources的sqlParams中获取整个对象-->SQL原始值
    //2.如果dataSources的对象有relation属性，则将relation属性赋值给sqlParams中的对象

    // 当全局筛选器的值为空时，filterPickers中的值不包含空值，而动态参数必须有值, 所以需要将dataSources中的动态参数赋值给sqlParams
    if (dataSource && dataSource.sqlParams && dataSource.sqlParams.length) {
      const sqlParamsField = sqlParams.map((item) => item.field);
      const dataSourceSqlParams = dataSource.sqlParams.filter((item) => !sqlParamsField.includes(item.field));
      sendChart.sqlParams = sendChart.sqlParams.concat(dataSourceSqlParams);
    }
    
    sendChart.sqlParams.forEach((sqlParam: H3.Report.SqlParam) => {
      const dataSourceSqlParam = dataSource.sqlParams.find((item) => item.field === sqlParam.field);
      if (dataSourceSqlParam) {
        let checkEmpty = false;
        if (!['None', 'NotNone'].includes(sqlParam.operator)) {
          switch (sqlParam.type) {
            case 'date':
            case 'string':
              checkEmpty = !sqlParam.values || sqlParam.values.length === 0 || !sqlParam.values[0];
              break;
            case 'number':
              if (sqlParam.operator === 'Range') {
                checkEmpty = !sqlParam.values || sqlParam.values.length !== 2 || !sqlParam.values[0] || !sqlParam.values[1];
                if (!checkEmpty) {
                  sqlParam.values.sort((a, b) => Number(a) - Number(b));
                  sqlParam.values = sqlParam.values.map((e) => parseFloat(e).toString());
                }
              } else {
                checkEmpty = !sqlParam.values || sqlParam.values.length === 0 || !sqlParam.values[0];
                if (!checkEmpty) {
                  sqlParam.values[0] = parseFloat(sqlParam.values[0]).toString();
                }
              }
              break;
            default:
              break;
          }
          
          if (checkEmpty) {
            Object.assign(sqlParam, dataSourceSqlParam);
          }
        }

        if (dataSourceSqlParam.options && dataSourceSqlParam.options.relation) {
          if (!sqlParam.options) {
            sqlParam.options = {};
          }
          sqlParam.options.relation = dataSourceSqlParam.options.relation;
        }
      }

      sqlParam.values = sqlParam.values.map((item: any) => {
        if (item instanceof Object) {
          return item.value;
        }
        return item;
      });
    });

  } else {
    if (dataSource && dataSource.sqlParams && dataSource.sqlParams.length) {
      sendChart.sqlParams = JSON.parse(JSON.stringify(dataSource.sqlParams));
      (sendChart.sqlParams as any).forEach((sqlParam: H3.Report.SqlParam) => {
        sqlParam.values = sqlParam.values.map((item: any) => {
          if (item instanceof Object) {
            return item.value;
          }
          return item;
        });
      });
    }
  }
  

  if (sendChart.filter) {
    try {
      let layerFilter: any = [];
      if (chart.layerFilter) {
        layerFilter = chart.layerFilter.filter(item => item);
      }
      sendChart.filter = JSON.parse(
        JSON.stringify(
          sendChart.filter.concat(
            chart.linkageFilter || [],
            layerFilter,
            ...Object.values(filterPickers || {})
          )
        )
      ) as H3.Report.FilterFieldColumn[];
    } finally {
      sendChart.filter.forEach((filter: H3.Report.FilterFieldColumn) => {
         if (!(filter instanceof Array)) {  
          filter.text = filter.text.map((item: any) =>
            item instanceof Object ? item.value : item
          );
        }
      });
    }
  }
  if (sendChart.having) {
    sendChart.having.forEach((filter: H3.Report.FilterFieldColumn) => {
      filter.text = filter.text.map((item: any) => (item instanceof Object ? item.value : item));
    });
  }

  const checkFormulas = checkCompute(sendChart, oChart);
  if (checkFormulas.length) {
    sendChart.options.formulas = checkFormulas;
  }
  getComputedFieldFormula(sendChart,oChart);

  if (sendChart.filter && sendChart.filter.length && oChart.formulas && oChart.formulas.length) {
    sendChart.filter.forEach(f =>{
      let hasSame = 0;
      if (sendChart.options && sendChart.options.formulas && sendChart.options.formulas.length) {
        sendChart.options.formulas.forEach(item =>{
          if (f && !(f instanceof Array)) {
            if (item && f && f.field && item.id === f.field.field) {
            hasSame++;
          }
          }
        })
      }
      if (hasSame === 0 && oChart.formulas && oChart.formulas.length && f && f.field) {
        const newFormula = oChart.formulas.find((item) => item.id === f.field.field);
        if (!sendChart.options.formulas) {sendChart.options.formulas = [];}
        if (newFormula) {
          sendChart.options.formulas.push(newFormula);
        }
      }
      
    });
  }
  jumpLinkHandle(sendChart);
  //需要如果是跳转的需要加filter

  deleteFilteraggregateType(sendChart);
  return sendChart;
}
/**
 * 删除过滤字段的聚合属性
 * @param sendChart 
 */
function deleteFilteraggregateType(sendChart) {
  if (sendChart.type === ElementType.LIST) {
    if (sendChart.filter && sendChart.filter.length) {
      sendChart.filter.forEach(f => {
        if (f.field && f.field.options && f.field.options.hasOwnProperty("aggregateType")) {
          delete f.field.options.aggregateType;
        }
      })
    }
  }
  
}
/**
 * 校验过滤
 */
function checkDynamic(dy) {
  const formula = dy.operator.toLowerCase();
  return (
    dy.field &&
    (["none", "notnone"].includes(formula) ||
      (formula === "range" && dy.values[0] && dy.values[1]) ||
      (formula !== "range" && dy.values[0]))
  );
}
/**
 * 排除不符合规则的过滤条件,抛出值
 */
function getDyList(dy) {
  if (!dy) {return [];}
  const list: Array<H3.Report.DynamicParams> = [];
  dy.forEach(item => {
    if (checkDynamic(item)) {
      (list as any).push(item);
    }
  });
  return list;
}


// 处理仪表盘跳转参数的
function jumpLinkHandle(sendChart) {
  try {
    //删除多余labels
    const sendChartFilters = sendChart.filter || [];
    sendChartFilters.forEach((f) => {
      if (f) {delete f.labels;}
    });
    const isJump = window.location.href.includes("isJump=true");
    if (isJump) {
      // 是跳转过来的
      const jumpStrageKey = "h3Reportfilter" + getUrlNodeId("jumpStrageKey");
      //传递过来的参数
      const windowParamsFilters =
        (sessionStorage.getItem(jumpStrageKey)
          ? JSON.parse(sessionStorage.getItem(jumpStrageKey) || "")
          : {}) ||
        window.opener[jumpStrageKey] ||
        {};
      // jumpMethod jumpMethod === 'normal' || jumpMethod === 'custom'  //默认传值或者自定义传值
      const { filters, dataSourceId, jumpMethod } = windowParamsFilters;
      //判断是否同源 并且是默认传值
      if (
        filters &&
        filters.length &&
        dataSourceId === sendChart.dataSourceId &&
        jumpMethod === "normal"
      ) {
        //不需要处理的图表
        const noCludeCharts = [
          ElementType.FILTERPICKER,
          ElementType.MAP,
          ElementType.IMAGE,
          ElementType.WEB
        ];
        if (!noCludeCharts.includes(sendChart.type)) {
          sendChart.filter = sendChartFilters || [];
          filters.forEach(filter => {
            const f = JSON.parse(JSON.stringify(filter || {}));
            sendChart.filter.push(f);
          });
        }
      }
    }
  } catch (error) {
    console.log(error, "报表：jumpLinkHandle出错");
  }
}
function handelComputeField(sendChart,oChart) {
  try {
    let arr: any = sendChart.dimension.concat(sendChart.metric);
    if (sendChart.groupDimension && sendChart.groupDimension.length) {
      arr = arr.concat(sendChart.groupDimension);
    }
        const checkArr: any = [];
        if(!oChart.formulas) {oChart.formulas = [];}
        if (arr.length) {
          arr.forEach((usefield: any) => {
            if (oChart.formulas && oChart.formulas.length) {
              oChart.formulas.forEach(formula =>{
                if (usefield && formula && usefield.field === formula.id) {
                  const same = checkArr.find(item =>item.id === formula.id);
                  if (!same) {
                    checkArr.push(formula);
                  }
                }
              });
            }
          });
        }
        //sendChart.options.formulas = oChart.formulas;
        if (sendChart.type === "list") {
          Object.assign(sendChart, {
            options: { formulas: checkArr }
          });
        }
        if (sendChart.type === "crosstable") {
          Object.assign(sendChart.options, { formulas : checkArr });
        }
  } catch (error) {
    console.log(error, "报表：handelComputeField出错");
  }
}
function handleCrossSummary(data) {
  let res: any = { columnSummaries: [], rowSummaries: [] };
  if (data.columnSummaries && data.columnSummaries.length) {
    res.columnSummaries = data.columnSummaries.filter(
      item => item.subTotalText && item.dimIds.length && item.aggregateType
    );
  }
  if (data.rowSummaries && data.rowSummaries.length) {
    res.rowSummaries = data.rowSummaries.filter(
      item => item.subTotalText && item.dimIds.length && item.aggregateType
    );
  }

  return Object.assign({}, data, res);
}
//遍历维度和指标中是否包含计算字段 ,(列维度)
function checkCompute(chartData, originChart) {
  let arr = chartData.dimension.concat(chartData.metric);
  arr = arr.concat(chartData.groupDimension);
  const checkArr: any = [];
  let chartFormulas: any;
  if(!originChart.formulas) {
    chartFormulas = [];
  } else {
    chartFormulas = JSON.parse(JSON.stringify(originChart.formulas));
  }
  if (arr.length && chartFormulas.length) {
    arr.forEach((usefield: any) => {
      chartFormulas.forEach((formula) => {
        if (usefield && formula && usefield.field === formula.id) {
          const same = checkArr.find((item) => item.id === formula.id);
          if (!same) {
            checkArr.push(formula);
          }
        }
      });
    });
  }
return checkArr;
}
//过滤条件数组转换成一个包含与或关系的过滤条件对象
function changeGroupFilter(groupFilters) {
  let filterObject: any; //转换成的对象
  let resultArray: any = []; //最终结果-数组
  if (groupFilters && groupFilters.length) {
    filterObject = {
      field : null,
      formula : '',
      operation : '',
      text : [],
      ands : [],
      ors : []
    };
    const filterArr = groupFilters.filter(subArr => subArr.length > 0);
    filterArr.forEach((group,gindex) =>{
      if (group instanceof Array && group.length) {
        group.forEach((filter,index) =>{
          if (index === 0) {
            filter.text = filter.text.map((item: any) =>item instanceof Object ? item.value : item);
            filter.ors = [];
            filter.ands = [];
            filterObject.ors.push(filter);
          } else {
            filter.text = filter.text.map((item: any) =>item instanceof Object ? item.value : item);
            filterObject.ors[gindex].ands.push(filter);
          }
        });
      }
    });
    // 校验过滤对象是否为空
    if (filterObject && filterObject.ors && filterObject.ors.length) {
      resultArray.push(filterObject);
    }
  } else {
    resultArray = [];
  }
  return resultArray;
}
function getComputedFieldFormula(sendChart,oChart) {
  let gfilters = oChart.data.filter;
  if (gfilters && gfilters.length && oChart.formulas && oChart.formulas.length) {
    gfilters.forEach(gfilter =>{
      if (gfilter && gfilter instanceof Array && gfilter.length) {
        gfilter.forEach(f =>{
          let hasSame = 0;
          if (sendChart.options && sendChart.options.formulas && sendChart.options.formulas.length) {
            sendChart.options.formulas.forEach(item =>{
              if (f && !(f instanceof Array)) {
                if (item && f && f.field && item.id === f.field.field) {
                hasSame++;
              }
              }
            });
          }
          if (hasSame === 0 && oChart.formulas && oChart.formulas.length && f && f.field) {
            const newFormula = oChart.formulas.find((item) => item.id === f.field.field);
            if (!sendChart.options.formulas) {sendChart.options.formulas = [];}
            if (newFormula) {
              sendChart.options.formulas.push(newFormula);
            }
          }
        })
      }
    });
  }
}

/**
 * 删除全局筛选器中的动态参数, 标识为数据源信息里的sqlParams: 1，并将全局筛选器中的动态参数转换成sqlParams
 * @param globalFilters 所有全局筛选器
 * @param filtersPickers 与图表对应的全局筛选器对象
 * @returns 返回删除后的全局筛选器
 */
function removeFilterWithSqlParams(globalFilters, filtersPickers, dataSourceId) {
  const sqlParams: H3.Report.SqlParam[] = [];
  const filterPickers: { [key: string]: H3.Report.FilterFieldColumn[] } = {};

  for (const key in filtersPickers) {
    if(filtersPickers.hasOwnProperty(key)) {
      const filter = filtersPickers[key];
      if (filter && filter.length) {
        const updatedFilter: any = [];
        const globalFilter = globalFilters.find((gfilter) => gfilter.uid === key);
        const sameDataSource = globalFilter && globalFilter.dataSources && globalFilter.dataSources.some((i) => i.dataSourceId === dataSourceId);
        const isSqlParam = globalFilter && globalFilter.dataSources && globalFilter.dataSources.some((data) => data.sqlParams && data.sqlParams === 1);
        if (sameDataSource) {
          if (isSqlParam) {
            for (const item of filter) {
              const sqlParam = filterToSqlParams(item);
              if (sqlParam) {
                sqlParams.push(sqlParam);
              }
            }
          } else {
            updatedFilter.push(...filter);
          }
        } else { 
          updatedFilter.push(...filter);
        }
        if (updatedFilter.length) {
          filterPickers[key] = updatedFilter;
        }
      }
    }

  }

  return { sqlParams, filterPickers };
}

export {
  handleChartRequestParams,
  handleRelationFields,
  getElementRelation,
  getChartFields,
  jumpLinkHandle,
  checkCompute,
  handelComputeField,
  deleteFilteraggregateType,
  changeGroupFilter,
  getComputedFieldFormula,
  getDyList,
  removeFilterWithSqlParams
};

export default {
  handleChartRequestParams,
  handleRelationFields,
  getElementRelation,
  getChartFields,
  jumpLinkHandle,
  checkCompute,
  handelComputeField,
  deleteFilteraggregateType,
  changeGroupFilter,
  getComputedFieldFormula,
  getDyList,
  removeFilterWithSqlParams
};
