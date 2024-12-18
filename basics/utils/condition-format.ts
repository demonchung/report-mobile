import { rangeType } from "@h3/report-mobile/basics/components/condition-format/formulaType";

/**
 * 条件格式公式运算 -- 数字类型
 */
const operators = {
  Above: (a, b) => a > b,
  NotBelow: (a, b) => a >= b,
  Below: (a, b) => a < b,
  NotAbove: (a, b) => a <= b,
  Equal: (a, b) => a === b,
  NotEqual: (a, b) => a !== b,
  BelowBelow: (a, b, c) => ((b || b === 0) && (c || c === 0)) ? (a > b && a < c) : ((b || b === 0) ? a > b : a < c),
  BelowNotAbove: (a, b, c) => ((b || b === 0) && (c || c === 0)) ? (a > b && a <= c) : ((b || b === 0) ? a > b : a <= c),
  NotAboveBelow: (a, b, c) => ((b || b === 0) && (c || c === 0)) ? (a >= b && a < c) : ((b || b === 0) ? a >= b : a < c),
  NotAboveNotAbove: (a, b, c) => ((b || b === 0) && (c || c === 0)) ? (a >= b && a <= c) : ((b || b === 0) ? a >= b : a <= c),
};

/**
 * 条件格式公式运算 -- 文本类型
 */
const stringOperators = {
  Equal: (a, b) => a === b, // 等于
  NotEqual: (a, b) => a !== b, // 不等于
  In: (a, b) => a && a.includes(b), // 包含
  NotIn: (a, b) => a && !a.includes(b), // 不包含
  None: (a) => !a, // 为空
  NotNone: (a) => a // 不为空
};
/**
 * 
 * 线性插值的方式计算获取颜色值
 * colors: [#ffffff, #000000]
 */
const getGradientColor = (min, max, colors, value) => {
  // 计算插值系数
  const ratio = (value - min) / (max - min);
  const rgbColor1 = turnRgb(colors[0]);
  const rgbColor2 = turnRgb(colors[1]);
  // 计算渐变色
  const r = Math.round(rgbColor1[0] * (1 - ratio) + rgbColor2[0] * ratio);
  const g = Math.round(rgbColor1[1] * (1 - ratio) + rgbColor2[1] * ratio);
  const b = Math.round(rgbColor1[2] * (1 - ratio) + rgbColor2[2] * ratio);
  let bgcolor = "rgb(" + r + ", " + g + ", " + b + ")";
  bgcolor = min === max ? colors[0] : bgcolor;
  const rgb = turnRgb(bgcolor);
  //自适应字体颜色 
  let fontColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#707481' : '#FFFFFF';
  fontColor = min === max ? ((rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 186 ? '#707481' : '#FFFFFF') : fontColor;
  return {
    bgcolor,
    fontColor
  };
};

/**
 * 明细表条件格式--区间色--根据配置获取单个单元格颜色
 * @param option 条件格式配置
 * @param datasource 明细表数据
 * @param value 当前单元格的值
 * @param uid 当前单元格字段的uid
 * @param index 当前单元格所在列的索引
 * @param cIndex 当前单元格所在列的索引, 一对多的情况下, 会有多个单元格
 * @param key 当前单元格所在列的key , 是否是一对多的情况
 * @param fieldType 当前单元格字段的类型
 */
const getColorScaleColor = (option, datasource, value, uid, index, cIndex, key, fieldType) => {
  const resultColor: any = {
    bgcolor: 'unset',
    fontColor: 'unset'
  };
  let color = "";
  if (option.conditions.length) {
    for (let i = 0; i < option.conditions.length; i++) {
      const condition = option.conditions[i];
      color = handleDiffrentType(condition, datasource, index, cIndex, key, value, fieldType);
      // 因为区间色的条件格式是顺序靠前的规则优先满足, 所以找到第一个满足条件的就可以跳出循环了
      if (color) {
        break;
      }
    }
  }
  if (color) {
    resultColor.bgcolor = color;
    //自适应字体颜色
    const rgb = turnRgb(color);
    const fontColor = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 > 186 ? "#707481" : "#FFFFFF";
    resultColor.fontColor = fontColor;
  }

  return resultColor;
};

/**
 * 
 * 不同字段类型的颜色获取逻辑不一样, 需要分开处理 
 * @param fieldType 
 * @returns 
 */
const handleDiffrentType = (condition, datasource, index, cIndex, key, value, fieldType) => {
  const fType = fieldType.toLowerCase();
  let color = "";
  switch (fType) {
    case "string":
      const strOperator = stringOperators[condition.formula];
      const computeValue = condition.value[0];
      if (["None", "NotNone"].includes(condition.formula)) {
        if (strOperator(value)) {
          color = condition.color;
        }
      } else {
        // 除为空和不为空, 空值不参与运算
        if (strOperator(value, computeValue) && value) {
          color = condition.color;
        }
      }
      break;
    case "number":
      const a = parseFloat(value);
      let b; // 区间色的第一个值 用于比较
      let c; // 区间色的第二个值
      if (condition.valueType === "fixed") {
        if (condition.value[0] !== null) { b = parseFloat(condition.value[0]); }
        if (condition.value[1] !== null) { c = parseFloat(condition.value[1]); }
      }
      // 动态时, 与同个表格其他字段的值进行比较, 需要从datasource中获取同一行的值来进行运算
      if (condition.valueType === "dynamic") {
        if (condition.value[0] !== null) { b = getDynamicData(condition.value[0], datasource, index, cIndex, key); }
        if (condition.value[1] !== null) { c = getDynamicData(condition.value[1], datasource, index, cIndex, key); }
      }
      const operator = operators[condition.formula];
      if (rangeType.includes(condition.formula)) {
        if (operator(a, b, c)) {
          color = condition.color;
        }
      } else {
        if (operator(a, b)) {
          color = condition.color;
        }
      }
      break;
    default:
      break;
  }
  return color;
}

/**
 * 
 * 获取条件格式中区间色用于比较的动态数据
 */
const getDynamicData = (uid, datasource, index, cIndex, key) => {
  let result: any = '';
  if (uid) {
    const value = datasource[index][uid];
    result = Array.isArray(value) ? value[cIndex] : value;
  }
  const regex = /%$/;
  const dotReg = /,/g;
  const reg = /[,]/;
  result = regex.test(result) ? parseFloat(result.replace(/,/g, '').replace(/%/g, '')) / 100 : Number(reg.test(result) ? result.replace(dotReg, '') : result)
  return parseFloat(result);
};

const checkEmpty = (condition, datasource) => {
  if (condition.valueType === "fixed") {
    return true;
  } else {
    const value1 = datasource[0].hasOwnProperty(condition.value[0]);
    const value2 = datasource[0].hasOwnProperty(condition.value[1]);
    return rangeType.includes(condition.formula) ? value1 && value2 : value1;
  }
};

const getDataBarColor = (col, value, chart, setFontColor) => {
  const resultColor = {
    bgcolor: 'unset',
    fontColor: 'unset'
  };
  let color = "";
  if (col && chart && chart.conditionFormats) {
    const option = chart.conditionFormats.find((item) => item.fieldUid === col.key);
    if (option && option.conditions && option.conditions.length) {
      for (let i = 0; i < option.conditions.length; i++) {
        const condition = option.conditions[i];
        const regex = /%$/;
        const dotReg = /,/g;
        const reg = /[,]/;
        const a = regex.test(value)
          ? parseFloat(value.replace(/,/g, "").replace(/%/g, "")) / 100
          : Number(reg.test(value) ? value.replace(dotReg, "") : value);
        let b;
        let c;
        if (condition.value[0] !== null) { b = parseFloat(condition.value[0]); }
        if (condition.value[1] !== null) { c = parseFloat(condition.value[1]); }
        const operator = operators[condition.formula];
        if (rangeType.includes(condition.formula)) {
          if (operator(a, b, c)) {
            color = condition.color;
            break;
          }
        } else {
          if (operator(a, b)) {
            color = condition.color;
            break;
          }
        }
      }
    }
  }

  if (color) {
    resultColor.bgcolor = color;
    //自适应字体颜色
    //  let rgb = turnRgb(color);
    //  let fontColor = (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 186 ? '#121933' : '#FFFFFF';
    //  resultColor.fontColor = fontColor;
  } else {
    const regex = /%$/;
    const dotReg = /,/g;
    const reg = /[,]/;
    const a = regex.test(value)
      ? parseFloat(value.replace(/,/g, "").replace(/%/g, "")) / 100
      : Number(reg.test(value) ? value.replace(dotReg, "") : value);
    resultColor.bgcolor = a > 0 ? "#9FE9C6" : "#FFBFBF";
    resultColor.fontColor = "#707481";
  }
  if (setFontColor) { resultColor.fontColor = setFontColor; }
  return resultColor;
};


/**
 * 
 * @param colorString 将十六进制颜色转换为rgb颜色
 * @returns 
 */
const turnRgb = (colorString) => {
  return [
    parseInt(colorString.substring(1, 3), 16),
    parseInt(colorString.substring(3, 5), 16),
    parseInt(colorString.substring(5, 7), 16)
  ]
};

export { getGradientColor, getColorScaleColor, getDataBarColor };
