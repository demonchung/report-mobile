import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class DataSourceFlowList extends Vue {
  /**
   * 更新滚动条
   */
  refreshScroll(scrollDiv: any) {
    if (scrollDiv) {
      scrollDiv.setScrollBar();
    }
  }
}
