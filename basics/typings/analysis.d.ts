declare namespace H3 {
  namespace Analysis {
    /**
     * 元件类型枚举
     */
    export enum ChartType {
      BAR = "bar", // 柱状图
      LINE = "line", // 折线图
      PILEBAR = "pileBar", // 堆叠柱状图
      STRIPE = "stripe", // 条形图
      AREA = "area", // 面积图
      PIE = "pie", // 饼图
      FUNNEL = "funnel", // 漏斗图
      RADAR = "radar", // 雷达图
      TABLE = "table", // 透视图
      LIST = "list", // 明细表
      CARD = "card", // 指标图
      BIAX = "biax", // 双轴图
      SCATTER = "scatter", // 散点图（气泡图）
      MAP = "map" //地图
    }

    /**
     * 图表设置模型枚举
     */
    export enum ModuleType {
      ChartSwitch = "chartSwitch", // 图表切换
      MultiMetricType = "multiMetricType",
      GroupDimension = "groupDimension", // 维度(列维度)
      Dimension = "dimension", // 维度(行维度)
      CardSetting = "cardSetting", // 指标卡设置
      CardMode = "cardMode", // 指标图模型
      Metric = "metric", // 指标
      MetricGroup = "metricGroup", // 多个指标
      Sort = "sort", // 排序
      Limit = "limit", // 数据保留多少
      Filter = "filter", // 过滤
      DataLabel = "dataLabel", // 数值显示/数值标签
      DataLabelPileSum = "dataLabelPileSum", // 堆叠合计显示
      Theme = "theme", // 图表配色
      PageSet = "pageSet", // 页码设置
      PieMode = "pieMode", // 饼图模式
      BarMode = "barMode", //
      DataLabelPosition = "dataLabelPosition", // 数据标签位置
      GaugeMode = "gaugeMode", // 仪表图模式
      OrderNumber = "orderNumber", // 序号相关
      MoreOrderNumber = "moreOrderNumber", // 序号相关
      FreezeHead = "freezeHead", // 冻结相关
      Legend = "legend", // 图例
      AxisX = "axisX", // X轴相关
      AxisY = "axisY", // Y轴相关
      MultipleDataLabel = "multipleDataLabel", // 多种类数值显示
      MetricRange = "metricRange", // 指标范围（Y轴最大值最小值）
      AxisYSet = "axisYSet", // Y轴相关(目前就Y轴显示隐藏)
      axisSet = "axisSet", // 坐标轴相关(目前就显示隐藏坐标轴功能，X和Y轴同时设置)
      SplitLine = "splitLine", //网格线
      DimensionLimit = "dimensionLimit", // 维度保留功能 （饼图的数据保留）
      DataZoom = "dataZoom", // 缩略轴
      MapTheme = "mapTheme", // 地图配色
      MapArea = "mapArea", // 地图显示范围
      MapMode = "mapMode", //地图显示类型
      MapDrill = "mapDrill", // 地图钻取范围
      MapDigitalSet = "mapDigitalSet", //地图数值设置
      // 新统计分析新增 Y轴坐标轴相关 以及网格线功能 新增时补齐
      Linkage = "linkage", // 联动
      JumpLink = "jumpLink", //跳转
      WarningLine = "warningLine", // 警戒线
      ElementCoat = "elementCoat", // 组件背景颜色
      PaintCoat = "paintCoat", // 整体背景配色
      FontSetting = "fontSetting", // 字体颜色设置
      Download = "download", // 是否允许下载
      MultiRange = "multiRange", // 双轴图多个指标限制
      Multilayers = "multilayers", // 多图层
      Columns = "columns", // 拖拽列宽
      Timer = "timer", // 定时刷新
      Conversion = "conversion", // 转化率
      SwitchLayers = "switchLayers", // 转化率
      Invert = "invert", // 转化率
      CrossSummary = "crossSummary", // 分类汇总 小计
      Forecast = "forecast", // 预测
      ProgressLabel = "progressLabel", // 进度图标签设置
      GroupSetting = "groupSetting", // 系列设置
      MetricLabel = "metricLabel", // 指标名显示
      MetricValue = "metricValue", // 指标值显示
      FilterNone = "filterNone", // 过滤空值
      SortPercent = "sortPercent", // 进度值排序
      TextAlign = "textAlign", // 位置
      AdaptiveSize = "adaptiveSize", // 自适应大小
      CompareData = "compareData", // 对比值
      ListTextAlign = "listTextAlign", //列表中文字对齐方式
      DataLabelFontSize="dataLabelFontSize", // 标签字体大小
      AxisyName = "axisyName" //Y轴标题
    }
    /**
     * 展示池模块基础能力
     */
    interface ViewBase {
      // 是否可新增
      add?: boolean;
      // 工具
      tool?: Array<string>;
      // 修改名称
      rename?: boolean;
    }
    /**
     * 公共模块
     */
    interface PublicView extends ViewBase {}
    /**
     * 个人模块
     */
    interface PersionView extends ViewBase {}

    /**
     * 图表模块
     */
    interface ChartController {
      // 柱状
      bar?: ChartAuthority;
      // 折线
      line?: ChartAuthority;
      // 堆叠柱状图
      PILEBAR?: ChartAuthority;
      PILESTRIPE?: ChartAuthority;
      // 条形图
      STRIPE?: ChartAuthority;
      // 面积图
      AREA?: ChartAuthority;
      // 饼图
      PIE?: ChartAuthority;
      // 漏斗图
      FUNNEL?: ChartAuthority;
      // 雷达图
      RADAR?: ChartAuthority;
      // 双轴图
      BIAX?: ChartAuthority;
      // 透视图
      TABLE?: ChartAuthority;
      // 散点图（气泡图）
      SCATTER?: ChartAuthority;
      // 指标图
      CARD?: ChartAuthority;
      // 地图
      MAP?: ChartAuthority;
    }

    /**
     * 设计器模块
     */
    interface Design {
      // swipper
      // edit
      // 工具
      tool?: ToolBar;
    }

    /**
     * 公共工具栏
     */
    interface ToolBar {
      // 按钮配置
      buttonArray: Array<"edit" | "filter" | "delete">;
      // 只能是方向
      direction?: string;
    }

    /**
     * 图表权限
     */
    interface ChartAuthority {
      // 新增
      add: boolean;
      // 更改
      update: boolean;
      // 模块权限
      modules: ChartModules;
    }
    /**
     * 图表模块权限
     */
    interface ChartModules {
      // 图表切换
      [ModuleType.ChartSwitch]?: any;
      // 纬度
      [ModuleType.Metric]?: MetricModule;
      // 指标
      [ModuleType.Dimension]?: DimensionModule;
     
      // 维度组
      [ModuleType.GroupDimension]?: GroupDimensionModule;
      // 指标组
      [ModuleType.MetricGroup]?: MetricGroupModule;
      // 排序
      [ModuleType.Sort]?: SortModule;
      // 过滤条件
      [ModuleType.Filter]?: FilterModule;
      // 配色
      [ModuleType.Theme]?: ThemeModule;
      // 图例
      [ModuleType.Legend]?: LegendModule;
      [ModuleType.Invert]?: InvertModule;
      [ModuleType.CrossSummary]?: CrossSummaryModule;
      // 数据保留
      [ModuleType.Limit]?: LimitModule;

      [ModuleType.Conversion]?: ConversionModule;
      [ModuleType.SwitchLayers]?: SwitchLayersModule;
      // 数值标签
      [ModuleType.DataLabel]?: DataLabelModule;
      // 堆叠合计显示
      [ModuleType.DataLabelPileSum]?: DataLabelModule;
      // 字体大小
      [ModuleType.DataLabelFontSize]?: DataLabelFontSizeModule;
      // 指标位置
      [ModuleType.TextAlign]?: TextAlignModule;
      [ModuleType.ListTextAlign]?: ListTextAlignModule;
      // 自适应大小
      [ModuleType.AdaptiveSize]?: AdaptiveSizeModule;
      // 指标名展示
      [ModuleType.MetricLabel]?: MetricLabelModule;
      // 指标值展示
      [ModuleType.MetricValue]?: MetricValueModule;
      // 过滤空值
      [ModuleType.FilterNone]?: FilterNoneModule;
      [ModuleType.SortPercent]?: SortPercentModule;
      // x轴 组标轴 && x轴 文字方向
      [ModuleType.AxisX]?: AxisXModule;
      [ModuleType.AxisY]?: AxisYModule;
      // y轴 最大值 && y轴 最小值
      [ModuleType.MetricRange]?: MetricRangeModule;
      // 坐标轴
      [ModuleType.AxisYSet]?: AxisYSetModule;
      // 网格线
      [ModuleType.SplitLine]?: SplitLineModule;
      [ModuleType.PageSet]?: PageSetModule;
      // 序号
      [ModuleType.OrderNumber]?: OrderNumberModule;
      // 序号
      [ModuleType.MoreOrderNumber]?: MoreOrderNumberModule;
      // 冻结行维度 && 冻结列纬度
      [ModuleType.FreezeHead]?: FreezeHeadModule;
      // 多个数据标签设置 饼图
      [ModuleType.MultipleDataLabel]?: MultipleDataLabelModule;
      // 多轴图图表类型
      [ModuleType.MultiMetricType]?: MultiMetricTypeModule;

      [ModuleType.DimensionLimit]?: DimensionLimitModule;
      // 缩略轴类型
      [ModuleType.DataZoom]?: DataZoomModule;
      // 地图配色
      [ModuleType.MapTheme]?: MapThemeModule;
      // 地图显示范围
      [ModuleType.MapArea]?: MapAreaModule;
      // 地图钻取范围
      [ModuleType.MapDrill]?: MapDrillModule;
      //地图展示类型
      [ModuleType.MapMode]?: MapModeModule;
      [ModuleType.PieMode]?: PieModeModule;
      [ModuleType.GaugeMode]?: GaugeModeModule;
       // 指标图功能设置
      [ModuleType.CardSetting]?: CardSettingModule;
      //指标图展示类型
      [ModuleType.CardMode]?: CardModeModule;
      [ModuleType.BarMode]?: BarModeModule;
      [ModuleType.DataLabelPosition]?: DataLabelPositionModule;
      // 地图数值设置
      [ModuleType.MapDigitalSet]?: MapDigitalSetModule;
      // 警戒线
      [ModuleType.WarningLine]?: WarningLineModule;
      // 图表配色
      [ModuleType.ElementCoat]?: ElementCoatModule;
      // 图表背景配色
      [ModuleType.PaintCoat]?: PaintCoatModule;
      // 字体颜色
      [ModuleType.FontSetting]?: FontSettingModule;
      // 允许下载
      [ModuleType.Download]?: DownloadModule;
      // 数据联动
      [ModuleType.Linkage]?: JumpLinkModule;
      //图表跳转
      [ModuleType.JumpLink]?: LinkageModule;
      // 双轴图数据限制
      [ModuleType.MultiRange]?: MultiRangeModule;

      [ModuleType.Multilayers]?: MultilayerModel;

      [ModuleType.Columns]?: ColumnsModule;

      [ModuleType.Timer]?: TimerModule;

      [ModuleType.Forecast]?: ForecastModule;

      [ModuleType.ProgressLabel]?: ProgressModule;

      [ModuleType.GroupSetting]?: GroupSettingModule;
      [ModuleType.CompareData]?: CompareDataModule;
      [ModuleType.AxisyName]?: AxisyName
    }

    /**
     * 模块群类型
     */
    interface ModuleGroup {
      title: string;
      display: boolean;
      isGroup: boolean;
      childModules: ChartModules;
    }

    interface ChartModulesGroups extends ChartModules {}

    /**
     * 模块基础配置
     */
    interface ModulesBase<T> {
      // 是否显示
      display?: boolean;
      // 提示语
      tip?: string;
      // 默认值
      default?: T;
      // 父集合key值 目前所有的模块都放在 data 和styles 目录下
      parentNodeKey?: string;
      // 模块键值 保存数据时的名称
      moduleKey: string;
    }

    /**
     * 纬度指标模型
     */
    interface ChartSwitchModule extends H3.ReportModules.ChartSwitch, ModulesBase<string> {
      disabled?: Array<ChartType>;
    }

    /**
     * 纬度指标模型
     */
    interface MetricModule
      extends H3.ReportModules.Metric,
        ModulesBase<Array<H3.Report.FieldColumn>> {}
    /**
     * 纬度指标模型
     */
    interface DimensionModule
      extends H3.ReportModules.Dimension,
        ModulesBase<Array<H3.Report.FieldColumn>> {}
    /**
     * 纬度指标模型
     */
    interface GroupDimensionModule
      extends H3.ReportModules.GroupDimension,
        ModulesBase<Array<H3.Report.FieldColumn>> {}

    /**
     * 指标组模型
     */
    interface MetricGroupModule
      extends H3.ReportModules.MetricGroup,
        ModulesBase<Array<Array<H3.Report.FieldColumn>>> {}

    /**
     * 图例模块
     */
    interface LegendModule extends H3.ReportModules.Legend, ModulesBase<H3.Report.Legend> {}

    /**
     * 转化率对比
     */
    interface InvertModule extends H3.ReportModules.Invert, ModulesBase<H3.Report.Invert> {}
    /**
     * 分类汇总
     */
    interface CrossSummaryModule
      extends H3.ReportModules.CrossSummary,
        ModulesBase<H3.Report.CrossSummary> {}
    /**
     * 联动
     */
    interface LinkageModule extends H3.ReportModules.Linkage, ModulesBase<Array<string>> {}

    interface JumpLinkModule extends H3.ReportModules.JumpLink, ModulesBase<Array<any>> {}

    /**
     * 维度数据保留
     */
    interface DimensionLimitModule
      extends H3.ReportModules.DimensionLimit,
        ModulesBase<number | null> {}
    /**
     * Y坐标轴标题
     */
   interface AxisyName extends H3.ReportModules.AxisyName, ModulesBase<H3.Report.AxisyName> {}
    /**
     * 序号模块
     */
    interface OrderNumberModule
      extends H3.ReportModules.OrderNumber,
        ModulesBase<H3.Report.OrderNumber> {}
    /**
     * 序号模块
     */
    interface MoreOrderNumberModule
      extends H3.ReportModules.MoreOrderNumber,
        ModulesBase<H3.Report.MoreOrderNumber> {}
    /**
     * 配色模块
     */
    interface ThemeModule extends H3.ReportModules.Theme, ModulesBase<H3.Report.Theme> {}
    /**
     * 地图配色模块
     */
    interface MapThemeModule extends H3.ReportModules.MapTheme, ModulesBase<H3.Report.MapTheme> {}

    interface MapAreaModule extends H3.ReportModules.MapArea, ModulesBase<H3.Report.MapArea> {}

    interface MapDrillModule extends H3.ReportModules.MapDrill, ModulesBase<H3.Report.MapDrill> {}

    interface MapModeModule extends H3.ReportModules.MapMode, ModulesBase<H3.Report.MapMode> {}
    interface BarModeModule extends H3.ReportModules.BarMode, ModulesBase<H3.Report.BarMode> {}
    interface PieModeModule extends H3.ReportModules.PieMode, ModulesBase<H3.Report.PieMode> {
      selectList: Array<string>;
    }
    interface GaugeModeModule extends H3.ReportModules.GaugeMode, ModulesBase<H3.Report.GaugeMode> {
      selectList: Array<string>;
    }
    interface CardSettingModule extends H3.ReportModules.CardSetting, ModulesBase<H3.Report.CardSetting> {
      maxColTitle: string
    }
    interface CardModeModule extends H3.ReportModules.CardMode, ModulesBase<H3.Report.CardMode> {
      selectList: Array<string>;
    }
    interface DataLabelPositionModule
      extends H3.ReportModules.DataLabelPosition,
        ModulesBase<H3.Report.DataLabelPosition> {}
    interface DataLabelFontSizeModule
      extends H3.ReportModules.DataLabelFontSize,
        ModulesBase<H3.Report.DataLabelFontSize> {
          sizeList: Array<number>
        }
    interface MapDigitalSetModule
      extends H3.ReportModules.MapDigitalSet,
        ModulesBase<H3.Report.MapDigitalSet> {
      dimensionTitle: string;
      metricTitle: string;
    }
    // 定时器
    interface TimerModule extends H3.ReportModules.Timer, ModulesBase<H3.Report.Timer> {
      time: number | null;
    }

    /**
     * 进度图：标签设置
     */
    interface ProgressModule
      extends H3.ReportModules.ProgressLabel,
        ModulesBase<H3.Report.ProgressLabel> {
      valueTitle: string;
      percentTitle: string;
      targetTitle: string;
    }
    /**
     * 系列设置
     */
    interface GroupSettingModule
      extends H3.ReportModules.GroupSetting,
        ModulesBase<H3.Report.GroupSetting> {
      limitTitle: string;
      otherTitle: string;
      max: number;
      min: number;
    }

    /**
     * 数据保留多少
     */
    interface LimitModule extends H3.ReportModules.Limit, ModulesBase<number | null> {}
    // 转化率
    interface ConversionModule extends H3.ReportModules.Conversion, ModulesBase<boolean> {}
    interface SwitchLayersModule extends H3.ReportModules.SwitchLayers, ModulesBase<boolean> {}
    /**
     * 数据标签是否显示
     */
    interface DataLabelModule extends H3.ReportModules.DataLabel, ModulesBase<boolean | null> {}
    /**
     * 堆叠合计显示
     */
    interface DataLabelPileSumModule
      extends H3.ReportModules.DataLabelPileSum,
        ModulesBase<boolean | null> {}
    interface CompareDataModule
      extends H3.ReportModules.CompareData,
        ModulesBase<Array<string> | null> {}
    /**
     * 指标位置
     */
    interface TextAlignModule extends H3.ReportModules.TextAlign, ModulesBase<string | null> {}
    /**
     * 列表文本展示位置
     */
    interface ListTextAlignModule
      extends H3.ReportModules.ListTextAlign,
        ModulesBase<H3.Report.ListTextAlign> {}
    /**
     * 自适应大小
     */
    interface AdaptiveSizeModule
      extends H3.ReportModules.AdaptiveSize,
        ModulesBase<string | null> {}
    /**
     * 指标名展示
     */
    interface MetricLabelModule extends H3.ReportModules.MetricLabel, ModulesBase<boolean | null> {}
    interface MetricValueModule extends H3.ReportModules.MetricValue, ModulesBase<boolean | null> {}
    /**
     * 过滤
     */
    interface FilterNoneModule extends H3.ReportModules.FilterNone, ModulesBase<boolean | null> {}

    /**
     * 进度值排序
     */
    interface SortPercentModule extends H3.ReportModules.SortPercent, ModulesBase<number | null> {}
    /**
     * Y坐标轴设置（显示隐藏）
     */
    interface AxisYSetModule extends H3.ReportModules.AxisYSet, ModulesBase<boolean | null> {}
    /**
     * X轴相关设置
     */
    interface AxisXModule extends H3.ReportModules.AxisX, ModulesBase<H3.Report.AxisX> {
      axisXTitle?: string;
      directionTitle?: string;
    }
    /**
     * X轴相关设置
     */
    interface AxisYModule extends H3.ReportModules.AxisY, ModulesBase<H3.Report.AxisY> {
      labelTitle?: string;
    }

    /**
     * 缩略轴DataZoomModule
     */
    interface DataZoomModule extends H3.ReportModules.DataZoom, ModulesBase<H3.Report.DataZoom> {
      colorTitle: string;
    }
    /**
     * 预测
     */
    interface ForecastModule extends H3.ReportModules.Forecast, ModulesBase<H3.Report.Forecast> {
      numberTitle: string;
      change?: Function;
    }
    interface PageSetModule extends H3.ReportModules.PageSet, ModulesBase<H3.Report.PageSet> {
      size: number;
      rowSize?: number;
    }
    /**
     * 缩略轴DataZoomModule
     */
    interface ColumnsModule
      extends H3.ReportModules.Columns,
        ModulesBase<Array<H3.Report.Column>> {}
    /**
     * 最大值最小值
     */
    interface MetricRangeModule
      extends H3.ReportModules.MetricRange,
        ModulesBase<H3.Report.MetricRange> {
      maxTitle?: string;
      minTitle?: string;
    }
    /**
     * 最大值最小值
     */
    interface MultipleDataLabelModule
      extends H3.ReportModules.MultipleDataLabel,
        ModulesBase<H3.Report.MultipleDataLabel> {
      dimensionLabelTitle?: string;
      metricLabelTitle?: string;
      percentLabelTitle?: string;
    }
    /**
     * 最大值最小值
     */
    interface FreezeHeadModule
      extends H3.ReportModules.FreezeHead,
        ModulesBase<H3.Report.FreezeHead> {
      rowTitle?: string;
      columnTitle?: string;
      columnNumberTitle?: string;
      rowNumberTitle?: string;
    }
    /**
     * 排序
     */
    interface SortModule extends H3.ReportModules.Sort, ModulesBase<Array<H3.Report.FieldColumn>> {}

    /**
     * 过滤条件
     */
    interface FilterModule
      extends H3.ReportModules.Filter,
        ModulesBase<Array<H3.Report.FieldColumn>> {}
    /**
     * y轴网格线
     */
    interface SplitLineModule extends H3.ReportModules.SplitLine, ModulesBase<boolean | null> {}

    /**
     * 多轴图多种数据类型
     */
    interface MultiMetricTypeModule
      extends H3.ReportModules.MultiMetricType,
        ModulesBase<Array<"bar" | "line" | "area" | "pileBar"> | null> {}

    /**
     * 警戒线
     */
    interface WarningLineModule
      extends H3.ReportModules.WarningLine,
        ModulesBase<H3.Report.WarningLine[]> {}

    /**
     * 图表配色
     */
    interface PaintCoatModule
      extends H3.ReportModules.PaintCoat,
        ModulesBase<H3.Report.PaintCoat> {}
    /**
     * 图表背景配色
     */
    interface ElementCoatModule
      extends H3.ReportModules.ElementCoat,
        ModulesBase<H3.Report.ElementCoat> {}
    /**
     * 字体颜色
     */
    interface FontSettingModule
      extends H3.ReportModules.FontSetting,
        ModulesBase<H3.Report.FontSetting> {
      headTitle: string;
      contentTitle: string;
      displayFontSize: boolean;
      fontSizeTitle: string;
    }

    /**
     * 下载
     */
    interface DownloadModule extends H3.ReportModules.Download, ModulesBase<boolean> {}

    /**
     * 双轴图数据限制
     */
    interface MultiRangeModule
      extends H3.ReportModules.MultiRange,
        ModulesBase<Array<H3.Report.MetricRange>> {}

    /**
     * 多图层参数结构
     */
    interface MultilayerModel extends H3.ReportModules.Multilayer, ModulesBase<boolean> {}
    /**
     * 访问参数模型
     */
    interface AccessCondition {
      config: any;
      corpId: String;
      ownerId: String;
      dataSourceId: String;
    }
    /**
     * 回调参数
     */
    interface OptionCallbacks {
      closeCallback: null | Function;
      addCallback: null | Function;
      backCallback: null | Function;
      editCallback: null | Function;
      detailCallback: null | Function;
    }
    /**
     * 图表个人信息
     */
    interface ChartInfo {
      chartId?: string;
      content?: any; // 排序信息
      viewStatus?: 0 | 1; //0表示没查看过，1表示查看过
      updateDate?: string; // 更新时间
      updateUser?: string;
      updateUserName?: string; // 更新人
    }
  }
}
