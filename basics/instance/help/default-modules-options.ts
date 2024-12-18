import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { ModuleType } from "@h3/report-mobile/basics/enum/chart-modules-type";
import { anaiysisColors } from "@h3/report-mobile/basics/enum/colors";
import { Color } from "@h3/report-mobile/basics/enum/paint";
import { Model } from "vue-property-decorator";
/**
 * 每个功能模块的默认配置值
 */
export const defaultOptions: H3.Analysis.ChartModules = {
  [ModuleType.ChartSwitch]: {
    display: true,
    title: "图表类型",
    default: ElementType.BAR,
    parentNodeKey: "styles",
    disabled: []
  },
  [ModuleType.Dimension]: {
    moduleKey: ModuleType.Dimension,
    display: true,
    title: "$r_language.Analysis.design.fieldName.dimension$",
    tip: "$r_language.design.DF_tip.dim$",
    max: 2, // 最大行数
    min: 0, // 最小行数
    supportedTypes: ["string", "date", "address"], // 支持字段类型
    disabled: false, // 是否可选
    default: [],
    parentNodeKey: "data",
    canRepeat: false
  },
  [ModuleType.GroupDimension]: {
    moduleKey: ModuleType.GroupDimension,
    display: true,
    title: "$r_language.Analysis.design.fieldName.colDim$",
    tip: "$r_language.design.DF_tip.table_CD$",
    max: 20, // 最大行数
    min: 0, // 最小行数
    supportedTypes: ["string", "date", "address"], // 支持字段类型
    disabled: false, // 是否可选
    default: [],
    parentNodeKey: "data",
    canRepeat: false
  },
  [ModuleType.Metric]: {
    moduleKey: ModuleType.Metric,
    display: true,
    title: "$r_language.Analysis.design.fieldName.metric$",
    tip: "$r_language.design.DF_tip.metric$",
    max: 20, // 最大行数
    min: 0, // 最小行数
    supportedTypes: ["string", "number", "date", "address"], // 支持字段类型
    disabled: false, // 是否可选
    default: [],
    parentNodeKey: "data",
    canRepeat: true
  },
  [ModuleType.Multilayers]: {
    moduleKey: ModuleType.Multilayers,
    display: true,
    title: "图层",
    default: false,
    parentNodeKey: "data",
    parentUid: null
  },
  [ModuleType.Timer]: {
    moduleKey: ModuleType.Timer,
    display: true,
    title: "定时刷新 (秒)",
    default: {
      time: null
    },
    time: null,
    parentNodeKey: "data"
  },
  // [ModuleType.Timer]: {
  //   moduleKey: ModuleType.Timer,
  //   display: true,
  //   title: "定时刷新 (秒)",
  //   default: {
  //     time: null
  //   },
  //   time: null,
  //   parentNodeKey: "data"
  // },
  [ModuleType.MetricGroup]: {
    moduleKey: ModuleType.MetricGroup,
    display: true,
    title: "指标组合",
    tip: "指标描述",
    max: 2, // 最大指标组数量
    data: [
      {
        display: true,
        title: "$r_language.Analysis.design.fieldName.metricL$",
        max: 20, // 最大数
        min: 0, // 最小数
        supportedTypes: ["string", "number", "date", "address"],
        canRepeat: true
      },
      {
        display: true,
        title: "$r_language.Analysis.design.fieldName.metricR$",
        max: 20, // 最大数
        min: 0, // 最小数
        supportedTypes: ["string", "number", "date", "address"],
        canRepeat: true
      }
    ],
    default: [[], []],
    parentNodeKey: "data"
  },
  [ModuleType.Filter]: {
    moduleKey: ModuleType.Filter,
    display: true,
    title: "过滤条件",
    tip: "$r_language.design.DF_tip.filter$",
    max: 20, // 最大行数
    min: 0, // 最小行数
    supportedTypes: ["string", "number", "date", "address"], // 支持字段类型
    default: [],
    isSupportedAggregate: true,
    parentNodeKey: "data"
  },
  [ModuleType.Sort]: {
    moduleKey: ModuleType.Sort,
    display: true,
    title: "排序",
    tip: "排序描述",
    max: 20, // 最大行数
    min: 0, // 最小行数
    moduleTypes: ["dimension", "groupDimension", "metric"],
    supportedTypes: ["string", "number", "date", "address"], // 支持字段类型
    disabled: false, // 是否可选
    default: [],
    parentNodeKey: "data"
  },
  [ModuleType.Theme]: {
    moduleKey: ModuleType.Theme,
    display: true,
    title: "配色",
    default: anaiysisColors[0],
    parentNodeKey: "styles"
  },
  [ModuleType.Legend]: {
    moduleKey: ModuleType.Legend,
    display: true,
    title: "图例",
    checked: true,
    position: "top",
    parentNodeKey: "styles",
    default: {
      checked: true,
      position: "top"
    }
  },
  [ModuleType.PageSet]: {
    moduleKey: ModuleType.PageSet,
    display: true,
    title: "页码设置",
    size: 10,
    rowSize: 10,
    parentNodeKey: "data",
    default: {
      size: 10,
      rowSize: 10
    }
  },
  [ModuleType.Limit]: {
    moduleKey: ModuleType.Limit,
    display: true,
    title: "数据保留",
    default: null,
    parentNodeKey: "data"
  },
  [ModuleType.Conversion]: {
    moduleKey: ModuleType.Conversion,
    display: true,
    title: "转化率",
    default: false,
    parentNodeKey: "data"
  },
  [ModuleType.SwitchLayers]: {
    moduleKey: ModuleType.SwitchLayers,
    display: true,
    title: "切换图层",
    default: false,
    parentNodeKey: "data"
  },
  [ModuleType.Invert]: {
    moduleKey: ModuleType.Invert,
    display: true,
    title: "转化率",
    show: true,
    mode: "next",
    default: {
      show: false,
      mode: "next" // 'next' | 'all'
    },
    parentNodeKey: "data"
  },
  [ModuleType.CrossSummary]: {
    moduleKey: ModuleType.CrossSummary,
    display: true,
    title: "汇总分类",
    columnSummaries: [],
    columnSummary: true,
    columnSummaryPosition: 0,
    rowSummary: true, // 行汇总是否展示，true或者没有表示要展示，false表示不展示
    rowSummaryPosition: 0, // 行汇总位置，0或者没有表示下边，1表示上边
    rowSummaries: [],
    default: {
      columnSummaries: [],
      rowSummaries: [],
      columnSummary: true,
      columnSummaryPosition: 0,
      rowSummary: true, // 行汇总是否展示，true或者没有表示要展示，false表示不展示
      rowSummaryPosition: 0 // 行汇总位置，0或者没有表示下边，1表示上边
    },
    parentNodeKey: "data"
  },
  [ModuleType.Forecast]: {
    moduleKey: ModuleType.Forecast,
    display: true,
    title: "预测",
    numberTitle: "预测期数",
    default: {
      show: false,
      number: 2
    },
    parentNodeKey: "data"
  },
  [ModuleType.DimensionLimit]: {
    moduleKey: ModuleType.DimensionLimit,
    display: true,
    title: "数据保留",
    default: null,
    parentNodeKey: "styles"
  },
  [ModuleType.DataLabel]: {
    moduleKey: ModuleType.DataLabel,
    display: true,
    title: "$r_language.Analysis.mudules.DataLabel.title$",
    default: true,
    parentNodeKey: "styles"
  },
  [ModuleType.DataLabelPileSum]: {
    moduleKey: ModuleType.DataLabelPileSum,
    display: true,
    title: "$r_language.Analysis.mudules.DataLabelPileSum.title$",
    default: false,
    parentNodeKey: "styles"
  },
  [ModuleType.DataLabelFontSize]: {
    moduleKey: ModuleType.DataLabelFontSize,
    display: true,
    title: "$r_language.Analysis.mudules.DataLabelFontSize.title$",
    sizeList: [6,8,10,12,14,16,18,20,22,24],
    default: { 
      size: 12
    },
    parentNodeKey: "styles"
  },
  [ModuleType.MetricLabel]: {
    moduleKey: ModuleType.MetricLabel,
    display: true,
    title: "$r_language.Analysis.mudules.MetricLabel.title_label$",
    default: true,
    parentNodeKey: "styles"
  },
  [ModuleType.MetricValue]: {
    moduleKey: ModuleType.MetricValue,
    display: true,
    title: "$r_language.Analysis.mudules.MetricLabel.title_value$",
    default: true,
    parentNodeKey: "styles"
  },
  [ModuleType.CompareData]: {
    moduleKey: ModuleType.CompareData,
    display: true,
    title: "对比值",
    default: [],
    parentNodeKey: "data"
  },
  [ModuleType.TextAlign]: {
    moduleKey: ModuleType.TextAlign,
    display: true,
    title: "文字位置",
    default: "left",
    parentNodeKey: "styles"
  },
  [ModuleType.AdaptiveSize]: {
    moduleKey: ModuleType.AdaptiveSize,
    display: true,
    title: " 字体比例大小",
    default: "default",
    parentNodeKey: "styles"
  },
  [ModuleType.CardSetting]: {
    moduleKey: ModuleType.CardSetting,
    display: true,
    title: "指标图设置",
    maxColTitle: "每行最多列数",
    default: {
      maxColumns: 4
    },
    parentNodeKey: "styles"
  },
  [ModuleType.FilterNone]: {
    moduleKey: ModuleType.FilterNone,
    display: true,
    title: " 过滤",
    default: true,
    parentNodeKey: "data"
  },
  [ModuleType.SortPercent]: {
    moduleKey: ModuleType.SortPercent,
    display: true,
    title: "进度值排序",
    default: 0,
    parentNodeKey: "data"
  },
  [ModuleType.AxisX]: {
    moduleKey: ModuleType.AxisX,
    display: true,
    title: "X轴",
    axisXTitle: "坐标轴",
    directionTitle: "文字方向",
    parentNodeKey: "styles",
    default: {
      displayAxisX: true, // 显示坐标轴
      displayLabel: true, // 显示标签
      direction: "crosswise" // 方向
    }
  },
  [ModuleType.AxisY]: {
    moduleKey: ModuleType.AxisY,
    display: true,
    title: "Y轴",
    labelTitle: "刻度",
    default: {
      displayLabel: true, // 显示标签
      displayName: false,
      leftYName: null,
      rightYName: null
    },
    parentNodeKey: "styles"
  },
  [ModuleType.MetricRange]: {
    moduleKey: ModuleType.MetricRange,
    display: true,
    title: "y轴最大值最小值",
    maxTitle: "最大值",
    minTitle: "最小值",
    parentNodeKey: "styles",
    default: {
      max: null, // 最大值
      min: null // 最小值
    }
  },
  [ModuleType.OrderNumber]: {
    moduleKey: ModuleType.OrderNumber,
    display: true,
    title: "序号",
    displayOrderName: false,
    checked: true,
    parentNodeKey: "styles",
    default: {
      checked: true, // 是否勾选
      orderName: "序号" // 序号别名
    }
  },
  [ModuleType.AxisyName]: {
    moduleKey: ModuleType.AxisyName,
    parentNodeKey: "styles",
    default: {
      displayName: true, // 显示标题
      defaultName: '', //左轴标题
      rightYName: '', // 右轴标题
    }
  },
  [ModuleType.FreezeHead]: {
    moduleKey: ModuleType.FreezeHead,
    display: true,
    title: "冻结相关",
    rowTitle: "冻结行维度",
    columnTitle: "$r_language.modules.FreezeHead.columnTitle$",
    columnNumberTitle: "冻结列数",
    rowNumberTitle: "冻结行维度数",
    displayRow: true,
    displayColumn: true,
    displayColumnNumber: false,
    displayRowNumber: false,
    parentNodeKey: "styles",
    default: {
      row: true, // 行冻结
      column: true, // 列冻结
      columnNumber: 0, // 列冻结数量
      rowNumber: 0 // 列冻结数量
    }
  },
  [ModuleType.MultipleDataLabel]: {
    moduleKey: ModuleType.MultipleDataLabel,
    display: true,
    title: "多种数值格式设置",
    dimensionLabelTitle: "$r_language.modules.MultipleDataLabel.dimTitle$",
    metricLabelTitle: "$r_language.modules.MultipleDataLabel.metTitle$",
    percentLabelTitle: "$r_language.modules.MultipleDataLabel.perTitle$",
    parentNodeKey: "styles",
    default: {
      dimensionLabel: true,
      metricLabel: true,
      percentLabel: true
    }
  },
  [ModuleType.SplitLine]: {
    moduleKey: ModuleType.SplitLine,
    display: true,
    title: "$r_language.Analysis.mudules.dataLabel.title_SplitLine$",
    default: true,
    parentNodeKey: "styles"
  },
  [ModuleType.AxisYSet]: {
    moduleKey: ModuleType.AxisYSet,
    display: true,
    title: "$r_language.Analysis.mudules.dataLabel.title_AxisYSet$",
    default: true,
    parentNodeKey: "styles"
  },
  [ModuleType.MultiMetricType]: {
    moduleKey: ModuleType.MultiMetricType,
    display: true,
    title: "多种数据类型",
    default: ["bar", "line"],
    parentNodeKey: "styles",
    data: [
      {
        title: "$r_language.Analysis.mudules.merticType.icontitleL$",
        options: ["bar", "line", "area", "pileBar"]
      },
      {
        title: "$r_language.Analysis.mudules.merticType.icontitleR$",
        options: ["bar", "line", "area", "pileBar"]
      }
    ]
  },
  [ModuleType.DataZoom]: {
    moduleKey: ModuleType.DataZoom,
    display: false,
    title: "缩略轴",
    colorTitle: "配色",
    default: {
      show: true,
      start: 0,
      end: 100,
      theme: "light"
    },
    parentNodeKey: "styles"
  },
  [ModuleType.MapTheme]: {
    moduleKey: ModuleType.MapTheme,
    display: true,
    title: "地图配色",
    default: {
      theme: "blue"
    },
    parentNodeKey: "styles"
  },

  [ModuleType.MapArea]: {
    moduleKey: ModuleType.MapTheme,
    display: true,
    title: "显示范围",
    default: {
      area: "all"
    },
    parentNodeKey: "data"
  },

  [ModuleType.MapMode]: {
    moduleKey: ModuleType.MapMode,
    display: true,
    title: "地图类型",
    default: {
      mode: "area"
    },
    parentNodeKey: "styles"
  },
  [ModuleType.BarMode]: {
    moduleKey: ModuleType.BarMode,
    display: true,
    title: "图表类型",
    default: {
      mode: "bar"
    },
    parentNodeKey: "styles"
  },
  [ModuleType.PieMode]: {
    moduleKey: ModuleType.PieMode,
    display: true,
    title: "饼图类型",
    selectList: ["ring", "solid"],
    default: {
      mode: "ring"
    },
    parentNodeKey: "styles"
  },
  [ModuleType.GaugeMode]: {
    moduleKey: ModuleType.GaugeMode,
    display: true,
    title: "仪表图类型",
    selectList: ["in", "out"],
    default: {
      mode: "in"
    },
    parentNodeKey: "styles"
  },
  [ModuleType.CardMode]: {
    moduleKey: ModuleType.CardMode,
    display: true,
    title: "指标图类型",
    selectList: ["card", "list"],
    default: {
      mode: "list"
    },
    parentNodeKey: "styles"
  },
  [ModuleType.DataLabelPosition]: {
    moduleKey: ModuleType.DataLabelPosition,
    display: true,
    title: "标签位置",
    default: {
      position: "pie",
      detail: "out"
    },
    parentNodeKey: "styles"
  },

  [ModuleType.MapDrill]: {
    moduleKey: ModuleType.MapDrill,
    display: true,
    title: "地图钻取",
    default: {
      drill: "city"
    },
    parentNodeKey: "styles"
  },

  [ModuleType.MapDigitalSet]: {
    moduleKey: ModuleType.MapDigitalSet,
    display: true,
    title: "数值标签显示设置",
    dimensionTitle: "显示维度值",
    metricTitle: "显示指标值",
    default: {
      displayDimension: true,
      displayMetric: false
    },
    parentNodeKey: "styles"
  },
  [ModuleType.WarningLine]: {
    moduleKey: ModuleType.WarningLine,
    display: true,
    title: "警戒线",
    default: [],
    parentNodeKey: "styles"
  },
  // 整体背景颜色
  [ModuleType.PaintCoat]: {
    moduleKey: ModuleType.PaintCoat,
    display: true,
    title: "整体背景颜色",
    default: {
      type: "bgColor", // 'bgColor', 'bgPicture'
      value: "#ffffff" // '#ffffff', 'A/B/C.PNG'
    },
    parentNodeKey: "styles"
  },
  // 图表配色
  [ModuleType.ElementCoat]: {
    moduleKey: ModuleType.ElementCoat,
    display: true,
    title: "组件背景颜色",
    default: {
      type: "bgColor", // 'bgColor', 'bgPicture'
      value: "#ffffff" // '#ffffff', 'A/B/C.PNG'
    },
    parentNodeKey: "styles"
  },
  // 列表对齐方式
  [ModuleType.ListTextAlign]: {
    moduleKey: ModuleType.ListTextAlign,
    display: true,
    title: "对齐方式",
    default: {
      alignment: "default"
    },
    parentNodeKey: "styles"
  },
  // 字体颜色
  [ModuleType.FontSetting]: {
    moduleKey: ModuleType.FontSetting,
    display: true,
    title: "文字",
    headTitle: "标题文字颜色",
    contentTitle: "普通文字颜色",
    fontSizeTitle: "字体大小",
    displayFontSize: false,
    default: {
      titleColor: Color.DARKTITLECOLOR, // 标题颜色
      fontColor: null, // 字体颜色
      fontSize: 12
    },
    parentNodeKey: "styles"
  },
  
  // 导出
  [ModuleType.Download]: {
    moduleKey: ModuleType.Download,
    display: true,
    title: "允许导出",
    default: false,
    parentNodeKey: "styles"
  },
  // 图表联动
  [ModuleType.Linkage]: {
    moduleKey: ModuleType.Linkage,
    display: true,
    title: "图表联动",
    default: [],
    parentNodeKey: "styles"
  },
  // 图表联动
  [ModuleType.JumpLink]: {
    moduleKey: ModuleType.JumpLink,
    display: true,
    title: "图表跳转",
    default: [],
    parentNodeKey: "styles"
  },
  // 双轴图范围
  [ModuleType.MultiRange]: {
    moduleKey: ModuleType.MultiRange,
    display: true,
    data: [
      {
        title: "坐标Y轴（左）"
      },
      {
        title: "坐标Y轴（右）"
      }
    ],
    default: [
      {
        max: null,
        min: null
      },
      {
        max: null,
        min: null
      }
    ],
    parentNodeKey: "styles"
  },
  // 进度图
  [ModuleType.ProgressLabel]: {
    moduleKey: ModuleType.ProgressLabel,
    display: true,
    default: {
      displayValue: true,
      displayPercent: true,
      displayTarget: true
    },
    displayValue: true,
    displayPercent: true,
    displayTarget: true,
    valueTitle: "显示数值",
    percentTitle: "显示占比",
    targetTitle: "显示目标",
    parentNodeKey: "styles"
  },
  [ModuleType.GroupSetting]: {
    moduleKey: ModuleType.GroupSetting,
    display: true,
    default: {
      limit: 20,
      showOther: true
    },
    max: 50,
    min: 1,
    limit: 20,
    showOther: true,
    limitTitle: "系列数目限制",
    otherTitle: "超过限制显示为'其他'",
    parentNodeKey: "data"
  }
};
