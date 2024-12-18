<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__date__range`">
      <a-cascader
        :options="options"
        :defaultValue="startDate"
        placeholder="请选择开始时间"
        @change="onChange($event,true)"
        :display-render="displayRender"
      />
      <span class="gray_bo">~</span>
      <a-cascader
        :options="options"
        :defaultValue="endDate"
        placeholder="请选择结束时间"
        @change="onChange($event,false)"
        :display-render="displayRender"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Select, Input, cascader } from "@h3/antd-vue";
import mapData from './dateM';
@Component({
  name: "h3-report-dyna-select-date-picker",
  components: {
    ASelect: Select,
    AInput: Input,
    ACascader:cascader
  }
})
export default class DateFormat extends Vue {
  prefixCls:string = "h3-report-dyna-date-picker";
  options = mapData;
  startDate = [];
  endDate = [];
  @Prop({ default: [] }) defaultValue!: Array<any>; // 是否展示筛选方式下拉选择框

  @Watch('defaultValue',{immediate:true,deep:true})
  initValue(value){
    if(value){
      this.init();
    }
  }
  onChange(value,isStart) {
    if(isStart){
      this.startDate = value;
    }else{
      this.endDate = value;
    }
    const data = [this.startDate,this.endDate]
    this.$emit('change', data)
  }
  displayRender({ labels }) {
    let str = '';
    labels.length && labels.forEach((l)=>{
      return str+=l
    })
    return str;
  }
  init(){
    if(this.defaultValue && this.defaultValue.length){
      this.startDate = this.defaultValue[0] || [];
      this.endDate = this.defaultValue[1] || [];
    }
  }
  created() {
  }
  mounted(){
    this.init();
  }
}
</script>
<style lang="less">
.h3-report-dyna-date-picker{
  display: inline-block;
  width:100%;
  &__input{
    width:80px;
    height:100%;
  }
  .input_area{
    position:relative;
    width:100%;
    height:auto;
  }
}
.date-picker-content{
  width:100%;
  height:auto;
  background:#fff;
  padding: 0 10px;
  min-width: 250px;
}
.p_header{
  height: 50px;
  .header__title{
    display: flex;
    height:50px;
    justify-content: space-between;
    align-items: center;
    color:#cccccc;
    transition: all 0.2s;
    .black{
      color:#000;
    }
    .bold{
      font-weight:bold;
    }
    .gray{
      color:#cccccc;
    }
  }
  // .start__title:hover,.end__title:hover{
  //   .gray{
  //     opacity: 1;
  //   }
  // }
  .start__title,.end__title{
    cursor: pointer;
  }
}
.p_body{
  width: 100%;
  height:200px;
  position: relative;
  .p_body_refrash_box{
    width:100%;
    height:100%;
    display: flex;
    overflow: hidden;
    position: relative;
  }
  .p_body_titleBox{
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 90px 0;
    width:100%;
    height:100%;
    overflow: hidden;
    overflow-y:auto;
    text-align: center;
    position: relative;
    z-index: 2;
    cursor: pointer;
  }
  .p_body_title{
    line-height: 25px;
  }
  .acitve__title{
    color:#1890ff;
  }
  .p_body_titleBox::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .p_body_mask{
    width:100%;
    position:absolute;
    top: 90px;
    height:25px;
    border: 1px solid #1890ff;
    border-right: none;
    border-left: none;
    z-index: 1;
  }
}
.p_footer{
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: right;
  .p_footer_cancel,.p_footer_submit{
    cursor: pointer;
  }
  .p_footer_cancel{
    color:blue;
    margin-right: 16px;
  }
  .p_footer_submit{
    border-radius: 4px;
    font-size: 12px;
    padding: 5px 16px;
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
  }
}

.h3-report-dyna-date-picker__date__range{
  width:100%;
  height:auto;
  display: flex;
  align-items: center;
  .gray_bo{
    padding:0 5px;
  }
}

</style>
