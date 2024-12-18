import Module from "./module";
import { getColorByTheme } from "@h3/report-mobile/basics/enum/map";

const defaultTheme = "blue";

export default class ReportMapThemeModule extends Module implements H3.ReportModules.MapTheme {
  title: string = "地图配色";
  display: boolean = true;
  default: H3.Report.MapTheme = {
    theme: defaultTheme
  };

  constructor(def?: H3.Analysis.MapThemeModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.mapTheme === undefined) {
      chartStyles.mapTheme = {
        theme: this.default.theme
      };
    }
  }
}
