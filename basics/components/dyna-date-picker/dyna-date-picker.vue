<template>
  <div :class="prefixCls">
    <div v-if="handleShow">
      <h3-dropdown
        :controlCls="['date-picker-content','header__title','gray']"
        :control="controlVisible"
        :appendToBody="true"
        :offset="[0, 8]"
        overlayCls="dashboard-dropdown"
      >
        <template>
          <a-input
            type="text"
            :placeholder="$r_language.Ddesign.stage_filter.pla_dynaPla"
            :value="inputModel"
            :allowClear="true"
            ref="targetInput"
            @focus="toLeaftBlur"
            @change="clearInput"
          >
          </a-input>
        </template>
        <template slot="content">
          <div class="date-picker-content">
            <div class="p_header">
              <div class="header__title">
                <span
                  class="black start__title"
                  :class="{'bold' : isStartDate == true}"
                  @click="transType(true)"
                > {{ startTitle }}
                  <span style="position:absolute" @click="clearDate($event,true)" v-if="startTitle !== $r_language.Ddesign.dynaModal.startDate"> 
                    <h3-svg 
                      class="gray"
                      name="cross-circle-stroke"
                    ></h3-svg>
                  </span>
                  
                </span>
                <span>~</span>
                <span
                  class="end__title"
                  :class="[{'bold' : isStartDate == false},{'black': endTitle !== $r_language.Ddesign.dynaModal.endDate}]"
                  @click="transType(false)"
                >{{ endTitle }} 
                  <span style="position:absolute" @click="clearDate($event,false)" v-if="endTitle !== $r_language.Ddesign.dynaModal.endDate"> 
                    <h3-svg 
                      class="gray"
                      name="cross-circle-stroke"
                    ></h3-svg>
                  </span>
                </span>
              </div>
            </div>
          
            <div class="p_body">
              <div
                class="p_body_refrash_box"
                v-if="isRefrashEnd"
                ref="p_body_refrash_box"
              >
                <div
                  v-for="(items,index) in clist"
                  :key="index"
                  class="p_body_titleBox"
                  @scroll="handleScroll($event, index)"
                >
                  <div
                    v-for="(item,cIndex) in items"
                    :key="cIndex"
                    class="p_body_title"
                    @click="clickToScroll(index,item)"
                    :class="{'acitve__title': activeArr[index] === cIndex }"
                  >
                    {{ item.label }}
                  </div>
                </div>
              </div>
              <div class="p_body_mask"></div>
            </div>
            <div class="p_footer">
              <span class="p_footer_cancel" @click="toReset">{{ $r_language.Ddesign.dynaModal.delete }}</span>
              <span class="p_footer_submit" @click="toSubmit">{{ $r_language.Ddesign.dynaModal.ok }}</span>
            </div>
          </div>
        </template>
      </h3-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import H3Dropdown from '@h3/report-mobile/basics/components/simple-dropdown/index.vue';
import { Select, Input, DatePicker } from "@h3/antd-vue";
import dateMap from '@h3/report-mobile/basics/utils/dateMap';
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
@Component({
  name: "h3-report-dyna-date-picker",
  components: {
    H3Dropdown,
    ASelect: Select,
    AInput: Input,
    ADatePicker: DatePicker,
    H3Svg: Svg
  }
})
export default class DateFormat extends Vue {
  prefixCls:string = "h3-report-dyna-date-picker";
  inputModel:string = '';
  // 控制显示隐藏
  visible = false;
  controlVisible = false;
  dateList:Array<any> = JSON.parse(JSON.stringify(dateMap));
  copyList:Array<any> = JSON.parse(JSON.stringify(dateMap));
  isScroll:boolean = false;
  beforeScrollTop:number = 0;
  startTitle:string = '开始时间';
  endTitle:string = '结束时间';
  startDate:Array<any> = [null,null,null];
  endDate:Array<any> = [null,null,null];
  isStartDate:boolean = true;  //是否开始时间
  isRefrashEnd:boolean = true;
  isTrans:boolean = false; //是否正在切换
  handleShow:boolean = true;
  activeArr = [0,0,0]
  isClick:boolean = false; //是否是滚动
  timer:any = null;  //存时间
  @Prop({ default: [] }) defaultValue!: Array<any>; // 是否展示筛选方式下拉选择框

  get list(){
    return this.$r_gt(this.dateList,this.$r_languageType)
  }
  get clist(){
    return this.$r_gt(this.copyList,this.$r_languageType)
  }
  
  @Watch('defaultValue',{immediate:true,deep:true})
  initValue(value){
    if(value){
      this.initDate(value);
    }
  }
  @Watch('activeArr',{deep:true,immediate:true})
  changeSecondNumberArr(arr){
    if(arr[0]==0){ //如果是当前，就将时间改成一个选项
      this.clist[1] = [{
        label:'1',value:'1',
      }]
      if(this.startDate){
        this.startDate[1] = "1";
      }else{
        this.endDate[1] = "1";
      }
      this.activeArr[1] = 0;
    }else{
      const numberArr:any = [];
      for(let i=1;i<100;i++){
        const nowNumber = i.toString();
        numberArr.push({
          label: nowNumber,
          value: nowNumber
        })
      }
      this.clist[1] = numberArr
    }
  }
  //修改颜色
  changeActive(){
    this.activeArr = [0,0,0];
    const arr = this.isStartDate ? this.startDate : this.endDate;
    const resut:any = [];
    arr.forEach((value,dIndex)=>{
      const metchIndex = this.list[dIndex].findIndex(el=>el.value === value);
      if(metchIndex > -1){
        resut[dIndex] = metchIndex
      }else{
        resut[dIndex] = 0
      }
    })
    this.activeArr = resut;
  }
  
  // 一些操作以后需要更新数据到startDate  endDate
  setData(pIndex){
    const cIndex =Math.round(this.beforeScrollTop / 25);
    const value = this.list[pIndex][cIndex].value;
    if(this.isStartDate){ //开始时间
      this.startDate.splice(pIndex,1,value)
    }else{
      this.endDate.splice(pIndex,1,value)
    }
    this.completingDate(this.isStartDate);
    this.changeActive();
    this.setTitle();
  }
  
  setTitle(){
    this.startTitle = this.startDate.includes(null) ? this.$r_language.Ddesign.dynaModal.startDate: this.getValueTitle(this.startDate);
    this.endTitle =  this.endDate.includes(null) ? this.$r_language.Ddesign.dynaModal.endDate: this.getValueTitle(this.endDate);
  }

  getValueTitle(arr):string{
    let str = '';
    arr.forEach((val,index)=>{
      const metch = this.list[index].find(el=>el.value == val);
      if(metch){
        str += metch.label;
      }
    })
    return str;
  }
  getResultDate(){
    return [this.startDate,this.endDate]
  }
  clickToScroll(pIndex,item){
    this.isClick = true;
    if(this.isStartDate) {
      this.startDate.splice(pIndex,1,item.value);
    }else{
      this.endDate.splice(pIndex,1,item.value);
    }
    const arr = this.isStartDate ? this.startDate : this.endDate;
    this.computedDate(arr);
    this.completingDate(this.isStartDate)
    this.changeActive();
    this.setTitle();
  }
  //重置
  toReset(){
    this.startDate = [null,1,null];
    this.endDate =  [null,1,null];
    this.transType(true)
    this.startTitle = this.$r_language.Ddesign.dynaModal.startDate;
    this.endTitle = this.$r_language.Ddesign.dynaModal.endDate;
  }
  //清除
  clearDate(event,isStart){
    event.stopPropagation();
    if(isStart){
      this.startDate = [null,null,null];
      this.startTitle = this.$r_language.Ddesign.dynaModal.startDate;
    }else{
      this.endDate = [null,null,null];
      this.endTitle = this.$r_language.Ddesign.dynaModal.endDate;
    }
  }
  closeDrapDown(){
    this.handleShow = false
    this.isStartDate = true;
    this.$nextTick(()=>{
      this.handleShow  =true;
    })
  }
  //同步input的值
  changeInputValue(){
    if(this.startTitle !== this.$r_language.Ddesign.dynaModal.startDate && this.endTitle !==this.$r_language.Ddesign.dynaModal.endDate ){
      this.inputModel = this.startTitle + '~' + this.endTitle;
    }else if(this.startTitle !=this.$r_language.Ddesign.dynaModal.startDate || this.endTitle != this.$r_language.Ddesign.dynaModal.endDate){
      if(this.startTitle!==this.$r_language.Ddesign.dynaModal.startDate){
        this.inputModel = this.startTitle + '~';
      }else{
        this.inputModel ='~' + this.endTitle;
      }
    }else{
      this.inputModel  = '';
    }
  }
  clearInput(event){
    // event.stopPropagation();
    this.startDate = [null,null,null];
    this.startTitle = this.$r_language.Ddesign.dynaModal.startDate;
    this.endDate = [null,null,null];
    this.endTitle = this.$r_language.Ddesign.dynaModal.endDate;
    this.inputModel = '';
    this.toSubmit();
  }
  toSubmit(){
    const data = this.getResultDate();
    this.changeInputValue();
    this.$emit('change', data)
    this.closeDrapDown();
  }
  //切换开始和结束时间
  transType(bool){
    // this.completingDate(!bool);//补全当前切换的数据中的数据,因为用户可能没有选择年月,导致数据是null,需要将null默认等于第一项
    ////多个状态,因为操作逻辑复杂,状态比较多,位置不能乱动
    this.isStartDate = bool;
    this.isRefrashEnd = false;
    this.isTrans = true;
    this.setTitle();
    //处理的比较复杂,后期整理,时间不够
    this.$nextTick(()=>{
      this.isRefrashEnd = true;
      this.$nextTick(()=>{
        this.initScrollTop();
        setTimeout(()=>{
          this.isTrans = false;
          this.changeActive()
        },0)
      })
    })
  }
  //补全数据 
  completingDate(isStart){
    const arr = isStart ? this.startDate : this.endDate;
    const newArr = arr.map((val,index)=>{
      if(!val){
        const nowVal = this.list[index][0].value;
        return nowVal;
      }
      return val;
    })
    if(isStart){
      this.startDate = newArr;
    }else{
      this.endDate = newArr;
    }
  }

  initScrollTop(){
    if(this.$refs.p_body_refrash_box){
      if(this.isStartDate){
        this.computedDate(this.startDate)
      }else{
        this.computedDate(this.endDate)
      }
    }
  }
  //初始化滚动赋值
  computedDate(dateArr){
    setTimeout(()=>{
      dateArr.forEach((val,index) => {
        const valueIndex = this.list[index].findIndex(e=>e.value === val);
        if(valueIndex > -1){
          (this.$refs.p_body_refrash_box as any).childNodes[index].scrollTop = valueIndex * 25 ;
        }
      })
    },50)
  }
  //滚动逻辑代码
  handleScroll(event,index){
    event.preventDefault();
    event.target.scrollTop = this.activeArr[index] * 25;
    // //如果是点击滚动
    // if(this.isClick){
    //   event.target.scrollTop = this.activeArr[index] * 25;
    //   return  this.$nextTick(()=>{
    //     this.isClick = false;
    //   })
    // }  
    // //滚动情况
    // if(this.isScroll) return;
    // this.isScroll = true;
    // if(this.timer) {
    //   clearTimeout(this.timer);
    //   this.timer = null;
    // }
    // this.timer = setTimeout(()=>{
    //   if(event && event.target){
    //     const cIndex =Math.round(event.target.scrollTop/25);
    //     const item = this.dateList[index][cIndex];
    //     if(this.isStartDate) {
    //       this.startDate.splice(index,1,item.value);
    //     }else{
    //       this.endDate.splice(index,1,item.value);
    //     }
    //     this.activeArr.splice(index,1,cIndex);
    //     const arr = this.isStartDate ? this.startDate : this.endDate;
    //     this.computedDate(arr);
    //     this.completingDate(this.isStartDate)
    //     this.setTitle();
    //   }
    //   this.isScroll = false;
    // },200)
  }
  //主动失去焦点
  toLeaftBlur(){
    this.initDate(this.defaultValue)
    this.init();
    setTimeout(()=>{
      this.transType(true)
      this.$nextTick(()=>{
        (this.$refs.targetInput as any).blur()
      })
    },50)
  }
  initDate(value){
    const copyValue = JSON.parse(JSON.stringify(value));
    if(copyValue[0] && !copyValue[0].includes(null)){
      this.startDate = copyValue[0];
    }else{
      this.startDate = [null,null,null]
    }
    if(copyValue[1]&& !copyValue[1].includes(null)){
      this.endDate = copyValue[1];
    } else{
      this.endDate = [null,null,null]
    }
    this.setTitle();
    this.changeInputValue();
  }
  init(){
    this.isStartDate = true;
    const arr = this.isStartDate ? this.startDate : this.endDate;
    this.computedDate(arr);
    this.setTitle();
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
      fill:#cccccc;
      position: relative;
      top: 4px;
      width: 14px !important;
      height: 14px !important;
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

</style>
