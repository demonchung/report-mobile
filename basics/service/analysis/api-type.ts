import { Apis } from "@h3/report-mobile/basics/service/apis/api-type";

export enum AnalysisApis {
  GETREPORTINFO = "getReportInfo",
  GETPERSONALINFO = "getPersonalInfo",
  GETPUBLICINFO = "getPublicInfo",
  REMOVECHART = "removeChart",
  REMOVECHARTS = "removeCharts",
  SAVECHARTS = "saveCharts",
  SAVECHART = "saveChart",
  GETDATASOURCE = "getDataSource",
  SAVEOWNERCHART = "saveOwnerChart",
  GETCHARTDATA = "getChartData",
  GETCHARTSLENGTH = "getChartsLength",
  GETMAPJSON = "getMapJson",
  ADDCHARTS = "addCharts",
  GETPUBLICCHARTSLENGTH = "getPublicChartsLength",
  AIGCTRACELOG = "aigcTraceLog",
  AICHAT = "aiChat",
}

export default AnalysisApis;
