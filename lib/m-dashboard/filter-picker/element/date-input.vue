<template>
  <div :class="`${prefixCls}`" @click="handleClick">
    <div :class="`${prefixCls}__content`">
      <div :class="`${prefixCls}__placeholder`" v-if="!value"> {{ placeholder }}</div>
      <div :class="`${prefixCls}__text`" v-else> {{ value }}</div>
    </div>
    <slot></slot>
  </div>
</template>
<script lang='ts'>
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {Mutation, Action, State, namespace} from 'vuex-class';
  
  const ReportPro = namespace('report');
  @Component({
    name: 'h3-report-date-input',
    components: {
    }
  })
  export default class ReportDateInput extends Vue {
    @Prop({default: ''}) value!: string;
    @Prop({default: ''}) placeholder!: string; // 空状态值
    
    prefixCls = 'h3-report-date-input';

    /**
     *  抛出点击事件
     */
    handleClick() {
      this.$emit('click')
    }
  }
</script>
<style lang="less">
  .h3-report-date-input {
     width: 100%;
     height: 28px;
     border:1px solid rgba(235,237,242,1);
     border-radius: 14px;
     background-color: #fff;
     display: flex;
     justify-content: space-between;
     align-items: center;
     font-size:14px;
     padding: 4px 16px;
    &__content{
      flex: 1;
     }
     &__placeholder{
       color: #999;
       overflow: hidden;
       text-overflow:ellipsis;
       white-space: nowrap;
       line-height: 20px;
     }
     &__text{
       color: #333;
       overflow: hidden;
       text-overflow:ellipsis;
       white-space: nowrap;
       line-height: 20px;
     }
    .icon {
      display: flex;
      align-items: center; 
      color: #999;
    }
  }
</style>
