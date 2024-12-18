declare namespace H3 {
  /**
   * API
   */
  namespace ReportModules {
    /**
     * 模块基础配置
     */
    interface ModulesBase {
      // 是否显示
      display?: boolean;
      // 显示名称
      title?: string;
      tip?: string;
    }

    interface FieldMapping extends ModulesBase {
      max: number; // 最大行数
      min: number; // 最小行数
      supportedTypes: string[]; // 支持字段类型
      change?: Function; // change事件
      disabled?: boolean; // 是否可选
      canRepeat?: boolean; // 是否允许字段重复
      isSupportedAggregate?: boolean; //判断是否是汇总字段(计算字段包含聚合函数)
    }

    /**
     * 图表维度属性
     */
    export interface Dimension extends FieldMapping {
      batch?: boolean; // 是否支持批量添加
    }
    /**
     * 定时器
     */
    export interface Timer extends ModulesBase {}
    export interface CompareData extends ModulesBase {}

    /**
     * 进度图
     * @param displayValue 显示值
     * @param displayPercent 显示占比
     * @param displayTarget 显示目标值
     *
     */
    export interface ProgressLabel extends ModulesBase {
      displayValue: boolean;
      displayPercent: boolean;
      displayTarget: boolean;
    }
    /**
     * 系列设置
     * @param limit 系列数量
     * @param showOther 显示'其他'
     *
     */
    export interface GroupSetting extends ModulesBase {
      limit: number;
      showOther: boolean;
    }

    /**
     * 图表维度属性
     */
    export interface GroupDimension extends FieldMapping {}

    /**
     *
     */
    export interface MultiTypeData {
      title: string;
      key?: string;
      options: Array<"bar" | "line" | "area" | "pileBar">;
    }

    /**
     * 多指标时图标类型类型
     */
    export interface MultiMetricType extends ModulesBase {
      // 多轴配置数据
      data: Array<MultiTypeData>;
    }

    /**
     * 多极限值模块类型
     */
    export interface MultiRange extends ModulesBase {
      // 极限值配置数据
      data: Array<MetricRange>;
    }

    /**
     * 多图表模块
     */
    export interface Multilayer extends ModulesBase {
      parentUid: string | null;
      uuid?: string;
      layerTitle?: string;
    }
    /**
     * 多组指标
     */
    export interface MetricGroup extends ModulesBase {
      // 最多允许多少个维度
      max: number;
      // 极限值配置数据
      data: Array<Metric>;
      // 监听改变
      change?: Function;
    }

    /**
     * 图表指标属性
     */
    export interface Metric extends FieldMapping {}

    /**
     * 图表排序属性
     */
    export interface Sort extends FieldMapping {
      moduleTypes: null | Array<"dimension" | "groupDimension" | "metric">;
    }

    /**
     * 筛选条件
     */
    export interface Filter extends FieldMapping {}
    /**
     * 筛选条件
     */
    export interface InnerFilter extends FieldMapping {}

    /**
     * 图表切换
     */
    export interface ChartSwitch extends ModulesBase {}

    /**
     * 图表主题属性
     */
    export interface Theme extends ModulesBase {
      themeType?: string | null; // 主题样式类型
    }

    /**
     * 地图主题属性
     */
    export interface MapTheme extends ModulesBase {}
    export interface MapMode extends ModulesBase {}
    export interface BarMode extends ModulesBase {}
    export interface PieMode extends ModulesBase {}
    export interface GaugeMode extends ModulesBase {}
    export interface CardSetting extends ModulesBase {}
    export interface CardMode extends ModulesBase {
      change?: Function; // change事件
    }
    export interface DataLabelPosition extends ModulesBase {}
    export interface DataLabelFontSize extends ModulesBase {
      sizeList: Array<number>
    }
    export interface MapArea extends ModulesBase {
      change?: Function; // change事件
    }

    export interface MapDrill extends ModulesBase {}

    export interface MapDigitalSet extends ModulesBase {}

    /**
     * 图表标题
     */
    export interface ChartTitle extends ModulesBase {}

    /**
     * 图表指标范围
     */
    export interface MetricRange extends ModulesBase {}

    /**
     * 数据限制
     */
    export interface Limit extends ModulesBase {}
    /**
     * 转化率
     */
    export interface Conversion extends ModulesBase {}
    export interface SwitchLayers extends ModulesBase {}
    /**
     * 网格线
     */
    export interface SplitLine extends ModulesBase {}

    /**
     * 图表方向
     */
    export interface Direction extends ModulesBase {}

    /**
     * 滚动条设置
     */
    export interface DataZoom extends ModulesBase {}
    export interface Forecast extends ModulesBase {
      change?: Function;
    }
    export interface PageSet extends ModulesBase {}

    export interface Columns extends ModulesBase {}

    /**
     * 维度数据限制
     */
    export interface DimensionLimit extends ModulesBase {}

    /**
     * 数据显示设置
     */
    export interface DataLabel extends ModulesBase {}
    /**
     * 显示堆叠合计
     */
    export interface DataLabelPileSum extends ModulesBase {}
    /**
     * 数据显示设置
     */
    export interface TextAlign extends ModulesBase {}

    /**
     * 列表数据显示设置
     */
    export interface ListTextAlign extends ModulesBase {}

    /**
     * 数据显示设置
     */
    export interface ListTextAlign extends ModulesBase {}
    /**
     * 数据显示设置
     */
    export interface AdaptiveSize extends ModulesBase {}
    /**
     * 指标名展示
     */
    export interface MetricLabel extends ModulesBase {}
    export interface MetricValue extends ModulesBase {}
    /**
     * 过滤
     */
    export interface FilterNone extends ModulesBase {}
    /**
     * 进度值排序
     */
    export interface SortPercent extends ModulesBase {}
    /**
     * y轴坐标轴设置
     */
    export interface AxisYSet extends ModulesBase {}

    /**
     *  图例设置
     */
    export interface Legend extends ModulesBase {
      checked: boolean; // 是否勾选
      position: "top" | "bottom" | "left" | "right"; // 位置
    }
    /**
     *  转化率
     */
    export interface Invert extends ModulesBase {
      show: boolean; // 是否勾选
      mode: "next" | "all"; // 模式
    }
    /**
     *  小计
     */
    export interface CrossSummary extends ModulesBase {
      columnSummaries: Array<Summaries>;
      rowSummaries: Array<Summaries>;
      columnSummary: boolean;
      columnSummaryPosition: number;
      rowSummary: boolean; // 行汇总是否展示，true或者没有表示要展示，false表示不展示
      rowSummaryPosition: number; // 行汇总位置，0或者没有表示下边，1表示上边
    }
    export interface Summaries {
      dimIds: Array<string>;
      aggregateType: string;
      subTotalText: string;
    }

    /**
     *  x坐标设置
     */
    export interface AxisX extends ModulesBase {
      displayAxisX?: boolean; // 显示坐标轴
      displayLabel?: boolean; // 显示标签
      direction?: "crosswise" | "endwise" | "leftBank" | "rightBank";
    }
    /**
     *  y坐标设置
     */
    export interface AxisY extends ModulesBase {
      displayLabel?: boolean; // 显示标签
      displayName?: boolean; //显示Y轴标题
      leftYName?: string | null; //左轴标题
      rightYName?: string | null; //右轴标题
    }
    /**
     *  y轴标题
     */
     export interface AxisyName extends ModulesBase {
      displayName?: boolean; // 显示标题
      defaultName? : string; //左轴标题
      rightYName?: string; // 右轴标题
    }
    
    /**
     * 多种类数据显示设置
     */
    export interface MultipleDataLabel extends ModulesBase {}

    /**
     * 图表联动
     */
    export interface Linkage extends ModulesBase {}
    /**
     * 图表跳转
     */
    export interface JumpLink extends ModulesBase {}

    /**
     * 导出
     */
    export interface Download extends ModulesBase {}

    /**
     * 配置序号
     */
    export interface OrderNumber extends ModulesBase {
      displayOrderName: boolean; // 是否显示序号名称
      checked: boolean; // 是否勾选
      orderName?: string; // 序号名称
    }
    export interface MoreOrderNumber extends ModulesBase {
      displayOrderName: boolean; // 是否显示序号名称
      checked: boolean; // 是否勾选
      uids: Array<any>;
      orderName?: string; // 序号名称
    }
    /**
     * 配置冻结设置
     */
    export interface FreezeHead extends ModulesBase {
      displayRow: boolean;
      displayColumn: boolean;
      displayColumnNumber: boolean;
      displayRowNumber: boolean;
      row?: boolean; // 行冻结
      column?: boolean; // 列冻结
      columnNumber?: number; // 列冻结数量
      rowNumber?: number; // 行冻结数量
    }
    export interface Modules extends ChartDataModules, ChartStylesModules {}
    /**
     * 警戒线
     */
    export interface WarningLine extends ModulesBase {}

    /**
     * 字体设置
     */
    export interface FontSetting extends ModulesBase {
      defaultFontColor?: string | null; // 默认字体颜色
      defaultTitleColor?: string | null; // 默认标题颜色
    }

    /**
     * 图表配色
     */
    export interface ChartColor extends ModulesBase {}

    /**
     * 元件背景
     */
    export interface ElementCoat extends ModulesBase {
      defaultColor?: string | null; //默认颜色
    }

    /**
     * 容器背景
     */
    export interface PaintCoat extends ModulesBase {
      defaultColor?: string | null; //默认颜色
    }

    export interface PaintCoatTheme extends ModulesBase {}

    /**
     * 数据模块
     */
    export interface ChartDataModules {
      chartSwitch?: ChartSwitch; // 图表切换
      chartTitle?: ChartTitle; // 图表标题
      groupDimension?: GroupDimension; // 维度(列维度)
      dimension?: Dimension; // 维度(行维度)
      metric?: Metric; // 指标
      metricGroup?: MetricGroup; // 多个指标
      sort?: Sort; // 排序
      limit?: Limit; // 数据显示
      filter?: Filter; // 过滤
      mapArea?: MapArea; // 地图显示范围
      Multilayer?: Multilayer; //多图层
      columns?: Columns;
      timer?: Timer;
      pageSet?: PageSet;
      conversion?: Conversion;
      invert?: Invert;
      switchLayers?: boolean;
      crossSummary?: CrossSummary;
      moreOrderNumber?: MoreOrderNumber;
      forecast?: Forecast;
      groupSetting?: GroupSetting;
      filterNone?: boolean | null;
      sortPercent?: boolean | null;
    }

    export interface GlobalStylesModules {
      paintCoatTheme?: PaintCoatTheme; // 仪表盘主题
      paintCoat?: PaintCoat; // 仪表盘背景色
      elementCoat?: ElementCoat; // 组件背景色
      fontSetting?: FontSetting; // 字体颜色
      theme?: Theme; // 主题
    }
    /**
     * 样式模块
     */
    export interface ChartStylesModules extends GlobalStylesModules {
      dimensionLimit?: DimensionLimit; // 维度显示
      metricRange?: MetricRange; // 指标范围
      direction?: Direction; // 滚动条方向
      dataLabel?: DataLabel; // 数值显示
      dataLabelPileSum?: DataLabelPileSum; // 显示堆叠合计
      dataLabelPosition?: DataLabelPosition; // 标签位置
      dataLabelFontSize?: DataLabelFontSize; // 标签文字大小
      adaptiveSize?: AdaptiveSize; // 比例大小
      textAlign?: TextAlign; // 文字位置
      metricLabel?: MetricLabel; // 指标名展示
      metricValue?: MetricValue; // 指标值展示
      multipleDataLabel?: MultipleDataLabel; // 多种类数值显示
      multiMetricType?: MultiMetricType; // 多个指标的图标类型
      multiRange?: MultiRange | null; // 多组极限值
      linkage?: Linkage; // 图表联动
      jumpLink?: JumpLink; // 图表联动
      download?: Download;
      orderNumber?: OrderNumber;
      freezeHead?: FreezeHead;
      legend?: Legend; // 图例
      axisX?: AxisX; // x轴
      axisY?: AxisY; // y轴
      axisyName? : AxisyName; // Y轴标题
      warningLine?: WarningLine; // 警戒线
      chartColor?: ChartColor; // 图表配色
      dataZoom?: DataZoom; // 缩略轴设置
      mapTheme?: MapTheme; // 地图配色
      mapDrill?: MapDrill; // 地图钻取范围
      mapMode?: MapMode; //地图展示类型
      pieMode?: MapMode; //饼图展示类型
      gaugeMode?: MapMode; //仪表图展示类型
      mapDigitalSet?: MapDigitalSet; //地图数值标签显示设置
      progressLabel?: ProgressLabel; // 进度图标签展示设置
      listTextAlign?: ListTextAlign; //列表图文字对齐方式
      barMode?: BarMode; //
      cardMode?: CardMode; //指标图展示模式
      cardSetting?: CardSetting; //指标图设置
    }

    export interface GlobalModules {
      styles: GlobalStylesModules;
    }

    export interface ChartModules {
      data?: ChartDataModules; // 数据模块
      styles: ChartStylesModules; // 样式模块
    }
  }
}
