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
 * 数值
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
  QMD = 'QMD',
  QM = 'QM',
  Q = 'Q',
  YQM = 'YQM',
  YQMD = 'YQMD',
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
    { label: "$r_language.saticOP.enumType.string.count$", value: StringType.COUNT },
    { label: "$r_language.saticOP.enumType.string.countDistinct$", value: StringType.COUNTDISTINCT },
  ],
  number: [
    { label: "$r_language.saticOP.enumType.number.sum$", value: NumberType.SUM },
    { label: "$r_language.saticOP.enumType.number.avg$", value: NumberType.AVG },
    { label: "$r_language.saticOP.enumType.number.max$", value: NumberType.MAX },
    { label: "$r_language.saticOP.enumType.number.min$", value: NumberType.MIN },
    { label: "$r_language.saticOP.enumType.number.count$", value: NumberType.COUNT },
    { label: "$r_language.saticOP.enumType.number.countDistinct$", value: NumberType.COUNTDISTINCT },
  ],
  date: [
    { label: '$r_language.saticOP.enumType.date.y$', value: DateType.Y },
    { label: '$r_language.saticOP.enumType.date.yq$', value: DateType.YQ },
    { label: '$r_language.saticOP.enumType.date.ym$', value: DateType.YM },
    { label: '$r_language.saticOP.enumType.date.yqm$', value: DateType.YQM },
    { label: '$r_language.saticOP.enumType.date.yw$', value: DateType.YW },
    { label: '$r_language.saticOP.enumType.date.ymd$', value: DateType.YMD },
    { label: '$r_language.saticOP.enumType.date.yqmd$', value: DateType.YQMD },
    { label: '$r_language.saticOP.enumType.date.q$', value: DateType.Q },
    { label: '$r_language.saticOP.enumType.date.qm$', value: DateType.QM },
    { label: '$r_language.saticOP.enumType.date.qmd$', value: DateType.QMD },
    { label: '$r_language.saticOP.enumType.date.m$', value: DateType.M },
    { label: '$r_language.saticOP.enumType.date.md$', value: DateType.MD },
    { label: '$r_language.saticOP.enumType.date.d$', value: DateType.D }
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
