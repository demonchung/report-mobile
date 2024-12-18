import Module from "./module";


export default class ReportCardSettingModule extends Module implements H3.ReportModules.CardSetting {
  title: string = "指标图设置类型";
  maxColTitle: string = "每行最大列数";
  display: boolean = true;
  default: H3.Report.CardSetting = {
    maxColumns: 4
  };

  constructor(def?: H3.Analysis.CardSettingModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (chartStyles && chartStyles.cardSetting === undefined) {
      chartStyles.cardSetting = this.default;
    }
  }
}
