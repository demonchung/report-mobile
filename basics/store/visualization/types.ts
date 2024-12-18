export enum ReportGetters {
  Example = 'example'
}

export enum ReportAction {
  GETREPORT = 'getReport', // 获取报表
  ADDCHART = 'addChart', // 新增图表
  GETSCHEMA = 'getSchema', // 获取数据模型
  LOADCHARTDATA = 'loadChartData', // 加载图表数据
  GETCHARTDATA = 'getChartData', // 获取图表数据
  SAVECHARTS = 'saveCharts', // 批量保存
  SAVECHART = 'saveChart', // 保存图表
  REMOVECHART = 'removeChart' // 删除图表
}

export enum ReportMutation {
  RESETREPORT = 'resetReport', // 重置的报表
  SETACTIVECHART = 'setActiveChart', // 设置激活的图表
  SETCHARTMODULES = 'setChartModules', // 设置图表模块
  REMOVECHARTMODULES = 'removeChartModules', // 删除图表模块
  SETGLOBALFILTER = 'setGlobalFilter', //设置全局筛选条件
  HANDLESORT = 'handleSort', //处理排序字段
  UPDATECHARTS = 'updateCharts', // 跟新图表
  SETLIMIT = 'setLimit', // 设置数据限制
  RESIZECHARTVIEW = 'resizeChartView' // 刷新图表
}
