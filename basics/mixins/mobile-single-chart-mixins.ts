import { Vue, Component, Prop,Provide } from "vue-property-decorator";
import { ReportState } from "@h3/report-mobile/basics/enum/report-state";
import { reportState } from "@h3/report-mobile/basics/store/dashboard";
import { ReportAction, ReportMutation } from "@h3/report-mobile/basics/store/dashboard/types";
import { namespace } from "vuex-class";
import { compare } from "@h3/report-mobile/basics/utils/object";
import options from "@h3/report-mobile/dist/options";
import { judgeMobile } from "@h3/report-mobile/basics/utils/browser";
import GlobalInstance from "@h3/report-mobile/basics/instance/modules/global";

const ReportPro = namespace("report");

@Component({
  name: "h3-single-chart-mixins"
})
export default class SingleChartMixins extends Vue {
  @Prop({ default: null }) corpId!: string; // 公司Id
  @Prop({ default: null }) reportId!: string; // 报表Id
  @Prop({ default: null }) chartId!: string; // 图表Id
  @Prop({ default: () => ({}) }) config!: any; // 业务配置
  @Prop({ default: () => null }) integrateComponents!: Function; // 业务整合的服务
  @Prop({ default: () => null }) classification!: Function; // 字段类型分类
  @Prop({ default: () => null }) limit!: any; // 图表指标、行、列限制
  @Prop({ default: () => false }) isWxwork!: boolean;

  @ReportPro.Action(ReportAction.GETREPORTDETAIL) getReportDetail!: Function;
  @ReportPro.Mutation(ReportMutation.SETREPORTOPTIONS) setReportOptions!: Function;
  @ReportPro.Mutation(ReportMutation.RESIZECHARTVIEW) resizeChartView!: Function;
  prefixCls = "h3-single-chart";
  element: H3.Report.BaseElement | null = null;
  global: H3.Report.Global | null = null;
  loading = true;
  fullScreenElement!: any;

  @Provide() getWxEnv = ()=> {
    return this.isWxwork;
  };
  /**
   * 获取class
   */
  get getClass() {
    const cls = {
      [this.prefixCls]: true,
      [judgeMobile() as string]: true
    };
    if (this.global) {
      cls["h3-report-paint"] = this.global.styles.paintCoatTheme !== "default";
      cls[this.global.styles.paintCoatTheme] = true;
    }
    return cls;
  }

  /**
   * 获取仪表盘背景色
   */
  get getStyles() {
    if (!this.global || !this.global.styles.paintCoatTheme) {return true;}
    const paintCoat: H3.Report.PaintCoat = this.global.styles.paintCoat;
    let picOpt: any;
    if (this.global.styles.paintCoatTheme === "default") {
      if (paintCoat.type === "bgColor") {
        picOpt = { backgroundColor: paintCoat.value };
      } else {
        if (this.global.styles.paintCoat.type === "bgPicture") {
          picOpt = {
            backgroundImage: "url(" + paintCoat.value + ")",
            backgroundSize: "100% 100%"
          };
        }
      } 
    } else {
      const bgUrl: string = require("@h3/report-mobile/basics/assets/dashboard-pro/theme/" +
        this.global.styles.paintCoatTheme +
        "-bg.png");
      picOpt = {
        backgroundImage: "url(" + bgUrl + ")",
        backgroundSize: "100% 100%"
      };
    }

    return picOpt;
  }

  /**
   * 设置仪表盘配置项
   */
  setSingleChartOptions() {
    const dashboardOptions: any = {};
    if (this.config) {
      dashboardOptions.config = this.config;
    }
    if (this.corpId) {
      dashboardOptions.corpId = this.corpId;
    }
    if (this.integrateComponents) {
      dashboardOptions.integrateComponents = this.integrateComponents;
    }
    if (this.classification) {
      dashboardOptions.classification = this.classification;
    }
    if (this.limit) {
      compare(options.charts, this.limit);
    }
    this.setReportOptions(Object.assign({}, options, dashboardOptions));
  }
  /**
   * 刷新图表
   */
  refresh() {
    let chart = this.element;
    // PC端的实例，在全屏的情况调用，后续迭代需要优化
    if (this.fullScreenElement && this.fullScreenElement.Instance) {
      chart = this.fullScreenElement.Instance.$children[0].fullScreenElement;
    }
    this.resizeChartView({ chart, type: "data" });
  }
  /**
   * 图表懒加载
   * @param entries
   */
  lazyLoadChart(entries: Array<IntersectionObserverEntry>) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const chartId: string | null = entry.target.getAttribute("data-id");
      if (chartId) {
        this.resizeChartView({ chart: chartId, type: "load" });
      }
    });
  }
  /**
   * 单图表加载
   */
  async loadSingleChart() {
    this.loading = true;
    this.setSingleChartOptions();
    this.getReportDetail({ corpId: this.corpId, reportId: this.reportId, type: ReportState.SINGLE })
      .then(res => {
        if (res) {
          console.log(res,'res====')
          this.element = res.elements.find(
            (element: H3.Report.BaseElement) => element.uid === this.chartId
          );
          this.global = GlobalInstance().global;
          const styles = this.element && (this.element as H3.Report.Chart).styles;
          if (styles) {
            styles.elementCoat = {
              type: null,
              value: ""
            };
            styles.fontSetting = {
              titleColor: null,
              fontColor: null
            };
          }
        }
        this.$emit("chart-loaded");
        this.loading = false;
      })
      .catch(() => {
        this.$emit("chart-loaded");
        this.loading = false;
      });
  }
  async created() {
    if (!this.$store.state.report) {
      this.$store.registerModule("report", reportState);
    }
    await this.loadSingleChart();
  }
}
