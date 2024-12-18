<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CreateElement, VNode } from 'vue';

let tableWidth = 0;
@Component({
  name: 'h3-table-footer',
  components: {
  }
})
export default class ReportTableFooter extends Vue implements H3.TableHeader {
  @Prop({ default: () => ([]) }) columnsWidth!: Array<number>;
  @Prop({ default: () => ([]) }) columnsIds!: Array<string>;
  @Prop({ default: () => ([]) }) columns!: Array<H3.TableColumns>;
  @Prop({ default: () => ([]) }) summaryObj!: {[key: string]: number };
  @Prop({ default: () => 'h3-table' }) prefixCls!: string;
  @Prop({ default: () => 0 }) scrollLeft!: number;
  @Prop({ default: () => '' }) gutter!: boolean;
  @Prop({ default: () => 17 }) gutterWidth!: number;

  @Watch('scrollLeft')
  watchScrollLeft() {
    const header = this.$refs.header as HTMLDivElement;
    if (header) {
      header.scrollLeft = this.scrollLeft;
    }
  }
  render(h: CreateElement) {
    const colgroup: Array<VNode> = [];
    const tr: Array<VNode> = [];
    tableWidth = 0;
    this.columns.forEach((col: H3.TableColumns, index: number) => {
      tableWidth += this.columnsWidth[index];
      colgroup.push(h('col', {
        attrs: {
          name: this.columnsIds[index],
          width: this.columnsWidth[index]
        }
      }));
      tr.push(h('th', {
        attrs: {
          class: this.columnsIds[index]
        }
      }, [
        h('div', {
          attrs: {
            class: 'cell'
          }
        }, index === 0 ? this.$r_language.view.allSum : (!this.summaryObj[col.prop] && this.summaryObj[col.prop] !== 0 ? '' : this.summaryObj[col.prop].toString()))
      ]));
    });
    if (!this.gutter) {
      tableWidth += this.gutterWidth;
      colgroup.push(h('col', {
        attrs: {
          name: 'gutter',
          width: this.gutter ? 0 : this.gutterWidth
        }
      }));
      tr.push(h('th', {
        class: {
          gutter: true,
          'is-hidden': this.gutter
        },
      }));
    }

    return h('div', {
      ref: 'header',
      attrs: {
        class: `${this.prefixCls}__footer-warp`
      }
    }, [
      h('table', {
        style: {
          width: `${tableWidth}px`
        },
        attrs: {
          cellspacing: 0,
          cellpadding: 0,
          border: 0,
          class: `${this.prefixCls}__footer`
        }
      }, [h('colgroup', colgroup), h('tr', tr)])
    ]);
  }
}
</script>
<style lang="less">
</style>
