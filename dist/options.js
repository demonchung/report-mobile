const ElementType = {
  MAP: "map", // 地图
  BAR: "bar", // 柱状图
  PILEBAR: "pileBar", // 堆叠柱状图
  PILESTRIPE: "pileStripe", // 堆叠柱状图
  STRIPE: "stripe", // 条形图
  LINE: "line", // 折线图
  AREA: "area", // 面积图
  PIE: "pie", // 饼图
  FUNNEL: "funnel", // 漏斗图
  RADAR: "radar", // 雷达图
  TABLE: "table", // 透视图
  LIST: "list", // 明细表
  CARD: "card", // 指标图
  SCATTER: "scatter", // 散点图（气泡图）
  BIAX: "biax", // 双轴图
  LONGTEXT: "longText", // 文本图
  IMAGE: "image", // 图片
  FILTERPICKER: "filterPicker", // 过滤器
  PROGRESSBAR: "progressBar", // 进度图
  GAUGE: "gauge", // 仪表图
  WEB: "web", // web组件
  FUNNELCOMPARE: "funnelCompare", // 对比漏斗图
  PERCENTPILEBAR: "percentPileBar", // 百分比堆积柱状图
  PERCENTPILESTRIPE: "percentPileStripe" // 百分比堆积条形图
};

const options = {
  /**
   * 列表分析用的(暂时)
   */
  axios: null,
  /**
   * 请求时候的头信息
   *  Object | Function
   */
  requestHeader: null,
  /**
   * 错误请求回调
   * Function | null
   */
  interfaceErrorCb: null,
  /**
   * 图片上传地址
   * string|(file) => Promise
   */
  imageAction: null,
  /**
   * 请求的地址
   */
  baseUrl: null,
  /**
   *  自定义用户配置信息
   *  例如氚云:
   *  {
   *    token: null,
   *    extra: {}
   *  };
   */
  config: {},
  /**
   * 报表关联公司的ID
   */
  corpId: null,
  /**
   * 仪表盘的ID
   */
  reportId: null,
  /**
   *  整合业务组件
   *  Function
   *  @params field
   *  @params formula
   *  @params format
   * 处理Component模型  h(Component, {
        props: {
          formula: this.formula,
          field: this.field,
          value: this.value,
          isExternal: this.isExternal
        },
        on: {
          input: this.handleValue,
        }
      }),
   * @param field
   * formula 枚举如下
   * 字符串类型时的公式枚举 {
   *  Equal = 'Equal', // 等于（等于一个值）
   *  NotEqual = 'NotEqual', // 不等于
   *  StartWith = 'StartWith', // 开头为
   *  In = 'In', // 等于任意一个 （多个值）
   *  NotIn = 'NotIn', // 不等于任意一个 (多个值)
   *  None = 'None', // 为空
   *  NotNone = 'NotNone', // 不为空
   *}
   *  日期类型时的公式枚举 {
   *  Equal = 'Equal', // 等于 （等于一个值）
   *  NotEqual = 'NotEqual', // 不等于
   *  Range = 'Range', // 范围
   *  Above = 'Above', // 大于
   *  NotBelow = 'NotBelow', // 大于等于
   *  Below = 'Below', // 小于
   *  NotAbove = 'NotAbove', // 小于等于
   *  None = 'None', // 为空
   *  NotNone = 'NotNone', // 不为空
   *}
   *  数字类型时的公式枚举 {
   *  Equal = 'Equal', // 等于
   *  NotEqual = 'NotEqual', // 不等于
   *  Range = 'Range', // 范围
   *  Above = 'Above', // 大于
   *  NotBelow = 'NotBelow', // 大于等于
   *  Below = 'Below', // 小于
   *  NotAbove = 'NotAbove', // 小于等于
   *  None = 'None', // 为空
   *  NotNone = 'NotNone', // 不为空
   *}
   * @return Component 支持v-mode  返回Array<string | number | Object({ label, value })>
   */
  integrateComponents: null,
  /**
   * 筛选方式整合业务嵌入
   *  Function
   *  @param field  字段属性集合
   *  @param formula 公式
   *  @param format 筛选方式,默认值为空字符串
   *  @return  Component 不支持v-mode  返回string | number; 每次改变值需提供回调 this.$emit('change',value)
   */
  filterFormatComponents: null,
  /**
   * 字段名称查询字段值
   *  Function 
   *  @param field  字段属性集合
   *  @param text <string>  label的集合
   *  @param formula 公式
   *  @return  返回Promise  { errorMessage: string , errorData?: any } | <string | number | Object({ label, value })>
   *  由于查询是异步行为，请使用promise函数，示例: 
   * 
   * 
   */
  filedNameQueryValue: null,
  
  //仪表盘列表 数组值
  jumpDashboard: {
    open: false,
    allDashboardList: [], //仪表盘列表
    allDataTableList: [], //仪表盘数据表列表
    getJumpUrl: null, //回掉函数，集成方自定义
    openMethod: null //企业微信、钉钉打开新窗口的方式
  },
  //明细表是否允许打开详情
  showDetailForListChart: false,
  /**
   * 字段类型分类
   *  Function
   *  param field
   * @return Array<number> 字段分类的组别
   */
  classification: null, // 字段类型分类
  /**
   * 兼容移动端的消息提示(后期会移除)
   * {
   *   error
   *   info
   *   success
   *   warning
   * }
   */
  emptyChartDefaultPic: {
    addTip: "",
    emptyTip: ""
  },
  message: null,
  /**
   * 图表的指标或者行列最大限制（支持明细表，汇总表）
   */
  charts: {
    dimension: {
      supportedTypes: ["string", "date", "address", "number"]
    },
    metric: {
      supportedTypes: ["string", "number", "date", "address"]
    },
    list: {
      dimension: 25
    },
    table: {
      dimension: 25,
      groupDimension: 25,
      metric: 25
    },
    crosstable: {
      dimension: 10,
      groupDimension: 10,
      metric: 10
    },
    maxCount: 50 // 单个仪表盘最多可创建的组件数（包含图表和文本等）
  },
  download: {
    list: true,
    pivotTable: true,
    crosstable: true
  },
  mobile: {
    filter: true
  },
  /**
   *  字段默认格式设置的配置  例如氚云表格字段的格式设置要带到统计分析来，如千分符,百分号
   *  值的格式
   *  Array<{
   *     schemaCode : string, // 字段schemaCode
   *     field: string, // 字段标识    
   *     numberFormat: {
   *          comma?: boolean, // 千分符设置，非必传
                percent?: boolean, // 百分比设置，非必传
                fraction?: boolean | number, // 小数位数 默认0,最大6位，非必传
   *     }
   *  }>
   *  注： 字段schemaCode加上field 为字段唯一标识
   */
  fieldsOptions: [],
  timerOptions: {
    defaultMinTime: 30,
    open: false
  },
  /**
   * 高级数据源的限制性的配置
   * 值为0则不限制
   */
  dataSource: {
    maxCount: 0 // 高级数据源列表最多可添加的数据流节点数，为0则不限制
  },
  components: [
    //组件
    {
      label: "图表组件",
      value: "chart",
      icon: "chart"
    },
    {
      label: "文本组件",
      value: "long-text",
      icon: "text"
    },
    {
      label: "筛选组件",
      value: "filter-picker",
      icon: "filter"
    },
    {
      label: "图片组件",
      value: "image",
      icon: "image"
    },
    {
      label: "Web组件",
      value: "web",
      icon: "web"
    },
    {
      label: "Tab组件",
      value: "tab",
      icon: "tab"
    }
  ],
  chartList: [
    {
      type: "list", // 明细表
      icon: "IconDetailedStatement",
      selected: false,
      disable: false
    },
    {
      type: "table", // 透视图
      icon: "IconPerspectiveChart",
      selected: false,
      disable: false
    },
    {
      type: "crosstable", // 交叉表
      icon: "IconCrossTableStoke",
      selected: false,
      disable: false
    },

    {
      type: "bar", // 柱状图
      icon: "IconHistogramChart",
      selected: true,
      disable: false
    },
    {
      type: "pileBar", // 堆叠柱状图
      icon: "IconStackedColumnChart",
      selected: false,
      disable: false
    },
    {
      type: "percentPileBar", // 百分比堆积柱状图
      icon: "IconScatterPlotChart",
      selected: false,
      disable: false
    },
    {
      type: "stripe", // 条形图
      icon: "IconBarChart",
      selected: false,
      disable: false
    },

    {
      type: "pileStripe", // 堆叠条形图
      icon: "IconPilestripe",
      selected: false,
      disable: false
    },
    {
      type: "percentPileStripe", // 百分比堆积条形图
      icon: "IconScatterPlotChart",
      selected: false,
      disable: false
    },
    {
      type: "line", // 折线图
      icon: "IconLineChart",
      selected: false,
      disable: false
    },
    {
      type: "area", // 面积图
      icon: "IconAreaChart",
      selected: false,
      disable: false
    },

    {
      type: "biax", // 双轴图
      icon: "IconCombinationChart",
      selected: false,
      disable: false
    },
    {
      type: "funnel", // 漏斗图
      icon: "IconFunnelChart",
      selected: false,
      disable: false
    },
    {
      type: "funnelCompare", // 对比漏斗图
      icon: "IconContrastFunnelDiagramFill",
      selected: false,
      disable: false
    },
    {
      type: "card", // 指标图
      icon: "IconIndexChart",
      selected: false,
      disable: false
    },
    {
      type: "progressBar", // 进度图
      icon: "IconProgressChartStoke",
      selected: false,
      disable: false
    },
    {
      type: "gauge", // 仪表图
      icon: "IconInstrumentChartStoke",
      selected: false,
      disable: false
    },
    {
      type: "pie", // 饼图
      icon: "IconPieChart",
      selected: false,
      disable: false
    },
    {
      type: "radar", // 雷达图
      icon: "IconRadarChart",
      selected: false,
      disable: false
    },
    {
      type: "map", // 地图
      icon: "IconMapChart",
      selected: false,
      disable: false
    },
    {
      type: "scatter", // 散点图（气泡图）
      icon: "IconScatterPlotChart",
      selected: false,
      disable: false
    }
  ],
  logConfig: {   
    // 性能日志配置
    performance: {
      open: false, // 是否开启性能日志
      reportInterval: 400000, // 上报时间间隔
      maxSize: 50 // 日志最大条数
    },

    // AIGC日志配置
    aigc: {
      open: false, // 是否开启AIGC日志
    }
  },
  maxQuestQueue: 2, // 默认两个请求同时
  filterPickerLinkSwitch: false, //筛选联动的开关
  filterLinkSupportedTypes: [], // 支持筛选联动字段的集合
  tmpTradButton: false, // 国际化开关
  helpDocumentLink: null, // 高级数据源功能介绍弹窗--帮助文档链接
  listHelpDocumentLink: null, // 高级数据源列表为空时显示的帮助文档--帮助文档链接
  webConfig: {
    linkProtocol: ["https"] // web组件支持的协议'
  },
   // 图片组件的自定义配置
   imageComponentConfig: {
    // 是否自定义删除, (file) => Promise, 配套使用，如果自定义上传，需要自定义删除. 
    customRemove: null, 
    customUpdata: null, // 是否自定义上传,   (file) => Promise,
    limitSize: 5, // 图片大小限制,单位是M，默认是5M
    imageType: ["jpeg","png","jpg","gif"] // 图片类型限制
  },
  //customizeFormulaOptions: null //自定义筛选函数

  // Sql动态参数 dataType: 业务字段类型, type：String| Date | Number, displyName: 显示名称
  initSqlParamsSupportedTypes: null,
  initSqlParamsSupportedExtendInfo: null,
    // 筛选公式扩展信息
  filterFormulaExtendinfo: null,
  helpLink: "https://authine.yuque.com/books/share/b50969b3-a683-4fbc-8503-36ff2aaa0e37?#"
};

export default options;
