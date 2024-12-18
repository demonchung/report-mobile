<script lang="ts">
import { CreateElement, VNode } from "vue";
import { Component, Prop, Mixins } from "vue-property-decorator";
import chartMixins from "@h3/report-mobile/basics/mixins/chart-mixins";
import { judgeMobile } from "@h3/report-mobile/basics/utils/browser";
import { ResponseCode } from "@h3/report-mobile/basics/enum/response-code";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { ThemeColorType } from "@h3/report-mobile/basics/enum/paint";

@Component({
  name: "h3-report-chart-wrap-placeholder",
  components: {}
})
export default class ReportChartWrap extends Mixins<chartMixins>(chartMixins) {
  @Prop({ default: null }) chart!: H3.Report.Chart;
  @Prop({ default: null }) errorMsg!: string;
  @Prop({ default: "" }) comPrefixCls!: string;
  @Prop({ default: "" }) isLoadData!: string;
  @Prop({ default: null }) data!: any;
  @Prop({ default: null }) global!: H3.Report.Global;
  // prefixCls = `${this.comPrefixCls}__placeholder`;

  /**
   * 无内容图表缺省图映射
   */
  get chartPlaUrl() {
    const chartMap = {
      [ElementType.MAP]: this.isDark ? "map-dark" : "map", // 地图
      [ElementType.BAR]: this.isDark ? "bar-dark" : "bar", // 柱状图
      [ElementType.PILEBAR]: this.isDark ? "pileBar-dark" : "pileBar", // 堆叠柱状图
      [ElementType.STRIPE]: this.isDark ? "stripe-dark" : "stripe", // 条形图
      [ElementType.PILESTRIPE]: this.isDark ? "pileStripe-dark" : "pileStripe", //堆叠条形图
      [ElementType.LINE]: this.isDark ? "line-dark" : "line", // 折线图
      [ElementType.AREA]: this.isDark ? "area-dark" : "area", // 面积图
      [ElementType.PIE]: this.isDark ? "pie-dark" : "pie", // 饼图
      [ElementType.FUNNEL]: this.isDark ? "funnel-dark" : "funnel", // 漏斗图
      [ElementType.RADAR]: this.isDark ? "radar-dark" : "radar", // 雷达图
      [ElementType.TABLE]: this.isDark ? "list-dark" : "list", // 透视图
      [ElementType.CROSSTABLE]: this.isDark ? "list-dark" : "list", // 交叉表
      [ElementType.LIST]: this.isDark ? "list-dark" : "list", // 明细表
      [ElementType.CARD]: this.isDark ? "card-dark" : "card", // 指标图
      [ElementType.SCATTER]: this.isDark ? "scatter-dark" : "scatter", // 散点图（气泡图）
      [ElementType.BIAX]: this.isDark ? "biax-dark" : "biax", // 双轴图
      [ElementType.PROGRESSBAR]: this.isDark ? "progressBar-dark" : "progressBar", // 进度图
      [ElementType.GAUGE]: this.isDark ? "gauge-dark" : "gauge", // 仪表图
      [ElementType.FUNNELCOMPARE]: this.isDark ? "funnelCompare-dark" : "funnelCompare", // 对比漏斗图
      [ElementType.PERCENTPILEBAR]: this.isDark ? "percentPileBar-dark" : "percentPileBar", // 百分比堆积柱状图
      [ElementType.PERCENTPILESTRIPE]: this.isDark ? "percentPileStripe-dark" : "percentPileStripe", // 百分比堆积条形图
    };
    const result = chartMap[this.chart.type] || "bar";
    return require(`@h3/report-mobile/basics/assets/dashboard-pro/chart-placeholder/${result}.png`);
  }

  get emptyPic() {
    return judgeMobile() !== "pc"
      ? require(`@h3/report-mobile/basics/assets/common/m-empty.png`)
      : require(`@h3/report-mobile/basics/assets/common/biax-blue.png`);
  }
  
  get prefixCls() {
    return `${this.comPrefixCls}__placeholder`
  }
  get isDark() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }

  get placeholderLabelStyle() {
    const isDark = ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
    return isDark ? { "chart-placeholder-label-dark": true } : { "chart-placeholder-label": true };
  }
  get placeholderImgStyle() {
    const isDark = ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
    return isDark ? { "chart-placeholder-dark": true } : { "chart-placeholder": true };
  }

  /**
   * 标准图表占位图
   */
  chartRender(h: CreateElement) {
    return h("div", {
      class: {
        "empty-img": true
      },
      style: {
        backgroundImage: `url('${this.emptyPic}')`
      }
    });
  }

  /**
   */

  chartLabelRender(h: CreateElement, text: string) {
    return h(
      "div",
      {
        class: {
          [`${this.prefixCls}--label`]: true
        }
      },
      text
    );
  }
  /**
   * 没有图表渲染
   * @param h
   */
  nullChartRender(h: CreateElement) {
    return [
      h("div", {
        class: {
          "empty-img": true
        },
        style: {
          backgroundImage: `url('${this.emptyPic}')`
        }
      }),
      h(
        "div",
        {
          class: {
            [`${this.prefixCls}--label`]: true
          }
        },
        "报表数据有误或已被删除，请重新配置"
      )
    ];
  }

  /**
   * 空图表
   * @param h
   */
  emptyChartRender(h: CreateElement) {
    return [
      h("div", {
        class: this.placeholderImgStyle,
        style: {
          backgroundImage: `url('${this.chartPlaUrl}')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }
      }),
      h(
        "div",
        {
          class: this.placeholderLabelStyle
        },
        this.$r_language.normal.empty
      )
    ];
  }

  /**
   * 错误图表
   * @param h
   */
  errChartRender(h: CreateElement) {
    let errText = "";
    switch (this.errorMsg) {
      case ResponseCode.FIELDMISSING:
        errText = "您当前字段缺失，请重新设置后查看";
        break;
      case ResponseCode.DATAOVERFLOW:
        errText = "数据量过大，请重新设置";
        break;
      case ResponseCode.MODELNOTEXIST:
        errText = "指定的模型不存在";
        break;
      case ResponseCode.DATASOURCENOTEXIST:
        errText = "指定的数据源不存在";
        break;
      case ResponseCode.LOGINERROR:
        errText = "当前用户未登录";
        break;
      default:
        break;
    }

    return [this.chartRender(h), this.chartLabelRender(h, errText)];
  }

  /**
   * 空数据图表
   * @param h
   */
  emptyDataChartRender(h: CreateElement) {
    return [
      h("div", {
        class: this.placeholderImgStyle,
        style: {
          backgroundImage: `url('${this.chartPlaUrl}')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }
      }),
      h(
        "div",
        {
          class: this.placeholderLabelStyle
        },
        this.$r_language.el.empty
      )
    ];
  }
  render(h: CreateElement) {
    let chartPlaceholder: VNode[] | null = null;
    if (!this.chart) {
      chartPlaceholder = this.nullChartRender(h);
    } else if (!this.checkChart || !this.isLoadData) {
      if (this.errorMsg && this.errorMsg === "error-chart") {
        chartPlaceholder = this.nullChartRender(h);
      } else {chartPlaceholder = this.emptyChartRender(h);}
    } else if (this.isLoadData && this.errorMsg) {
      chartPlaceholder = this.errChartRender(h);
    } else {
      if (this.isLoadData && (!this.data || !this.data.length)) {
        chartPlaceholder = this.emptyDataChartRender(h);
      }
    } 
    return chartPlaceholder
      ? h(
          "div",
          {
            class: {
              [this.prefixCls]: true
            }
          },
          chartPlaceholder
        )
      : null;
  }
}
</script>
