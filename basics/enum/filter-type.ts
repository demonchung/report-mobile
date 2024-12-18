import options from "@h3/report-mobile/dist/options";
export enum StringType {
  Equal = "Equal", // 等于
  NotEqual = "NotEqual", // 不等于
  StartWith = "StartWith", // 开头为
  In = "In", // 包含
  NotIn = "NotIn", // 不包含
  None = "None", // 为空
  NotNone = "NotNone", // 不为空
  Match = "Match", // 模糊匹配 包含
  NotMatch = "NotMatch" // 模糊匹配 不包含
}
export enum DateType {
  Equal = "Equal", // 等于
  NotEqual = "NotEqual", // 不等于
  Range = "Range", // 范围
  Above = "Above", // 大于
  NotBelow = "NotBelow", // 大于等于
  Below = "Below", // 小于
  NotAbove = "NotAbove", // 小于等于
  None = "None", // 为空
  NotNone = "NotNone", // 不为空，
  Dynamic= "Dynamic",//动态筛选
}
export enum NumberType {
  Equal = "Equal", // 等于
  NotEqual = "NotEqual", // 不等于
  Range = "Range", // 范围
  Above = "Above", // 大于
  NotBelow = "NotBelow", // 大于等于
  Below = "Below", // 小于
  NotAbove = "NotAbove", // 小于等于
  None = "None", // 为空
  NotNone = "NotNone" // 不为空  Custom = "Custom", // 自定义
}
export enum DateFilterType {
  Custom = "Custom", // 自定义
  Today = "Today", // 今天
  Yesterday = "Yesterday", // 昨天
  Tomorrow = "Tomorrow", // 明天
  ThisWeek = "ThisWeek", // 这周
  LastWeek = "LastWeek", // 上周
  NextWeek = "NextWeek", // 下周
  ThisMonth = "ThisMonth", // 这个月
  LastMonth = "LastMonth", // 上个月
  NextMonth = "NextMonth", // 下个月
  ThisQuarter = "ThisQuarter", // 本季度
  LastQuarter = "LastQuarter", // 上季度
  NextQuarter = "NextQuarter", // 下季度
  ThisYear = "ThisYear", // 今年
  LastYear = "LastYear", // 去年
  NextYear = "NextYear" // 明年
}

export enum AddressType {
  Belong = "StartWith", // 属于
  NotBelong = "NotStartWith", // 不属于
  None = "None", // 为空
  NotNone = "NotNone" // 不为空
}

export enum FormatDateType {
  Date = "Date",
  Time = "Time",
  Month = "Month"
}
export enum DateFormatType {
  Y = "Y", // 年
  YM = "YM", // 年月
  YMD = "YMD", //年月日
  YMDHM = "YMDHM", //年月日时分
  YMDHMS = "YMDHMS", //年月日时分秒
  HM = "HM", //时分
  HMS = "HMS" //时分秒
}
export const dateFilterType = [
  { label: "自定义", value: DateFilterType.Custom },
  // { label: "今天", value: DateFilterType.Today },
  // { label: "昨天", value: DateFilterType.Yesterday },
  // { label: "明天", value: DateFilterType.Tomorrow },
  // { label: "本周", value: DateFilterType.ThisWeek },
  // { label: "上周", value: DateFilterType.LastWeek },
  // { label: "下周", value: DateFilterType.NextWeek },
  // { label: "本月", value: DateFilterType.ThisMonth },
  // { label: "上月", value: DateFilterType.LastMonth },
  // { label: "下月", value: DateFilterType.NextMonth },
  // { label: "本季度", value: DateFilterType.ThisQuarter },
  // { label: "上季度", value: DateFilterType.LastQuarter },
  // { label: "下季度", value: DateFilterType.NextQuarter },
  // { label: "今年", value: DateFilterType.ThisYear },
  // { label: "去年", value: DateFilterType.LastYear },
  // { label: "明年", value: DateFilterType.NextYear }
];
export const dateFilterTypeList = {
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
  NextYear: "明年",
  Custom: "自定义"
};
export const dateFormatList = [
  { label: "$r_language.saticOP.dateFormatList.Y$", value: DateFormatType.Y },
  { label: "$r_language.saticOP.dateFormatList.YM$", value: DateFormatType.YM },
  { label: "$r_language.saticOP.dateFormatList.YMD$", value: DateFormatType.YMD },
  { label: "$r_language.saticOP.dateFormatList.YMDHM$", value: DateFormatType.YMDHM },
  { label: "$r_language.saticOP.dateFormatList.YMDHMS$", value: DateFormatType.YMDHMS },
  { label: "$r_language.saticOP.dateFormatList.HM$", value: DateFormatType.HM },
  { label: "$r_language.saticOP.dateFormatList.HMS$", value: DateFormatType.HMS },
];
export const formatDataList = [
  { label: "日期", value: FormatDateType.Date },
  { label: "日期和时间", value: FormatDateType.Time },
  { label: "年月", value: FormatDateType.Month }
];
export const formatDataListCopy = [
  { label: "$r_language.saticOP.formatDataList.Date$", value: FormatDateType.Date },
  { label: "$r_language.saticOP.formatDataList.Time$", value: FormatDateType.Time },
  { label: "$r_language.saticOP.formatDataList.Month$", value: FormatDateType.Month }
];

export enum AllTypeToCN {
  EQUAL = "等于", // 等于
  NOTEQUAL = "不等于", // 不等于
  STARTWITH = "开头为", // 开头为
  IN = "包含", // 包含
  NOTIN = "不包含", // 不包含
  NONE = "为空", // 为空
  NOTNONE = "不为空", // 不为空
  MATCH = "模糊匹配", // 模糊匹配 包含
  NOTMATCH = "模糊匹配", // 模糊匹配 不包含
  ABOVE = "大于", // 大于
  NOTBELOW = "大于等于", // 大于等于
  BELOW = "小于", // 小于
  NOTABOVE = "小于等于", // 小于等于
  RANGE = "范围", // 范围
}
// 根据字段业务类型获取过滤类型
function getFilterTypes(field?: any) {
  let filterTypes = {
    string: [
      { label: "$r_language.saticOP.FilterType.string.Equal$", value: StringType.Equal },
      { label: "$r_language.saticOP.FilterType.string.NotEqual$", value: StringType.NotEqual },
      // { label: '开头为', value: StringType.StartWith },
      { label: "$r_language.saticOP.FilterType.string.Match$", value: StringType.Match },
      { label: "$r_language.saticOP.FilterType.string.NotMatch$", value: StringType.NotMatch },
      { label: "$r_language.saticOP.FilterType.string.In$", value: StringType.In },
      { label: "$r_language.saticOP.FilterType.string.NotIn$", value: StringType.NotIn },
      { label: "$r_language.saticOP.FilterType.string.None$", value: StringType.None },
      { label: "$r_language.saticOP.FilterType.string.NotNone$", value: StringType.NotNone },
      
    ],
    date: [
      { label: "$r_language.saticOP.FilterType.date.Equal$", value: DateType.Equal },
      { label: "$r_language.saticOP.FilterType.date.NotEqual$", value: DateType.NotEqual },
      { label: "$r_language.saticOP.FilterType.date.Above$", value: DateType.Above },
      { label: "$r_language.saticOP.FilterType.date.NotBelow$", value: DateType.NotBelow },
      { label: "$r_language.saticOP.FilterType.date.Below$", value: DateType.Below },
      { label: "$r_language.saticOP.FilterType.date.NotAbove$", value: DateType.NotAbove },
      { label: "$r_language.saticOP.FilterType.date.Range$", value: DateType.Range },
      { label: "$r_language.saticOP.FilterType.date.Dynamic$", value: DateType.Dynamic },
      { label: "$r_language.saticOP.FilterType.date.None$", value: DateType.None },
      { label: "$r_language.saticOP.FilterType.date.NotNone$", value: DateType.NotNone }
    ],
    number: [
      { label: "$r_language.saticOP.FilterType.number.Equal$", value: NumberType.Equal },
      { label: "$r_language.saticOP.FilterType.number.NotEqual$", value: NumberType.NotEqual },
      { label: "$r_language.saticOP.FilterType.number.Range$", value: NumberType.Range },
      { label: "$r_language.saticOP.FilterType.number.Above$", value: NumberType.Above },
      { label: "$r_language.saticOP.FilterType.number.NotBelow$", value: NumberType.NotBelow },
      { label: "$r_language.saticOP.FilterType.number.Below$", value: NumberType.Below },
      { label: "$r_language.saticOP.FilterType.number.NotAbove$", value: NumberType.NotAbove },
      { label: "$r_language.saticOP.FilterType.number.None$", value: NumberType.None },
      { label: "$r_language.saticOP.FilterType.number.NotNone$", value: NumberType.NotNone }
    ],
    address: [
      { label: "$r_language.saticOP.FilterType.address.Belong$", value: AddressType.Belong },
      { label: "$r_language.saticOP.FilterType.address.NotBelong$", value: AddressType.NotBelong },
      { label: "$r_language.saticOP.FilterType.address.None$", value: AddressType.None },
      { label: "$r_language.saticOP.FilterType.address.NotNone$", value: AddressType.NotNone }
    ]
  };
  if(!field) {
    return filterTypes;
  }
  // TODO  在获取数据源的时候,字段冗余一个通用的bizDataType字段。
  if(field && options.filterFormulaExtendinfo && options.filterFormulaExtendinfo[field.dataType]) {
   let info = options.filterFormulaExtendinfo[field.dataType];
   filterTypes[info.type] = filterTypes[info.type].concat(info.extend);
  }
  return filterTypes;
}
export default getFilterTypes;


export const transDyncMic = {
  [DateType.Equal]:{ //等于
    [DateFilterType.Today]:['1d','1d'],
    [DateFilterType.Yesterday]:['-1d','-1d'],
    [DateFilterType.Tomorrow]:['+1d','+1d'],
    [DateFilterType.ThisWeek]:['1w','1w'],
    [DateFilterType.LastWeek]:['-1w','-1w'],
    [DateFilterType.NextWeek]:['+1w','+1w'],
    [DateFilterType.ThisMonth]:['1m','1m'],
    [DateFilterType.LastMonth]:['-1m','-1m'],
    [DateFilterType.NextMonth]:['+1m','+1m'],
    [DateFilterType.ThisQuarter]:['1q','1q'],
    [DateFilterType.LastQuarter]:['-1q','-1q'],
    [DateFilterType.NextQuarter]:['+1q','+1q'],
    [DateFilterType.ThisYear]:['1y','1y'],
    [DateFilterType.LastYear]:['-1y','-1y'],
    [DateFilterType.NextYear]:['+1y','+1y'],
  },
  [DateType.NotEqual]:{ //不等于
    [DateFilterType.Today]:['1d','1d'],
    [DateFilterType.Yesterday]:['-1d','-1d'],
    [DateFilterType.Tomorrow]:['+1d','+1d'],
    [DateFilterType.ThisWeek]:['1w','1w'],
    [DateFilterType.LastWeek]:['-1w','-1w'],
    [DateFilterType.NextWeek]:['+1w','+1w'],
    [DateFilterType.ThisMonth]:['1m','1m'],
    [DateFilterType.LastMonth]:['-1m','-1m'],
    [DateFilterType.NextMonth]:['+1m','+1m'],
    [DateFilterType.ThisQuarter]:['1q','1q'],
    [DateFilterType.LastQuarter]:['-1q','-1q'],
    [DateFilterType.NextQuarter]:['+1q','+1q'],
    [DateFilterType.ThisYear]:['1y','1y'],
    [DateFilterType.LastYear]:['-1y','-1y'],
    [DateFilterType.NextYear]:['+1y','+1y'],
  },
  [DateType.Above]:{ //大于
    [DateFilterType.Today]:['+1d',null],
    [DateFilterType.Yesterday]:['1d',null],
    [DateFilterType.Tomorrow]:['+2d',null],
    [DateFilterType.ThisWeek]:['+1w',null],
    [DateFilterType.LastWeek]:['1w',null],
    [DateFilterType.NextWeek]:['+2w',null],
    [DateFilterType.ThisMonth]:['+1m',null],
    [DateFilterType.LastMonth]:['1m',null],
    [DateFilterType.NextMonth]:['+2m',null],
    [DateFilterType.ThisQuarter]:['+1q',null],
    [DateFilterType.LastQuarter]:['1q',null],
    [DateFilterType.NextQuarter]:['+2q',null],
    [DateFilterType.ThisYear]:['+1y',null],
    [DateFilterType.LastYear]:['1y',null],
    [DateFilterType.NextYear]:['+2y',null],
  },
  [DateType.Below]:{ //小于
    [DateFilterType.Today]:[null,'-1d'],
    [DateFilterType.Yesterday]:[null,'-2d'],
    [DateFilterType.Tomorrow]:[null,'1d'],
    [DateFilterType.ThisWeek]:[null,'-1w'],
    [DateFilterType.LastWeek]:[null,'-2w'],
    [DateFilterType.NextWeek]:[null,'1w'],
    [DateFilterType.ThisMonth]:[null,'-1m'],
    [DateFilterType.LastMonth]:[null,'-2m'],
    [DateFilterType.NextMonth]:[null,'1m'],
    [DateFilterType.ThisQuarter]:[null,'-1q'],
    [DateFilterType.LastQuarter]:[null,'-2q'],
    [DateFilterType.NextQuarter]:[null,'1q'],
    [DateFilterType.ThisYear]:[null,'-1y'],
    [DateFilterType.LastYear]:[null,'-2y'],
    [DateFilterType.NextYear]:[null,'1y'],
  },
  [DateType.NotBelow]:{ //大于等于
    [DateFilterType.Today]:['1d',null],
    [DateFilterType.Yesterday]:['-1d',null],
    [DateFilterType.Tomorrow]:['+1d',null],
    [DateFilterType.ThisWeek]:['1w',null],
    [DateFilterType.LastWeek]:['-1w',null],
    [DateFilterType.NextWeek]:['+1w',null],
    [DateFilterType.ThisMonth]:['1m',null],
    [DateFilterType.LastMonth]:['-1m',null],
    [DateFilterType.NextMonth]:['+1m',null],
    [DateFilterType.ThisQuarter]:['1q',null],
    [DateFilterType.LastQuarter]:['-1q',null],
    [DateFilterType.NextQuarter]:['+1q',null],
    [DateFilterType.ThisYear]:['1y',null],
    [DateFilterType.LastYear]:['-1y',null],
    [DateFilterType.NextYear]:['+1y',null],
  },
  [DateType.NotAbove]:{//小于等于
    [DateFilterType.Today]:[null,'1d'],
    [DateFilterType.Yesterday]:[null,'-1d'],
    [DateFilterType.Tomorrow]:[null,'+1d'],
    [DateFilterType.ThisWeek]:[null,'1w'],
    [DateFilterType.LastWeek]:[null,'-1w'],
    [DateFilterType.NextWeek]:[null,'+1w'],
    [DateFilterType.ThisMonth]:[null,'1m'],
    [DateFilterType.LastMonth]:[null,'-1m'],
    [DateFilterType.NextMonth]:[null,'+1m'],
    [DateFilterType.ThisQuarter]:[null,'1q'],
    [DateFilterType.LastQuarter]:[null,'-1q'],
    [DateFilterType.NextQuarter]:[null,'+1q'],
    [DateFilterType.ThisYear]:[null,'1y'],
    [DateFilterType.LastYear]:[null,'-1y'],
    [DateFilterType.NextYear]:[null,'+1y'],
  },
}