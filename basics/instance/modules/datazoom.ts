import Module from "./module";

/**
 * 滚动条设置模块
 */
export default class ReportDataZoomModule extends Module implements H3.ReportModules.DataZoom {
  title: string = "缩略轴";
  display: boolean = true;
  colorTitle: string = "配色";

  default: H3.Report.DataZoom = {
    show: true,
    start: 0,
    end: 100,
    theme: "light"
  };

  constructor(def?: H3.Analysis.DataZoomModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.dataZoom === undefined) {
      chartStyles.dataZoom = this.default;
    }
  }
}
