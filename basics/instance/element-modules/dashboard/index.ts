import handleChartModules from "./charts";
import LongTextModules from "./long-text";
import ImageModules from "./image";
import TabModules from "./tab";
import FilterModules from "./filter-picker";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import WebModules from "./web";

export default (element: H3.Report.BaseElement, oldChart?: H3.Report.BaseElement) => {
  let chartModules;
  switch (element.type) {
    case ElementType.BAR:
    case ElementType.PILEBAR:
    case ElementType.PILESTRIPE:
    case ElementType.STRIPE:
    case ElementType.LINE:
    case ElementType.AREA:
    case ElementType.PIE:
    case ElementType.FUNNEL:
    case ElementType.RADAR:
    case ElementType.TABLE:
    case ElementType.CROSSTABLE:
    case ElementType.LIST:
    case ElementType.CARD:
    case ElementType.SCATTER:
    case ElementType.BIAX:
    case ElementType.MAP:
    case ElementType.PROGRESSBAR:
    case ElementType.FUNNELCOMPARE:
    case ElementType.GAUGE:
    case ElementType.PERCENTPILEBAR:
    case ElementType.PERCENTPILESTRIPE:
      chartModules = handleChartModules(element as H3.Report.Chart, oldChart as H3.Report.Chart);
      break;
    case ElementType.FILTERPICKER:
      chartModules = new FilterModules(element as H3.Report.FilterPicker);
      break;
    case ElementType.LONGTEXT:
      chartModules = new LongTextModules(element as H3.Report.LongText);
      break;
    case ElementType.IMAGE:
      chartModules = new ImageModules(element as H3.Report.Image);
      break;
      case ElementType.TAB:
        chartModules = new TabModules(element as H3.Report.Tab);
        break;
    case ElementType.WEB:
      chartModules = new WebModules(element as H3.Report.WEB);
      break;
    default:
      break;
  }
  return chartModules as H3.ReportModules.ChartModules;
};
