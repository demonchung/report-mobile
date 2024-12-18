export enum ResponseCode {
  PARAMINVALID = "param.invalid", // 参数不可用
  SUCCESS = "success", // 成功
  NETWORKERROR = "network.error", //网络错误
  SERVERERROR = "server.error", // 服务端出错
  REPORTNOTEXIST = "reporter.not.exist", // 服务端出错
  UNKNOWNERROR = "unknown.error", // 未知错误
  LOGINERROR = "login.error", // 未登录
  CONNSTRINGEMPTY = "conn.string.empty", // 连接字符串为空
  DATASOURCENOTEXIST = "data.source.not.exist", // 指定的数据源不存在
  PARAMCHARTERROR = "param.chart.error", // 图标参数异常
  PARAMSCHEMACODENOTEXIST = "param.schemacode.not.exist", // schemaCode参数不存在
  DATAOVERFLOW = "data.overflow", // 数据溢出
  PIVOTTABLEERROR = "pivottable.error", // 透视表处理错误
  FIELDMISSING = "field.missing", // 字段丢失
  MODELNOTEXIST = "model.not.exist", // 指定的模型不存在
  RATIOERROR = "ratio.error", // 同环比分析错误
  AIGCEXECUTEFAIL = "apiCall.execute.fail", // AIGC执行失败
}
export default ResponseCode;
