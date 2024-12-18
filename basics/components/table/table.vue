<template>
  <div :class="prefixCls">
    <h3-table
      v-if="refresh"
      :summary="true"
      :columns="getColumns"
      :data="options.data"
      :height="tableHeight"
    ></h3-table>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import H3Table from './component/table';
@Component({
  name: 'h3-report-table',
  components: {
    H3Table
  }
})
export default class ReportTable extends Vue {
  @Prop({ default: () => ({}) }) options!: H3.Chart.Table;
  @Prop({ default: () => true }) refresh!: boolean;

  prefixCls = 'h3-report-table';
  height = 0;
  width = 0;
  @Watch('options.resizeState')
  watchResizeState(val: boolean) {
    if (!val && this.refresh) {
      this.height = this.options.height || this.$el.clientHeight;
    }
  }
  get tableHeight() {
    return this.height;
  }
  get getColumns() {
    const cols = this.options.columns.map((col: H3.Report.FieldColumn) => ({
      label: col.alias || col.name,
      prop: col.uid,
      width: 100,
      type: col.type,
      summaryType: col.options ? col.options.aggregateType : null,
      formatter: (text: string, row: any) => this.options.dataAlias[text] || text
    }));
    // cols.unshift({
    //   label: '序号',
    //   prop: 'index',
    //   width: 40,
    //   formatter: (text: string, row: any, index: number) => (index + 1).toString()
    // } as any);
    return cols;
  }

  mounted() {
    this.height = this.options.height || this.$el.clientHeight;
    this.width = this.$el.clientWidth;
  }
}
</script>
<style lang="less">

</style>
