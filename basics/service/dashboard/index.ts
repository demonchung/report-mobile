import API from "../apis/api";
import dashboardTips from "./error-tips";
import { DashbordApis } from "./api-type";
import { uuid } from "@h3/report-mobile/basics/utils/uid";
import TaskQueue from "@h3/report-mobile/basics/components/task-queue";
import options from "@h3/report-mobile/dist/options";
let questQueue: any = null;

class DashboardApi extends API {
  constructor() {
    super({
      errorTips: dashboardTips
    });
  }
  /**
   * 保存取图表数据
   */
  [DashbordApis.SAVEREPORT](report: H3.Report.Report): Promise<boolean> {
    const request = this.fetch<boolean>({
      url: "dashboard/v1/report/reportpage",
      method: "post",
      data: {
        report
      }
    });
    return request.promise;
  }

  [DashbordApis.LOGTRACE](logs: Array<H3.Report.Logtrace>): Promise<boolean> {
    const request = this.fetch<boolean>({
      url: "common/log/trace",
      method: "post",
      data: {
        logs
      }
    });
    return request.promise;
  }
  /**
   * 新生成图表
   */
  [DashbordApis.GENERATEREPORT](report: H3.Report.Report): Promise<boolean> {
    const request = this.fetch<boolean>({
      url: "dashboard/v1/report/v2/reportpage",
      method: "post",
      data: {
        report
      }
    });
    return request.promise;
  }
  /**
   * 获取图表配置信息
   */
  [DashbordApis.GETREPORT](
    corpId: string,
    objectId: string,
    lang: string
  ): Promise<H3.DashboardAPI.ReportData | boolean> {
    // 有语言环境,并且不是中文,url就使用拼接属性
    const url = "dashboard/v1/report/v2/config";
    const request = this.fetch<H3.DashboardAPI.ReportData | boolean>({
      url,
      method: "post",
      data: {
        corpId,
        objectId
      },
      lang
    });
    return request.promise;
  }

  [DashbordApis.GETCHARTS](
    objectIds: Array<string>,
    lang: string
  ): Promise<H3.DashboardAPI.ReportData | boolean> {
    // 有语言环境,并且不是中文,url就使用拼接属性
    const url = "dashboard/external/charts";
    const request = this.fetch<H3.DashboardAPI.ReportData | boolean>({
      url,
      method: "post",
      data: {
        objectIds
      },
      lang
    });
    return request.promise;
  }

  //获取筛选组件信息
  [DashbordApis.GETFILTERREPORT](
    corpId: string,
    objectId: string,
    lang: string
  ): Promise<H3.DashboardAPI.ReportData | boolean> {
    const url = "dashboard/v1/report/local_global_filters";
    const request = this.fetch<H3.DashboardAPI.ReportData | boolean>({
      url,
      method: "post",
      data: {
        corpId,
        objectId
      },
      lang
    });
    return request.promise;
  }

  /**
   * 获取数据源列表
   */
  [DashbordApis.GETDATASOURCELIST](
    lang: string
  ): Promise<Array<H3.DashboardAPI.DataSourceNode> | boolean> {
    const url = "dashboard/v1/report/v3/datasourcelist";
    const request = this.fetch<Array<H3.DashboardAPI.DataSourceNode> | boolean>({
      url,
      method: "post",
      data: {},
      lang
    });
    return request.promise;
  }

  [DashbordApis.GETSOURCELIST](
    lang: string
  ): Promise<Array<H3.DashboardAPI.DataSourceNode> | boolean> {
    const url = "/dashboard/datasource/datasource_list";
    const request = this.fetch<Array<H3.DashboardAPI.DataSourceNode> | boolean>({
      url,
      method: "post",
      data: {},
      lang
    });
    return request.promise;
  }

  [DashbordApis.GETADVANCEDLIST](
    lang: string
  ): Promise<Array<H3.DashboardAPI.DataSourceNode> | boolean> {
    const url = "/dashboard/datasource/advanced_list";
    const request = this.fetch<Array<H3.DashboardAPI.DataSourceNode> | boolean>({
      url,
      method: "post",
      data: {},
      lang
    });
    return request.promise;
  }

  /**
   * 获取指定dataSourceId的数据源
   */
  [DashbordApis.GETDATASOURCE](
    dataSourceInfos: Array<string>,
    lang
  ): Promise<Array<H3.DashboardAPI.SchemaModel> | boolean> {
    // 有语言环境,并且不是中文,url就使用拼接属性
    const url = "dashboard/v1/report/v3/datasource";
    const request = this.fetch<Array<H3.DashboardAPI.SchemaModel> | boolean>({
      url,
      method: "post",
      data: {
        dataSourceInfos
      },
      lang
    });
    return request.promise;
  }
  /**
   * 获取图表数据
   */
  async [DashbordApis.GETCHARTDATA](
    chart: H3.ReportAPI.Chart,
    corpId?: string,
    lang?: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean> {
    let url = "dashboard/v1/datalogic/v2/chartdata";
    if (lang && lang !== "cn") {
      url += "?lang=en-US";
    }
    const questId = uuid(6, 16);
    const params = {
      url,
      method: "post",
      data: {
        chart,
        dataSourceId: chart.dataSourceId,
        corpId
      }
    };
    // 创建请求任务
    const request = () => {
      return new Promise((resolve, reject) => {
        const quest = this.fetch<H3.DashboardAPI.ChartRealData | boolean>(params);
        resolve(quest.promise);
      });
    };
    // 创建请求实例，并且运行
    if (!questQueue) {
      questQueue = new TaskQueue(options.maxQuestQueue);
    }
    // 重启实例运行
    if (questQueue.status === "stop") {
      questQueue.startTask();
    }
    questQueue.addTask(request, questId);
    return new Promise(async (resolve, reject) => {
      questQueue
        .checkRes(questId)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * 导出数据 明细表
   */
  [DashbordApis.DATAEXPORT](
    chart: H3.ReportAPI.Chart,
    serialNum: boolean = false,
    chartStyles: any,
    corpId?: string,
    lang?: string,
    summaryData?: any
  ): Promise<any | Array<any> | boolean> {
    const url = "dashboard/v1/export/v2/dataExport";
    const request = this.fetch<any | Array<any> | boolean>({
      url,
      method: "post",
      data: {
        chart,
        dataSourceId: chart.dataSourceId,
        corpId,
        serialNum,
        summary: summaryData,
        ...chartStyles
      },
      lang,
      responseType: "blob"
    });
    return request.promise;
  }

  /**
   * 企业微信导出数据 明细表
   */
  [DashbordApis.WXWORKEXPORT](
    chart: H3.ReportAPI.Chart,
    serialNum: boolean = false,
    chartStyles: any,
    corpId?: string,
    lang?: string,
    summaryData?: any
  ): Promise<any | Array<any> | boolean> {
    const url = "dashboard/v1/export/external-export";
    const request = this.fetch<any | Array<any> | boolean>({
      url,
      method: "post",
      data: {
        chart,
        dataSourceId: chart.dataSourceId,
        corpId,
        serialNum,
        summary: summaryData,
        ...chartStyles
      },
      lang
      // responseType: "blob"
    });
    return request.promise;
  }

  /**
   * 企业微信导出数据 明细表
   * objectId : 表示请求需要的id，在导出后第一次是media_id，后续就是具体的job_id
   */
  [DashbordApis.WXWORKPOLLEXPORT](
    objectId: string,
    corpId?: string,
    lang?: string
  ): Promise<any | Array<any> | boolean> {
    const url = "dashboard/v1/export/polling-progress";
    const request = this.fetch<any | Array<any> | boolean>({
      url,
      method: "post",
      data: {
        objectId: objectId,
        corpId
      },
      lang
      // responseType: "blob"
    });
    return request.promise;
  }

  /**
   * 企业微信导出数据  利用文件url直接获取文件流
   */
  [DashbordApis.DOWNLOADBYURL](url: string): Promise<any | Array<any> | boolean> {
    const request = this.fetch<any | Array<any> | boolean>({
      url,
      method: "get",
      responseType: "blob"
    });
    return request.promise;
  }

  /**
   * 软删除
   */
  [DashbordApis.REMOVEREPORT](
    corpId: string,
    objectId: string,
    lang: string
  ): Promise<any | Array<any> | boolean> {
    const url = "dashboard/v1/report/removeReport";
    const request = this.fetch<any | Array<any> | boolean>({
      url,
      method: "post",
      data: {
        corpId,
        objectId
      },
      lang
    });
    return request.promise;
  }

  /**
   * 添加单个图表
   */
  [DashbordApis.ADDSINGLECHART](
    charts: Array<H3.ReportAPI.PostChart>,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/chart/addChart";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        charts
      },
      lang
    });
    return request.promise;
  }

  /**
   * 删除单个图表
   */
  [DashbordApis.REMOVESINGLECHART](
    chartId: string,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/chart/removeChart";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        objectId: chartId
      },
      lang
    });
    return request.promise;
  }
  /**
   * 删除多个图表
   */
  [DashbordApis.BETCHREMOVECHARTS](
    chartIds: Array<string>,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/chart/removeCharts";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        objectIds: chartIds
      },
      lang
    });
    return request.promise;
  }

  /**
   * 删除单个图表
   */
  [DashbordApis.SETATTRIBUTES](attributes: string, chartId, lang: string): Promise<any> {
    const url = "dashboard/v1/report/saveAttributes";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        attributes,
        objectId: chartId
      },
      lang
    });
    return request.promise;
  }

  /**
   * 更新单个图表
   */
  [DashbordApis.UPDATESINGLECHART](
    charts: Array<H3.ReportAPI.PostChart>,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/chart/updateChart";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        charts
      },
      lang
    });
    return request.promise;
  }
  /**
   * 获取图片地址
   */
  [DashbordApis.GETATTACHMENT](
    fileName,
    objectId,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/file/attachment";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        fileName,
        objectId
      },
      lang
    });
    return request.promise;
  }
  /**
   * 上传文件
   */
  [DashbordApis.UPLOADFILE](
    path,
    form,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = `dashboard/v1/file/upload?urlPath=${encodeURIComponent(path)}`;
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      formData: form,
      headers: { "Content-Type": "multipart/form-data" },
      isInitRequest: true,
      lang
    });
    return request.promise;
  }
  /**
   * 获取图片地址
   */
  [DashbordApis.REMOVEFILE](
    fileName,
    url,
    objectId,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url: "dashboard/v1/file/unattach",
      method: "post",
      data: {
        fileName,
        url,
        objectId
      },
      lang
    });
    return request.promise;
  }

  /**
   * 更新图表标题
   */
  [DashbordApis.UPDATECHARTTITLE](
    chartId: string,
    title: string,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/chart/updateTitle";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        objectId: chartId,
        title
      },
      lang
    });
    return request.promise;
  }

  /**
   * 批量更新图表位置信息
   */
  [DashbordApis.UPDATEPOSITIONS](
    positions: any[],
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/chart/updatePositions";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        positions
      },
      lang
    });
    return request.promise;
  }
  /**
   * 批量更新移动端信息
   */
  [DashbordApis.UPDATEMOBILEOPTIONS](
    options: any[],
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/chart/updateMobileOptions";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        options
      },
      lang
    });
    return request.promise;
  }
  /**
   * 批量更新图表位置信息
   */
  [DashbordApis.UPDATEGLOBALSTYLES](
    objectId: string,
    global: string,
    lang: string
  ): Promise<H3.DashboardAPI.ChartRealData | boolean | Blob> {
    const url = "dashboard/v1/report/saveGlobal";
    const request = this.fetch<H3.DashboardAPI.ChartRealData | boolean>({
      url,
      method: "post",
      data: {
        objectId,
        global
      },
      lang
    });
    return request.promise;
  }

  /**
   *  图表数据加载
   *  @param code
   */
  [DashbordApis.GETMAPJSON](code): Promise<Object | boolean> {
    const request = this.fetch<boolean | Object>({
      url: `dashboard/v1/chart/mapJson?code=${code}`,
      method: "get",
      data: {
        // code
      },
      autoGet: false
    });
    return request.promise;
  }
  /**
   * 校验公式
   */
  [DashbordApis.CHECKCOMPUTE](
    compute: H3.DashboardAPI.Compute,
    lang: string
  ): Promise<boolean | Blob> {
    const url = "common/formula/validate";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        expression: compute.expression,
        fieldPrefix: compute.fieldPrefix,
        fields: compute.fields
      },
      lang
    });
    return request.promise;
  }

  /**
   * 获取仪表盘预览数据  -- 用于迁移氚云旧报表的功能
   */
   [DashbordApis.GETCONVERTREPORT](
    corpId: string,
    reportCode: string,
    lang?: string
  ): Promise<H3.DashboardAPI.ConvertModel | boolean> {
    const url = "h3yun/migration/convert_by_report_code";
    const request = this.fetch<H3.DashboardAPI.ConvertModel | boolean>({
      url,
      method: "post",
      data: {
        corpId,
        reportCode
      },
      lang
    });
    return request.promise;
  }
  /**
   * 确认迁移旧报表
   */
  [DashbordApis.MIGRATEREPORT](
    corpId: string,
    migration: H3.DashboardAPI.MigrationModel,
    chartPage: any,
    lang?: string
  ): Promise<boolean> {
    const url = "h3yun/migration/migrate";
    const request = this.fetch<boolean>({
      url,
      method: "post",
      data: {
        corpId,
        migration,
        chartPage
      },
      lang
    });
    return request.promise;
  }
}

const dashboardApi = new DashboardApi();
export { dashboardApi };
export default {
  dashboardApi
};
