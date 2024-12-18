import { Vue, Component, Prop } from "vue-property-decorator";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";

@Component({
  name: "h3-chart-mixins"
})
export default class TableMixin extends Vue {
  @Prop({ default: null }) chart!: H3.Report.Chart;
  @Prop({ default: () => [] }) filters!: Array<H3.Report.FilterFieldColumn>; // 外部传入的筛选条件

  ifShowTable(chart: H3.Report.Chart) {
    return (
      [...chart.data.dimension, ...(chart.data.groupDimension as any)].filter((item: any) => item)
        .length && chart.data.metric.filter((item: any) => item.type).length
    );
  }

  /**
   * 检测图表
   */
  get checkChart() {
    if (!this.chart) {return false;}
    switch (this.chart.type) {
      case `${ElementType.CARD}`:
      case `${ElementType.PROGRESSBAR}`:
      case `${ElementType.GAUGE}`:
        return this.chart.data.metric.length;
      case `${ElementType.TABLE}`:
      case `${ElementType.CROSSTABLE}`:
        return this.ifShowTable(this.chart);
      case `${ElementType.LIST}`:
        return this.chart.data.dimension.length;
      case `${ElementType.SCATTER}`:
        return this.chart.data.dimension.length && this.chart.data.metric.length > 1;
      case `${ElementType.BIAX}`:
        return (
          this.chart.data.dimension.length && this.chart.data.metricGroup.every(i => i.length > 0)
        );
      default:
        return this.chart.data.dimension.length && this.chart.data.metric.length;
    }
  }
}
