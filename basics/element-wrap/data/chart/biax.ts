import handleBarData from './bar';
import handleLineData from './line';
import handlePileBarData from './pile-bar';
import handleAreaData from './area';

/**
 * 处理双轴图的数据
 * @param options
 */
function handleBiaxData(options: H3.Chart.ChartOptions) : Array<H3.Chart.ChartData>{
  const metricTypes = options.multiMetricType;
  const metricGroup = options.metricGroup;
  const multiRange = options.multiRange;

  const chartDatas: Array<H3.Chart.ChartData> = [];
  if (metricTypes && metricTypes.length > 0 && metricGroup && metricGroup.length > 0) {
    metricTypes.forEach((type, index) => {
      let res: H3.Chart.ChartData;
      const singleOptions = Object.assign({}, options, {
        metric: metricGroup && [index] ? [...metricGroup[index]] : [],
        metricRange: multiRange ? multiRange[index] : null
      });
      switch (type) {
        case 'bar':
          res = handleBarData(singleOptions);
          break;
        case 'line':
          res = handleLineData(singleOptions);
          break;
        case 'pileBar':
          res = handlePileBarData(singleOptions);
          break;
        case 'area':
          res = handleAreaData(singleOptions);
          break;
        default:
          res = handleBarData(singleOptions);
          break;
      }
      chartDatas.push(res);
    })
  }
  return chartDatas;
}

export default handleBiaxData;
