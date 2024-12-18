import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { NumberType } from "@h3/report-mobile/basics/enum/filter-type";

function getSelectFields(chart: H3.Report.Chart) {
  let selectFields: Array<any> = [];
  const tmpList: Array<string> = [
    ElementType.BAR,
    ElementType.LINE,
    ElementType.AREA,
    ElementType.STRIPE,
    ElementType.RADAR,
    ElementType.PILEBAR,
    ElementType.PILESTRIPE,
    ElementType.BIAX
  ];
  let groupDimension: Array<H3.Report.FieldColumn> = chart.data.groupDimension ? JSON.parse(JSON.stringify(chart.data.groupDimension)):[] ;
  let dimension: Array<H3.Report.FieldColumn> = chart.data.dimension ? JSON.parse(JSON.stringify(chart.data.dimension)):[];
  dimension = dimension.map((item)=> {
    item.isDimension = true;
    return item;
  })
  groupDimension = groupDimension.map((item)=> {
    item.isDimension = true;
    return item;
  });
  const metric: Array<H3.Report.FieldColumn> = chart.data.metric || [];
  let biaxMetric: Array<H3.Report.FieldColumn> = [];
  if (chart.type === ElementType.BIAX && chart.data.metricGroup.length) {
    biaxMetric = [...chart.data.metricGroup[0], ...chart.data.metricGroup[1]];
  }
  // 上述7个图表 + 2维1标，排序只显示维度字段
  if (dimension.length === 2 && tmpList.includes(chart.type)) {
    selectFields = [...dimension, ...groupDimension];
  } else {
    if ((chart.type === ElementType.TABLE || chart.type === ElementType.CROSSTABLE) && !dimension.length) {
      // 判断是否存在行维度，如果不存在，则排序数据中不显示指标字段
      selectFields = [...groupDimension];
    } else {
      selectFields = [...dimension, ...groupDimension, ...metric, ...biaxMetric];
    }
  }
  // 过滤空字段
  return selectFields;
}

export { getSelectFields };

export default {
  getSelectFields
};
