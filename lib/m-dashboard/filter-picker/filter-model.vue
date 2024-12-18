<template>
  <h3-popup
    v-model="value"
    :round="true"
    :wrapCls="prefixCls"
    popupWidth="82%"
    popupDirection="right"
    maskClosable
    @maskClick="maskClick"
  >
    <div :class="`${prefixCls}__content`" v-if="value">
      <div :class="`${prefixCls}__title`">筛选器</div>
      <filter-wrap v-if="tmpFilters.length" :filters="tmpFilters" @change="changeFilters">
      </filter-wrap>
      <div v-else :class="`${prefixCls}__tip`">
        当前没有设置筛选器
      </div>
    </div>
    <div :class="`${prefixCls}__footer`" v-show="tmpFilters.length && value && isShow">
      <div :class="`${prefixCls}__btn`" @click="reset">重置</div>
      <div @click="handleOk" :class="`${prefixCls}__btn primary`">确定</div>
    </div>
  </h3-popup>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Provide } from "vue-property-decorator";
import { H3Popup, H3Button } from "@h3/thinking-ui";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ReportAction, ReportMutation } from "@h3/report-mobile/basics/store/dashboard/types";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import FilterWrap from "./filter-wrap.vue";
import { ResizeSensor } from "css-element-queries";
import { NumberType, DateType } from "@h3/report-mobile/basics/enum/filter-type";

const ReportPro = namespace("report");
@Component({
  name: "h3-report-filter-model",
  components: {
    H3Button,
    H3ButtonGroup: H3Button.Group,
    H3Popup,
    FilterWrap
  }
})
export default class ReportFilterModel extends Vue {
  @Prop({ default: () => false }) value!: boolean; // 是否显示过滤器
  @ReportPro.State("dataSources") dataSources!: { [dataSourceId: string]: any };
  @ReportPro.State("charts") charts!: Array<H3.Report.Chart>;
  @ReportPro.State("globalFilters") globalFilters!: Array<H3.Report.GlobalFilter>;
  @ReportPro.Action(ReportAction.SETFILTERPICKER) setFilterPicker!: Function;
  @ReportPro.Action(ReportAction.REMOVEFILTERPICKER) removeFilterPicker!: Function;
  @ReportPro.Mutation(ReportMutation.SETCHARTS) setCharts!: Function;
  prefixCls: string = "h3-report-filter-model";
  tmpFilters: Array<H3.Report.GlobalFilter> = [];
  resizeSensor: ResizeSensor | null = null;
  docmHeight: number = document.documentElement.clientHeight || document.body.clientHeight; //默认屏幕高度
  isShow: boolean = true;

  /**
   * 更改筛选
   * @param filters
   */
  changeFilters(filters: Array<H3.Report.FilterPicker>) {
    Object.assign(this.tmpFilters, filters);
  }
  /**
   * 变更筛选器时做筛选
   */
  setFilter() {
    this.tmpFilters.forEach((filter: H3.Report.FilterPicker) => {
      // 公式 为空不为空去筛选，范围时都有值去筛选，其他的公式都是有值去筛选
      if (
        ["None", "NotNone", "Dynamic"].includes(filter.formula) ||
        (filter.formula === "Range" && filter.text[0] && filter.text[1]) ||
        (filter.formula !== "Range" && filter.text[0])
      ) {
        if (filter.formula === "Dynamic") {
          if (filter.text.length === 2) {
            if (filter.text[0] !== null || filter.text[1] !== null) {
              this.setFilterPicker({ filterPicker: filter });
            } else {
              this.removeFilterPicker(filter);
            }
          } 
          if (filter.text.length ===1 && filter.text[0] === ""){
            this.removeFilterPicker(filter);
          }
        } else {
          this.setFilterPicker({ filterPicker: filter });
        }
      } else {
        this.removeFilterPicker(filter);
      }
    });
  }

  /**
   * 重置
   */
  reset() {
    const filterList = this.charts.filter((item) => {
      return item.type === "filterPicker";
    });
    this.tmpFilters = JSON.parse(
      JSON.stringify(
        this.globalFilters.concat((filterList as any) || []).filter(item => {
          return item.field && !item.field.specialType;
        })
      )
    );
    this.setFilter();
    this.$emit("set-filter", false);
    this.$emit("input", false);
  }
  /**
   * 确定
   */
  handleOk() {
    // 对各种类型做处理
    this.tmpFilters.forEach((filter, index) => {
      switch (filter.field.type) {
        case "date":
          break;
        case "string":
          // this.tmpFilters[index].format = "";
          break;
        case "number":
          // this.tmpFilters[index].format = "";
          if (filter.formula === DateType.Range) {
            if (filter.text[0] && filter.text[1]) {
              this.tmpFilters[index].text.sort((a, b) => Number(a) - Number(b));
              this.tmpFilters[index].text.splice(
                0,
                this.tmpFilters[index].text.length,
                ...filter.text.map((item: string) => parseFloat(item).toString())
              );
            } else {
              this.tmpFilters[index].text.splice(0, this.tmpFilters[index].text.length);
            }
          }
          break;
        default:
          break;
      }
    });

    this.setFilter();
    this.$emit("set-filter", true);
    this.$emit("input", false);
  }
  /**
   * 点击遮罩绑定事件
   */
  maskClick() {
    this.$emit("input", false);
  }

  /**
   * 初始化数据
   */
  initData() {
    const filterList = this.charts.filter((item) => {
      return item.type === "filterPicker";
    });
    this.tmpFilters = JSON.parse(
      JSON.stringify(
        this.globalFilters.concat((filterList as any) || []).filter(item => {
          return item.field && !item.field.specialType;
        })
      )
    );
  }
  mounted() {
    this.resizeSensor = new ResizeSensor(this.$el as HTMLDivElement, e => {
      this.isShow = this.docmHeight <= e.height;
    });
  }
  created() {
    this.initData();
  }
  destroyed() {
    if (this.resizeSensor) {
      this.resizeSensor.detach();
    }
  }
}
</script>
<style lang="less">
.h3-report-filter-model {
  display: flex;
  flex-direction: column;
  height: 100%;
  &__title {
    font-size: 12px;
    height: 43px;
    line-height: 43px;
    padding: 0 16px;
    color: #999999;
  }
  &__content {
    flex: 1;
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    height: auto;
    .h3think-accordion .h3think-accordion-item .h3think-accordion-item__header {
      overflow: hidden;
    }
  }
  &__content::-webkit-scrollbar {
    //scroll滚动条设置
    width: 0;
    height: 0;
    background-color: #fff;
  }
  &__tip {
    font-size: 14px;
    padding: 16px 0 0 16px;
    color: #333;
  }
  &__footer {
    width: 100%;
    display: flex;
    height: 56px;
    align-items: center;
    padding: 0 16px;
    background-color: #fff;
  }
  &__btn {
    flex: 1;
    height: 32px;
    line-height: 30px;
    border-radius: 16px;
    font-size: 14px;
    text-align: center;
    color: #333;
    border: 1px solid rgba(153, 153, 153, 1);
  }
  &__btn.primary {
    flex: 1;
    margin-left: 8px;
    color: white;
    background: rgba(16, 127, 255, 1);
  }
  .h3think-org-selector {
    height: 350px;
  }
}
</style>
