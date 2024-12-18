import { createNewChart } from "../../instance/element-modules/analysis/create-chart";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { NumberType, StringType } from "@h3/report-mobile/basics/enum/aggregate-type-ds";
import { transDyncMic } from "@h3/report-mobile/basics/enum/filter-type";
import options from "@h3/report-mobile/dist/options";
import { uuid } from "@h3/report-mobile/basics/utils/uid";
import { ErrorMsg } from "./enum";

import addresses from "@h3/report-mobile/basics/enum/pca-code";



/**
 * @param resData AI返回图表数据
 * @param dataSourceId 数据源ID
 * 转化组件数据·结构
 */
export const transformAIChart =  async (resData, dataSource) => {
    // 创建新的图表组件实例
    const element = createNewChart(resData.chartType || ElementType.BAR) as H3.Report.Chart;
    // 设置图表组件数据源ID
    element.dataSourceId = dataSource.dataSourceId;
    if (resData.title) {
      element.title = resData.title;
    }


    // 从表结构中获取字段属性，创建新的指标--维度实例
    if (resData.dimensions && resData.dimensions.length) {
      const dimension: any = [];  
      resData.dimensions.forEach((item) => {
        const field = createField(item, "dimension", dataSource);
        if (field) {
          dimension.push(field);
        }
      });
      element.data.dimension = dimension;
    }
    if (resData.groupDimensions && resData.groupDimensions.length) {
      const groupDimensions: any = [];  
      resData.groupDimensions.forEach((item) => {
        const field = createField(item, "dimension", dataSource);
        if (field) {
          groupDimensions.push(field);
        }
      });
      element.data.groupDimension = groupDimensions;
    }

    if (resData.metrics && resData.metrics.length) {
      const metric: any = [];
      resData.metrics.forEach((item) => {
        const field = createField(item, "metric", dataSource);
        if (field) {
          metric.push(field);
        }
      });

      element.data.metric = metric;
      const hasMetricSort = element.data.metric.some((mfield) => mfield && mfield.options && mfield.options.order);
      // 因维度指标排序互斥,所以当生成的图表类型中,指标含排序时,将维度的排序字段清除
      if (hasMetricSort) {
        element.data.dimension.forEach((dfield) => {
          if (dfield && dfield.options && dfield.options.order) {
            delete dfield.options.order;
          }
        });
      }
    }
    // 图内筛选器
    if(resData.sourceFilters && resData.sourceFilters.length){ 
      // 如果是一维数组,则转换为二维数组
      if(resData.sourceFilters.length && !Array.isArray(resData.sourceFilters[0])){
        resData.sourceFilters = [resData.sourceFilters];
      }
      // 二维数组
      let resFilters: any = [];
      for(let filters of resData.sourceFilters) { 
        let tmpFilters = await transformFilters(filters,dataSource);
         if(tmpFilters && tmpFilters.length) {
          resFilters.push(tmpFilters);
         }
      }
      // resData.sourceFilters.forEach((filters) => {
      //    let tmpFilters = transformFilters(filters,dataSource);
      //    if(tmpFilters && tmpFilters.length) {
      //     resFilters.push(tmpFilters);
      //    }
      // });

      element.data.filter = resFilters;
    }
    // 汇总后的筛选
    if(resData.aggregatedFilters && resData.aggregatedFilters.length){ 
      element.data.innerFilter = await transformFilters(resData.aggregatedFilters,dataSource);
    }

    // 设置图表排序字段
    if (element.data.metric.length > 0) {
      if (!element.data.sort) {
        element.data.sort = [];
      }
      element.data.metric.forEach((mfield) => {
        if (mfield.options.order) {
          element.data.sort.push(mfield);
        }
      });
    }
    if (element.data.dimension.length > 0) {
      if (!element.data.sort) {
        element.data.sort = [];
      }
      element.data.dimension.forEach((dfield) => {
        if (dfield.options.order) {
          element.data.sort.push(dfield);
        }
      });
    }
    return element;
  }
  
  /**
   * 转换所有图内筛选器
   * @param filters 图内筛选器
   * @param dataSource 数据源
   */
  async function transformFilters(filters,dataSource) {
    let resFilters: any = [];
    
    if(filters && filters.length){
      try{
        await Promise.all(filters.map((filter) => transformFilter(filter,dataSource))).then(results=> {
          resFilters = results
        }).catch(error => {
          console.log("--报错详情--:",error.errorMessage,"--报错数据--:",error.errorData);
          return error;
        });

      }catch(e){
        console.log("报错详情:",e,"--转换ai筛选条件失败--","报错数据:",filters);
        return resFilters;
      }
      
     }
     return resFilters;
  }
/**
   * 转换单个图内筛选器
   * @param filter 图内筛选器
   * @param dataSource 数据源
   */
   function transformFilter(filter, dataSource) {
    return new Promise(async (resolve,reject) => {
      let tmpFilter: any = filter;
      if(filter && filter.field && filter.field.name) {
        const field = findField(filter.field, dataSource);
        if (field) {
          tmpFilter.field = field;
          if(filter.format) {
              tmpFilter.field.options = {
                format : filter.format
              }
          }
          if(tmpFilter.formula && tmpFilter.operation &&tmpFilter.formula === 'Dynamic'){
            let text = transDyncMic[filter.operation][filter.text[0]]
            if(text) {
              tmpFilter.text = text;
              tmpFilter.selectDateType = JSON.stringify(text);
            }
          }
          // 处理地址字段,正则匹配地址名称,获取地址编码
          if (tmpFilter.field.specialType === "address") {
            let textValue:any = [];
            for(let item of tmpFilter.text) {
              const resItem = findCodeAndNameWithParents(addresses, item);
              if (resItem) {
                textValue.push(resItem)
              } else {
                reject({ errorMessage: ErrorMsg.AddressFieldError, errorData: filter});
                break;
              }
            }
            tmpFilter.text = textValue;
            resolve(tmpFilter);
            return;
          }

          if(options.filedNameQueryValue) {
              // 极简逻辑 1.then有值证明查询成功 2. then无值代表不需要查询 3.查询接口失败或者查询不到都走cacth,并给详细说明
             await options.filedNameQueryValue(filter.field,filter.text).then(res =>{
              if(res) {
                tmpFilter.text = res;
              } 
              resolve(tmpFilter);
             }).catch(error => {
              reject(error);
             });
          }

          resolve(tmpFilter);
        }else{
          reject({ errorMessage: ErrorMsg.FieldNotFound, errorData: filter});
        }
      }else{
        reject({ errorMessage: ErrorMsg.FieldInfoError, errorData: filter});
      }
    })
   }

   /**
    * 根据地址名称查找地址编码及名称
    * @param addressData 
    * @param targetName 
    * @param parents 
    * @returns 
    */
   function findCodeAndNameWithParents(addressData, targetName, parents = []) {
    for (const addressItem of addressData) {
      // 使用模糊匹配判断是否包含目标名称
      if (addressItem.name.includes(targetName)) {
        const parentNames = parents.concat(addressItem.name);
        const joinName = parentNames.join('');
        return { value: addressItem.code, label: joinName };
      }
  
      if (addressItem.children && addressItem.children.length > 0) {
        const result = findCodeAndNameWithParents(
          addressItem.children,
          targetName,
          parents.concat(addressItem.name)
        );
        if (result) {
          return result;
        }
      }
    }
  
    return null; // 返回 null 表示在地址数据中未找到模糊匹配的节点
  }
  

  /**
   * 查找原字段
   * @param resField 根据AI返回的字段(不标准字段), 从数据源中获取标准字段数据, 并创建新的指标--维度实例
   * @param dataSources 数据源 --表结构
   */
  const findField = (resField, dataSource) => {
     // 创建正则表达式进行模糊匹配
    //  const searchValue = resField.name;
    //  const regex = new RegExp(searchValue, 'i');
    const originalField: H3.Report.FieldColumn = dataSource.properties.find((obj: H3.Report.FieldColumn) => {
      // const nameMatch = regex.test(obj.name);
      // return nameMatch && !obj.mainField && obj.visible;
      const nameMatch = resField.name === obj.name ; 

      return nameMatch && !obj.mainField && obj.visible;
    });
    return originalField ? JSON.parse(JSON.stringify(originalField)) : null;
  }
  /**
   * 原字段创建指标维度
   * @param resField 根据AI返回的字段(不标准字段), 从数据源中获取标准字段数据, 并创建新的指标--维度实例
   * @param dataSources 数据源 --表结构
   */
  const createField = (resField, moduleKey, dataSource) => {
    let result;
    if (dataSource.properties && dataSource.properties.length) {
      // 对象数组中找到包含特定值的 name 属性的对象，而且希望对中文、数字和英文进行不区分大小写的匹配
      let field = findField(resField, dataSource);
      if (field) { 
        if (!field.uid) {
          field.uid = uuid(8, 16);
        }
        if (moduleKey === "metric") {
          let tmpField: any = null;
          // 处理目标值
          if(resField.targetValue) {
            if(resField.targetValue.type === 'fixed') {
              field.options.targetValue = {
                valueType : resField.targetValue.type,
                constValue : resField.targetValue.value,
              }
            }
            if(resField.targetValue.type === 'dynamic') {
              let targetField = createField(resField.targetValue.value, "metric", dataSource);
              if(targetField) {
                field.options.targetValue = {
                  valueType : resField.targetValue.type,
                  field : targetField,
                }
              }
            }
          }
          
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
              field.options.aggregateType = resField.format && checkAggregateType(field.type, resField.format) ? resField.format : "COUNT";
            }
            break;
          case "date":
            if (moduleKey === "metric") {
              field.options.aggregateType = resField.format && checkAggregateType(field.type, resField.format) ? resField.format : "COUNT";
            } else {
              field.options.format = resField.format ? resField.format : "Y";
            }
            break;
          case "number":
            field.options.aggregateType = resField.format && checkAggregateType(field.type, resField.format) ? resField.format : "SUM";
            break;
          default:
            break;
        }
        return field;
      }
      
    }
   return result;
  }
  
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
          result = [NumberType.AVG, NumberType.COUNT, NumberType.COUNTDISTINCT, NumberType.MAX, NumberType.MIN, NumberType.SUM].includes(aggregateType);
          break;
        default:
          break;
      }
    }
    return result;
  };
  

  
/**
 * 检验图表参数是否可以成功渲染
 * @param chart 转换后的图表实例
 */
export const checkChart = (chart: H3.Report.Chart) => {
    if (!chart) {
      return false;
    }
    // 检验图表类型是否支持, 以下是支持的图表类型：
    const allowTypes = [
      ElementType.BAR, ElementType.PILEBAR, ElementType.STRIPE, ElementType.LINE, 
      ElementType.AREA, ElementType.PIE, ElementType.RADAR, ElementType.TABLE,
      ElementType.CARD, ElementType.FUNNEL, ElementType.SCATTER, ElementType.BIAX,
      ElementType.MAP, ElementType.GAUGE, ElementType.PROGRESSBAR, ElementType.FUNNELCOMPARE, ElementType.CROSSTABLE];
    
    if (!allowTypes.includes(chart.type)) {
      return false;
    }
    // 维度字段不能是数字类型
    if (chart.data.dimension.some((item) => item.type === "number")) {
      return false;
    }
    //地址字段只能用于地图
    if (chart.type === ElementType.MAP) {
      if (!chart.data.dimension.every((item) => item.type === "address" || item.specialType === "address")) {
        return false;
      }
    } else {
      if (chart.data.dimension.some((item) => item.type === "address" || item.specialType === "address")) {
        return false;
      }
    }
    // // 暂时不支持多维度
    // if (chart.data.dimension.length && chart.data.dimension.length > 1) {
    //   return false;
    // }
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
        return (
          chart.data.dimension.length && chart.data.metricGroup.every(i => i.length > 0)
        );
      default:
        return chart.data.dimension.length && chart.data.metric.length;
    }
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
  }
  