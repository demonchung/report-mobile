<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import Cell from "./cell.vue";
import tableMixin from "./mixin";
@Component({
  name: "h3-pivot-table-header",
  components: {
    Cell
  },
  mixins: [tableMixin]
})
export default class ReportPivotTableHeader extends Vue implements H3.PivotTable.TableHeader {
  @Prop({ default: () => [] }) prefixCls!: string;
  @Prop({ default: () => [] }) scrollLeft!: number;
  @Prop({ default: 12 }) fontSize!: number;
  @Prop({ default: () => {} }) alias!: any;
  @Prop({ default: () => [] }) tableRows!: Array<Array<string>>;
  @Prop({ default: () => [] }) tableColumnsWidths!: Array<number>;
  @Prop({ default: () => [] }) rows!: Array<H3.Report.FieldColumn>;
  @Prop({ default: "" }) fix!: string;
  @Inject() cellClick!: Function;
  @Watch("scrollLeft")
  watchScrollLeft() {
    const header = this.$refs.header as HTMLDivElement;
    if (header) {
      header.scrollLeft = this.scrollLeft;
    }
  }
  render(h: CreateElement) {
    const colgroup: Array<VNode> = [];
    const self = this;
    let headTrs: any;
    let tableWidth: any = 0;
    const lastRow = self.tableRows[self.tableRows.length - 1];
    lastRow.forEach((cell: any, cellIndex: number) => {
      tableWidth += self.tableColumnsWidths[cellIndex];
      colgroup.push(
        h("col", {
          attrs: {
            width: self.tableColumnsWidths[cellIndex]
          }
        })
      );
    });
    headTrs = this.makeHead(h, true);
    headTrs.unshift(h("colgroup", colgroup));
    return h(
      "div",
      {
        ref: "header",
        attrs: {
          class: `${this.prefixCls}__header-warp`
        }
      },
      [
        h(
          "table",
          {
            style: {
              width: `${tableWidth}px`,
              fontSize: `${this.fontSize}px`
            },
            attrs: {
              cellspacing: 0,
              cellpadding: 0,
              border: 0,
              class: `${this.prefixCls}__header`
            }
          },
          headTrs
        )
      ]
    );
  }
}
</script>
<style lang="less"></style>
