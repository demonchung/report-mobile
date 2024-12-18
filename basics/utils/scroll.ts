import { setInterval } from "./raf";

function scrollTop(el: HTMLElement, targetTop = 0, time?: number) {
  if (!time) {
    el.scrollTop = targetTop;
    return targetTop;
  }
  const spacingTime = 1000 / 60;
  let spacingIndex = time / spacingTime; // 计算循环的次数
  let nowTop = el.scrollTop; // 获取当前滚动条位置
  const everTop = (targetTop - nowTop) / spacingIndex; // 计算每次滑动的距离
  setInterval(() => {
    if (spacingIndex > 0) {
      spacingIndex--;
      el.scrollTop = nowTop += everTop;
    } else {
      return true; // 返回true，停止
    }
  }, spacingTime);
}

//节流 控制最后一次和第一次
function throttle(fn, wait, op = {}) {
  let timer: any = null;
  let pre = 0;
  return function () {
      const now = Date.now();
      if (now - pre > wait) {
          if (pre == 0 && !op.begin) {
              pre = now
              return
          }
          if (timer) {
              clearTimeout(timer)
              timer = null
          }
          fn()
          pre = now
      } else {
        if (!timer && op.end) {
          timer = setTimeout(() => {
              fn();
              timer = null
          }, wait)
        }
      } 
  }
}


export { scrollTop,throttle };

export default {
  scrollTop,throttle
};
