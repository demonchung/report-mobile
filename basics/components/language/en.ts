import { LanguageInfo } from "./type";

const en: LanguageInfo = {
  normal: {
    help: "Help",
    term: " Term ",
    terms: " Terms ",
    sure: "Sure",
    cancel: "Cancel",
    input: "Please input",
    directExit: "Exit",
    saveExit: "Save&Exit",
    save: "Save",
    add: "Add",
    close: "Close",
    empty: "No Content",
    default: "Default",
    tip_saveSuc: "Save Successful",
    left: "Left ",
    right: "Right ",
    tip_saveFail: "Save Failed",
    select: "Please select"
  },
  el: {
    empty: "No Data Found",
    title: "Untitled Chart",
    tip_deleteFP: "Are you sure to delete the component：",
    image: {
      tip_empty: "Drag an image here or click upload.",
      tip_size: "The single image cannot exceed 5M.",
      warn_fail: "Current users cannot upload",
      tip_loading: "Uploading",
      tip_success: "Upload Completed",
      tip_fail: "Upload failed",
      message: "Uploading",
      tip_delete: "Are you sure to delete the component?",
      tip_ImageType: "Format only supports",
      tip_ImageSize: "The picture size cannot exceed"
    },
    chart: {
      addmodal: {
        title: "Chart Component Settings",
        placeholder: "Please enter a keyword",
        tab_formDS: "Data Sheet",
        tab_advancedDS: "Advanced Data Source",
        tip_nosearch: "No search results",
        tip_emptyadv: "No advanced data source, please click on",
        tip_emptyDS: "No Data"
      },
      tip_delete: "Are you sure to delete the component："
    },
    web: {
      modal_title: "Link Settings",
      input_pla: "Please enter a link",
      error_empty: "Please enter a link",
      error_http: "Please enter a link with https or http",
      tip_delete: "Are you sure to delete the component?"
    },
    tab: {
      tip_delete: "This operation will also delete charts or components within the Tab component. Do you want to continue?"
    },
    longtext: {
      tip_empty: "No Content",
      input_pla: "Input Content",
      fsize_oversized: "Oversized",
      fsize_large: "Large",
      fsize_small: "Small",
      fsize_default: "Default",
      tip_delete: "Are you sure to delete the component?"
    }
  },
  toolbar: {
    imageSelect: {
      labal_originCenter: "Center",
      labal_origin: "Filling",
      labal_draw: "Stretch"
    },
    span: {
      uploadImage: "Upload Image",
      copy: "Copy",
      delete: "Delete",
      linkCancel: "Cancel Relate",
      refresh: "Refresh",
      fullScreen: "Full Screen",
      sort: "Sort",
      edit: "Edit",
      remove: "Remove",
      filter: "Filter",
      fullScreenExit: "Exit Full Screen",
      com: "Compared",
      visible: "Visible",
      editWeb: "Edit link",
      rename: 'Rename'
    },
    LINKAGE: {
      //取消联动
      tip_nolinkage: "There is no chart relate with this.",
      tip_cancelLink: "Relate has been canceled"
    },
    SORT: {
      //排序弹窗
      Oplabal_default: "Default",
      Oplabal_asc: "Ascend",
      Oplabal_desc: "Descend",
      Oplabal_custom: "Customize",
      tip_empty: "No Sort Field",
      check_addField: "Sort Field",
      select_pla: "Please select a field",
      Modal_custom: {
        title: "Custom Sorting",
        searchPla: "Input",
        tip_noSValue: "No search results",
        tip_emptyValue: "No result, unable to custom sorting temporarily",
        check_toTop: "Top",
        toTopSuc: "Top Success"
      }
    },
    FILTER: {
      //筛选
      pla_select: "Please select a field",
      check: "Filter Field"
    },
    compareSort: {
      title_firstDim: "Dim. value1",
      title_SecDim: "Dim. value2"
    },
    editWeb: {
      title: "Link",
      inputPla: "Please enter a link"
    },
    export: {
      toolTitle: "Export",
      click_list: "Export to List",
      click_style: "Export to Style"
    }
  },
  view: {
    allSum: "all sum",
    pag_des: {
      page_totla: "Tol. ",
      page_des: " strip(s)",
      page_size: "/page",
      cpage_size: "/page",
      cpage_des: " column(s)"
    },
    header: {
      filter: "Filter",
      style: "Style",
      full: "Full Screen",
      mobile: "Mobile Layout",
      export: "Export",
      add: "Component",
      save: "Save",
      backMain: "Mobile Layout Settings",
      exportImage: "Export Image",
      globalFilter: {
        emptyTip: "No Filter Field",
        addFilter: "Filter",
        filter_title: "Filter Settings",
        selectChart_title: "1.Select Chart",
        select_all: "Select All",
        filterField_title: "2.Filter Field Settings",
        filterOptions_title: "3.Filter Logical Settings",
        filterName: "Filter Name",
        filterMode: "Filter Method",
        defaultValue: "Default Value",
        mode_default: "Default",
        mode_input: "Input Text",
        mode_select: "Select",
        input_tip: "Please enter a field name.",
        error_emptyfield: "Each data source must choose a field.",
        error_emptychart: "The chart of the dashboard is empty, please configure the chart.",
        error_selectchart: "Please select a chart.",
        filterLink_pla: "Select linkage component",
        filterLink_title: "Linkage"
      },
      globalStyle: {
        Style_title: "Dashboard Style Settings",
        title_styles: "Style",
        theme_auroraWhite: "White",
        theme_cherryPink: "Meteor",
        theme_interstellar: "Interstellar",
        theme_mirageNeon: "Neon",
        theme_black: "Black",
        theme_vastStarry: "Starry sky",
        theme_auroraForest: "Aurora",
        theme_dreamStar: "Galaxy",
        theme_twelve: "Soda blue",
        title_background: "Background Color",
        bgColor: "Global",
        component_bgColor: "Component",
        title_text: "Text Color",
        titleColor: "Title Color",
        textColor: "Body",
        colorPicker_default: "Default Color",
        colorPicker_theme: "Theme Color",
        colorPicker_colors: "Standard Color",
        colorPicker_more: "More",
        changeStyleModal: {
          title: "Style Switch",
          content: "After this operation, the original custom style will be overwritten. Are you sure to switch styles?"
        },
      },
      mobileLayout: {
        hide_title: "Hidden icon",
        hide_tip: "tip~",
        hide_tip1: "Click the hidden icon on the left to hide the chart",
        exit_tip: "The modification of your layout has not been preserved, save and exit?"
      },
      addmodal: {
        title: "New Component",
        tip_chart: "Providing different charts more than 10",
        tip_longtext: "Supporting customize inserting, text fixed, and so on",
        tip_filter: "Display the chart components after the filter",
        tip_image: "Using the image component to decorate your dashboard",
        tip_web: "Inserting the Web to query data",
        tip_tabs: "Drag to add components to the Tab, and easily switch to view different information through tabs",
        cName_chart: "Chart",
        cName_text: "Text",
        cName_filter: "Filter",
        cName_image: "Image",
        cName_web: "Web",
        cName_tabs: "Tab"
      },
      full_screen: {
        title_normal: "Normal Model",
        title_self: "Adaptive Model ",
        tip_n: "Appear scroll bar when there are too many components",
        tip_s: "Display the dashboard by all screen"
      },
      Export: {
        tip_loading: "Exporting pictures...",
        tip_success: "Picture has been generated!",
        warn: "Export exception, please try again",
        imageName: "DashboardSharing"
      }
    },
    progressCard: {
      title_precent: "Proportion: ",
      title_value: "Completed: ",
      title_target: "Target Num: ",
      null: "Null"
    },
    container: {
      IniPage: {
        tip_noChart: "No component,Please drag and add from the top left",
        tip_link: "How to configure your dashboard",
        add: "Conponents",
        tip_noData: "No Content"
      }
    }
  },
  design: {
    ds_title: "Data Sources",
    ds_change: "Change",
    ds_chModalTitle: "Select Data Sources",
    tip_chEmpty: "Please select a data source",
    tip_modalConcent:
      "After changing the data source, do you need to change all the configuration content of the empty chart?",
    tip_modalTitle: "Change the data source",
    ds_auTitle: "Data permission",
    dsau_person: "User own data permission",
    dsau_all: "All data",
    ds_fieldTitle: "Field List",
    ds_searchPla: "Search",
    tip_notsave: "The changes you made to the chart have not been saved,save and exit?",
    tabOption_ability: "Function",
    tabOption_style: "Style",
    filter: {
      tip_maxFilter: "Up to 20 fields can be set as filter conditions",
      tip_closeFilter: "Put the filter conditions away",
      tip_openToadd: "Expand Add or Condition",
      tip_openToshow: "Display complete filter conditions",
    },
    deData: {
      DF_title: "Layer",
      DF_defLay: "Layer 1",
      DF_showEdLayN: "Rename",
      DF_showDelMod: "Delete",
      DF_delTip: "Delete this layer?",
      pla: "Drop a field here"
    },
    DF_title: {
      dim_list: "Col.",
      dim: "Dim.",
      filter: "Filter Cond.",
      dim_colum: "Col. Dim.",
      dim_row: "Row Dim.",
      metric: "Metric",
      metric_left: "Metric(L)",
      metric_right: "Metric(R)"
    },
    DF_tip: {
      dim: "Dimension is the basis for data classification",
      table_RD: "Row dimension is the basis for classifying the pivot table row data",
      table_CD: "Column dimension is the basis for classification of PivotTable column data",
      metric:
        "Indicator is the data to be counted. It will be summarized and calculated according to the grouping method set in dimension",
      cross_RD: "Row dimension is the basis for classifying the row data of the crosstab",
      cross_CD: "Column dimension is the basis for classification of cross tabular data",
      filter: "1. Fields can be dragged in by group, the filter condition within a group is 'and condition', and the filter condition between groups is 'or condition' 2. Up to 20 fields can be used to configure filter conditions"
    },
    computeField: {
      addTitle: "Calculated field",
      tip_forbidAdvanced: "The advanced data source does not allow the creation of calculation fields.",
      tip_maximum: "A single chart can create up to 70 calculation fields!",
      tip_mutualExclusion: "It is not supported to use aggregate function and non aggregate function at the same time!",
      tip_deleteField: "Are you sure you want to delete this calculated field?",
      tip_changefield: "This calculation field has been modified, please reconfigure it!",
      title_copy: "Copy"
    }
  },
  modules: {
    switchTypeMode: {
      bar: "Column Chart",
      pileBar: "Stacked Column Bar",
      stripe: "Bar Chart",
      pileStripe: "Stacked Bar Chart",
      card: "Card",
      list: "List",
      gaugeIn: "Gauge-In Chart",
      gaugeOut: "Gauge-Out Chart",
      area: "Area Map",
      bubble: "Bubble Map",
      ring: "Ring",
      solid: "Solid",
    },
    AxisYSet: {
      title: "Axis",
      AX_title: "X-axis",
      AX_disX: "Show Axis",
      AX_disXtitle: "Show Axis Labels",
      AY_title: "Y-axis",
      AY_disYtitle: "Scale",
      dirTitle: "Text Direction",
      DType_Crosswise: "Horizontal",
      DType_Endwise: "Vertical",
      DType_LeftBank: "Left tilt",
      DType_RightBank: "Right tilt",
      AY_yTitle: 'Axis title',
      placeholder: 'Please enter a title',
      AY_yTitle_L: 'Left Y axis',
      AY_yTitle_R: 'Right Y axis'
    },
    Legend: {
      //图例
      title: "Legend",
      disLegTitle: "Legend",
      legPosTitle: "Location",
      posType_Bottom: "Bottom",
      posType_Top: "Top",
      posType_Left: "Left",
      posType_Right: "Right"
    },
    CardSetting: {
      maxColTitle: "max-number of columns per row",
    },
    DataLabel: {
      title: "Label",
      Optionstitle: "Value"
    },
    DataLabelPileSum: {
      //显示堆叠合计
      title: "Label",
      Optionstitle: "Pile Up"
    },
    DataLabelFontSize: {
      //标签字体大小
      title: "Font Size",
    },
    MultipleDataLabel: {
      dimTitle: "Dimension",
      metTitle: "Value",
      perTitle: "Proportion"
    },
    MetricLabel: {
      //显示指标名
      title: "Metric Name ",
      valueTitle: "Metric Value"
    },
    TextAlign: {
      //文字位置
      title: "Location",
      labal_left: "Left",
      labal_right: "Right",
      labal_center: "Center"
    },
    AdaptiveSize: {
      //自适应大小
      title: "Proportion",
      labal_small: "Small",
      labal_default: "Default",
      labal_large: "Large"
    },
    ProgressLabel: {
      valueTitle: "Value",
      percentTitle: "Proportion",
      targetTitle: "Target Number"
    },
    DataLabelPosition: {
      //饼图标签
      title: "Label",
      posTitle: "Label Location",
      pos: "Location",
      pos_pie: "Pie Side",
      pos_legend: "Legend Side",
      specPos: "Specific Location",
      specPos_out: "Outside",
      specPos_in: "Inside"
    },
    ListTextAlign: {
      title: "Align",
      tAlignOp_default: "Default",
      tAlignOp_left: "Left",
      tAlignOp_center: "Center",
      tAlignOp_right: "Right"
    },
    base: {
      //基础信息
      title: "Basic Information",
      title_chartColor: "Chart Color",
      title_fontSet: "Text Settings",
      title_charts: "Chart Type", //图表类型
      typeT_pie: "Chart Types",
      typeT_base: "Chart Types",
      typeT_gauge: "Chart Types",
      typeT_map: "Chart Types",
      classify_label: "Label"
    },
    ElementCoat: {
      title: "Component"
    },
    FontSetting: {
      //文字设置
      headTitle: "Title Color",
      contentTitle: "Text Color",
      sizeTitle: "Font Size"
    },
    Theme: {
      title: "Theme"
    },
    MapTheme: {
      bubbleTitle: "Bubble Color",
      mapTitle: "Map Color"
    },
    MapDigitalSet: {
      //地图标签
      dimensionTitle: "Dimension Value",
      metricTitle: "Metric Value"
    },
    FilterNone: {
      //维度空值过滤
      title: "Void Value Dimension Filter",
      classify: "Data Display",
      tip:
        "Instructions：<br/> When the dimension value is empty, but its corresponding indicator value is not empty, the empty dimension value and its indicator value are automatically filtered.<br/>Note: When the dimension is a calculation field, you need to use the IFNULL function in the calculation field or filter through filtering.",
      moduleTitle: "Filter"
    },
    Limit: {
      //显示前N条维度
      title: "Visible Dim. Num.",
      classify: "Data Display",
      input_pla: "Please input",
      moduleTitle: "Data Retention"
    },
    DimensionLimit: {
      //显示前N条维度
      title: "Visible Dim. Num.",
      classify: "Data Display",
      rowNumTitle: "Data Number",
      inpla: "Please input"
    },
    GroupSetting: {
      //系列设置
      title: "Series Settings",
      classify: "Data Display",
      tip:
        "Supporting conditions：<br/> 2 dimensions and 1 metric.<br/> Instructions：<br/> The number of series is the classification number of secondary dimensions of 2 dimensions and 1 indicator situation.",
      limitTitle: "Series Number limit",
      inputPla: "Please input",
      otherTitle: 'Display "Other"'
    },
    SwitchLayers: {
      //图层切换
      title: "Layers Switched",
      tip:
        "When layer switching is enabled, directly click the corresponding layer below,<br/> The content of the corresponding layer can be displayed completely.",
      classify: "Data Interact",
      modulesTitle: "Layers Switched"
    },
    MetricRange: {
      //指标范围
      title: "Metric Range",
      classify: "Data Display",
      inputPla: "Please input",
      maxTitle: "Maximum",
      minTitle: "Minimum"
    },
    Linkage: {
      //图表联动
      title: "Chart Related",
      classify: "Data Interact",
      inpla: "Please choose"
    },
    WarningLine: {
      //警戒线
      title: "Reference Line",
      click_add: "Add",
      classify: "Metric Analysis",
      modal: {
        title: "Reference Line",
        title_name: "Name",
        nameInPla: "Please enter a name.",
        title_type: "Types",
        tRadio_fixed: "Fixed",
        tInput_pla: "Please enter a target value",
        tRadio_dynamic: "Float",
        tSelect_average: "Average",
        tSelect_max: "Maximum",
        tSelect_min: "Minimum",
        title_show: "Display Style",
        sRadio_name: "Name",
        sRadio_value: "Value",
        sRadio_nameValue: "Name + Value",
        title_color: "Color",
        eTip_emptyName: "Please enter the name of the warning line",
        eTip_errorName: "The name of the warning line cannot exceed 20 characters",
        eTip_emptyType: "Please enter the value",
        eTip_errorType: "Please enter a number or percentage",
        eTip_emptyMetic: "Please select the metric field"
      }
    },
    jumpLink: {
      //跳转仪表盘
      title: "Jump Dashboard",
      classify: "Data Interact",
      check_set: "Settings",
      modal: {
        title: "Jump Settings",
        addTitle: "Add Jump",
        addRules: "Add Jump Rule",
        tip_emptyLink1: "Click on the left",
        tip_emptyLink2: "and add jump method",
        check_emptyLink: "add jump method",
        R_title: "Rule",
        R_titleCopy: "Copy",
        R_titleEditS: "Sure",
        Rtitle_jumpTo: "Select target dashboard",
        R_jumpToTitle: "jump to",
        R_jumpToPla: "Please select dashboard",
        Rtitle_openType: "Opening mode",
        R_openTypeNW: "New window",
        Rtitle_jumpMethod: "Data Setting",
        R_jmNone: "Without Data",
        R_jmNormal: "Default",
        R_jmCustom: "Customize",
        tip_delRuleT: "Are you sure to delete this jump?",
        tip_delRuleC: "This setting will be terminated and deleted, and cannot be restored.",
        err_rulesLen: "Rules cannot exceed 5!",
        err_eDashboard: "The dashboard has been deleted, please reconfigure!",
        check_addCus: "Add data setting",
        cv_selPla: "Target field selection",
        cv_notFind: "No match results",
        cv_fTypePla: "Please choose the type",
        cv_selFieldPla: "Please select the metric value",
        cv_del: "Delete",
        err_cvLen: "Add up to 10 target fields."
      },
      filterVO_normal: "Value",
      filterVO_refValue: "Ref value",
      rulesMO_edit: "Edit",
      rulesMO_copy: "Copy",
      rulesMO_del: "Delete"
    },
    DataZoom: {
      //缩略轴
      classify: "Scroll Bar",
      showTitle: "Scroll Bar",
      themeOP_light: "Light",
      themeOP_dark: "Dark",
      colorTitle: "Color"
    },
    Forecast: {
      //指标预测
      classify: "Metric Analysis",
      numberTitle: "Forecast Num",
      title: "Metric Forecast",
      inputPla: "Please enter the number of periods",
      tip:
        "Supporting conditions：<br/> Dimension is a datetime type field.<br/> 1 dimension and 1+ metric <br/> Instructions：<br/> When the forecast is enabled, the chart is sorted in ascending order by date dimension by default."
    },
    Download: {
      title: "Export",
      classify: "Chart Operation",
      labal_allow: "Unlimited",
      labal_noallow: "Limited"
    },
    OrderNumber: {
      title: "Serial Number",
      classify: "Data Display",
      OrderNameT: "Serial Number Name",
      orderName: "Serial Number"
    },
    MoreOrderNumber: {
      //显示序号
      classify: "Data Display",
      title: "Serial Number",
      innerTitle: "Select Dimension",
      innerPla: "Select dimension display serial number"
    },
    FreezeHead: {
      title: "Freezen",
      classify: "Data Display",
      rowTitle: "Row Dimension",
      columnTitle: "Column Dimension",
      colNumTitle: "Number of Columns",
      rowNumTitle: "Number of Rows",
      inpla: "Please input",
      DLabel_freeze: "Freezen",
      Dlabal_nofreeze: "No Freezen",
      columnTitle_sheet: "Sheet Header"
    },
    CrossSummary: {
      //汇总设置
      classify: "Data Interact",
      title: "Totals Settings",
      tab_rowSum: "Row",
      tab_columnSum: "Column",
      TdisRadio: "Overall",
      TposRadio: "Location",
      Tmodal: "Category",
      check: " Add",
      m_title: "Totals",
      m_nameTitle: "Name",
      m_dimTitle: "Dimension",
      m_sumTypeTitle: "Totals",
      m_plaN: "Please enter a totals name",
      m_plaD: "Please select demension",
      rPosBottom: "Bottom",
      rPosTop: "Top",
      cPosRight: "Right",
      cPosLeft: "Left",
      m_sumN: "Totals"
    },
    MultiMetricType: {
      classify: "Data Display",
      icontitleR: "Right-axis",
      icontitleL: "Left-axis"
    },
    MultiRange: {
      classify: "Data Display",
      titleR: "Right-axis",
      titleL: "Left-axis"
    },
    Conversion: {
      //转化率
      classify: "Data Display",
      title: "Conversion Rate"
    },
    Invert: {
      classify: "Data Display",
      title: "Conversion Rate",
      showtitle: "Calculation",
      comList_next: "Percentage of the upper layer.",
      comList_all: "Percentage of the first floor."
    },
    SortPercent: {
      classify: "Data Display",
      title: "Sort",
      TagOp_default: "Default",
      TagOp_fall: "Descend",
      TagOp_sise: "Ascend"
    },
    MapArea: {
      //地图范围
      classify: "Data Display",
      title: "Map Range",
      areaTitle: "Display Range",
      prinTitle: "Province",
      cityTitle: "City",
      options_all: "State",
      options_province: "Province",
      options_city: "City",
      auto: "Auto"
    },
    MapDrill: {
      //地图钻取
      classify: "Data Interact",
      title: "Map Drill Down",
      driLabal_province: "Drill Down to Province",
      driLabal_city: "Drill Down to City",
      driLabal_disabled: "Disabled"
    },
    groupMapping: {
      //表格类,趋势对比类
      class_table: "Table",
      class_trendcom: "Trend and Compare",
      class_metric: "Metric",
      class_distribute: "Distribution"
    }
  },
  config: {
    CascaderTitle: {
      TitlePla: "Please enter the display name",
      labalTitle: "Source field：",
      warn_titleLen: "Field name cannot be greater than 32 bytes"
    },
    NumberFormat: {
      check_comma: "Thousands",
      check_percent: "Percentile",
      check_fraction: "Decimal Place",
      fraInput_pla: "Please enter the number of decimal places."
    },
    ResultFilter: {
      check: "Result Filter",
      title_filterNum: "Filter Condition",
      title_fun: "Filter Logic",
      inputPla: "​Please enter a value",
      minPla: "Minimum",
      maxPla: "Maximum",
      result: "Result",
      NumType_Equal: "Equal To",
      NumType_NotEqual: "Not equal To",
      NumType_Above: "Above",
      NumType_NotBelow: "NotBelow",
      NumType_Below: "Below",
      NumType_NotAbove: "NotAbove",
      NumType_Range: "Range",
      NumType_None: "None",
      NumType_NotNone: "NotNone",
      error_empty: "The content must not be empty",
      error_equal: "The maximum value cannot be less than or equal to the minimum value"
    },
    TargetValue: {
      //目标值设置
      typeTitle: "Type",
      labal_fixed: "Fixed",
      labal_dynamic: "Dynamic",
      innerFieldTitle: "Select Field",
      aggTypeTitle: "Totals"
    },
    filterModal: {
      //设置过滤条件
      title: "Set the filter condition",
      error_emptyV: "The value cannot be empty",
      mes_emptyV: "Filter conditions must not be empty"
    },
    menulistName: {
      title: "Rename",
      hiddenField: "Hide",
      aggregateType: "Totals",
      aggregateResult: "Totals Result",
      ratioAnalyze: "Comparison",
      numberFormat: "Number Format",
      resultFilter: "Result Filters",
      dateFormat: "Date Format",
      targetValue: "Target Value",
      transformBar: "Data Column",
      format: "Format",
      displayField: "Display"
    },
    dateFormat: {
      //日期格式设置
      title: "Date Format",
      custom: "Custom"
    }
  },
  components: {
    numberFormat: {
      check_comma: "Thousands",
      check_percent: "Percentile",
      check_fraction: " Decimal Place",
      fraInput_pla: "Please enter the number of decimal places."
    },
    numberInPla: "​Please enter a value"
  },
  saticOP: {
    openTagOptions: {
      labal_close: "Close",
      labal_open: "Open"
    },
    NumberTagOptions: {
      //显示隐藏
      labal_display: "Display",
      labal_hide: "Hide"
    },
    ElementCNType: {
      MAP: "Map", // 地图
      BAR: "Column Chart", // 柱状图
      PILEBAR: "Stacked Column Bar", // 堆叠柱状图
      STRIPE: "Bar Chart", // 条形图
      LINE: "Line Chart", // 折线图
      AREA: "Area Chart", // 面积图
      PIE: "Pie Chart", // 饼图
      FUNNEL: "Funnel Chart", // 漏斗图
      PILESTRIPE: "Stacked Bar Chart", //堆叠条形图
      RADAR: "Radar Chart", // 雷达图
      TABLE: "Pivot Table", // 透视图
      CROSSTABLE: "Cross Table", // 透视图
      LIST: "List", // 明细表
      CARD: "Scorecard", // 指标图
      SCATTER: "Scatter Chart", // 散点图（气泡图）
      BIAX: "Dual Line", // 双轴图
      LONGTEXT: "Long Text", // 文本图
      FILTERPICKER: "Filter Picker", // 过滤器
      PROGRESSBAR: "Progress Chart", // 进度图
      GAUGE: "Gauge Chart", // 仪表图
      FUNNELCOMPARE: "Comparable Funnel Chart", // 对比漏斗图
      PERCENTPILEBAR: "100% Stacked Column Bar", // 百分比堆叠柱状图
      PERCENTPILESTRIPE: "100% Stacked Bar Chart" // 百分比堆叠条形图
    },
    ChartNotice: {
      BAR: "1 dimension, 1+ metric(s)<br>2 dimensions, 1 metric", // 柱状图
      PILEBAR: "1 dimension, 1+ metric(s)<br>2 dimensions, 1 metric", // 堆叠柱状图
      STRIPE: "1 dimension, 1+ metric(s)<br>2 dimensions, 1 metric", // 条形图
      PILESTRIPE: "1 dimension, 1+ metric(s)<br>2 dimensions, 1 metric", // 条形图
      LINE: "1 dimension, 1+ metric(s)<br>2 dimensions, 1 metric", // 折线图
      AREA: "1 dimension, 1+ metric(s)<br>2 dimensions, 1 metric", // 面积图
      PIE: "1 dimension, 1 metric", // 饼图
      FUNNEL: "1 dimension, 1 metric", // 漏斗图
      RADAR: "1 dimension, 1+ metric(s)<br>2 dimensions, 1 metric", // 雷达图
      TABLE: "1 dimension, 1+ metric(s)<br>1+ dimension(s), 1+ metric(s)", // 透视图
      CROSSTABLE: "1 dimension, 1+ metric(s)<br>1+ dimension(s), 1+ metric(s)", // 交叉表
      LIST: "1+ dimension(s)", // 明细表
      CARD: "0 dimension, 1+ metric<br>1 dimension, 1 metric", // 指标图
      SCATTER: "1 dimension, 2 or 3 metric(s)<br/>2 dimensions, 2 or 3 metric(s)", // 散点图（气泡图）
      BIAX: "1 dimension, 1+ metric(s)<br>2 dimensions, 1 metric", // 双轴图
      MAP: "1 dimension, 1 metric", // 地图
      PROGRESSBAR: "0 dimension, 1+ metric(s)<br>1 dimension, 1+ metric(s)", // 进度图
      GAUGE: "0 dimension, 1 metric", // 仪表图
      FUNNELCOMPARE: "1 dimension, 1+ metric(s)", // 对比漏斗图
      PERCENTPILEBAR: "1 dimension, 1+ metric(s)", // 百分比堆叠柱状图
      PERCENTPILESTRIPE: "1 dimension, 1+ metric(s)" // 百分比堆叠条形图
    },
    FilterType: {
      string: {
        Equal: "Equal to",
        NotEqual: "Not equal to",
        Match: "Include",
        NotMatch: "Not Include",
        In: "Equal to any",
        NotIn: "Not equal to any",
        None: "Empty",
        NotNone: "Not empty"
      },
      number: {
        Equal: "Equal to",
        NotEqual: "Not equal to",
        Range: "Between",
        Above: "Greater than",
        NotBelow: "Greater than or equal to",
        Below: "Less than",
        NotAbove: "Less than or equal to",
        None: "Empty",
        NotNone: "Not empty"
      },
      address: {
        Belong: "Contain",
        NotBelong: "Not contain",
        None: "Empty",
        NotNone: "Not empty"
      },
      date: {
        Equal: "Equal to",
        NotEqual: "Not equal to",
        Above: "Greater than",
        NotBelow: "Greater than or equal to",
        Below: "Less than",
        NotAbove: "Less than or equal to",
        Range: "Between",
        Dynamic: "Dynamic",
        None: "Empty",
        NotNone: "Not empty"
      }
    },
    formatDataList: {
      Date: "Date",
      Time: "Date And Time",
      Month: "Year And Month"
    },
    dateFormatList: {
      Y: "YYYY",
      YM: "YYYY-MM",
      YMD: "YYYY-MM-DD",
      YMDHM: "YYYY-MM-DD HH:mm",
      YMDHMS: "YYYY-MM-DD HH:mm:ss",
      HM: "HH: mm",
      HMS: "HH:mm:ss"
    },
    enumType: {
      string: {
        count: "Count",
        countDistinct: "Count Distinct"
      },
      number: {
        sum: "Sum",
        avg: "Average",
        max: "Maximum",
        min: "Minimum",
        count: "Count",
        countDistinct: "Count Distinct"
      },
      date: {
        y: "Y",
        yq: "Y-Q",
        ym: "Y-M",
        yw: "Y-W",
        ymd: "Y-M-D",
        m: "M",
        md: "M-D",
        d: "D",
        yqm: "Y-Q-M",
        yqmd: "Y-Q-M-D",
        q: "Q",
        qm: "Q-M",
        qmd: "Q-M-D",
      },
      address: {
        province: "Province",
        city: "Province-City",
        district: "Province-City-Region",
        detailed: "Detailed"
      },
      aggregateResult: {
        default: "Value",
        precent: "Proportion"
      }
    },
    filterRel: {
      and: "All",
      or: "Any"
    },
    ratioLabel: {
      undefined: "NO",
      incValue: "Chain growth value",
      incRate: "Chain growth rate",
      lastYincValue: "Year on year growth value",
      lastYincRate: "Year on year growth rate",
      lastMincValue: "Year-on-year growth in last month",
      lastMincRate: "Year-on-year growth rate last month",
      lastWincValue: "Year-on-year growth last week",
      lastWincRate: "Year-on-year growth rate last week"
    }
  },
  screenOptions: [
    {
      title: "abc",
      tip: "When there are too many components, scroll bar will appear",
      type: "normal"
    },
    {
      title: "dcb",
      tip: "The instrument panel always occupies a whole screen",
      type: "adapt"
    }
  ],
  Dview: {
    title: "Dataflow",
    dropMenu_add: "Add",
    dropMenu_addGroup: "New Group",
    dropMenu_addDS: "New Dataflow",
    dropMenu_addSQL: "New SQL Dataflow",
    dropMenu_moveDS: "Multi-moved",
    tipTitle_delDS: "Are you sure you want to delete this data source?",
    tipTitle_delG: "Are you sure you want to delete this group?",
    tipTitle_relieveG: "Are you sure to relieve the group?",
    tipCon_delDS: "It cannot be restored after deletion. Please be careful",
    tipCon_delG:
      "The group and all data sources in the group will be deleted. Please delete it carefully",
    tipCon_relieveG: "After the grouping is relieved, the data flow will be uniformly assigned to the upper level",
    copyName: "Copy_",
    defN_group: "Untitled Group",
    emptyList: {
      link_title: "You can add a new Dataflow on the right",
      tip: "Help",
    },
    DSpreview: {
      tab_pre: "Preview",
      button_editDS: "Edit",
      button_exportE: "Export",
      tip_errorDS: "Error in advanced data source configuration, please reconfigure",
      tip_addDS: "Data processing nodes are provided through drag-and-drop operations, such as association and field settings, to achieve data processing",
      tip_addSQL: "According to the form data, customize and configure the SQL statement and query the data after executing the SQL statement to realize data processing",
    },
    listMenu: {
      n_rename: "Rename",
      n_edit: "Edit",
      n_copy: "Copy Dataflow",
      n_remove: "Delete Dataflow",
      g_addGroup: "Add Subgroup",
      g_delete: "Delete Group",
      g_relieve: "Relieve Group",
      g_rename: "Rename",
    },
    SQLedit: {
      defName: "Untitled custom SQL",
      tip_empty: "Please enter a SQL statement",
      result_title: "Query Results",
      button_search: "Verify Query",
      tip_eResult: "Please enter a SQL statement query",
      toolTip_title: "Table structure description",
      toolTip_des:
        "The table name needs to be added with I before the custom module code, If the code of the form is d00021liuc, the corresponding database table name is I_ D00021liuc, the sub table is the sub table control code preceded by I_ That is, the database table name. The field name is the control code.",
      message_error: "Please check through query first",
      message_saveS: "Advanced data source saved successfully",
      failTip_title: "Failure Reason",
      button_close: "Expand the query result column",
      button_open: "Collapse the query result column",
      modal_title: "Your modifications to the SQL data stream have not been saved. Are you sure to exit?",
      cancel: "Cancel",
      quit: "Exit"
    },
    moveModal: {
      title: "Multi-selection",
      groupTitle: "Step 1: Select the dataflow",
      folderTitle: "Step 2: Select move to",
      err_emptyDS: "Please select the dataflow to move",
      err_emptyF: "Please select which folder to move to"
    }
  },
  Ddesign: {
    err_emptyDS: "Please configure a data source",
    err_nodesLimit: "The number of configured input nodes exceeds the limit",
    err_setFail: "The current data flow configuration is incorrect",
    err_eOutNode: "The current data flow has no output node",
    tip_saveSuc: "Succussed Save",
    mainTable: "Primary Sheet",
    subTable: "Secondary Sheet",
    flowSide: {
      listTitle_datasets: "Dataset",
      listTitle_process: "Data Processing",
      listTitle_colTf: "Column Transform",
      listTitle_dataTf: "Data Transform",
      dType_input: "Input",
      dType_output: "Output",
      pType_unit: "Union",
      pType_join: "Relate",
      cType_group: "Group and Summary",
      type_filter: "Filiter",
      type_compute: "Calculated Field",
      listIcon_Tip: "Click to view function introduction"
    },
    flowTools: {
      align_horizontal: "Horizontal Alignment",
      align_vertical: "Vertical Alignment",
      justify_samehigh: "Horizontal Isometric",
      justify_samewidth: "Vertical Isometric",
      tool_tip: {
        back: "Revoke Ctrl + z",
        redo: "Redo Ctrl + y",
        delete: "Delete Delete"
      }
    },
    canvas: {
      emptyTip_step1: 'Drag and drop "Input", select data',
      emptyTip_step2: 'Drag and drop the conversion operation and input "Input"',
      emptyTip_step3: "Connect and name the output data",
      title_step1: "Step 1",
      title_step2: "Step 2",
      title_step3: "Step 3"
    },
    sModel: {
      title: "Data Source",
      sourceTitle: "1. Please select data source",
      schemaCodeTitle: "2. Please select field",
      searchPla: "Search",
      tip_searchFail: "No query result!",
      check_all: "Select All",
      tip_Maintable: "Primary Sheet",
      tip_Subtable: "Secondary Sheet",
      listTitle: "Data Source"
    },
    stage: {
      Htab_setting: "Configure",
      Htab_preview: "Preview",
      Hbutton: "Change Data Sources",
      input_source: "Source",
      change_source: "Change Source",
      H_finish: "Finished",
      title_checked: "Selected fields",
      warn_emptyDS: "Please configure a data source",
      warn_emptyField: "Please select at least one field",
      warn_emptyList: "Model list is empty!"
    },
    stage_com: {
      addTitle: "New Calculated Field",
      m_title: "Calculated Field",
      m_fieldNPla: "Please enter calculated field name",
      m_formulaH: "Expression",
      m_fieldTitle: "Available Variable",
      m_funcTitle: "Available Functions",
      m_sPla: "Search Function",
      m_typeNum: "Number",
      m_typeDate: "Date", //时间戳
      m_typeStr: "String"
    },
    stage_filter: {
      addTitle_font: "Retain data for the following",
      addTitle_back: "conditions",
      addTitle: "New Filter Rules",
      pla_strIn: "Please add filter value",
      pla_dynaPla: "Please select a time",
      pla_max: "Maximum",
      pla_min: "Minimum"
    },
    dynaModal: {
      delete: "Clear",
      ok: "OK",
      startDate: "Start Time",
      endDate: "End Time"
    },
    stage_unit: {
      title: "Union settings",
      check_isAdd: "Append Union Only",
      check_idDed: "Duplicate Removal",
      result_title: "Union Result"
    },
    stage_relate: {
      step1_title: "1. Please select relate method",
      step2_title: "2. Please config relate field",
      joinType_left: "Left Join",
      joinType_right: "Right Join",
      joinType_inner: "Internal Join",
      check_addField: "New Relate Rule",
      listTitle: "Sheet",
      warn_least: "There must be at least one set of relate fields",
      warn_isSame: "Inconsistent connection field types"
    },
    stage_group: {
      step1_title: "1.Group Field Settings",
      step2_title: "2.Summary Field Settings",
      check_addDimField: "New Group Field",
      check_addMetField: "New Summary Field",
      pla_select: "Please select",
      warn_fieldLimit: "The total number of grouping fields and summary fields shall not exceed ten"
    },
    stage_output: {
      tool_hide: "Hide",
      tool_daiplay: "Display",
      tool_rename: "Rename"
    },
    help_modal: {
      title: "Function Description",
      help_link: "help guide",
      union : {
        title: "Union",
        desc: "The merge node is used to merge multiple tables (<span style='color: #315EFB;'>need to connect at least two input sources</span>), and provides two merge methods: 「Union」 and 「Append-only Union」",
        item1_title: "Union",
        item1_desc: "「Union」That is, full connection, the fields of each table are <span style='color: #315EFB;'>deduplicated and merged</span>, and the corresponding data is spliced ​​according to the rules. If there is no corresponding data in some fields, it will be displayed as empty .",
        item1_example: "For example: it is necessary to merge the two data tables of the purchase order and the sales order, and splicing the 'product name' of the purchase order with the 'product name' of the sales order. The merged result is as follows:",
        item2_title: "Append-only Union",
        item2_desc: "「Append-only Union」Multi-table data can be combined <span style='color: #315EFB;'>top and bottom</span> according to the field splicing rules",
        item2_example: "For example: it is necessary to concatenate the 'product name' of the purchase order and the 'product name' of the sales order for additional merging. Examples are as follows:",
        item3_desc: "If <span style='color: #315EFB;'>turn on「Deduplication」</span>, When <span style='color: #315EFB;'>multiple pieces of data</span> have <span style='color: #315EFB;'>all field values ​​are exactly the same</span>, deduplication will be performed.",
        item3_example: "For example: two purchase orders need to be added and merged, and 「whether to deduplicate」is turned on, the 'product name' of purchase order 1 needs to be spliced ​​with the 'product name' of purchase order 2, and the 'purchase price' and 'purchase Value' for splicing, and when the field values ​​after splicing are exactly the same, deduplication will be performed. Examples are as follows:",
      },
      join: {
        title: "Relate",
        desc: "「Association」 splices the data of <span style='color: #315EFB;'>two data tables</span> left and right according to the set association method and connection fields. Examples are as follows:",
        item1_title: "Left Join",
        item1_desc: "<span style='color: #315EFB;'>Based on the data in the left table, match the data in the right table according to the connection fields</span>. If there is data in the left table and no data in the right table, the data in the left table will be displayed, and the data in the right table will be displayed as empty.",
        item2_title: "Right Join",
        item2_desc: "<span style='color: #315EFB;'>Based on the data in the right table, match the data in the left table according to the connection fields</span>. If there is data in the right table and no data in the left table, the data in the right table will be displayed, and the data in the left table will be displayed as empty.",
        item3_title: "Internal Join",
        item3_desc: "Match the data in the two tables according to <span style='color: #315EFB;'>the value of the common field of each table</span>, that is, return the data intersection of the left and right forms.",
      },
      group: {
        title: "Group and Summary",
        desc: "First set the grouping field, combine <span style='color: #315EFB;'>fields with the same value into a group</span>, and then set the summary field and summary method. Examples are as follows:",
      },
      filter: {
        title: "Filter",
        desc: "「Filter」：By <span style='color: #315EFB;'>add filter</span>, filter out data that does not meet the specified criteria. Examples are as follows:",
      },
      compute: {
        title: "Calculated Field",
        desc: "「Calculated Field」：<span style='color: #315EFB;'>Add calculated field</span>, edit the formula to calculate the data. Examples are as follows:",
      }
    },
    noun_caption: {
      click_title: "View image and text examples",
      union: {
        text1: "After「append and merge only」is enabled, the fields spliced together will be merged up and down. When the field values are repeated, no de-duplication operation will be performed;",
        text2: "After「De-duplication」is enabled, when all field values of the two data are the same, the de-duplication operation will be performed;"
      },
      join: {
        text1: "Left Join: based on the data in the left table, match the data in the right table according to the connection fields.",
        text2: "Right Join: based on the data in the right table, match the data in the left table according to the connection fields.",
        text3: "Internal Join: match the data in the two tables according to the values of the common fields in each table.",
      }
    },
    guide_modal: {
      entry : "Build Guide",
      button_last: "Last step",
      button_next: "Next step",
      title1: "Data flow",
      title2: "Data flow interface",
      title3: "Know the function of the node",
      title4: "How to build data flow",
      title5: "Data stream storage",
      title6: "Configure Charts in Dashboard",
      text1: "The data flow is composed of nodes and connection lines, and connecting nodes to nodes can quickly realize data processing of one or more data tables.",
      text2: "The node bar on the left shows all available nodes, and you can try to drag any node into the design panel in the middle area.",
      text3: "The「input」is used to select the table to be solved, the「output」is used to store the completed data, and the processing node is used to merge and filter the data.",
      text4: "Drag the「input」node, data processing node, and「output」node from the node bar on the left to the design panel, add connection lines, and click the node to set it.",
      text5: "After configuring the nodes, you can rename each node, and remember to modify the data stream name in the upper left corner, and finally remember to click the「Save」button.",
      text6: "The established data flow can be used as a data source in the dashboard, and then bring about data visualization and analysis.",
      home_page_text: "Try building your own data flow!",
      home_page_close: "Experience Now",
     }
  },
  Doptions: {
    formulaType: {
      title_ltext: "String Function",
      title_num: "Numerical Function",
      title_date: "Date/Time Function",
      title_other: "Other Function",
      title_logic: "Logical Function",
      logic_IF:
        'IF(A,B,C,"type") 如果满足条件A，则返回B，否则返回C，type为返回数据的数据类型，可设置为CHAR/STRING/DATETIME/DATE/INT/NUMBER/DECIMAL,例如IF(地区="山东",100,0,"DECIMAL")',
      logic_AND:
        "a表达式1 AND 表达式2 多个用AND连接的表达式,当所有表达式均为true时，表达式返回true，否则返回false",
      logic_or: "a表达式1 OR 表达式2	多个用OR连接的表达式，只要有一个表达式为true，表达式返回true",
      logic_IFS:
        "a IFS( logical_1, value_if_true_1, logical_2, value_if_true_2, … ,logical_n, value_if_true_n)	检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值。 IFS 可以取代多个嵌套 IF 语句，并且有多个条件时更方便阅读",
      ltext_LEN: "LEN(text) Return the number of characters in the text string text",
      ltext_LOWER: "LOWER(text)	Convert all uppercase letters in the text string text to lowercase",
      ltext_UPPER: "UPPER(text)	Convert all lowercase letters in the text string text to uppercase",
      ltext_TRIM: "TRIM(text)	Remove the leading and trailing spaces in the text string text",
      ltext_CONCATENATE:
        "CONCATENATE(text1,[text2], …)	Combine multiple available variables (string, timestamp, number) into one text string.<br/>Example: concatenate (a, B, c), that is, the return value is ABC, and the fields or functions are separated by commas. If it is a string, it needs to be enclosed in quotation marks"
    },
    dateSelectList: {
      Equal: "Equal To",
      NotEqual: "Not equal To"
    },
    dateMapList: {
      Custom: "Custom",
      Today: "Today",
      Yesterday: "Yesterday",
      Tomorrow: "Tomorrow",
      ThisWeek: "ThisWeek",
      LastWeek: "LastWeek",
      NextWeek: "NextWeek",
      ThisMonth: "ThisMonth",
      LastMonth: "LastMonth",
      NextMonth: "NextMonth",
      ThisQuarter: "ThisQuarter",
      LastQuarter: "LastQuarter",
      NextQuarter: "NextQuarter",
      ThisYear: "ThisYear",
      LastYear: "LastYear",
      NextYear: "NextYear"
    },
    NodeErrorMessage: {
      RELATIONTARGETEDGES: "Please connect 2 nodes to this node",
      BEFOREGROUPS: "Please configure the ahead node",
      CURRENTSETTING: "Please configure the current node",
      RELATIONREPEATEDMODEL: "Data from the same source cannot be correlated",
      MERGETARGETEDGES: "Only support 2-10 nodes",
      OUTPUTEMPTY: "Please connect 1 node to this node",
      ISOLATEDNODE: "There are currently orphaned nodes"
    },
    dateMap: {
      current: "Current",
      last: "Last",
      next: "Next",
      day: "Day",
      week: "Week",
      month: "Month",
      quarter: "Quarter",
      year: "Year"
    }
  },
  Analysis: {
    view: {
      title: "Statistical Analysis",
      close: "Close",
      addChart: "New Chart",
      tab_preson: "Personal",
      tab_public: "Public",
      tab_ai: "AI Analysis",
      emptyTip_person: "You can create a personal chart",
      emptyTip_pubArrow: "You can create a public chart that belongs to this data table",
      emptyTip_pubNoArrow:
        "The administrator has not set a public chart. You can set a personal chart",
      emptyExTitle: "Example chart name",
      addChart_person: "New Personal Chart"
    },
    chartPanel: {
      editData: "Edit Time: ",
      editPreson: "Editor: "
    },
    toolbar: {
      span: {
        refresh: "Refresh",
        sort: "Sort",
        full: "Full Screen",
        edit: "Edit",
        delete: "Delete",
        drag: "Drag",
        compare: "Compare",
        exitFull: "Exit",
        filter: "Filter",
      },
      sort: {
        Oplabal_default: "Default",
        Oplabal_asc: "Asc",
        Oplabal_desc: "Desc"
      },
      delete: {
        modalContent: "Are you sure you want to delete this chart?"
      }
    },
    design: {
      default_name: "Unnamed chart",
      select_pla: "Select",
      button_save: "Save",
      name: "Default Name",
      input: "Input",
      add: "Add ",
      check_dateComplete: "Date Complete",
      tip_dateComplete: "Make up the missing date data in the data table",
      input_number: "Input",
      fieldName: {
        dimension: "Dimension",
        metric: "Metric",
        metricL: "Metric(L)",
        metricR: "Metric(R)",
        rowDim: "Row Dimension",
        colDim: "Column Dimension",
        ctip_cd: "Column dimension is the basis for classification of cross tabular data",
        ctip_rd: "Row dimension is the basis for classifying the row data of the crosstab",
        tip_tableC: "Column dimension is the basis for classification of PivotTable column data"
      },
      fieldDropDown: {
        select_pla: "Select",
        search_pla: "Please input",
        tip_searchf: "Filtered for you ",
        tip_searchb: " unsupported fields",
        tip_noData: "No Data"
      },
      metricSetModal: {
        tip: "Format",
        title: "Metric-Setting",
        title_comma: "Thousands",
        title_percent: "Percentile",
        title_fraction: "Decimal Place",
        title_compute: "Compute",
        title_target: "Target Value",
        warn_fractNum: "Decimal places (maximum setting: 6 digits)",
        comType_null: "No",
        comType_precent: "Proportion",
        comType_ratio: "Ratio Analyze"
      }
    },
    mudules: {
      switchType: "Chart Types",
      optionsTitle: {
        compareDate: "Contrast Value",
        styleOption: "Style",
        axisXOption: "X-axis",
        axisYOption: "Y-axis",
        moreOrder: "Serial number Setting",
        mapDigitalDisplaySet: "Value Label Display Settings",
        crossSummary: "Totals Settings"
      },
      theme: "Color",
      axisx: {
        title_axis: "Axis",
        title_position: "Text Direction"
      },
      Legend: {
        title: "Legend"
      },
      Limit: {
        title: "Number Limit",
        inputPla: "Please input"
      },
      DataLabel: {
        //数值标签
        title: "Data Label"
      },
      DataLabelPileSum: {
        //数值标签
        title: "Pile Up"
      },
      metricRange: {
        //最大值，最小值
        maxTitle: "Maximum",
        minTitle: "Minimum",
        input: "Please input"
      },
      orderNumber: {
        //显示序号
        title_show: "Serial Number",
        title_dim: "Dimension",
        input_pla: "Select Dimension"
      },
      summary: {
        tab_rowSum: "Row",
        tab_columnSum: "Column",
        TdisRadio: "Overall",
        TposRadio: "Location",
        Tmodal: "Category",
        check: "+ Add",
        m_title: "Totals",
        m_nameTitle: "Name",
        m_dimTitle: "Dimension",
        m_sumTypeTitle: "Totals",
        m_plaN: "Please enter a totals name",
        m_plaD: "Please select demension",
        rPosBottom: "Bottom",
        rPosTop: "Top",
        cPosRight: "Right",
        cPosLeft: "Left",
        m_sumN: "Totals"
      },
      freezeHead: {
        columnTitle: "Column Dimension",
        rowTitle: "Row Dimension",
        DLabel_freeze: "Freezen",
        Dlabal_nofreeze: "No Freezen"
      },
      sort: {
        //排序
        title: "Sort",
        wrap_open: "Open",
        wrap_close: "Fold"
      },
      MetricLabel: {
        //显示指标值/名
        title_label: "Metric Name",
        title_value: "Metric Value"
      },
      Invert: {
        title: "Conversion Rate",
        showtitle: "Calculation",
        comList_next: "Percentage of the upper layer.",
        comList_all: "Percentage of the first floor."
      },
      progressLabel: {
        //进度图
        valueTitle: "Value",
        percentTitle: "Proportion",
        targetTitle: "Target Number"
      },
      MapDigitalSet: {
        dimensionTitle: "Dimension Value",
        metricTitle: "Metric Value"
      },
      GaugeMode: {
        //仪表图类型
        title: "Gauge Mode",
        modeIn: "In",
        modeOut: "Out"
      },
      MapDrill: {
        //地图钻取
        title: "Map Drill Down",
        driLabal_province: "Drill Down to Province",
        driLabal_city: "Drill Down to City",
        driLabal_disabled: "Disabled"
      },
      MapArea: {
        areaTitle: "Display Range",
        prinTitle: "Province",
        cityTitle: "City",
        options_all: "State",
        options_province: "Province",
        options_city: "City",
        auto: "Auto"
      },
      MapMode: {
        title: "Map Type",
        type_area: "Area",
        type_bubble: "Bubble"
      },
      MapTheme: {
        title: "Color"
      },
      dataLabel: {
        title_SplitLine: "SplitLine",
        title_AxisYSet: "Axis"
      },
      MultipleDataLabel: {
        dimLabelTitle: "Dimension",
        metricLabelTitle: "Value",
        perLabelTitle: "Proportion"
      },
      compare: {
        title_value1: "Value1",
        title_value2: "Value2"
      },
      merticType: {
        icontitleR: "Right-axis",
        icontitleL: "Left-axis"
      },
      orderNum: {
        title: "Serial Number"
      }
    },
    config: {
      NumberTagOptions: {
        //显示隐藏
        labal_display: "Display",
        labal_hide: "Hide"
      },
      directOption: {
        DType_hide: "Hide",
        DType_Crosswise: "Horizontal",
        DType_Endwise: "Vertical",
        DType_LeftBank: "Left tilt",
        DType_RightBank: "Right tilt"
      },
      LegendOption: {
        posType_hide: "Hide",
        posType_Bottom: "Bottom",
        posType_Top: "Top",
        posType_Left: "Left",
        posType_Right: "Right"
      }
    }
  }
};

export default en;
