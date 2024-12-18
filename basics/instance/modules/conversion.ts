import Module from "./module";

/**
 * 数据限制|数据保留模块
 */
export default class ReportConversionModule extends Module implements H3.ReportModules.Conversion {
  title: string = "转化率";
  display: boolean = true;
  default: boolean = false;

  constructor(def?: H3.Analysis.ConversionModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }


  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData) {
      const Conversion: string | undefined = Object.keys(chartData).find(
        (key: string) => key === "conversion"
      );
      if (!Conversion) {
        chartData.conversion = false;
      }
    }
  }
}
