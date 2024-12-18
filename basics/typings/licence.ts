declare namespace H3 {
  namespace Licence {
    /**
     * 角色控制
     */
    interface Role<T, D, F> {
      // 角色键值
      key: string;
      // 角色名称
      name?: string;
      // 角色权重
      weight: number;
      // 角色模块权限
      authority: Authority<T, D, F>;
    }
    /**
     * 报表体系权限控制
     */
    interface Authority<T, D, F> {
      view?: T;
      design?: D;
      fullScreen?: F;
    }

    /**
     * 统计分析模块权限
     */
    interface AnalysisAuthority {
      // 公共模块编辑权限
      Public?: H3.Analysis.PublicView;
      // 个人模块编辑权限
      Person?: H3.Analysis.PersionView;
      // 图表配置集合
      Chart?: H3.Analysis.ChartController;
      // 设计器
      Designer?: H3.Analysis.Design;
    }

    /**
     * 新仪表盘基础权限
     */
    interface DashboardAuthority {
      // 是否可新增
      add?: boolean;
      // 工具
      tool?: Array<string>;
      // 修改名称
      rename?: boolean;
      // 全局样式设置权限
      globalStyle?: boolean;
      // 编辑权限 包含编辑图表 图表布局
      edit?: boolean;
    }

    enum ModulesType {
      Public = "Public",

      Person = "Person",

      Chart = "Chart",

      Designer = "Designer"
    }
  }
}
