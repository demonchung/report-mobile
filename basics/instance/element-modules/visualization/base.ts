import Modules from '../../modules';
import Module from '../../modules/module';

export default class BaseChartModules implements H3.ReportModules.ChartModules {
  data: H3.ReportModules.ChartDataModules = {};
  styles: H3.ReportModules.ChartStylesModules = {};
  inventedChartData: H3.Report.ChartDataGroup = {} as any;
  /**
   * 构建函数
   * @param chart
   * @param modules
   */
  constructor(chart: H3.Report.Chart, modules?: H3.Report.Global) {
   
    const dataModules = ['chartTitle', 'dimension', 'metric', 'sort', 'limit'];
    const stylesModules = ['theme'];
    this.initModules(chart, 'data', dataModules);
    this.initModules(chart, 'styles', stylesModules);
  }

  initModules(chart: H3.Report.Chart, type: string, moduleKeys: string[]) {
    moduleKeys.forEach((moduleKey: string) => {
      // @ts-ignore
      this[type][moduleKey] = new Modules[moduleKey.replace(moduleKey[0], moduleKey[0].toLocaleUpperCase())]();
    });
  }

  /**
   * 处理模块初始化之后数据
   * @param chart
   * @param modules
   */
  handleModules(chart: H3.Report.Chart, modules?: H3.Report.Global) {
    const dataKeys = Object.keys(this.data);
    const styleKeys = Object.keys(this.styles);
    Object.keys(chart.data).forEach((key: string)=> {
      if(!dataKeys.includes(key)) {
        delete chart.data[key];
      }
    });
    Object.keys(chart.styles).forEach((key: string)=> {
      if(!styleKeys.includes(key)) {
        delete chart.styles[key];
      }
    });
    [...Object.values(this.data), ...Object.values(this.styles)].forEach((module: Module) => {
      module.handleChartData(chart);
    });
    
    if(modules) {
      Object.keys(modules).forEach((moduleType: string) => {
        Object.keys(modules[moduleType]).forEach((module: string) => {
          chart[moduleType][module] = modules[moduleType][module];
        });
      });
    }
    this.inventedChartData = JSON.parse(JSON.stringify(chart.data));
  }
}
