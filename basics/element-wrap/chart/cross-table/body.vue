<script lang="ts">
import { Component, Inject, Mixins, Prop, Vue, Watch } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import Cell from "./cell.vue";
import TableMixin from "./mixin";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import H3TableFooter from "./footer.vue";
@Component({
  name: "h3-pivot-table-body",
  components: {
    Cell,
    H3TableFooter
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
  @Prop({ default: () => [] }) orderList!: Array<string>;
  @Prop({ default: () => [] }) orderIndexs!: Array<any>;
  @Prop({ default: () => {} }) crossSummary!: H3.Report.CrossSummary;
  @Prop({ default: 0 }) scrollLeft!: number;
  @Prop({ default: () => [] }) tableRows!: Array<Array<string>>;
  @Prop({ default: () => [] }) rows!: Array<H3.Report.FieldColumn>;
  @Prop({ default: 12 }) fontSize!: number;
  @Inject() cellClick!: Function;
  @Inject() cellDblClick!: Function;
  @Inject() staticCellHeight!: number;
  
  /**
   * 获取小计的下标位置集合
   */
  getTotalFlags() {
     const totalFlags: any = [];
     this.tableRows.forEach((row: Array<string>, index: number) => {
         let count = 0;
         row.forEach((cell: any, cellIndex: number) => {
            if (typeof cell === "object") { 
               if(cell.isTotal) {
                  if(cell.colspan) {
                      for(let i=0;i<cell.colspan;i++) {
                      totalFlags.push(count);
                      count += 1;
                     }
                  } else {
                     totalFlags.push(count);
                     count += 1;
                  }
                } else {
                  if (cell.colspan) {
                   count += cell.colspan;
                  } else {
                    count += 1;
                  }
                }
            }
         });
     });
     return totalFlags;
  }

  render(h: CreateElement) {
    const colgroup: Array<VNode> = [];
    const tr: Array<VNode> = [];
    let tableWidth = 0;
    const flags = this.getTotalFlags();

    const crossLength =
      this.crossSummary.columnSummary && this.crossSummary.columnSummaryPosition === 1
        ? this.metric.length
        : 0;
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
    this.innerData.forEach((row: any, index: number) => {
      const td: Array<VNode> = [];
      let cellOptions: any;
      const diffNum = this.data[index].length - row.length;
      let totalFlag: boolean = false;
      row.forEach((cell: any, cellIndex: number) => {
        const options: any = {
          attrs: {}
        };
        const maxLength = this.tableColumnsWidths.length;
        const extraLength = maxLength - row.length;
        let realIndex = cellIndex + extraLength;
        if(this.showOrderNo) {
          if(this.orderIndexs.includes(cellIndex + extraLength)) {
            realIndex = -1;
          } else {
            realIndex = cellIndex + extraLength - (this.orderIndexs.filter(item => item < (cellIndex + extraLength)).length);
          }
        }
       
        cellOptions = {
          props: {
            field: this.columns[realIndex] ? this.columns[realIndex] : null,
            row: this.data[index],
            rowIndex: index,
            index: diffNum + cellIndex,
            formatter: ({ data }) => {
              let realData;
              if(realIndex > -1) {
                realData = this.columns[realIndex]
                ? getAliaValue(this.columns[realIndex].uid, data, this.alias)
                : "";
              }
              
              return (realData || data);
            },
            getAliasByCell: ({ data }) => {
              const realData = this.columns[realIndex]
                ? getAliaValue(this.columns[realIndex].uid, data, this.alias)
                : "";
              return realData && realData !== data  ? [data]: null;
            },
            data: cell instanceof Object ? (cell.label instanceof Object ? '' : cell.label)  : cell
          },
          class: {}
        };
        
        if (cell !== null 
        && cell !== undefined 
        && !cell.isTotal
        && !totalFlag 
        && !this.orderIndexs.includes(cellIndex)
        && !flags.includes(diffNum + cellIndex - crossLength)) {
          cellOptions.class["cell-click"] = true;
          cellOptions.on = {
            click: (data) => {
              if (this.cellClick) {
                this.cellClick({ type: "body", data});
              }
            },
          };
        }
        if(totalFlag  ||  flags.includes(diffNum + cellIndex - crossLength)) {
          cellOptions.class["strong"] = true;
        }
        if (cell instanceof Object) {
          if (cell.colspan) {
            options.attrs.colspan = cell.colspan;
          }
          if(cell.isHide) {
            cellOptions.class["hide"] = true;
          }
          if(cell.isTotal) {
            totalFlag = true;
            cellOptions.class["strong"] = true;
          }
          if (cell.rowspan) {
            options.attrs.rowspan = cell.rowspan;
            cellOptions.class["middle"] = true;
          }
          cellOptions.props.data = cell.label instanceof Object ? '' : cell.label;
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
      const summary = h(H3TableFooter, {
        props: {
          prefixCls: this.prefixCls,
          summary: this.summary,
          scrollLeft: this.scrollLeft,
          tableColumnsWidths:this.tableColumnsWidths
        },
      })
      tableVNodes = [h("colgroup", colgroup), 
      this.makeHead(h, true), tr];
    }
    return h(
      "table",
      {
        style: {
          position: "absolute",
          left: "0",
          top: `${index * this.staticCellHeight * this.rowNum}px`,
          width: `${tableWidth}px`,
          fontSize: this.fontSize +'px'
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
