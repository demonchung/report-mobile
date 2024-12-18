export enum DataSourceApis {
  GETDATASOURCENODES = "getDataSourceNodes", // 获取数据源列表
  MOVEDATASOURCENODE = "moveDataSourceNode",
  UPDATEDATASOURCENODESORT = "updateDataSourceNodeSort",
  REMOVEDATASOURCENODE = "removeDataSourceNode",
  UPDATEDATASOURCENAME = "updateDataSourceName",
  ADDDATASOURCEGROUP = "addDataSourceGroup",
  PREVIEWADVANCEDDATA = "previewAdvancedData",
  GETMODELLIST = "getModelList",
  GETMODELINFO = "getModelInfo",
  GETDATASOURCENODEINFO = "getDataSourceNodeInfo",
  SAVEDATASOURCESETTING = "saveDataSourceSetting",
  GETSTAGEMODELINFO = "getStageModelInfo",
  CHECKCOMPUTE = "checkCompute",
  PREVIEWSOURCEDATA = "previewSourceData", //预览高级数据源配置数据
  GETFIELDMODEL = "getFieldModel",
  GETDATASOURCEACCESS = "getDatsourceAccess", // 获取高级数据源权限
  ADDDATASOURCEACCESS = "addDatsourceAccess", // 新增高级数据源权限
  REMOVEDATASOURCEACCESS = "removeDatsourceAccess", // 删除高级数据源权限
  PREVIEWSQL = "previewSql", // 查询自定义sql
  SAVECUSTOMSQL = "saveCustomSql", // 保存自定义sql
  GETCUSTOMSQL = "getCustomSql", // 获取自定义sql
  EXPORTEXCEL = "exportExcel", //导出excel数据
  COPYADVANCED = "copyAdvanced", // 复制数据源
  COPYDCUSTOMSQL = "copyCustomsql",
  GETADVANCEDLIMIT = "getAdvancedLimit", // 高级数据源配置限制信息
}

export default DataSourceApis;
