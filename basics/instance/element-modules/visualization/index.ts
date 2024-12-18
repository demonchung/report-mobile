import BarChartModules from './bar';
import StripeChartModules from './stripe';
import LineChartModules from './line';
import AreaChartModules from './area';
import PieChartModules from './pie';
import FunnelChartModules from './funnel';
import RadarChartModules from './radar';
import TableModules from './table';
import CardModules from './card';
import { ElementType } from '@h3/report-mobile/basics/enum/chart-type';

export default (chart: H3.Report.Chart, modules ? : H3.Report.Global) => {
  let chartModules;
  switch (chart.type) {
    case ElementType.BAR:
      chartModules = new BarChartModules(chart, modules);
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
    case ElementType.CARD:
      chartModules = new CardModules(chart, modules);
      break;
    default:
      break;
  }
  return chartModules as H3.ReportModules.ChartModules;
};
