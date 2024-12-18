import options from "@h3/report-mobile/dist/options";
import axios from "axios";
import env from "../env";
const CancelToken = axios.CancelToken;

export const Instance = axios.create({
  headers: Object.assign(
    {},
    options.requestHeader instanceof Function ? options.requestHeader() : options.requestHeader,
    {
      "Content-Type": "application/json"
    }
  )
});
const  pureAxios = axios.create();


// 请求拦截器
Instance.interceptors.request.use(
  (config: any) => {
    if (config.method === "get") {
      if(Object.keys(config.data).length) {
        config.url +=
          "?" +
          Object.keys(config.data)
            .map(
              (key: any) =>
                `${key}=${typeof config.data[key] ? JSON.stringify(config.data[key]) : key}`
            )
            .join("&");
      }
    }
    // config.data = qs.stringify(config.data);
    return config;
  },
  (error: any) => console.log(error)
);
// 兼容氚云移动端
Instance.defaults.transformRequest = [
  function transform(data) {
    return JSON.stringify(data);
  }
];
[pureAxios,Instance].forEach(item=> {
// 响应拦截器
  item.interceptors.response.use(
    (response: any) => {
      let responseData = response.data;
      
      if (typeof responseData !== "object") {
        responseData = JSON.parse(responseData);
        response.data = responseData;
      }
      if(response.data && response.data.data) {
        if(response.headers && response.headers['x-r-traceid'] ) {
          Object.assign(response.data.data,{'traceId': response.headers['x-r-traceid'] })  
        }
        if(response.request && response.request.responseURL) {
          Object.assign(response.data.data,{'url': response.request.responseURL })  
        }
      }
      
      return response.data;
    },
    (error: any) => {
      let res: any;
      if (error.name === "Error") {
        switch (error.message) {
          case "Network Error":
            res = { code: "network.error", msg: "网络异常，请稍后再试" };
            break;
          default:
            break;
        }
      }
      return res;
    }
  );
});


/**
 * fetch 函数
 * @param url
 * @param method
 * @param data
 * @param responseType
 * @param host
 * @param need
 */
export default function fetch<T>({
  url,
  method = "get",
  data,
  responseType,
  host,
  headers,
  isInitRequest = false
}: H3.ReportFetch.Params): H3.ReportFetch.Result<T> {
  // todo 优化
  const realUrl = options.baseUrl || host || env;
  if (realUrl) {
    url = realUrl + "/" + url;
  }
  const source = CancelToken.source();
  const requestConfig = {
    url,
    data,
    method: method.toUpperCase(),
    cancelToken: source.token,
    headers: Object.assign(
      {},
      {
        "Content-Type": "application/json"
      },
      options.requestHeader instanceof Function ? options.requestHeader() : options.requestHeader,
      headers
    )
  };
  if (responseType) {
    requestConfig["responseType"] = responseType;
  }
  return {
    promise: new Promise<T>((resolve) => {
      const httpRequest = isInitRequest ? pureAxios : Instance;
      httpRequest.request(requestConfig).then((response: H3.ReportAPI.Response) => {
        resolve(response as any);
      });
    }),
    source
  };
}
