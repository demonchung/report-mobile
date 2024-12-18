<template>
  <div
    ref="tabsContainer"
    :class="[prefixCls, isDark? 'dark': '' ]"
    :uid="chart.uid" 
    :activeTab="activeTab"
  >
    <div :class="[`${prefixCls}__head`]" ref="tabHeader">
      <div 
        v-if="visibleTitle" 
        :class="`${prefixCls}__head-title`" 
        :title="chart.title || ''"
      >
        {{ chart.title || '' }}
      </div>
      <div :class="`${prefixCls}__head-right`"> 
        <div :class="`${prefixCls}__label`"> 
          <div
            :class="[`${prefixCls}__tab-title`, activeTab === index? 'active' : '']"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="changeActiveTab(index)"
            :title="tab.title"
          >
            {{ tab.title }}
          </div>
        </div>   
      </div>
    </div>
    <template v-for="(tab, index) in tabs">
      <div 
        :class="[`${prefixCls}__content`]"
        :key="index"
        v-if="activeTab === index"
      >
        <slot 
          v-if="tab.chartIds && tab.chartIds.length"
          :class="[`${prefixCls}__content-wrap`]" 
          name="tabContent"
          :data="activeTab"
        ></slot>
   
        <!-- <div 
          v-if="tab.chartIds && tab.chartIds.length" 
          :class="[`${prefixCls}__content-wrap`]"
        >
        </div> -->
        <div v-else :class="`${prefixCls}__placeholder`">
          <div class="empty-img"></div>
          <span class="empty-label">拖拽添加图表或组件</span>
        </div>
      </div>
    </template>
    
   
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ThemeColorType } from "@h3/report-mobile/basics/enum/paint";
import { dashboardApi } from "@h3/report-mobile/basics/service/dashboard";
import H3Loading from "@h3/report-mobile/basics/components/loading";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";

@Component({
  name: "h3-report-tabs",
  components: {
    H3Loading
  }
})
export default class TabsWrap extends Vue {
  @Prop() chart!: H3.Report.Tab;
  @Prop() global!: H3.Report.Global;
  @Prop({ default: true }) editable!: boolean; // 是否可以编辑表盘
  @Prop({ default: false }) mobileMode!: boolean; //是否是移动段布局
  prefixCls = "h3-report-tabs"
  tabs: Array<H3.Report.TabItem> = [];
  visibleTitle: boolean = true; //是否显示标题
  activeTab:number = 0; // 默认选中第一个Tab页
  isMobile = isMobile;

  @Watch("chart", { immediate: true, deep: true  })
  changeParamValue(element) {
    this.tabs = element.tabs;
    this.visibleTitle = element.visibleTitle;
  }

  get isDark() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }

  changeActiveTab(index) {
     const tabInfo = {
      currIndex: index, // 当前选中的tab索引
      isChangeIdx: this.activeTab !== index // 索引是否改变
     }
     this.activeTab = index;
     this.$emit('changeActiveTab',tabInfo);
  }

  @Watch("tabs", { deep: true })
  autoChangeActiveTab(tabs, oldtabs) {
    if (this.activeTab + 1 > this.tabs.length) {
      this.activeTab = this.activeTab - 1;
    }
    if (tabs && oldtabs && tabs.length === oldtabs.length) {
      const oldItem = oldtabs.find((item, index) => index === this.activeTab);
      if (oldItem) {
        const newIndex = tabs.findIndex((item) => item === oldItem);
        this.activeTab = newIndex > -1 ? newIndex : this.activeTab;
      }
    }
  }

  created() {
    const { tabs, visibleTitle, title } = this.chart as H3.Report.Tab;
    this.tabs = tabs;
    this.visibleTitle = visibleTitle;
    this.$emit("register-refresh", {
      data: () => {
      },
      view: () => {
      }
    });
  }

  changeWidthSmall() {
    let container = this.$refs.tabHeader as HTMLElement;
    if (this.chart && container) {
      if (this.mobileMode) {
        container.style.width = "calc(100% - 48px)";
      }
      if (!this.mobileMode && !isMobile && this.chart.y === 0) {
        container.style.width = "calc(100% - 84px)";
      }
    }
  }
  changeWidth() {
    let container = this.$refs.tabHeader as HTMLElement;
    if (container) {
      container.style.width = "100%";
    }
  }
  mounted() {
    setTimeout(() => {});
    let container = this.$refs.tabsContainer as HTMLElement;
    container && container.addEventListener("mouseover", this.changeWidthSmall);
    container && container.addEventListener("mouseout", this.changeWidth);
  }
}
</script>
