import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import BarChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/bar";
import PileBarChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/pile-bar";
import PileStripeModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/pile-stripe";
import StripeChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/stripe";
import LineChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/line";
import AreaChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/area";
import PieChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/pie";
import FunnelChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/funnel";
import RadarChartModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/radar";
import TableModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/table";
import ListModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/list";
import CardModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/card";
import ScatterModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/scatter";
import BiaxModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/biax";
import MapModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/map";
import ProgressModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/progress-bar";
import GaugeModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/gauge";
import FunnelCompareModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/funnel-compare";
import CrossTableModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/crosstable";
import PercentPileBarModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/percent-pile-bar";
import PercentPileStripeModules from "@h3/report-mobile/basics/instance/element-modules/dashboard/percent-pile-stripe";

/***
 * 对于所有的图表类型做统一处理
 * @param chart
 * @param oldChart
 */
export default (chart: H3.Report.Chart, oldChart?: H3.Report.Chart) => {
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
      chartModules = new BarChartModules(chart, modules);
      break;
    case ElementType.PILEBAR:
      chartModules = new PileBarChartModules(chart, modules);
      break;
    case ElementType.STRIPE:
      chartModules = new StripeChartModules(chart, modules);
      break;
    case ElementType.LINE:
      chartModules = new LineChartModules(chart, modules);
      break;
    case ElementType.AREA:
      chartModules = new AreaChartModules(chart, modules);
      break;
    case ElementType.PIE:
      chartModules = new PieChartModules(chart, modules);
      break;
    case ElementType.FUNNEL:
      chartModules = new FunnelChartModules(chart, modules);
      break;
    case ElementType.RADAR:
      chartModules = new RadarChartModules(chart, modules);
      break;
    case ElementType.TABLE:
      chartModules = new TableModules(chart, modules);
      break;
    case ElementType.CROSSTABLE:
      chartModules = new CrossTableModules(chart, modules);
      break;
    case ElementType.LIST:
      chartModules = new ListModules(chart, modules);
      break;
    case ElementType.CARD:
      chartModules = new CardModules(chart, modules);
      break;
    case ElementType.SCATTER:
      chartModules = new ScatterModules(chart, modules);
      break;
    case ElementType.PILESTRIPE:
      chartModules = new PileStripeModules(chart, modules);
      break;
    case ElementType.BIAX:
      chartModules = new BiaxModules(chart, modules);
      break;
    case ElementType.MAP:
      chartModules = new MapModules(chart, modules);
      break;
    case ElementType.PROGRESSBAR:
      chartModules = new ProgressModules(chart, modules);
      break;
    case ElementType.GAUGE:
      chartModules = new GaugeModules(chart, modules);
      break;
    case ElementType.FUNNELCOMPARE:
      chartModules = new FunnelCompareModules(chart, modules);
      break;
    case ElementType.PERCENTPILEBAR:
      chartModules = new PercentPileBarModules(chart, modules);
      break;
    case ElementType.PERCENTPILESTRIPE:
      chartModules = new PercentPileStripeModules(chart, modules);
      break;
    default:
      break;
  }
  return chartModules as H3.ReportModules.ChartModules;
};
