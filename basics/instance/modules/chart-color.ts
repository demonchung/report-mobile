import Module from './module';
import colorData from '@src/pc/dashboard/modules/theme/colors';

export default class ReportChartSwitchModule extends Module implements H3.ReportModules.ChartSwitch {
  title: string = '图表配色';
  display: boolean = true;
  handleChartData(chart: H3.Report.Chart): void { 
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (!chartStyles.chartColor) {
      // 默认主题1 - theme1
      // Todo 将src中的枚举提到base
      chartStyles.chartColor = colorData[0].type;
    }
  }
}
