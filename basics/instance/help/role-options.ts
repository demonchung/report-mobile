import { ToolsBarType } from "@h3/report-mobile/basics/enum/element-tools";
/**
 * 统计分析角色默认值
 */
export const role: Array<H3.Licence.Role<
  H3.Licence.AnalysisAuthority,
  H3.Licence.AnalysisAuthority,
  H3.Licence.AnalysisAuthority
>> = [
  {
    // 角色键值
    key: "admin",
    // 角色名称
    name: "管理员",
    // 角色权重
    weight: 1,
    // 角色模块权限
    authority: {
      view: {
        Public: {
          add: true,
          rename: true,
          tool: [
            ToolsBarType.FILTER,
            ToolsBarType.REFRESH,
            ToolsBarType.SORT,
            ToolsBarType.COMPARE,
            ToolsBarType.FULLSCREEN,
            ToolsBarType.EDIT,
            ToolsBarType.REMOVE,
            ToolsBarType.DRAG
          ]
        },
        Person: {
          add: true,
          rename: true,
          tool: [
            ToolsBarType.FILTER,
            ToolsBarType.REFRESH,
            ToolsBarType.SORT,
            ToolsBarType.COMPARE,
            ToolsBarType.FULLSCREEN,
            ToolsBarType.EDIT,
            ToolsBarType.REMOVE,
            ToolsBarType.DRAG
          ]
        }
      },
      design: {
        Public: {
          rename: true,
          tool: [ToolsBarType.FILTER, ToolsBarType.REFRESH, ToolsBarType.SORT,ToolsBarType.COMPARE, ToolsBarType.EDIT, ToolsBarType.REMOVE]
        },
        Person: {
          rename: true,
          tool: [ToolsBarType.FILTER, ToolsBarType.REFRESH, ToolsBarType.SORT,ToolsBarType.COMPARE,ToolsBarType.EDIT, ToolsBarType.REMOVE]
        }
      }
    }
  },
  {
    // 角色键值
    key: "member",
    // 角色名称
    name: "成员",
    // 角色权重
    weight: 0,
    // 角色模块权限
    authority: {
      view: {
        Public: {
          add: false,
          rename: false,
          tool: [ToolsBarType.FILTER, ToolsBarType.REFRESH, ToolsBarType.SORT,ToolsBarType.COMPARE, ToolsBarType.FULLSCREEN]
        },
        Person: {
          add: true,
          rename: true,
          tool: [
            ToolsBarType.FILTER,
            ToolsBarType.REFRESH,
            ToolsBarType.SORT,
            ToolsBarType.COMPARE,
            ToolsBarType.FULLSCREEN,
            ToolsBarType.EDIT,
            ToolsBarType.REMOVE,
            ToolsBarType.DRAG
          ]
        }
      },
      design: {
        Public: {
          rename: false,
          tool: [ToolsBarType.FILTER, ToolsBarType.REFRESH, ToolsBarType.SORT,ToolsBarType.COMPARE,]
        },
        Person: {
          rename: true,
          tool: [ToolsBarType.FILTER, ToolsBarType.REFRESH, ToolsBarType.SORT, ToolsBarType.COMPARE,ToolsBarType.EDIT, ToolsBarType.REMOVE]
        }
      }
    }
  }
];

export const DashboardRole: Array<H3.Licence.Role<
  H3.Licence.DashboardAuthority,
  H3.Licence.DashboardAuthority,
  H3.Licence.DashboardAuthority
>> = [
  {
    // 角色键值
    key: "admin",
    // 角色名称
    name: "管理员",
    // 角色权重
    weight: 1,
    // 角色模块权限
    // 外面：导出、联动、刷新、放大、排序、筛选；； 里面：编辑、复制、删除
    authority: {
      view: {
        add: true,
        rename: true,
        globalStyle: true,
        edit: true,
        tool: [
          ToolsBarType.EDITIMAGE,
          ToolsBarType.UPLOAD,
          ToolsBarType.EDITWEB,
          ToolsBarType.EDITTAB,
          ToolsBarType.EXPORT,
          ToolsBarType.LINKAGE,
          ToolsBarType.REFRESH,
          ToolsBarType.FULLSCREEN,
          ToolsBarType.COMPARE,
          ToolsBarType.SORT,
          ToolsBarType.FILTER,
          ToolsBarType.EDIT,
          ToolsBarType.RENAME,
          ToolsBarType.COPY,
          ToolsBarType.REMOVE,
        ]
      },
      design: {
        rename: true,
        tool: [ToolsBarType.EXPORT,ToolsBarType.COMPARE, ToolsBarType.SORT, ToolsBarType.FILTER]
      },
      fullScreen: {
        add: false,
        rename: false,
        globalStyle: false,
        edit: false,
        tool: [
          ToolsBarType.EXPORT,
          ToolsBarType.LINKAGE,
          ToolsBarType.REFRESH,
          ToolsBarType.FULLSCREEN,
          ToolsBarType.SORT,
          ToolsBarType.FILTER
        ]
      }
    }
  },
  {
    // 角色键值
    key: "member",
    // 角色名称
    name: "成员",
    // 角色权重
    weight: 0,
    // 角色模块权限
    authority: {
      view: {
        add: false,
        rename: false,
        globalStyle: false,
        edit: false,
        tool: [
          ToolsBarType.EXPORT,
          ToolsBarType.LINKAGE,
          ToolsBarType.REFRESH,
          ToolsBarType.FULLSCREEN,
          ToolsBarType.COMPARE,
          ToolsBarType.SORT,
          ToolsBarType.FILTER
        ]
      },
      design: {
        rename: false,
        tool: []
      },
      fullScreen: {
        add: false,
        rename: false,
        globalStyle: false,
        edit: false,
        tool: [
          ToolsBarType.EXPORT,
          ToolsBarType.LINKAGE,
          ToolsBarType.REFRESH,
          ToolsBarType.FULLSCREEN,
          ToolsBarType.SORT,
          ToolsBarType.FILTER
        ]
      }
    }
  }
];
