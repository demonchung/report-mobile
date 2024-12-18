import FieldMapping from './field-mapping';

/**
 * 排序实例
 */
export default class ReportSortModule extends FieldMapping implements H3.ReportModules.Sort {
  title = '排序';
  max = 0;
  moduleTypes: Array<"dimension" | "groupDimension" | "metric"> | null = ["dimension", "groupDimension" , "metric"];

  constructor(chartData?: H3.Report.ChartDataGroup) {
    super();
  }
  /**
   * 处理图表数据
   * @param chart
   */
  handleChartData(chart: H3.Report.Chart): void {
    const chartData: H3.Report.ChartDataGroup = chart.data;
    if (chartData && !chartData.sort) {
      chartData.sort = [];
    }else { 
      if(chartData.sort){
        let fieldCol: Array<H3.Report.FieldColumn> = [];
        if(chartData.dimension) {
          fieldCol = fieldCol.concat(chartData.dimension);
        }
        if(chartData.groupDimension) {
          fieldCol = fieldCol.concat(chartData.groupDimension);
        }
        if(chartData.metric) {
          fieldCol = fieldCol.concat(chartData.metric);
        }
        // 双轴图
        if (chartData.metricGroup && chartData.metricGroup.length > 0) {
          const metrics: Array<H3.Report.FieldColumn> = [];
          chartData.metricGroup.forEach(m => {
            metrics.push(...m);
          });
          fieldCol = fieldCol.concat(metrics);
        }
        chartData.sort = chartData.sort.filter((field: H3.Report.FieldColumn) => fieldCol.findIndex((item: H3.Report.FieldColumn) => item.uid === field.uid) > -1);
      } 
    }
  }
}
