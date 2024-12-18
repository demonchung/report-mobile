declare namespace H3 {
  namespace ReportConfirm {
    /**
     * 确认窗控件
     */
    export interface Options {
      /**
       * 标题
       */
      title?:string
      /**
       * router
       */
      router?: any
      /**
       * store
       */
      store?: any,
      /**
       * 内容是字符串或者render函数
       */
      content?: string | Function;
      /**
       * 窗体宽度
       */
      width?: number;
      /**
       * 确认事件
       * @params e 事件源
       * @params content 内容对象
       */
      ok?: Function;
      /**
       * 取消事件
       * @params e 事件源
       * @params content 内容对象
       */
      cancel?: Function;
      /**
       * 默认按键 ['cancel', 'ok']
       */
      buttons?: Array<Button>
      /**
       * 是否显示蔗遮罩
       */
      showMask?: boolean
      /**
       * 确认按钮样式
       */
      primaryButtonStyle?: string
      /**
       * 容器样式名
       */
      wrapClassName?: string

    }
    export interface Button {
      label: string // 显示名称
      type: string  // antd 类型
      click: Function // 点击事件
      id?: string // 按钮id
    }
  }

}


