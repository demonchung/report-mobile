import { Component, Prop, Vue } from "vue-property-decorator";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";

@Component({})
export default class TableMixin extends Vue {
  @Prop({ default: "design" }) status!: "design" | "report" | "preview";
  /**
   * 处理元素头部button
   * @param element
   */
  handleTools(element: H3.Report.BaseElement) {
    const tools: any = [];
    let data: H3.Report.ChartDataGroup;
    switch (element.type) {
      case H3.Report.ElementType.LONGTEXT:
      case H3.Report.ElementType.FILTERPICKER:
        if (this.status === "design") {
          tools.push(H3.Element.ToolsBarType.REMOVE);
        }
        break;
      case H3.Report.ElementType.FUNNEL:
        tools.push(H3.Element.ToolsBarType.REFRESH);
        break;
      case H3.Report.ElementType.TABLE:
        tools.push(H3.Element.ToolsBarType.REFRESH, H3.Element.ToolsBarType.SORT);
        break;
      case H3.Report.ElementType.CARD:
        if ((element as H3.Report.Chart).data.dimension.length) {
          tools.push(H3.Element.ToolsBarType.SORT);
        }
        tools.push(H3.Element.ToolsBarType.REFRESH);
        break;
      case H3.Report.ElementType.SCATTER:
        tools.push(H3.Element.ToolsBarType.REFRESH);
        break;
      default:
        data = (element as H3.Report.Chart).data as H3.Report.ChartDataGroup;
        if (
          [...data.dimension, ...data.metric, ...(data.groupDimension ? data.groupDimension : [])]
            .length
        ) {
          tools.push(H3.Element.ToolsBarType.SORT);
          // icons.sort = element.type !== ElementType.LIST
        }
        tools.push(H3.Element.ToolsBarType.REFRESH);
        break;
    }
    const extraTools = this.handleExtraTools(element);
    tools.push(...extraTools);

    return tools;
  }

  /**
   * 处理状态不同图表拥有的工具栏
   * @param element 图表组件
   */
  handleExtraTools(element: H3.Report.BaseElement): H3.Element.ToolsBarType[] {
    const tools: H3.Element.ToolsBarType[] = [];
    if (this.status === "design") {
      tools.push(H3.Element.ToolsBarType.REMOVE);
    } else {
      // 雷达图暂时关闭图表联动功能
      if (
        element.type !== (ElementType.CARD as any) &&
        element.type !== (ElementType.RADAR as any)
      ) {
        if (
          (element as H3.Report.Chart).styles &&
          (element as H3.Report.Chart).styles.linkage &&
          ((element as H3.Report.Chart).styles as any).linkage.length
        ) {
          tools.push(H3.Element.ToolsBarType.LINKAGE);
        }
      }
      if (element.type !== (ElementType.FILTERPICKER as any)) {
        tools.push(H3.Element.ToolsBarType.FULLSCREEN);
      }
      if (element.type === (ElementType.TABLE as any)) {
        if ((element as H3.Report.Chart).styles.download) {
          tools.push(H3.Element.ToolsBarType.EXPORT);
        }
      }
      if (element.type === (ElementType.LIST as any)) {
        // icons.sort = false;
        if ((element as H3.Report.Chart).styles.download) {
          tools.push(H3.Element.ToolsBarType.EXPORT);
        }
      }
    }
    return tools;
  }
}
