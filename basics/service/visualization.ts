import options from '@h3/report-mobile/dist/options';
import { reportState } from '../store/visualization';
import axios from 'axios';
const CancelToken = axios.CancelToken;

const cancelTokenArray: any = {};
function fetch<T>({url, method = 'get', data}) {
  const source = CancelToken.source();
  const requestConfig = {
    url,
    data,
    method: method.toUpperCase(),
    cancelToken: source.token
  };

  return {
    promise: new Promise<T>((resolve) => {
      (options.axios as any).request(requestConfig).then((response: any) => {
        // 兼容氚云移动端
        if(response.data && response.headers) {
          response = response.data;
        }
        if (response.Successful) {
          resolve(response as any);
        }
        else if(response.StatusCode){
          resolve(response as any);
        }
        else if(response.ErrorMessage){
          options.message.error(response.ErrorMessage);
          resolve(false as any);
        }else if(response.message === 'Network Error'){
          options.message.error('网络异常请重试');
          resolve(false as any);
        }else {
          resolve(false as any);
        }
      }).catch((error) => {
        options.message.error(error);
      });
    }),
    source
  };
}

/**
 * 获取SchemaModel
 * @param SchemaCode
 */
export const getSchemaModel = (SchemaCode: string) => {
  const request = fetch<H3.ReportAPI.Response>({
    url: '/NewReporting/OnAction',
    method: 'post',
    data: {
      PostData: {
        ActionName: 'GetBizObjectSchemas',
        SchemaCode
      }
    }
  });
  return request.promise;
};

/**
 * 获取简易报表
 * @param SchemaCode
 */
export function getReport(SchemaCode: string): Promise<H3.ReportAPI.Response> {
  const request = fetch<H3.ReportAPI.Response>({
    url: '/NewReporting/OnAction',
    method: 'post',
    data: {
      PostData: {
        ActionName: 'GetReportStyle',
        SchemaCode
      }
    }
  });
  return request.promise;
}
/**
 * 保存报表
 * @param report
 * 返回ObjectId;
 */
export function saveReport(report: H3.Report.Report): Promise<H3.ReportAPI.Response> {
  const request = fetch<H3.ReportAPI.Response>({
    url: '/NewReporting/OnAction',
    method: 'post',
    data: {
      PostData: {
        ActionName: 'SaveReportStyle',
        SchemaCode: reportState.state.schemaCode,
        PostValue: report
      }
    }
  });
  return request.promise;
}

/**
 * 删除图表
 * @param chart
 */
export function removeChart(chart: H3.Report.Chart): Promise<H3.ReportAPI.Response> {
  const request = fetch<H3.ReportAPI.Response>({
    url: '/NewReporting/OnAction',
    method: 'post',
    data: {
      PostData: {
        ActionName: 'RemoveReportChart',
        SchemaCode: reportState.state.schemaCode,
        ChartId: chart.uid
      }
    }
  });
  return request.promise;
}

/**
 * 加载图表数据
 * @param chart
 */
export function loadChartData(chart: H3.Report.Chart): Promise<H3.ReportAPI.Response> {
  const PostData: any = {
    ActionName: 'LoadChartData',
    SchemaCode: reportState.state.schemaCode
  };
  PostData.Chart = chart;
  if (cancelTokenArray[chart.uid]) {cancelTokenArray[chart.uid].cancel("abort");}
  const request = fetch<H3.ReportAPI.Response>({
    url: '/NewReporting/OnAction',
    method: 'post',
    data: {
      PostData
    }
  });
  cancelTokenArray[chart.uid] = request.source;
  return request.promise;
}

export default {
  getSchemaModel,
  saveReport,
  removeChart,
  loadChartData
};
