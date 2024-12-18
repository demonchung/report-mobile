/**
 * 图表类型枚举
 */

export enum ModuleType {
  ChartSwitch = "chartSwitch", // 图表切换
  MultiMetricType = "multiMetricType",
  GroupDimension = "groupDimension", // 维度(列维度)
  Dimension = "dimension", // 维度(行维度)
  Metric = "metric", // 指标
  MetricGroup = "metricGroup", // 多个指标
  Sort = "sort", // 排序
  Limit = "limit", // 数据保留多少
  Filter = "filter", // 过滤
  DataLabel = "dataLabel", // 数值显示/数值标签
  DataLabelPileSum = "dataLabelPileSum", // 堆叠合计显示
  DataLabelFontSize = "dataLabelFontSize", // 标签文字大小
  PieMode = "pieMode", // 饼图模式
  DataLabelPosition = "dataLabelPosition", // 数据标签位置
  GaugeMode = "gaugeMode", // 仪表图模式
  Theme = "theme", // 图表配色
  OrderNumber = "orderNumber", // 序号相关
  MoreOrderNumber = "moreOrderNumber", // 序号相关
  FreezeHead = "freezeHead", // 冻结相关
  Legend = "legend", // 图例
  PageSet = "pageSet", //
  AxisX = "axisX", // X轴相关
  AxisY = "axisY", // Y轴相关
  AxisyName = "axisyName", //Y轴标题
  MultipleDataLabel = "multipleDataLabel", // 多种类数值显示
  MetricRange = "metricRange", // 指标范围（Y轴最大值最小值）
  AxisYSet = "axisYSet", // Y轴相关(目前就Y轴显示隐藏)
  axisSet = "axisSet", // 坐标轴相关(目前就显示隐藏坐标轴功能，X和Y轴同时设置)
  SplitLine = "splitLine", //网格线
  DimensionLimit = "dimensionLimit", // 维度保留功能 （饼图的数据保留）
  DataZoom = "dataZoom", // 缩略轴功能
  MapTheme = "mapTheme", // 地图配色
  MapArea = "mapArea", // 地图显示范围
  MapDrill = "mapDrill", // 地图钻取设置
  MapMode = "mapMode", // 地图展示类型
  BarMode = "barMode", //
  MapDigitalSet = "mapDigitalSet", //数值标签显示设置
  Forecast = "forecast", // 预测
  // 新统计分析新增 Y轴坐标轴相关 以及网格线功能 新增时补齐

  Linkage = "linkage", //图表联动
  JumpLink = "jumpLink", //图表跳转
  WarningLine = "warningLine", // 警戒线
  ElementCoat = "elementCoat", // 组件背景颜色
  FontSetting = "fontSetting", // 字体颜色设置
  PaintCoat = "paintCoat", // 字体颜色设置
  Download = "download", // 是否允许下载
  MultiRange = "multiRange", // 双轴图多个指标限制
  Multilayers = "multilayers", // 多图层
  Timer = "timer", // 定时刷新器
  Conversion = "conversion", // 转化率
  SwitchLayers = "switchLayers", // 图层切换
  Invert = "invert", // 对比漏斗转化
  CrossSummary = "crossSummary", // 小计功能
  ProgressLabel = "progressLabel", // 进度图标签设置
  GroupSetting = "groupSetting", // 系列设置
  MetricLabel = "metricLabel", // 指标名显示
  MetricValue = "metricValue", // 指标值显示
  FilterNone = "filterNone", // 过滤空值
  SortPercent = "sortPercent", // 进度值排序
  TextAlign = "textAlign", // 文字位置
  AdaptiveSize = "adaptiveSize", // 自适应大小
  CompareData = "compareData", // 对比值
  ListTextAlign = "listTextAlign", //明细表对齐方式
  CardSetting = "cardSetting", // 指标卡设置
  CardMode = "cardMode", // 指标图模型
}
