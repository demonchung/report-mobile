<!--明细表-->
<template>
  <div
    ref="list"
    :class="[prefixCls,`${prefixCls}__${listTextAlign.alignment}`]"
    :style="`color: ${fontColor};`"
  >
    <div :class="`${prefixCls}__loading`" v-if="false">
      <Loading/>
    </div>
    <div
      ref="listContent"
      :class="[`${prefixCls}__content`, isTransparent ? `${prefixCls}__transparent` : '']"
      :style="{ color: `${fontColor} !important` }"
    >
      <div
        :class="`${prefixCls}__static`"
        :style="staticStyle"
        v-if="freezeHead.column && freezeHead.columnNumber"
      >
        <H3Head
          :column="formatColumns"
          :sort-column="sortColumn"
          :allowDrag="allowDragColumn"
          :style="`color: ${fontColor}`"
          :fontSize="fontSize"
          @start-drag="startDrag($event)"
          @click-chart="clickChart"
          @change-columns="columnAdaptSize($event)"
        ></H3Head>
        <template v-if="!refresh">
          <H3Body
            :sort-column="sortColumn"
            :alias="alias"
            :columns="columns"
            :chart="chart"
            :header-column="formatColumns"
            :datasource="innerDatasource"
            :page-params="pageParams"
            :style="staticBodyStyle"
            :orderNumber="options"
            :fontSize="fontSize"
            :setFontColor="setFontColor"
            @drill-down="drillDown"
          ></H3Body>
        </template>
        <H3Footer 
          v-if="showFooter"
          id="listFooter"
          :sortColumn="sortColumn"
          :fontSize="fontSize"
          :summary="summaryData"
          :style="`color: ${fontColor}; top: ${footerTop}px`"
          :listTextAlign="listTextAlign"
          @click-chart="clickChart"
        >
        </H3Footer>
      </div>
      <div :class="`${prefixCls}__pane`" ref="listPane">
        <H3Head
          ref="listHead"
          :column="formatColumns"
          :sort-column="sortColumn"
          :style="staticHeadStyle"
          :allowDrag="allowDragColumn"
          :fontSize="fontSize"
          @change-columns="columnAdaptSize($event)"
          @start-drag="startDrag($event)"
          @click-chart="clickChart"
        ></H3Head>
        <Loading v-if="refresh"/>
        <template v-else>
          <H3Scroll
            ref="scroll"
            :class="`${prefixCls}__body-warp`"
            :style="scrollStyle"
            :button-color="'rgba(0,0,0,0.45)'"
            :isTransparent="isTransparent"
            :landscape="landscape"
            @scroll="scroll"
          >
            <H3Body
              :sort-column="sortColumn"
              :alias="alias"
              :columns="columns"
              :chart="chart"
              :fontSize="fontSize"
              :header-column="formatColumns"
              :datasource="innerDatasource"
              :page-params="pageParams"
              :style="`color: ${fontColor}`"
              :setFontColor="setFontColor"
              :orderNumber="options"
              @drill-down="drillDown"
            ></H3Body>
          </H3Scroll>
        </template>
        <H3Footer 
          v-if="showFooter"
          :sortColumn="sortColumn"
          :fontSize="fontSize"
          :summary="summaryData"
          :style="staticFooterStyle"
          :listTextAlign="listTextAlign"
          @click-chart="clickChart"
        >
        </H3Footer>
      </div>
      <div
        v-if="allowDrag"
        class="column-resize-line"
        ref="resize-line"
      ></div>
    </div>
    <div :class="[`${prefixCls}__tool`, isTransparent ? `${prefixCls}__transparent` : '']">
      <h3-pagination
        :showTotal="total => $r_language.view.pag_des.page_totla+`${total}`+ $r_language.view.pag_des.page_des"
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
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Pagination from "@h3/report-mobile/basics/components/pagination/pagination.vue";
import ReportListHead from "./components/head.vue";
import ReportListBody from "./components/body.vue";
import H3Scroll from "@h3/report-mobile/basics/components/scroll/scroll.vue";
import Loading from "@h3/report-mobile/basics/components/loading";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import { convertDate } from "@h3/report-mobile/basics/utils/date";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { getStrLen } from "@h3/report-mobile/basics/utils/string";
import { StringType, AddressType } from "@h3/report-mobile/basics/enum/filter-type";
import ReportListFooter from "./components/footer.vue";

const prefix = "h3-report";
const orderKey = "h3-report-list-order";
const minWidth = 80;
const ReportPro = namespace("report");
@Component({
  name: "h3-report-list",
  components: {
    H3Head: ReportListHead,
    H3Body: ReportListBody,
    H3Pagination: Pagination,
    H3Scroll,
    Loading,
    H3Footer: ReportListFooter
  }
})
export default class ReportList extends Vue {
  // 数据
  @Prop({ default: () => [] }) datasource!: Array<any>;
  // 别名系统
  @Prop({ default: () => {} }) alias!: any;
  // 表头
  @Prop({ default: () => [] }) columns!: Array<H3.Report.FieldColumn>;
  // 表格列宽等配置项
  @Prop({ default: () => [] }) columnsSetting!: Array<H3.List.columnSetting>;
  // 固定前几列
  @Prop({ default: 0 }) staticColumn!: number;
  // 是否显示序号
  @Prop({ default: () => {} }) orderNumber!: H3.Report.OrderNumber;
  // 是否刷新
  @Prop({ default: false }) refresh!: boolean;
  // 数据总条数
  @Prop({ default: 0 }) total!: number;
  // 标签字体大小
  @Prop({ default: 12 }) fontSize!: number;
  // 冻结列配置信息
  @Prop({ default: () => {} }) freezeHead!: H3.Report.FreezeHead;
  @Prop({ default: () => {} }) listTextAlign!: H3.Report.ListTextAlign;

  // 字体颜色
  @Prop({ default: () => "" }) fontColor!: string;
  @Prop({ default: { size : 10, rowSize: 10} }) pageSet!: H3.Report.PageSet;
  // 是否允许拖拽
  @Prop({ default: true }) allowDrag!: string;
  // 是否深色透明
  @Prop({ default: () => false }) isTransparent!: boolean;
  @Prop({ default: false }) landscape!: boolean;// 兼容手机端 是否横屏
  @Prop({ default: null }) global!: H3.Report.Global;
  @Prop({ default: null }) chart!: H3.Report.Chart;
  @Prop({ default: () => "" }) setFontColor!: string;
  // 底部汇总数据
  @Prop({ default: () => {} }) listSummary!: any;
  @ReportPro.State("dataSources") dataSources!: { [dataSourceId: string]: any };

  get options(): any{
    return this.$r_gt(this.orderNumber,this.$r_languageType)
  }
  
  prefixCls: string = `${prefix}-list`;

  pageParams: H3.List.pageOptions = {
    pageSize: 10, // 页数大小
    pageIndex: 1 // 第几页
  };

  // 排序渲染的列信息
  sortColumn: Array<H3.List.SortHeadOptions> = [];
  // 排序渲染的列信息 冻结部分
  staticSortColumn: Array<H3.List.SortHeadOptions> = [];

  // 表格滚动区域高度
  bodyHeight: number = 100;

  // 固定的头部的滚动距离 和表体的滚动距离
  headScrollLeft: number = 0;
  headScrollTop: number = 0;

  // 平均宽度
  averageWidth: number = 1;

  // 客户端判断
  isPc: boolean = true;

  // 内部数据源 处理数值格式和日期格式
  innerDatasource: Array<any> = [];
  // 拖拽列宽的线
  dragLine: any;
  // 初始化拖拽时需要用的属性
  dragOptions: any = null;
  // 汇总定位
  footerTop: number = 0;
  // 内部数据，表格属性
  innerColumnsSetting!: Array<H3.List.columnSetting>;
  // 映射字段列宽
  mapColumnsWidth: { [key: string]: number } = {};
  wrapWidth!: number;
  @Watch("freezeHead", { deep: true })
  onFreezeHeadChange(val) {
    if (val.column && val.columnNumber) {
      const staticNum = val.columnNumber;
      const targetColumns = this.visibleColumns.slice(0, staticNum);
      this.staticSortColumn = this.calculateHead(targetColumns, true);
    }
  }
  // 字体变化时,反应慢于刷新
  @Watch("fontSize")
  fontSizeChange(val) {
    this.initList();
  }
  @Watch("datasource", { deep: true })
  ondataChange(val) {
    this.innerDatasource = JSON.parse(JSON.stringify(val));
    this.initList();
  }
  get showFooter() {
    const uids = this.columns
      .filter(obj => obj.options && obj.options.aggregateType)
      .map(obj => obj.uid);
    return uids.length > 0;
  }

  get allowDragColumn() {
    return this.isPc && this.allowDrag;
  }
  //获取明细表底部汇总数据,并进行数值格式设置
  get summaryData() {
    const copyChart: any = this.chart;
    const data = copyChart.listSummary ? copyChart.listSummary[0] : {};
    const resultData = this.sortColumn.map((item) =>
      data[item.key] || data[item.key] === 0 ? this.getFormatData(item, data[item.key]) : null,
    );
    return resultData;
  }
  /**
   * @param field 字段信息
   * @param data 当前转换数据
   */
  getFormatData(field, data) {
    if (field && field.options && field.options.numberFormat) {
      const [int, dec] = data.toString().split('.');
      let value = data; 
      if (dec && dec.length > 6) {
        value = parseFloat((data).toString()).toFixed(6);
      }
      return this.formateNumber(value, field.options.numberFormat);
    } else {
      const [int, dec] = data.toString().split('.'); // 将数字拆分成整数部分和小数部分
      if (dec && dec.length > 6) { 
        // 如果有小数部分且长度超过6位
        const value = parseFloat(data.toString()).toFixed(6);
        return value;
      } else {
        return data;
      }
    }
  }
  /**
   * 固定的头部的滚动距离样式
   */
  get staticHeadStyle() {
    return {
      transform: `translateX(-${this.headScrollLeft}px)`,
      color: `${this.fontColor}`,
    };
  }
  /**
   * 固定的底部的滚动距离样式
   */
  get staticFooterStyle() {
    return {
      transform: `translateX(-${this.headScrollLeft}px)`
    };
  }

  /**
   * 固定的表格标题部分
   */
  get staticBodyStyle() {
    return {
      transform: `translateY(-${this.headScrollTop}px)`,
      color: `${this.fontColor}`,
    };
  }

  /**
   * 分层格式化表头渲染信息 目前业务最多只有两层表头 todo: 多层表头循环
   */
  get formatColumns() {
    return this.calcuateColumns();
  }

  /**
   * 分层格式化表头渲染信息 目前业务最多只有两层表头 todo: 多层表头循环
   */
  get staticFormatColumns() {
    let targetColumns = this.visibleColumns;
    if (this.freezeHead.column && this.freezeHead.columnNumber) {
      const staticNum = this.freezeHead.columnNumber;
      targetColumns = this.visibleColumns.slice(0, staticNum);
    }
    return this.calcuateColumns(targetColumns);
  }

  /**
   * 滑动面板的样式
   */
  get scrollStyle() {
    return {
      height: this.showFooter? `${this.bodyHeight - this.footerHeight}px` : `${this.bodyHeight}px`,
    };
  }

  /**
   * 表格汇总区域的高度
   */
  get footerHeight() {
    const container = document.createElement('th');
    container.style.fontSize = `${this.fontSize || 13}px`;
    container.style.position = 'absolute';
    container.style.opacity = '0';
    container.innerText = '汇总';
    document.body.appendChild(container);
    const height = container.getBoundingClientRect().height;
    document.body.removeChild(container);
    return height + 16;
  }
  /**
   * 筛选可显示的字段
   */
  get visibleColumns() {
    return this.columns.filter(i => !i.options.hidden);
  }

  /**
   * 计算固定列的宽度
   */
  get staticStyle() {
    let width = 0;
    if (this.staticSortColumn && this.staticSortColumn.length > 0) {
      width = this.staticSortColumn.reduce((total, current) => {
        return total + current.width;
      }, 0);
    }
    return {
      overflow: "hidden",
      width: `${width}px`
    };
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
  startDrag(option: { e: Event; row: H3.List.TitleOptions }) {
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
      this.initList();
    }
    this.dragOptions = null;
    document.body.removeEventListener("mouseup", this.dragMouseup, false);
    document.body.removeEventListener("mousemove", this.dragMousemove, false);
  }

  /**
   *  计算列表配置信息
   */
  countColumns(targetColumns: Array<any>) {
    let calculateCols = targetColumns.map((col) => {
      const width = this.virtualDom({ uid: col.uid, name: col.alias ? col.alias : col.name });
      return {
        key: col.uid,
        width: width,
        needAlias: col.needAlias,
        options: col.options,
        type: col.type
      };
    });
    if (this.options.checked) {
      const orderWidth = this.virtualDom({ uid: orderKey, name: "序号" }, true);
      calculateCols.unshift({
        key: orderKey,
        width: orderWidth,
        needAlias: false,
        options: {},
        type: "string"
      });
    }
    return calculateCols;
  }
  /**
   * 格式化表头配置信息
   * @param  targetColumns  列
   * @param  isAdapt  是否自适应
   */
  calculateHead(
    targetColumns: Array<any> = this.visibleColumns,
    isAdapt: boolean = false
  ): Array<H3.List.SortHeadOptions> {
    let calculateCols = this.countColumns(targetColumns);
    // 生成冻结列时，不计算
    if (!isAdapt) {
      let realWidth = 0;
      if (calculateCols && calculateCols.length > 0) {
        realWidth = calculateCols.reduce((total, current) => {
          return total + current.width;
        }, 0);
      }
      const lastCol = calculateCols[calculateCols.length - 1];
      // 宽度不够时，最后一个补齐
      if (realWidth < this.wrapWidth && calculateCols.length > 1) {
        calculateCols[calculateCols.length - 1].width =
          lastCol.width + (this.wrapWidth - realWidth);
      }
    }
    return calculateCols;
  }
  /**
   * 
   * @param ofield 计算字段中无关联关系，但是在表格显示时需要按照计算公式中所用到的字段的关联关系规则显示
   * 从计算字段中获取用到的字段的信息
   */
  getVirtualFields(ofield) {
    let resultField = ofield;
    if (this.chart && this.chart.formulas) {
      const formulaField = this.chart.formulas.find((item) => item.id === ofield.field);
      if (formulaField && formulaField.fields && formulaField.fields.length > 0) {
        //计算公式中用到的字段来自同一张表,所以只取第一个字段的源表信息
        const associatedField = formulaField.fields[0];
        if (this.dataSources.hasOwnProperty(this.chart.dataSourceId as any)) {
          const fieldList = this.dataSources[this.chart.dataSourceId as any].properties;
          //从数据源中获取字段的信息
          const targetField = fieldList.find(
            (item) =>
              item.field === associatedField.field &&
              item.tableId === associatedField.tableId &&
              item.mainField === associatedField.mainField,
          );
          if (targetField) {
            resultField = {
              ...ofield,
              relation: targetField.relation,
              tableId: targetField.tableId,
              tableName: targetField.tableName
            }
          }
        }
      }
    } 
    return resultField;
  }

  /**
   * 计算渲染的表头信息
   */
  calcuateColumns(targetColumns: Array<any> = this.visibleColumns) {
    const firstRow: Array<any> = [];
    const secondRow: Array<any> = [];
    const childLeafNum: number = 1;
    targetColumns.forEach((col, index) => {
      if (col && col.options && col.options.isComputeField) {
        col = this.getVirtualFields(col);
      }
      if (!col.relation) {
        firstRow.push({
          alias: col.alias,
          name: col.name,
          key: col.uid,
          allowDrag: index !== targetColumns.length - 1,
          isLeaf: !col.relation
        });
      } else {
        const childTitle = {
          alias: col.tableName,
          name: col.tableName,
          key: `${col.tableId}-${index}`,
          isLeaf: !col.relation,
          allowDrag: false,
          leafNum: 1
        };
        let targetCol = targetColumns[index - 1];
        if (targetCol && targetCol.options && targetCol.options.isComputeField) {
          targetCol = this.getVirtualFields(targetCol);
        }
        if (index && col.tableId === targetCol.tableId) {
          firstRow[firstRow.length - 1].leafNum += 1;
        } else {
          firstRow.push(childTitle);
        }

        secondRow.push({
          alias: col.alias,
          name: col.name,
          key: col.uid,
          isLeaf: col.relation,
          allowDrag: index !== targetColumns.length - 1
        });
      }
    });

    if (this.options.checked) {
      firstRow.unshift({
        alias: this.options.orderName,
        name: this.options.orderName,
        key: orderKey,
        isLeaf: true,
        allowDrag: true
      });
    }

    return [firstRow, secondRow];
  }

  /**
   * 虚拟dom计算宽度
   * @param option
   * @param isSerialNum 是否是序号列
   * @param isOriginal 是否求原始值
   */
  virtualDom(option: any, isSerialNum: boolean = false, isOriginal: boolean = false) {
    const dw = this.isPc ? 0 : 20;
    let width = minWidth + dw;
    let strLength;
    strLength = getStrLen(option.name);
    const fieldWidth = strLength * 7 + 30 + dw;
    if (isSerialNum) {
      strLength = getStrLen(this.options.orderName || "序号");
      width =
        !isOriginal && this.mapColumnsWidth[option.uid]
          ? this.mapColumnsWidth[option.uid]
          : Math.max(strLength * 7 + 24 + dw, minWidth, this.averageWidth);
    } else {
      this.innerDatasource.forEach(row => {
        if (Array.isArray(row[option.uid])) {
          // 数组取最大的那个数据做处理
          let maxSpan = "";
          let arr = row[option.uid] && row[option.uid].length > 0 ? row[option.uid] : [];
          arr.forEach(element => {
            if (element && element !== "" && getStrLen(element) > getStrLen(maxSpan)) {
              maxSpan = element;
            }
          });
          strLength = getStrLen(maxSpan);
        } else {
          strLength = getStrLen(row[option.uid]) || 0;
        }
        width = this.mapColumnsWidth[option.uid]
          ? this.mapColumnsWidth[option.uid]
          : Math.max(strLength * (this.fontSize *0.58) + 30 + dw, width, minWidth, this.averageWidth, fieldWidth);
      });
    }
    return width;
  }

  /**
   * 面板滚动
   * @param e 滚动event
   */
  scroll(e: any) {
    this.headScrollLeft = e.x;
    this.headScrollTop = e.y;
    this.$emit("bodyScroll", {
      left: e.x,
      top: e.y
    });
  }

  /**
   * 初始化列表样式
   */
  initList() {
    this.innerDatasource = JSON.parse(JSON.stringify(this.datasource));
    this.dragLine = this.$refs["resize-line"] as HTMLElement;
    this.handleColumns();
    this.handleData();
    const listpane = this.$refs.listPane as HTMLElement;
    const listHead = this.$refs.listHead as Vue;
    this.wrapWidth = listpane.clientWidth;
    if (listpane && listHead) {
      const realColNum = this.options.checked
        ? this.visibleColumns.length + 1
        : this.visibleColumns.length;
      // 平均宽度
      this.averageWidth = listpane.clientWidth / realColNum || minWidth;
      // 渲染后才能拿到最新高度!
      this.$nextTick(()=> {
        this.bodyHeight = listpane.clientHeight - listHead.$el.clientHeight;
        this.footerTop = listpane.clientHeight - this.footerHeight;
      })
      if (this.chart.data && this.chart.data.switchLayers) {
        this.bodyHeight = this.bodyHeight - 34; //预留切换图层功能位置
      }
    }
    this.sortColumn = this.calculateHead();

    if (this.freezeHead.column && this.freezeHead.columnNumber) {
      const staticNum = this.freezeHead.columnNumber;
      const targetColumns = this.visibleColumns.slice(0, staticNum);
      this.staticSortColumn = this.calculateHead(targetColumns, true);
    }
    if (this.$refs.scroll) {
      (this.$refs.scroll as any).setScrollBar();
    }
    
    this.$nextTick(() => {
      this.$emit("refresh-end");
    });
  }
  /**
   * 列宽自适应
   * @param option
   */
  columnAdaptSize(option: { e: Event; row: H3.List.TitleOptions }) {
    // let width: number = this.orderNumber.checked ? this.virtualDom(orderKey,true,true) : this.virtualDom(option.row.key,true,true);
    const tmpIndex = this.innerColumnsSetting.findIndex((item) => item.key === option.row.key);
    if (tmpIndex > -1) {
      this.innerColumnsSetting.splice(tmpIndex, 1);
      this.$emit("change-columns", this.innerColumnsSetting);
      this.initList();
    }
  }
  /**
   * 过滤不存在的字段
   */
  handleColumns() {
    this.innerColumnsSetting = this.innerColumnsSetting.filter(item => {
      return (
        item.key === orderKey ||
        this.visibleColumns.find(field => {
          return field.uid === item.key;
        })
      );
    });
    this.mapColumnsWidth = {};
    this.innerColumnsSetting.forEach(item => {
      this.mapColumnsWidth[item.key] = item.width;
    });
  }
  /**
   * 更新分页数据
   */
  changePage(params: H3.List.pageOptions) {
    this.pageParams = params;
    this.$emit("changePage", params);
  }

  /**
   * 下钻
   */
  drillDown(data) {
    console.log(data, "-=-=datra-=-=");
    // this.$emit("drill-down", data);
    this.$emit("click-chart", 
    {
      eventType:'drillDown',
      ...data
    });
  }

  clickChart(data) {
    console.log("header", data);
    this.$emit("click-chart", data);
  }
  /**
   * 格式化数值格式
   */
  formateNumber(
    value: number | string | Array<number | string>,
    NumberFormat: H3.Report.NumberFormat
  ) {
    if (!NumberFormat || (!value && value !== 0) || value === "") {return value;}
    let val = value;
    if (value instanceof Array) {
      // 如果是字表如果是数组则递归
      return value.map(d => {
        return d ? this.formateNumber(d, NumberFormat) : "";
      });
    } else {
      val = convertNumber(value, NumberFormat);
    }
    return val;
  }
  /**
   * 格式化日期
   */
  formatDate(value: string | Array<string>, dateFormat: H3.Report.DateFormat) {
    if (!dateFormat || !value || value === "") {return value;}

    let date = value;

    if (value instanceof Array) {
      // 如果是字符串数组 那么递归返回
      return value.map(d => {
        return d ? (this.formatDate(d, dateFormat) as string) : "";
      });
    } else {
      date = convertDate(value, dateFormat);
    }
    return date;
  }

  /**
   * 处理数据
   */
  handleData() {
    let rules = this.columns
      .filter(i => {
        return (
          (i.options.numberFormat && i.type === "number") ||
          (i.options.dateFormat && i.type === "date") ||
          i.needAlias
        );
      })
      .map(m => {
        return {
          uid: m.uid,
          numberFormat:
            m.type === "number" && m.options.numberFormat ? m.options.numberFormat : null,
          dateFormat: m.type === "date" && m.options.dateFormat ? m.options.dateFormat : null,
          needAlias: m.needAlias || false
        };
      });
    rules.forEach(rule => {
      this.innerDatasource.forEach((d, index) => {
        if (rule.dateFormat) {
          this.innerDatasource[index][rule.uid] = this.formatDate(
            this.datasource[index][rule.uid],
            rule.dateFormat
          );
        }
        if (rule.numberFormat) {
          this.innerDatasource[index][rule.uid] = this.formateNumber(
            this.datasource[index][rule.uid],
            rule.numberFormat
          );
        }
        if (rule.needAlias) {
          if (this.datasource[index][rule.uid] instanceof Array) {
            this.innerDatasource[index][rule.uid] = this.innerDatasource[index][rule.uid].map(m => {
              return getAliaValue(rule.uid, m, this.alias);
            });
          } else {
            this.innerDatasource[index][rule.uid] = getAliaValue(
              rule.uid,
              this.innerDatasource[index][rule.uid],
              this.alias
            );
          }
        }
        this.innerDatasource[index]["real_" + rule.uid] = this.datasource[index][rule.uid];
      });
    });
  }
  get frzColor() {
    const themeMap = {
      theme8: "#303030",
      theme11: "#1D2935",
      theme9: "#122439",
      theme10: "#37475D",
      theme7: "#1D0F00",
      theme6: "#0B0F24",
      default: "unset",
      theme5: "unset",
      theme12: "unset",
    };
    let frzColor = '';
  //  if (this.isTransparent) {
      if (this.chart.styles.elementCoat && this.chart.styles.elementCoat.value) {
      frzColor = this.isTransparent? this.chart.styles.elementCoat.value : '';
      } else {
        frzColor = themeMap[this.global.styles.paintCoatTheme];
      }
  //  }
    
    return frzColor;
  }

  @Watch("frzColor", { immediate: true })
  initFreezeColor() {
    this.$nextTick(() => {
      const cellStyles = this.$el.querySelector(".h3-report-list__static") as HTMLElement;
      if (cellStyles) {
        let head = cellStyles.querySelectorAll(".h3-report-list-table-head thead th");
        head.length &&
          head.forEach((item: any) => {
            item.style.background = this.frzColor;
          });
          let body = cellStyles.querySelectorAll(".h3-report-list-table-body tbody tr");
        body.length &&
          body.forEach((item: any) => {
            let th = item.querySelectorAll("th");
            th.length &&
              th.forEach((e) => {
                let key = "";
                let unset = true;
                const value = e && e.dataset && e.dataset.value? e.dataset.value : '';
                if (e && e.dataset && e.dataset.key) {
                  key = e.dataset.key;
                }
                if (this.chart && this.chart.conditionFormats) {
                  let condition = this.chart.conditionFormats.find(c => c.fieldUid === key);
                  if (condition && (condition.formatType === "colorScale" || condition.formatType === "colorGradient") && (value || value === 0)) {
                    unset = false;
                  }
                }
                e.style.background = unset ? this.frzColor : e.style.background;
              });
          });
      }
    });
  }

  created() {
    this.isPc = !isMobile;
    this.innerDatasource = JSON.parse(JSON.stringify(this.datasource));
    this.staticSortColumn = this.sortColumn;
    this.innerColumnsSetting = this.columnsSetting;
  }

  mounted() {
    this.initList();
    this.initFreezeColor();
  }
}
</script>

<style lang="less">
@import "./styles/index.less";
</style>
