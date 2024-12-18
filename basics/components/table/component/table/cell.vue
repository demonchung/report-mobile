<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CreateElement, VNode } from 'vue';

@Component({
  name: 'h3-table-cell'
})
export default class ReportTableCell extends Vue {
  @Prop({ default: () => '' }) data!: any;
  @Prop({ default: () => 0 }) row!: any;
  @Prop({ default: () => 0 }) index!: number;
  @Prop({ default: () => '' }) formatter!: Function;
  render(h: CreateElement) {
    let data: any = '';
    if (this.formatter) {
      data = this.formatter(this.data, this.row, this.index);
    } else {
      data = this.data as string;
    }
    return h('div', {
      class: {
        cell: true
      },
      domProps: {
        innerHTML: data
      }
    });
  }
}
</script>
<style lang="less">
  @import "table";
</style>
