// 收集性能信息
function getPerformance(){
  if (!window.performance) {return}
  const timing = window.performance.timing
  const performance = {
      // 重定向耗时
      pfmRedirect: timing.redirectEnd - timing.redirectStart,
      // DOM 渲染耗时
      pfmDom: timing.domComplete - timing.domLoading,
      // 页面加载耗时
      pfmLoad: timing.loadEventEnd - timing.navigationStart,
      // 获取性能信息时当前时间
      pfmActiveTime: new Date().getTime(),
  }

  return performance
}




export {
  getPerformance
}

export default {
  getPerformance
}
