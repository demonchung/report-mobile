export enum ReportAction {
  /******************** 删除 start ********************/
  GETDATASOURCENODES = "getDataSourceNodes", // 获取高级数据源列表
  MOVEFUNCTIONNODE = "moveFunctionNode", // 移动高级数据源节点
  REMOVEFUNCTIONNODE = "removeFunctionNode", // 删除高级数据源节点
  UPDATEDATASOURCENAME = "updateDataSourceName", // 更新高级数据源节点名称
  ADDDATASOURCEGROUP = "addDataSourceGroup", // 添加高级数据源组节点
  PREVIEWADVANCEDDATA = "previewAdvancedData", // 预览高级数据源数据
  /******************** 删除 end ********************/
  GETMODELLIST = "getModelList", // 获取高级数据列表
  GETMODELINFO = "getModelInfo", // 获取模型信息
  GETSTAGEMODELINFO = "getStageModelInfo", // 获取模型信息
  GETDATASOURCENODEINFO = "getDataSourceNodeInfo", // 获取节点配置信息
  SAVEDATASOURCESETTING = "saveDataSourceSetting", // 保存节点配置信息
  CHECKCOMPUTE = "checkCompute", // 保存节点配置信息
  PREVIEWSOURCEDATA = "previewSourceData", // 保存节点配置信息
  GETFIELDMODEL = "getFieldModel", // 获取字段模型
  GETDATASOURCEACCESS = "getDataSourceAccess", // 获取数据源权限列
  ADDDATASOURCEACCESS = "addDataSourceAccess", // 新增数据源权限
  REMOVEDATASOURCEACCESS = "removeDataSourceAccess", // 删除数据源权限关系
  PREVIEWSQL = "previewSql", // 获取预览sql
  SAVECUSTOMSQL = "saveCustomSql", // 保存自定义sql
  GETCUSTOMSQL = "getCustomSql", // 获取自定义sql
  GETADVANCEDLIMIT = "getAdvancedLimit", // 获取高级数据源配置限制信息
}

export enum ReportMutation {
  SETENV = "setEnv", //设置环境
  UPDATECANVAS = "updateCanvas",
  UPDATESETTING = "updateSetting",
  UPDATESTAGE = "updateStage",
  STOREAXIOSDATA = "storeAxiosData",
  SETDATASOURCEOPTIONS = "setDataSourceOptions",
  INITDATESOURCE = "initDateSource",
  SETDATASOURCETITLE = "setDataSourceTitle",
  UPDATENODE = "updateNode",
  UPDATEOPTIONS = "updateOptions",
  CHANGEEDITSTATUS = "changeEditStatus",
  SETFIELDSMAPPING = "setFieldsMapping",
  SETDATASOURCEID = "setDataSourceId",
  SETCACHEPREVIEWLIST = "setCachePreviewList", // 缓存预览数据
  SETLANGTYPE = "setLangType",    
}
