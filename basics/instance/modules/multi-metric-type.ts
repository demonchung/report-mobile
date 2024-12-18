import Module from "./module";

/**
 * 多种类数据显示设置模块
 */
export default class ReportMultiMetricTypeModule extends Module
  implements H3.ReportModules.MultiMetricType {
  title: string = "多轴图标类型";
  display: boolean = true;

  default: Array<"bar" | "line" | "area" | "pileBar"> | null = ["bar", "line"];
  // 每个图标选择的数据
  data: Array<H3.ReportModules.MultiTypeData> = [
    {
      title: "$r_language.modules.MultiMetricType.icontitleL$",
      options: ["bar", "line", "area", "pileBar"]
    },
    {
      title: "$r_language.modules.MultiMetricType.icontitleR$",
      options: ["bar", "line", "area", "pileBar"]
    }
  ];

  constructor(def?: H3.Analysis.MultiMetricTypeModule) {
    super();
    // 改变默认值
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    if (chart.styles && !chart.styles.multiMetricType) {
      chart.styles.multiMetricType = this.default;
    }
  }
}
