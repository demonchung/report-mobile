<template>
  <div :class="prefixCls">
    <a-input :class="[`${prefixCls}__page`]"></a-input>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  Input,
} from '@h3/antd-vue';
@Component({
  name: 'h3-report-table-footer',
  components: {
    AInput: Input
  }
})
export default class ReportTable extends Vue {
  @Prop({ default: () => ({}) }) options!: H3.Chart.Table;
  prefixCls = 'h3-report-table-footer';
}
</script>
<style lang="less">
  .h3-report-table-footer {
   &__page{
     width: 30px;
   }
  }
</style>
