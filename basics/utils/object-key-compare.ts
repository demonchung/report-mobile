const recursion = (obj, fn, recor, baseObj, compObj) => {
  let key, cur;
  if (obj && typeof obj === "object") {
    for (key in obj) {
      if (!obj.hasOwnProperty(key)) {continue;}
      recor.push(key);
      cur = obj[key];
      if (cur && typeof obj === "object") {
        recursion(cur, fn, recor, baseObj, compObj);
      }
      // 将记录的层级关系数组传入回调
      fn(baseObj, compObj, recor);
      recor.pop();
    }
  }
}

const compare = (baseObj, compObj, keyArr) => {
  var base = baseObj, comp = compObj, i, len, key;
  for (let i = 0, len = keyArr.length; i < len; i++){
    key = keyArr[i];
    // 如果比较对象没有基准对象对应的key，将基准对象的值赋值给比较对象
    // 并跳出循环
    if (!comp.hasOwnProperty(key)){
      comp[key] = base[key];
      break;
    }
    // 比较下一个
    comp = comp[key];
    base = base[key];
  }
}

export {
  recursion,
  compare
};
