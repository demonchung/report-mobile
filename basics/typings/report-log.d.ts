declare namespace H3 {
  namespace Report {
    /**
     * 报表状态管理
     */
    export interface Logtrace {
      appName?: string; // 'dashboard'| 'datasource' 
      body?: any; // 
      corpId?: string; // 
      data?: any; // 扩展结构
      extra?: any; // 预留内容
      funcName?: string; // '接口名'
      traceId?: string; // 响应头traceId
      userId?: string; // 用户id
      createTime?:string; // 创建时间
      endTime?: string; //结束
      startTime?: string; //开始
      totalElapsed?: string; // 总耗时
    }   
  }
}
