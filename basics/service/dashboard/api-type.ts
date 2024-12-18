export enum DashbordApis {
  SAVEREPORT = "saveReport",
  GENERATEREPORT = "generateReport",
  GETREPORT = "getReport",
  GETFILTERREPORT = "getFilterReport", // 获取所有筛选组件
  GETDATASOURCELIST = "getDataSourceList",
  GETDATASOURCE = "getDataSource",
  GETCHARTDATA = "getChartData",
  DATAEXPORT = "dataExport",
  WXWORKEXPORT = "wxworkExport",
  WXWORKPOLLEXPORT = "wxworkPollExport",
  DOWNLOADBYURL = "downloadByUrl",
  GETMAPJSON = "getMapJson",
  REMOVEREPORT = "removeReport",
  ADDSINGLECHART = "addSingleChart",
  REMOVESINGLECHART = "removeSingleChart",
  BETCHREMOVECHARTS = "betchRemoveChart",
  UPDATESINGLECHART = "updateSingleChart",
  SETATTRIBUTES = "setAttributes", // 设置全局属性
  UPDATECHARTTITLE = "updateChartTitle", // 更新图表标题
  UPDATEPOSITIONS = "updatePositions", // 批量更新图表位置
  UPDATEGLOBALSTYLES = "updateGlobalStyles", // 更新全局样式
  UPDATEMOBILEOPTIONS = "updateMobileOptions", // 更新移动端样式
  GETATTACHMENT = "getAttachment", // 获取图片服务器地址
  UPLOADFILE = "uploadFile", // 上传图片
  REMOVEFILE = "removeFile", // 删除文件
  LOGTRACE = "logTrace", // 埋点
  GETCHARTS = "getCharts", // 获取图表信息
  GETADVANCEDLIST = "getAdvancedList", //获取高级数据源
  GETSOURCELIST = "getSourceList", //获取数据表
  CHECKCOMPUTE = "checkCompute", //校验计算字段公式
  GETCONVERTREPORT = "getConvertReport", //获取转换后的报表
  MIGRATEREPORT = "migrateReport", //迁移报表
}

export default DashbordApis;
