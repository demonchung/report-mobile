import { guid } from "../../utils/uid";
import { ElementType, ChartUseType } from "../../enum/chart-type";

let charNum = new Date().getTime();

class BaseInstance implements H3.Report.BaseElement {
  uid: string; // 图表UID
  title = "未命名的图表"; // 图表标题
  type: ElementType; // 图表类型
  i: number; // z-index
  x: number = 0; // 坐标X
  y: number = 0; // 坐标Y
  w: number = 16; // 宽度
  h: number = 8; // 高度
  minW = 4; // 最小宽度
  minH = 4; // 最小长度
  handleActive = false; // 是否被激活

  // 新版数据结构均包含此三个字段
  dataSourceId: string | null = null; // 数据源ID
  authorization: number | null = 0; // 数据权限 0, 1
  useType: ChartUseType | null = 1; // /使用类型，1-表示直连数据库，100-表示ETL
  constructor(type: ElementType, oldChart?: H3.Report.BaseElement) {
    this.type = type;
   
    this.i = new Date().getTime();
    this.uid = guid();
  }
}

/**
 * 富文本实例类
 */
class LongTextInstance extends BaseInstance implements H3.Report.LongText {
  edit: boolean = false;
  content: string = "";
  // 临时使用，过后删除
  minH = 2; // 最小高度
  constructor(type: H3.Report.ElementType, oldChart?: H3.Report.LongText) {
    super(type, oldChart);
    this.title = "未命名的文本";
    if (oldChart) {
      Object.assign(this, oldChart);
    }
  }
}
/**
 * 图片实例
 */
class ImageInstance extends BaseInstance implements H3.Report.Image {
  mode: string= 'adaptive';
  content: string = "";
  fileName: string = "";
  constructor(type: H3.Report.ElementType, oldChart?: H3.Report.Image) {
    super(type, oldChart);
    this.title = "";
    if (oldChart) {
      Object.assign(this, oldChart);
    }
  }
}

/**
 * web 组件实例
 */
 class WebInstance extends BaseInstance implements H3.Report.WEB {
  content: string = "";
  fileName: string = "";
  constructor(type: H3.Report.ElementType, oldChart?: H3.Report.WEB) {
    super(type, oldChart);
    this.title = "";
    if (oldChart) {
      Object.assign(this, oldChart);
    }
  }
}
/**
 * Tabs 组件实例
 */
class TabsInstance extends BaseInstance implements H3.Report.Tab {
  tabs: Array<H3.Report.TabItem> = [{title: 'Tab 1',chartIds: []},{title: 'Tab 2',chartIds: []}];
  visibleTitle: boolean = false;
  h: number = 12; // 高度
  constructor(type: H3.Report.ElementType, oldChart?: H3.Report.Tab) {
    super(type, oldChart);
    this.title = "未命名的Tab组件";
    if (oldChart) {
      Object.assign(this, oldChart);
    }
  }
}


/**
 * 过滤器实例类
 */
class FilterInstance extends BaseInstance implements H3.Report.FilterPicker {
  w: number = 12; // 宽度
  h: number = 3; // 高度
  minH = 3; // 最小长度
  chartIds: Array<string> = [];
  dataSources: Array<any> = [];
  format: string = "";
  formula: string = "";
  field!: H3.Report.FieldColumn;
  text: Array<string | number | any> = [];
  constructor(type: H3.Report.ElementType, oldChart?: H3.Report.FilterPicker) {
    super(type, oldChart);
    this.title = "";
    if (oldChart) {
      Object.assign(this, oldChart);
    }
  }
}

/**
 * 图表基础实例类
 */
export default class ChartBaseInstance extends BaseInstance implements H3.Report.Chart {
  resize = false; // 是否在resize
  data: H3.Report.ChartDataGroup = {} as any;
  styles: H3.Report.ChartStyleGroup = {};
  authorization: number = 1;
  linkageFilter: Array<H3.Report.FilterFieldColumn> = [];
  filterPicker: { [FilterPickerId: string]: Array<H3.Report.FilterFieldColumn> } = {};
  layerFilter: Array<H3.Report.FilterFieldColumn> = [];

  constructor(type: H3.Report.ElementType, oldChart?: H3.Report.Chart) {
    super(type, oldChart);
    if (oldChart) {
      Object.assign(this, oldChart, {
        type
      });
    }
    if (this.useType === null) {
      this.useType = 1;
    }
  }
}

/**
 * 创建元件实例
 * @param elementType 元件类型
 * @param oldElement 旧元件
 */
export function createElementInstance(
  elementType: H3.Report.ElementType,
  oldElement?: H3.Report.BaseElement
) {
  let element: H3.Report.Chart | H3.Report.FilterPicker | H3.Report.LongText | H3.Report.Image | H3.Report.WEB | H3.Report.Tab;
  switch (elementType) {
    case ElementType.TAB:
      element = new TabsInstance(elementType, oldElement as H3.Report.Tab);
      break;
    case ElementType.LONGTEXT:
      element = new LongTextInstance(elementType, oldElement as H3.Report.LongText);
      break;
    case ElementType.FILTERPICKER:
      element = new FilterInstance(elementType, oldElement as H3.Report.FilterPicker);
      break;
    case ElementType.IMAGE:
      element = new ImageInstance(elementType, oldElement as H3.Report.Image);
      break;
    case ElementType.WEB:
      element = new WebInstance(elementType, oldElement as H3.Report.WEB);
      break;
    default:
      element = new ChartBaseInstance(elementType, oldElement as H3.Report.Chart);
      break;
  }
  return element;
}

export { LongTextInstance, FilterInstance, ChartBaseInstance,ImageInstance };
