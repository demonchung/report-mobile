import ResponseCode from "@h3/report-mobile/basics/enum/response-code";
import fetch from "@h3/report-mobile/basics/config/fetch";
import reportOptions from "@h3/report-mobile/dist/options";
import env from "../../config/env";
import { Apis } from "./api-type";

/**
 * 接口通用配置标准
 */

export default abstract class API implements H3.ReportAPI.Instance {
  config: H3.ReportAPI.APIConfig = {
    corpId: null,
    config: null,
    host: null
  };
  protected constructor(config: H3.ReportAPI.APIConfig) {
    this.config = Object.assign(this.config, config);
    this.config.host = env;
  }
  /**
   * 获取图表数据
   */
  abstract [Apis.GETCHARTDATA](chart: H3.ReportAPI.Chart, corpId?: string): Promise<any | boolean>;

  /**
   * fetch方法
   * @param options 配置参数
   */
  fetch<T>(options: any): H3.ReportFetch.Result<T> {
    if (options.data) {
      if (options.method !== "get") {
        options.data = Object.assign(options.data, {
          corpId: this.config.corpId,
          config: this.config.config
        });
      }
    }
    if (options.lang && options.lang === "en") {
      options.url += "?lang=en-US";
    }
    if (options.formData) {
      options.data = options.formData;
    }
    const complete: Function | null = options.complete || this.config.complete; // 成功回调函数
    const error: Function | null = options.error || this.config.error; // 失败回调函数
    delete options.complete;
    delete options.error;
    const fetchOptions = Object.assign({ host: this.config.host }, options);

    const req = fetch<H3.ReportAPI.ProResponse>(fetchOptions);
    return {
      promise: new Promise((resolve, reject) => {
        req.promise.then((res: any) => {
          if (res && !res.errorCode && (res.data || res.data === 0)) {
            resolve(complete ? complete(res) : res.data);
          }
          // else if (res.errorCode) {
          //   typeof reportOptions.interfaceErrorCb === "function" &&
          //     reportOptions.interfaceErrorCb(res.errorCode);
          // }
          else if (res instanceof Blob) {
            // 下载文件
            resolve((res as any));
          } else {
            this.config.errorTips && this.config.errorTips(res.errorCode, res.errorMessage);
            reject(error ? error(res) : res);
          }
        });
      }),
      source: req.source
    };
  }

  setConfig({ corpId, config }: any): void {
    if (corpId) {
      this.config.corpId = corpId;
    }
    if (config) {
      this.config.config = config;
    }
  }
}
