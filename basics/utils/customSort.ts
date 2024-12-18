import getAliaValue from "@h3/report-mobile/basics/utils/alias";
/**
 * 自定义排序规则，公共方法
 * demotionArr：需要排序的结果集
 * isTwoDemotion：是否二维排序
 * customSorts: 需要排序的字段
 * */

const customSort = function (dimentionKeyValue, isTwoDemotion, customSorts, alias) {
  if (!customSorts) {return dimentionKeyValue;}
  if (isTwoDemotion) {
    return getSortArray(customSorts, dimentionKeyValue);
    //demotionArr =[name]
  } else {
    return getOneAwaSort(customSorts, dimentionKeyValue, alias);
  }
};

// 返回需要排序字段数组集合
const getSortArray = (customSorts, dimentionKeyValue) => {
  Object.keys(customSorts).forEach(uid => {
    if (dimentionKeyValue[uid]) {
      dimentionKeyValue[uid] = getSortResult(dimentionKeyValue[uid], customSorts[uid]);
    }
  });
  return dimentionKeyValue;
};

const getSortResult = (arr, rule) => {
  if (!rule) {return arr;}
  const mapValue = {};
  let copyArr = JSON.parse(JSON.stringify(arr));
  Object.values(rule).forEach((name) => {
    if (name !== "") {mapValue[name as string] = [];}
  });
  let deleteNum = 0;
  arr.forEach((value, index) => {
    if (mapValue[value]) {
      mapValue[value].push(value);
      copyArr.splice(index - deleteNum, 1);
      deleteNum++;
    }
  });
  Object.values(rule)
    .reverse()
    .forEach(name => {
      if (name !== "" && mapValue[name as string]) {
        const valueArr = mapValue[name as string];
        valueArr &&
          valueArr.length &&
          valueArr.forEach(val => {
            copyArr.unshift(val);
          });
      }
    });
  return copyArr;
};
// 临时改造排序支持对象排序
const getObjArrSortResult = (arr, key, rule) => {
  if (!rule) {return arr;}
  const mapValue = {};
  let copyArr = JSON.parse(JSON.stringify(arr));
  Object.values(rule).forEach((name) => {
    if (name !== "") {mapValue[name as string] = [];}
  });
  let deleteNum = 0;
  arr.forEach((obj, index) => {
    obj[key] = obj[key] || "为空";
    if (mapValue[obj[key]]) {
      mapValue[obj[key]].push(obj);
      copyArr.splice(index - deleteNum, 1);
      deleteNum++;
    }
  });
  Object.values(rule)
    .reverse()
    .forEach(name => {
      if (name !== "" && mapValue[name as string]) {
        const valueArr = mapValue[name as string];
        valueArr &&
          valueArr.length &&
          valueArr.forEach(val => {
            copyArr.unshift(val);
          });
      }
    });
  return copyArr;
};

const getOneAwaSortResult = (arr, rule) => {
  if (!rule) {return arr;}
  const mapValue = {};
  const copyArr = JSON.parse(JSON.stringify(arr));

  Object.values(rule).forEach((name) => {
    if (name !== "") {mapValue[name as string] = [];}
  });
  let deleteNum = 0;
  arr.forEach((values, index) => {
    const value = values[0];
    if (mapValue[value]) {
      mapValue[value].push(values);
      copyArr.splice(index - deleteNum, 1);
      deleteNum++;
    }
  });
  Object.values(rule)
    .reverse()
    .forEach(name => {
      if (name !== "" && mapValue[name as string]) {
        const valueArr = mapValue[name as string];
        valueArr &&
          valueArr.length &&
          valueArr.forEach(val => {
            copyArr.unshift(val);
          });
      }
    });
  return copyArr;
};

//一维
const getOneAwaSort = (customSorts, dimentionKeyValue, alias) => {
  const metricRangeData: Array<Array<any>> = [];
  Object.keys(customSorts).forEach(uid => {
    if (dimentionKeyValue[uid]) {
      dimentionKeyValue[uid] = getOneAwaSortResult(dimentionKeyValue[uid], customSorts[uid]);
    }
  });
  Object.values(dimentionKeyValue).forEach((arr: any) => {
    arr.forEach(vArr => {
      metricRangeData.push(vArr.slice(1));
    });
  });
  dimentionKeyValue.metricRangeData = metricRangeData;
  return dimentionKeyValue;
};

const handleMetricRange = (metricRangeData, group, groupArray, data) => {
  const mapValueKey = {}; //用于记录index
  Object.keys(group).forEach((name, index) => {
    mapValueKey[name] = index;
  });
  const indexArr: any = []; //用来缓存index索引
  groupArray.forEach(name => {
    indexArr.push(mapValueKey[name]);
  });
  metricRangeData.forEach(mArr => {
    const copyArr = JSON.parse(JSON.stringify(mArr));
    mArr.forEach((val, index) => {
      mArr[index] = copyArr[indexArr[index]];
    });
  });
  data &&
    data.length &&
    data.forEach((d, index) => {
      data[index].splice(1);
      data[index] = data[index].concat(metricRangeData[index]);
    });
  return metricRangeData;
};

const validateNeedSort = (sort, options) => {
  const uid = options.uid || "";
  const metch = sort.find((el) => el.uid === uid);
  if (metch && metch.options && metch.options.isCustomSort) {return true;}
  return false;
};

export { handleMetricRange, validateNeedSort, getObjArrSortResult };

export default customSort;
