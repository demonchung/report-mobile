<template>
  <div :class="[`${prefixCls}`]" v-if="layerList.length > 1">
    <a-breadcrumb separator=" ">
      <a-breadcrumb-item v-for="(item, num) in layerList" :key="num">
        <span
          @click="toggleLayer(num)"
          :class="[
            num === index ? `${prefixCls}-active-item` : `${prefixCls}-item`,
            isDark ? 'whiteColor' : 'darkColor'
          ]"
        >
          {{ item.layerTitle || item.title }} {{ num === layerList.length - 1 ? "" : "/ " }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Breadcrumb } from "@h3/antd-vue";
@Component({
  name: "h3-report-footer-layer",
  components: {
    ABreadcrumb: Breadcrumb,
    ABreadcrumbItem: Breadcrumb.Item
  }
})
export default class footerLayer extends Vue {
  @Prop({ default: () => [] }) filters!: Array<H3.Report.FilterFieldColumn | {}>; // 外部传入的筛选条件
  @Prop({ default: null }) chart!: H3.Report.Chart;
  @Prop({ default: () => [] }) chartLayers!: Array<H3.Report.chartLayer>;
  @Prop({ default: 0 }) index!: number;
  @Prop({ default: false }) isDark!: boolean;

  prefixCls: string = "h3-report-footer-layer";
  //图层列表
  get layerList() {
    return this.getShowList(this.chartLayers, this.index,  this.chart.data.switchLayers);
  }
  //获取显示的列表
  getShowList(arr, index, isFree) {
    if (!arr || !arr.length) {return [];} //如果只有一项，说明没有下钻功能
    const l = isFree ? arr.length : index + 1;
    return arr.slice(0, l);
  }
  toggleLayer(num) {
    const nowLength = this.layerList.length;
    //点击当前不刷新
    if (num === this.index) {
      return;
    }
  
    if (this.chart.layerFilter) {
        if(num - this.index > 0) {
          for(let i = 0; i < num -this.index; i ++) {
            this.chart.layerFilter.push(null);
          }
            // this.chart.layerFilter = this.chart.layerFilter.splice(this.index, num);
        } else {
           this.chart.layerFilter = this.chart.layerFilter.splice(0, num);
        }
    }
    //设计页面和非设计页面的下钻不一样，需要与真实数据做区分
    this.$emit("click", {
      chart: this.chart,
      filters: [],
      beforeIndex: this.index,
      activeIndex: num,
      type: "clickFooter"
    });
  }
  mounted() {}
}
</script>
<style lang="less" scoped>
.h3-report-footer-layer {
  width: 100%;
  height: 34px;
  position: relative;
  padding: 0 0 16px 16px;
  font-size: 13px;
  z-index: 100;
  font-family: auto;
  &-item {
    font-size: 13px;
    cursor: pointer;
  }
  &-active-item {
    font-weight: bold;
    cursor: pointer;
  }
  &-item.whiteColor {
    color: #707481;
  }
  &-item.darkColor {
    color: #2b2121;
  }
  &-active-item.whiteColor {
    color: #ffffff;
  }
  &-active-item.darkColor {
    color: #000000;
  }
  &-item.darkColor:hover,
  &-active-item.darkColor:hover {
    color: #121933;
  }
  &-item.whiteColor:hover,
  &-active-item.whiteColor:hover {
    color: #ffffff;
  }
  /deep/ .ant-breadcrumb-separator {
    margin: 0;
  }
}
</style>
