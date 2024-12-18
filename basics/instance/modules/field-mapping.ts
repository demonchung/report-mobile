import Module from './module';
export default class FieldMapping extends Module implements H3.ReportModules.FieldMapping{
  max: number = 1;
  min: number = 0;
  title: string;
  display: boolean = true;
  supportedTypes: string[] = ['string', 'date', 'number'];

  constructor(title?: string ) {
    super();
    this.title = title || '';
  }

  handleChartData(chart: H3.Report.Chart): void {
  }
}
