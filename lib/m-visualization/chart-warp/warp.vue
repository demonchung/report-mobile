<template>
  <div :class="prefixCls">
    <loading v-if="loading"></loading>
    <template v-else>
      <div
        v-if="!isRefreshChart || (isRefreshChart && !isData.length)"
        :class="[`${prefixCls}__placeholder`]"
      >
        <img :src="require(`@h3/report-mobile/basics/assets/${chart.type}.png`)"/>
        <div v-if="isNoFindField === 404" :class="[`${prefixCls}__placeholder--label`]">
          您当前字段缺失，请重新设置后查看
        </div>
        <div v-else-if="isNoFindField === 500" :class="[`${prefixCls}__placeholder--label`]">
          数据量过大，请重新设置
        </div>
        <div v-else-if="isNoFindField === 600" :class="[`${prefixCls}__placeholder--label`]">
          汇总计算后超出最大数据条数限制（10000条），请重新设置
        </div>
        <div
          v-else-if="isRefreshChart && !isData.length"
          :class="[`${prefixCls}__placeholder--label`]"
        >
          您当前没有数据，请添加数据后查看
        </div>
      </div>
      <template v-else>
        <h3-card
          v-if="chart.type === 'card'"
          :refresh="refresh"
          :class="[`${prefixCls}__body`]"
          :options="cardInstance"
        >
        </h3-card>
        <Chart
          ref="chart"
          :refresh="refresh"
          :style="getStyle"
          v-else-if="chart.type !== 'table'"
          :class="[`${prefixCls}__body`]"
          :options="chartInstance"
          :showDataZoom="false"
        ></Chart>
        <h3-pivot-table
          v-else
          :refresh="refresh"
          :class="[`${prefixCls}__body`]"
          :realData="tableInstance.data"
          :alias="tableInstance.alias"
          :height="height"
          :columns="tableInstance.columns"
          :rows="tableInstance.rows"
          :metric="tableInstance.metric"
          :allowDrag="false"
        ></h3-pivot-table>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import Loading from "@h3/report-mobile/basics/components/loading";
import Chart from "@h3/report-mobile/basics/element-wrap/chart/render-echart";
import H3Card from "@h3/report-mobile/basics/element-wrap/chart/card";
import H3Table from "@h3/report-mobile/basics/components/table";
import { ReportAction } from "@h3/report-mobile/basics/store/visualization/types";
import H3PivotTable from "@h3/report-mobile/basics/element-wrap/chart/pivot-table";
import { chartTheme } from "@h3/report-mobile/basics/enum/paint";
const Visualization = namespace("visualization");
@Component({
  name: "h3-report-easy-chart-wrap",
  components: {
    Chart,
    H3Table,
    H3Card,
    Loading,
    H3PivotTable
  }
})
export default class ReportEasyChartWrap extends Vue {
  @Prop() chart!: H3.Report.Chart;
  @Prop() global!: H3.Report.Global;
  @Prop({ default: false }) mode!: boolean;
  @Prop({ default: false }) refresh!: boolean;
  @Prop({ default: false }) computedStyle!: any;
  @Prop({ default: 0 }) height!: number;
  @Prop({ default: 200 }) delay!: number;
  @Visualization.State("chartViewStatus") chartViewStatus!: any;
  @Visualization.State("globalFilters") globalFilters!: Array<H3.Report.FilterFieldColumn>;
  @Visualization.Action(ReportAction.GETCHARTDATA) getChartData!: Function;
  @Visualization.Action(ReportAction.LOADCHARTDATA) loadChartData!: Function;
  prefixCls = "h3-easy-report-chart";
  data: any = [];
  dataAlias = {};
  updateTimer = 0;
  loading = false;
  isNoFindField: number | boolean = false;

  get getStyle() {
    let style = "";
    if (this.computedStyle) {
      if (this.computedStyle.height) {
        style += `height:${this.computedStyle.height}px;`;
      }
      if (this.computedStyle.width) {
        style += `width:${this.computedStyle.width}px;`;
      }
    }
    return style;
  }

  get title() {
    return this.chart.title;
  }

  get isData() {
    let data: any = [];
    if (this.chart.type === "table") {
      if (this.data.Data || this.data.Summary) {
        data = this.data.Data || [this.data.Summary];
      }
    } else {
      data = this.data as any;
    }
    return data;
  }
  get isRefreshChart() {
    switch (this.chart.type) {
      case "card":
        return this.chart.data.metric.length;
      default:
        return (
          [...this.chart.data.dimension, ...(this.chart.data.groupDimension || [])].filter(
            (item: any) => item.type
          ).length && this.chart.data.metric.filter((item: any) => item.type).length
        );
    }
  }
  /**
   * 获取图表实例
   */
  get chartInstance() {
    const colors = this.global.styles.theme ? this.global.styles.theme.colors : [];
    let dimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.dimension) {
      dimension = this.chart.data.dimension.filter((item: H3.Report.FieldColumn) => item.type);
    }
    let metric: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.metric) {
      metric = this.chart.data.metric.filter((item: H3.Report.FieldColumn) => item.type);
    }
    return {
      type: this.chart.type,
      data: this.data,
      dataAlias: this.dataAlias,
      dimension: dimension ? dimension[0] : null,
      groupDimension: dimension ? dimension[1] : null,
      dimensionLimit: this.chart.styles.dimensionLimit,
      metric,
      colors:
        this.chart.styles.theme && this.chart.styles.theme.colors.length
          ? this.chart.styles.theme.colors
          : colors,
      direction: this.chart.styles.direction ? this.chart.styles.direction : null,
      metricRange: this.chart.styles.metricRange,
      dataLabel: this.chart.styles.dataLabel,
      themeOptions: chartTheme.light,
      legend: this.chart.styles.legend || {
        //临时加入默认legend
        checked: true,
        position: "bottom"
      }
    };
  }

  /**
   * 获取图表实例
   */
  get cardInstance() {
    return {
      data: this.data,
      dataAlias: this.dataAlias,
      dimension: this.chart.data.dimension ? this.chart.data.dimension[0] : null,
      metric: this.chart.data.metric ? this.chart.data.metric[0] : null,
      limit: this.chart.data.limit,
      fontSize: 56
    };
  }

  /**
   * 获取表格实例
   */
  get tableInstance() {
    let dimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.dimension) {
      dimension = this.chart.data.dimension.filter((item: H3.Report.FieldColumn) => item.type);
    }
    let groupDimension: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.groupDimension) {
      groupDimension = this.chart.data.groupDimension.filter(
        (item: H3.Report.FieldColumn) => item.type
      );
    }
    let metric: Array<H3.Report.FieldColumn> = [];
    if (this.chart.data.metric) {
      metric = this.chart.data.metric.filter((item: H3.Report.FieldColumn) => item.type);
    }
    return {
      data: {
        data: this.data.Data,
        rows: this.data.Rows,
        columns: this.data.Columns,
        summary: this.data.Summary
      },
      alias: this.dataAlias,
      columns: dimension,
      rows: groupDimension,
      metric
    };
  }

  @Watch("globalFilters")
  async watchFilter() {
    await this.refreshChartData();
  }

  @Watch("chart.data.dimension")
  async watchDimension() {
    await this.updateChartData();
  }

  @Watch("chart.data.metric")
  async watchMetric() {
    await this.updateChartData();
  }

  @Watch("chart.data.groupDimension")
  async watchGroupDimension() {
    await this.updateChartData();
  }

  @Watch("chart.data.sort")
  async watchGroupSort() {
    await this.updateChartData();
  }

  @Watch("chart.data.limit")
  async watchLimit() {
    await this.updateChartData();
  }
  @Watch("chart.styles.dataLabel")
  async watchDataLabel() {
    await this.refreshChart();
  }

  @Watch("chart.styles.dimensionLimit")
  async watchDimensionLimit() {
    await this.refreshChart();
  }

  @Watch("chart.styles.metricRange")
  async watchMetricRange() {
    await this.refreshChart();
  }

  /**
   * 刷新图表
   */
  refreshChart() {
    const chart: any = this.$refs.chart as Vue;
    if (chart) {
      chart.delayInitChart();
    }
  }
  /**
   * 刷新图表数据
   */
  async refreshChartData() {
    if (!this.isRefreshChart) {return;}
    this.loading = true;
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(async () => {
      await this.handleChartData("load");
    }, this.delay);
  }

  /**
   * 处理过去数据过程
   */
  async handleChartData(type?: string) {
    let res;
    if (type === "load") {
      res = await this.loadChartData({ chart: this.chart, mode: this.mode });
    } else {
      this.loading = true;
      res = await this.getChartData({ chart: this.chart, mode: this.mode });
    }
    if (res instanceof Object) {
      this.isNoFindField = false;
      this.data = res.chartData;
      this.dataAlias = res.chartAlias;
    } else {
      if (typeof res === "number") {
        this.isNoFindField = res;
        this.data = [];
        this.dataAlias = {};
      }
    } 
    this.loading = false;
  }

  /**
   * 修改图表数据
   */
  async updateChartData() {
    if (!this.isRefreshChart) {return;}
    if (this.mode) {
      await this.refreshChartData();
    } else {
      await this.handleChartData();
    }
  }
  created() {
    this.chartViewStatus[this.chart.uid] = {
      data: this.refreshChartData,
      view: this.refreshChart
    };
  }
  async mounted() {
    await this.updateChartData();
  }
}
</script>

<style lang="less" scoped>
.h3-easy-report-chart {
  display: flex;
  flex-direction: column;
  width: 100%;
  &__body {
    flex: 1;
  }
  &__placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  &__chartText {
    color: #8893a7;
    font-size: 16px;
    margin-top: 30px;
  }
  &__placeholder--label {
    padding: 30px 20px 0;
    font-size: 16px;
    font-weight: 400;
    color: rgba(136, 147, 167, 1);
  }
}
</style>
