<template>
  <div :class="[`${comPrefixCls}__item`]" :style="getItemStyle(element)">
    <element-wrap-header
      v-if="element && element.type !== 'longText' && element.type !== 'image' && element.type !== 'tab' && isShow"
      :full-screen-status="fullScreenStatus"
      :element="element"
      :chartLayers="chartLayers"
      :global="global"
      :comPrefixCls="comPrefixCls"
      @full-screen="fullScreen"
      :isDark="isDark"
    >
      <slot name="title" slot="title"/>
      <slot name="extra" slot="extra"/>
    </element-wrap-header>
    <element-wrap
      v-if="designMode ? isShow : true"
      :chart="element"
      :status="'report'"
      :global="global"
      :refresh="refresh"
      :dataSources="dataSources"
      :landscape="landscape"
      :globalFilters="globalFilters"
      @register-refresh="registerRefresh"
      @update-charts-data="updateChartsData"
      @click-chart="clickChart"
      @dblClickChart="dblClickChart"
      @changeActiveTab="changeActiveTab"
    >
      <template slot="tabContent" slot-scope="{data}">
        <slot name="tabContent" :data="data"></slot>
      </template>
    </element-wrap>
    <slot name="customFooter">
      <FooterLayer
        :chart="element"
        :index="footBreadIndex"
        :chartLayers="chartLayers"
        @click="changeChartByFilter"
        :isDark="isDark"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";
import { ReportMutation, ReportAction } from "@h3/report-mobile/basics/store/dashboard/types";
import ElementWrap from "@h3/report-mobile/basics/element-wrap/mobile-wrap.vue";
import ElementWrapHeader from "./header.vue";
import { CoatType, paintsPro, ThemeColorType } from "@h3/report-mobile/basics/enum/paint";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import FooterLayer from "@h3/report-mobile/basics/components/footer-layer";
import { DateType} from "@h3/report-mobile/basics/enum/filter-type";
import { getChartFields } from "@h3/report-mobile/basics/utils/report-element";
import { handleChartFieldDefaultValues } from "@h3/report-mobile/basics/store/utils/help";

const ReportPro = namespace("report");
@Component({
  name: "h3-dashboard-mobile-element",
  components: {
    ElementWrapHeader,
    ElementWrap,
    FooterLayer,
  }
})
export default class DashboardMobileElement extends Vue {
  @Prop({
    default: "h3-report-mobile"
  })
  comPrefixCls!: string; // 父级样式
  @Prop({
    default: () => null
  })
  element!: H3.Report.BaseElement; // 图表

  @Prop({ default: true }) refresh!: boolean;
  @Prop({ default: false }) landscape!: boolean;

  @Prop({ default: null }) global!: H3.Report.Global;

  @Prop({ default: false }) fullScreenStatus!: H3.Report.Global;
  @ReportPro.State("charts") charts!: Array<H3.Report.BaseElement>;
  @ReportPro.Mutation(ReportMutation.SETCHARTSDATA) setChartsData!: Function;
  @ReportPro.State("chartViewStatus") chartViewStatus!: { [chartUuid: string]: any };
  // 是否处于编辑状态
  @ReportPro.State("designMode") designMode!: boolean;
  @ReportPro.State("dataSources") dataSources!: { [dataSourceId: string]: any };
  // 当前图表的关联的图层
  @ReportPro.State("activeChartLayers") activeChartLayers!: Array<H3.Report.chartLayer>;
  @ReportPro.State("chartRelations") chartRelations!: H3.Report.chartRelations;
  @ReportPro.State("globalFilters") globalFilters!: Array<H3.Report.GlobalFilter>;
  @ReportPro.Action(ReportAction.SETCHARTLINKAGE) setChartLinkage!: Function; // 设置图表联动
  @ReportPro.Action(ReportAction.SETFILTERPICKER) setFilterPicker!: Function;
  @ReportPro.Action(ReportAction.REMOVEFILTERPICKER) removeFilterPicker!: Function;
  @ReportPro.Action(ReportAction.SETCHARTLAYERLINK) setChartLayerLink!: Function;
  @ReportPro.Action(ReportAction.SETDESIGNLAYERLINK) setDesignLayerLink!: Function;
  @ReportPro.Action(ReportAction.GETDATASOURCE) getDataSource!: Function;

  isShow: boolean = true;
  get chartLayers() {
    return this.element ? this.chartRelations[this.element.uid] : [];
  }
  get footBreadIndex() {
    return this.element ? this.element.layerActiveIndex : 0;
  }
  get isDark() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }
  /**
   * 获取图表样式
   */
  getItemStyle(chart: H3.Report.Chart): string {
    if (!this.global.styles.paintCoatTheme) {return true;}
    const elementCoat: H3.Report.ElementCoat = this.global.styles.elementCoat;
    const fontSetting: H3.Report.FontSetting = this.global.styles.fontSetting;
    const chartFont =
      this.element && this.element.styles && this.element.styles.fontSetting
        ? this.element.styles.fontSetting
        : {
            titleColor: null,
            fontColor: null
          };
    let picOpt: any = {
      transition: "all .3s"
    };
    if (fontSetting.titleColor) {
      Object.assign(picOpt, {
        color: chartFont.titleColor || fontSetting.titleColor
      });
    }

    if (elementCoat.type === CoatType.BGCOLOR) {
      Object.assign(picOpt, {
        background: elementCoat.value
      });
    } else {
      if (elementCoat.type === CoatType.BGPICTURE) {
        const bgUrl: string = require(`@h3/report-mobile/basics/assets/dashboard-pro/theme/${elementCoat.value}`);
        Object.assign(picOpt, {
          backgroundImage: "url(" + bgUrl + ")",
          "background-size": "100% 100%"
        });
      }
    } 
    if (this.element && (this.element as any).styles && (this.element as any).styles.elementCoat) {
      picOpt = (this.element as any).styles.elementCoat.value
        ? {
            backgroundColor: (this.element as any).styles.elementCoat.value,
            color: chartFont.titleColor || fontSetting.titleColor
          }
        : picOpt;
    }
    return picOpt;
    // const value = chart && (chart.styles && chart.styles.elementCoat && chart.styles.elementCoat.value) || this.global && this.global.styles.elementCoat.value;
    // return `background-color:${value}`;
  }
 
  /**
   * 更新图表数据
   */
  updateChartsData(data: any) {
    this.setChartsData({ key: this.element.uid, data: data });
  }
  /**
   * 校验多余的字段关系
   */
  checkFieldRelations() {
    let check: boolean = false;
    const mainFields = getChartFields(this.element).filter((item) => item.mainField);
    if (mainFields.length && this.element && (this.element as any).relations) {
      mainFields.forEach((item) => {
        const tmp = ((this.element as any).relations as Array<any>).some(
          (relation) => `${item.mainField}${item.schemaCode}` === relation.objectId,
        );
        if (!tmp) {
          check = true;
        }
      });
    }
    return check;
  }
  /**
   * 处理字段关联关系有没有未被使用的
   * @cb 原始的刷新方法
   */
  async handleDataRefresh(cb = () => {}) {
    if (this.checkFieldRelations()) {
      this.isShow = false;
      if (!this.dataSources[(this.element as any).dataSourceId]) {
        await this.getDataSource(this.element).then(res => {
          handleChartFieldDefaultValues(this.charts, this.dataSources);
          this.isShow = true;
        });
      } else {
        this.isShow = true;
      }
    }
    cb();
  }
 /**
   * 下钻
   */
  drillDown(data) {
    this.$emit("drill-down", data);
  }
  /**
   * 图表注册刷新事件
   */
  registerRefresh({ data, view, load, refreshViewStyles, onlyGetData }) {
    this.chartViewStatus[this.element.uid] = {
      data: this.handleDataRefresh.bind(this, data),
      view: view || (() => {}),
      load: load || (() => {}),
      refreshViewStyles: refreshViewStyles || (() => {}),
      onlyGetData: onlyGetData || (() => {})
    };
  }
  /**
   * 传递全屏事件
   * @param chart
   * @param fullScreenStatus
   */
  fullScreen({ element, fullScreenStatus }) {
    if (!fullScreenStatus) {
      //兼容性判断
      let newActiveChartLayers: any = [];
      if (this.chartRelations[element.uid]) {
        newActiveChartLayers = JSON.parse(JSON.stringify(this.chartRelations[element.uid]));
        newActiveChartLayers.forEach(cChart => {
          cChart.uid = "full-" + cChart.uid;
        });
      } else {
        newActiveChartLayers = [element];
      }
      this.$emit("full-screen", { elements: newActiveChartLayers, fullScreenStatus });
    } else {
      this.$emit("full-screen", { element: element, fullScreenStatus });
    }
  }
  /**
   * 检测是否有下钻或者联动
  */
  checkHasNextLayer(){
    const uid = this.fullScreenStatus ? this.element.uid.slice(5) : this.element.uid;
    if(this.chartRelations[uid]){
      const length = this.chartRelations[uid].length;
      if (length < 2) {return false;}
      const layerIndex = this.element.layerActiveIndex || 0;
      if(layerIndex < length - 1) {
        return true;
      }
    }
    return false;
  }
  /**
   * 点击事件 ,这里分为点击出现详情和下钻的场景，所以需要判断
   */
  clickChart(option: { filters: Array<H3.Report.FieldColumn>; params: any; eventType?: string; }) {
    // 如果是透视图，就需要判断
    const includeChart = [ElementType.TABLE,ElementType.LIST,ElementType.CROSSTABLE];
    console.log('-------------------------')
    this.$emit("clickChart", option, this.element);
    if (option.eventType && option.eventType === "drillDown") {
        //打开详情
        //this.drillDown(option);
        this.$emit('drill-down',option);
    }
    if(option.params && includeChart.includes(option.params.chartType) && option.params.textOverFlow){
      const hasNextLayer = this.checkHasNextLayer();
      const hasLinkage = ((this.element as any).styles.linkage|| []).length;
      const showSheet = option.params.notCanNext ? false : hasNextLayer || hasLinkage;
      this.$emit('clickTableDetail',{
        callBackRefreach: this.clickToNextLayer.bind(this), // dashboard 回调
        tableDetail: option.params ? option.params.tableDetail : [],
        option,
        element:this.element,
      }, showSheet )
     
    } else {
      this.clickToNextLayer(option);
    }
  }

  clickToNextLayer(option) {
    if (!option.filters) {return;}
    const filters = JSON.parse(JSON.stringify(option.filters || []));
    filters.length &&
      filters.forEach((ft) => {
        if (ft.text.length && !ft.text[0]) {
          ft.formula = DateType.None;
        }
      });
    if (!filters) {return;}
    if (this.element.type === ElementType.MAP && option.params && !option.params.data) {return;}
    if (option.params && option.params.notCanNext) {return;} //如果遇到禁止下钻的，就返回
    if (this.element.type === ElementType.RADAR) {
      const backFilter = filters.find((item) => !item.text.length && item.formula === "Equal");
      if (backFilter) {return;}
    }
    if(this.element.type === ElementType.LIST) {
      // 屏蔽关联子表字段的下钻和联动
      if (option.params.isRelations) {return;}
      const hasAddress = filters.find((item) => item.field.specialType === "address");
      if (hasAddress) {return;}
    }
    // 雷达图暂时关闭图表联动功能
   
    // 透视表联动屏蔽地址字段
    if (
      (this.element.type === ElementType.TABLE || this.element.type === ElementType.CROSSTABLE) &&
      filters
    ) {
      const hasAddressFilter = filters.some(
        (item) => item.field.specialType && item.field.specialType === "address",
      );
      if (hasAddressFilter) {
        return hasAddressFilter;
      }
    }
    if (
      filters &&
      this.element.type !== (ElementType.GAUGE as any)
    ) {
      this.setChartLinkage({ chart: this.element, filters: filters, mode: "linkage" });
      const params = {
        chart: this.element,
        filters: this.getFilterOption(filters),
        type: "next"
      };
      if (!this.fullScreenStatus) {
        this.changeChartByFilter(params);
      } else {
        this.$emit("clickChart", params);
      }
    }
  }
  /**
   * 双击事件
  */
  dblClickChart(option){
    this.$emit('dblClickChart',option)
  }
  /**
   * 点击底部面包屑
   */
  changeChartByFilter(options) {
    this.$emit("clicktoNextLayer", options);
    this.setChartLayerLink(options);
    this.refreshChart();
  }
  /**
   * 获取下钻传入的数据
   */
  getFilterOption(filters) {
    let resArr: any = [];
    filters.forEach((f) => {
      const match = resArr.findIndex((c: any) => c.field.uid === f.field.uid);
      if (match < 0) {
        if (f.field.options.hasOwnProperty("aggregateType")) {delete f.field.options.aggregateType;}
        resArr.push(f);
      }
    });
    return resArr;
  }
  
  changeActiveTab(tabInfo) {
    this.$emit("changeActiveTab", tabInfo);
  }

  /**
   * 切换图表时重置
   */
  refreshChart() {
    this.isShow = false;
    this.$nextTick(() => {
      this.isShow = true;
    });
  }
  async created() {
    await this.handleDataRefresh();
  }
}
</script>
