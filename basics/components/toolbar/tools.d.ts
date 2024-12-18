declare namespace H3 {
  namespace Toolbar {
    interface Options {
      label?: string; // 描述说明
      value: string; // 值
      icon: string; // 图标
      isMore?: boolean; // 是否放在更多里面
      color?: string; // 颜色 有默认
      confirm?: any;
      callBackName?: string; // 毁掉函数名
      fn?: Function; // 点击回调
    }
  }
}
