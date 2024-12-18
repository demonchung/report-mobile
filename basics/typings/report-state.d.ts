declare namespace H3 {
  namespace Report {
    /**
     * 报表状态管理
     */
    export interface ReportProState {
      corpId: string; // 应用Id
      title: string; // 报表标题
      objectId?: string; // 报表ID
      charts: Array<H3.Report.BaseElement>; // 图表集合
      global: H3.Report.Global; //全局配置
      globalFilters: Array<H3.Report.GlobalFilter>; // 全局过滤条件
      globalModules?: H3.ReportModules.GlobalModules; // 全局模块配置
      activeChart?: H3.Report.Chart | null; // 当前激活的图表
      activeModules?: H3.ReportModules.ChartModules | null; // 当前激活的图表模块
      chartsAlias: { [key: string]: { [key: string]: string } }; // 图表数据集
      dragChart: H3.Report.Chart | null; // 新增拖动的图表
      dataSources: { [dataSourceId: string]: any }; // 数据源
      dataSourceList: Array<H3.ReportAPI.DataSourceNode> | null; // 数据源列表
      dragField: H3.Report.FieldColumn | null;
      config: any; // 业务集成的配置 { token appCode }
      integrateComponent: Function | null; // 业务整合服务 { components 自定义输出组件 }
      chartViewStatus: { [chartUuid: string]: any }; // 图表视图更新状态
      reportTop: number; // 仪表盘元素top,
      chartRelations: H3.Report.chartRelations;
      activeChartLayers: Array<H3.Report.chartLayer>;
      chartsTimer: H3.Report.chartTimer;
      fullStatus: string;
      logs: {[id: string] : any};
    }

    /**
     * 报表状态管理
     */
    export interface ReportEasyState {
      schemaCode: string;
      schemas: Array<H3.Report.FieldColumn>;
      objectId?: string; // 报表ID
      charts: Array<H3.Report.Chart>; // 图表集合
      global: H3.Report.Global; //全局配置
      globalFilters: Array<H3.Report.FilterFieldColumn>; // 全局过滤条件
      chartsModules?: { [key: string]: H3.ReportModules.ChartModules }; //图表配置队列
      globalModules?: H3.ReportModules.ChartModules; // 全局模块配置
      activeChart?: H3.Report.Chart | null; // 当前激活的图表
      chartsData: { [key: string]: Array<any> }; // 图表数据集
      chartsAlias: { [key: string]: { [key: string]: string } }; // 图表数据集
    }
    /**
     * 报表状态管理
     */
    export interface ReportAnalysisState {
      corpId: string;
      ownerId: string; // 个人的唯一标志userId
      dataSourceId: string; // 数据源标志，在氚云就是表单信息的objectId
      chartsInfo: { [key: string]: H3.Analysis.ChartInfo }; // 用户图表信息
      objectId?: string; // 报表ID
      charts: Array<H3.Report.Chart>; // 图表集合
      global: H3.Report.Global; //全局配置
      dataSources: { [dataSourceId: string]: H3.Report.DataSource };
      globalFilters: Array<H3.Report.FilterFieldColumn>; // 全局过滤条件
      chartsModules?: { [key: string]: H3.ReportModules.ChartModules }; //图表配置队列
      globalModules?: H3.ReportModules.ChartModules; // 全局模块配置
      activeChart?: H3.Report.Chart | null; // 当前激活的图表
      chartsData: { [key: string]: Array<any> }; // 图表数据集
      chartsAlias: { [key: string]: { [key: string]: string } }; // 图表数据集
      isWxwork: boolean // 企微环境
    }
    /**
     * 高级数据源
     */
    export interface ReportDataSourceState {
      corpId: string; // 应用Id
      config: any; // 业务集成的配置 { token appCode }
      dataSourceId: string; // 数据源Id
      groupId: string; //数据源分组Id
      activeNode?: H3.Falls.Node | null; // 当前激活的节点
    }
  }
}
