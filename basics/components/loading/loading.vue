<template>
  <div :class="[`${prefixCls}`]">
    <img src="../../assets/common/loading.png">
    <label> {{ message }}</label>
  </div>
</template>

<script lang='ts'>
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'h3-report-loading',
})
export default class ReportEasyDetail extends Vue {
  prefixCls = 'h3-report-loading';
  @Prop({ default: '加载中' }) message!: string;
}
</script>
<style lang="less">
  .h3-report-loading{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    label{
      margin-top: 10px;
      color: #8893A7;
    }
    img {
      animation: reportLoading linear 1s infinite;
    }
    @keyframes reportLoading {
      from {transform: rotate(0deg);}
      to {transform: rotate(360deg);}
    }
  }
</style>
