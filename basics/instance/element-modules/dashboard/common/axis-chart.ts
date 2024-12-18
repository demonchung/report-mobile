import Modules from "../../../modules";
import BaseChartModules from "./base";

import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import options from "@h3/report-mobile/dist/options";
import { handleInnerFilter, handleSort } from "@h3/report-mobile/basics/instance/element-modules/dashboard/utils";

export default class AxisChartModules extends BaseChartModules {
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    super(chart, modules);
    this.styles.dataZoom = new Modules.DataZoom();
    this.styles.metricRange = new Modules.MetricRange();
    this.styles.legend = new Modules.Legend();
    this.styles.axisX = new Modules.AxisX();
    this.styles.axisY = new Modules.AxisY();
    this.styles.dataLabel = new Modules.DataLabel();
    this.styles.dataLabelFontSize = new Modules.DataLabelFontSize();
    this.styles.warningLine = new Modules.WarningLine();
    this.data.forecast = new Modules.Forecast();
    this.data.groupSetting = new Modules.GroupSetting();
    // this.styles.axisyName = new Modules.AxisyName();

  }
}
