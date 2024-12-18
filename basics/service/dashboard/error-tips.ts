import options from "@h3/report-mobile/dist/options";
import ResponseCode from "@h3/report-mobile/basics/enum/response-code";

/**
 * 仪表盘错误提示
 * @param code
 * @param msg
 */
function dashboardTips(code: string, msg: string) {
  if (!options.message) {return;}
  const message = options.message;
  switch (code) {
    // case ResponseCode.PARAMINVALID:
    //   message.error('');
    //   break;
    case ResponseCode.SUCCESS:
      break;
    // case ResponseCode.NETWORKERROR:
    //   message.error("网络错误");
    //   break;
    // case ResponseCode.UNKNOWNERROR:
    //   message.error("未知错误");
    //   break;
    // case ResponseCode.SERVERERROR:
    //   message.error("服务端异常");
    //   break;
    // case ResponseCode.LOGINERROR:
    //   message.error("用户未登录");
    //   break;
    // case ResponseCode.CONNSTRINGEMPTY:
    //   message.error("服务端异常");
    //   break;
    // case ResponseCode.REPORTNOTEXIST:
    //   // 产品说这个errorcode不弹窗报错
    //   console.log("指定的报表不存在");
    //   break;
    // case ResponseCode.DATASOURCENOTEXIST:
    //   message.error("指定的数据源不存在");
    //   break;
    // case ResponseCode.PARAMCHARTERROR:
    //   message.error("服务端异常");
    //   break;
    // case ResponseCode.PARAMSCHEMACODENOTEXIST:
    //   message.error("服务端异常");
    //   break;
    // case ResponseCode.DATAOVERFLOW:
    //   message.error("汇总计算后数据量超过限制（1万条）");
    //   break;
    // case ResponseCode.PIVOTTABLEERROR:
    //   message.error("加载透视表错误");
    //   break;
    // case ResponseCode.FIELDMISSING:
    //   message.error("表单字段被修改");
    //   break;
    // case ResponseCode.MODELNOTEXIST:
    //   message.error("表单被修改");
    //   break;
    // case ResponseCode.RATIOERROR:
    //   message.error("同环比分析设置错误");
    //   break;
    default:
      message.error(msg);
      break;
  }
}
export default dashboardTips;
