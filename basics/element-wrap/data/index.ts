import charts from './chart';
import tables from './table';
import chartDataOptions from './options';


/**
 * 处理所有图表数据
 * @param options
 */
function handleData(options): H3.Chart.ChartData | Array<H3.Chart.ChartData> {
  options.data = JSON.parse(JSON.stringify(options.data));
  let chartData: H3.Chart.ChartData | Array<H3.Chart.ChartData>;
  chartDataOptions.maxDimension = options.maxDimension || 10;
  chartDataOptions.maxDimensionColumns = options.maxDimensionColumns || 50;
  chartData = Object.assign({},charts, tables)[options.type](options);
  return chartData;
}

export {
  handleData,
}

export default {
  handleData
}
