declare namespace H3 {
  namespace Chart {
    interface Card {
      data: Array<any>; // 图表数据
      resizeState: boolean; //跟新状态
      dataAlias: { [key: string]: string }; // 数据别名
      dimension: H3.Report.FieldColumn | null;
      size: string | null;
      textAlign: string | null;
      metric: H3.Report.FieldColumn | null;
      showTitle: boolean;
      limit: number; // 数据显示设置
      fontColor: string; // 字体颜色
      isTransparent: boolean; // 是否是深色透明背景
      fontSize?: number; // 固定字体大小
      customSort?: number; // 自定义排序
      cardSetting: H3.Report.CardSetting; // 指标设置
      cardMode: H3.Report.CardMode; // 指标图模式
    }
  }
}
