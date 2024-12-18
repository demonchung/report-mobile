declare namespace H3 {
  /**
   * API
   */
  namespace Report {
    /**
     * 报表4种状态
     */

    export enum State {
      DESIGN = "design", // 设计器状态
      DASHBOARD = "dashboard", // 报表展示状态
      PREVIEW = "preview", // 预览状态
      SINGLE = "single" // 单例图表状态
    }
    /**
     * 图片模式枚举
     */
    export enum ImageType {
      ADAPTIVE = "adaptive" // 自适应
    }
    /**
     * 元件类型枚举
     */
    export enum ElementType {
      BAR = "bar", // 柱状图
      PILEBAR = "pileBar", // 堆叠柱状图
      STRIPE = "stripe", // 条形图
      PILESTRIPE = "pileStripe", // 条形图
      LINE = "line", // 折线图
      AREA = "area", // 面积图
      PIE = "pie", // 饼图
      FUNNEL = "funnel", // 漏斗图
      RADAR = "radar", // 雷达图
      TABLE = "table", // 透视图
      CROSSTABLE = "crosstable", // 透视图
      LIST = "list", // 明细表
      CARD = "card", // 指标图
      BIAX = "biax", // 双轴图
      SCATTER = "scatter", // 散点图（气泡图）
      LONGTEXT = "longText", // 文本图
      IMAGE = "image", // 文本图
      FILTERPICKER = "filterPicker", // 过滤器
      MAP = "map", //地图
      PROGRESSBAR = "progressBar", // 进度图
      GAUGE = "gauge", // 仪表图
      WEB = "web", //web 组件
      TAB = "tab", //tab 组件
      FUNNELCOMPARE = "funnelCompare", // 漏斗对比图
      PERCENTPILEBAR = "percentPileBar", // 百分比堆积柱状图
      PERCENTPILESTRIPE = "percentPileStripe" // 百分比堆积条形图
    }

    /**
     * 图表连接关系
     */
    export enum ChartUseType {
      CONNECT = 1,
      ETL = 100
    }
    /**
     * 双轴图可选图形
     */
    export enum BiaxChartType {
      BAR = "bar", // 柱状图
      PILEBAR = "pileBar", // 堆叠柱状图
      LINE = "line", // 折线图
      AREA = "area" // 面积图
    }
    /**
     * 报表配置
     */
    export interface Report {
      attributes?: string; // 报表预览属性
      title?: string; // 报表名称
      objectId?: string; // 报表ID
      global: Global | string; // 报表默认配置
      charts?: Array<Chart | FilterPicker | LongText> | string; // 报表所有图表
    }
    export interface Global {
      data?: H3.Report.ChartDataGroup; // 数据模块
      styles: H3.Report.GlobalCoatGroup; // 样式模块
    }
    /**
     * 数据源列表
     */
    export interface DataSourceList {
      displayName: string; // 一级菜单名称
      children: Array<FieldColumnList>; // 二级菜单数据集
    }
    /**
     * 数据源
     */
    export interface DataSource {
      dataSourceId: string; // 数据源ID
      displayName: string; // 数据源名称
      properties: Array<FieldColumn>; // 数据源字段
      relationsFields?: Array<RelationField> | null; // 字段关联关系
      dynamicParams?: Array<DynamicParams> | null; // 字段关联关系
      mainTable?: string; // 后台冗余主表name
      sqlParams?: Array<SqlParam> | null;
    }
    /**
     * 动态字段
     */
    export interface DynamicParams {
      dataType: string;
      field: string;
      name: string;
      operator: string;
      type: string;
      values: any[];
    }

    /**
     * 动态参数设置
     */
    export interface SqlParam {
      dataType?: any; // 业务数据类型
      field: string; // 动参字段
      name: string; // 动参别名
      operator: string; // 操作类型
      operation?: string; // 当operator=DYNAMIC时，operation可以是EQUAL或者NOTEQUAL
      type: string; // 字段类型
      values: Array<any>; // 动参值
      options?: OptionalParam; // 业务参数
    }

    interface OptionalParam {
      format?: string; // 日期格式
      relation?: RelationParam; // 关联表单信息
    }
    interface RelationParam {
      schemaCode: string; // 关联表单业务编码
      schemaName: string; // 关联表单展示名称
      tableCode: string; // 关联表单数据库表编码
      fieldCode: string; // 动参编码
      fieldName: string; // 动参展示名称
    }

    export interface CustomeSort {
      [key: string]: Array<any>;
    }
    /**
     * 字段的关联关系
     */
    export interface RelationField {
      mainField: string;
      mainFieldName: string;
      relField: string;
      relFieldName: string;
      relations: any;
      relSchemaCode: string;
    }
    /**
     * 基础元件属性
     */
    export interface BaseElement extends ElementPosition {
      uid: string; // 图表UID
      title: string; // 图表标题
      type: ElementType; // 元件类型
      handleActive?: Boolean; // 是否被激活
      addStatus?: boolean; // 添加状态
      // 一下为新版
      dataSourceId: string | null; // 数据源ID
      authorization: number | null; // 数据权限 0, 1
      useType: ChartUseType | null; // /使用类型，1-表示直连数据库，100-表示ETL
      __key__?: string; // 随机字符串
      parentUid?: string | null; //联动父级uid 用于做下钻,
      layerTitle?: string;
      layerActiveIndex?: number; //联动下钻层级索引 0表示第一层，1表示第二层
      objectId?: string;
      formulas?: any;
    }
    /**
     *  Tabs组件
     */
    export interface Tab extends BaseElement {
      tabs: Array<TabItem>;
      visibleTitle: boolean; // 是否显示标题
    }
    export interface TabItem {
      chartIds: Array<string>;
      title: string;
    }
    /**
     *  图片
     */
    export interface Image extends BaseElement {
      mode: string; // 模式
      content: string; // url || 图片
      fileName: string; // 文件名
      showMode?: string | undefined; //展示类型
    }
    /**
     *  web组件
     */
    export interface WEB extends BaseElement {
      content: string; // url || 图片
      fileName: string; // 文件名
      showMode?: string; //展示类型
    }
    /**
     * 基础元件定位信息
     */
    export interface ElementPosition {
      x: number; // 坐标X
      y: number; // 坐标Y
      w: number; // 宽度
      h: number; // 高度
      i: number; // 排序位置
    }
    /**
     * 图表属性
     */
    export interface Chart extends BaseElement {
      edit?: boolean; // 是否编辑过，编辑状态使用
      handleActive?: Boolean; // 是否被激活
      data: H3.Report.ChartDataGroup; // 数据模块
      styles: H3.Report.ChartStyleGroup; // 样式模块
      mobileOptions?: H3.Report.ChartMobile;
      linkageFilter?: Array<H3.Report.FilterFieldColumn>;
      layerFilter?: Array<H3.Report.FilterFieldColumn>;
      filterPicker?: { [FilterPickerId: string]: Array<H3.Report.FilterFieldColumn> };
      pageSize?: number; // 分页大小 保存时要删掉
      colPageSize?: number; // 分页大小 保存时要删掉
      pageIndex?: number; // 获取第几页 保存时要删掉
      colPageIndex?: number; // 获取第几页 保存时要删掉
      mapSource?: H3.Report.MapColumn; // 保存时删除 地图请求
      columnsSetting?: Array<H3.List.columnSetting>; // 明细表表格列宽等配置信息
      relations?: Array<any> | null; // 关联字段关系
      dynamicParams?: Array<H3.Report.DynamicParams> | null; // 动态参数
      customSort?: H3.Report.CustomeSort;
      jumpingRules?: string;
      isNew?: boolean;
      formulas?: Array<H3.Report.computeField>; //计算字段
      conditionFormats?: Array<H3.Report.ConditionFormat>; //条件格式
      mainTable?: string; // 后台冗余主表名
      tabUid?: string; // 当前图表属于哪个tab组件
      tabIndex?: number; // 当前tab属于哪个标签页
      moveStatus?: boolean; // 当前图表是否在拖拽中
    }

    /**
     * 图表属性
     */
    export interface ChartMobile {
      position: {
        x: number; // 坐标X
        y: number; // 坐标Y
        w: number; // 宽度
        h: number; // 高度
        i: number; // 排序位置
      };
      visible: true;
    }
    /**
     * 图表属性
     */
    export interface NewChart extends BaseElement {
      edit?: boolean; // 是否编辑过，编辑状态使用
      handleActive?: Boolean; // 是否被激活
      data: H3.Report.ChartDataGroup; // 数据模块
      styles: H3.Report.ChartStyleGroup; // 样式模块
      useType: ChartUseType | null; // /使用类型，1-表示直连数据库，100-表示ETL
      linkageFilter?: Array<H3.Report.FilterFieldColumn>;
      layerFilter?: Array<H3.Report.FilterFieldColumn>;
      filterPicker?: { [FilterPickerId: string]: Array<H3.Report.FilterFieldColumn> };
      mapSource?: H3.Report.MapColumn; // 保存时删除 地图请求
      columnsSetting?: Array<H3.List.columnSetting>; // 明细表表格列宽等配置信息
    }
    /**
     * 筛选器
     */
    export interface FilterPicker extends BaseElement {
      chartIds: Array<string>; // 图表ids
      dataSources: Array<FilterDataSource>; // 数据类型
      format: string; // 筛选格式
      field: H3.Report.FieldColumn;
      formula: string; // 筛选公式
      text: Array<string | number>; // 筛选文本
      filterLinkages?: Array<string>; //筛选联动
      selectDateType?: string; //日期筛选类型
      operation?: string; //日期选项是否是不等于
    }
    /**
     * 图表关系对象 通过parentUid 如果是顶级图层就是null
     */
    export interface chartRelations {
      [key: string]: Array<chartLayer>;
    }

    export interface chartLayer extends Chart {
      uid: string;
      parentUid?: string | null;
      title: string;
      layerTitle?: string;
      mainTable?: string;
    }

    export interface chartTimer {
      [key: string]: any;
    }
    /**
     * 全新全局筛选器
     */
     export interface GlobalFilter {
      uid: string | number;
      title: string;
      chartIds: Array<string>; // 图表ids
      dataSources: Array<FilterDataSource>; // 数据类型
      format: string; // 筛选格式
      field?: H3.Report.FieldColumn;
      formula: string; // 筛选公式
      text: Array<string | number>; // 筛选文本
      operation?: string; //日期选项是否是不等于
      selectDateType?: undefined | string;
    }

    /**
     * 富文本编辑器
     */
    export interface LongText extends BaseElement {
      edit: boolean; // 是否编辑过，编辑状态使用
      content: string; // 文本内容
    }
    /**
     * 图表属性
     */
    export interface ActiveChart {
      chart?: Chart; // 图表属性
      modules?: H3.ReportModules.ChartModules; // 图表模块
    }

    /**
     * 多种类数值标签显示
     */
    export interface MultipleDataLabel {
      dimensionLabel: boolean | null;
      metricLabel: boolean | null;
      percentLabel: boolean | null;
    }

    /**
     * 警戒线
     */
    export interface WarningLine {
      title: string; // 名称
      type: string; // 类型：fixed(固定值)、dynamic(动态值)
      field?: string; // 指标uuid、唯一标识
      aggregate?: string; // 警戒线值类型 max min average
      value?: number | string; // 警戒线值
      is_title: boolean; // 显示内容：是否为名称
      is_value: boolean; // 显示内容：是否为数值
      color: string; // 警戒线颜色
      numberFormat?: H3.Report.NumberFormat; //警戒线
    }

    /**
     * 仪表盘全局涂层
     */
    export interface GlobalCoatGroup extends ChartStyleGroup {
      paintCoatTheme: string; // 仪表盘 - 主题 default/theme1/theme2/theme3/theme4/...
      paintCoat: PaintCoat; // 仪表盘 - 背景色设置
      elementCoat: ElementCoat; // 仪表盘 - 组件背景色设置
      fontSetting: FontSetting; // 字体设置
      styleSetting: { [key: string]: string }; // 样式设置
    }

    /**
     * 仪表盘背景色设置
     */
    export interface PaintCoat {
      type?: string; // 'bgColor', 'bgPicture'
      value?: string; // '#F3F5F8', 'A/B/C.PNG'
    }

    /**
     * 组件背景色设置
     */
    export interface ElementCoat {
      type?: string | null; // 'bgColor', 'bgPicture'
      value?: string | null; // '#ffffff', 'A/B/C.PNG'
    }

    /**
     * 字体设置
     */
    export interface FontSetting {
      titleColor: string | null; // 标题颜色
      fontColor: string | null; // 字体颜色
      fontSize: number; // 字体大小
      // type: string // 字体类型 例：宋体、雅黑...
    }

    /**
     * 图表样式模块分组
     */
    export interface ChartStyleGroup {
      elementCoat?: ElementCoat | null; // 组件背景色设置(单个图表背景色设置)
      theme?: Theme; // 主题
      metricRange?: MetricRange; // 指标范围
      dimensionLimit?: number | null; // 维度显示
      direction?: "top" | "bottom" | "left" | "right"; // 滚动条方向
      dataLabel?: boolean | null; // 数值显示
      dataLabelPileSum?: boolean | null; // 数值显示
      dataLabelFontSize?: DataLabelFontSize; // 标签文字大小
      metricLabel?: boolean | null; // 指标名展示
      metricValue?: boolean | null; // 指标值展示
      adaptiveSize?: string | null; // 比例大小
      textAlign?: string | null; // 文字位置
      barMode?: string | null;
      multipleDataLabel?: MultipleDataLabel; // 多种类数值显示
      multiMetricType?: Array<"bar" | "line" | "area" | "pileBar"> | null; // 多指标图标类型
      multiRange?: Array<MetricRange> | null; // 多组极限值
      linkage?: Array<string>; // 图表联动 图表ID
      jumpLink?: Array<string>; //图表跳转
      download?: boolean | null; // 操作设置-导出
      orderNumber?: OrderNumber; // 配置序号
      freezeHead?: FreezeHead; // 配置冻结
      legend?: Legend;
      axisX?: AxisX;
      axisY?: AxisY;
      axisyName: AxisyName;
      warningLine?: Array<WarningLine>; // 警戒线
      chartColor?: string; // 图表配色类型
      fontSetting?: FontSetting | null; // 字体设置
      splitLine?: boolean | null; // 网格线设置
      axisYSet?: boolean | null; // Y轴显示隐藏设置
      dataZoom?: DataZoom; // 缩略轴设置
      mapTheme?: MapTheme; // 地图配色
      mapDrill?: MapDrill; // 地图钻取范围
      mapMode?: MapMode; //地图类型，气泡样式等...
      pieMode?: PieMode; //饼图
      cardMode?: CardMode; //指标图
      cardSetting?: CardSetting; //指标图设置
      dataLabelPosition?: DataLabelPosition; //标签位置
      gaugeMode?: GaugeMode; //仪表图
      mapDigitalSet?: MapDigitalSet; //地图数值标签显示设置
      progressLabel?: ProgressLabel; // 进度图标签显示设置
      listTextAlign?: ListTextAlign; // 列表图对齐方式
      openGroupFilter?: boolean;
    }
    export interface MapTheme {
      theme: string; // 地图配色类型
    }

    export interface MapArea {
      area: "all" | "province" | "city"; // 显示范围
      province?: {
        code: string | number;
        name: string;
      }; // 显示范围的省
      city?: {
        code: string | number;
        name: string;
      }; // 显示范围的城市
    }

    export interface MapDrill {
      drill: "province" | "city" | "disabled"; // 钻取到的级别
    }

    export interface MapDigitalSet {
      displayDimension: boolean; // 显示维度值
      displayMetric: boolean; // 显示指标值
    }

    export interface MapMode {
      mode: "area" | "bubble"; //地区和气泡两种方式
    }

    export interface BarMode {
      mode: "bar" | "pileBar" | "stripe" | "pileStripe";
    }
    export interface PieMode {
      mode: "ring" | "solid"; // 空心和实心
    }

    export interface GaugeMode {
      mode: "in" | "out"; // 里和外模式
    }

    export interface CardSetting {
      maxColumns: number; // 里和外模式
    }
    export interface CardMode {
      mode: "card" | "list"; // 卡片与列表
    }
    export interface DataLabelPosition {
      position: "pie" | "legend";
      detail: "out" | "in";
    }
    export interface DataLabelFontSize {
      size: number;
    }
    /**
     *  X坐标设置
     */
    export interface AxisX {
      displayAxisX: boolean; // 显示坐标轴
      displayLabel: boolean; // 显示标签
      direction: "crosswise" | "endwise" | "leftBank" | "rightBank"; // 方向
    }
    /**
     *  X坐标设置
     */
    export interface AxisY {
      displayLabel: boolean; // 显示标签
      displayName?: boolean; //显示Y轴标题
      leftYName?: string | null; //左轴标题
      rightYName?: string | null; //右轴标题
    }
    export interface AxisyName {
      displayName?: boolean; // 显示标题
      defaultName?: string; //左轴标题
      rightYName?: string; // 右轴标题
    }

    /**
     * 过滤器数据源
     */
    export interface FilterDataSource {
      dataSourceId: string; // 数据源ID
      displayName: string; // 数据源名称
      field: FieldColumn | null;
      sqlParams?: number; // 数据源含动态参数？ 1-是
    }
    /**
     * 图表数据模块分组
     */
    export interface ChartDataGroup {
      dimension: Array<FieldColumn>; // 维度(行维度)
      groupDimension?: Array<FieldColumn>; // 维度(列维度)
      metric: Array<FieldColumn>; // 指标
      metricGroup: Array<Array<FieldColumn>>; // 多组指标
      sort: Array<FieldColumn>; // 排序
      filter?: Array<FilterFieldColumn>; // 过滤
      innerFilter?: Array<FilterFieldColumn>; // 图内筛选
      limit?: number | null; // 数据显示
      filterNone?: boolean | null; // 过滤空值
      sortPercent?: number | null; // 进度值排序
      chartSwitch: string; // 图表切换
      mapArea?: MapArea; // 地图显示范围
      pageSet?: PageSet; // 地图显示范围
      columns?: Array<any>; // 列宽
      pageSize?: number; // 分页大小 保存时要删掉
      pageIndex?: number; // 获取第几页 保存时要删掉
      parentUid?: string;
      layerTitle?: string;
      timer?: Timer;
      conversion?: boolean;
      switchLayers?: boolean;
      invert?: Invert;
      crossSummary?: CrossSummary;
      forecast?: Forecast;
      moreOrderNumber?: MoreOrderNumber;
      groupSetting?: GroupSetting;
      relations?: Array<any> | null; // 关联关系
      compareData?: Array<string>;
    }

    /**
     * 通用字段属性
     */
    export interface FieldColumn {
      uid: string; // uid
      associationCode: string; // 关联表单业务类型
      schemaCode: string; // 模型code
      tableId: string; //  列表ID
      tableName: string; // 列表名称
      parentSchemaCode?: string; //模型父节点code
      field: string; // 绑定字段
      name: string; // 字段名称
      type: string; // 字段类型
      alias?: string; // 字段别名
      needAlias?: boolean; // 是否是别名字段
      dataType: number; // 数据库字段类型
      options: FieldColumnOptions; // 配置项
      visible: boolean; // 是否显示
      isRemove?: boolean; // 是否被删除
      relation: boolean; // 是否是关联表
      specialType?: string;
      primaryKey?: boolean; // 是否是主键
      mainField?: string; // 属于哪个字段的关联表
      isDimension?: boolean; //是否属于维度,这个字段需要用到
      status: number; // 字段状态， 0：表示非用户配置字段，1：表示用户配置的字段
    }

    /**
     * 通用字段 - 数据源列表
     */
    export interface FieldColumnList {
      displayName: string; // 二级菜单值名称
      dataSourceId: string; // 二级菜单值ID
    }

    /*
     * 字段显示模型
     */
    export interface FieldDisplay {
      displayName: string;
      field: FieldColumn | FilterFieldColumn;
    }
    /**
     * 过滤字段属性
     */
    export interface FilterFieldColumn {
      formula: string; // 过滤公式
      field: FieldColumn | any; // 过滤字段
      text: Array<string | number | any>; // 过滤条件
      selectDateType?: string | undefined;
      operation?: string;
      labels?: Array<string>; //转换后的数组集合
      ands?: Array<any>; //过滤条件--与|或
      ors?: Array<any>;
    }
    /**
     * 地图通用属性
     */
    export interface MapColumn {
      code: string | number;
      name: string;
    }

    export interface FieldColumnOptions {
      format?: string; // 日期格式
      areaType?: string; // 地址格式
      order?: "asc" | "desc"; // 升序或者降序
      isCustomSort: boolean; //是否自定义排序
      aggregateType?: string; // 聚合运算
      percent?: "DEFAULT" | "PERCENT"; // 汇总结果显示 DEFAULT || PERCENT
      ratio?: number; // 同/环比分析
      numberFormat?: NumberFormat; // 数值格式
      resultFilter?: ResultFilter; // 结果筛选器
      hidden?: boolean; // 隐藏字段
      dateFormat?: DateFormat; // 明细表日期格式
      dateComplete?: number; // 日期自动补全
      targetValue?: TargetValue; // 目标值设置
      transformBar?: boolean; //显示为数据条
      isAggregate?: boolean; //是否为汇总字段(字段中使用聚合函数)
      isComputeField?: boolean; //是否为计算字段
      conditionFormat?: boolean; //条件格式设置
    }
    export interface NumberFormat {
      comma: boolean; // 千分符
      percent: boolean; // 百分比
      fraction: boolean | number | null; // 小数位数 默认为null
    }
    export interface ResultFilter {
      display: boolean; // 是否开启
      logic: string; // 筛选逻辑
      condition: number | string | null; // 筛选条件
    }
    export interface DateFormat {
      formatType: string; // 格式话枚举
      isCustom: boolean; // 是否自定义
      customFormat: string; // 自定义格式内容
    }
    export interface ResultFilterOption {
      uid: string; // 字段uid
      options: ResultFilter; // 结果筛选器配置
    }
    export interface Theme {
      type?: string; // 类型
      colors: Array<string>; // 颜色
    }

    export interface MetricRange {
      max?: number | null; // 最大值
      min?: number | null; // 最小值
    }
    export interface Legend {
      checked: boolean;
      position: "top" | "bottom" | "left" | "right";
    }
    export interface Invert {
      show: boolean;
      mode: "next" | "all";
    }

    export interface CrossSummary {
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

    export interface OrderNumber {
      checked: boolean; // 是否勾选
      orderName?: string; // 序号别名
    }
    export interface MoreOrderNumber {
      checked: boolean; // 是否勾选
      uids: [];
      orderName?: string; // 序号别名
    }

    export interface FreezeHead {
      row?: boolean; // 行冻结
      column?: boolean; // 列冻结
      columnNumber?: number; // 列冻结数量
      rowNumber?: number; // 行冻结数量
    }

    export interface DataZoom {
      show: boolean; // 是否显示滚动条
      start: number; // 起始位置
      end: number; // 结束位置
      theme: string; // 主题配色 暗色 或者亮色
    }
    export interface Forecast {
      show: boolean;
      number: number;
    }
    export interface PageSet {
      size: number;
      rowSize: number;
    }
    export interface Column {
      key: string;
      width: number;
    }
    export interface Timer {
      time: number | null;
    }

    export interface ProgressLabel {
      displayValue: boolean;
      displayPercent: boolean;
      displayTarget: boolean;
    }
    export interface GroupSetting {
      limit: number;
      showOther: boolean;
    }

    export interface TargetValue {
      valueType: "fixed" | "dynamic"; // "fixed"：固定值，"dynamic"：计算值;
      constValue?: number | null;
      field?: FieldColumn;
      // aggregateType?: string;
    }

    export interface ConditionFormat {
      fieldUid: string; //字段uid
      formatType: "dataBar" | "colorScale" | "colorGradient"; //"数据条" | "区间色" | "渐变色";
      conditions: Array<Conditions>;
      colorType: string; //渐变色类型
      needDetail: boolean; //是否展示具体数据
    }
    export interface Conditions {
      formula: string; //条件公式: < > = >= <= ...
      value: Array<any>; //条件值
      valueType: "fixed" | "dynamic" | ""; // 固定值 | 计算值;
      color: string; //颜色
    }

    export interface ListTextAlign {
      alignment: "default" | "left" | "center" | "right";
    }

    export interface jumpLinkObject {
      jumpUrl: Array<any> | string;
      jumpOpenMethod: string;
      jumpMethod: "none" | "normal" | "custom";
      title?: string;
      options?: object;
      customValueList?: Array<any>;
    }

    export interface computeField {
      id: string;
      title: string;
      expressionToSql: string;
      type: string;
      fieldPrefix: "@@";
      aggregate: boolean;
      expression: string;
      needAlias: string;
      fields: Array<any>;
    }

    export interface webLinkCheck {
      errorMessage?: string;
      status: number;
    }
    // 和ai一样的结构
    export interface AiDialogContent{
      role: "user" | "assistant" | "system";
      content: string; 
      flag?: "fail" | "suggest";  // 对话内容状态 fail: 发送失败  suggest: AI推荐问题
      chart?: Chart;
      origin?: string; // AI返回的原始值 
      aiTitle?: string; // 返回的标题
      aiTip?: string; // 返回的提示
      suggests?: Array<string>; // AI推荐问题
      feedback?: 1 | 0 | null; // 用户反馈满意度 0：表示不满意，1：表示满意 null: 未反馈
      id?: string; // 对话标识
    }
    // 对话框相关配置
    export interface AiDialogConfig {
      userAvatar?: Avatar;
      aiAvatar?: Avatar;
    }

    // Ai对话埋点数据结构
    export interface AiLoggerContent {
      corpId?: string; // 企业id
      userId?: string; // 用户id
      traceId?: string; // traceId
      question: string; // 用户问题
      questionType: number; // 问题类型，0：表示系统生成的问题，1：表示用户输入问题1
      questionResult: number; // 问题响应成功与否，0：表示失败，1：表示成功
      satisfaction?: number | null; // 用户满意度，0：表示不满意，1：表示满意 null: 未反馈
      chart?: string; // 问题对应的图表数据结构，结构是json数组. 返回的图表数据结构
      recordTime: number; // 问题记录时间
      extra: string; // 扩展字段，目的是为了避免扩展字段时需要DDL
    }
    export interface AiLoggerContentExtra {
      sceneType: string; // 场景类型，analysis：表示统计分析
      availableChart: number; // 有无可用图表，0：表示无可用的图表， 1： 表示有可用的图表
      aigcError?: string; // 错误提示，非图表结构的数据
      answer?: any; // AI返回的答案
      scenarioCode?: any; // 场景编码
      history?: string; // 多轮对话的历史记录
      ischartTemplate?: number; // 当前对话是否返回图表模板，0：表示不是模板，1：表示是模板
      id?: any;
      apiRequestTime?: number; // AI响应时间
      promptToken?: number; // AI提示token
      completionToken?: number; // AI补全token
      totalToken?: number; // AI总token
   }
    // 头像
    export interface Avatar {
      icon?: string; 
      size?:  'large'| 'small'| 'default'| number,
      shape?: 'circle' | 'square',
      src?: string,  // 图片类头像的资源地址
      srcSet?: string, // 设置图片类头像响应式资源地址
      alt?: string, // 图像无法显示时的替代文本
      loadError?: () => void, // 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为
    }
    export interface ConvertReportCallback {
      jumpReportCallback: Function | null; //跳转报表回调
      closeCallback: Function | null; //关闭回调
      successCallback: Function | null; //迁移成功回调
    }
    export interface MigrateInfo {
      status: boolean; //是否迁移成功
      message: string; //迁移信息
    }
  }
}
