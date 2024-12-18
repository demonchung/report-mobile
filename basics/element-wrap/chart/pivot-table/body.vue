<script lang="ts">
import { Component, Inject, Mixins, Prop, Vue, Watch } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import Cell from "./cell.vue";
import TableMixin from "./mixin";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";

@Component({
  name: "h3-pivot-table-body",
  components: {
    Cell
  }
})
export default class ReportPivotTableBody extends Mixins(TableMixin) {
  @Prop({ default: () => [] }) innerData!: Array<any>;
  @Prop({ default: () => [] }) data!: Array<any>;
  @Prop({ default: () => 0 }) index!: number;
  @Prop({ default: () => {} }) alias!: any;
  @Prop({ default: () => 0 }) rowIndex!: number;
  @Prop({ default: () => 0 }) rowNum!: number;
  @Prop({ default: () => 0 }) columnsLen!: number;
  @Prop({ default: () => [] }) columns!: Array<H3.Report.FieldColumn>;
  @Prop({ default: () => [] }) metric!: Array<H3.Report.FieldColumn>;
  @Prop({ default: () => "h3-pivot-table" }) prefixCls!: string;
  @Prop({ default: () => [] }) tableColumnsWidths!: Array<number>;
  @Prop({ default: () => [] }) summary!: Array<any>;
  @Prop({ default: () => false }) fixedColHead!: boolean;
  @Prop({ default: () => false }) showOrderNo!: boolean;
  @Prop({ default: () => [] }) tableRows!: Array<Array<string>>;
  @Prop({ default: () => [] }) rows!: Array<H3.Report.FieldColumn>;
  // 标签字体大小
  @Prop({ default: 12 }) fontSize!: number;
  @Inject() cellClick!: Function;
  @Inject() cellDblClick!: Function;
  @Inject() staticCellHeight!: number;
  // @Inject() setFixedWidth!: Function;
  render(h: CreateElement) {
    const colgroup: Array<VNode> = [];
    const tr: Array<VNode> = [];
    let tableWidth = 0;
    this.tableColumnsWidths.forEach((colNum: number, index: number) => {
      tableWidth += colNum;
      colgroup.push(
        h("col", {
          class: {
            "h3-pivot-table__number-cell": index >= this.columnsLen
          },
          attrs: {
            width: colNum
          }
        })
      );
    });
    // this.setFixedWidth(fixedWidth);
    this.innerData.forEach((row: any, index: number) => {
      const td: Array<VNode> = [];
      let cellOptions: any;
      const diffNum = this.data[index] ? this.data[index].length - row.length : 0;
      row.forEach((cell: any, cellIndex: number) => {
        const options: any = {
          attrs: {}
        };
        const maxLength = this.tableColumnsWidths.length;
        const extraLength = maxLength - row.length;
        const realIndex = this.showOrderNo ? cellIndex + extraLength - 1 : cellIndex + extraLength;

        cellOptions = {
          props: {
            field: this.columns[realIndex] ? this.columns[realIndex] : null,
            row: this.data[index],
            rowIndex: index,
            index: diffNum + cellIndex,
            formatter: ({ data }) => {
              const realData = this.columns[realIndex]
                ? getAliaValue(this.columns[realIndex].uid, data, this.alias)
                : "";
              return realData || data;
            },
            getAliasByCell: ({ data }) => {
              const realData = this.columns[realIndex]
                ? getAliaValue(this.columns[realIndex].uid, data, this.alias)
                : "";
              return realData && realData !== data  ? [data]: null;
            },
            data: cell
          },
          class: {}
        };
        if (cell !== null && cell !== undefined) {
          cellOptions.class["cell-click"] = true;
          cellOptions.on = {
            click: (data) => {
              if (this.cellClick) {
                this.cellClick({ type: "body", data});
              }
            },
          };
        }
        if (cell instanceof Object) {
          if (cell.colspan) {
            options.attrs.colspan = cell.colspan;
          }
          if (cell.rowspan) {
            options.attrs.rowspan = cell.rowspan;
            cellOptions.class["middle"] = true;
          }
          cellOptions.props.data = cell.label;
        } else {
          cellOptions.class["rtl"] = true;
        }
        td.push(h("td", options, [h(Cell, cellOptions)]));
      });
      tr.push(h("tr", td));
    });
    const index = this.index - 1 > 0 ? this.index - 1 : 0;
    let tableVNodes: any = [];
    if (this.fixedColHead) {
      tableVNodes = [h("colgroup", colgroup), tr];
    } else {
      tableVNodes = [h("colgroup", colgroup), this.makeHead(h, true), tr];
    }
    return h(
      "table",
      {
        style: {
          position: "absolute",
          left: "0",
          top: `${index * this.staticCellHeight * this.rowNum}px`,
          width: `${tableWidth}px`,
          fontSize: `${this.fontSize}px`
        },
        attrs: {
          cellspacing: 0,
          cellpadding: 0,
          border: 0,
          class: `${this.prefixCls}__body`
        }
      },
      tableVNodes
    );
  }
}
</script>
<style lang="less"></style>
