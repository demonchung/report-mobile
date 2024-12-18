import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportTimerModule extends Module implements H3.ReportModules.Timer {
  title: string = "定时刷新 (秒)";
  display: boolean = true;
  time: null;

  default: H3.Report.Timer = {
    time: null
  };
  constructor(def?: H3.Analysis.TimerModule) {
    super();
    // 改变默认值
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.timer === undefined) {
      chartData.timer = this.default;
    }
  }
}
