/**
 * 数值转换
 * @param value
 * @param comma
 * @param percent
 * @param fraction
 */
export function convertNumber(
  value: number | string,
  { fraction, comma, percent }: H3.Report.NumberFormat
) {
  if (value === null || value === undefined || value === "") {return "";}
  let unit = "";
  if (typeof fraction === "number") {
    if (fraction === 0 || fraction || percent) {
      // value = selfFixed(parseFloat(value.toString()), (fraction as any) + (percent ? 2 : 0));
      value = parseFloat((value).toString()).toFixed((fraction as any) + (percent ? 2 : 0));
    } else {
      value = parseFloat(value.toString());
    }
  }
  if (percent) {
    value = parseFloat(value.toString()) * 100;
    value = Math.round(value * 1000000) / 1000000; // 防止小数有效数字标志
    value = (fraction ? value.toFixed(fraction as any) : value);
    // value = fraction ? selfFixed(value, fraction) : value;
    unit = "%";
  }
  if (comma) {
    const reg =
      value.toString().indexOf(".") > -1
        ? /(\d{1,3})(?=(?:\d{3})+\.)/g
        : /(\d{1,3})(?=(?:\d{3})+$)/g; //千分符的正则
    value = value.toString().replace(reg, "$1,"); //千分位格式化
  }
  return value + unit;
}
/**
 * 大数字转换中文尾缀
 * @param value
 */
export function stringNumber(value: number): string | number {
  let unit: string = "";
  let stringValue: number | string = value;
  if ((value > 9999 && value < 100000000) || (value < -9999 && value > -100000000)) {
    stringValue = value / 10000;
    unit = "万";
  } else {
    if (value > 99999999 || value < -99999999) {
      stringValue = value / 100000000;
      unit = "亿";
    }
  } 
  (stringValue as string | number) += unit;
  return stringValue;
}

export function commaFormat(str: string) {
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  const nums = str.split(".");
  nums[0] = nums[0].replace(reg, "$&,");
  return nums.join(".");
}

/**
 * 实现toFixed四舍五入
 * @param number
 * @param n
 */
function selfFixed(number, n) {
  if (n > 20 || n < 0) {
    throw new RangeError("toFixed() digits argument must be between 0 and 20");
  }
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof n == "undefined" || n == 0) {
    return Math.round(number).toString();
  }
  let result = number.toString();
  const arr = result.split(".");
  // 整数的情况
  if (arr.length < 2) {
    result += ".";
    for (let i = 0; i < n; i += 1) {
      result += "0";
    }
    return result;
  }
  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length == n) {
    return result;
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += "0";
    }
    return result;
  }
  result = integer + "." + decimal.substr(0, n);
  const last = decimal.substr(n, 1);
  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n);
    // 正负值情况下，尾数加一的处理
    const indec = /^-/.test(integer) ? -1 : 1;
    result = (Math.round(parseFloat(result) * x) + indec) / x;
    // result = (Math.round((parseFloat(result) * x)) + 1) / x;
    result = result.toFixed(n);
  }
  return result;
}

export default {
  convertNumber,
  stringNumber
};
