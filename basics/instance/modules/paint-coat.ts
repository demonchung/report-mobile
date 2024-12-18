import Module from './module';
import { recursion, compare } from '../../utils/object-key-compare';


/**
 * 数据显示设置模块
 */
export default class ReportPaintCoatModule extends Module implements H3.ReportModules.PaintCoat {
  display: boolean = true;
  title: string = '';

  default: H3.Report.PaintCoat = {
    type: 'bgColor',
    value: "#F1F2F5"
  };

  constructor(def?: H3.Analysis.PaintCoatModule) {
    // 改变默认值
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }
  handleChartData(chart: H3.Report.Chart): void {
    const chartStyles: H3.Report.GlobalCoatGroup = chart.styles;
    if (!chartStyles.paintCoat) {
      chartStyles.paintCoat = Object.assign({}, this.default);
    } else {
      // 对比 - 对象中的key并赋值初始值
      recursion(this.default, compare, [], this.default, chartStyles.paintCoat);
    }
  }
}
