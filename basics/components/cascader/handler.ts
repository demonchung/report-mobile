/**
 * 该文件处理业务逻辑
 */

import cascaderTitle from "@h3/report-mobile/basics/components/cascader-title/index";
import NumberFormat from "@h3/report-mobile/basics/components/number-format/index";
import ResultFilter from "@h3/report-mobile/basics/components/reslut-filter/index";
import DateFormat from "@h3/report-mobile/basics/components/date-format/index";
import TargetValue from "@h3/report-mobile/basics/components/target-value/index";
import ConditionFormat from "@h3/report-mobile/basics/components/condition-format/index";
import { Modal } from "@h3/antd-vue";
// import { H3Modal } from "@h3/awesome-ui";
import { NumberType } from "@h3/report-mobile/basics/enum/filter-type";
import Module from "module";
import { rangeType } from "@h3/report-mobile/basics/components/condition-format/formulaType";

// 数值格式值
let numberFormat!: H3.Report.FilterPicker;
// 设置结果筛选器
let resultFilterData!: H3.Report.ResultFilter;
// 日期格式设置
let dateFormat!: H3.Report.DateFormat;
// metric 组的index
let metricGroupIndex!: any;
// 条件格式设置
let conditionFormat!: any;
let copyConditionFormat!: any;
let displayConditionFormat!: Boolean;
/**
 * 重命名
 * @param params params参数在cascader-menu中的showSubMenu方法中传递
 */
function rename(params: H3.CascaderParam) {
  const comp: any = new cascaderTitle().$mount();
  // 传参
  comp.renameModel = params.data.alias || params.data.name;
  comp.data = params.data;
  comp.chart = params.chart;
  comp.removeUndrag = params.removeUndrag;
  comp.resizeChartView = params.resizeChartView;
  let count: number = 0;

  const el = (params.self as any).$el;
  // 挂载$el
  if (params.self && params.self.moduleKey) {
    params.self.visible = false;
    comp.customPrefixCls = "h3-dashboard-rename";
    el.append(comp.$el);
  } else {
    for (const i in (params.self as any).$el.children) {
      if (i === "length") {return;}
      if ((params.self as any).$el.children[i].className.indexOf(comp.$el.className) > -1) {
        count += 1;
      }
      if (Number(i) === (params.self as any).$el.children.length - 1) {
        // 不存在comp.$el，才挂载在dom节点上
        if (count === 0) {
          (params.parentEl.$children as any)[0].$el.children[params.cascaderIndex.toString()].after(
            comp.$el
          );
          // (params.self as any).$parent.$parent.$el.children[params.cascaderIndex.toString()].after(comp.$el);
          params.hideCascader();
          break;
        }
      }
    }
  }
}

/**
 * 处理汇总方式
 * @param params
 */
function aggregateTypeBusiness(params: H3.CascaderParam) {
  // 点击对应的checked等于true
  params.treeNode.checked = true;
  const value = (params.treeNode as any).value;
  // 只有维度日期、指标数值字段才存在汇总方式
  if (params.data.specialType === "address") {
    resetAggregateResult(params);
    if (params.source === "dimension" || params.source === "groupDimension") {
      // 维度 - 日期字段赋值
      params.data.options.areaType = value;
    } else {
      params.data.options.aggregateType = value;
    }
  } else if (params.data.type === "date") {
    // 重置汇总结果占比设置
    resetAggregateResult(params);
    if (params.source === "dimension" || params.source === "groupDimension") {
      // 维度 - 日期字段赋值
      params.data.options.format = value;
    } else {
      params.data.options.aggregateType = value;
    }
  } else if (params.data.type === "number") {
    if (params.source === "dimension") {
      params.data.options.aggregateType = value;
    } else {
        // 判断之前是否设置同环比分析
      if (params.data.options.ratio) {
        // 重置数值格式设置
        resetAggregateResult(params);
      }
      // value不等于总和值和计数时，需要重置
      if (value !== "SUM" && value !== "COUNT") {
        // 重置汇总结果占比设置
        resetAggregateResult(params);
      }
      // 指标 - 数值字段赋值
      params.data.options.aggregateType = value;
    }
    // 当文本格式可以
  } else {
    if (params.data.type === "string") {
      resetAggregateResult(params);
      params.data.options.aggregateType = value;
    }
  } 
  params.setForecast(params.data);
  // 重置同/环比分析
  resetRatioAnalyze(params);
  // 刷新数据
  params.resizeChartView({ chart: params.chart, type: "data" });
}

/**
 * 重置汇总结果占比设置
 * @param params
 */
function resetAggregateResult(params: H3.CascaderParam) {
  // 置空地址汇总方式
  if (params.data.options.areaType) {
    (params.data.options as any).areaType = "";
  }
  // // 维度不存在percent字段
  // if (params.data.options.percent) {
  //   // 指标字段修改自身options
  //   (params.data.options as any).percent = "DEFAULT";
  //   (params.data.options as any).numberFormat.comma = false;
  //   (params.data.options as any).numberFormat.percent = false;
  //   (params.data.options as any).numberFormat.fraction = false;
  // } else {
  //   (params.chart.data.metric as any).forEach((item: any) => {
  //     item.options.percent = "DEFAULT";
  //     item.options.numberFormat.comma = false;
  //     item.options.numberFormat.percent = false;
  //     item.options.numberFormat.fraction = false;
  //   });
  // }
}

/**
 * 处理汇总结果显示
 * @param params
 */
function aggregateResultBusiness(params: H3.CascaderParam) {
  // 点击对应的checked等于true
  params.treeNode.checked = true;
  // 修改data的值
  params.data.options.percent = (params.treeNode as any).value;
  // 修改数值格式设置的值
  if ((params.treeNode as any).value === "PERCENT") {
    (params.data.options as any).numberFormat.percent = true;
    (params.data.options as any).numberFormat.fraction = 2;
    // 重置同/环比分析
    resetRatioAnalyze(params);
  } else {
    // 判断是否有设置同环比分析
    if (!params.data.options.ratio) {
      (params.data.options as any).numberFormat.comma = false;
      (params.data.options as any).numberFormat.percent = false;
      (params.data.options as any).numberFormat.fraction = false;
    }
  }
  // 刷新数据
  params.handleStyle();
  params.resizeChartView({ chart: params.chart, type: "data" });
}

/**
 * 重置同/环比分析
 * @param params
 */
function resetRatioAnalyze(params: H3.CascaderParam) {
  console.log("resetRatioAnalyze");
  // 点击维度、或者指标，数据取值不同
  if (params.source !== "metric") {
    params.chart.data.metric.forEach(item => {
      if (item.options.ratio) {delete item.options.ratio;}
    });
  } else {
    if (params.data.options.ratio) {delete params.data.options.ratio;}
  }
}

/**
 * 同/环比分析
 * @param params
 */
function ratioAnalyzeBusiness(params: H3.CascaderParam) {
  if (params.data.options.ratio && params.data.options.ratio === params.treeNode.value) {
    // todo 取消同环比
    // console.log('ratioAnalyzeBusiness', params);
    // console.log('选择了同一个同环比');
    // resetRatioAnalyze(params);
    // (params.data.options as any).numberFormat.percent = false;
    // (params.data.options as any).numberFormat.fraction = false;
    // params.resizeChartView({ chart: params.chart, type: 'data' });
    // return ;
  }

  // 同/环比分析增长率数组
  const ratioList: Array<number> = [2, 4, 6, 8];
  // 点击对应的checked等于true
  params.treeNode.checked = true;
  // 修改data的值
  const options = JSON.parse(JSON.stringify(params.data.options));
  options.ratio = (params.treeNode as any).value;
  params.data.options = options;
  // params.data.options.ratio = (params.treeNode as any).value;
  // 重置汇总结果占比设置
  resetAggregateResult(params);
  // 增长率的都添加百分符和添加两位小数
  (params.data.options as any).numberFormat.percent = ratioList.includes(
    Number((params.treeNode as any).value)
  );
  (params.data.options as any).numberFormat.fraction = ratioList.includes(
    Number((params.treeNode as any).value)
  )
    ? 2
    : false;
  // 刷新数据
  params.resizeChartView({ chart: params.chart, type: "data" });
}

/**
 * 设置数值格式
 * @param filter
 */
function setFormat(filter) {
  numberFormat = filter;
}

/**
 * 显示数值格式
 */
function showNumberFormat(params: H3.CascaderParam) {
  const modalConfirm = Modal.confirm({
    class: "h3-report-confirm__modal h3-report-number-format__modal",
    title: params.langType === "en" ? "Number Format" : "数值格式设置",
    content: h => {
      return h(NumberFormat, {
        props: {
          value: 999999.99,
          numberFormat: params.data.options.numberFormat as H3.Report.NumberFormat
        },
        on: {
          "set-format": setFormat
        }
      });
    },
    okText: params.langType === "en" ? "Sure" : "确定",
    cancelText: params.langType === "en" ? "Cancel" : "取消",
    width: 482,
    destroyOnClose: true,
    centered: true,
    closable: true,
    confirmLoading: true,
    iconType: "",
    onOk: e => {
      params.setNumberFormat({
        numberFormat: numberFormat,
        metricIndex: params.cascaderIndex,
        groupIndex: metricGroupIndex
      });
      params.resizeChartView({ chart: params.chart, type: "view" });
      modalConfirm.destroy();
    }
  } as any);
}

/**
  * 设置条件格式
  */
function setCondition({options,isApply}) {
  conditionFormat = options;
  displayConditionFormat = isApply;
}
function getConditions(uid, chart) {
  let conditions;
  if (chart.conditionFormats && chart.conditionFormats.length) {
    conditions = chart.conditionFormats.find(item => item.fieldUid === uid);
  }
  return conditions;
}
function sameField(uid, chart) {
  if (uid === copyConditionFormat.fieldUid) {
    return true;
  } else {
    copyConditionFormat = getConditions(uid, chart);
    return false;
  }
}


/**
 * 条件格式设置
 * @param params 
 */
function showConditionFormat(params: H3.CascaderParam) {
  const modalConfirm = Modal.confirm({
    class: "h3-report-confirm__modal h3-report-condition-format__modal",
    title: params.langType === "en" ? "conditionFormat" : "条件格式设置",
    content: h => {
      return h(ConditionFormat, {
        ref: "conditionFormat",
        props: {
          chart: params.chart as H3.Report.Chart,
          field: params.data,
          conditionFormat: params.data.options.conditionFormat,
          conditionOptions: copyConditionFormat && sameField(params.data.uid, params.chart)? copyConditionFormat: getConditions(params.data.uid, params.chart),
        },
        on: {
          "set-condition": setCondition
        }
      });
    },
    okText: params.langType === "en" ? "Sure" : "确定",
    cancelText: params.langType === "en" ? "Cancel" : "取消",
    width: 600,
    destroyOnClose: true,
    centered: true,
    closable: true,
    confirmLoading: true,
    iconType: "",
    onOk: e => {
      verifyConditionFormat(conditionFormat, params.data)
        .then(res => {
          if (res) {
            params.setConditionFormat({
              params: params,
              chart: params.chart,
              fieldIndex: params.cascaderIndex,
              conditionOptions: conditionFormat,
              isApply: displayConditionFormat,
            });
            params.resizeChartView({ chart: params.chart, type: "view" });
            modalConfirm.destroy();
          } else {
            // 更新错误样式
            modalConfirm.update({
              class:
                "h3-report-confirm__modal h3-report-condition-format__modal h3-report-condition-format__errormodal",
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    onCancel: () => {
      copyConditionFormat = getConditions(params.data.uid, params.chart);
    }
  } as any);
}

/**
 * 显示结果筛选器
 */
function showResultFilter(params: H3.CascaderParam) {
  const modalConfirm = Modal.confirm({
    class: "h3-report-confirm__modal h3-report-number-format__modal h3-report-result-filter__modal", // 主要是兼容正常弹窗样式
    title: params.langType === "en" ? "Result Filters" : "结果筛选器",
    content: h => {
      return h(ResultFilter, {
        props: {
          value: params.data.options.resultFilter as H3.Report.ResultFilter
        },
        on: {
          input: (data: H3.Report.ResultFilter) => {
            if (
              resultFilterData &&
              (data.condition || data.condition === 0) &&
              data.condition !== resultFilterData.condition
            ) {
              modalConfirm.update({
                class: "h3-report-confirm__modal h3-report-number-format__modal"
              });
            }
            resultFilterData = data;
          },
          cancel: () => {
            modalConfirm.destroy();
          }
        }
      });
    },
    okText: params.langType === "en" ? "Sure" : "确定",
    cancelText: params.langType === "en" ? "Cancel" : "取消",
    width: 640,
    destroyOnClose: true,
    centered: true,
    closable: true,
    confirmLoading: true,
    iconType: "",
    onOk: e => {
      // 校验 校验如果不通过 提示错误样式
      return new Promise(function (reslove, reject) {
        const res = verifyResultFilter(resultFilterData);
        if (res) {
          params.setResultFilter({
            resultFilter: resultFilterData,
            metricIndex: params.cascaderIndex,
            groupIndex: metricGroupIndex
          });
          params.resizeChartView({ chart: params.chart, type: "data" });
          reslove();
          modalConfirm.destroy();
        } else {
          // 更新错误样式
          modalConfirm.update({
            class: "h3-report-confirm__modal h3-report-number-format__modal h3-report-model-error"
          });
          reject();
        }
        reslove();
      });
    }
  } as any);
}

/**
 * 校验结果筛选器
 * @param params
 */
const verifyResultFilter = (data: H3.Report.ResultFilter) => {
  if (!data.display) {
    return true;
  } else {
    if (data.logic === NumberType.Range) {
      const resSet = JSON.parse(data.condition as string);
      return resSet.leftData < resSet.rightData;
    } else if (data.logic === NumberType.None || data.logic === NumberType.NotNone) {
      return true;
    } else {
      if (data.condition === 0) {return true;}
      if (!data.condition) {return false;}
    }
  }
  return true;
};
/**
 * 校验条件格式配置
 * @param data 
 */
 const verifyConditionFormat = (data: H3.Report.ConditionFormat, field) => {
  const fieldType = field.type;
  return new Promise((resolve, reject) => {
    if (!displayConditionFormat) {
      if (conditionFormat && conditionFormat.conditions.length) {
        conditionFormat.conditions.forEach((con, index) => {
          if (con.hasOwnProperty('status')) {
            delete con['status'];
          }
        });
      }
      copyConditionFormat = conditionFormat;
      resolve(true);
    } else {
      let result = true;
      const type = data.formatType;
      let hasStatus = false;
      if (type === "dataBar" || type === "colorScale") {
        if (conditionFormat && conditionFormat.conditions.length) {
          conditionFormat.conditions.forEach((con, index) => {
            if (checkValue(con.formula, con.value, con.valueType, fieldType)) {
              conditionFormat.conditions[index].status = checkValue(con.formula, con.value, con.valueType, fieldType);
            } else {
              if (con.hasOwnProperty('status')) {
                delete con['status'];
              }
            }
          });
          hasStatus = conditionFormat.conditions.some(obj => obj.hasOwnProperty("status"));
        }
      } else {
        hasStatus = false;
      }
      result = !hasStatus;
      copyConditionFormat = conditionFormat;
      resolve(result);
    }
  });
};

/**
 * 
 * @param formula 条件公式
 * @param value 条件式值 -- [value1, value2]
 * @param valueType 条件值类型 -- dynamic | fixed 动态值 | 固定值
 * @param fieldType 字段类型 -- number | date | string 
 * @returns 
 */
function checkValue(formula, value, valueType, fieldType?) {
  switch (fieldType) {
    case "number":
      if (valueType !== "dynamic") {
        if (rangeType.includes(formula)) {
          if (value[0] === null && value[1] === null) {
            return "empty-data";
          } else {
            if (value[0] !== null && value[1] !== null && value[0] >= value[1]) {
              return "error-data";
            }
          } 
        } else {
          if (value[0] === null) {
            return "empty-data";
          }
        }
      } else {
        if (rangeType.includes(formula)) {
          if (!value[0] && !value[1]) {return "empty-data";}
        } else {
          if (!value[0]) {return "empty-data";}
        }
      }
      break;
    case "string":
      if (!["None", "NotNone"].includes(formula)) {
        if (!value[0]) {
          return "error-string";
        }
      }
      break;
    default:
      break; 
  }

}

/**
 * 隐藏字段
 */
const handleHiddenField = (params: H3.CascaderParam) => {
  params.treeNode.checked = !params.treeNode.checked;
  (params.data.options as any).hidden = !params.data.options.hidden;
  params.resizeChartView({ chart: params.chart, type: "data" });
};
/**
 * 显示为数据条
 */
const handleTransformBar = params => {
  params.treeNode.checked = !params.treeNode.checked;
  (params.data.options as any).transformBar = !params.data.options.transformBar;
  params.resizeChartView({ chart: params.chart, type: "data" });
};
// dateFormat
/**
 * 隐藏字段
 */
const showDateFormat = (params: H3.CascaderParam) => {
  const modalConfirm = Modal.confirm({
    class: "h3-report-confirm__modal h3-report-date-format__modal", // 主要是兼容正常弹窗样式
    title: params.langType === "en" ? "RDate Format" : "日期格式设置",
    content: h => {
      return h(DateFormat, {
        props: {
          value: params.data.options.dateFormat as H3.Report.DateFormat
        },
        on: {
          input: (date: H3.Report.DateFormat) => {
            console.log(date);
            dateFormat = date;
          }
        }
      });
    },
    okText: params.langType === "en" ? "Sure" : "确定",
    cancelText: params.langType === "en" ? "Cancel" : "取消",
    width: 480,
    destroyOnClose: true,
    centered: true,
    closable: true,
    confirmLoading: true,
    iconType: "noneIcon",
    onOk: e => {
      console.log(params, dateFormat);
      params.setDateFormat({ dateFormat: dateFormat, dimensionIndex: params.cascaderIndex });
      // (params.data.options as any).dateFormat = dateFormat;
      params.resizeChartView({ chart: params.chart, type: "view" });
      modalConfirm.destroy();
    }
  } as any);
};

/**
 * 设置目标值格式
 * @param settings
 */
let targetValue: H3.Report.TargetValue = {
  valueType: "fixed"
};
function setTargetValue(settings: H3.Report.TargetValue) {
  targetValue = settings;
}

/**
 * 显示目标值设置
 * @param params
 */
function showTargetValue(params: H3.CascaderParam) {
  const modalConfirm = Modal.confirm({
    class: "h3-report-confirm__modal h3-report-target-value__modal",
    title: params.langType === "en" ? "Target Value" : "目标值设置",
    content: h => {
      return h(TargetValue, {
        props: {
          targetOptions: params.data.options.targetValue,
          dataSource: params.dataSource || {},
          formulas: params.chart.formulas
        },
        on: {
          "set-target": setTargetValue
        }
      });
    },
    okText: params.langType === "en" ? "Sure" : "确定",
    cancelText: params.langType === "en" ? "Cancel" : "取消",
    width: 420,
    destroyOnClose: true,
    centered: true,
    closable: true,
    confirmLoading: true,
    icon: "",
    iconType: "",
    onOk: e => {
      params.setTargetValue({
        targetValue: targetValue,
        metricIndex: params.cascaderIndex
      });
      if (targetValue.valueType === "fixed") {
        params.resizeChartView({ chart: params.chart, type: "view" });
      } else {
        params.resizeChartView({ chart: params.chart, type: "data" });
      }
      modalConfirm.destroy();
    }
  } as any);
}

/**
 * 参数在cascader-menu.vue中的paramOptions()方法中调用传参
 * @param options
 * @param params
 */
export default function(options: any, params: H3.CascaderParam) {
  metricGroupIndex = params.chart.type === "biax" ? params.source.split("-")[1] : 0;
  switch (options.funName) {
    // 修改重命名
    case "title":
      rename(params);
      break;
    // 汇总方式
    case "aggregateType":
      aggregateTypeBusiness(params);
      break;
    // 汇总结果显示
    case "aggregateResult":
      aggregateResultBusiness(params);
      break;
    // 同/环比分析
    case "ratioAnalyze":
      ratioAnalyzeBusiness(params);
      break;
    // 数值格式设置
    case "numberFormat":
      showNumberFormat(params);
      break;
    // 数值格式设置
    case "resultFilter":
      showResultFilter(params);
      break;
    // 隐藏字段
    case "hiddenField":
      handleHiddenField(params);
      break;
    // 明细表日期格式设置
    case "dateFormat":
      showDateFormat(params);
      break;
    case "targetValue":
      showTargetValue(params);
      break;
    case "transformBar":
      handleTransformBar(params);
      break;
    case "conditionFormat":
      showConditionFormat(params);
      break;
    default:
      console.log("异常错误!");
      break;
  }
  // 移除禁止拖拽class
  params.removeUndrag();
  // 隐藏cascader
  params.hideCascader();
}
