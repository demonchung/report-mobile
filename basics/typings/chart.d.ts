declare namespace H3 {
  namespace Chart {
    interface ChartOptions {
      type: H3.Report.ElementType; // 图表类型
      uid?: string; // 图表uid
      width: number; // 图表宽度
      height?: number; // 图表高度
      data: Array<any>; // 图表数据
      dataAlias: { [key: string]: string }[]; // 数据别名
      maxDimension: number; //最大维度数
      maxDimensionColumns: number; // 最大维度显示数
      dimension: H3.Report.FieldColumn ; // 维度
      groupDimension: H3.Report.FieldColumn ; // 分组维度
      metric: Array<H3.Report.FieldColumn>; // 指标
      metricGroup?: Array<Array<H3.Report.FieldColumn>>; // 多组指标
      multiMetricType?: Array<"bar" | "line" | "area" | "pileBar">; // 多图标类型
      dimensionLimit?: number; // 维度显示
      limit: number; // 显示前多少条数据
      linkage: Array<string>; // 是否设置图表联动
      jumpLink: Array<string>; // 是否设置图表跳转
      direction: "top" | "bottom" | "left" | "right"; // 滚动条方向
      colors: Array<string>; // 颜色数组
      resizeState: boolean; // 跟新状态
      metricRange?: H3.Report.MetricRange; // 指标范围设置
      multiRange?: Array<H3.Report.MetricRange>; // 多组极限值
      dataLabel?: boolean | null; // 数据显示设置
      dataLabelPileSum?: boolean | null; // 显示堆叠合计设置
      multipleDataLabel: H3.Report.MultipleDataLabel; // 多种类数据显示设置
      legend: H3.Report.Legend; // 图例
      axisX: H3.Report.AxisX; // X轴
      axisY: H3.Report.AxisY; // Y轴
      axisyName: H3.Report.AxisyName; //Y轴标题
      isTransparent: boolean; // 是否深色背景
      dataSum?: number; // 数据绝对值总和
      warningLine?: Array<H3.Report.WarningLine>; // 警戒线
      fontColor: string | null; // 字体颜色,
      fontSetting: H3.Report.FontSetting;
      fontSize: number; // 字号
      splitLine?: boolean | null; // 网格线设置
      axisYSet?: boolean | null; // Y轴显示隐藏设置
      DataZoom: H3.Report.DataZoom; // 缩略轴
      mapDrill: H3.Report.MapDrill;
      mapArea: H3.Report.MapArea;
      mapTheme: H3.Report.MapTheme;
      mapMode: H3.Report.MapMode;
      pieMode: H3.Report.PieMode;
      gaugeMode: H3.Report.GaugeMode;
      dataLabelPosition: H3.Report.DataLabelPosition;
      mapDigitalSet: H3.Report.MapDigitalSet;
      mapSource: H3.Report.MapColumn | null;
      conversion: boolean; // 转化率
      progressLabel: H3.Report.ProgressLabel;
      themeOptions: any; // 主题样式,慢慢会扩展
      forecast: H3.Report.Forecast | null; // 预测
      sort: Array<H3.Report.FieldColumn>; // 排序
      groupSetting: H3.Report.GroupSetting; // 系列设置
      customSort: any; //自定义排序键值对
      compareData: Array<string>; //维度对比值
      invert?: H3.Report.Invert; // 对比值
      metricLabel?: boolean; // 指标名是否展示
      metricValue?: boolean; // 指标值是否展示
      mapJson?: any;
      lang: string;
      defaultFontColor: string;
      isWxwork?: boolean;
    }
    /**
     * 圆饼图表属性
     */
    interface PieChartOptions extends ChartOptions {
      percent: boolean; // 显示是否是百分百
    }
    interface ChartData {
      dimensionLength: number; // 维度长度
      dimensionArray: Array<string>; // 维度数组
      groupLength: number; // 分组长度
      groupArray: Array<string>; // 指标数组
      groupNameArray?: { [key: string]: string }; // 指标分组名称
      data: Array<any>; // 处理之后的数据集合
      maxDimension: number; // 最大维度数
      maxMetric?: number; // 最大指标
      minMetric?: number; // 最小指标
      metricRangeData?: any; // 指标范围数据
      mRangeDate?: any;
      groupArrayData?: any; // 组数据
      index?: number; // index
      total?: number; // 数值总和
      axisXMetric?: AxisMetric; // X轴指标值 散点图
      axisYMetric?: AxisMetric; // Y轴指标值 散点图
      avgMetric?: number; // 平均值
      mapJson?: Object; //地图json数据
      mapName?: string; //地图名
    }
    interface AxisMetric {
      maxMetric: number; // 最大值
      minMetric: number; // 最小值
    }
    interface ChartAxis {
      field: string; // 字段
      name: string; // 字段名称
      formatter?: Function; // 需要格式化的字段
    }
  }
}
