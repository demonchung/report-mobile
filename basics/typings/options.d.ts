declare namespace H3 {
  namespace Report {
    enum messageType {
      ERROR = "error",
      SUCCESS = "success",
      INFO = "info",
      WARNING = "warning"
    }
    /**
     * 报表配置项
     */
    interface Options {
      /**
       * 列表分析用的(暂时)
       */
      axios: any;
      /**
       * 请求的地址
       */
      baseUrl: string | null;
      /**
       *  自定义用户配置信息
       *  例如氚云:
       *  {
       *    token: null,
       *    extra: {}
       *  };
       */
      config: object | null;
      /**
       * 报表关联公司的ID
       */
      corpId: string | null;
      /**
       * 仪表盘的ID
       */
      reportId: string | null;
      /**
       *  整合业务组件
       *  Function
       * 处理Component模型  h(Component, {
        props: {
          value: this.value
        },
        on: {
          input: this.handleValue,
        }
      }),
       * @param field
       * @return Component 支持v-mode  返回Array<string | number | Object({ label, value })>
       */
      integrateComponents: Function | null;
      /**
       * 字段类型分类
       *  Function
       *  param field
       * @return Array<number> 字段分类的组别
       */
      classification: Function | null; // 字段类型分类

      message: { [key in messageType]: Function } | null;

      WebConfig: WebConfig;
    }

    /**
     * 动画组
     */
    interface AnimationGroup {
      // 缓进
      zoomIn?: Function;
      // 缓出
      zoomOut?: Function;
    }
    interface WebConfig {
      linkProtocol: string[];
    }
  }
}
