/**
 * 图表类型枚举
 */
export enum ElementType {
  MAP = "map", // 地图
  BAR = "bar", // 柱状图
  PILEBAR = "pileBar", // 堆叠柱状图
  STRIPE = "stripe", // 条形图
  PILESTRIPE = "pileStripe", //堆叠条形图
  LINE = "line", // 折线图
  AREA = "area", // 面积图
  PIE = "pie", // 饼图
  FUNNEL = "funnel", // 漏斗图
  RADAR = "radar", // 雷达图
  TABLE = "table", // 透视图
  CROSSTABLE = "crosstable", // 交叉表
  LIST = "list", // 明细表
  CARD = "card", // 指标图
  SCATTER = "scatter", // 散点图（气泡图）
  BIAX = "biax", // 双轴图
  LONGTEXT = "longText", // 文本图
  IMAGE = "image", // 图片
  FILTERPICKER = "filterPicker", // 过滤器
  PROGRESSBAR = "progressBar", // 进度图
  GAUGE = "gauge", // 仪表图
  WEB = "web", // web组件
  TAB = "tab", // tab组件
  FUNNELCOMPARE = "funnelCompare", // 对比漏斗图
  PERCENTPILEBAR = "percentPileBar", // 百分比堆积柱状图
  PERCENTPILESTRIPE = "percentPileStripe" // 百分比堆积条形图
}

export enum ElementTypeClass {
  TABLE = "table", //表格类
  TRENDCOM = "trendcom", //趋势对比类
  METRIC = "metric", //指标类
  DISTRIBUTE = "distribute" //分布类
}

export enum ElementTypeClassName {
  TABLE = "表格类", //表格类
  TRENDCOM = "趋势对比类", //趋势对比类
  METRIC = "指标类", //指标类
  DISTRIBUTE = "分布类" //分布类
}

/**
 * 图表类型枚举
 */
export enum ElementCNType {
  MAP = "地图", // 地图
  BAR = "柱状图", // 柱状图
  PILEBAR = "堆叠柱状图", // 堆叠柱状图
  STRIPE = "条形图", // 条形图
  LINE = "折线图", // 折线图
  AREA = "面积图", // 面积图
  PIE = "饼图", // 饼图
  FUNNEL = "漏斗图", // 漏斗图
  PILESTRIPE = "堆叠条形图", //堆叠条形图
  RADAR = "雷达图", // 雷达图
  TABLE = "透视图", // 透视图
  CROSSTABLE = "交叉表", // 透视图
  LIST = "明细表", // 明细表
  CARD = "指标图", // 指标图
  SCATTER = "散点图", // 散点图（气泡图）
  BIAX = "双轴图", // 双轴图
  LONGTEXT = "文本图", // 文本图
  TABS = "Tabs", // 标签
  FILTERPICKER = "过滤器", // 过滤器
  PROGRESSBAR = "进度图", // 进度图
  GAUGE = "仪表图", // 仪表图
  FUNNELCOMPARE = "漏斗对比图" // 对比漏斗图
}
export enum ElementCNTypeCopy {
  MAP = "$r_language.saticOP.ElementCNType.MAP$", // 地图
  BAR = "$r_language.saticOP.ElementCNType.BAR$", // 柱状图
  PILEBAR = "$r_language.saticOP.ElementCNType.PILEBAR$", // 堆叠柱状图
  STRIPE = "$r_language.saticOP.ElementCNType.STRIPE$", // 条形图
  LINE = "$r_language.saticOP.ElementCNType.LINE$", // 折线图
  AREA = "$r_language.saticOP.ElementCNType.AREA$", // 面积图
  PIE = "$r_language.saticOP.ElementCNType.PIE$", // 饼图
  FUNNEL = "$r_language.saticOP.ElementCNType.FUNNEL$", // 漏斗图
  PILESTRIPE = "$r_language.saticOP.ElementCNType.PILESTRIPE$", //堆叠条形图
  RADAR = "$r_language.saticOP.ElementCNType.RADAR$", // 雷达图
  TABLE = "$r_language.saticOP.ElementCNType.TABLE$", // 透视图
  CROSSTABLE = "$r_language.saticOP.ElementCNType.CROSSTABLE$", // 透视图
  LIST = "$r_language.saticOP.ElementCNType.LIST$", // 明细表
  CARD = "$r_language.saticOP.ElementCNType.CARD$", // 指标图
  SCATTER = "$r_language.saticOP.ElementCNType.SCATTER$", // 散点图（气泡图）
  BIAX = "$r_language.saticOP.ElementCNType.BIAX$", // 双轴图
  LONGTEXT = "$r_language.saticOP.ElementCNType.LONGTEXT$", // 文本图
  FILTERPICKER = "$r_language.saticOP.ElementCNType.FILTERPICKER$", // 过滤器
  PROGRESSBAR = "$r_language.saticOP.ElementCNType.PROGRESSBAR$", // 进度图
  GAUGE = "$r_language.saticOP.ElementCNType.GAUGE$", // 仪表图
  FUNNELCOMPARE = "$r_language.saticOP.ElementCNType.FUNNELCOMPARE$", // 对比漏斗图
  PERCENTPILEBAR = "$r_language.saticOP.ElementCNType.PERCENTPILEBAR$", //百分比堆积柱状图
  PERCENTPILESTRIPE = "$r_language.saticOP.ElementCNType.PERCENTPILESTRIPE$" // 百分比堆积条形图
}
/**
 * 图表连接关系
 */
export enum ChartUseType {
  CONNECT = 1,
  ETL = 100
}

/**
 * 图表tooltip 的HTML
 */
export enum ChartNotice {
  BAR = "1个维度、1个或多个指标<br>2个维度、1个指标", // 柱状图
  PILEBAR = "1个维度、1个或多个指标<br>2个维度、1个指标", // 堆叠柱状图
  STRIPE = "1个维度、1个或多个指标<br>2个维度、1个指标", // 条形图
  PILESTRIPE = "1个维度、1个或多个指标<br>2个维度、1个指标", // 条形图
  LINE = "1个维度、1个或多个指标<br>2个维度、1个指标", // 折线图
  AREA = "1个维度、1个或多个指标<br>2个维度、1个指标", // 面积图
  PIE = "1个维度、1个指标", // 饼图
  FUNNEL = "1个维度、1个指标", // 漏斗图
  RADAR = "1个维度、1个或多个指标<br>2个维度、1个指标", // 雷达图
  TABLE = "1个维度、1个或多个指标<br>多个维度、1个或多个指标", // 透视图
  CROSSTABLE = "1个维度、1个或多个指标<br>多个维度、1个或多个指标", // 交叉表
  LIST = "多个列", // 明细表
  CARD = "0个维度、1个指标<br>1个维度、1个指标", // 指标图
  SCATTER = "1个维度、2个或3个指标<br/>2个维度、2个或3个指标", // 散点图（气泡图）
  BIAX = "1个维度、1个或多个指标<br>2个维度、1个指标", // 双轴图
  MAP = "1个维度、1个指标", // 地图
  PROGRESSBAR = "0个维度、1个或多个指标<br>1个维度、1个或多个指标", // 进度图
  GAUGE = "0个维度、1个指标", // 仪表图
  FUNNELCOMPARE = "1个维度、1个或多个指标" // 对比漏斗图
}
export enum ChartNoticeCopy {
  BAR = "$r_language.saticOP.ChartNotice.BAR$", // 柱状图
  PILEBAR = "$r_language.saticOP.ChartNotice.PILEBAR$", // 堆叠柱状图
  STRIPE = "$r_language.saticOP.ChartNotice.STRIPE$", // 条形图
  PILESTRIPE = "$r_language.saticOP.ChartNotice.PILESTRIPE$", // 条形图
  LINE = "$r_language.saticOP.ChartNotice.LINE$", // 折线图
  AREA = "$r_language.saticOP.ChartNotice.AREA$", // 面积图
  PIE = "$r_language.saticOP.ChartNotice.PIE$", // 饼图
  FUNNEL = "$r_language.saticOP.ChartNotice.FUNNEL$", // 漏斗图
  RADAR = "$r_language.saticOP.ChartNotice.RADAR$", // 雷达图
  TABLE = "$r_language.saticOP.ChartNotice.TABLE$", // 透视图
  CROSSTABLE = "$r_language.saticOP.ChartNotice.CROSSTABLE$", // 交叉表
  LIST = "$r_language.saticOP.ChartNotice.LIST$", // 明细表
  CARD = "$r_language.saticOP.ChartNotice.CARD$", // 指标图
  SCATTER = "$r_language.saticOP.ChartNotice.SCATTER$", // 散点图（气泡图）
  BIAX = "$r_language.saticOP.ChartNotice.BIAX$", // 双轴图
  MAP = "$r_language.saticOP.ChartNotice.MAP$", // 地图
  PROGRESSBAR = "$r_language.saticOP.ChartNotice.PROGRESSBAR$", // 进度图
  GAUGE = "$r_language.saticOP.ChartNotice.GAUGE$", // 仪表图
  FUNNELCOMPARE = "$r_language.saticOP.ChartNotice.FUNNELCOMPARE$", // 对比漏斗图
  PERCENTPILEBAR = "$r_language.saticOP.ChartNotice.PERCENTPILEBAR$", // 百分比堆积柱状图
  PERCENTPILESTRIPE = "$r_language.saticOP.ChartNotice.PERCENTPILESTRIPE$" // 百分比堆积条形图
}
