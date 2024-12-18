<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CreateElement, VNode } from 'vue';
import Cell from './cell.vue';
@Component({
  name: 'h3-table-body',
  components: {
    Cell
  }
})
export default class ReportTableBody extends Vue {
  @Prop({ default: () => ([]) }) innerData!: Array<any>;
  @Prop({ default: () => 0 }) index!: number;
  @Prop({ default: () => 0 }) rowIndex!: number;
  @Prop({ default: () => ([]) }) columnsIds!: Array<string>;
  @Prop({ default: () => ([]) }) columns!: Array<H3.TableColumns>;
  @Prop({ default: () => ([]) }) columnsWidth!: Array<number>;
  @Prop({ default: () => 'h3-table' }) prefixCls!: string;

  render(h: CreateElement) {
    const colgroup: Array<VNode> = [];
    const tr: Array<VNode> = [];
    let tableWidth = 0;
    this.columns.forEach((col: H3.TableColumns, index: number) => {
      tableWidth += this.columnsWidth[index];
      colgroup.push(h('col', {
        attrs: {
          name: this.columnsIds[index],
          width: this.columnsWidth[index]
        }
      }));
    });
    this.innerData.forEach((item: any, rowIndex: number) => {
      const td: Array<VNode> = [];
      this.columns.forEach((col: H3.TableColumns, index: number) => {
        td.push(h('td', {
          attrs: {
            class: this.columnsIds[index]
          }
        }, [
          h(Cell, {
            props: {
              index: this.rowIndex + rowIndex,
              formatter: col.formatter,
              row: item,
              data: item[col.prop]
            }
          })
        ]));
      });
      tr.push(h('tr', td));
    });
    const index = (this.index - 1) > 0 ? (this.index - 1) : 0;
    return h('table', {
      style: {
        position: 'absolute',
        left: '0',
        top: `${index * 2000}px`,
        width: `${tableWidth}px`
      },
      attrs: {
        cellspacing: 0,
        cellpadding: 0,
        border: 0,
        class: `${this.prefixCls}__body`
      }
    }, [h('colgroup', colgroup), tr]);
  }
}
</script>
<style lang="less">
  @import "table";
</style>
