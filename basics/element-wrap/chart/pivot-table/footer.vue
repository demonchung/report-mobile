<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import Cell from "./cell.vue";
@Component({
  name: "h3-pivot-table-footer",
  components: {
    Cell
  }
})
export default class ReportPivotTableFooter extends Vue implements H3.PivotTable.TableFooter {
  @Prop({ default: () => [] }) prefixCls!: string;
  @Prop({ default: () => [] }) scrollLeft!: number;
  @Prop({ default: () => [] }) summary!: Array<number>;
  @Prop({ default: () => [] }) tableColumnsWidths!: Array<number>;
  @Prop({ default: () => 0 }) fixedColNumber!: number;
  @Prop({ default: "" }) fix!: string;
  // 标签字体大小
  @Prop({ default: 12 }) fontSize!: number;
  
  @Inject() cellClick!: Function;
  @Inject() setFixedWidth!: Function;
  @Inject() setTableWidth!: Function;
  @Watch("scrollLeft")
  watchScrollLeft() {
    const header = this.$refs.footer as HTMLDivElement;
    if (header) {
      header.scrollLeft = this.scrollLeft;
    }
  }
  
  mounted() {
    // 初始化时，table容器有动画影响到取值
    setTimeout(() => {
      this.setProvide();
    }, 300);
    window.addEventListener("resize", this.setProvide, false);
  }
  updated() {
    this.setProvide();
  }
  setProvide() {
     const tableWidth = this.tableColumnsWidths.reduce((a,b)=> {
      return a + b;
    });
    this.setTableWidth(tableWidth);
    if (this.fix) {
      let fixedWidth:number = 0;
      for(let i=0;i<this.fixedColNumber;i++) {
        fixedWidth +=this.tableColumnsWidths[i];
      }
      // const fixedWidth = (this.$refs.allSum as any) ? (this.$refs.allSum as any).$el.clientWidth : 0;
      this.setFixedWidth(fixedWidth);
    }
  }
  render(h: CreateElement) {
    const colgroup: Array<VNode> = [];
    const footerTrs: any = [];
    const footerThs: any = [];
    let tableWidth: any = 0;
    const diffNumber = this.tableColumnsWidths.length - this.summary.length;
    const footerWidths = [
      this.tableColumnsWidths
        .slice(0, diffNumber)
        .reduce((total: number, num: number) => total + num, 0)
    ].concat(this.tableColumnsWidths.slice(diffNumber));
    footerThs.push(
      h("th", [
        h(Cell, {
          props: {
            index: 0,
            data: this.$r_language.view.allSum
          },
          ref: "allSum"
        })
      ])
    );
    footerWidths.forEach((len: number, index: number) => {
      tableWidth += len;
      colgroup.push(
        h("col", {
          attrs: {
            width: len
          }
        })
      );
      if (index > 0) {
        footerThs.push(
          h("th", [
            h(Cell, {
              class: {
                rtl: true
              },
              props: {
                row: this.summary,
                index,
                data: this.summary[index - 1] !== null ? this.summary[index - 1] : "-"
              },
              on: {
                click: data => {
                  this.cellClick({ type: "footer", data });
                }
              }
            })
          ])
        );
      }
    });
    footerTrs.push(h("colgroup", colgroup), h("tr", footerThs));
    return h(
      "div",
      {
        ref: "footer",
        attrs: {
          class: `${this.prefixCls}__footer-warp`
        }
      },
      [
        h(
          "table",
          {
            ref: "footerTable",
            style: {
              width: `${tableWidth}px`,
              fontSize: `${this.fontSize}px`
            },
            attrs: {
              cellspacing: 0,
              cellpadding: 0,
              border: 0,
              class: `${this.prefixCls}__footer`
            }
          },
          footerTrs
        )
      ]
    );
  }
  destroyed() {
    window.removeEventListener("resize", this.setProvide, false);
  }
}
</script>
<style lang="less"></style>
