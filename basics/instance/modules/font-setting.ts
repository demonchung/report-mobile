import Module from './module';
import { recursion, compare } from '../../utils/object-key-compare';
import {Color} from "@h3/report-mobile/basics/enum/paint";


/**
 * 数据显示设置模块
 */
export default class ReportFontSettingModule extends Module implements H3.ReportModules.FontSetting {
  title: string = '字体设置';
  display: boolean = true;
   default: H3.Report.FontSetting = {
    titleColor: null,
    fontColor: null,
  };
  constructor(def?: H3.Analysis.FontSettingModule) {
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
    if (!chartStyles.fontSetting) {
      chartStyles.fontSetting = Object.assign({}, this.default);
    } else {
      // 对比 - 对象中的key并赋值初始值
      recursion(this.default, compare, [], this.default, chartStyles.fontSetting);
    }
  }
}
