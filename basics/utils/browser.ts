/**
 * 判断手机系统
 */
export function judgeMobile() {
  const u = navigator.userAgent, app = navigator.appVersion;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return 'android';
  }else if (isIOS) {
    return 'ios';
  } else {
    return 'pc';
  }
}

/**
 * 判断是移动端还是PC端
 */

export const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

const userAgent = navigator.userAgent;

// IE
export const isIE = userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Edge") > -1 || (userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv") > -1);

// IE11
export const isIE11 = userAgent.indexOf('trident') > -1 && userAgent.indexOf('rv:11.0') > -1;


// 是否支付宝终端
export const isAlipay = !!userAgent.match(/Alipay/i);

// 是否微信终端(包括微信、企业微信) 之前的判断逻辑 就不改了 怕出问题
export const isWeixinBrowser = /micromessenger/.test(userAgent.toLowerCase());

// 是否微信终端(包括微信、企业微信)
export const isWechat = !!userAgent.match(/MicroMessenger/i);

// 企业微信(包括移动端、PC工作台)
export const isWxwork = /wxwork/i.test(userAgent);

// 是否微信浏览器(企业微信)
export const isWechatBrowser = isWechat && !isWxwork;

// 是否QQ浏览器
export const isQQ = !!(userAgent.indexOf("MQQBrowser") > -1 || userAgent.toLowerCase().match(/\sQQ/i));

// 是否飞书(包括移动端、PC工作台)
export const isTT = !!(userAgent.includes('Lark') || userAgent.includes('Feishu'));

// 是否飞书(PC工作台)
export const ttIsOnPc = isTT && (isWindowsNt() || isMac());

// 企业微信(PC工作台)
export const wxworkIsOnPc = isWxwork && (isWindowsNt() || isMac());

// webkit
export function isWebkit() {
  const reg = /webkit/i;
  return reg.test(userAgent);
}

// WindowsNt
export function isWindowsNt() {
  const reg = /Windows NT/i;
  return reg.test(userAgent);
}

// Mac
export function isMac() {
  const reg = /Macintosh; Intel Mac OS/i;
  return reg.test(userAgent);
}
