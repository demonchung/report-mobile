<template>
  <div ref="pivotTable" :class="getTableClass" :style="getTableStyle">
    <div :class="`${prefixCls}__view`" ref="tableView">
      <h3-table-header
        v-if="getTableRows.length && fixedColHead"
        ref="header"
        :prefixCls="prefixCls"
        :rows="rows"
        :alias="alias"
        :tableRows="getTableRows"
        :tableColumnsWidths="tableColumnsWidths"
        :scrollLeft="bodyWScroll.left"
        :allowDrag="allowDrag"
        :fontSize="fontSize"
        @cell-click="cellClick"
        @start-drag="startDrag"
        @change-columns="columnAdaptSize($event)"
      ></h3-table-header>
      <h3-table-body
        v-if="getTableColumns.length"
        :prefixCls="prefixCls"
        :alias="alias"
        :tableColumnsWidths="tableColumnsWidths"
        :bodyRows="bodyRows"
        :columns="columns"
        :metric="metric"
        :landscape="landscape"
        :summary="summary"
        :tableColumns="tableColumns"
        :height="bodyHeight"
        :fixedColHead="fixedColHead"
        :showOrderNo="showOrderNo"
        :rows="rows"
        :scrollTop="bodyWScroll.top"
        :scrollLeft="bodyWScroll.left"
        :tableRows="getTableRows"
        :fullScreen="fullScreen"
        :allowDrag="allowDrag"
        :isTransparent="isTransparent"
        :fontSize="fontSize"
        @bodyScroll="bodyScroll"
        @start-drag="startDrag"
        @change-columns="columnAdaptSize($event)"
      >
      </h3-table-body>
      <h3-table-footer
        ref="footer"
        v-if="summary.length"
        :prefixCls="prefixCls"
        :summary="summary"
        :scrollLeft="bodyWScroll.left"
        :tableColumnsWidths="tableColumnsWidths"
        :fontSize="fontSize"
        fix=""
      >
      </h3-table-footer>
      <div v-if="allowDrag" class="column-resize-line" ref="resize-line"></div>
      <!-- 固定 -->
      <div
        :class="`${prefixCls}__fixed`"
        :style="{ width: getFixedLeftWidth + 'px' }"
        v-if="fixedRowHead"
      >
        <div :style="{ width: tableWidth + 'px' }">
          <h3-table-header
            v-if="getTableRows.length && fixedColHead"
            :prefixCls="prefixCls"
            :rows="rows"
            :alias="alias"
            :tableRows="getTableRows"
            :tableColumnsWidths="tableColumnsWidths"
            fix="left"
            :allowDrag="allowDrag"
            :fontSize="fontSize"
            @cell-click="cellClick"
            @start-drag="startDrag"
            @change-columns="columnAdaptSize($event)"
          ></h3-table-header>
          <h3-table-body
            v-if="getTableColumns.length"
            :prefixCls="prefixCls"
            :alias="alias"
            :tableColumnsWidths="tableColumnsWidths"
            :bodyRows="bodyRows"
            :columns="columns"
            :metric="metric"
            :summary="summary"
            :tableColumns="tableColumns"
            :height="bodyHeight"
            :scrollTop="bodyWScroll.top"
            :disableWheel="true"
            :scrollLeft="bodyWScroll.left"
            fix="left"
            :fixedColHead="fixedColHead"
            :showOrderNo="showOrderNo"
            :rows="rows"
            :landscape="landscape"
            :allowDrag="allowDrag"
            :tableRows="getTableRows"
            :fullScreen="fullScreen"
            :isTransparent="isTransparent"
            :fontSize="fontSize"
            @bodyScroll="fixedBodyScroll"
            @start-drag="startDrag"
            @change-columns="columnAdaptSize($event)"
          >
          </h3-table-body>
          <h3-table-footer
            v-if="summary.length"
            :prefixCls="prefixCls"
            :summary="summary"
            :tableColumnsWidths="tableColumnsWidths"
            :fixedColNumber="realFixedColNumber"
            :scrollLeft="bodyWScroll.left"
            :fontSize="fontSize"
            fix="left"
          >
          </h3-table-footer>
        </div>
      </div>
    </div>
    <div :class="[`${prefixCls}__tool`, isTransparent ? `${prefixCls}__transparent` : '']">
      <h3-pagination
        :showTotal="
          total =>
            $r_language.view.pag_des.page_totla + `${total}` + $r_language.view.pag_des.page_des
        "
        :total="total"
        :size="pageSet.size"
        :fontSize="12"
        style="font-size: 12px"
        @change="changePage"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Provide, Inject } from "vue-property-decorator";
import H3TableHeader from "./header.vue";
import H3TableBody from "./scroll.vue";
import H3TableFooter from "./footer.vue";
import Pagination from "@h3/report-mobile/basics/components/pagination/pagination.vue";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import { getDomWidth } from "@h3/report-mobile/basics/utils/dom";
import { handleTableData } from "./utils";
import { StringType } from "@h3/report-mobile/basics/enum/filter-type";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { getStrLen } from "@h3/report-mobile/basics/utils/string";
import { namespace } from "vuex-class";
import { ReportAction, ReportMutation } from "@h3/report-mobile/basics/store/dashboard/types";
const Dashboard = namespace("report");
@Component({
  name: "h3-pivot-table",
  components: {
    H3TableHeader,
    H3TableBody,
    H3TableFooter,
    H3Pagination: Pagination
  }
})
export default class ReportPivotTable extends Vue implements H3.PivotTable.Table {
  @Prop({ default: () => [] }) refresh!: boolean;
  @Prop({ default: () => [] }) columns!: Array<H3.Report.FieldColumn>;
  @Prop({ default: () => [] }) rows!: Array<H3.Report.FieldColumn>;
  @Prop({ default: () => ({}) }) chartData!: H3.PivotTable.Data;
  // @Prop({ default: () => ({}) }) chartData!: H3.PivotTable.Data;
  @Prop({ default: () => [] }) metric!: Array<H3.Report.FieldColumn>;
  @Prop({ default: () => [] }) alias!: any;
  @Prop({ default: () => false }) isNo!: boolean;
  @Prop({ default: () => true }) allowDrag!: boolean;
  @Prop({ default: () => 0 }) height!: number;
  @Prop({ default: () => 0 }) total!: number;
  @Prop({ default: () => 0 }) width!: number;
  @Prop({ default: () => false }) fixedColHead!: boolean;
  @Prop({ default: () => 0 }) fixedColNumber!: number;
  @Prop({ default: () => false }) fixedRowHead!: boolean;
  @Prop({ default: 12 }) fontSize!: number;
  @Prop({ default: () => "" }) uid!: string;
  @Prop({ default: () => "" }) title!: string;
  @Prop({ default: () => {} }) listTextAlign!: H3.Report.ListTextAlign;
  @Prop({ default: () => "" }) fontColor!: string;
  @Prop({ default: () => false }) isTransparent!: boolean;
  @Prop({ default: false }) landscape!: boolean;
  @Prop({
    default: () => {
      return { size: 10, rowSize: 10 };
    }
  })
  pageSet!: H3.Report.PageSet;

  @Prop({ default: null }) global!: H3.Report.Global;
  @Prop({ default: null }) chart!: H3.Report.Chart;

  // 表格列宽等配置项
  @Prop({ default: () => [] }) columnsSetting!: Array<H3.PivotTable.columnSetting>;
  @Dashboard.Mutation(ReportMutation.SETTABLEEXPORTDATA) stateSetTableExportData!: Function;
  @Dashboard.Mutation(ReportMutation.SETACTIVECHART) setActiveChart!: Function;

  @Inject({ default: () => {} }) setTableExportData!: Function;

  prefixCls = "h3-pivot-table";
  isMobile = isMobile;
  bodyHeight: number = 0;
  bodyWScroll = {};
  summary: Array<number> = [];
  bodyRows: Array<any> = [];
  tableColumns: Array<any> = [];
  tableColumnsWidths: Array<number> = [];
  tableRows: Array<any> = [];
  headerRows: Array<any> = [];
  footerRows: Array<any> = [];
  fixedWidth: number = 0;
  tableWidth: number = 0;
  fullScreen: boolean = false;
  loaded = false;
  // 拖拽列宽的线
  dragLine: any;
  // 初始化拖拽时需要用的属性
  dragOptions: any = null;
  // 映射字段列宽
  mapColumnsWidth: { [key: string]: number } = {};
  // 内部数据，表格属性
  innerColumnsSetting: Array<H3.List.columnSetting> = [];
  // 平均宽度
  averageWidth: number = 0;
  // 图表宽度
  wrapWidth: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  // 展示数据 -
  data: H3.PivotTable.Data = this.chartData;
  count: number = 0;
  getTableColumns: Array<any> = [];
  @Watch("refresh")
  watchRefresh() {
    if (!this.loaded && this.refresh) {
      this.loaded = true;
      this.initTableData();
    }
  }
  @Watch("fixedColHead")
  watchFixedColHead(isFixed) {
    this.getBodyHeight(isFixed);
  }

  @Watch("chartData")
  watchData() {
    this.initTableData();
  }

  // @Watch("fontSize")
  // watchFontSize() {
  //   this.initTableData();
  // }
  /**
   * 监听序号变化
   */
  @Watch("isNo")
  watchIsNo() {
    this.initTableData();
  }

  get realFixedColNumber() {
    const num = this.fixedColNumber > this.columns.length ? this.columns.length : this.fixedColNumber;
    const res = this.isNo ? num + 1 : num;
    return res;
  }

  /**
   * 下传是否有序号
   */
  get showOrderNo() {
    return this.isNo;
  }
  get getTableClass() {
    return {
      [this.prefixCls]: true,
      [`${this.prefixCls}__theme`]: !!this.fontColor,
      [`${this.prefixCls}__transparent`]: this.isTransparent,
      [`${this.prefixCls}__${this.listTextAlign.alignment}`]: this.listTextAlign.alignment
    };
  }
  /**
   * 设置表格样式
   */
  get getTableStyle() {
    return {
      width: this.width ? `${this.width}px` : null,
      color: this.fontColor + " !important"
    };
  }

  // get getTableColumns() {
  //   return this.tableColumns && this.tableColumns.length
  //     ? this.bodyRows.map((row: Array<any>, index: number) =>
  //     this.tableColumns[index] && (this.tableColumns[index] instanceof Array)  && this.tableColumns[index].concat(row))
  //     : this.bodyRows;
  // }

  get getTableRows() {
    return this.rows.length && this.tableRows.length
      ? this.tableRows.map((row: Array<string>, index: number) =>
          this.headerRows[index].concat(row, this.footerRows[index])
        )
      : this.tableRows;
  }

  get getColumns() {
    return this.columns;
  }
  get getFixedLeftWidth() {
    return this.fixedWidth + this.columns.length + 2;
  }

  getExportTableRows(tableRows, headerRows, footerRows) {
    return this.rows.length && this.tableRows.length
      ? tableRows.map((row: Array<string>, index: number) =>
          headerRows[index].concat(row, this.footerRows[index])
        )
      : tableRows;
  }
  /**
   * 刷新透视表
   */
  refreshTable() {
    this.initTableData();
  }
  /**
   * 获取表体高度
   * @param isFixed
   */
  getBodyHeight(isFixed) {
    // 每个单元格的高度是36px + 1px 边距 底部边框是上下2px 38px  ; 8px是因为滚动条高度不一样    32为翻页组件的高度
    const bodyHeight =
      this.height || this.$el.clientHeight - 26 + (this.isMobile ? 8 : 0) - 32 - 37; // 12px的下padding
    if (isFixed) {
      this.bodyHeight = bodyHeight - this.tableRows.length * 37;
    } else {
      this.bodyHeight = bodyHeight;
    }
  }
  @Provide()
  setFixedWidth(width: number) {
    this.fixedWidth = width;
  }
  @Provide()
  setTableWidth(width: number) {
    if (this.$refs.pivotTable) {
      // 宽度超出滚动距离时用图表的宽度
      this.tableWidth = Math.max((this.$refs.pivotTable as any).clientWidth - 32, width);
    }
  }
  /**
   * 改变页数
   */

  changePage(data) {
    this.pageSize = data.pageSize;
    this.pageIndex = data.pageIndex;
    this.pageSet.size = data.pageSize;
    this.initTableData();
    this.$emit("changePage", data);
  }
  /**
   * 监听表体滚动
   */
  bodyScroll(bodyScroll: any) {
    this.bodyWScroll = bodyScroll;
  }
  /**
   * 监听表体滚动
   */
  fixedBodyScroll(bodyScroll: any) {
    (this.bodyWScroll as any).top = bodyScroll.top;
  }
  /**
   * 初始化位置,及可拖动范围
   * @param container 外层容器
   * @param option 拖拽列表传出的属性
   */
  initDragOptions(container, option) {
    const wrapRect = this.$el.getBoundingClientRect();
    const thRect = option.e.target.parentElement.getBoundingClientRect();
    const wp = 16; // 容器padding
    let min: number | null = null;
    let max: number | null = null;
    const wrapLeft = wrapRect.left + wp;
    const cellW = thRect.width;

    min = Math.round(thRect.left - wrapLeft + 30); // 格子最小30px
    min = min < 2 ? 2 : min; // 左边界预留2px
    max = wrapRect.width - wp * 2 - 5; // 右边边界预留5px
    const cur = option.e.pageX - wrapLeft; // 当前线的位置
    return {
      cur, // 当前位置
      min, // 可移动区域的最小值
      max, // 可移动区域的最大值
      cellW, // 格子宽度
      wrapLeft, // list容器距离屏幕边缘的距离，可与鼠标位置配合算出线的位置
      option // 表格属性
    };
  }
  /**
   * 拖拽列宽开始
   */
  startDrag(option: { e: Event; row: any }) {
    this.dragOptions = this.initDragOptions(this.$el, option);
    this.dragLine.style.left = this.dragOptions.cur + "px";
    this.dragLine.classList.add("dragged");
    document.body.addEventListener("mousemove", this.dragMousemove, false);
    document.body.addEventListener("mouseup", this.dragMouseup, false);
  }

  /**
   * 列宽拖拽中
   */
  dragMousemove(e) {
    const { min, max, wrapLeft } = this.dragOptions;
    const offset =
      e.pageX - wrapLeft < min ? min : e.pageX - wrapLeft > max ? max : e.pageX - wrapLeft;
    this.dragLine.style.left = offset + "px";
  }
  /**
   * 列宽拖拽结束
   */
  dragMouseup(e) {
    this.dragLine.classList.remove("dragged");
    const { cur, min, max, cellW, wrapLeft, option } = this.dragOptions;
    const offset =
      e.pageX - wrapLeft < min ? min : e.pageX - wrapLeft > max ? max : e.pageX - wrapLeft;
    // 没移动,兼容双击事件
    if (cur !== offset) {
      const tmpIndex = this.innerColumnsSetting.findIndex((item) => {
        return item.key === option.row.key;
      });
      this.mapColumnsWidth[option.row.key] = cellW - (cur - offset);
      if (tmpIndex > -1) {
        this.innerColumnsSetting[tmpIndex].width = cellW - (cur - offset);
      } else {
        this.innerColumnsSetting.push({
          width: cellW - (cur - offset),
          key: option.row.key
        });
      }
      this.$emit("change-columns", this.innerColumnsSetting);
      this.initTableData();
    }
    this.dragOptions = null;
    document.body.removeEventListener("mouseup", this.dragMouseup, false);
    document.body.removeEventListener("mousemove", this.dragMousemove, false);
  }

  /**
   * 初始化数据
   */
  clearData() {
    this.bodyHeight = 0;
    this.bodyWScroll = {};
    this.summary = [];
    this.bodyRows = [];
    this.tableColumns = [];
    this.tableColumnsWidths = [];
    this.tableRows = [];
    this.headerRows = [];
    this.footerRows = [];
  }

  /**
   * 截切数据
   */
  cutData(data, begin, end) {
    const res: any = [];
    let len = 0;
    let isOver = false;
    if (!data) {return [];}
    if ((data[0] || data[0] === "" || data[0] === 0) && !data[0].value) {
      return data.slice(begin, end);
    }
    for (let i = 0; i < data.length; i++) {
      if (!isOver) {
        const check = findValue(data[i], begin, end);
        check && res.push(data[i]);
      } else {
        return res;
      }
    }
    function findValue(element, begin, end) {
      let isFind = false;
      const resArray: any = [];
      if (len > end) {return false;}
      if (element.value && element.value[0] && element.value[0].key !== undefined) {
        // console.log('key', element.value[0])
        for (let i = 0; i < element.value.length; i++) {
          const findRes = findValue(element.value[i], begin, end);
          if (findRes) {
            //剪枝
            resArray.push(findRes);
          }
          isFind = isFind || findRes;
        }
        element.value = resArray;
      } else {
        if (element.value) {
          len += element.value.length;
          if (len > begin && len <= end) {
            const n = begin - (len - element.value.length);
            // element.value = element.value.slice(0, n > 0 ? element.value.length : (element.value.length - n));
            element.value = element.value.slice(n < 0 ? 0 : n);
            return element;
          }
          if (len > end) {
            element.value = element.value.slice(0, end - len).slice(begin - end);
            isOver = true;
            if (element.value.length == 0) {
              return false;
            }
            return element;
          }
        }

        element.value = [];
      }
      return isFind ? element : false;
    }
    return res;
  }

  /**
   * 处理序号
   */
  handleNo(data) {
    if (data && data[0] && data[0].value) {
      data = data.map((item, index) => {
        Object.assign(item, { number: index + 1 });
      });
    }
  }

  /**
   * 翻页数据截取
   */
  getPagesData(data: H3.PivotTable.Data, start, end) {
    const copyData = JSON.parse(JSON.stringify(data));
    this.handleNo(copyData.columns);
    const tdata = copyData.data ? copyData.data.slice(start, end) : null;
    const tcolumns = this.cutData(copyData.columns, start, end);
    return {
      data: tdata, // 汇总数据
      rows: data.rows, // 列数据
      columns: tcolumns, // 列数据
      summary: data.summary // 汇总数据
    };
  }
  /**
   * 处理导出全部数据,透视表由前端分页.导出需要处理全部数据,单独处理
   */
  getHandleExportData() {
    if (this.chartData.summary && !this.chartData.data)
      {this.chartData.data = [this.chartData.summary];}
    this.handleNo(this.chartData.columns);
    const exportData = handleTableData(
      this.getColumns,
      this.rows,
      this.metric,
      this.chartData,
      this.isNo,
      0
    );
    let bodyRows = JSON.parse(JSON.stringify(this.chartData.data));
    this.handleBodyFormatNumber(bodyRows, this.metric);
    return {
      exportData,
      exportBodyRows: bodyRows
    };
  }
  /**
   * 处理表格宽度
   */
  handleBodyFormatNumber(list, metrics) {
    const numberFormats: Array<H3.Report.NumberFormat> = [];
    metrics.forEach((metric: H3.Report.FieldColumn) => {
      numberFormats.push(metric.options.numberFormat as any);
    });
    if (numberFormats.length) {
      list.forEach((row: any) => {
        row.forEach((cell: any, index: number) => {
          if (
            toString.call(cell) === "[object Number]" &&
            numberFormats[index % numberFormats.length]
          ) {
            row[index] = convertNumber(cell, numberFormats[index % numberFormats.length]);
          }
        });
      });
    }
  }
  /**
   * 处理表格头部及底部数据
   */
  handleFoolterAndHeader() {
    if (this.rows && this.rows.length) {
      let headerRow: Array<any> = [];
      this.tableRows.forEach((row: Array<string>, index: number) => {
        if (index === 0) {
          this.footerRows.push([
            {
              label: this.$r_language.view.allSum,
              rowspan: this.rows.length || null,
              colspan: this.metric.length || null
            }
          ]);
        } else if (index === this.tableRows.length - 1) {
          this.footerRows.push([
            ...this.metric.map((metric: H3.Report.FieldColumn) => {
              return {
                label: metric.alias || metric.name,
                key: `汇总_${metric.uid}#${metric.alias || metric.name}`
              };
            })
          ]);
        } else {
          this.footerRows.push([]);
        }
        headerRow = [];
        if (index < this.rows.length) {
          headerRow.unshift({
            label: this.rows[index].alias || this.rows[index].name,
            colspan: this.getColumns.length || null
          });
        } else if (this.getColumns && this.getColumns.length) {
          headerRow.unshift(
            ...this.getColumns.map((item: H3.Report.FieldColumn) => {
              return {
                label: item.alias || item.name,
                key: `${item.uid}#${item.alias || item.name}`
              };
            })
          );
        } else {
          headerRow.unshift("");
        }
        this.headerRows.push(headerRow);
      });
    } else {
      this.headerRows = this.tableRows;
    }

    if (this.isNo && this.getColumns.length) {
      this.headerRows.forEach((rows: Array<any>) => {
        if (rows[0].key) {
          rows.unshift({
            label: this.$r_language.modules.OrderNumber.orderName,
            colspan: 1,
            key: "orderNumber"
          });
        } else {
          rows[0].colspan += 1;
        }
      });
    }
  }
  /**
   * 处理导出事项
   */
  handleExport() {
    let setTableData = this.setTableExportData || this.stateSetTableExportData;
    const { exportData, exportBodyRows } = this.getHandleExportData();
    let eData = {
      colWidth: this.tableColumnsWidths,
      headRows: this.getTableRows,
      headColumns: exportData.columns,
      bodyRows: exportBodyRows,
      summary: this.summary,
      alias: this.alias,
      title: this.title,
      columns: this.columns,
      metric: this.metric,
      rows: this.rows
    };

    setTableData &&
      setTableData({
        uid: this.uid,
        data: eData
      });
  }
  /**
   * 处理表格宽度
   */
  handleTableDataWidth() {
    if (this.tableColumns && this.tableColumns.length) {
      this.getTableColumns = this.bodyRows.map(
        (row: Array<any>, index: number) =>
          this.tableColumns[index] &&
          this.tableColumns[index] instanceof Array &&
          this.tableColumns[index].concat(row)
      );
    } else {
      this.getTableColumns = this.bodyRows;
    }

    let lastRow: any;
    if (this.tableColumns.length) {
      lastRow = this.tableColumns[this.tableColumns.length - 1].concat(this.summary);
    } else {
      lastRow = this.summary;
    }
    if (this.$refs.tableView) {
      this.wrapWidth = (this.$refs.tableView as HTMLDivElement).clientWidth;
    }
    this.averageWidth =
      (Math.round(this.wrapWidth / lastRow.length) < 50
        ? 50
        : Math.round(this.wrapWidth / lastRow.length)) || 80; // 平均宽度
    this.tableColumnsWidths = Array(lastRow.length).fill(this.averageWidth); // 最小值
    const count = 0;
    const tmpCols = this.getTableColumns.concat(lastRow);
    const fontScale = this.fontSize * 0.6;
    for (let i = 0; i < tmpCols.length; i++) {
      if (i >= 20) {break;}
      tmpCols[i] instanceof Array &&
        tmpCols[i].forEach((row: any, index: number) => {
          const realIndex = this.isNo ? index - 1 : index;
          let realName = row;
          let aliaName = row;
          let strLength = 0;
          if (row || row === "") {
            if (typeof row !== "object") {
              realName = row;
            } else {
              realName = row.label;
            }
            // 只自适应前二十条的宽度,和最后一条
            if (index < 20 ||  index === (tmpCols[i].length - 1)) {
              aliaName = this.getColumns[realIndex]
                ? getAliaValue(this.getColumns[realIndex].uid, realName, this.alias)
                : "";
  
              strLength = getStrLen(aliaName || realName);
            }
              
            this.tableColumnsWidths[index] = Math.max(
              strLength * fontScale + 28,
              this.tableColumnsWidths[index],
              80
            );
          
            // 移动端最后一列重新精准计算
            if (index === tmpCols[i].length - 1 && isMobile) {
              const lastWidth = getDomWidth(aliaName || realName, this.fontSize);
              this.tableColumnsWidths[index] = Math.max(this.tableColumnsWidths[index], lastWidth);
            }

            // 初始化最大宽度为300，即双击显示最多三百的宽度。
            this.tableColumnsWidths[index] =
              this.tableColumnsWidths[index] > 300 ? 300 : this.tableColumnsWidths[index];
          }
        });
    }

    if (this.isNo) {
      this.tableColumnsWidths[0] = 50;
    }
    this.handleColumnsWidth();
  }
 
  // handleComputeData() {
  //   // 计算字段的行汇总修改为null
  //   if (this.metric && this.metric.length) {
  //     this.metric.forEach((m, index) => {
  //       if (m.options.isAggregate) {
  //         let mIndex = index;
  //         this.data.summary.forEach((sum, i) => {
  //           if (i === mIndex) {
  //             this.data.summary[i] = null;
  //             mIndex = mIndex + this.metric.length; //先删除同个指标字段的所有汇总数据
  //           }
  //         });
  //       }
  //     });
  //   }
  //   // 计算字段的列汇总修改为null
  //   if (this.rows && this.rows.length) {
  //     if (this.data && this.data.data && this.data.data.length) {
  //       let cLength = this.data.data[0].length - this.data.data[0].length / this.metric.length + 1; //data中非汇总数据的长度
  //     this.metric.forEach((m, mIndex) => {
  //       //列汇总显示位置在右侧，减去非汇总数据
  //       let nullIndex = mIndex + cLength;
  //       if (m.options.isAggregate) {
  //         this.data.data.forEach((rowData, dIndex) => {
  //           rowData.forEach((d, index) => {
  //             if (index === nullIndex) {
  //               this.data.data[dIndex][index] = null;
  //             }
  //           });
  //         });
  //       }
  //     });
  //     }
      
  //   }
  // }

  /**
   * 初始化table
   */
  initTableData() {
    // this.handleComputeData();
    this.pageSize = this.pageSet.size;
    // this.pageSize = 1000;
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = this.pageSize * this.pageIndex;
    this.data = this.getPagesData(this.chartData, start, end);
    this.dragLine = this.$refs["resize-line"] as HTMLElement;
    // 没有行维度时
    if (this.data.summary && !this.data.data) {this.data.data = [this.data.summary];}
    if (!this.data.data) {return;}
    this.clearData();
    const data = handleTableData(
      this.getColumns,
      this.rows,
      this.metric,
      this.data,
      this.isNo,
      start
    );
    this.tableRows = data.rows;
    this.tableColumns = data.columns;
    this.bodyRows = JSON.parse(JSON.stringify(this.data.data));
    this.summary = JSON.parse(JSON.stringify(this.data.summary));
    let bodyAndSummary = [...this.bodyRows, this.summary];
    // 如果有数据格式,对数值格式化
    this.handleBodyFormatNumber(bodyAndSummary, this.metric);
    // 处理头部数据及底部数据
    this.handleFoolterAndHeader();
    // 处理每个单元格的宽度
    this.handleTableDataWidth();

    this.$nextTick(() => {
      this.getBodyHeight(this.fixedColHead);
      this.fullScreen = !this.fullScreen;
      this.$emit("refresh-end");
    });
    this.handleExport();
  }
  /**
   * 列宽自适应
   * @param option
   */
  columnAdaptSize(option: { e: Event; row: H3.List.TitleOptions }) {
    const tmpIndex = this.innerColumnsSetting.findIndex((item) => item.key === option.row.key);
    if (tmpIndex > -1) {
      this.innerColumnsSetting.splice(tmpIndex, 1);
      this.$emit("change-columns", this.innerColumnsSetting);
      this.initTableData();
    }
  }

  /**
   * 处理图表列宽
   */
  handleColumnsWidth() {
    this.innerColumnsSetting = this.innerColumnsSetting.filter(item => {
      return this.getTableRows[this.getTableRows.length - 1].find((row, index) => {
        if (item.key === row.key) {
          this.tableColumnsWidths[index] = item.width;
        }
        return item.key === row.key;
      });
    });

    // 生成冻结列时，不计算
    let realWidth = 0;
    if (this.tableColumnsWidths && this.tableColumnsWidths.length > 0) {
      realWidth = this.tableColumnsWidths.reduce((total, current) => {
        return total + current;
      }, 0);
    }
    // 宽度不够时，最后一个补齐
    if (realWidth < this.wrapWidth && this.tableColumnsWidths.length > 1) {
      this.tableColumnsWidths[this.tableColumnsWidths.length - 1] =
        this.tableColumnsWidths[this.tableColumnsWidths.length - 1] + (this.wrapWidth - realWidth);
    }
    this.mapColumnsWidth = {};
    this.innerColumnsSetting.forEach(item => {
      this.mapColumnsWidth[item.key] = item.width;
    });
  }

  /**
   * 设置数据格式
   * @param value
   * @param index
   */
  setNumberFormat(value: any, index: number) {
    if (index >= this.metric.length && value) {
      const metric = this.metric[index % this.metric.length];
      if (metric.options.numberFormat instanceof Object) {
        value = convertNumber(value, metric.options.numberFormat);
      }
    }
    return value;
  }
  /**
   * 获取一行的行维度的筛选条件
   */
  getRowsFilters(options: any): Array<H3.Report.FilterFieldColumn> {
    const filters: Array<H3.Report.FilterFieldColumn> = [];
    this.columns.forEach((field: H3.Report.FieldColumn, index: number) => {
      if (options.data.index >= (this.isNo ? index + 1 : index)) {
        filters.push({
          formula: StringType.Equal,
          field,
          text: [options.data.row[this.isNo ? index + 1 : index]]
        });
      }
    });
    return filters;
  }
  /**
   * 获取一列的行维度筛选条件
   */
  getColumnFilters(cellIndex: number): Array<H3.Report.FilterFieldColumn> {
    const filters: Array<H3.Report.FilterFieldColumn> = [];
    let len = 0;
    let rowCell: any;
    this.tableRows.forEach((row: Array<any>, index: number) => {
      len = this.columns.length || 1;
      rowCell = row.find((cell: any) => {
        if (cell instanceof Object) {
          len += cell.colspan;
        } else {
          len += 1;
        }
        return cellIndex < len;
      });
      if (rowCell && index < this.rows.length) {
        filters.push({
          formula: StringType.Equal,
          field: this.rows[index],
          text: rowCell instanceof Object ? [rowCell.label] : [rowCell]
        });
      }
    });
    return filters;
  }

  /**
   *  针对头部尾部的点击筛选
   * @param cellIndex
   * @param rowIndex
   * @param type
   */
  getColumnOtherFilters(
    cellIndex: number,
    rowIndex: number,
    type: string
  ): Array<H3.Report.FilterFieldColumn> {
    const cell = (this.tableRows[rowIndex] as Array<any>)
      .slice(0, cellIndex)
      .reduce((accumulator, currentValue) => {
        const num = currentValue instanceof Object ? currentValue.colspan : 1;
        return num + accumulator;
      }, 0);
    if (type === "header") {
      return this.getColumnFilters(cell + this.columns.length - 1).slice(0, rowIndex + 1);
    } else {
      return this.getColumnFilters(cell + this.columns.length - 1);
    }
  }

  /**
   *  单元格点击事件
   * @param options
   */
  @Provide()
  cellClick(options: any) {
    const cellIndex = options.data.index;
    const realIndex = this.isNo ? cellIndex - 1 : cellIndex;
    // if(options.type === "mobileHeader") return;
    let notCanNext = false;
    if (this.isNo && cellIndex === 0) {notCanNext = true;}
    if (options.data.data === this.$r_language.view.allSum && options.type === "header")
      {notCanNext = true;}
    const filters: Array<H3.Report.FilterFieldColumn> = [];
    switch (options.type) {
      case "header":
        filters.push(...this.getColumnOtherFilters(cellIndex, options.data.rowIndex, options.type));
        break;
      case "footer":
        if (this.rows.length && cellIndex <= this.summary.length - this.metric.length) {
          filters.push(
            ...this.getColumnOtherFilters(cellIndex, options.data.rowIndex, options.type)
          );
        }
        notCanNext = true;
        break;
      case "mobileHeader":
        break;
      default:
        if (!this.columns.length) {
          if (realIndex <= this.summary.length - this.metric.length) {
            filters.push(...this.getColumnFilters(realIndex));
          }
        } else if (!this.rows.length) {
          filters.push(...this.getRowsFilters(options));
        }
        // 点击行维度
        else if (realIndex < this.columns.length) {
          filters.push(...this.getRowsFilters(options));
        }
        // 点击汇总单元
        else if (realIndex >= options.data.row.length - this.metric.length) {
          filters.push(...this.getRowsFilters(options));
        } else {
          filters.push(...this.getRowsFilters(options));
          filters.push(...this.getColumnFilters(realIndex));
        }
        break;
    }
    const tableDetail = this.getTableDetail(options);
    this.$emit("click", {
      filters,
      params: {
        chartType: "table",
        tableDetail: tableDetail,
        notCanNext,
        textOverFlow: options.data.textOverFlow,
        chartClickposition: options.data.chartClickposition,
        metricFilter: this.getMetricFilter(options) || []
      }
    });
  }
  /**
   * 获取指标的值
   */
  getMetricFilter(options) {
    try {
      if (options.data.metricFilter && options.data.metricFilter.length)
        {return options.data.metricFilter;}
      const index = options.data.index + 1,
        length = this.columns.length,
        isNo = this.isNo,
        metric = this.metric,
        metricLength = metric.length;
      if (!metric.length) {return [];}
      let mIndex = index - length - (isNo ? 1 : 0);
      if (mIndex > 0) {
        // 获取当前点击的指标 取余
        mIndex = mIndex % metricLength ? (mIndex % metricLength) - 1 : metricLength - 1;
        return [
          {
            formula: "Equal",
            text: [options.data.data],
            field: metric[mIndex]
          }
        ];
      }
    } catch (error) {}
  }
  getTableDetail(options) {
    let res: Array<any> = [];
    res = [
      {
        value: options.data.data,
        label: ""
      }
    ];
    return res;
  }

  @Provide()
  cellDblClick(options: any) {
    this.$emit("dblClickChart", { options });
  }

  // updated(){
  //   console.log(Date.now()-this.time,1)
  // }

  get frzColor() {
    const themeMap = {
      theme8: "#303030",
      theme11: "#1D2935",
      theme9: "#122439",
      theme10: "#37475D",
      theme7: "#1D0F00",
      theme6: "#0B0F24",
      default: "",
      theme5: "",
      theme12: "",
    };
    let color = '';
    if (this.chart.styles.elementCoat && this.chart.styles.elementCoat.value) {
      color = this.isTransparent? this.chart.styles.elementCoat.value : '';
    } else {
      color = themeMap[this.global.styles.paintCoatTheme];
    }
    return color;
  }

  @Watch("frzColor", { immediate: true })
  initFreezeColor() {
    this.$nextTick(() => {
      const cellStyles = this.$el.querySelector(".h3-pivot-table__fixed") as HTMLElement;
      if (cellStyles) {
        let trbody = cellStyles.querySelectorAll('tr');
        trbody.length && trbody.forEach(item => {
          item.style.background = this.frzColor;
          let tdStyle = item.querySelectorAll('td');
          tdStyle.length && tdStyle.forEach(e => {
            e.style.background = this.frzColor;
          })
        }); 
      }
       
    });
  }
  mounted() {
    if (this.refresh) {
      this.loaded = true;
      this.initTableData();
    } else {
      this.loaded = false;
    }
    this.$nextTick(() => {
      this.$emit("refresh-end");
    });
  }
  created() {
    this.innerColumnsSetting = this.columnsSetting;
    this.initFreezeColor();
  }
}
</script>
<style lang="less">
@import "table";
</style>
