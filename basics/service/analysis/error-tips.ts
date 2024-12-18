import options from "@h3/report-mobile/dist/options";
import ResponseCode from "@h3/report-mobile/basics/enum/response-code";

/**
 * 统计分析错误提示
 * @param code
 */
function analysisTips(code: string, msg: string) {
  if (!options.message) {return;}
  const message = options.message;
  switch (code) {
    case ResponseCode.SUCCESS:
      break;
    case ResponseCode.AIGCEXECUTEFAIL: 
      break;
    default:
      message.error(msg, 2);
      break;
  }
}
export default analysisTips;
