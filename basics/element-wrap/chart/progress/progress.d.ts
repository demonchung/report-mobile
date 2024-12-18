declare namespace H3 {
  namespace Chart {
    interface ProgressBar {
      type: H3.Report.ElementType;
      uid: string;
      data: Array<any>;
      dataAlias: { [key: string]: string }[];
      dimension: Array<H3.Report.FieldColumn>;
      metric: Array<H3.Report.FieldColumn>;
      progressLabel?: H3.Report.ProgressLabel;
      sortPercent?: number;
      colors: Array<string> | null; // 主题颜色
      fontColor: string | null; // 字体颜色
      limit?: number | null; // 数据显示设置
      isTransparent: boolean; // 是否是深色透明背景
      customSort?:any;
      fontSize: number; // 标签文字
      defaultFontColor: string;
    }
  }
}
