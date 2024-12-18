import options from "@h3/report-mobile/dist/options";
import ResponseCode from "@h3/report-mobile/basics/enum/response-code";

/**
 *  错误提示
 * @param code
 * @param msg
 */
function dataSourceTips(code: string, msg: string) {
  if (!options.message) {return;}
  const message = options.message;
  switch (code) {
    case ResponseCode.SUCCESS:
      break;
    default:
      message.error(msg);
      break;
  }
}
export default dataSourceTips;
