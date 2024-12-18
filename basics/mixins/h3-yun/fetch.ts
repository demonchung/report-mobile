import axios from "axios";
import qs from "qs";

const instance = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

const DATA_PARAM_PREFIX = "PostData"; // 请求统一前缀管理

// 请求拦截器
instance.interceptors.request.use(
  (config: any) => {
    const data = config.data;
    if (DATA_PARAM_PREFIX in data) {
      let requestData = data[DATA_PARAM_PREFIX];
      if (typeof requestData === "object") {
        requestData = JSON.stringify(requestData);
      }
      const requestParams = {
        PostData: requestData
      };
      config.data = qs.stringify(requestParams);
    } else {
      config.data = qs.stringify(data);
    }
    return config;
  },
  (error: any) => error
);
// 响应拦截器
instance.interceptors.response.use(
  (response: any) => {
    let responseData = response.data;
    if (typeof responseData !== "object") {
      responseData = JSON.parse(responseData);
      response.data = responseData;
    }
    return response.data;
  },
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log(401);
          break;
        default:
          break;
      }
    }
    return error;
  }
);

export default function fetch<T>(config: any): Promise<T>;
export default function fetch<T>(
  url: string,
  data: any,
  method?: string,
  allowAnonymous?: boolean,
  baseURL?: string
): Promise<T>;

export default function fetch<T>(...args: any): Promise<T> {
  const defaultReturnData: any = {
    Successful: false,
    ReturnData: {}
  };
  let requestConfig: any;
  let allowAnonymous = false;
  if (args.length === 0) {
    if (args[4]) {
      axios.defaults.baseURL = args[4];
    }
    return Promise.resolve(defaultReturnData);
  } else if (typeof args[0] === "object") {
    requestConfig = args[0];
    allowAnonymous = !!args[1];
  } else {
    const [url, data, method = "Get", allowAnonymousTemp, baseURL] = args;
    axios.defaults.baseURL = baseURL;
    allowAnonymous = allowAnonymousTemp;
    requestConfig = {
      url,
      data,
      method: method.toUpperCase()
    };
    console.log("requestConfig===", requestConfig);
  }
  return new Promise<T>(resolve => {
    instance
      .request(requestConfig)
      .then((response: any) => {
        const responseData = response;
        if (!responseData) {
          resolve(defaultReturnData);
        }
        if (!responseData.Logined && !allowAnonymous) {
          window.location.href = process.env.NODE_ENV === "production" ? "/Login/" : "/login.html";
        }
        if (
          !responseData.Successful &&
          responseData.ErrorMessage &&
          responseData.ErrorMessage.indexOf("MetadataLocked") > -1
        ) {
        }
        resolve(responseData);
        return responseData;
      })
      .catch((error: any) => {
        if (error.responseJSON && error.responseJSON.ErrorMessage.indexOf("MetadataLocked") > -1) {
        }
        resolve(error);
        return error;
      });
  });
}
