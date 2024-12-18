import colors from "@h3/report-mobile/basics/enum/colors";
import { LanguageInfo } from "./type";

const cn: LanguageInfo = {
  normal: {
    help: "帮助文档",
    term: "项",
    terms: "项",
    sure: "确认",
    cancel: "取消",
    input: "请输入",
    directExit: "直接退出",
    saveExit: "保存且退出",
    save: "保存",
    add: "添加",
    close: "关闭",
    empty: "暂无内容",
    default: "默认",
    tip_saveSuc: "保存成功",
    left: "左",
    right: "右",
    tip_saveFail: "保存失败",
    select: "请选择"
  },
  toolbar: {
    imageSelect: {
      labal_originCenter: "原图居中",
      labal_origin: "原图填充",
      labal_draw: "拉伸填充"
    },
    span: {
      uploadImage: "上传图片",
      copy: "复制",
      delete: "删除",
      linkCancel: "取消联动",
      refresh: "刷新",
      fullScreen: "全屏",
      sort: "排序",
      edit: "编辑",
      remove: "删除",
      filter: "筛选",
      fullScreenExit: "退出全屏",
      com: "对比",
      visible: "隐藏",
      editWeb: "编辑超链接",
      rename: '重命名'
    },
    LINKAGE: {
      //取消联动
      tip_nolinkage: "当前没有图表与本图表联动",
      tip_cancelLink: "联动已取消"
    },
    SORT: {
      //排序弹窗
      Oplabal_default: "默认",
      Oplabal_asc: "升序",
      Oplabal_desc: "降序",
      Oplabal_custom: "自定义",
      tip_empty: "暂无排序字段",
      check_addField: "排序字段",
      select_pla: "请选择排序字段",
      Modal_custom: {
        title: "自定义排序",
        searchPla: "请输入",
        tip_noSValue: "无搜索结果",
        tip_emptyValue: "无结果,暂时无法自定义排序",
        check_toTop: "置顶",
        toTopSuc: "已成功置顶"
      }
    },
    FILTER: {
      //筛选
      pla_select: "请选择字段",
      check: " 筛选字段"
    },
    compareSort: {
      title_firstDim: "维度值1",
      title_SecDim: "维度值2"
    },
    editWeb: {
      title: "超链接",
      inputPla: "请输入超链接"
    },
    export: {
      toolTitle: "导出文件",
      click_list: "列表导出",
      click_style: "样式导出"
    }
  },
  el: {
    empty: "您当前没有数据，请添加数据后查看",
    title: "未命名的图表",
    tip_deleteFP: "确定要删除该筛选组件: ",
    image: {
      tip_empty: "拖拽图片到此处或点击上传",
      tip_size: "单个图片不超过5M",
      warn_fail: "当前用户没法上传",
      tip_loading: "正在上传",
      tip_success: "上传完成",
      tip_fail: "上传失败",
      message: "上传中",
      tip_delete: "确定要删除该图片组件吗?",
      tip_ImageType: "格式只支持",
      tip_ImageSize: "图片大小不可超过"
    },
    chart: {
      addmodal: {
        title: "图表组件设置",
        placeholder: "请输入应用或表单名称的关键字",
        tab_formDS: "数据表",
        tab_advancedDS: "高级数据源",
        tip_nosearch: "无搜索结果",
        tip_emptyadv: "暂无高级数据源，请点击",
        tip_emptyDS: "暂无数据"
      },
      tip_delete: "确定要删除该图表:"
    },
    web: {
      modal_title: "超链接设置",
      input_pla: "请输入超链接",
      error_empty: "请输入超链接",
      error_http: "请输入https或http超链接",
      tip_delete: "确定要删除该web组件吗?"
    },
    tab: {
      tip_delete: "该操作会同时删除Tab组件内的图表或组件，是否继续?"
    },
    longtext: {
      tip_empty: "暂无文本内容",
      input_pla: "请输入内容",
      fsize_oversized: "超大",
      fsize_large: "大",
      fsize_small: "小",
      fsize_default: "默认",
      tip_delete: "确定要删除该文本?"
    }
  },
  view: {
    allSum: "汇总",
    pag_des: {
      page_totla: "共",
      page_des: "条",
      page_size: "条/页",
      cpage_size: "列/页",
      cpage_des: "列"
    },
    header: {
      filter: "筛选",
      style: "样式",
      full: "全屏",
      mobile: "移动端布局",
      export: "导出",
      add: "新增组件",
      save: "保存",
      backMain: "移动端布局设置",
      exportImage: "导出图片",
      globalFilter: {
        emptyTip: "暂无筛选字段",
        addFilter: "筛选器",
        filter_title: "筛选器设置",
        selectChart_title: "1.选择图表",
        select_all: "全选",
        filterField_title: "2.设置筛选字段",
        filterOptions_title: "3.设置筛选逻辑",
        filterName: "筛选器名称",
        filterMode: "筛选方式",
        defaultValue: "默认值",
        mode_default: "默认",
        mode_input: "输入文本",
        mode_select: "选择选项",
        input_tip: "请输入名称",
        error_emptyfield: "每个数据源须选择一个字段",
        error_emptychart: "仪表盘图表为空，请配置图表",
        error_selectchart: "请选择图表",
        filterLink_pla: "请选择联动组件",
        filterLink_title: "筛选联动"
      },
      globalStyle: {
        Style_title: "仪表盘样式设置",
        title_styles: "风格",
        theme_auroraWhite: "极光白",
        theme_cherryPink: "樱粉流星",
        theme_interstellar: "星际穿越",
        theme_mirageNeon: "幻彩霓虹",
        theme_black: "静谧黑",
        theme_vastStarry: "浩瀚星海",
        theme_auroraForest: "赤霞橘光",
        theme_dreamStar: "极光森林",
        theme_twelve: "海盐苏打",
        title_background: "背景",
        bgColor: "整体背景颜色",
        component_bgColor: "组件背景颜色",
        title_text: "文字",
        titleColor: "标题文字颜色",
        textColor: "普通文字颜色",
        colorPicker_default: "默认颜色",
        colorPicker_theme: "主题颜色",
        colorPicker_colors: "标准颜色",
        colorPicker_more: "更多颜色",
        changeStyleModal: {
          title: "风格切换",
          content: "执行该操作后原有自定义样式将会被覆盖，是否确定切换风格？"
        },
      },
      mobileLayout: {
        hide_title: "隐藏的图表",
        hide_tip: "小贴士~",
        hide_tip1: "点击左侧隐藏图标隐藏图表, 隐藏的图表不显示在移动端仪表盘中",
        exit_tip: "您对布局的修改尚未保存,是否保存后退出"
      },
      addmodal: {
        title: "新增组件",
        tip_chart: "不同的数据可视化的展现形式，提供十余种图",
        tip_longtext: "插入自定义样式的文本，支持固定文本、超链接",
        tip_filter: "对展示出的图表组件确定范围后再进行过滤",
        tip_image: "展示图片，用于提升仪表盘整体的美观度或展示个性信息",
        tip_web: "插入网页，实时查询网络数据或浏览有关当前数据的网页",
        tip_tabs: "拖拽添加图表或组件到Tab组件中，通过选项卡轻松切换查看不同数据和信息",
        cName_chart: "图表组件",
        cName_text: "文本组件",
        cName_filter: "筛选组件",
        cName_image: "图片组件",
        cName_web: "Web组件",
        cName_tabs: "Tab组件"
      },
      full_screen: {
        title_normal: "普通模式",
        title_self: "自适应模式",
        tip_n: "组件过多时会出现滚动条",
        tip_s: "仪表盘始终占满一整屏"
      },
      Export: {
        tip_loading: "正在生成中...",
        tip_success: "图片已生成！",
        warn: "导出异常，请重试",
        imageName: "仪表盘分享"
      }
    },
    progressCard: {
      title_precent: "占比：",
      title_value: "完成数量：",
      title_target: "目标值：",
      null: "为空"
    },
    container: {
      IniPage: {
        tip_noChart: "暂无图表、组件，请从左上方拖拽新增",
        tip_link: "如何配置您的仪表盘",
        add: "新增组件",
        tip_noData: "暂无图表数据"
      },
      toolbar: {
        uploadImage: "上传图片",
        copy: "复制",
        delete: "删除",
        linkCancel: "取消联动",
        refresh: "刷新",
        fullScreen: "全屏",
        sort: "排序",
        edit: "编辑",
        remove: "删除",
        filter: "筛选",
        fullScreenExit: "退出全屏"
      },
      chartSort: {
        radio_default: "默认",
        radio_rise: "升序",
        radio_drop: "降序",
        radio_customize: "自定义",
        empty_tip: "暂无排序字段"
      },
      chartFilter: {
        field_placeholder: "请选择字段",
        addField: "筛选字段",
        fm_equalTo: "等于",
        fm_notequalTo: "不等于",
        fm_include: "包含",
        fm_notInclude: "不包含",
        fm_anyone: "等于任意一个",
        fm_notAnyone: "不等于任意一个",
        fm_empty: "为空",
        fm_notEmpty: "不为空",
        filterValue: "请添加筛选值",
        filterValue_placeholder: "请输入数值"
      }
    }
  },
  design: {
    ds_title: "数据来源",
    ds_change: "更改",
    ds_chModalTitle: "数据源选择",
    tip_chEmpty: "请选择数据源",
    tip_modalConcent: "更改数据源后，将清空图表所有配置内容，确定需要更改吗？",
    tip_modalTitle: "更改数据源",
    ds_auTitle: "数据权限",
    dsau_person: "使用成员对数据表的权限",
    dsau_all: "数据源表中的全部数据",
    ds_fieldTitle: "字段列表",
    ds_searchPla: "搜索",
    tip_notsave: "您对图表进行的修改尚未保存,是否保存后退出",
    tabOption_ability: "功能",
    tabOption_style: "样式",
    filter: {
      tip_maxFilter: "过滤条件最多支持设置20个字段",
      tip_closeFilter: "收起过滤条件",
      tip_openToadd: "展开添加或条件",
      tip_openToshow: "显示完整过滤条件",
    },
    deData: {
      DF_title: "图层",
      DF_defLay: "图层1",
      DF_showEdLayN: "修改图层名",
      DF_showDelMod: "删除图层",
      DF_delTip: "是否删除该图层？",
      pla: "请拖入左侧字段"
    },
    DF_title: {
      dim_list: "列",
      dim: "维度",
      filter: "过滤条件",
      dim_colum: "列维度",
      dim_row: "行维度",
      metric: "指标",
      metric_left: "指标(左)",
      metric_right: "指标(右)"
    },
    DF_tip: {
      dim: "【维度】是对数据做分类的依据",
      table_RD: "【行维度】是对透视表行数据做分类的依据",
      table_CD: "【列维度】是对透视表列数据做分类的依据",
      metric: "【指标】是要统计的数据，会根据【维度】中设置的分组方式进行汇总计算",
      cross_RD: "【行维度】是对交叉表行数据做分类的依据",
      cross_CD: "【列维度】是对交叉表列数据做分类的依据",
      filter: "1.可将字段按分组进行拖入，组内的筛选条件为'且条件'，各组之间的筛选条件为'或条件' 2. 最多支持使用20个字段配置筛选条件"
    },
    computeField: {
      addTitle: "计算字段",
      tip_forbidAdvanced: "高级数据源不允许创建计算字段，请前往高级数据源进行字段设置！",
      tip_maximum: "单个图表最多支持创建70个计算字段!",
      tip_mutualExclusion: "不支持同时使用聚合函数与非聚合函数!",
      tip_deleteField: "确定删除该计算字段？",
      tip_changefield: "该计算字段已被修改，请重新配置该计算字段!",
      title_copy: "副本"
    }
  },
  modules: {
    switchTypeMode: {
      bar: "柱状图",
      pileBar: "堆叠柱状图",
      stripe: "条形图",
      pileStripe: "堆叠条形图",
      card: "指标卡",
      list: "列表",
      gaugeIn: "内仪表图",
      gaugeOut: "外仪表图",
      area: "区域地图",
      bubble: "气泡地图",
      ring: "圆环",
      solid: "实心",
    },
    AxisYSet: {
      title: "坐标轴",
      AX_title: "坐标X轴",
      AX_disX: "显示坐标轴",
      AX_disXtitle: "显示轴标签",
      AY_title: "坐标Y轴",
      AY_disYtitle: "显示刻度",
      dirTitle: "文字方向",
      DType_Crosswise: "横向",
      DType_Endwise: "纵向",
      DType_LeftBank: "左倾斜",
      DType_RightBank: "右倾斜",
      AY_yTitle: '显示标题',
      placeholder: '请输入标题名',
      AY_yTitle_L: '左Y轴',
      AY_yTitle_R: '右Y轴'
    },
    Legend: {
      title: "图例",
      disLegTitle: "显示图例",
      legPosTitle: "图例位置",
      posType_Bottom: "底部",
      posType_Top: "顶部",
      posType_Left: "左边",
      posType_Right: "右边"
    },
    CardSetting: {
      maxColTitle: "每行最大列数",
    },
    DataLabel: {
      //标签
      title: "标签",
      Optionstitle: "显示数值"
    },
    DataLabelPileSum: {
      //显示堆叠合计
      title: "标签",
      Optionstitle: "显示堆叠合计"
    },
    DataLabelFontSize: {
      //标签字体大小
      title: "标签字号",
    },
    MultipleDataLabel: {
      dimTitle: "显示维度",
      metTitle: "显示数值",
      perTitle: "显示占比"
    },
    MetricLabel: {
      //显示指标名
      title: "显示指标名",
      valueTitle: "显示指标值"
    },
    TextAlign: {
      //文字位置
      title: "文字位置",
      labal_left: "左",
      labal_right: "右",
      labal_center: "中间"
    },
    AdaptiveSize: {
      //比例大小
      title: "比例大小",
      labal_small: "小",
      labal_default: "默认",
      labal_large: "大"
    },
    ProgressLabel: {
      valueTitle: "显示数值",
      percentTitle: "显示占比",
      targetTitle: "显示目标"
    },
    DataLabelPosition: {
      //饼图标签
      title: "标签",
      posTitle: "标签位置",
      pos: "位置",
      pos_pie: "饼图侧",
      pos_legend: "图例侧",
      specPos: "具体位置",
      specPos_out: "图外侧",
      specPos_in: "图内侧"
    },
    ListTextAlign: {
      title: "对齐方式",
      tAlignOp_default: "默认",
      tAlignOp_left: "左",
      tAlignOp_center: "中",
      tAlignOp_right: "右"
    },
    base: {
      //基础信息
      title: "基础信息",
      title_chartColor: "图表颜色",
      title_fontSet: "文字设置",
      title_charts: "图表类型", //图表类型
      typeT_pie: "饼图类型",
      typeT_base: "图表类型",
      typeT_gauge: "仪表图类型",
      typeT_map: "地图类型",
      classify_label: "标签"
    },
    ElementCoat: {
      title: "组件背景"
    },
    FontSetting: {
      //文字设置
      headTitle: "标题文字颜色",
      contentTitle: "普通文字颜色",
      sizeTitle: "字体大小"
    },
    Theme: {
      title: "颜色主题"
    },
    MapTheme: {
      bubbleTitle: "气泡配色",
      mapTitle: "地图配色"
    },
    MapDigitalSet: {
      //地图标签
      dimensionTitle: "显示维度值",
      metricTitle: "显示指标值"
    },
    FilterNone: {
      //维度空值过滤
      title: "维度空值过滤",
      classify: "数据展示",
      tip: "使用说明：<br/> 维度值为空，但其对于指标值不为空时，自动过滤该维度空值及其指标值<br/>注意：当维度为计算字段时，需要在计算字段内使用IFNULL函数或通过筛选进行过滤",
      moduleTitle: "过滤"
    },
    Limit: {
      //显示前N条维度
      title: "显示前N条维度",
      classify: "数据展示",
      input_pla: "请输入正数",
      moduleTitle: "数据显示设置"
    },
    DimensionLimit: {
      //显示前N条维度
      title: "显示前N条维度",
      classify: "数据展示",
      rowNumTitle: "数据条数",
      inpla: "请输入正数"
    },
    GroupSetting: {
      //系列设置
      title: "系列设置",
      classify: "数据展示",
      tip:
        "支持条件：<br/> 数据组合为2维度1指标。<br/> 使用说明：<br/> 系列数目为2维度1指标情况二级维度的分类个数。",
      limitTitle: "系列数目限制",
      inputPla: "请输入期数",
      otherTitle: '超过限制显示为"其他"'
    },
    SwitchLayers: {
      //图层切换
      title: "图层切换",
      tip: "当开启图层切换,直接点击下方相应的图层,<br/> 可完整展示相应图层的内容",
      classify: "数据交互",
      modulesTitle: "图层切换"
    },
    MetricRange: {
      //指标范围
      title: "指标范围",
      classify: "数据展示",
      inputPla: "请输入数值",
      maxTitle: "最大值",
      minTitle: "最小值"
    },
    Linkage: {
      //图表联动
      title: "图表联动",
      classify: "数据交互",
      inpla: "请选择"
    },
    WarningLine: {
      //警戒线
      title: "警戒线",
      click_add: "添加",
      classify: "分析预警",
      modal: {
        title: "警戒线",
        title_name: "名称",
        nameInPla: "请输入警戒线名称",
        title_type: "类型",
        tRadio_fixed: "固定警戒线",
        tInput_pla: "请输入警戒线数值",
        tRadio_dynamic: "动态警戒线",
        tSelect_average: "平均值",
        tSelect_max: "最大值",
        tSelect_min: "最小值",
        title_show: "展示样式",
        sRadio_name: "名称",
        sRadio_value: "数值",
        sRadio_nameValue: "名称+数值",
        title_color: "颜色",
        eTip_emptyName: "请输入警戒线名称",
        eTip_errorName: "警戒线名称不能超过20个字符",
        eTip_emptyType: "请输入数值",
        eTip_errorType: "请输入数字或百分数",
        eTip_emptyMetic: "请选择指标字段"
      }
    },
    jumpLink: {
      //跳转仪表盘
      title: "跳转仪表盘",
      classify: "数据交互",
      check_set: "设置",
      modal: {
        title: "跳转设置",
        addTitle: "添加跳转",
        addRules: "添加跳转规则",
        tip_emptyLink1: "点击左侧",
        tip_emptyLink2: "号，添加跳转方式",
        check_emptyLink: "添加跳转方式",
        R_title: "规则",
        R_titleCopy: "副本",
        R_titleEditS: "确定",
        Rtitle_jumpTo: "选择目标仪表盘",
        R_jumpToTitle: "跳转到",
        R_jumpToPla: "请选择仪表盘",
        Rtitle_openType: "打开方式",
        R_openTypeNW: "新窗口",
        Rtitle_jumpMethod: "传值方式",
        R_jmNone: "不传值",
        R_jmNormal: "默认传值",
        R_jmCustom: "自定义传值",
        tip_delRuleT: "确定删除此跳转？",
        tip_delRuleC: "此条设置将终止与删除，且无法恢复",
        err_rulesLen: "规则不能超过5条!",
        err_eDashboard: "仪表盘被删除，请重新配置!",
        check_addCus: "添加传值方式",
        cv_selPla: "目标字段选择",
        cv_notFind: "无匹配结果",
        cv_fTypePla: "请选择类型",
        cv_selFieldPla: "请选择指标维度值",
        cv_del: "删除",
        err_cvLen: "最多添加10个目标字段"
      },
      filterVO_normal: "值",
      filterVO_refValue: "引用值",
      rulesMO_edit: "编辑",
      rulesMO_copy: "复制",
      rulesMO_del: "删除"
    },
    DataZoom: {
      classify: "缩略轴",
      showTitle: "显示缩略轴",
      themeOP_light: "明亮",
      themeOP_dark: "暗系",
      colorTitle: "配色"
    },
    Forecast: {
      //指标预测
      classify: "分析预警",
      numberTitle: "预测期数",
      title: "指标预测",
      inputPla: "请输入期数",
      tip:
        "支持条件：<br/> 维度为时间类型字段。<br/> 数据组合为1维度1指标或1维度多指标。<br/> 使用说明：<br/> 开启预测时图表默认按照日期维度升序排序。"
    },
    Download: {
      title: "允许导出",
      classify: "图表操作",
      labal_allow: "允许",
      labal_noallow: "不允许"
    },
    OrderNumber: {
      title: "显示序号",
      classify: "数据展示",
      OrderNameT: "序号名称",
      orderName: "序号"
    },
    MoreOrderNumber: {
      //显示序号
      classify: "数据展示",
      title: "显示序号",
      innerTitle: "选择维度",
      innerPla: "选择维度显示序号"
    },
    FreezeHead: {
      title: "冻结",
      classify: "数据展示",
      rowTitle: "冻结行维度",
      columnTitle: "冻结列维度",
      colNumTitle: "冻结列数",
      rowNumTitle: "冻结行维度数",
      inpla: "请输入正数",
      DLabel_freeze: "冻结",
      Dlabal_nofreeze: "不冻结",
      columnTitle_sheet: "冻结表头"
    },
    CrossSummary: {
      //汇总设置
      classify: "数据交互",
      title: "汇总设置",
      tab_rowSum: "行汇总",
      tab_columnSum: "列汇总",
      TdisRadio: "整体汇总",
      TposRadio: "显示位置",
      Tmodal: "分类汇总",
      check: "添加",
      m_title: "小计",
      m_nameTitle: "小计名称",
      m_dimTitle: "小计维度",
      m_sumTypeTitle: "汇总方式",
      m_plaN: "请输入小计名称,最多20个字符",
      m_plaD: "请选择小计维度",
      rPosBottom: "底部",
      rPosTop: "顶部",
      cPosRight: "右侧",
      cPosLeft: "左侧",
      m_sumN: "小计"
    },
    MultiMetricType: {
      classify: "数据展示",
      icontitleR: "右轴",
      icontitleL: "左轴"
    },
    MultiRange: {
      classify: "数据展示",
      titleR: "右轴",
      titleL: "左轴"
    },
    Conversion: {
      //转化率
      classify: "数据展示",
      title: "转化率"
    },
    Invert: {
      classify: "数据展示",
      title: "转化率",
      showtitle: "计算方式",
      comList_next: "占上一层百分比",
      comList_all: "占第一层百分比"
    },
    SortPercent: {
      classify: "数据展示",
      title: "进度值排序",
      TagOp_default: "默认",
      TagOp_fall: "降序",
      TagOp_sise: "升序"
    },
    MapArea: {
      //地图范围
      classify: "数据展示",
      title: "地图范围",
      areaTitle: "显示范围",
      prinTitle: "显示省/直辖市",
      cityTitle: "显示市/直辖区",
      options_all: "全国",
      options_province: "省级",
      options_city: "市级",
      auto: "自动"
    },
    MapDrill: {
      //地图钻取
      classify: "数据交互",
      title: "地图钻取",
      driLabal_province: "钻取到省",
      driLabal_city: "钻取到市",
      driLabal_disabled: "禁用"
    },
    groupMapping: {
      //表格类,趋势对比类
      class_table: "表格类",
      class_trendcom: "趋势对比类",
      class_metric: "指标类",
      class_distribute: "分布类"
    }
  },
  config: {
    CascaderTitle: {
      TitlePla: "请输入显示名称",
      labalTitle: "源字段：",
      warn_titleLen: "字段名称不能大于32字节"
    },
    NumberFormat: {
      check_comma: "千分符",
      check_percent: "百分比",
      check_fraction: "小数位数",
      fraInput_pla: "请输入小数位数"
    },
    ResultFilter: {
      check: "使用结果筛选器",
      title_filterNum: "筛选条件",
      title_fun: "筛选逻辑",
      inputPla: "请输入数值",
      minPla: "最小值",
      maxPla: "最大值",
      result: "结果",
      NumType_Equal: "等于",
      NumType_NotEqual: "不等于",
      NumType_Above: "大于",
      NumType_NotBelow: "大于等于",
      NumType_Below: "小于",
      NumType_NotAbove: "小于等于",
      NumType_Range: "选择范围",
      NumType_None: "为空",
      NumType_NotNone: "不为空",
      error_empty: "内容不可为空",
      error_equal: "最大值不能小于或等于最小值"
    },
    TargetValue: {
      //目标值设置
      typeTitle: "类型",
      labal_fixed: "固定值",
      labal_dynamic: "计算值",
      innerFieldTitle: "选择字段",
      aggTypeTitle: "汇总方式"
    },
    filterModal: {
      //设置过滤条件
      title: "设置过滤条件",
      error_emptyV: "值不能为空",
      mes_emptyV: "过滤条件不可为空"
    },
    menulistName: {
      title: "修改显示名",
      hiddenField: "隐藏字段",
      aggregateType: "汇总方式",
      aggregateResult: "汇总结果显示",
      ratioAnalyze: "同/环比分析",
      numberFormat: "数值格式设置",
      resultFilter: "结果筛选器",
      dateFormat: "日期格式设置",
      targetValue: "目标值设置",
      transformBar: "显示为数据条",
      format: "数据格式",
      displayField: "显示字段"
    },
    dateFormat: {
      //日期格式设置
      title: "日期格式设置",
      custom: "自定义格式"
    }
  },
  components: {
    numberFormat: {
      check_comma: "千分符",
      check_percent: "百分比",
      check_fraction: "小数位数",
      fraInput_pla: "请输入小数位数"
    },
    numberInPla: "请输入数值"
  },
  saticOP: {
    openTagOptions: {
      labal_close: "关闭",
      labal_open: "开启"
    },
    NumberTagOptions: {
      //显示隐藏
      labal_display: "显示",
      labal_hide: "隐藏"
    },
    ElementCNType: {
      MAP: "地图", // 地图
      BAR: "柱状图", // 柱状图
      PILEBAR: "堆叠柱状图", // 堆叠柱状图
      STRIPE: "条形图", // 条形图
      LINE: "折线图", // 折线图
      AREA: "面积图", // 面积图
      PIE: "饼图", // 饼图
      FUNNEL: "漏斗图", // 漏斗图
      PILESTRIPE: "堆叠条形图", //堆叠条形图
      RADAR: "雷达图", // 雷达图
      TABLE: "透视图", // 透视图
      CROSSTABLE: "交叉表", // 透视图
      LIST: "明细表", // 明细表
      CARD: "指标图", // 指标图
      SCATTER: "散点图", // 散点图（气泡图）
      BIAX: "双轴图", // 双轴图
      LONGTEXT: "文本图", // 文本图
      FILTERPICKER: "过滤器", // 过滤器
      PROGRESSBAR: "进度图", // 进度图
      GAUGE: "仪表图", // 仪表图
      FUNNELCOMPARE: "漏斗对比图", // 对比漏斗图
      PERCENTPILEBAR: "百分比堆叠柱状图", // 百分比堆叠柱状图
      PERCENTPILESTRIPE: "百分比堆叠条形图" // 百分比堆叠条形图
    },
    ChartNotice: {
      BAR: "1个维度、1个或多个指标<br>2个维度、1个指标", // 柱状图
      PILEBAR: "1个维度、1个或多个指标<br>2个维度、1个指标", // 堆叠柱状图
      STRIPE: "1个维度、1个或多个指标<br>2个维度、1个指标", // 条形图
      PILESTRIPE: "1个维度、1个或多个指标<br>2个维度、1个指标", // 条形图
      LINE: "1个维度、1个或多个指标<br>2个维度、1个指标", // 折线图
      AREA: "1个维度、1个或多个指标<br>2个维度、1个指标", // 面积图
      PIE: "1个维度、1个指标", // 饼图
      FUNNEL: "1个维度、1个指标", // 漏斗图
      RADAR: "1个维度、1个或多个指标<br>2个维度、1个指标", // 雷达图
      TABLE: "1个维度、1个或多个指标<br>多个维度、1个或多个指标", // 透视图
      CROSSTABLE: "1个维度、1个或多个指标<br>多个维度、1个或多个指标", // 交叉表
      LIST: "多个列", // 明细表
      CARD: "0个维度、1个或多个指标<br>1个维度、1个指标", // 指标图
      SCATTER: "1个维度、2个或3个指标<br/>2个维度、2个或3个指标", // 散点图（气泡图）
      BIAX: "1个维度、1个或多个指标<br>2个维度、1个指标", // 双轴图
      MAP: "1个维度、1个指标", // 地图
      PROGRESSBAR: "0个维度、1个或多个指标<br>1个维度、1个或多个指标", // 进度图
      GAUGE: "0个维度、1个指标", // 仪表图
      FUNNELCOMPARE: "1个维度、1个或多个指标", // 对比漏斗图
      PERCENTPILEBAR: "1个维度、1个或多个指标", // 百分比堆叠柱状图
      PERCENTPILESTRIPE: "1个维度、1个或多个指标" // 百分比堆叠条形图
    },
    FilterType: {
      string: {
        Equal: "等于",
        NotEqual: "不等于",
        Match: "包含",
        NotMatch: "不包含",
        In: "等于任意一个",
        NotIn: "不等于任意一个",
        None: "为空",
        NotNone: "不为空"
      },
      number: {
        Equal: "等于",
        NotEqual: "不等于",
        Range: "范围",
        Above: "大于",
        NotBelow: "大于等于",
        Below: "小于",
        NotAbove: "小于等于",
        None: "为空",
        NotNone: "不为空"
      },
      address: {
        Belong: "属于",
        NotBelong: "不属于",
        None: "为空",
        NotNone: "不为空"
      },
      date: {
        Equal: "等于",
        NotEqual: "不等于",
        Above: "大于",
        NotBelow: "大于等于",
        Below: "小于",
        NotAbove: "小于等于",
        Range: "范围",
        Dynamic: "动态筛选",
        None: "为空",
        NotNone: "不为空"
      }
    },
    formatDataList: {
      Date: "日期",
      Time: "日期和时间",
      Month: "年月"
    },
    dateFormatList: {
      Y: "年",
      YM: "年-月",
      YMD: "年-月-日",
      YMDHM: "年-月-日 时:分",
      YMDHMS: "年-月-日 时:分:秒",
      HM: "时:分",
      HMS: "时:分:秒",
    },
    enumType: {
      string: {
        count: "计数",
        countDistinct: "计数(去重)"
      },
      number: {
        sum: "总和值",
        avg: "平均值",
        max: "最大值",
        min: "最小值",
        count: "计数",
        countDistinct: "计数(去重)"
      },
      date: {
        y: "年",
        yq: "年-季度",
        ym: "年-月",
        yw: "年-周",
        ymd: "年-月-日",
        m: "月",
        md: "月-日",
        d: "日",
        yqm: "年-季度-月",
        yqmd: "年-季度-月-日",
        q: "季度",
        qm: "季度-月",
        qmd: "季度-月-日",
      },
      address: {
        province: "省",
        city: "省市",
        district: "省市区",
        detailed: "省市区详细地址"
      },
      aggregateResult: {
        default: "显示为实际值",
        precent: "显示为占比"
      }
    },
    filterRel: {
      and: "所有",
      or: "任一"
    },
    ratioLabel: {
      undefined: "无",
      incValue: "环比增长值",
      incRate: "环比增长率",
      lastYincValue: "上年同比增长值",
      lastYincRate: "上年同比增长率",
      lastMincValue: "上月同比增长值",
      lastMincRate: "上月同比增长率",
      lastWincValue: "上周同比增长值",
      lastWincRate: "上周同比增长率"
    }
  },
  screenOptions: [
    {
      title: "普通模式",
      tip: "组件过多时会出现滚动条",
      type: "normal"
    },
    {
      title: "自适应模式",
      tip: "仪表盘始终占满一整屏",
      type: "adapt"
    }
  ],
  Dview: {
    title: "数据流",
    dropMenu_add: "新增",
    dropMenu_addGroup: "新增分组",
    dropMenu_addDS: "新增数据流",
    dropMenu_addSQL: "新增SQL数据流",
    dropMenu_moveDS: "批量移动",
    tipTitle_delDS: "确定删除该数据源吗？",
    tipTitle_delG: "确定删除该分组吗？",
    tipTitle_relieveG: "确定解除该分组吗？",
    tipCon_delDS: "删除后将无法恢复，请谨慎操作",
    tipCon_delG: "分组及分组内所有数据源将全部删除，请谨慎删除",
    tipCon_relieveG: " 解除分组后，数据流将统一归属到上一级",
    copyName: "副本_",
    defN_group: "未命名分组",
    emptyList: {
      link_title: "您可在右侧新增数据流",
      tip: "帮助文档",
      },
    DSpreview: {
      tab_pre: "数据预览",
      button_editDS: "编辑数据流",
      button_exportE: "导出",
      tip_errorDS: "高级数据源配置出错了，请重新配置",
      tip_addDS: "只需要简单的拖拉拽动作，提供关联合并、字段设置等数据处理节点，让非技术人员也能轻松实现数据处理的工作",
      tip_addSQL: "为技术人员提供灵活的SQL，可以根据表单数据自定义配置SQL语句并查询执行SQL语句后的数据，实现数据处理的工作",
    },
    listMenu: {
      n_rename: "重命名",
      n_edit: "编辑",
      n_copy: "复制数据流",
      n_remove: "删除数据流",
      g_addGroup: "新增子分组",
      g_delete: "删除分组",
      g_relieve: "解除分组",
      g_rename: "重命名",
    },
    SQLedit: {
      defName: "未命名的自定义SQL",
      tip_empty: "请输入SQL语句",
      result_title: "查询结果",
      button_search: "校验查询",
      tip_eResult: "请输入SQL语句查询",
      toolTip_title: "表结构说明",
      toolTip_des:
        "表名需要在自定义模块编码前添加 i_,<br/>如果表单的编码为D00021liuc,<br/>那么对应的数据库表名为I_ D00021liuc, <br/>子表是子表控件编码前加i_即数据库表名。<br/>字段名为控件编码。",
      message_error: "请先通过查询校验",
      message_saveS: "高级数据源保存成功",
      failTip_title: "失败原因",
      button_close: "展开查询结果栏",
      button_open: "收起查询结果栏",
      modal_title: "您对SQL数据流的修改尚未保存，确定退出吗？",
      cancel: "取消",
      quit: "直接退出"
    },
    moveModal: {
      title: "批量移动",
      groupTitle: "第一步：选择数据流",
      folderTitle: "第二步：选择移动到",
      err_emptyDS: "请选择要移动的数据源",
      err_emptyF: "请选择要移动到哪个文件夹"
    }
  },
  Ddesign: {
    err_emptyDS: "请配置数据流",
    err_nodesLimit: "配置的输入节点数超过限制",
    err_setFail: "当前数据流配置有误",
    err_eOutNode: "当前数据流没有输出节点",
    tip_saveSuc: "高级数据源保存成功",
    mainTable: "主表",
    subTable: "子表",
    flowSide: {
      listTitle_datasets: "数据集",
      listTitle_process: "数据处理",
      listTitle_colTf: "列转换",
      listTitle_dataTf: "数据转换",
      dType_input: "输入",
      dType_output: "输出",
      pType_unit: "合并",
      pType_join: "关联",
      cType_group: "分组汇总",
      type_filter: "过滤",
      type_compute: "字段设置",
      listIcon_Tip: "点击查看功能介绍"
    },
    flowTools: {
      align_horizontal: "水平对齐",
      align_vertical: "垂直对齐",
      justify_samehigh: "水平等距",
      justify_samewidth: "垂直等距",
      tool_tip: {
        back: "撤销 Ctrl + z",
        redo: "重做 Ctrl + y",
        delete: "删除 Delete"
      }
    },
    canvas: {
      emptyTip_step1: "拖放“输入”，选中数据",
      emptyTip_step2: "拖放转换操作，并接连“输入”",
      emptyTip_step3: "连接并为输出数据命名",
      title_step1: "第一步",
      title_step2: "第二步",
      title_step3: "第三步"
    },
    sModel: {
      title: "数据源",
      sourceTitle: "1.请选择数据源",
      schemaCodeTitle: "2.请选择字段",
      searchPla: "搜索",
      tip_searchFail: "无查询结果！",
      check_all: "全选",
      tip_Maintable: "主表",
      tip_Subtable: "子表",
      listTitle: "数据源"
    },
    stage: {
      Htab_setting: "配置",
      Htab_preview: "预览",
      Hbutton: "更改数据源",
      H_finish: "完成",
      title_checked: "已选字段",
      input_source: "输入源",
      change_source: "更改数据源",
      warn_emptyDS: "请设置数据源",
      warn_emptyField: "请选择至少一个字段",
      warn_emptyList: "模型列表为空！"
    },
    stage_com: {
      addTitle: "添加计算字段",
      m_title: "计算字段",
      m_fieldNPla: "请输入计算字段名称",
      m_formulaH: "表达式",
      m_fieldTitle: "可用变量",
      m_funcTitle: "可用函数",
      m_sPla: "搜索函数",
      m_typeNum: "数字",
      m_typeDate: "时间戳",
      m_typeStr: "字符串"
    },
    stage_filter: {
      addTitle_font: "保留以下",
      addTitle_back: "条件的数据",
      addTitle: "添加过滤规则",
      pla_strIn: "请添加筛选值",
      pla_dynaPla: "请选择时间",
      pla_max: "最大值",
      pla_min: "最小值"
    },
    dynaModal: {
      delete: "清空",
      ok: "确认",
      startDate: "开始时间",
      endDate: "结束时间"
    },
    stage_unit: {
      title: "合并设置",
      check_isAdd: "只追加合并",
      check_idDed: "是否去重",
      result_title: "合并结果"
    },
    stage_relate: {
      step1_title: "1. 请选择关联方式",
      step2_title: "2. 请设置关联字段",
      joinType_left: "左连接",
      joinType_right: "右连接",
      joinType_inner: "内连接",
      check_addField: "添加关联规则",
      listTitle: "侧表单",
      warn_least: "至少要有一组关联字段",
      warn_isSame: "连接字段类型不一致"
    },
    stage_group: {
      step1_title: "1.设置分组字段",
      step2_title: "2.设置汇总字段",
      check_addDimField: "添加分组字段",
      check_addMetField: "添加汇总字段",
      pla_select: "请选择",
      warn_fieldLimit: "分组字段和汇总字段总数不超过十条"
    },
    stage_output: {
      tool_hide: "隐藏字段",
      tool_daiplay: "显示字段",
      tool_rename: "重命名"
    },
    help_modal: {
      title: "功能介绍",
      help_link: "帮助引导",
      union : {
        title: "合并",
        desc: "合并节点用于将多个表进行合并（<span style='color: #315EFB;'>最少需要连接两个输入源</span>），提供「合并」及「只追加合并」两种合并方式。",
        item1_title: "合并",
        item1_desc: "「合并」即全连接，将每个表的字段<span style='color: #315EFB;'>去重合并</span>，按照规则拼接相对应的数据，若部分字段没有相应的数据，则显示为空。",
        item1_example: "例如：需要将采购订单和销售订单两个数据表进行合并，将采购订单的'产品名称'与销售订单的'产品名称'进行拼接，合并结果如下：",
        item2_title: "只追加合并",
        item2_desc: "「只追加合并」可以将多表数据按照字段的拼接规则进行<span style='color: #315EFB;'>上下合并</span>",
        item2_example: "例如：需要将采购订单的‘产品名称’和销售订单的‘产品名称’拼接后进行追加合并。示例如下：",
        item3_desc: "若<span style='color: #315EFB;'>开启「是否去重」</span>后，当<span style='color: #315EFB;'>多条数据</span>的<span style='color: #315EFB;'>所有字段值完全相同</span>时，会进行去重操作。",
        item3_example: "例如：需要将两个采购订单进行追加合并，并开启「是否去重」，需要将采购订单1的‘产品名称’与采购订单2中的‘产品名称’进行拼接，‘采购价’与‘采购价’进行拼接，当拼接后的字段值完全相同时，会进行去重。示例如下：",
      },
      join: {
        title: "关联",
        desc: "「关联」根据设置的关联方式和连接字段，将<span style='color: #315EFB;'>两张数据表</span>的数据进行左右拼接。示例如下：",
        item1_title: "左连接",
        item1_desc: "是<span style='color: #315EFB;'>以左表的数据为基准，根据连接字段匹配右表数据</span>。若左表有数据而右表没有数据，则显示左表中的数据，右表的数据显示为空。",
        item2_title: "右连接",
        item2_desc: "是<span style='color: #315EFB;'>以右表的数据为基准，根据连接字段匹配左表数据</span>。若右表有数据而左表没有数据，则显示右表中的数据，左表的数据显示为空。",
        item3_title: "内连接",
        item3_desc: "根据<span style='color: #315EFB;'>每个表的共有字段的值匹配两个表中的数据</span>，即返回左右两个表单的数据交集。",
      },
      group: {
        title: "分组汇总",
        desc: "首先设置分组字段，把<span style='color: #315EFB;'>字段值相同的合并为一组</span>，再设置汇总字段和汇总方式。示例如下：",
      },
      filter: {
        title: "过滤",
        desc: "「过滤」：通过<span style='color: #315EFB;'>添加过滤条件</span>，过滤掉不符合指定条件的数据。示例如下：",
      },
      compute: {
        title: "字段设置",
        desc: "「字段设置」：<span style='color: #315EFB;'>添加计算字段</span>，编辑公式来计算数据。示例如下：",
      }
    },
    noun_caption: {
      click_title: "查看图文示例",
      union: {
        text1: "开启「只追加合并」后，拼接在一起的字段实现上下合并，字段值重复时不会进行去重操作;",
        text2: "开启「是否去重」后，当两条数据的所有字段值都相同时，会进行去重操作;"
      },
      join: {
        text1: "左连接：以左表的数据为基准，根据连接字段匹配右表数据。",
        text2: "右连接：以右表的数据为基准，根据连接字段匹配左表数据。 ",
        text3: "内连接：根据每个表的共有字段的值匹配两个表中的数据。",
      }
    },
    guide_modal: {
      entry : "搭建指引",
      button_last: "上一步",
      button_next: "下一步",
      title1: "数据流",
      title2: "数据流界面使用",
      title3: "认识节点功能",
      title4: "如何搭建数据流",
      title5: "数据流的保存",
      title6: "在仪表盘中配置图表",
      text1: "数据流由节点与连接线组成，将节点与节点进行连接，可以快速实现一个或多个数据表的数据处理。",
      text2: "左侧节点栏展示了所有可用节点，您可以尝试将任一节点拖入中间区域的设计面板。",
      text3: "「输入」节点用于选择需处理的数据表，「输出」节点用于存放完成的数据，数据处理节点用于对数据进行合并、过滤等操作。",
      text4: "从左侧节点栏拖入「输入」节点、数据处理节点、「输出」节点到设计面板，添加连接线，点击节点可以进行节点设置。",
      text5: "配置完节点之后，可以对各节点进行重命名，同时记得在左上角修改数据流名称，最后记得点击「保存」按钮。",
      text6: "创建完成的数据流可以在仪表盘中作为数据源进行使用，实现数据可视化分析。",
      home_page_text: "试试搭建属于你的数据流吧！",
      home_page_close: "立即体验",
     }
  },
  Doptions: {
    formulaType: {
      title_ltext: "文本函数",
      title_num: "数字函数",
      title_date: "日期函数",
      title_other: "其他函数",
      title_logic: "逻辑函数",
      logic_IF: "例如IF,5-33,updata",
      logic_AND:
        "表达式1 AND 表达式2 多个用AND连接的表达式,当所有表达式均为true时，表达式返回true，否则返回false",
      logic_or: "表达式1 OR 表达式2	多个用OR连接的表达式，只要有一个表达式为true，表达式返回true",
      logic_IFS:
        "IFS( logical_1, value_if_true_1, logical_2, value_if_true_2, … ,logical_n, value_if_true_n)	检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值。 IFS 可以取代多个嵌套 IF 语句，并且有多个条件时更方便阅读",
      ltext_LEN: "LEN(text) 返回文本字符串text中的字符个数",
      ltext_LOWER: "LOWER(text)	将文本字符串text中所有大写字母转换为小写",
      ltext_UPPER: "UPPER(text)	将文本字符串text中所有小写字母转换为大写",
      ltext_TRIM: "TRIM(text)	去掉文本字符串text中的首尾空格",
      ltext_CONCATENATE:
        "CONCATENATE(text1,[text2], …)	将多个可用变量（字符串、时间戳、数字）合并成一个文本字符串。示例：CONCATENATE(A,B,C)，即返回值为ABC，字段或者函数之间，用逗号隔开。如果是字符串，需要用引号包裹起来"
    },
    dateSelectList: {
      Equal: "等于",
      NotEqual: "不等于"
    },
    dateMapList: {
      Custom: "自定义",
      Today: "今天",
      Yesterday: "昨天",
      Tomorrow: "明天",
      ThisWeek: "本周",
      LastWeek: "上周",
      NextWeek: "下周",
      ThisMonth: "本月",
      LastMonth: "上月",
      NextMonth: "下月",
      ThisQuarter: "本季度",
      LastQuarter: "上季度",
      NextQuarter: "下季度",
      ThisYear: "今年",
      LastYear: "去年",
      NextYear: "明年"
    },
    NodeErrorMessage: {
      RELATIONTARGETEDGES: "请将 2 个节点连接至本节点",
      BEFOREGROUPS: "请先完成前面节点的配置",
      CURRENTSETTING: "请先完成当前节点的配置",
      RELATIONREPEATEDMODEL: "同一来源的数据无法进行关联",
      MERGETARGETEDGES: "追加合并只支持2-10个节点",
      OUTPUTEMPTY: "请将 1 个节点连接至本节点",
      ISOLATEDNODE: "当前存在孤立节点"
    },
    dateMap: {
      current: "当前",
      last: "过去",
      next: "未来",
      day: "天",
      week: "周",
      month: "月",
      quarter: "季",
      year: "年"
    }
  },
  Analysis: {
    view: {
      title: "统计分析",
      close: "关闭",
      addChart: "新增图表",
      tab_preson: "个人",
      tab_public: "公共",
      tab_ai: "AI分析",
      emptyTip_person: "您可以创建个人图表",
      emptyTip_pubArrow: "您可以创建属于该数据表的公共图表",
      emptyTip_pubNoArrow: "管理员还未设置公共图表，您可以去设置个人图表",
      emptyExTitle: "示例图表名称",
      addChart_person: "设置个人图表"
    },
    chartPanel: {
      editData: "修改时间: ",
      editPreson: "修改人: "
    },
    toolbar: {
      span: {
        refresh: "刷新",
        sort: "排序",
        full: "全屏",
        edit: "编辑",
        delete: "删除",
        drag: "拖拽",
        compare: "对比",
        exitFull: "退出全屏",
        filter: "筛选",
      },
      sort: {
        Oplabal_default: "默认",
        Oplabal_asc: "升序",
        Oplabal_desc: "降序"
      },
      delete: {
        modalContent: "确认要删除该图表吗?"
      }
    },
    design: {
      default_name: "未命名的图表",
      select_pla: "请选择",
      button_save: "保存",
      name: "未命名的图表",
      input: "请输入",
      add: "添加",
      check_dateComplete: "补齐日期",
      tip_dateComplete: "补齐数据表中缺少的日期数据",
      input_number: "请输入正数",
      fieldName: {
        dimension: "维度",
        metric: "指标",
        metricL: "指标(左)",
        metricR: "指标(右)",
        rowDim: "行维度",
        colDim: "列维度",
        ctip_cd: "【列维度】是对交叉表行数据做分类的依据",
        ctip_rd: "【行维度】是对交叉表列数据做分类的依据",
        tip_tableC: "【行维度】是对透视表行数据做分类的依据"
      },
      fieldDropDown: {
        select_pla: "请选择",
        search_pla: "请输入",
        tip_searchf: "已为您过滤",
        tip_searchb: "个不支持的字段",
        tip_noData: "无相关字段"
      },
      metricSetModal: {
        tip: "数据格式",
        title: "指标-更多设置",
        title_comma: "千分符",
        title_percent: "百分号",
        title_fraction: "小数位数",
        title_compute: "高级计算",
        title_target: "目标值设置",
        warn_fractNum: "小数位最大设置六位",
        comType_null: "无",
        comType_precent: "占比",
        comType_ratio: "同/环比分析"
      }
    },
    mudules: {
      switchType: "图表类型",
      optionsTitle: {
        compareDate: "对比值",
        styleOption: "样式配置",
        axisXOption: "X轴",
        axisYOption: "Y轴",
        moreOrder: "序号设置",
        mapDigitalDisplaySet: "数值标签显示设置",
        crossSummary: "汇总设置"
      },
      theme: "配色",
      axisx: {
        title_axis: "坐标轴",
        title_position: "文字方向"
      },
      Legend: {
        title: "图例"
      },
      Limit: {
        title: "数据保留",
        inputPla: "请输入正数"
      },
      DataLabel: {
        //数值标签
        title: "数值标签"
      },
      DataLabelPileSum: {
        //显示堆叠合计
        title: "显示堆叠合计"
      },
      metricRange: {
        //最大值，最小值
        maxTitle: "最大值",
        minTitle: "最小值",
        input: "请输入数值"
      },
      orderNumber: {
        //显示序号
        title_show: "显示序号",
        title_dim: "选择维度",
        input_pla: "选择维度显示序号"
      },
      summary: {
        tab_rowSum: "行汇总",
        tab_columnSum: "列汇总",
        TdisRadio: "整体汇总",
        TposRadio: "显示位置",
        Tmodal: "分类汇总",
        check: "添加",
        m_title: "小计",
        m_nameTitle: "小计名称",
        m_dimTitle: "小计维度",
        m_sumTypeTitle: "汇总方式",
        m_plaN: "请输入小计名称,最多20个字符",
        m_plaD: "请选择小计维度",
        rPosBottom: "底部",
        rPosTop: "顶部",
        cPosRight: "右侧",
        cPosLeft: "左侧",
        m_sumN: "小计"
      },
      freezeHead: {
        columnTitle: "冻结列维度",
        rowTitle: "冻结行维度",
        DLabel_freeze: "冻结",
        Dlabal_nofreeze: "不冻结"
      },
      sort: {
        //排序
        title: "排序",
        wrap_open: "展开",
        wrap_close: "折叠"
      },
      MetricLabel: {
        //显示指标值/名
        title_label: "显示指标名",
        title_value: "显示指标值"
      },
      Invert: {
        title: "转化率",
        showtitle: "计算方式",
        comList_next: "占上一层百分比",
        comList_all: "占第一层百分比"
      },
      progressLabel: {
        //进度图
        valueTitle: "显示数值",
        percentTitle: "显示占比",
        targetTitle: "显示目标"
      },
      MapDigitalSet: {
        dimensionTitle: "显示维度值",
        metricTitle: "显示指标值"
      },
      GaugeMode: {
        //仪表图类型
        title: "仪表图类型",
        modeIn: "内仪表图",
        modeOut: "外仪表图"
      },
      MapDrill: {
        //地图钻取
        title: "地图钻取",
        driLabal_province: "钻取到省",
        driLabal_city: "钻取到市",
        driLabal_disabled: "禁用"
      },
      MapArea: {
        areaTitle: "显示范围",
        prinTitle: "显示省/直辖市",
        cityTitle: "显示市/直辖区",
        options_all: "全国",
        options_province: "省级",
        options_city: "市级",
        auto: "自动"
      },
      MapMode: {
        title: "地图类型",
        type_area: "区域地图",
        type_bubble: "气泡地图"
      },
      MapTheme: {
        title: "地图配色"
      },
      dataLabel: {
        title_SplitLine: "网格线",
        title_AxisYSet: "坐标轴"
      },
      MultipleDataLabel: {
        dimLabelTitle: "显示维度",
        metricLabelTitle: "显示数值",
        perLabelTitle: "显示占比"
      },
      compare: {
        title_value1: "维度值1",
        title_value2: "维度值2"
      },
      merticType: {
        icontitleR: "右轴",
        icontitleL: "左轴"
      },
      orderNum: {
        title: "序号"
      }
    },
    config: {
      NumberTagOptions: {
        //显示隐藏
        labal_display: "显示",
        labal_hide: "隐藏"
      },
      directOption: {
        DType_hide: "隐藏",
        DType_Crosswise: "横向",
        DType_Endwise: "纵向",
        DType_LeftBank: "左倾斜",
        DType_RightBank: "右倾斜"
      },
      LegendOption: {
        posType_hide: "隐藏",
        posType_Bottom: "底部",
        posType_Top: "顶部",
        posType_Left: "左边",
        posType_Right: "右边"
      }
    }
  }
},

export default cn;
