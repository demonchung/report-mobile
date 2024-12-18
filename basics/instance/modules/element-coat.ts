import Module from './module';
import { recursion, compare } from '../../utils/object-key-compare';


/**
 * 数据显示设置模块
 */
export default class ReportElementCoatModule extends Module implements H3.ReportModules.ElementCoat {
  title: string = '组件背景';
  display: boolean = true;
   default: H3.Report.ElementCoat = {
    type: null,
    value: ''
  };
  constructor(def?: H3.Analysis.ElementCoatModule) {
    super();
    // 改变默认值
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.ChartStyleGroup = chart.styles;
    if (!chartStyles.elementCoat) {
      chartStyles.elementCoat = Object.assign({}, this.default);
    } else {
      // 对比 - 对象中的key并赋值初始值
      recursion(this.default, compare, [], this.default, chartStyles.elementCoat);
    }
  }
}
