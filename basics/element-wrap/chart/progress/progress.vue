<template>
  <div :class="prefixCls">
    <section :class="`${prefixCls}__body`">
      <div :class="[`${prefixCls}__content`]">
        <h3-scroll
          v-if="chartList.length"
          ref="scrollbar"
          :buttonColor="'rgba(48,66,101,0.75)'"
          :isTransparent="options.isTransparent"
        >
          <h3-progress-card
            v-for="(item, idx) in chartList"
            :key="idx"
            v-bind="item"
            :cardSizeChange="cardSizeChange"
            :labelWidth="labelWidth"
            :visible="options.progressLabel"
            :fontColor="options.fontColor"
            :fontSize="options.fontSize"
            :defaultFontColor="options.defaultFontColor"
            :bgColor="item.color"
            @clickBar="clickBar($event, item.dimensionVal, item)"
            :fields="options.dimension"
          ></h3-progress-card>
        </h3-scroll>
        <h3-scroll
          v-else-if="groupChartList.length"
          ref="scrollbar"
          :buttonColor="'rgba(48,66,101,0.75)'"
          :isTransparent="options.isTransparent"
        >
          <div :class="[isMultiGroup && !isMobile && `${prefixCls}__group`]">
            <div
              :class="[`${prefixCls}__block`, isSmall ? 'small' : '']"
              v-for="group in groupChartList"
              :key="group.name"
            >
              <Alias
                :class="`${prefixCls}__group_name`"
                :style="{ color: options.fontColor || options.defaultFontColor }"
                :value="(group.name || group.name === 0) ? group.name : $r_language.view.progressCard.null"
                :field="options.dimension.length && options.dimension[0]"
              />
              <h3-progress-card
                v-for="(item, idx) in group.chartList"
                :key="idx"
                v-bind="item"
                :cardSizeChange="cardSizeChange"
                :labelWidth="labelWidth"
                :visible="options.progressLabel"
                :fontColor="options.fontColor"
                :fontSize="options.fontSize"
                :defaultFontColor="options.defaultFontColor"
                :bgColor="item.color"
                @clickBar="clickBar($event, item.dimensionVal, item, idx)"
              ></h3-progress-card>
            </div>
          </div>
        </h3-scroll>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";
import H3ProgressCard from "./progress-card.vue";
import H3Scroll from "@h3/report-mobile/basics/components/scroll";

import { isMobile } from "@h3/report-mobile/basics/utils/browser";

import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { StringType, AddressType } from "@h3/report-mobile/basics/enum/filter-type";
import customSort from "@h3/report-mobile/basics/utils/customSort";
import { getStrLen, pxWidth } from "@h3/report-mobile/basics/utils/string";
import Alias from "@h3/report-mobile/basics/components/alias"
import { throttle } from 'lodash';

interface ProgressItem {
  label: string;
  target: number | null;
  value: number;
  numberFormat: H3.Report.NumberFormat;
  dimensionVal?: number | string;
}

@Component({
  name: "h3-report-progress",
  components: {
    H3ProgressCard,
    H3Scroll,
    Alias
  }
})
export default class ReportProgress extends Vue {
  @Prop({ default: () => ({}) }) options!: H3.Chart.ProgressBar;
  @Prop({ default: () => true }) refresh!: boolean;
  @Prop({ default: () => {} }) chartData!: H3.Chart.ChartData | Array<H3.Chart.ChartData>;


  prefixCls = "h3-report-progress";

  /**
   * 处理后的进度条列表数据
   */
  chartList: ProgressItem[] = [];
  // 容器大小是否变化
  cardSizeChange: any = false;

  /**
   * 一维多指标的进度图列表
   */
  groupChartList: Array<{
    name: string;
    color: string;
    chartList: ProgressItem[];
  }> = [];
  /**
   * 最大分组数量
   * !warn: 进度图分组个数进行了限制
   */
  maxGroupNum = 20;
  /**
   * 每组下最多进度条数
   * !warn: 进度图柱状个数进行了限制
   */
  maxBarNum = 20;
  labelWidth: string = "4em";
  /**
   * 是否是移动端
   */
  isMobile = isMobile;
  colors: any = [];
  isSmall: boolean = false;
  /**
   * 主题颜色列表
   */
  // get colors() {
  //   return this.options.colors || [];
  // }
  @Watch("options.colors", { deep: true })
  watchColor(val) {
    this.colors = val;
    this.initProgress();
  }
  /**
   * 计算图表顶部的分类标签
   */
  // get legends() {
  //   if (this.isMultiGroup) {
  //     return this.groupChartList.map(group => {
  //       return {
  //         name: group.name,
  //         color: group.color
  //       };
  //     });
  //   }
  //   return this.chartList.map((item, idx) => {
  //     return {
  //       name: item.label,
  //       color: this.colors[idx % 20]
  //     };
  //   });
  // }
  refreshProcess() {
    (this.$refs.scrollbar as any) && (this.$refs.scrollbar as any).setScrollBar();
  }

  /**
   * 是否为1维多指标分组
   */
  get isMultiGroup() {
    return (
      this.options.dimension &&
      this.options.dimension.length > 0 &&
      this.options.metric &&
      this.options.metric.length > 1
    );
  }
  getLabelWidth(list) {
    // 由于数字占宽比字母还大些, 所以 6改成7做个兼容,不去区分数字和字母 , 根据字体大小求一个宽度系数
    const fw =
      Math.max(...list.map(item => (item.label ? Math.ceil(getStrLen(item.label)) : Math.ceil(getStrLen('为空'))))) *
      Math.round(this.options.fontSize * 0.58);
    return (fw > 92 ? 92 : fw) + "px";
  }

  /**
   * 计算目标值
   */
  getTarget(target?: H3.Report.TargetValue) {
    let result;
    if (!target) {
      result = null;
    } else {
      if (target.valueType === "fixed" && target.constValue) {
        result = Number(target.constValue);
      }
    } 
    if (isNaN(result)) {
      result = null;
    }
    return result;
  }
  
  getCustomSort() {
    try {
      const sortData: any = [];
      const customSortKeyValue = this.options.customSort;
      const dimentionUid = this.options.dimension.length ? this.options.dimension[0].uid : "";
      if (!dimentionUid) {return this.options.data;}
      if (
        !customSortKeyValue ||
        !customSortKeyValue[dimentionUid] ||
        !customSortKeyValue[dimentionUid].length
      )
        {return this.options.data;}
      const copyData = JSON.parse(JSON.stringify(this.options.data));
      const mapValue = {};
      customSortKeyValue[dimentionUid] &&
        customSortKeyValue[dimentionUid].length &&
        customSortKeyValue[dimentionUid].forEach(name => {
          mapValue[name] = [];
        });
      // 修复自定义排序问题 !! 填坑
      const mData = copyData.map((d) => {
        if (
          this.options.dimension &&
          (d[dimentionUid] || d[dimentionUid] === "" || d[dimentionUid] === 0)
        ) {
          return Object.assign({}, d, {
            [dimentionUid]:
            d[dimentionUid] || d[dimentionUid] === 0 ? d[dimentionUid] : this.$r_language.view.progressCard.null,
              // getAliaValue(dimentionUid, d[dimentionUid], this.options.dataAlias) ||
              // this.$r_language.view.progressCard.null,
            [dimentionUid + "_realValue"]: d[dimentionUid + "_ADCODE"]
              ? d[dimentionUid + "_ADCODE"]
              : d[dimentionUid]
          });
        }
        return d;
      });
      mData.forEach(d => {
        const name = d[dimentionUid] || d[dimentionUid] === 0 ? d[dimentionUid] : this.$r_language.view.progressCard.null;
        sortData.push(name);
        if (mapValue[name]) {
          mapValue[name].push(d);
        }
      });
      //二维自定义排序
      const sortKeyValue = {};
      const dimensionUid = this.options.dimension[0].uid;
      sortKeyValue[dimensionUid] = sortData;
      const sortRes = customSort(sortKeyValue, true, customSortKeyValue); //得到新的排序顺序的数组
      let deleteNum = 0;
      mData.forEach((d, index) => {
        if (sortData.indexOf(d[dimensionUid]) > -1) {
          copyData.splice(index - deleteNum, 1);
          deleteNum++;
        }
      });
      Object.values(sortRes[dimentionUid])
        .reverse()
        .forEach(name => {
          if (name !== "" && mapValue[name as string]) {
            const valueArr = mapValue[name as string];
            valueArr &&
              valueArr.length &&
              valueArr.forEach(val => {
                copyData.unshift(val);
              });
          }
        });
      return copyData;
    } catch (error) {
      return this.options.data;
    }
  }
  // 处理没汇总的数据
  handleRepeatData(list, dimension, metrics) {
    const mapping = {};
    list.slice(0, this.maxBarNum).forEach((values, idx) => {
      // 字符串兼容排序问题
      const name = "tmp_" + (values[dimension.uid] || "为空");
      if (!mapping[name]) {
        mapping[name] = values;
      } else {
        metrics.forEach(item => {
          mapping[name][item.uid] += mapping[name][item.uid];
        });
      }
    });
    return Object.values(mapping);
  }
  /**
   * 初始化进度图
   */
  initProgress() {
    this.chartList = [];
    this.maxBarNum = 20;
    /**
     * 数据为空，返回空数组
     */
    if (!this.options.data.length) {
      return [];
    }
    let data = this.options.data;
    const dimensionObj: any = this.options.dimension ? this.options.dimension[0] || {} : {};
    if (dimensionObj.options && dimensionObj.options.isCustomSort) {data = this.getCustomSort();}
    let metricLen = 0;
    if (this.options.metric && Array.isArray(this.options.metric)) {
      metricLen = this.options.metric.length;
    }
    // 指标为空，则返回空数组
    if (!metricLen) {
      return [];
    }

    let dimenLen = 0;
    if (this.options.dimension && Array.isArray(this.options.dimension)) {
      dimenLen = this.options.dimension.length;
    }

    // 1维1指标时，维度值作为标签
    if (dimenLen === 1 && metricLen === 1) {
      if (this.options.limit) {
        this.maxBarNum = this.options.limit; // todo: 一维一指标时，限制进度图数据量
      }
      const dimension = this.options.dimension[0];
      const metric = this.options.metric[0];
      let target = this.getTarget(metric.options.targetValue);
      let list: any = [];
      data = this.handleRepeatData(data.slice(0, this.maxBarNum), dimension, this.options.metric);
      list = data.map((values, idx) => {
        const label = getAliaValue(dimension.uid, values[dimension.uid], this.options.dataAlias);
        const value = values[metric.uid];
        if (
          metric.options.targetValue &&
          metric.options.targetValue.valueType === "dynamic" &&
          metric.options.targetValue.field
        ) {
          target = values[metric.options.targetValue.field.uid];
        }
        return {
          label,
          dimensionVal:
            dimension.specialType && dimension.specialType === "address"
              ? values[`${dimension.uid}_ADCODE`]
              : values[dimension.uid],
          value: value,
          target: target,
          color: this.colors[idx % this.colors.length],
          numberFormat: metric.options.numberFormat
        };
      });
      if (this.options.sortPercent) {
        list = this.sortPercent(list, this.options.sortPercent);
      }
      this.labelWidth = this.getLabelWidth(list);
      this.chartList = list as any;
    }
    // 0维N指标时，指标名作为标签
    else if (dimenLen === 0 && metricLen) {
      const datas = this.options.data[0];
      let list = this.options.metric.slice(0, this.maxBarNum).map((met, idx) => {
        const label = met.alias || met.name;
        const value = datas[met.uid];
        let target = this.getTarget(met.options.targetValue);
        if (
          met.options.targetValue &&
          met.options.targetValue.valueType === "dynamic" &&
          met.options.targetValue.field
        ) {
          target = datas[met.options.targetValue.field.uid];
        }
        return {
          label,
          value: value,
          target: target,
          color: this.colors[idx % this.colors.length],
          numberFormat: met.options.numberFormat
        };
      });
      if (this.options.sortPercent) {
        list = this.sortPercent(list, this.options.sortPercent);
      }
      this.labelWidth = this.getLabelWidth(list);
      this.chartList = list as any;
    }
    // 1维N指标时，维度值作为分组依据，指标名作为标签
    else { 
      if (dimenLen === 1 && metricLen > 1) {
      /**
       * TODO: 这里的1维多指标后续再补充
       */
      this.groupChartList = [];
      const dimension = this.options.dimension[0];
      data = this.handleRepeatData(data.slice(0, this.maxBarNum), dimension, this.options.metric);
      data.forEach((group, idx) => {
        const tmpData: any = {
          name: getAliaValue(dimension.uid, group[dimension.uid], this.options.dataAlias),
          color: this.colors[idx % this.colors.length],
          chartList: this.options.metric.slice(0, this.maxBarNum).map((item, num) => {
            let target;
            if (
              item.options.targetValue &&
              item.options.targetValue.valueType === "dynamic" &&
              item.options.targetValue.field
            ) {
              target = group[item.options.targetValue.field.uid];
            } else {
              target = this.getTarget(item.options.targetValue);
            }

            const value = group[item.uid];

            return {
              label: item.alias || item.name,
              dimensionVal:
                dimension.specialType && dimension.specialType === "address"
                  ? group[`${dimension.uid}_ADCODE`]
                  : group[dimension.uid],
              value: value,
              target: target,
              color: this.colors[num % this.colors.length],
              numberFormat: item.options.numberFormat
            };
          })
        };
        if (this.options.sortPercent) {
          tmpData.chartList = this.sortPercent(tmpData.chartList, this.options.sortPercent);
        }
        this.groupChartList.push(tmpData);
      });

      if (this.groupChartList.length) {
        this.labelWidth = this.getLabelWidth(this.groupChartList[0].chartList);
      }
      } 
    }
    this.$nextTick(() => {
      this.isSmall = this.$el.clientWidth < 468;
    });
  }

  /**
   * 进度值排序
   */
  sortPercent(list, type) {
    if (list && list.length) {
      if (type == 2) {
        return list.sort((a, b) => {
          let f = a.target ? a.target : a.value;
          let s = b.target ? b.target : b.value;
          f = f ? a.value / f : 1;
          s = s ? b.value / s : 1;
          // let f =  (b.value/(b.target || b.target == 0? b.target : b.value));
          // let s =  (a.value/(a.target || a.target == 0? a.target : a.value));
          // f = f || f ==0 ? f: 1;
          // s = s || s ==0 ? s: 1;
          return s - f;
        });
      } else {
        return list.sort((a, b) => {
          let f = a.target ? a.target : a.value;
          let s = b.target ? b.target : b.value;
          f = f ? a.value / f : 1;
          s = s ? b.value / s : 1;
          // let f =  (b.value/(b.target || b.target == 0? b.target : b.value));
          // let s =  (a.value/(a.target || a.target == 0? a.target : a.value));
          // f = f || f ==0 ? f: 1;
          // s = s || s ==0 ? s: 1;
          return f - s;
        });
      }
    } else {
      return [];
    }
  }
  /**
   * 点击进度条
   */
  clickBar(eventData, value: number | string, item: any, idx = 0) {
    const dimension = this.options.dimension[0];
    const metricValue = item.value;
    let filters: any = [];
    if (dimension) {
      filters = [
        {
          field: dimension,
          formula:
            dimension.specialType && dimension.specialType === "address"
              ? AddressType.Belong
              : StringType.Equal,
          text: [value],
          labels: item.label !== value ? [item.label] : []
        }
      ];
    }
    const metric = this.options.metric || [];
    const metricFilter = [
      {
        field: metric[idx],
        formula: "Equal",
        text: [metricValue]
      }
    ];
    const options = {
      filters: filters,
      params: { ...eventData, metricFilter }
    };
    this.$emit("click", options);
  }
  
  handleWrapResize() {
    // 创建 Resize Observer 实例
    // 使用throttle函数进行函数节流，避免频繁触发
    const resizeObserver = new ResizeObserver(throttle(entries => {
      for (const entry of entries) {
        this.cardSizeChange = !this.cardSizeChange;
        break;
      }
    }, 500));

    // 要监听宽度变化的 DOM 元素
    const targetElement = this.$el;
    if (targetElement) {
      // 开始观察目标元素的宽度变化
      resizeObserver.observe(targetElement);
    }
  }

  mounted() {
    this.colors = this.options.colors;
    this.initProgress();
    this.$nextTick(() => {
      this.$emit("refresh-end");
    });
    this.handleWrapResize();
  }
}
</script>
<style lang="less" scoped>
.h3-report-progress {
  display: flex;
  height: 100%;
  flex-direction: column;
  color: #707481;
  &__bar {
    flex: none;
    padding: 0 16px;
    margin: 4px 0 0;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    i {
      display: inline-block;
      vertical-align: middle;
      width: 8px;
      height: 8px;
      border-radius: 4px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      margin-left: 4px;
      margin-right: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__body {
    flex: 1;
    padding: 20px 2px 24px 16px;
    height: calc(100% - 18px);
    transition: all 0.35s linear;
  }
  &__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .h3-scroll {
      flex: 1;
    }
    // &.grid {
    //   display: flex;
    //   flex-wrap: wrap;
    //   .h3-progress-card {
    //     padding: 2%;
    //     flex-basis: 50%;
    //   }
    // }
  }
  &__group {
    display: flex;
    flex-wrap: wrap;
  }
  &__block {
    flex: 50%;
  }
  &__block.small {
    flex: 100%;
  }
  &__group_name {
    display: inline-block;
    margin-bottom: 8px;
    margin-top: 8px;
    font-size: 13px;
    font-weight: 500;
  }
}
</style>
