/**
 * raf版setTimeout及setInterval
 * 注意，requestAnimationFrame是循环调用的，setInterval中timer时刻在变化，
 * 因此，如果是初次调用，可以通过clearTimer来清除
 * 否则，只能通过回调中返回true来停止
 */
type callback = () => void;

function setTimeout(cb: callback, interval: number) {
  let timeoutTimer: number | null = null,
    now = Date.now,
    st = now(),
    et = st;
  const loop = () => {
    et = now();
    timeoutTimer = requestAnimationFrame(loop);
    if (et - st >= interval) {
      cb();
      clearTimer(timeoutTimer);
    }
  };
  timeoutTimer = requestAnimationFrame(loop);
  return timeoutTimer;
}

/**
 *
 * @param cb 回调方法
 * @param interval 间隔时间
 */
function setInterval(cb: callback, interval: number) {
  let intervalTimer: number | null = null,
    now = Date.now,
    st = now(),
    et = st,
    end = false;
  const loop = () => {
    et = now();

    if (et - st >= interval) {
      st = now();
      et = st;
      end = (cb() as any) ? true : false;
    }

    if (!end) {
      intervalTimer = requestAnimationFrame(loop);
    }
  };
  return (intervalTimer = requestAnimationFrame(loop));
}

function clearTimer(timer: number) {
  cancelAnimationFrame(timer);
}

export { setTimeout, setInterval, clearTimer };

export default {
  setTimeout,
  setInterval,
  clearTimer
};
