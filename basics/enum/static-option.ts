import { ToolsBarType } from "@h3/report-mobile/basics/enum/element-tools";
import { TabState } from "@h3/report-mobile/basics/enum/module-state";

/**
 * 工具栏confirm配置
 */
const deleteConfirm = {
  title: "确认要删除该图表吗?",
  okText: "确定",
  cancelText: "取消"
};
/**
 * 数值格式设置
 */
export const setOption = {
  icon: "iconsetting-o",
  label: "数值格式"
};

/**
 * 图例默认选项
 */
export const sortOptions: Array<{ value: string; label: string }> = [
  {
    label: "默认",
    value: ""
  },
  {
    label: "升序",
    value: "asc"
  },
  {
    label: "降序",
    value: "desc"
  }
];

/**
 * 图例默认选项
 */
export const LegendOptions: Array<{ value: string; label: string }> = [
  {
    value: "hide",
    label: "隐藏"
  },
  {
    value: "bottom",
    label: "底部"
  },
  {
    value: "top",
    label: "顶部"
  },
  {
    value: "left",
    label: "左边"
  },
  {
    value: "right",
    label: "右边"
  }
];

/**
 * 数据标签选项
 */
export const NumberTagOptions: Array<{ value: string | number; label: string }> = [
  {
    value: 0,
    label: "隐藏"
  },
  {
    value: 1,
    label: "显示"
  }
];
/**
 * 数据标签选项
 */
export const TabOptions: Array<{ value: TabState; label: string }> = [
  {
    label: "公共",
    value: TabState.PUBLIC
  },
  {
    label: "个人",
    value: TabState.PERSON
  }
];

/**
 * 图表工具栏默认配置
 */
export const ToolBarMaps: any = {
  [ToolsBarType.EXPORT]: {
    label: "导出Excel",
    value: ToolsBarType.EXPORT,
    icon: "icondownload-o",
    callBackName: ""
  },
  [ToolsBarType.REFRESH]: {
    label: "刷新",
    value: ToolsBarType.REFRESH,
    icon: "iconreload-o1",
    callBackName: ToolsBarType.REFRESH
  },
  [ToolsBarType.NARROW]: {
    label: "退出全屏",
    value: ToolsBarType.NARROW,
    icon: "iconfullscreen-restore-ox",
    callBackName: ToolsBarType.NARROW
  },
  [ToolsBarType.FULLSCREEN]: {
    label: "全屏",
    value: ToolsBarType.FULLSCREEN,
    icon: "iconfullscreen-ox",
    callBackName: ToolsBarType.FULLSCREEN
  },
  [ToolsBarType.SORT]: {
    label: "排序",
    value: ToolsBarType.SORT,
    icon: "iconsort-o",
    callBackName: ToolsBarType.SORT
  },
  [ToolsBarType.EDIT]: {
    label: "编辑",
    value: ToolsBarType.EDIT,
    icon: "iconedit-o",
    callBackName: ToolsBarType.EDIT
  },
  [ToolsBarType.REMOVE]: {
    label: "删除",
    value: ToolsBarType.REMOVE,
    icon: "icondelete-o",
    confirm: deleteConfirm,
    callBackName: ToolsBarType.REMOVE
  },
  [ToolsBarType.DRAG]: {
    label: "拖拽",
    value: ToolsBarType.DRAG,
    icon: "icondrag-o",
    event: "mousedown",
    callBackName: ToolsBarType.DRAG
  }
};
