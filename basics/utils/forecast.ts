// [公式] 可以是0和1之间的任意值，它控制着新旧信息之间的平衡：当 [公式] 接近1，就只保留当前数据点；
// 当 [公式] 接近0时，就只保留前面的平滑值(整个曲线都是平的)
const a = 0.5;

/**
 * 计算预测数据
 */
export const forecastData = (data, num, isPercent) => {
  const res: any = [];
  let sp: any;
  let l = data.reduce((prev, cur, index, arr) => {
    if (data.length - 1 === index) {
      sp = prev;
    }
    return a * cur + (1 - a) * prev;
  }, data[0]);
  if (isPercent) {
    res.push(Math.floor(l * 10000) / 10000);
  } else {
    res.push(Math.floor(l * 100) / 100);
  }
  if (num > 1) {
    for (let i = 1; i < num; i++) {
      l = a * l + (1 - a) * sp;
      if (isPercent) {
        res.push(Math.floor(l * 10000) / 10000);
      } else {
        res.push(Math.floor(l * 100) / 100);
      }
    }
  }
  return res;
};

export default {
  forecastData
};
