<template>
  <div
    :class="prefixCls"
    :style="getTableStyle"
    :tableId="tableId"
  >
    <h3-table-header
      ref="header"
      :prefixCls="prefixCls"
      :columns="columns"
      :columnsWidth="columnsWidth"
      :columnsIds="columnsIds"
      :gutter="gutter"
      :gutterWidth="gutterWidth"
      :scrollLeft="bodyWScroll.left"
    ></h3-table-header>
    <h3-table-body
      :prefixCls="prefixCls"
      :columnsWidth="columnsWidth"
      :columnsIds="columnsIds"
      :columns="columns"
      :data="data"
      :height="bodyHeight"
      @bodyScroll="bodyScroll"
      @setGutterSate="setGutterSate"
    ></h3-table-body>
    <h3-table-footer
      ref="footer"
      v-if="summary"
      :summaryObj="summaryObj"
      :prefixCls="prefixCls"
      :columns="columns"
      :columnsWidth="columnsWidth"
      :columnsIds="columnsIds"
      :gutter="gutter"
      :gutterWidth="gutterWidth"
      :scrollLeft="bodyWScroll.left"
    ></h3-table-footer>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import H3TableHeader from './header.vue';
import H3TableBody from './scroll.vue';
import H3TableFooter from './footer.vue';

let tableNum = 1;
let columnNum = 1;
@Component({
  name: 'h3-table',
  components: {
    H3TableHeader,
    H3TableBody,
    H3TableFooter
  }
})
export default class ReportTable extends Vue implements H3.Table {
  @Prop({ default: () => ([]) }) columns!: Array<H3.TableColumns>;
  @Prop({ default: () => ([]) }) data!: Array<any>;
  @Prop({ default: () => false }) summary!: boolean | Function;
  @Prop({ default: () => 0 }) height!: number;
  @Prop({ default: () => 0 }) width!: number;
  @Prop({ default: () => 17 }) gutterWidth!: number;
  prefixCls = 'h3-table';
  gutter = true;
  tableId = '';
  bodyWScroll = {};
  columnsWidth: Array<number> =[];
  columnsIds: Array<string> =[];
  headerWidth:number = 0;
  requestID: number = -1;
  bodyHeight: number = 0;
  timer = 0;
  summaryObj: { [key: string]: number } = {};

  /**
   * 设置表格样式
   */
  get getTableStyle() {
    return {
      width: this.width ? `${this.width}px` : null
    };
  }
  /**
   * 获取表体高度
   */
  getBodyHeight() {
    let bodyHeight = this.height;
    const header = this.$refs.header as Vue;
    const footer = this.$refs.footer as Vue;
    if (header) {
      bodyHeight -= (header.$el as HTMLDivElement).offsetHeight;
    }
    if (footer) {
      bodyHeight -= (footer.$el as HTMLDivElement).offsetHeight;
    }
    return bodyHeight;
  }
  /**
   * 设置预留排线是否显示
   */
  setGutterSate(state: boolean) {
    this.gutter = state;
  }
  /**
   * 监听表体滚动
   */
  bodyScroll(bodyScroll: any) {
    this.bodyWScroll = bodyScroll;
  }
  /**
   * 监听表格宽度变化
   */
  addTableSizeChangeEvent() {
    let headerWidth: number = 0;
    if (this.$refs.header) {
      headerWidth = ((this.$refs.header as Vue).$el as HTMLDivElement).offsetWidth;
      if (this.headerWidth !== headerWidth) {
        this.headerWidth = headerWidth;
        this.columnsWidth = this.getColumnsWidth();
      }
    }
    this.requestID = window.requestAnimationFrame(this.addTableSizeChangeEvent);
  }

  /**
   * 获取行宽度
   */
  getColumnsWidth() :Array<number> {
    const headerWidth: number = this.headerWidth;
    let tableWidth = 0;
    this.columns.forEach((col: H3.TableColumns) => {
      tableWidth += col.width || 100;
    });

    if (tableWidth < headerWidth) {
      const empty = this.columns.filter((col: H3.TableColumns) => (!col.width));
      if (empty && empty.length && (headerWidth - tableWidth) / empty.length > 100) {
        return this.columns.map((col: H3.TableColumns) => (empty.filter((eCol: H3.TableColumns) => eCol === col).length ? (headerWidth - tableWidth) / empty.length : col.width || 0));
      }
      const tmpColsWidth = this.columns.map((col: H3.TableColumns) => {
        const colWidth = col.width || 100;
        const colRatio = colWidth / tableWidth;
        const colActualWidth = colRatio * (headerWidth - (this.gutter ? 0 : this.gutterWidth));
        return parseInt(colActualWidth.toFixed(0), 10);
      });
      let colsWidth: number = 0;
      if (tmpColsWidth.length) {
        colsWidth = tmpColsWidth.reduce((prev: number, cur: number) => prev + cur);
      }
      if (colsWidth > headerWidth) {
        tmpColsWidth[tmpColsWidth.length - 1] -= colsWidth - headerWidth;
      }
      return tmpColsWidth;
    }
    return this.columns.map((col: H3.TableColumns) => col.width || 100);
  }
  created() {
    const tableId = `h3_table_${tableNum++}`;
    this.tableId = tableId;
    const summaryCols: Array<H3.TableColumns> = [];
    this.columnsIds = this.columns.map((item: H3.TableColumns) => {
      if (item.type === 'number') {
        summaryCols.push(item);
      }
      return `${tableId}_col_${columnNum++}`;
    });
    if (this.summary && summaryCols.length) {
      this.data.forEach((row: any) => {
        summaryCols.forEach((col: H3.TableColumns) => {
          const key = col.prop;
          if (!this.summaryObj[key] && this.summaryObj[key] !== 0) {this.summaryObj[key] = row[key];}
          else {
            switch (col.summaryType) {
              case 'SUM':
              case 'AVG':
                this.summaryObj[key] += parseFloat(row[key]);
                break;
              case 'MAX':
                this.summaryObj[key] = Math.max(this.summaryObj[key], parseFloat(row[key]));
                break;
              case 'MIN':
                this.summaryObj[key] = Math.min(this.summaryObj[key], parseFloat(row[key]));
                break;
              default:
                this.summaryObj[key] += parseFloat(row[key]);
                break;
            }
          }
        });
      });
      this.columns.forEach((col: H3.TableColumns, index: number) => {
        if (this.summaryObj[col.prop]) {
          if (col.summaryType === 'AVG') {
            this.summaryObj[col.prop] = this.summaryObj[col.prop] / this.data.length;
          }
          this.summaryObj[col.prop] = parseFloat(this.summaryObj[col.prop].toFixed(2));
        }
      });
    }
  }
  updated() {
    this.bodyHeight = this.getBodyHeight();
  }
  mounted() {
    this.bodyHeight = this.getBodyHeight();
    this.addTableSizeChangeEvent();
    let headerWidth: number = 0;
    if (this.$refs.header) {
      headerWidth = (this.$refs.header as Vue).$el.clientWidth;
      if (this.headerWidth !== headerWidth) {
        this.headerWidth = headerWidth;
        this.columnsWidth = this.getColumnsWidth();
      }
    }
  }

  destroy() {
    window.cancelAnimationFrame(this.requestID);
  }
}
</script>
<style lang="less">
  @import "table";
</style>
