import {ElementType} from "../../enum/chart-type";
import {createElementInstance} from "@h3/report-mobile/basics/instance/element/instance";
import ProChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard";
import { DateFilterType , transDyncMic, DateType } from "@h3/report-mobile/basics/enum/filter-type";
import { dateSelectList } from '@h3/report-mobile/basics/utils/dateMap'
import { getUrlNodeId } from "@h3/report-mobile/basics/utils/url";
import { parseJSON } from "@h3/report-mobile/basics/utils/string";

/**
 * 注册仪表盘元件
 *  主要是支持元件的数据升级
 * @param elementType
 * @param oldElement
 */
function registerElement(
  elementType: H3.Report.ElementType,
  oldElement?: H3.Report.BaseElement
): H3.Report.BaseElement {
  let newChart: H3.Report.Chart | H3.Report.FilterPicker | H3.Report.LongText | H3.Report.WEB | H3.Report.Image | H3.Report.Tab;
  newChart = createElementInstance(elementType, oldElement);
  ProChartModules(newChart as any, oldElement);
  // newChart.__key__ = guid();
  return newChart;
}

/**
 * 处理报表请求
 * @param report
 */
function handleReportResponse(report: H3.DashboardAPI.ReportData) {
  const schemaCodes: any = {};
  let filterPickers: Array<H3.Report.FilterPicker> = [];
  let elements: Array<H3.Report.BaseElement> = [];
  let attributes: any = {};
  let globalFilters: Array<H3.Report.FilterPicker> = [];
  if (report.attributes) {
    attributes = JSON.parse(report.attributes);
    if (attributes.globalFilters && attributes.globalFilters.length) {
      globalFilters = attributes.globalFilters as Array<H3.Report.FilterPicker>;
      globalFilters.forEach((f)=>{
        transFillterFormula(f,true)
      })
    }
  }
  report.charts.forEach((rChart: any, index) => {
    if (checkChart(rChart)) {
      let element: H3.Report.BaseElement = handleChartConstruction(rChart, index);
      element = registerElement(element.type, element);
      element.formulas = JSON.parse(element.formulas);
      handleOldTransformBar(element); //兼容显示数据条
      elements.push(element);
      const chart = element as H3.Report.Chart;
      if (chart.dataSourceId) {
        schemaCodes[chart.dataSourceId] = {
          dataSourceId: chart.dataSourceId,
          useType: chart.useType
        };
      }
      if (element.type === ElementType.FILTERPICKER) {
        filterPickers.push(element as H3.Report.FilterPicker);
      }
    }
  });
  //处理跳转过来的逻辑，将值添加到筛选器中去
  handleJumpFilter(filterPickers as any,globalFilters as any);
  const result: any = getRelationChart(elements);
  markBelongToTab(result.newElement || elements);
  return {
    title: report.title,
    objectId: report.objectId,
    elements: result.newElement || elements, // 将不需要展示的chart过滤到children中
    reqGlobal: report.global || "{}",
    schemaCodes,
    filterPickers,
    attributes,
    globalFilters,
    chartRelations: result.chartRelations || {}
  };
}

/**
 * 清洗脏数据,避免数据环状引用，导致仪表盘丢失
 * @param elements 
 * @param resMap 
 */
function cleanDirtyData(elements,resMap) {
  let pUidMap = {};
  let repeatPUids = {};
  elements.forEach((element) => {
    if(element.uid === element.parentUid) {
      element.parentUid = '';
      resMap[element.uid] = [element];
    };
    if(!pUidMap[element.parentUid]) {
      pUidMap[element.parentUid] = element;
    } else {
      repeatPUids[pUidMap[element.parentUid].uid] = pUidMap[element.parentUid];
      repeatPUids[element.uid] = element;
    }
  })
  if(Object.values(repeatPUids).length > 0) {
    let levelsMap = {};
    let maxLevelElement:any;
    // 存在重复节点的环状引用,处理
    Object.keys(repeatPUids).forEach((elementUid) => {
      levelsMap[elementUid] = calculateNodeLevel(elements, elementUid);
    });
    maxLevelElement = elements.find(item=> item.uid === findKeyWithMaxValue(levelsMap));
    if(maxLevelElement) {
      maxLevelElement.parentUid = '';
    };
    console.log(`存在重复节点的环状引用,删除${maxLevelElement.uid}节点的parentUid`);
  } else {
    // 存在无重复的环状引用，首位相连，直接断掉第一层链接
    elements[0].parentUid = '';
    console.log('存在无重复的环状引用，首位相连')

  }
}

/**
 * 条件格式兼容显示数据条功能旧数据
 * @param chart 
 */
function handleOldTransformBar(chart) {
  if (chart.type === ElementType.LIST) {
    if (chart.data && chart.data.dimension && chart.data.dimension.length) {
      chart.data.dimension.forEach((dim, index) => {
        if (dim.options.hasOwnProperty('transformBar')) {
          dim.options['conditionFormat'] = dim.options.transformBar;
          delete dim.options.transformBar;
          if (!chart.conditionFormats) {chart.conditionFormats = [];}
          chart.conditionFormats.push({
            fieldUid: dim.uid,
            formatType: "dataBar",
            conditions: [
              {
                value: [0, null],
                color: "#9FE9C6",
                formula: "Above",
                valueType: ""
              },
              {
                value: [0, null],
                color: "#FFBFBF",
                formula: "Below",
                valueType: ""
              }
            ],
            colorType: "",
            needDetail: true
          });
        }
      });
    }
  }
}
// 给属于tab组件的图表标记,替换成图表
function markBelongToTab(elements) {
  let tabComponents = elements.filter((item)=> item.type === 'tab');
  tabComponents.forEach(item=> {
    if(item.tabs && item.tabs.length > 0) {
      item.tabs.forEach((tab,index)=> {
        for(let i=0;i<tab.chartIds.length;i++){
          let chart = elements.find(element => element.uid === tab.chartIds[i]);
          if(chart){
            chart['tabUid'] = item.uid;
            chart['tabIndex'] = index;
          }
        }   
      });
    }
  });
}
/**
 * 如果是跳转过来的仪表盘，需要判断是否是自定义传值，如果是，就需要将跳转过来的值加到筛选结果中去
*/
function handleJumpFilter(filterPickers=[], globalFilters=[]){
  const isJump = window.location.href.includes('isJump=true')
  try {
    if(isJump){ // 是跳转过来的
      const jumpStrageKey ='h3Reportfilter'+ getUrlNodeId('jumpStrageKey')
      //传递过来的参数
      const windowParamsFilters = (sessionStorage.getItem(jumpStrageKey) ? JSON.parse(sessionStorage.getItem(jumpStrageKey) || '') : {}) || window.opener[jumpStrageKey] || {}; 
      // jumpMethod jumpMethod === 'normal' || jumpMethod === 'custom'  //默认传值或者自定义传值
      const {filters, jumpMethod} = windowParamsFilters;
      if(jumpMethod === 'custom'){ //只处理自定义传值跳转过来的
        filters.forEach((valObj)=>{
          let metch;
          const metchPicker = globalFilters.find((f:any)=>f.uid === valObj.uid)
          const metchChart = filterPickers.find((f:any)=>f.uid === valObj.uid);
          metch = metchPicker || metchChart;
          if(metch){
            if(metch.formula === "Range" && valObj.text.length == 1){
              metch.text = [valObj.text[0],valObj.text[0]]
            }else{
              metch.text = valObj.text;
            }
          }
        })
      }

      // //判断是否同源 并且是默认传值
      // if(filters && filters.length && dataSourceId === sendChart.dataSourceId && jumpMethod === 'normal'){
      //   //不需要处理的图表
      //   const noCludeCharts = [ElementType.FILTERPICKER,ElementType.MAP,ElementType.IMAGE,ElementType.WEB]
      //   if(!noCludeCharts.includes(sendChart.type)){
      //     sendChart.filter = sendChart.filter || []
      //     filters.forEach((filter)=>{
      //       sendChart.filter.push(filter);
      //     }) 
      //   }
      // }
    }
  } catch (error) {
    console.log('error:handleJumpFilter')
  }
}
/**
 * 校验chart合法性
 * @param chart
 */
function checkChart(chart) {
  return !!chart.type;
}
/**
 * 同步字段
 */
function syncField(oField,nField) {
  Object.assign(oField, nField, {
    uid: oField.uid,
    alias: oField.alias,
    options: oField.options
  });
}
/**
 * 处理图表字段同步数据源的字段默认值
 * @param elements
 * @param dataSources
 */
function handleChartFieldDefaultValues(
  elements: H3.Report.BaseElement[],
  dataSources: { [dataSourceId: string]: H3.Report.DataSource }
) {
  elements.forEach((element: H3.Report.BaseElement) => {
    if (![ElementType.LONGTEXT, ElementType.FILTERPICKER, ElementType.IMAGE, ElementType.WEB ].includes(element.type)) {
      const chart = element as H3.Report.Chart;
      const chartData: H3.Report.ChartDataGroup = chart.data;
      const chartFields: H3.Report.FieldColumn[] = [];
      if (chart.dataSourceId && dataSources[chart.dataSourceId]) {
        const dataSourceFields: H3.Report.FieldColumn[] =
          dataSources[chart.dataSourceId].properties;
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
        if (chartData.innerFilter && chartData.innerFilter.length) {
          chartData.innerFilter.forEach((filter: H3.Report.FilterFieldColumn) => {
            chartFields.push(filter.field);
          });
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
            // 旧数据保存的字段是没有mainField可以区的,这时只能通过field && schemaCode 来确定是同个字段去同步字段;
            // 新的数据必须加上mainField作为判断
            if (
              chartField.field === dataSourceField.field &&
              chartField.schemaCode === dataSourceField.schemaCode
            ) {       
              if(chartField.mainField) {
                if(chartField.mainField === dataSourceField.mainField) {
                  syncField(chartField,dataSourceField);
                }
              } else {
                syncField(chartField,dataSourceField);
              }
            }
          });
        });
      }
    } else { 
      if (element.type === ElementType.FILTERPICKER) {
      const filter = element as H3.Report.FilterPicker;
      if (Object.keys(filter.dataSources).length) {
        filter.dataSources.forEach(dataSource => {
          if (dataSource.dataSourceId && dataSources[dataSource.dataSourceId]) {
            const dataSourceFields: H3.Report.FieldColumn[] =
              dataSources[dataSource.dataSourceId].properties;
            dataSourceFields.forEach((dataSourceField: H3.Report.FieldColumn) => {
              if (
                dataSource.field &&
                dataSource.field.field === dataSourceField.field &&
                dataSource.field.schemaCode === dataSourceField.schemaCode
              ) {
                Object.assign(dataSource.field, dataSourceField, {
                  uid: dataSource.field.uid,
                  alias: dataSource.field.alias,
                  options: dataSource.field.options
                });
              }
              if (
                filter.field.field === dataSourceField.field &&
                filter.field.schemaCode === dataSourceField.schemaCode
              ) {
                Object.assign(filter.field, dataSourceField, {
                  uid: filter.field.uid,
                  alias: filter.field.alias,
                  options: filter.field.options
                });
              }
            });
          }
        });
      }
      }
    }
  });
}

/**
 * 转换组件数据解构
 */
function handleChartConstruction(
  element: H3.DashboardAPI.ChartViewData,
  index
): H3.Report.BaseElement {
  const jsonPart = ["data", "styles", "position", "mobileOptions","customSort"];
  let newElement: H3.Report.BaseElement | any = {};
  Object.keys(element).forEach(key => {
    let res = element[key];
    if (jsonPart.includes(key)) {
      res = parseJSON(element[key]) || {};
    }
    if (key === "position") {
      Object.assign(newElement, res);
    } else if (key === "uuid") {
      newElement["uid"] = res;
    } else {
      newElement[key] = res;
    }
  });
  if (!newElement.mobileOptions) {
    newElement.mobileOptions = {};
  }
  // 将chart中的data里面的parentUid 提取到外层
  if (newElement.data && newElement.data.parentUid) {
    if(newElement.data.parentUid !== newElement.uid) {
      newElement.parentUid = newElement.data.parentUid;
    }
    delete newElement.data.parentUid;
  }
  if (newElement.data && newElement.data.relations) {
    newElement.relations = newElement.data.relations;
    delete newElement.data.relations;
  }
  
  if (newElement.data && newElement.data.layerTitle) {
    newElement.layerTitle = newElement.data.layerTitle;
    delete newElement.data.layerTitle;
  }
  
  if (newElement.data && newElement.data.dynamicParams) {
    newElement.dynamicParams = newElement.data.dynamicParams;
    delete newElement.data.dynamicParams;
  }

  if (newElement.data && newElement.data.filter) {
  let filterData :any = []
  if (newElement.data.filter && newElement.data.filter.length) {
    if (!(newElement.data.filter[0] instanceof Array)) {
      const gfilter : any = [];
      newElement.data.filter.forEach(oldFilter =>{
        gfilter.push(oldFilter);
      });
      filterData.push(gfilter);
    } else {
      filterData = newElement.data.filter;
    }
  }
  newElement.data.filter = filterData;
  }
  // 文本组件
  if (element.type === ElementType.LONGTEXT) {
    newElement["content"] = newElement.data.content;
  }
   // tabs组件
   if (element.type === ElementType.TAB) {
    newElement["tabs"] = newElement.data.tabs;
    newElement["visibleTitle"] = newElement.data.visibleTitle;
    // newElement["tabGlobal"] = newElement.data.tabGlobal;
  }
  // 图片或者web组件
  if (element.type === ElementType.IMAGE || element.type === ElementType.WEB ) {
    newElement["content"] = newElement.data.content;
    newElement["fileName"] = newElement.data.fileName;
    newElement["showMode"] = newElement.data.showMode;
  }
  // 筛选器
  if (element.type === ElementType.FILTERPICKER) { 
    const data = JSON.parse(element["data"]);
    newElement["data"] = {};
    newElement = Object.assign({}, newElement, data);
    
  }
  // if (element.type === ElementType.LIST && newElement.conditionFormats) {
  //   newElement["conditionFormats"] = JSON.parse(newElement.conditionFormats);
  // }
  if (newElement.hasOwnProperty("conditionFormats")) {
    newElement["conditionFormats"] = JSON.parse(newElement.conditionFormats);
    const notIncludeChart = [ElementType.WEB, ElementType.IMAGE, ElementType.FILTERPICKER,ElementType.LONGTEXT,ElementType.TAB];
    newElement.conditionFormats = notIncludeChart.includes(element.type) ? [] : newElement.conditionFormats;
  }
  // 将非自定义的日期 都转化成动态筛选
  transFillterFormula(newElement)
  return newElement;
}
 // 是否是自定义日期
 function transFillterFormula(filter,isGlobal?){
  if(isGlobal){
    return changeFilter(filter)
  }
  switch (filter.type) {
    case ElementType.FILTERPICKER:
      changeFilter(filter)
      break;
    case ElementType.LIST:
      changeFilter(filter, true)
      changeChartDataFilter(filter)
      break;
    default:
      changeChartDataFilter(filter)
      break;
  }
}
//改所有图表的chart
const changeChartDataFilter = (filter) =>{
  const filterData = filter.data.filter || [];
  if (filterData.length){
    filterData.forEach((inner)=>{
      if (inner instanceof Array) {
        if (inner.length) {
          inner.forEach(item =>{
            if (item.field.type === 'date') {
              changeFilterContent(item);
            }
          })
        }
      } else {
        if(inner.field.type === 'date'){
        changeFilterContent(inner)
      }
      }
      
    })
  }
}
//修改高级数据源 data
const changeDataSourceFilter = (filters)=>{
  if(filters && filters.length){
    filters.forEach((filter)=>{
      const conditions = filter.conditions || [];
      conditions.forEach((f)=>{
       if(f.type ===  "date"){
        changeFilterContent(f,true);
       }
      })
    })
  }
  return filters;
}
/**
 * isInner : 是否是内部inner属性
*/
const changeFilter = (filter, isInner?) =>{
  if(isInner){
    const innerFilter = filter.data.innerFilter || [];
    if(innerFilter.length){
      innerFilter.forEach((inner)=>{
        changeFilterContent(inner)
      })
    }
  }else{
    changeFilterContent(filter)
  }
}

const changeFilterContent = (filter, isDataSource?) => {
  if(filter.type === 'date' || filter.field.type=== 'date'){
    const value = filter.text || filter.values;
    const formula = filter.formula;
    if(value && value[0] && formula && formula!== DateType.Dynamic){
      const tmpTimeValue: string | undefined = DateFilterType[value[0]] ? DateFilterType[value[0]] : null;
      if(tmpTimeValue  && tmpTimeValue !== DateType.Dynamic){ //如果是非自定义时间，就需要做处理
        try {
          filter.operation = "";
          if(formula === DateType.Equal || formula === DateType.NotEqual){ //如果是等于，而且是非自定义
            const metch = dateSelectList.find(el=>el.codeLabel == value[0]);
            if(metch){
              filter.selectDateType = metch.value;
            }
          }
          filter.text = transDyncMic[formula][tmpTimeValue]
          if(isDataSource) {
            filter.values = transDyncMic[formula][tmpTimeValue]
            filter.originValues = transDyncMic[formula][tmpTimeValue]
          }
          if(formula === DateType.NotEqual){
            filter.operation = 'NotEqual'
          }
          filter.formula = DateType.Dynamic;
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}

/**
 * 预处理图表
 */
function handleCharts(charts) {
  charts.forEach((item, index) => {
    if (item.parentUid) {
      const tmp = charts.find((c) => c.uid === item.parentUid);
      if (!tmp) {
        charts.splice(index, 1);
        handleCharts(charts);
      }
    }
  })
}

/**
 * 获取chart面包屑关系
 */
function getRelationChart(charts) {
  if (!charts.length) {return [];}
  handleCharts(charts);
  // 存储echart关系链
  let map = {};
  let arr: any = [];
  let chartRelations = {};
  
  charts.forEach((cChart: any) => {
    map[cChart.uuid || cChart.uid] = cChart;
  });
  charts.forEach((cChart: any) => {
    const parentUid = cChart.parentUid;
    if (parentUid) {
      let parent = map[parentUid] || {};
      (parent.children || (parent.children = [])).push(cChart);
    } else {
      arr.push(map[cChart.uid]);
    }
  });
  
  charts.forEach(item => {
    const excludes = [ElementType.FILTERPICKER, ElementType.LONGTEXT,ElementType.WEB,ElementType.TAB,ElementType.IMAGE];
    if (!item.parentUid && !excludes.includes(item.type)) {
      chartRelations[item.uid] = [item];
    }
  });
  getEqualArray(charts, chartRelations);
  // debugger;
  return {
    newElement: arr,
    chartRelations
  };
}

/**
 * 获取平行数组
 */
function getEqualArray(charts, res) {
  let tmpCharts: any = [];
  charts.forEach(item => {
    if (item.parentUid) {
      const a: any = Object.values(res).find((arr: any) => {
        return arr.find((m) => m.uid === item.parentUid);
      });
      if (a) {
         res[a[0].uid].push(item);
      } else {
        tmpCharts.push(item);
      }
    }
  });
  if (tmpCharts.length) {
    if(tmpCharts.length === charts.length){ 
      cleanDirtyData(tmpCharts,res);
    }
    getEqualArray(tmpCharts, res);
  }
}

/**
 * 
 * @param  将图表数组转换成含树形结构的图表数组
 * @param  
 * @returns 
 */
 function buildTree(charts) {
  let map = {};
  let arr: any = [];
  
  charts.forEach((cChart: any) => {
    cChart.children = [];
    map[cChart.uuid || cChart.uid] = cChart;
  });
  charts.forEach((cChart: any) => {
    const parentUid = cChart.parentUid;
    if (parentUid) {
      let parent = map[parentUid] || {};
      (parent.children || (parent.children = [])).push(cChart);
    } else {
      arr.push(map[cChart.uid]);
    }
  });
  return arr;
}

/**
 * 找到对象中值最大的键
 */
function findKeyWithMaxValue(obj) {
  const keys = Object.keys(obj);
  return keys.reduce((maxKey, currentKey) => {
    return obj[currentKey] > obj[maxKey] ? currentKey : maxKey;
  }, keys[0]);
}
/**
 * 计算节点的层数
 */
function calculateNodeLevel(nodes, targetId) {
  const nodeMap = {};

  // 构建节点映射，以便更容易查找每个节点的子节点
  for (const node of nodes) {
    if (!nodeMap[node.parentUid]) {
      nodeMap[node.parentUid] = [];
    }
    nodeMap[node.parentUid].push(node.uid);
  }

  let level = 0;
  const visitedNodes:any = [];

  // 递归函数来计算节点的层数
  function calculateLevel(nodeId, currentLevel) {
    if (visitedNodes.includes(nodeId)) {
      return currentLevel;
    }
    visitedNodes.push(nodeId);
    if (!nodeMap[nodeId]) {
      return currentLevel;
    }

    let maxChildLevel = currentLevel;
    for (const childId of nodeMap[nodeId]) {
      const childLevel = calculateLevel(childId, currentLevel + 1);
      maxChildLevel = Math.max(maxChildLevel, childLevel);
    }

    return maxChildLevel;
  }

  return calculateLevel(targetId, level);
}


export { handleChartFieldDefaultValues, registerElement, handleReportResponse, handleChartConstruction, changeFilterContent,changeDataSourceFilter,getRelationChart, buildTree };

export default {
  handleChartFieldDefaultValues,
  registerElement,
  handleReportResponse,
  changeFilterContent,
  changeDataSourceFilter
};
