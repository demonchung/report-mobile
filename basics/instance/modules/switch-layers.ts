import Module from "./module";

/**
 * 数据限制|数据保留模块
 */
export default class ReportSwitchLayersModule extends Module implements H3.ReportModules.SwitchLayers {
  title: string = "图层切换";
  display: boolean = true;
  default: boolean = false;

  constructor(def?: H3.Analysis.SwitchLayersModule) {
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
      const SwitchLayers: string | undefined = Object.keys(chartData).find(
        (key: string) => key === "switchLayers"
      );
      if (!SwitchLayers) {
        chartData.switchLayers = false;
      }
    }
  }
}
