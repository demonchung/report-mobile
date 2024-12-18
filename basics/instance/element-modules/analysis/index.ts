import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";

import BarChartModules from "@h3/report-mobile/basics/instance/element-modules/analysis/bar";
import LineChartModules from "@h3/report-mobile/basics/instance/element-modules/analysis/line";
import PileBarChartModules from "@h3/report-mobile/basics/instance/element-modules/analysis/pile-bar";
import StripeChartModules from "@h3/report-mobile/basics/instance/element-modules/analysis/stripe";
import AreaChartModules from "@h3/report-mobile/basics/instance/element-modules/analysis/area";
import PieChartModules from "@h3/report-mobile/basics/instance/element-modules/analysis/pie";
import FunnelChartModules from "@h3/report-mobile/basics/instance/element-modules/analysis/funnel";
import RadarChartModules from "@h3/report-mobile/basics/instance/element-modules/analysis/radar";
import TableModules from "@h3/report-mobile/basics/instance/element-modules/analysis/table";
import CardModules from "@h3/report-mobile/basics/instance/element-modules/analysis/card";
import ScatterModules from "@h3/report-mobile/basics/instance/element-modules/analysis/scatter";
import BiaxModules from "@h3/report-mobile/basics/instance/element-modules/analysis/biax";
import MapModules from "@h3/report-mobile/basics/instance/element-modules/analysis/map";
import GaugeModules from "@h3/report-mobile/basics/instance/element-modules/analysis/gauge";
import ProgressBarModules from "@h3/report-mobile/basics/instance/element-modules/analysis/progress-bar";
import CrosstableModules from "@h3/report-mobile/basics/instance/element-modules/analysis/crosstable";
import FunnelCompareModules from "@h3/report-mobile/basics/instance/element-modules/analysis/funnel-compare";

/***
 * ChartModules 对于所有的图表类型做统一处理
 * @param chart
 * @param oldChart
 */
export default (
  chart: H3.Report.Chart,
  oldChart?: H3.Report.Chart,
  defaultOptions?: H3.Analysis.ChartModules
) => {
  let chartModules;
  let modules: H3.Report.Global | undefined;
  if (oldChart) {
    modules = {
      data: oldChart.data,
      styles: oldChart.styles as H3.Report.GlobalCoatGroup
    };
  }
  switch (chart.type) {
    case ElementType.BAR:
      chartModules = new BarChartModules(chart, modules, defaultOptions);
      break;
    case ElementType.PILEBAR:
      chartModules = new PileBarChartModules(chart, modules, defaultOptions);
      break;
    case ElementType.STRIPE:
      chartModules = new StripeChartModules(chart, modules, defaultOptions);
      break;
    case ElementType.LINE:
      chartModules = new LineChartModules(chart, modules, defaultOptions);
      break;
    case ElementType.AREA:
      chartModules = new AreaChartModules(chart, modules, defaultOptions);
      break;
    case ElementType.PIE:
      chartModules = new PieChartModules(chart, modules, defaultOptions);
      break;
    case ElementType.FUNNEL:
      chartModules = new FunnelChartModules(chart, modules, defaultOptions);
      break;
    case ElementType.RADAR:
      chartModules = new RadarChartModules(chart, modules, defaultOptions);
      break;
    case ElementType.TABLE:
      chartModules = new TableModules(chart, modules, defaultOptions);
      break;
    case ElementType.CARD:
      chartModules = new CardModules(chart, modules, defaultOptions);
      break;
    case ElementType.SCATTER:
      chartModules = new ScatterModules(chart, modules, defaultOptions);
      break;
    case ElementType.BIAX:
      chartModules = new BiaxModules(chart, modules, defaultOptions);
      break;
    case ElementType.MAP:
      chartModules = new MapModules(chart, modules, defaultOptions);
      break;
    case ElementType.GAUGE:
      chartModules = new GaugeModules(chart, modules, defaultOptions);
      break;
    case ElementType.PROGRESSBAR:
        chartModules = new ProgressBarModules(chart, modules, defaultOptions);
      break;
      case ElementType.CROSSTABLE:
        chartModules = new CrosstableModules(chart, modules, defaultOptions);
      break;
      case ElementType.FUNNELCOMPARE:
        chartModules = new FunnelCompareModules(chart, modules, defaultOptions);
      break;
    default:
      break;
  }
  return chartModules as H3.ReportModules.ChartModules;
};
