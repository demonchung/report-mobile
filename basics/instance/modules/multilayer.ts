import Module from "./module";

/**
 * 滚动条设置模块
 */
export default class ReportMultilayerModule extends Module implements H3.ReportModules.Multilayer {
  title: string = "图层";
  display: boolean = false;
  parentUid: string | null = null;
  default = {};
  constructor(def?: H3.Analysis.MultilayerModel) {
    super();
    if (def) {
      Object.keys(def).forEach(i => {
        this[i] = def[i];
      });
    }
  }

  handleChartData(chart: H3.Report.Chart): void {
  }
}
