import Module from "./module";

export default class ReportProgressModule extends Module implements H3.ReportModules.GroupSetting {
  display: boolean = true;
  limitTitle: string = "系列数目限制";
  otherTitle: string = "超过限制显示为'其他'";
  max = 100;
  min = 1;
  default: H3.Report.GroupSetting = {
     limit: 20,
     showOther: true,
  };

  limit = 20;
  showOther = true;

  constructor(def?: H3.Analysis.ProgressModule) {
    super();
    if (def) {
      Object.keys(def).forEach(k => {
        this[k] = def[k];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.groupSetting === undefined) {
      chartData.groupSetting = this.default;
    }
  }
}
