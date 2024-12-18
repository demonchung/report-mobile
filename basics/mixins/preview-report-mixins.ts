import { Vue, Component, Prop,Provide } from "vue-property-decorator";
import { ReportState } from "@h3/report-mobile/basics/enum/report-state";
import { reportState } from "@h3/report-mobile/basics/store/dashboard";
import { ReportAction, ReportMutation } from "@h3/report-mobile/basics/store/dashboard/types";
import { namespace } from "vuex-class";
import options from "@h3/report-mobile/dist/options";

const Dashboard = namespace("report");

@Component({
  name: "h3-preview-report-mixins"
})
export default class PreviewReportMixins extends Vue {
  
  @Dashboard.State("globalFilters") globalFilters!: Array<H3.Report.GlobalFilter>;
  
  prefixCls = "h3-preview-report-mixins";


  /**
   * 过滤器个数
   */
   get filterLength() {
    return this.globalFilters.length;
  }

  /**
   * 过滤器激活文本
   */
   getText() {
    if (this.filterLength == 1) {
      return this.filterLength ? `${this.filterLength}${this.$r_language.normal.term}` : "";
    } else {
      return this.filterLength ? `${this.filterLength}${this.$r_language.normal.terms}` : "";
    }
  }

  /**
   * 编辑单个图表
   */
   @Provide()
  editElement(elementId) {
    this.$emit("edit", elementId);
  }

  @Provide()
  copyElement(item, e) {
    this.$emit("copy", item, e);
  }

  @Provide()
  setLog(key, value) {
  }


}
