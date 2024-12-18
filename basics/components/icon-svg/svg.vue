<template>
  <svg 
    :class="[
      `report-icon`,
      position ? `report-icon-${position}` : ''
    ]"
    aria-hidden="true" 
    :style="{width: `${w}px`, height: `${h}px`, fill: color}"
  >
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import "@h3/report-mobile/basics/assets/iconfont/iconfont.js";

@Component({
  name: "h3-report-svg"
})
export default class ReportSVG extends Vue {
  // 图标名称
  @Prop({ default: "" }) name!: string;
  @Prop({ default: "" }) color!: string;
  @Prop({ default: 16 }) w!: string;
  @Prop({ default: 16 }) h!: string;
  @Prop({ default: "" }) position!: string;
}
</script>
<style lang="less">
.report-icon {
  z-index: 1;
  &-right {
    transform:rotate(90deg);
  }
  &-left {
    transform:rotate(-90deg);
  }
  &-down {
    transform:rotate(180deg);
  }
  &-rotatey {
    transform: rotateY(180deg);   /* 水平镜像翻转 */
  }
  &-rotatex {
      transform: rotateX(180deg);   /* 垂直镜像翻转 */
  }
  &:focus {
    outline: unset;
  }
}
</style>
