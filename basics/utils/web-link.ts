/**
 * 校验weblink,以http://或https://开头
 */
function checkWebLink(value, webConfig: H3.Report.WebConfig) {
  let checkRes: H3.Report.webLinkCheck = {
    errorMessage: "",
    status: 0
  };
  if (!value) {
    checkRes.errorMessage = "请输入超链接";
  } else {
    if (webConfig && webConfig.linkProtocol && webConfig.linkProtocol.length > 0) {
      const reg = new RegExp(`^(${webConfig.linkProtocol.join("|")}):\/\/[^/]+\/?\S*`);
      const trimmedValue = value.trim(); // 清除链接前的空格
      if (!reg.test(trimmedValue)) {
        checkRes.errorMessage = `请输入${webConfig.linkProtocol.join("或")}超链接`;
      } else {
        checkRes.status = 1;
      }
    }
  }
  return checkRes;
}

export default {
  checkWebLink
};
export { checkWebLink };
