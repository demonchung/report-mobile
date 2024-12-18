/**
 * 获取url参数值
 * @param key
 * @param url
 * @returns {{}}
 */
function getUrlVar(key: string, url: string = window.location.href) {
  return getUrlVars(url)[key];
}

/**
 * 获取url所有的参数值
 * @param url
 * @returns {{}}
 */
export function getUrlVars(url: string = window.location.href) {
  let vars: any = {},
    hash;
  url = decodeURI(url).replace(window.location.origin, "");
  const index: string[] = url.split("?");
  let hashes: string[];
  if (index.length > 1) {
    hashes = index[1].split("&");
    for (let i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars[hash[0].toLocaleLowerCase()] = decodeURIComponent(hash[1]);
    }
  }
  return vars;
}

/**
 * 特殊url，结构如:https://infrastructure.h3yun.com/home.html?v=20191021110828#/ReportDataSourceDesigner?id=6da9deec
 * 获取指定的参数
 */
export function getUrlNodeId(variable: string = "id") {
  const query: string[] = location.href.split("?");
  if (query.length > 1) {
    const vars = query[query.length - 1].split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair: string[] = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
  }

  return null;
}

export default {
  getUrlVars,
  getUrlVar
};
