/**
 * 字符串
 */
export enum StringType {
  COUNT = 'COUNT',
  COUNTDISTINCT = 'COUNTDISTINCT',
}

/**
 * 数值
 */
export enum NumberType {
  SUM = 'SUM',
  AVG = 'AVG',
  MAX = 'MAX',
  MIN = 'MIN',
  COUNT = 'COUNT',
  COUNTDISTINCT = 'COUNTDISTINCT',
}
/**
 * 地址
 */
export enum AddressType {
  PROVINCE = "province",
  CITY = "city",
  DISTRICT= "district",
  All = 'all',
}

/**
 * 日期
 */
export enum DateType {
  Y = 'Y',
  YQ = 'YQ',
  YM = 'YM',
  YW = 'YW',
  YMD = 'YMD',
  M = 'M',
  MD = 'MD',
  D = 'D',
}
export enum StringTypeToCN {
  COUNT = '计数',
  COUNTDISTINCT = '计数(去重)',
}
/**
 * 数值
 */
export enum NumberTypeToCN {
  SUM = '总和值',
  AVG = '平均值',
  MAX = '最大值',
  MIN = '最小值',
  COUNT = '计数',
  COUNTDISTINCT = '计数(去重)',
}
/**
 * 地址
 */
export enum AddressTypeToCN {
  province = "省",
  city = "省市",
  district= "省市区",
  all = '省市区详细地址',
}
/**
 * 日期
 */
export enum DateTypeToCN {
  Y = '年',
  YQ = '年-季度',
  YM = '年-月',
  YW = '年-周',
  YMD = '年-月-日',
  M = '月',
  MD = '月-日',
  D = '日',
}
/**
 * 聚合类型
 */
export enum FilterRel {
  AND = 'AND',
  OR = 'OR'
}
/**
 * 聚合类型
 */
export enum AggregateResultType {
  DEFAULT = 'DEFAULT',
  PERCENT = 'PERCENT',
  NUMBERPERCENT = 'NUMBERPERCENT',
}

export default {
  string: [
    { label: "计数", value: StringType.COUNT },
    { label: "计数(去重)", value: StringType.COUNTDISTINCT },
  ],
  number: [
    { label: "总和值", value: NumberType.SUM },
    { label: "平均值", value: NumberType.AVG },
    { label: "最大值", value: NumberType.MAX },
    { label: "最小值", value: NumberType.MIN },
    { label: "计数", value: NumberType.COUNT },
    { label: "计数(去重)", value: NumberType.COUNTDISTINCT },
  ],
  date: [
    { label: '年', value: DateType.Y },
    { label: '年-季度', value: DateType.YQ },
    { label: '年-月', value: DateType.YM },
    { label: '年-周', value: DateType.YW },
    { label: '年-月-日', value: DateType.YMD },
    { label: '月', value: DateType.M },
    { label: '月-日', value: DateType.MD },
    { label: '日', value: DateType.D }
  ],
  address: [
    { label: '省', value: AddressType.PROVINCE },
    { label: '省市', value: AddressType.CITY },
    { label: '省市区', value: AddressType.DISTRICT },
  ],
  listAddress: [
    { label: '省', value: AddressType.PROVINCE },
    { label: '省市', value: AddressType.CITY },
    { label: '省市区', value: AddressType.DISTRICT },
    { label: '省市区详细地址', value: AddressType.All},
  ],
  addressToNumber: [
    { label: '总和值', value: NumberType.SUM },
    { label: '平均值', value: NumberType.AVG },
    { label: '最大值', value: NumberType.MAX },
    { label: '最小值', value: NumberType.MIN },
    { label: '计数', value: NumberType.COUNT },
    { label: '计数(去重)', value: NumberType.COUNTDISTINCT },
  ],
  aggregateResult: [
    { label: '显示为实际值', value: AggregateResultType.DEFAULT },
    { label: '显示为占比', value: AggregateResultType.PERCENT },
    //{ label: '同时显示', value: AggregateResultType.NUMBERPERCENT },
  ],
 filterRel: [
    { label: '所有', value: FilterRel.AND },
    { label: '任一', value: FilterRel.OR},
  ]
}
