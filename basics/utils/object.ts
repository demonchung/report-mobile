/**
 * 对象深拷贝
 * @param obj
 */
function objectDeepCopy(obj: Object) {
  const deep = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key]!==null) {
        deep[key] = objectDeepCopy(obj[key]); 
      } else {
        deep[key] = obj[key];
      }
    }
  }
  return deep;
}

/**
 * 对象比较赋值
 * @param baseObj 基准对象
 * @param compObj 赋值对象
 */
function compare(baseObj: any, compObj: any) {
    if(compObj instanceof Object) {
      for(const key in compObj) {
        if(compObj.hasOwnProperty(key) && baseObj[key]) {
          if(compObj[key] instanceof Object) {
            compare(baseObj[key],compObj[key]);
          }else {
            baseObj[key] = compObj[key];
          }
        }
      }
    }
}
/**
 * key转换大小写
 * @param obj
 */
function upperObjKey(obj: any) {
  for (const item in obj) {
    obj[item.toUpperCase()] = obj[item];
  }
  return obj;
}

export {
  objectDeepCopy,
  compare,
  upperObjKey
}

export default {
  objectDeepCopy,
  compare,
  upperObjKey
}
