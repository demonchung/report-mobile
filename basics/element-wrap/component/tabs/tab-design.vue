<template>
  <div :class="prefixCls" ref="tabDesign" :style="{top: top + 'px', right: right + 'px'}">
    <div :class="[`${prefixCls}__modal`]" ref="designModal">
      <span :class="[`${prefixCls}__modal-title`]">Tab组件编辑</span>
      <div :class="[`${prefixCls}__setting`]"> 
        <span class="title">标题设置</span>
        <div :class="[`${prefixCls}__setting-check`]">
          <span :class="[`check-box`]" @click="changeVisible">
            <h3-svg v-if="visibleTitle" name="danxuan1changtaibeifen"></h3-svg>
            <h3-svg v-else name="fuxuankuangbiankuang"></h3-svg>
          </span>
          <span class="check-title">显示标题</span>
        </div>
        <span :class="[`${prefixCls}__setting-rename`, !visibleTitle? 'disabled': '']">标题名</span>
        <a-input
          placeholder="请输入标题"
          v-model="copyChart.title"
          :disabled="!visibleTitle"
          :maxLength="32"
        />
      </div>
      <div :class="[`${prefixCls}__label`]"> 
        <span :class="`${prefixCls}__label-title`">标签设置</span>
        <div :class="[`${prefixCls}__label-group`]"> 
          <h3-draggable
            v-model="tabsList"
            id="tabsList"
            handle=".drag"
            class="dragging-wrap"
            :options="dragOptions"
            @end="changeLabelSort"
          >
            <div
              v-for="(item, index) in tabsList"
              :key="index"
              :class="[`${prefixCls}__label-item`]"
            >
              <h3-svg name="drag-o" class="drag"></h3-svg>
              <a-input
                ref="input"
                placeholder="请输入Tab标签名"
                v-model="item.title"
                :maxLength="32"
                @change="changeTitle(item, index)"
              />
              <a-dropdown
                v-if="item.chartIds && item.chartIds.length" 
                placement="topRight" 
                :trigger="['click']"
              > 
                <span> 
                  <h3-svg name="delete-stroke" class="label-delete"></h3-svg>
                </span>
                <div slot="overlay" :class="[`${prefixCls}__delete`]" ref="deleteModal">
                  <div :class="[`${prefixCls}__delete-title`]">
                    <h3-svg name="exclamation-circle-fill" class="warn-icon"></h3-svg>
                    <span class="warn-title">该操作会删除标签内的图表或组件，是否继续？</span>
                  </div>
                  <div :class="[`${prefixCls}__delete-button`]"> 
                    <a-button 
                      class="cancel" 
                      size="small"
                      @click="cancel($event, index)"
                    >{{ $r_language.normal.cancel }}</a-button>
                    <a-button 
                      type="primary" 
                      size="small" 
                      class="check" 
                      @click="check($event,index)"
                    >{{ $r_language.normal.sure }}</a-button>
                  </div>
                </div>
              </a-dropdown> 
              <span v-else @click="deleteLabel($event,index)"> 
                <h3-svg name="delete-stroke" :class="`label-delete`"></h3-svg>
              </span>
            </div>
          </h3-draggable>
          <span v-if="canAdd" :class="`${prefixCls}__label-add`" @click="addLabel">
            <h3-svg name="plus-stroke" class="add-icon"></h3-svg>
            添加Tab标签
          </span>
        </div>
      </div>
    </div>
    <!-- <div :class="[`${prefixCls}__dragging`]"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Input,message, Dropdown, Button } from "@h3/antd-vue";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import H3Draggable from "vuedraggable";
import { ReportAction, ReportMutation } from "@h3/report-mobile/basics/store/dashboard/types";
const Dashboard = namespace("report");
@Component({
  name: "h3-report-tabs-design",
  components: {
    AInput: Input,
    H3Svg: Svg,
    H3Draggable,
    ADropdown:Dropdown,
    AButton: Button,
  }
})
export default class TabsWrap extends Vue {
  @Prop() chart!: H3.Report.Tab;
  @Prop() global!: H3.Report.Global;
  @Prop() top!: number;
  @Prop() right!: number;

  // 更新tab组件
  @Dashboard.Action(ReportAction.UPDATETABSERVER) updateTabServer!: Function;
  @Dashboard.State("charts") charts!: Array<H3.Report.Chart>;
  @Dashboard.Mutation(ReportMutation.UPDATETABMAPPING) updateTabMapping!: Function; 
  //批量删除图表
  @Dashboard.Action(ReportAction.BETCHREMOVECHARTS) betchRemoveCharts!: Function;

  @Dashboard.State("tabsMapping") tabsMapping!: any;
  @Dashboard.Mutation(ReportMutation.CLEARCHARTANDFILTERRELATION)
  clearChartAndFilterRelation!: Function;
  @Dashboard.Mutation(ReportMutation.DELETERELATIONCHART) deleteRelationChart!: Function;
  @Dashboard.Action(ReportAction.REMOVEFILTERPICKER) removeFilterPicker!: Function; // 删除筛选
  @Dashboard.Mutation(ReportMutation.CLEARACTIVECHART) clearActiveChart!: Function;

  prefixCls = "h3-report-tabs-design"
  tabsList: Array<H3.Report.TabItem> = []; 
  visibleTitle: boolean = true; //是否显示标题, 保存时合并到copy
  //copyChart: H3.Report.Tab = JSON.parse(JSON.stringify(this.chart));
  copyChart: H3.Report.Tab = this.chart;
  
  // 拖拽配置信息
  dragOptions = {
    group: "tabsList",
    forceFallback: true,
    animation: 150,
    touchStartThreshold: 5,
    delay: 50,
    filter: ".undrag"
  };

  get canAdd() {
    return this.tabsList && this.tabsList.length < 5 ;
  }
  changeVisible(e) {
    e.stopPropagation();
    e.preventDefault();
    this.visibleTitle = !this.visibleTitle;
    this.copyChart.visibleTitle = this.visibleTitle;
  }
  changeTitle(item, index) {
    if(this.$refs.input && (this.$refs.input as Vue)[index] && (this.$refs.input as Vue)[index].$el.classList.contains('input-error')) {
      (this.$refs.input as Vue)[index].$el.classList.remove('input-error');
    }
  }
  save() {
    let errorNum = 0;
    this.tabsList.length && this.tabsList.forEach((tab,index) => {
      if (!tab.title) {
        if ((this.$refs.input as Vue)[index]) {
          (this.$refs.input as Vue)[index].$el.classList.add('input-error');
          this.$nextTick(() => {
          (this.$refs.input as HTMLInputElement)[index].focus();
        });
        } 
        errorNum ++;
      } 
    });
    if (errorNum) {
      message.warning("请输入Tab标签名");
      return;
    } 
    this.updateTabServer(this.chart.uid);
    //todo
    const params = null;
    this.$emit("change", params);
  }

  changeLabelSort() {
    console.log('sort');
    this.copyChart.tabs = this.tabsList;
    // 更新tab全局映射
    this.updateTabMapping();
  }

  /**
   * 获取标签页内所有图表object
   */
   getLabelCharts(index) {
    let chartArr: any = [];
    const tabMap: any = this.tabsMapping[this.chart.uid] || {};
    if (tabMap) {
      chartArr = tabMap[index].charts;
    }
    return chartArr;
  }
  /**
   * 删除组件后续处理数据
   */
   afterDelete(element) {
    this.clearActiveChart();
    const metchIndex = this.charts.findIndex(el=>el.uid === element.uid);
    if(metchIndex > -1){
      this.charts.splice(metchIndex, 1);
    }
    this.deleteRelationChart(element.uid); // 清空下钻图层数据
    // 清空清空图表关系
    this.clearChartAndFilterRelation(element);
    // 清空筛选关系
    if (element.type === "filterPicker") {
      this.removeFilterPicker(element);
    }
  }
  deleteLabel(e, index) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    let tabCharts: any = this.getLabelCharts(index); //tab组件内的图表数组
    if (this.tabsList.length !== 1) {
      if (this.tabsList[index] && this.tabsList[index].chartIds.length) {
        this.betchRemoveCharts(this.tabsList[index].chartIds)
        .then(res => {
          if (res) {
            if (tabCharts.length) {
              tabCharts.forEach((chart: any) => {
                this.afterDelete(chart);
              })
            }
          }
        })
        .catch(() => {
          message.warning("删除图表失败,请联系工作人员");
        });
      }

      this.tabsList.splice(index, 1);
    } else {message.warning("至少保留一个Tab项");}
    // 更新tab全局映射
    this.updateTabMapping();
  }
  addLabel(e) {
    e.stopPropagation();
    e.preventDefault();
    this.tabsList.push({title: '',chartIds: []});
    this.$nextTick(() => {
      if ((this.$refs.input as HTMLInputElement)[this.tabsList.length - 1]) {
        (this.$refs.input as HTMLInputElement)[this.tabsList.length - 1].focus();
      }
    });
    // 更新tab全局映射
    this.updateTabMapping();
  }
  clickOutside(event) {
    // 检查鼠标点击的目标元素是否在指定区域内
    //todo
    const bol = (this.$refs.tabDesign as any).contains(event.target);
    let inDeleteModal;
    let boxs: any = [];
    boxs = document.querySelectorAll('.h3-report-tabs-design__delete') as any;
    boxs.length && boxs.forEach(item => {
      inDeleteModal = item.contains(event.target);
    })
    //判断点击的元素是否为图表的编辑按钮
    let els = document.querySelectorAll(".h3-dashboard-container__item") as any;
    let resultDom;
    els.length &&
      els.forEach((e) => {
        if (e.dataset.id === this.chart.uid)
          {resultDom = e.querySelectorAll(".h3-dashboard-toolbar__icon-wrap");}
      });
    const inChart = resultDom && resultDom[0] && resultDom[0].contains(event.target);

    console.log(187, bol, inDeleteModal, inChart);
    if (inDeleteModal) {return;}
    if (inChart) {return;}
    if (event.target !== this.$refs.tabDesign && !bol) {
      // 如果不在，则关闭弹窗并保存数据
      this.save();
    }
    //  如果在，则不做任何操作，让事件继续冒泡
  }

    cancel(e,index) {
      e.preventDefault();
    }
    check(e,index) {
    //  e.stopPropagation();
      e.preventDefault();
      this.deleteLabel(null,index);
    }


  created() {
    this.tabsList = this.copyChart.tabs;
    this.visibleTitle = this.copyChart.visibleTitle;
  }

  mounted() {
    setTimeout(() => {
      document.body.addEventListener('click', this.clickOutside);
    });
  }
  destroyed() {
    document.body.removeEventListener('click', this.clickOutside);
  }
}
</script>
<style lang="less">
.h3-report-tabs-design {
  width: 310px;
  background: #fff;
  box-shadow: rgba(52, 94, 184, 0.2) 0px 4px 18px 0px;
  border-radius: 6px;
  position: absolute;
  z-index: 1002;
  top: 0;
  right: 0;
  cursor: auto;

  &__modal {
    margin: 24px;
    &-title {
      font-size: 14px;
      line-height: 22px;
      color: #121933;
      font-weight: 600;
    }
  }
  &__setting {
    display: flex;
    flex-direction: column;

    padding: 20px 0;
    box-shadow: inset 0px -1px 0px 0px rgba(226,226,226,0.5);
    .title {
      font-weight: bold;
      line-height: 22px;
      font-size: 13px;
    }
    &-check {
      margin-top: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      .check-box {
        display: flex;
        margin-right: 8px;
      }
      .check-title {
        color: #121933;
        line-height: 22px;
        font-size: 13px;
      }
    }
    &-rename {
      margin: 10px 0 4px 0;
      color: #707481;
      line-height: 22px;
      font-size: 13px;
    }
    &-rename.disabled {
      color: rgba(112, 116, 129, 0.3)
    }
  }
  &__label {
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    &-title {
      font-size: 13px;
      font-weight: bold;
      line-height: 22px;
    }
    &-group {
      background: #F5F6F9;
      border-radius: 4px;
      padding: 16px 8px;
      margin-top: 12px;
      .dragging-wrap {
        display: flex;
        flex-direction: column;
      }
    }
    &-item {
      display: flex;
      margin-top: 8px;
      align-items: center;
      &:first-child {
        margin-top: 0;
      }
      .label-delete {
        fill: #707481;
        width: 14px !important;
        height: 14px !important;
        margin-left: 12px;
      }
      .drag {
        fill: #707481;
        margin-right: 4px;
      }
      .input-error.ant-input {
          border-color: #E64340;
        }
      .input-error.ant-input:focus {
        border-color: #E64340;
        box-shadow: 0 0 0 2px rgba(230, 67, 64, 0.2);
      }
    }
    &-add {
      margin-top: 12px;
      font-size: 13px;
      color: #315efb;
      line-height: 22px;
      display: flex;
      align-items: center;
      .add-icon {
        fill: #315EFB;
        width: 14px !important;
        height: 14px !important;
        margin-right: 6px;
      }
    }
  }
  &__button {
    margin-top: 24px;
    height: 36px;
    cursor: pointer;
    display: flex;
    justify-content: right;
    &-cancel {
      float: right;
      min-width: 63px;
      display: flex;
      align-items: center;
      height: 100%;
      margin-right: 8px;
      justify-content: center;
    }
    &-sure {
      float: right;
      min-width: 63px;
      border-radius: 4px;
      background: #315EFB;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #fff;
    }
  }
  &__dragging {
    position: absolute;
    top: -12px;
    left: 0;
    width: 100%;
    height: 36px;
    cursor: move;
  }
  &__delete {
    min-height: 96px;
    width: 220px;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.15);
    border-radius: 4px;
    &-title {
      display: flex;
      flex-direction: row;
      padding: 16px 16px 0 16px;
    }
    .warn-title {
      font-size: 14px;
      line-height: 22px;
      color: #121933;
    }
    .warn-icon {
      width: 14px !important;
      height: 14px !important;
      fill: #FAAD14;
      flex: none;
      margin: 4px 4px 0 0;
    }
    &-button {
      padding: 12px 16px 22px 16px;
      text-align: right;
      .cancel {
        margin-right: 8px;
      }
      .check {

      }
    }
  }
  .input-error {
    .ant-input {
      border-color: #E64340;
    }
    .ant-input:focus {
      border-color: #E64340;
      box-shadow: 0 0 0 2px rgba(230, 67, 64, 0.2);
    }
  }
  
}
</style>

