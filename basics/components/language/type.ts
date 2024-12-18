declare module "vue/types/vue" {
  interface Vue {
    /** 语言类型 */
    $r_languageType: LanguageType;
    /** 当前应用的语言信息 */
    $r_language: LanguageInfo;
    /**
     * 设置语言类型
     * @param val 语言类型
     */
    $r_setLanguage(val: LanguageType): void;
    $r_translate(val: string): void;
    $r_gt(data: any, type: string): void;
  }
}
/** 语言配置信息 */
export interface LanguageInfo {
  normal: {
    help: string;
    terms: string;
    term: string;
    sure: string;
    cancel: string;
    input: string;
    directExit: string;
    saveExit: string;
    save: string;
    add: string;
    close: string;
    empty: string;
    default: string;
    tip_saveSuc: string;
    left: string;
    right: string;
    tip_saveFail: string;
    select: string;
  };
  toolbar: {
    imageSelect: {
      labal_originCenter: string;
      labal_origin: string;
      labal_draw: string;
    };
    span: {
      uploadImage: string;
      copy: string;
      delete: string;
      linkCancel: string;
      refresh: string;
      fullScreen: string;
      sort: string;
      edit: string;
      remove: string;
      filter: string;
      fullScreenExit: string;
      com: string;
      visible: string;
      editWeb: string;
      rename: string;
    };
    LINKAGE: {
      //取消联动
      tip_nolinkage: string;
      tip_cancelLink: string;
    };
    SORT: {
      //排序弹窗
      Oplabal_default: string;
      Oplabal_asc: string;
      Oplabal_desc: string;
      Oplabal_custom: string;
      tip_empty: string;
      check_addField: string;
      select_pla: string;
      Modal_custom: {
        title: string;
        searchPla: string;
        tip_noSValue: string;
        tip_emptyValue: string;
        check_toTop: string;
        toTopSuc: string;
      };
    };
    FILTER: {
      //筛选
      pla_select: string;
      check: string;
    };
    compareSort: {
      title_firstDim: string;
      title_SecDim: string;
    };
    editWeb: {
      title: string;
      inputPla: string;
    };
    export: {
      toolTitle: string;
      click_list: string;
      click_style: string;
    };
  };
  el: {
    empty: string;
    title: string;
    tip_deleteFP: string;
    image: {
      tip_empty: string;
      tip_size: string;
      warn_fail: string;
      tip_loading: string;
      tip_success: string;
      tip_fail: string;
      message: string;
      tip_delete: string;
      tip_ImageType: string;
      tip_ImageSize: string;
    };
    chart: {
      addmodal: {
        title: string;
        placeholder: string;
        tab_formDS: string;
        tab_advancedDS: string;
        tip_nosearch: string;
        tip_emptyadv: string;
        tip_emptyDS: string;
      };
      tip_delete: string;
    };
    web: {
      modal_title: string;
      input_pla: string;
      error_empty: string;
      error_http: string;
      tip_delete: string;
    };
    tab: {
      tip_delete: string;
    };
    longtext: {
      tip_empty: string;
      input_pla: string;
      fsize_oversized: string;
      fsize_large: string;
      fsize_small: string;
      fsize_default: string;
      tip_delete: string;
    };
  };
  view: {
    allSum: string;
    pag_des: {
      page_totla: string;
      page_des: string;
      page_size: string;
      cpage_size: string;
      cpage_des: string;
    };
    header: {
      filter: string;
      style: string;
      full: string;
      mobile: string;
      export: string;
      add: string;
      save: string;
      backMain: string;
      exportImage: string;
      globalFilter: {
        emptyTip: string;
        addFilter: string;
        filter_title: string;
        selectChart_title: string;
        select_all: string;
        filterField_title: string;
        filterOptions_title: string;
        filterName: string;
        filterMode: string;
        defaultValue: string;
        mode_default: string;
        mode_input: string;
        mode_select: string;
        input_tip: string;
        error_emptyfield: string;
        error_emptychart: string;
        error_selectchart: string;
        filterLink_title: string;
        filterLink_pla: string;
      };
      globalStyle: {
        Style_title: string;
        title_styles: string;
        theme_auroraWhite: string;
        theme_cherryPink: string;
        theme_interstellar: string;
        theme_mirageNeon: string;
        theme_black: string;
        theme_vastStarry: string;
        theme_auroraForest: string;
        theme_dreamStar: string;
        theme_twelve: string;
        title_background: string;
        bgColor: string;
        component_bgColor: string;
        title_text: string;
        titleColor: string;
        textColor: string;
        colorPicker_default: string;
        colorPicker_theme: string;
        colorPicker_colors: string;
        colorPicker_more: string;
        changeStyleModal: {
          title: string;
          content: string;
        }
      };
      mobileLayout: {
        hide_title: string;
        hide_tip: string;
        hide_tip1: string;
        exit_tip: string;
      };
      addmodal: {
        title: string;
        tip_chart: string;
        tip_longtext: string;
        tip_filter: string;
        tip_image: string;
        tip_web: string;
        tip_tabs: string;
        cName_chart: string;
        cName_text: string;
        cName_filter: string;
        cName_image: string;
        cName_web: string;
        cName_tabs: string;
      };
      full_screen: {
        title_normal: string;
        title_self: string;
        tip_n: string;
        tip_s: string;
      };
      Export: {
        tip_loading: string;
        tip_success: string;
        warn: string;
        imageName: string;
      };
    };
    progressCard: {
      title_precent: string;
      title_value: string;
      title_target: string;
      null: string;
    };
    container: {
      IniPage: {
        tip_noChart: string;
        tip_link: string;
        add: string;
        tip_noData: string;
      };
      toolbar: {
        uploadImage: string;
        copy: string;
        delete: string;
        linkCancel: string;
        refresh: string;
        fullScreen: string;
        sort: string;
        edit: string;
        remove: string;
        filter: string;
        fullScreenExit: string;
      };
      chartSort: {
        radio_default: string;
        radio_rise: string;
        radio_drop: string;
        radio_customize: string;
        empty_tip: string;
      };
      chartFilter: {
        field_placeholder: string;
        addField: string;
        fm_equalTo: string;
        fm_notequalTo: string;
        fm_include: string;
        fm_notInclude: string;
        fm_anyone: string;
        fm_notAnyone: string;
        fm_empty: string;
        fm_notEmpty: string;
        filterValue: string;
        filterValue_placeholder: string;
      };
    };
  };
  design: {
    ds_title: string;
    ds_change: string;
    ds_chModalTitle: string;
    tip_modalTitle: string;
    tip_modalConcent: string;
    tip_chEmpty: string;
    ds_auTitle: string;
    dsau_person: string;
    dsau_all: string;
    ds_fieldTitle: string;
    ds_searchPla: string;
    tip_notsave: string;
    tabOption_ability: string;
    tabOption_style: string;
    filter: {
      tip_maxFilter: string;
      tip_closeFilter: string;
      tip_openToadd: string;
      tip_openToshow: string;
    }
    deData: {
      DF_defLay: string;
      DF_title: string;
      DF_showEdLayN: string;
      DF_showDelMod: string;
      DF_delTip: string;
      pla: string;
    };
    DF_title: {
      dim_list: string;
      dim: string;
      filter: string;
      dim_colum: string;
      dim_row: string;
      metric: string;
      metric_left: string;
      metric_right: string;
    };
    DF_tip: {
      dim: string;
      table_RD: string;
      table_CD: string;
      metric: string;
      cross_RD: string;
      cross_CD: string;
      filter: string;
    };
    computeField: {
      addTitle: string;
      tip_forbidAdvanced: string;
      tip_maximum: string;
      tip_mutualExclusion: string;
      tip_deleteField: string;
      tip_changefield: string;
      title_copy: string;
    }
  };
  modules: {
    switchTypeMode: {
      bar: string;
      pileBar: string;
      stripe: string;
      pileStripe: string;
      card: string;
      list: string;
      gaugeIn: string;
      gaugeOut: string;
      area: string;
      bubble: string;
      ring: string;
      solid: string;
    };
    AxisYSet: {
      //坐标轴
      title: string;
      AX_title: string;
      AX_disX: string;
      AX_disXtitle: string;
      AY_title: string;
      AY_disYtitle: string;
      dirTitle: string;
      DType_Crosswise: string;
      DType_Endwise: string;
      DType_LeftBank: string;
      DType_RightBank: string;
      AY_yTitle: string;
      placeholder: string;
      AY_yTitle_L: string;
      AY_yTitle_R: string;
    };
    Legend: {
      //图例
      title: string;
      disLegTitle: string;
      legPosTitle: string;
      posType_Bottom: string;
      posType_Top: string;
      posType_Left: string;
      posType_Right: string;
    };
    CardSetting: {
      maxColTitle: string;
    }
    DataLabel: {
      //标签
      title: string;
      Optionstitle: string;
    };
    DataLabelPileSum: {
      // 显示堆叠合计
      title: string;
      Optionstitle: string;
    };
    DataLabelFontSize: {
      title: string;
    }
    MultipleDataLabel: {
      dimTitle: string;
      metTitle: string;
      perTitle: string;
    };
    MetricLabel: {
      //显示指标名
      title: string;
      valueTitle: string;
    };
    TextAlign: {
      //文字位置
      title: string;
      labal_left: string;
      labal_right: string;
      labal_center: string;
    };
    AdaptiveSize: {
      //比例大小
      title: string;
      labal_small: string;
      labal_default: string;
      labal_large: string;
    };
    ProgressLabel: {
      //占比，数值，目标
      valueTitle: string;
      percentTitle: string;
      targetTitle: string;
    };
    DataLabelPosition: {
      //饼图标签
      title: string;
      posTitle: string;
      pos: string;
      pos_pie: string;
      pos_legend: string;
      specPos: string;
      specPos_in: string;
      specPos_out: string;
    };
    ListTextAlign: {
      title: string;
      tAlignOp_default: string;
      tAlignOp_left: string;
      tAlignOp_center: string;
      tAlignOp_right: string;
    };
    base: {
      //基础信息
      title: string;
      title_chartColor: string;
      title_fontSet: string;
      title_charts: string; //图表类型
      typeT_pie: string;
      typeT_base: string;
      typeT_gauge: string;
      typeT_map: string;
      classify_label: string;
    };
    ElementCoat: {
      title: string;
    };
    FontSetting: {
      //文字设置
      headTitle: string;
      contentTitle: string;
      sizeTitle: string;
    };
    Theme: {
      title: string;
    };
    MapTheme: {
      bubbleTitle: string;
      mapTitle: string;
    };
    MapDigitalSet: {
      //地图标签
      dimensionTitle: string;
      metricTitle: string;
    };
    FilterNone: {
      //维度空值过滤
      title: string;
      classify: string;
      tip: string;
      moduleTitle: string;
    };
    Limit: {
      //显示前N条维度
      title: string;
      classify: string;
      input_pla: string;
      moduleTitle: string;
    };
    DimensionLimit: {
      //显示前N条维度
      title: string;
      classify: string;
      rowNumTitle: string;
      inpla: string;
    };
    GroupSetting: {
      //系列设置
      title: string;
      classify: string;
      tip: string;
      limitTitle: string;
      inputPla: string;
      otherTitle: string;
    };
    SwitchLayers: {
      //图层切换
      title: string;
      classify: string;
      tip: string;
      modulesTitle: string;
    };
    MetricRange: {
      //指标范围
      title: string;
      classify: string;
      inputPla: string;
      maxTitle: string;
      minTitle: string;
    };
    Linkage: {
      //图表联动
      title: string;
      classify: string;
      inpla: string;
    };
    WarningLine: {
      //警戒线
      title: string;
      click_add: string;
      classify: string;
      modal: {
        title: string;
        title_name: string;
        nameInPla: string;
        title_type: string;
        tRadio_fixed: string;
        tInput_pla: string;
        tRadio_dynamic: string;
        tSelect_average: string;
        tSelect_max: string;
        tSelect_min: string;
        title_show: string;
        sRadio_name: string;
        sRadio_value: string;
        sRadio_nameValue: string;
        title_color: string;
        eTip_emptyName: string;
        eTip_errorName: string;
        eTip_emptyType: string;
        eTip_errorType: string;
        eTip_emptyMetic: string;
      };
    };
    jumpLink: {
      //跳转仪表盘
      title: string;
      classify: string;
      check_set: string;
      modal: {
        title: string;
        addTitle: string;
        addRules: string;
        tip_emptyLink1: string;
        tip_emptyLink2: string;
        check_emptyLink: string;
        R_title: string;
        R_titleCopy: string;
        R_titleEditS: string;
        Rtitle_jumpTo: string;
        R_jumpToTitle: string;
        R_jumpToPla: string;
        Rtitle_openType: string;
        R_openTypeNW: string;
        Rtitle_jumpMethod: string;
        R_jmNone: string;
        R_jmNormal: string;
        R_jmCustom: string;
        tip_delRuleT: string;
        tip_delRuleC: string;
        err_rulesLen: string;
        err_eDashboard: string;
        check_addCus: string;
        cv_selPla: string;
        cv_notFind: string;
        cv_fTypePla: string;
        cv_selFieldPla: string;
        cv_del: string;
        err_cvLen: string;
      };
      filterVO_normal: string;
      filterVO_refValue: string;
      rulesMO_edit: string;
      rulesMO_copy: string;
      rulesMO_del: string;
    };
    DataZoom: {
      //缩略轴
      classify: string;
      showTitle: string;
      themeOP_light: string;
      themeOP_dark: string;
      colorTitle: string;
    };
    Forecast: {
      //指标预测
      classify: string;
      numberTitle: string;
      title: string;
      inputPla: string;
      tip: string;
    };
    Download: {
      //导出
      title: string;
      classify: string;
      labal_allow: string;
      labal_noallow: string;
    };
    OrderNumber: {
      //显示序号
      title: string;
      classify: string;
      OrderNameT: string;
      orderName: string;
    };
    MoreOrderNumber: {
      //显示序号
      classify: string;
      title: string;
      innerTitle: string;
      innerPla: string;
    };
    FreezeHead: {
      //冻结
      title: string;
      classify: string;
      rowTitle: string;
      columnTitle: string;
      colNumTitle: string;
      rowNumTitle: string;
      inpla: string;
      DLabel_freeze: string;
      Dlabal_nofreeze: string;
      columnTitle_sheet: string;
    };
    CrossSummary: {
      //汇总设置
      classify: string;
      title: string;
      tab_rowSum: string;
      tab_columnSum: string;
      TdisRadio: string;
      TposRadio: string;
      Tmodal: string;
      check: string;
      m_title: string;
      m_nameTitle: string;
      m_dimTitle: string;
      m_sumTypeTitle: string;
      m_plaN: string;
      m_plaD: string;
      rPosBottom: string;
      rPosTop: string;
      cPosRight: string;
      cPosLeft: string;
      m_sumN: string;
    };
    MultiMetricType: {
      classify: string;
      icontitleR: string;
      icontitleL: string;
    };
    MultiRange: {
      classify: string;
      titleR: string;
      titleL: string;
    };
    Conversion: {
      //转化率
      classify: string;
      title: string;
    };
    Invert: {
      classify: string;
      title: string;
      showtitle: string;
      comList_next: string;
      comList_all: string;
    };
    SortPercent: {
      classify: string;
      title: string;
      TagOp_default: string;
      TagOp_fall: string;
      TagOp_sise: string;
    };
    MapArea: {
      //地图范围
      classify: string;
      title: string;
      areaTitle: string;
      prinTitle: string;
      cityTitle: string;
      options_all: string;
      options_province: string;
      options_city: string;
      auto: string;
    };
    MapDrill: {
      //地图钻取
      classify: string;
      title: string;
      driLabal_province: string;
      driLabal_city: string;
      driLabal_disabled: string;
    };
    groupMapping: {
      //表格类,趋势对比类
      class_table: string;
      class_trendcom: string;
      class_metric: string;
      class_distribute: string;
    };
  };
  config: {
    CascaderTitle: {
      //修改显示名
      TitlePla: string;
      labalTitle: string;
      warn_titleLen: string;
    };
    NumberFormat: {
      //数值格式设置
      check_comma: string;
      check_percent: string;
      check_fraction: string;
      fraInput_pla: string;
    };
    ResultFilter: {
      //结果筛选器
      check: string;
      title_filterNum: string;
      title_fun: string;
      inputPla: string;
      minPla: string;
      maxPla: string;
      result: string;
      NumType_Equal: string;
      NumType_NotEqual: string;
      NumType_Above: string;
      NumType_NotBelow: string;
      NumType_Below: string;
      NumType_NotAbove: string;
      NumType_Range: string;
      NumType_None: string;
      NumType_NotNone: string;
      error_equal: string;
      error_empty: string;
    };
    TargetValue: {
      //目标值设置
      typeTitle: string;
      labal_fixed: string;
      labal_dynamic: string;
      innerFieldTitle: string;
      aggTypeTitle: string;
    };
    filterModal: {
      //设置过滤条件
      title: string;
      error_emptyV: string;
      mes_emptyV: string;
    };
    menulistName: {
      title: string;
      hiddenField: string;
      aggregateType: string;
      aggregateResult: string;
      ratioAnalyze: string;
      numberFormat: string;
      resultFilter: string;
      dateFormat: string;
      targetValue: string;
      transformBar: string;
      format: string;
      displayField: string;
    };
    dateFormat: {
      //日期格式设置
      title: string;
      custom: string;
    };
  };
  components: {
    numberFormat: {
      check_comma: string;
      check_percent: string;
      check_fraction: string;
      fraInput_pla: string;
    };
    numberInPla: string;
  };
  saticOP: {
    openTagOptions: {
      //关闭、开启
      labal_close: string;
      labal_open: string;
    };
    NumberTagOptions: {
      //显示隐藏
      labal_display: string;
      labal_hide: string;
    };
    ElementCNType: {
      MAP: string; // 地图
      BAR: string; // 柱状图
      PILEBAR: string; // 堆叠柱状图
      STRIPE: string; // 条形图
      LINE: string; // 折线图
      AREA: string; // 面积图
      PIE: string; // 饼图
      FUNNEL: string; // 漏斗图
      PILESTRIPE: string; //堆叠条形图
      RADAR: string; // 雷达图
      TABLE: string; // 透视图
      CROSSTABLE: string; // 透视图
      LIST: string; // 明细表
      CARD: string; // 指标图
      SCATTER: string; // 散点图（气泡图）
      BIAX: string; // 双轴图
      LONGTEXT: string; // 文本图
      FILTERPICKER: string; // 过滤器
      PROGRESSBAR: string; // 进度图
      GAUGE: string; // 仪表图
      FUNNELCOMPARE: string; // 对比漏斗图
      PERCENTPILEBAR: string; // 百分比堆叠柱状图
      PERCENTPILESTRIPE: string; //百分比堆叠条形图
    };
    ChartNotice: {
      MAP: string; // 地图
      BAR: string; // 柱状图
      PILEBAR: string; // 堆叠柱状图
      STRIPE: string; // 条形图
      LINE: string; // 折线图
      AREA: string; // 面积图
      PIE: string; // 饼图
      FUNNEL: string; // 漏斗图
      PILESTRIPE: string; //堆叠条形图
      RADAR: string; // 雷达图
      TABLE: string; // 透视图
      CROSSTABLE: string; // 透视图
      LIST: string; // 明细表
      CARD: string; // 指标图
      SCATTER: string; // 散点图（气泡图）
      BIAX: string; // 双轴图
      PROGRESSBAR: string; // 进度图
      GAUGE: string; // 仪表图
      FUNNELCOMPARE: string; // 对比漏斗图
      PERCENTPILEBAR: string; // 百分比堆叠柱状图
      PERCENTPILESTRIPE: string; //百分比堆叠条形图
    };
    FilterType: {
      string: {
        Equal: string;
        NotEqual: string;
        Match: string;
        NotMatch: string;
        In: string;
        NotIn: string;
        None: string;
        NotNone: string;
      };
      number: {
        Equal: string;
        NotEqual: string;
        Range: string;
        Above: string;
        NotBelow: string;
        Below: string;
        NotAbove: string;
        None: string;
        NotNone: string;
      };
      address: {
        Belong: string;
        NotBelong: string;
        None: string;
        NotNone: string;
      };
      date: {
        Equal: string;
        NotEqual: string;
        Above: string;
        NotBelow: string;
        Below: string;
        NotAbove: string;
        Range: string;
        Dynamic: string;
        None: string;
        NotNone: string;
      };
    };
    formatDataList: {
      Date: string;
      Time: string;
      Month: string;
    };
    dateFormatList: {
      Y: string;
      YM: string;
      YMD: string;
      YMDHM: string;
      YMDHMS: string;
      HM: string;
      HMS: string;
    }
    enumType: {
      string: {
        count: string;
        countDistinct: string;
      };
      number: {
        sum: string;
        avg: string;
        max: string;
        min: string;
        count: string;
        countDistinct: string;
      };
      date: {
        y: string;
        yq: string;
        ym: string;
        yw: string;
        ymd: string;
        m: string;
        md: string;
        d: string;
        yqm: string;
        yqmd: string;
        q: string;
        qm: string;
        qmd: string;
      };
      address: {
        province: string;
        city: string;
        district: string;
        detailed: string;
      };
      aggregateResult: {
        default: string;
        precent: string;
      };
    };
    filterRel: {
      and: string;
      or: string;
    };
    ratioLabel: {
      undefined: string;
      incValue: string;
      incRate: string;
      lastYincValue: string;
      lastYincRate: string;
      lastMincValue: string;
      lastMincRate: string;
      lastWincValue: string;
      lastWincRate: string;
    };
  };
  screenOptions: [
    {
      title: string;
      tip: string;
      type: string;
    },
    {
      title: string;
      tip: string;
      type: string;
    }
  ];
  Dview: {
    title: string;
    dropMenu_add: string;
    dropMenu_addGroup: string;
    dropMenu_addDS: string;
    dropMenu_addSQL: string;
    dropMenu_moveDS: string;
    tipTitle_delDS: string;
    tipTitle_delG: string;
    tipTitle_relieveG: string;
    tipCon_delDS: string;
    tipCon_delG: string;
    tipCon_relieveG: string;
    copyName: string;
    defN_group: string;
    emptyList: {
      tip: string;
      link_title: string;
    };
    DSpreview: {
      tab_pre: string;
      button_editDS: string;
      button_exportE: string;
      tip_errorDS: string;
      tip_addDS: string;
      tip_addSQL: string;
    };
    listMenu: {
      n_rename: string;
      n_edit: string;
      n_copy: string;
      n_remove: string;
      g_addGroup: string;
      g_rename: string;
      g_relieve: string;
      g_delete: string;
    };
    SQLedit: {
      defName: string;
      tip_empty: string;
      result_title: string;
      button_search: string;
      tip_eResult: string;
      toolTip_title: string;
      toolTip_des: string;
      failTip_title: string;
      message_saveS: string;
      message_error: string;
      button_close: string;
      button_open: string;
      modal_title: string;
      cancel: string;
      quit: string;
    };
    moveModal: {
      title: string;
      groupTitle: string;
      folderTitle: string;
      err_emptyDS: string;
      err_emptyF: string;
    };
  };
  Ddesign: {
    err_emptyDS: string;
    err_nodesLimit: string;
    err_setFail: string;
    err_eOutNode: string;
    tip_saveSuc: string;
    mainTable: string;
    subTable: string;
    flowSide: {
      listTitle_datasets: string;
      listTitle_process: string;
      listTitle_colTf: string;
      listTitle_dataTf: string;
      dType_input: string;
      dType_output: string;
      pType_unit: string;
      pType_join: string;
      cType_group: string;
      type_filter: string;
      type_compute: string;
      listIcon_Tip: string;
    };
    flowTools: {
      align_horizontal: string;
      align_vertical: string;
      justify_samehigh: string;
      justify_samewidth: string;
      tool_tip: {
        back: string;
        redo: string;
        delete: string;
      }
    };
    canvas: {
      emptyTip_step1: string;
      emptyTip_step2: string;
      emptyTip_step3: string;
      title_step1: string;
      title_step2: string;
      title_step3: string;
    };
    sModel: {
      title: string;
      sourceTitle: string;
      schemaCodeTitle: string;
      searchPla: string;
      tip_searchFail: string;
      check_all: string;
      tip_Maintable: string;
      tip_Subtable: string;
      listTitle: string;
    };
    stage: {
      Htab_setting: string;
      Htab_preview: string;
      Hbutton: string;
      H_finish: string;
      title_checked: string;
      input_source: string;
      change_source: string;
      warn_emptyDS: string;
      warn_emptyField: string;
      warn_emptyList: string;
    };
    stage_com: {
      addTitle: string;
      m_title: string;
      m_fieldNPla: string;
      m_formulaH: string;
      m_fieldTitle: string;
      m_funcTitle: string;
      m_sPla: string;
      m_typeNum: string;
      m_typeDate: string;
      m_typeStr: string;
    };
    stage_filter: {
      addTitle_font: string;
      addTitle_back: string;
      addTitle: string;
      pla_strIn: string;
      pla_dynaPla: string;
      pla_min: string;
      pla_max: string;
    };
    dynaModal: {
      delete: string;
      ok: string;
      startDate: string;
      endDate: string;
    };
    stage_unit: {
      title: string;
      check_isAdd: string;
      check_idDed: string;
      result_title: string;
    };
    stage_relate: {
      step1_title: string;
      step2_title: string;
      joinType_left: string;
      joinType_right: string;
      joinType_inner: string;
      check_addField: string;
      listTitle: string;
      warn_least: string;
      warn_isSame: string;
    };
    stage_group: {
      step1_title: string;
      step2_title: string;
      check_addDimField: string;
      check_addMetField: string;
      pla_select: string;
      warn_fieldLimit: string;
    };
    stage_output: {
      tool_hide: string;
      tool_daiplay: string;
      tool_rename: string;
    };
    help_modal: {
      title: string;
      help_link: string;
      union : {
        title: string;
        desc: string;
        item1_title: string;
        item1_desc: string;
        item1_example: string;
        item2_title: string;
        item2_desc: string;
        item2_example: string;
        item3_desc: string;
        item3_example: string;
      },
      join: {
        title: string;
        desc: string;
        item1_title: string;
        item1_desc: string;
        item2_title: string;
        item2_desc: string;
        item3_title: string;
        item3_desc: string;
      },
      group: {
        title: string;
        desc: string;
      },
      filter: {
        title: string;
        desc: string;
      },
      compute: {
        title: string;
        desc: string;
      }
    };
    noun_caption: {
      click_title: string;
      union: {
        text1: string;
        text2: string;
      },
      join: {
        text1: string;
        text2: string;
        text3: string;
      }
    };
    guide_modal: {
     entry : string;
     button_last: string;
     button_next: string;
     title1: string;
     title2: string;
     title3: string;
     title4: string;
     title5: string;
     title6: string;
     text1: string;
     text2: string;
     text3: string;
     text4: string;
     text5: string;
     text6: string;
     home_page_text: string;
     home_page_close: string;
    }
  };
  Doptions: {
    formulaType: {
      title_ltext: string;
      title_num: string;
      title_date: string;
      title_other: string;
      title_logic: string;
      logic_IF: string;
      logic_AND: string;
      logic_or: string;
      logic_IFS: string;
      ltext_LEN: string;
      ltext_LOWER: string;
      ltext_UPPER: string;
      ltext_TRIM: string;
      ltext_CONCATENATE: string;
    };
    dateSelectList: {
      Equal: string;
      NotEqual: string;
    };
    dateMapList: {
      Custom: string;
      Today: string;
      Yesterday: string;
      Tomorrow: string;
      ThisWeek: string;
      LastWeek: string;
      NextWeek: string;
      ThisMonth: string;
      LastMonth: string;
      NextMonth: string;
      ThisQuarter: string;
      LastQuarter: string;
      NextQuarter: string;
      ThisYear: string;
      LastYear: string;
      NextYear: string;
    };
    NodeErrorMessage: {
      RELATIONTARGETEDGES: string;
      BEFOREGROUPS: string;
      CURRENTSETTING: string;
      RELATIONREPEATEDMODEL: string;
      MERGETARGETEDGES: string;
      OUTPUTEMPTY: string;
      ISOLATEDNODE: string;
    };
    dateMap: {
      current: string;
      last: string;
      next: string;
      day: string;
      week: string;
      month: string;
      quarter: string;
      year: string;
    };
  };
  Analysis: {
    view: {
      title: string;
      close: string;
      addChart: string;
      tab_public: string;
      tab_preson: string;
      tab_ai: string,
      emptyTip_person: string;
      emptyTip_pubArrow: string;
      emptyTip_pubNoArrow: string;
      emptyExTitle: string;
      addChart_person: string;
    };
    chartPanel: {
      editData: string;
      editPreson: string;
    };
    toolbar: {
      span: {
        refresh: string;
        sort: string;
        full: string;
        edit: string;
        delete: string;
        drag: string;
        compare: string;
        exitFull: string;
        filter: string;
      };
      sort: {
        Oplabal_default: string;
        Oplabal_asc: string;
        Oplabal_desc: string;
      };
      delete: {
        modalContent: string;
      };
    };
    design: {
      default_name: string;
      button_save: string;
      name: string;
      add: string;
      select_pla: string;
      input: string;
      check_dateComplete: string;
      tip_dateComplete: string;
      input_number: string;
      fieldName: {
        dimension: string;
        metric: string;
        metricL: string;
        metricR: string;
        rowDim: string;
        colDim: string;
        ctip_cd: string;
        ctip_rd: string;
        tip_tableC: string;
      };
      fieldDropDown: {
        select_pla: string;
        search_pla: string;
        tip_searchf: string;
        tip_searchb: string;
        tip_noData: string;
      };
      metricSetModal: {
        tip: string;
        title: string;
        title_comma: string;
        title_percent: string;
        title_fraction: string;
        title_compute: string;
        title_target: string;
        warn_fractNum: string;
        comType_null: string;
        comType_precent: string;
        comType_ratio: string;
      };
    };
    mudules: {
      switchType: string;
      optionsTitle: {
        compareDate: string;
        styleOption: string;
        axisXOption: string;
        axisYOption: string;
        moreOrder: string;
        mapDigitalDisplaySet: string;
        crossSummary: string;
      };
      theme: string;
      axisx: {
        //x轴
        title_axis: string;
        title_position: string;
      };
      Legend: {
        //图例
        title: string;
      };
      Limit: {
        //数据保留
        title: string;
        inputPla: string;
      };
      DataLabel: {
        //数值标签
        title: string;
      };
      DataLabelPileSum: {
        //显示堆叠合计
        title: string;
      };
      metricRange: {
        //最大值，最小值
        maxTitle: string;
        minTitle: string;
        input: string;
      };
      orderNumber: {
        //显示序号
        title_show: string;
        title_dim: string;
        input_pla: string;
      };
      summary: {
        tab_rowSum: string;
        tab_columnSum: string;
        TdisRadio: string;
        TposRadio: string;
        Tmodal: string;
        check: string;
        m_title: string;
        m_nameTitle: string;
        m_dimTitle: string;
        m_sumTypeTitle: string;
        m_plaN: string;
        m_plaD: string;
        rPosBottom: string;
        rPosTop: string;
        cPosRight: string;
        cPosLeft: string;
        m_sumN: string;
      };
      freezeHead: {
        //冻结
        columnTitle: string;
        rowTitle: string;
        DLabel_freeze: string;
        Dlabal_nofreeze: string;
      };
      sort: {
        //排序
        title: string;
        wrap_open: string;
        wrap_close: string;
      };
      MetricLabel: {
        //显示指标值/名
        title_label: string;
        title_value: string;
      };
      Invert: {
        //转化率
        title: string;
        showtitle: string;
        comList_next: string;
        comList_all: string;
      };
      progressLabel: {
        //进度图
        valueTitle: string;
        percentTitle: string;
        targetTitle: string;
      };
      MapDigitalSet: {
        dimensionTitle: string;
        metricTitle: string;
      };
      GaugeMode: {
        //仪表图类型
        title: string;
        modeIn: string;
        modeOut: string;
      };
      MapDrill: {
        //地图钻取
        title: string;
        driLabal_province: string;
        driLabal_city: string;
        driLabal_disabled: string;
      };
      MapArea: {
        areaTitle: string;
        prinTitle: string;
        cityTitle: string;
        options_all: string;
        options_province: string;
        options_city: string;
        auto: string;
      };
      MapMode: {
        title: string;
        type_area: string;
        type_bubble: string;
      };
      MapTheme: {
        title: string;
      };
      dataLabel: {
        title_SplitLine: string;
        title_AxisYSet: string;
      };
      MultipleDataLabel: {
        dimLabelTitle: string;
        metricLabelTitle: string;
        perLabelTitle: string;
      };
      compare: {
        title_value1: string;
        title_value2: string;
      };
      merticType: {
        icontitleR: string;
        icontitleL: string;
      };
      orderNum: {
        title: string;
      };
    };
    config: {
      NumberTagOptions: {
        //显示隐藏
        labal_display: string;
        labal_hide: string;
      };
      directOption: {
        DType_hide: string;
        DType_Crosswise: string;
        DType_Endwise: string;
        DType_LeftBank: string;
        DType_RightBank: string;
      };
      LegendOption: {
        posType_hide: string;
        posType_Bottom: string;
        posType_Top: string;
        posType_Left: string;
        posType_Right: string;
      };
    };
  };
}

/** 语言种类 */
export type LanguageType = "cn" | "en";

/** 语言状态 */
export interface LanguageState {
  /** 当前应用的语言类型 */
  type: LanguageType;
  /** 是否需要缓存操作 */
  cache: boolean;
}
