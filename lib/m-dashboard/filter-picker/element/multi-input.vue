<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}__items-wrap`" v-if ="value.length">
      <div
        :class="`${prefixCls}__item`"
        v-for="(item,index) in value"
        :key="index"
      >
        <span>{{ item }}</span>
        <span @click="removeInput(index)"> 
          <h3-svg name="cross-circle-fill" class="close-circle"></h3-svg>
        </span>
      </div>
    </div>
    <div :class="[`${prefixCls}__add-wrap`,value.length ?'':'pt']" v-if = "!isShowArea">
      <div
        :class="`${prefixCls}__add`"
        @click="showTextArea"
      >
        <h3-svg name="plus-stroke" color="#107FFF" w="24" h="24"></h3-svg>
      </div>
    </div>
    <div :class="`${prefixCls}__area-wrap`" v-if="isShowArea">
      <h3-textarea
        ref="textarea"
        :maxlength="200"
        :border="false"
        placeholder="请输入"
        count
        @blur = "addText($event)"
      />
    </div>
  </div>
</template>
<script lang='ts'>
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import {Mutation, Action, State, namespace} from 'vuex-class';
  import { H3Textarea  } from '@h3/thinking-ui';
  import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
  const ReportPro = namespace('report');
  @Component({
    name: 'h3-report-multi-input',
    components: {
      H3Textarea,
      H3Svg: Svg
    }
  })
  export default class ReportDateInput extends Vue {
    @Prop({ default: ()=> [] }) value!: Array<string | number | any>;
    prefixCls = 'h3-report-multi-input';
    isShowArea: boolean  = false; // 是否显示输入框
    
  
    /**
     * 显示输入框
     */
    removeInput(i: number) {
      this.value.splice(i, 1);
      this.$emit('input', this.value);
    }
    /**
     * 关闭
     */
    closeTextArea() {
      this.isShowArea = false;
    }
    /**
     * 新增筛选器
     */
    addText(e) {
      const value = e.target.value.trim();
      if (value) {
        this.value.push(value);
      }
      e.target.value = '';
      this.closeTextArea();
      this.$emit('input', this.value);
    }
    /**
     * 显示输入框
     */
    showTextArea(){
      this.isShowArea = true;
      this.$nextTick(() => {
        (this.$refs.textarea as HTMLElement).focus();
      });
    }
    
    created() {
      
    }
  }
</script>
<style lang="less">
  .h3-report-multi-input {
    &__items-wrap{
      padding: 12px 16px 0 16px;
    }
    &__add-wrap {
      padding-left: 16px;
      padding-bottom: 12px;
    }
    &__add-wrap.pt {
      padding-top: 12px;
    }
    &__add{
      height: 36px;
      width: 36px;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__item{
      position: relative;
      display: inline-block;
      background-color: #fff;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      margin:0 12px 12px 0;
      padding: 0 20px 0 8px;
      max-width: calc(100% - 8px);
      overflow: hidden;
      font-size: 14px;
      span {
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .close-circle{
        position: absolute;
        top: 50%;
        transform: translateY(-8px);
        right: 4px;
        font-size: 14px;
        line-height: 32px;
        margin-left: 4px;
        fill: #C7C7C7;
      }
    }
  }
</style>
