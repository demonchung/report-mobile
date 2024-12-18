<template>
  <h3-scroll
    :class="`${this.prefixCls}__body-warp`"
    :style=" `height: ${height}px`"
    :buttonColor="'rgba(0,0,0,0.45)'"
    @scroll="scroll"
  >
    <div
      :class="`${prefixCls}__mask`"
      :style="`height: ${data.length * 40}px`"
    ></div>
    <table-warp
      :columnsWidth="columnsWidth"
      :columnsIds="columnsIds"
      :columns="columns"
      :rowIndex="rowIndex"
      :innerData="innerData"
      :index="index"
    ></table-warp>
  </h3-scroll>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CreateElement, VNode } from 'vue';
import H3Scroll from '../../../../components/scroll';
import TableWarp from './body.vue';

@Component({
  name: 'h3-table-scroll',
  components: {
    TableWarp,
    H3Scroll
  }
})
export default class ReportTableScroll extends Vue implements H3.TableBody {
  @Prop({ default: () => ([]) }) columnsWidth!: Array<number>;
  @Prop({ default: () => ([]) }) columnsIds!: Array<string>;
  @Prop({ default: () => ([]) }) columns!: Array<H3.TableColumns>;
  @Prop({ default: () => ([]) }) data!: Array<any>;
  @Prop({ default: () => 'h3-table' }) prefixCls!: string;
  @Prop({ default: () => 0 }) height!: number;
  y = 0;
  index = 0;
  rowIndex = 0;
  innerData = this.data.slice(0, 100);

  scroll(e: any) {
    const index = Math.floor(((e.y + this.$el.clientHeight) / 40 / 50));
    if (index !== this.index) {
      this.index = index;
      const pre = (index - 1) > 0 ? (index - 1) : 0;
      const next = pre + 2;
      this.innerData = this.data.slice(pre * 50, next * 50);
      this.rowIndex = pre * 50;
    }
    this.$emit('bodyScroll', {
      left: e.x,
      top: e.y
    });
  }
}
</script>
<style lang="less">
</style>
