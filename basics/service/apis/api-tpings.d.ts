declare namespace H3 {
  namespace ReportAPI {
    export enum Apis {
      GETDATASOURCELIST = 'getDataSourceList',
      GETDATASOURCE = 'getDataSource',
      GETCHARTDATA = 'getChartData',
    }

    interface Instance {
      config: H3.ReportAPI.APIConfig;

      [Apis.GETCHARTDATA]<T>(chart: H3.ReportAPI.Chart, corpId?: string): Promise<T | boolean>;

      fetch<T>(options: any): H3.ReportFetch.Result<T>;

      setConfig({corpId, config}: any): void;
    }
  }
}
