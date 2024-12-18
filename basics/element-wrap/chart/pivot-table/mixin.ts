import { Vue, Component, Prop, Inject } from "vue-property-decorator";
import Cell from "./cell.vue";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";

@Component({
  components: {
    Cell
  }
})
export default class TableMixin extends Vue {
  @Prop({ default: () => {} }) alias!: any;
  @Prop({ default: () => [] }) tableRows!: Array<Array<string>>;
  @Prop({ default: () => [] }) rows!: Array<H3.Report.FieldColumn>;
  @Prop({ default: () => true }) allowDrag!: boolean;

  @Inject() cellClick!: Function;

  /**
   * 创建表格
   * @param h
   * @param allowDrag
   */
  makeHead(h, allowDrag: boolean = false) {
    const self = this;
    const headTrs: any = [];
    let headerThs: any = [];
    let cellOptions: any = {};
    self.tableRows.forEach((row: Array<string>, index: number) => {
      headerThs = [];
      row.forEach((cell: any, cellIndex: number) => {
        const options: any = {
          attrs: {},
          class: {}
        };
        const dragDiv = h("div", {
          class: {
            "column-resize-area": true
          },
          on: {
            mousedown: e => {
              self.startDrag(e, cell);
            },
            dblclick: e => {
              self.dblclick(e, cell);
            }
          }
        });
        cellOptions = {
          props: {
            field: this.rows[index],
            row,
            rowIndex: index,
            index: cellIndex,
            allowDrag: cellIndex !== row.length - 1,
            formatter: ({ data }) => {
              const realData = this.rows[index]
                ? getAliaValue(this.rows[index].uid, data, this.alias)
                : "";
              return realData || data;
            },
            data: cell
          }
        };

        if (index < this.rows.length && cellIndex > 0) {
          cellOptions.class = {
            "cell-click": cell && cell.label !== this.$r_language.view.allSum
          };
          cellOptions.on = {
            click: data => {
              if (this.cellClick) {
                this.cellClick({ type: "header", data } );
              }
            }
          };
        } else {
          cellOptions.on = {
            click: data => {
              if (this.cellClick) {
                this.cellClick({ type: "mobileHeader", data } );  // 针对于移动端新增的type
              }
            }
          };
        }

        if (typeof cell === "object") {
          if (cell.colspan) {
            options.attrs.colspan = cell.colspan;
          }
          if (cell.rowspan) {
            options.attrs.rowspan = cell.rowspan;
            cellOptions.class["middle"] = true;
          }
          cellOptions.props.data = cell.label;
        }
        // 最后一列并且不为最后一个才允许拖拽
        if (
          index === self.tableRows.length - 1 &&
          cellIndex !== row.length - 1 &&
          allowDrag &&
          this.allowDrag
        ) {
          headerThs.push(h("th", options, [h(Cell, cellOptions), dragDiv]));
        } else {
          headerThs.push(h("th", options, [h(Cell, cellOptions)]));
        }
      });

      headTrs.push(h("tr", headerThs));
    });
    return headTrs;
  }

  /**
   * 拖拽
   */
  startDrag(e, row) {
    this.$emit("start-drag", { e, row });
  }
  /**
   * 双击格子自适应
   */
  dblclick(e, row) {
    this.$emit("change-columns", { e, row });
  }
}
