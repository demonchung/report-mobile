import Module from './module';

export default class ReportChartSwitchModule extends Module implements H3.ReportModules.ChartSwitch {
  title: string = '图表类型';
  display: boolean = true;
  
  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.chartSwitch === undefined) {
      chartData.chartSwitch = '图表类型';
    }
  }
}
