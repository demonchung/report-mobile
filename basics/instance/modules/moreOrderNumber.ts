import Module from "./module";
import { ModuleType } from "@h3/report-mobile/basics/enum/chart-modules-type";

/**
 * 数据显示设置模块
 */
export default class ReportMoreOrderNumberModule extends Module
  implements H3.ReportModules.MoreOrderNumber {
  title: string = "显示序号";
  display: boolean = true;
  displayOrderName: boolean = false;
  checked: boolean = false;
  orderName: string = "序号";
  uids= [];
  moduleKey = ModuleType.MoreOrderNumber;
  parentNodeKey: string = "data";

  default: H3.Report.MoreOrderNumber = {
    checked: false,
    orderName: "序号",
    uids:[]
  };

  constructor(def?: H3.Analysis.MoreOrderNumberModule) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && chartData.moreOrderNumber === undefined) {
      chartData.moreOrderNumber = this.default;
    }
  }
}
