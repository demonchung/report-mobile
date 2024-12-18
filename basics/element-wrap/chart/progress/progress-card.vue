<template>
  <a-tooltip
    placement="bottom"
    :arrowPointAtCenter="true"
    :autoAdjustOverflow="true"
    :getPopupContainer="getPopupContainer"
    :overlayClassName="isMobile? `${prefixCls}__tooltip-mobile`: `${prefixCls}__tooltip`"
  >
    <aside slot="title" :class="`${prefixCls}__tooltip-title`">
      <Alias
        :value="(label || label === 0) ? label : $r_language.view.progressCard.null"
        :field="fields && fields[0]"
      />
      <span><em :style="{ backgroundColor: bgColor }">
      </em>{{ $r_language.view.progressCard.title_precent }}{{ percent }}</span>
      <span><em :style="{ backgroundColor: bgColor }">
      </em>{{ $r_language.view.progressCard.title_value }} {{ showValue }}</span>
      <span><em :style="{ backgroundColor: bgColor }"></em>{{ $r_language.view.progressCard.title_target
      }}{{ showTargetValue }}</span>
    </aside>
    <div :class="prefixCls" @click="onClick($event)">
      <Alias
        :class="`${prefixCls}__label`"
        :style="{
          color: fontColor || defaultFontColor,
          width: labelWidth,
          textOverflow: labelWidth > 90 ? 'ellipsis' : 'unset'
        }"
        :value="(label || label === 0) ? label : $r_language.view.progressCard.null"
        :field="fields? fields[0]: ''"
      />
      <span :class="`${prefixCls}__progress`">
        <span
          ref="progressBar"
          :class="`${prefixCls}__bar`"
          :style="{
            backgroundColor: bgColor,
            width: showPercent
          }"
        ></span>
        <span ref="progressTag" :class="`${prefixCls}__tag`" :style="{ color: tagColor,fontSize: fontSize + 'px' }">{{ tag }}</span>
      </span>
      <span
        v-if="visible.displayTarget"
        :class="`${prefixCls}__target`"
        :title="showTargetValue"
        :style="{ color: fontColor || defaultFontColor, fontSize: fontSize + 'px' }"
      >{{ showTargetValue }}</span>
    </div>
  </a-tooltip>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { convertNumber } from "@h3/report-mobile/basics/utils/number";
import { Tooltip } from "@h3/antd-vue";
import Alias from "@h3/report-mobile/basics/components/alias"
import { isMobile } from "@h3/report-mobile/basics/utils/browser";
import {ThemeColorType } from "@h3/report-mobile/basics/enum/paint";

const ReportPro = namespace("report");
/**
 * 转为2位小数浮点型
 */
function convertFloat(value: number | string) {
  if (!value) {return 0;}
  if (/\-?\d+(\.\d+)?%/.test(`${value}`)) {return value;}
  if (isNaN(+value)) {return 0;}
  return +parseFloat(`${value}`).toFixed(2).toString().replace(".00", "");
}

@Component({
  name: "h3-progress-card",
  components: {
    ATooltip: Tooltip,
    Alias
  }
})
export default class H3ProgressCard extends Vue {
  // 指标
  @Prop({ default: "" }) label?: any;
  // 数值
  @Prop({ default: 0 }) value?: number;
  @Prop({ default: "4em" }) labelWidth?: string;
  // 目标值
  @Prop({ default: 0 }) target?: number;

  @Prop({ default: 12 }) fontSize?: number;

  @Prop({ default: "#647CFC" }) bgColor!: string;

  @Prop() numberFormat!: H3.Report.NumberFormat;
  @Prop() cardSizeChange!: boolean;

  @Prop() fontColor?: string;
  @Prop() defaultFontColor?: string;
  @Prop() fields?: any;
  @Prop({
    default: () => ({
      displayPercent: true,
      displayTarget: true,
      displayValue: true
    })
  })
  visible!: H3.Report.ProgressLabel;
  isMobile = isMobile;

  
  @ReportPro.State("global") global!: H3.Report.Global;

  prefixCls = "h3-progress-card";

  // showPercent = "0%";

  // showTargetValue: string | number = "";

  showValue: number | string = this.value || "";

  // 背景长度短于标签长度, 背景色太短影响查看标签文字
  isShortBar = false;

 get labelMaxWidth() {
  return this.labelWidth;
}

  get isDark() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }

//根据进度条颜色自适应标签文字颜色
get tagColor(){
  let barColor = this.bgColor;
  if(barColor.startsWith('#')){
    barColor = barColor.substring(1);
  }
  if(barColor.length === 3){
    barColor = [barColor[0],barColor[0],barColor[1],barColor[1],barColor[2],barColor[2]].join('');
  }
  const r = parseInt(barColor.slice(0,2), 16);
  const g = parseInt(barColor.slice(2,4), 16);
  const b = parseInt(barColor.slice(4,6), 16);
  const color = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#121933' : this.isShortBar && !this.isDark ? '#121933' : '#FFFFFF';
  return this.fontColor ? this.fontColor : color;
}

  get percent() {
    let res = "0%";
    if (!this.target) {
      res = "100%";
    } else if (!this.value) {
      res = "0%";
    } else if (!isNaN(this.value / this.target)) {
      res = (((this.value / this.target) * 100).toFixed(2) + "%").replace(".00", "");
    } else { 
      res = this.value === this.target ? "100%" : res; 
    }
    return res;
  }

  get showPercent() {
    return parseInt(this.percent) < 0 ? "0" : this.percent;
  }

  get tag() {
    const displayValue = this.visible.displayValue;
    const displayPercent = this.visible.displayPercent;
    this.showValue = this.HandlerConvert(this.value, this.numberFormat);
    if (displayValue && displayPercent) {
      return `${this.showValue} (${this.percent})`;
    } else {
      return displayValue ? `${this.showValue}` : displayPercent ? `${this.percent}` : "";
    }
  }

  get showTargetValue() {
    return this.HandlerConvert(this.target, this.numberFormat, true);
  }

  /**
   * 数值格式化处理
   * @param value 原始数值
   * @param numberFormat 数据格式化配置
   * @param isTarget 是否是目标值
   */
  HandlerConvert(value: any, numberFormat: H3.Report.NumberFormat, isTarget?: boolean) {
    let val = value;
    if (isTarget && typeof value !== "number") {
      val = this.value;
    }
    val = val || 0;

    return numberFormat && Object.values(numberFormat).some(Boolean)
      ? convertNumber(val, numberFormat)
      : convertFloat(val);
  }

  /**
   * 提示浮层挂载在父级节点上
   */
  getPopupContainer() {
    return this.$el.parentNode;
  }

  /**
   * 点击事件
   */
  onClick($event) {
    //记录点击的绝对位置
    const chartClickposition = {
      x: $event.pageX,
      y: $event.pageY
    };
    this.$emit("clickBar", { chartClickposition });
  }

  @Watch("cardSizeChange")
  handleTagColor() {
    const bar = this.$refs.progressBar as HTMLElement;
    const tag = this.$refs.progressTag as HTMLElement;
    if (bar && tag) {
      const barLength = bar.clientWidth;
      const tagLength = tag.clientWidth;
      if (barLength < tagLength + 5) {
        this.isShortBar = true;
      } else {
        this.isShortBar = false;
      }
    }
  }

  mounted() {
   
  }
}
</script>
<style lang="less">
.h3-progress-card {
  flex: 1;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  // margin-bottom: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  font-size: 12px;
  line-height: 20px;
  &:hover {
    background-color: rgba(100, 124, 252, 0.15);
  }
  &__label {
    flex: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__progress {
    position: relative;
    flex: 1;
    margin-left: 5px;
    margin-right: 5px;
    height: 22px;
    line-height: 22px;
    display: block;
    background: rgba(100, 124, 252, 0.15);
  }
  &__bar {
    display: block;
    height: 100%;
    max-width: 100%;
    transition: width 0.5s linear;
  }
  &__tag {
    position: absolute;
    left: 5px;
    top: 0;
    color: #fff;
  }
  &__target {
    flex: none;
    width: 60px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__tooltip-mobile {
    font-size: 12px;
    display: inline-block;
    left: 35% !important;
    max-width: 50%;
    .ant-tooltip-arrow {
      display: none !important;
    }
    .ant-tooltip-inner {
      background: rgb(83,107,155);
      padding: 6px 8px;
      border-radius: 4px;
      color: #ffffff;
    }
    &-title {
      span {
        display: block;
      }
      i {
        content: "";
        display: inline-block;
        margin-right: 5px;
        width: 8px;
        height: 8px;
        border-radius: 100%;
      }
    }
  }
  &__tooltip {
    font-size: 12px;
    .ant-tooltip-arrow {
      display: none !important;
    }
    &-title {
      span {
        display: block;
      }
      em {
        content: "";
        display: inline-block;
        margin-right: 5px;
        width: 8px;
        height: 8px;
        border-radius: 100%;
      }
    }
  }
}
</style>
