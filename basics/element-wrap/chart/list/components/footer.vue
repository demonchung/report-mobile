<template>
  <table
    border="0"
    cellspacing="0"
    cellpadding="0"
    :class="prefixCls"
    :style="`width: ${tableWidth};fontSize: ${fontSize}px`"
  >
    <colgroup>
      <col
        v-for="h in sortColumn"
        :key="h.key"
        :style="`width: ${h.width}px`"
      />
    </colgroup>
    <tfoot>
      <tr>
        <template v-if="summary.length > 0">
          <th
            v-for="(data, index) in summary"
            :title="data"
            :key="index"
            @click="clickChart($event,data)"
          >
            <span 
              :style="cellStyle(data, index)"
              style="display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;word-break: break-all;width: 100%; ">
              {{ getAggType(data, index) }}&nbsp;&nbsp;
              {{ index === 0 ? (showTitle ? '汇总': (showData(data, index) ? data : '-')): (showData(data, index) ? data : '-') }}
            </span> 
          </th>
        </template>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import { namespace } from "vuex-class";

const prefix = "h3-report";
@Component({
  name: "h3-report-list-table-footer",
  components: {}
})
export default class ReportListFooter extends Vue {

  @Prop({ default: () => [] }) sortColumn!: Array<any>;
  // 底部汇总数据
  @Prop({ default: () => [] }) summary!: Array<any>;
  // 标签字体大小
  @Prop({ default: 12 }) fontSize!: number;
  
  @Prop({ default: () => {} }) listTextAlign!: H3.Report.ListTextAlign;

  prefixCls: string = `${prefix}-list-table-footer`;

  cellStyle(data, index) {
    let textAlign = ''
    textAlign = index === 0 && this.showTitle ? 'left': 'right';
    return {
      textAlign: this.listTextAlign.alignment === "default"? textAlign : this.listTextAlign.alignment,
    }
  }
  showData(data, index) {
    if (this.sortColumn[index] && this.sortColumn[index].options && this.sortColumn[index].options.aggregateType && (data || data === 0)) {
      return true;
    } else {
      return false;
    }
  }
  getAggType(data, index) {
    const showType =
      index === 0 ? !this.showTitle && this.showData(data, index) : this.showData(data, index);
    let resValue = "";
    const typeMap = {
      SUM: "总和值：",
      MAX: "最大值：",
      MIN: "最小值：",
      AVG: "平均值：",
      COUNT: "计数：",
      COUNTDISTINCT: "计数(去重)：",
    };
    if (this.sortColumn && this.sortColumn[index] && this.sortColumn[index].options && this.sortColumn[index].options.aggregateType) {
      resValue = typeMap[this.sortColumn[index].options.aggregateType];
    }
    return showType ? resValue : "";
  }

  get tableWidth(): string {
    return this.sortColumn.length > 0
      ? this.sortColumn.reduce((current, next) => {
          const currentWidth = current.width || current;
          return currentWidth + next.width;
        }) + "px"
      : "100%";
  }
/**
 * 是否显示汇总
 */
  get showTitle() {
    if (this.sortColumn && this.sortColumn.length > 0) {
      return !this.sortColumn[0].options.aggregateType;
    }
  }

  //点击事件
  clickChart($event, c) {
    if (!$event) {return;}
    const innerText = $event.target.innerText;
    const textOverFlow = $event.target.scrollWidth > $event.target.clientWidth;
    const tableDetail = [{
      label:'',
      value: innerText
    }]
    this.$emit('click-chart',{
      params:{
        tableDetail: tableDetail,
        chartType: 'list',
        clickPosition:'footer',
        textOverFlow: textOverFlow,
      }
    })
  }

}
</script>

<style lang="less" scoped>
@import "../styles/index.less";
</style>
