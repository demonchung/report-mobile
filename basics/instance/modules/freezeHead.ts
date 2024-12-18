import Module from "./module";

/**
 * 数据显示设置模块
 */
export default class ReportFreezeHeadModule extends Module implements H3.ReportModules.FreezeHead {
  title: string = "表格冻结设置";
  display: boolean = true;

  displayRow: boolean = false;
  displayColumn: boolean = false;
  displayColumnNumber: boolean = false;
  displayRowNumber: boolean = false;
  row: boolean = false;
  column: boolean = true;
  columnNumber: number = 0;
  rowNumber: number = 0;

  default: H3.Report.FreezeHead = {
    row: this.row,
    column: this.column,
    columnNumber: this.columnNumber,
    rowNumber: this.rowNumber
  };

  constructor(def?: H3.Analysis.FreezeHeadModule) {
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
    if (chartStyles && chartStyles.freezeHead === undefined) {
      chartStyles.freezeHead = this.default;
    }
  }
}
