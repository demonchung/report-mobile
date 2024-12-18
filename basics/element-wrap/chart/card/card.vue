<template>
  <div :class="[prefixCls]">
    <!-- 0维1指标 -->
    
    <div 
      :class="[`${prefixCls}__metric`, isDark ? 'dark' : '', isSingleCardItem ? 'singleCard' : '']"
      v-if="options.cardMode.mode === 'card' || !options.dimension"
    >
      <h3-scroll
        ref="scroll"
        :buttonColor="'rgba(48,66,101,0.5)'"
        :isTransparent="options.isTransparent"
        :autoHideMode="isMobile ? false : true"
      >
        <card-item 
          v-for="(item,index) in dataList"
          :key="index"
          :option="item"
          :fontColor="options.fontColor"
          :showTitle="showTitle"
          :position="options.textAlign"
          :style="itemStyles"
          :fontSize="fontSize"
          :numberFormat="getNumberFormat(index)"
          @click.native="clickCard($event,index)"
          :field="options.dimension"
        >
        </card-item>
      </h3-scroll>
    </div>
    <!-- <div
      v-if="!options.dimension"
      ref="label_metic"
      :class="[`${prefixCls}__metric`]"
      @click="clickCard($event,0)"
    >
      <div
        :style="{
          color: options.fontColor,
          'font-size': `${fontSize * 0.3 < 12 ? 12 : fontSize * 0.3}px`
        }"
        v-show="showTitle"
      >
        {{ options.metric[0].alias || options.metric[0].name }}
      </div>
      <div
        :style="{
          color: `${options.fontColor} !important`,
          'font-weight': '700',
          'font-size': `${fontSize}px`,
          'line-height': '1'
        }"
        v-show="fontSize"
      >
        {{
          convertNumber(options.data[0][options.metric[0].uid], options.metric[0].options.numberFormat)
        }}
      </div>
    </div> -->
    <!-- 1维1指标 列表形式-->
    <div v-else :class="[`${prefixCls}__metric-list`]">
      <div v-show="showTotal" :class="[`${prefixCls}__item`, `${prefixCls}__header`]">
        <label :style="{ color: options.fontColor }">总计</label>
        <span :style="{ color: `${options.fontColor} !important` }">{{
          convertNumber(
            options.metric[0].options.percent === "PERCENT" ? 1 : chartData.total,
            options.metric[0].options.numberFormat
          )
        }}</span>
      </div>
      <h3-scroll
        ref="scroll"
        :buttonColor="'rgba(48,66,101,0.5)'"
        :isTransparent="options.isTransparent"
        :autoHideMode="isMobile ? false : true"
      >
        <div
          v-for="(item, i) in dataList"
          :class="[`${prefixCls}__item`]"
          :key="i"
          @click="clickCard($event,i,item)"
        >
          <Alias
            :style="{ color: options.fontColor }"
            :value="item.label"
            :field="options.dimension"
          />
          <span :style="{ color: options.fontColor }">{{
            convertNumber(
              options.metric[0].options.percent === "PERCENT"
                ? parseFloat(item.value / chartData.total)
                : item.value,
              options.metric[0].options.numberFormat
            )
          }}</span>
        </div>
      </h3-scroll>
    </div>
    <!-- 卡片指标 0维多指标及1维1指标-->
    
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import H3Scroll from "@h3/report-mobile/basics/components/scroll";
import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import getAliaValue from "@h3/report-mobile/basics/utils/alias";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";
import customSort from "@h3/report-mobile/basics/utils/customSort";
import cardItem from "./card-item.vue";
import { StringType, AddressType } from "@h3/report-mobile/basics/enum/filter-type";
import {ThemeColorType } from "@h3/report-mobile/basics/enum/paint";
import Alias from "@h3/report-mobile/basics/components/alias"

@Component({
  name: "h3-report-card",
  components: {
    H3Scroll,
    cardItem,
    Alias
  }
})
export default class ReportCard extends Vue {
  @Prop({ default: () => ({}) }) options!: H3.Chart.Card;
  @Prop({ default: () => true }) refresh!: boolean;
  // @Prop({ default: () => {} }) customSort!: any;
  @Prop({ default: () => ({}) }) chartData!: H3.Chart.ChartData;
  @Prop({ default: null }) global!: H3.Report.Global;
  @Prop({ default: false }) mobileMode!: boolean; // 是否是移动端布局

  prefixCls = "h3-report-card";
  isMobile = isMobile;
  summary: number = 0;
  innerSummary: any;
  showTotal: boolean = false;
  fontSize: number = 0;
  
  itemStyles: any= { height: '100%',width: '100%'};
  // 算出每行最大的列数
  maxColumns: number = 1;
  // cardMode: boolean = true;

 // 字体大小比例映射
  get sizeMapping() {
    if (isMobile || this.mobileMode) {
      return {
        small: { max: 46, ad: 5 },
        default: { max: 56, ad: 4 },
        large: { max: 62, ad: 3 }
      };
    } else {
      return {
        small: { max: 72, ad: 4 },
        default: { max: 120, ad: 3 },
        large: { max: 172, ad: 2 }
      };
    }
  }

  // 是否是单卡片
  get isSingleCardItem() {
    return this.dataList && this.dataList.length === 1;
  }
  
  @Watch("options.limit")
  watchLimit() {
    // 总计在编辑状态也需要响应
    this.showTotal = this.options.limit === 0 || this.options.limit === null;
    this.$nextTick(() => {
      if (this.$refs.scroll) {
        (this.$refs.scroll as any).setScrollBar();
      }
    });
  }

  get showTitle() {
    return this.options.showTitle === undefined ? true : this.options.showTitle;
  }

  get position() {
    return this.options.textAlign || "left";
  }

  get isDark() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }
  /**
   * 展示数据列表
   */
  get dataList() {
    const dim: any = this.options.dimension;
    const metrics: any = this.options.metric;
    return this.chartData.data.map((item, index) => {
      return {
        value: item[1],
        label: dim ? getAliaValue(
            dim.uid,
            item[0],
            this.options.dataAlias
          ): '',
        tip: dim ? (metrics[0].alias || metrics[0].name) : (metrics[index].alias || metrics[index].name)
      }
    })
  }
  /**
   * 获取指定指标的数字格式
   */
  getNumberFormat(index){
    if(this.options.dimension && this.options.metric && this.options.metric[0]) {
      return this.options.metric[0].options.numberFormat;
    } else if(this.options.metric && this.options.metric[index] && this.options.metric[index].options) {
      return this.options.metric[index].options.numberFormat;
    } else {
      return {
        comma: false, // 千分符
        percent: false, // 百分比
        fraction: 0 // 小数位数 默认0
      }
    }
  }
  /**
   * 点击
   */
  clickCard(event,index:number,item) {
    const dimension:any = this.options.dimension;
    const chartClickposition = {x:event.pageX,y:event.pageY}; 
    const metric:any =dimension &&this.options.metric ? this.options.metric[0] : (this.options.metric? this.options.metric[index] : null);
    let idx = index;
    // 当有自定义排序时,index要按排序后的顺序去查找
    if (dimension && this.options.customSort && this.options.customSort[dimension.uid]) {
      const cusList = this.options.customSort[dimension.uid];
      if (cusList && cusList.length) {
        idx = this.options.data.findIndex(d=> d[dimension.uid] === cusList[index]);
      }
    }
  
    if (!dimension) {
      const metricText = (this.options.data[index] || {})[metric.uid];
      return this.$emit("click", {
        filters: [],
        params: {
          chartClickposition,
          metricFilter: [
            {
              field: metric,
              formula: metric.specialType && metric.specialType === "address"
                ? AddressType.Belong
                : StringType.Equal,
              text:[metricText]
            }]
          }
        });
    }
    const cellData = this.options.data[idx || idx === 0 ? idx:  index];
    let dimensionRealValue = cellData[`${dimension.uid}_ADCODE`] || cellData[`${dimension.uid}`],
    dimensionValue = cellData[`${dimension.uid}`],
    metricValue = cellData[metric.uid];
    // console.log(dimension,'click progress bar',value);
    let formulaType = dimension.specialType && dimension.specialType === "address"? AddressType.Belong : StringType.Equal;
    if (dimensionRealValue) {
      dimensionRealValue = dimensionRealValue === "为空" || dimensionRealValue === " " ? "" : dimensionRealValue;
      formulaType = dimensionRealValue ? formulaType : AddressType.None;
      }
    const options = {
      filters: [
        {
          field: dimension,
          formula: formulaType,
          text: [dimensionRealValue],
          labels:dimensionValue === dimensionRealValue ? []: [dimensionValue],
        }
      ],
      params: {
        metricFilter:[
          {
            field: metric,
            formula: metric.specialType && metric.specialType === "address"
              ? AddressType.Belong
              : StringType.Equal,
            text:[metricValue]
          }
        ],
        chartClickposition,
      }
    };
    this.$emit("click", options);
  }
  /**
   * 根据宽高获取每个卡片的样式
   */
  
  /**
   * 初始化图表
   */
  initCard() {
    // 判断总计是否显示
    if (this.options.limit === 0 || this.options.limit === null) {
      this.showTotal = true;
    }
    if(this.options.cardMode && this.options.cardMode.mode === 'card' || !this.options.dimension) {
      this.initLayout(); 
    }
    // this.initSpanFont();
    this.$forceUpdate();
    this.$nextTick(() => {
      this.$emit("refresh-end");
    });
    if (this.$refs.scroll) {
        (this.$refs.scroll as any).setScrollBar();
      }
  }

  convertNumber(value: any, numberFormat: H3.Report.NumberFormat) {
    return numberFormat ? convertNumber(value, numberFormat) : value;
  }
  /**
   * 初始化布局
   */
  initLayout() {
    this.$nextTick(() => {
      const hasDim = !!this.options.dimension;
      const minHeight = hasDim ? 110 : 70;
      const metrics = this.options.metric;
      if (!metrics) {return;}
      const { clientWidth: w, clientHeight: h } = this.$el;
      // 4为多加的边距,兼容拖拽
      // w = w - 4;
      let mc = Math.floor(w / 150);
      mc = mc<1? 1: mc;
      let pw:number = 0;
      let ph:number = 0;
      let column: number = 0;
      const settingMax: number = this.options.cardSetting.maxColumns;
      this.maxColumns = mc > settingMax ? settingMax : mc;
      if (this.dataList && this.dataList.length) {
        column = this.maxColumns > this.dataList.length ? this.dataList.length : this.maxColumns;
         pw = Math.floor((100/column) * 1000) / 1000;
         ph = Math.floor(100 / Math.ceil(this.dataList.length / this.maxColumns)) 
      }
      this.itemStyles.width = pw + "%";
      this.itemStyles.height = ph + "%";
      const itemW = (w * pw) / 100;
      let itemH = (h * ph) / 100;
      itemH = itemH < minHeight ? minHeight : itemH;
      // 根据宽高算出字体大小
      let maxText: string = "";
     
      this.options.data.forEach((item, index) => {
        if(hasDim && (metrics as any)[0]) {
          const text = this.convertNumber(item[metrics[0].uid], metrics[0].options.numberFormat);
          maxText = text.length > maxText.length ? text : maxText;
        } else {
          (metrics as any).forEach((met, i) => {
            const text = this.convertNumber(item[met.uid], met.options.numberFormat);
            maxText = text.length > maxText.length ? text : maxText;
          });
        }
      });
      console.log(maxText,'maxText==')
      const sizeOption = this.sizeMapping[this.options.size || "default"];
      this.fontSize = Math.ceil(itemH / sizeOption.ad);
      const divEl = document.createElement("span");
      divEl.style.visibility = "hidden";
      divEl.style.fontSize = this.fontSize + "px";
      (this.$el as HTMLDivElement).appendChild(divEl);
      divEl.innerText = maxText;
      const dw = divEl.offsetWidth;
      const itemWidth = (isMobile || this.mobileMode) ? itemW * 0.8 : itemW * 0.7;
      if (dw - itemWidth > 0) {
        this.fontSize = this.fontSize * ((itemWidth) / dw);
      }
      this.fontSize = Math.max(12, Math.min(sizeOption.max, this.fontSize));
      (this.$el as HTMLDivElement).removeChild(divEl);
      // this.fontSize = this.options.fontSize || this.fontSize;
      // console.log(this.itemStyles,'触发布局变化',this.maxColumns,w)
    });

  }
  /**
   * 初始化字体
   */
  initSpanFont() {
    const metric = this.options.metric ? this.options.metric[0] : null;
    this.$nextTick(() => {
      const labelBox: any = this.$refs.label_metic;
      if (labelBox) {
        const text = this.convertNumber(
          this.options.data[0][metric.uid],
          metric.options.numberFormat
        );
        const wrap = labelBox.parentElement;
        const sw = labelBox.clientWidth;
        const sh = labelBox.clientHeight;
        const pw = wrap.clientWidth;
        const ph = wrap.clientHeight;
        const sizeOption = this.sizeMapping[this.options.size || "default"];
        this.fontSize = Math.ceil(ph / sizeOption.ad);
        const divEl = document.createElement("div");
        divEl.style.visibility = "hidden";
        divEl.style.fontSize = this.fontSize + "px";
        (this.$refs.label_metic as HTMLDivElement).appendChild(divEl);
        divEl.innerText = text;
        const dw = divEl.clientWidth;
        if (dw - 0.8 * pw > 0) {
          this.fontSize = this.fontSize * ((0.8 * pw) / dw);
        }
        this.fontSize = Math.min(sizeOption.max, this.fontSize);
        (this.$refs.label_metic as HTMLDivElement).removeChild(divEl);
        this.fontSize = this.options.fontSize || this.fontSize;
      }
    });
  }

  mounted() {
    this.initCard();
     this.$nextTick(()=> {
       this.$emit("refresh-end");
    });
  }
}
</script>
<style lang="less">
@import "~@h3/report-mobile/basics/styles/scroll.less";
.h3-report-card {
  height: 100%;
  width: 100%;
  // 不加这个边距拖拽不了宽度
  padding-right: 4px;
  &__metric {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0 0 12px 8px;
    flex-wrap: wrap;
    // .vertical-scrollbar-hide();
  //  .vertical-scrollbar()
    // justify-content: space-around;
    // align-items:;
    // align-content: space-around;
    .h3-scroll {
      width: 100%;
      height: 100%;
      &__content {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
      }
    }
  }
  &__metric.dark {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0 0 12px 8px;
    flex-wrap: wrap;
  //  overflow-y: scroll;
    &::-webkit-scrollbar { /*滚动条整体样式*/
      width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
    }
    &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
      background: rgba(255, 255, 255, 0.25);
      border-radius: 4px;
      display: none;
    &:hover {
      height: 10px;
      background: rgba(48, 66, 101, 0.65);
    }
    }
    &::-webkit-scrollbar-track { /*滚动条里面轨道*/
      border-radius: 4px;
      opacity: 0;
    }
    &:hover::-webkit-scrollbar-thumb {
      display: block;
    }
  }
  &__metric.singleCard {
    .h3-report-card-item-box {
      background: unset;
    }
  }

  // 列表样式
  &__metric-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .h3-scroll {
      flex: 1;
    }
  }
  // 汇总样式
  &__header {
    flex: 0 0 48px;
    label {
      color: #107fff;
    }
    span {
      color: #ffffff !important;
      background: rgba(16, 127, 255, 0.8) !important;
    }
  }
  // 列表每一个样式
  &__item {
    margin-left: 16px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    border-bottom: 1px solid #ebedf2;
    cursor: pointer;
    label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
      cursor: pointer;
    }
    span {
      margin-left: 10px;
      height: 24px;
      line-height: 24px;
      padding: 0 7px;
      color: #107fff;
      background: rgba(16, 127, 255, 0.1);
      border-radius: 12px;
    }
  }
}
</style>
