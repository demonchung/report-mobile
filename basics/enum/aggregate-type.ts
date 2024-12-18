/**
 * 字符串
 */
export enum StringType {
  COUNT = 'COUNT',
  COUNTDISTINCT = 'COUNTDISTINCT',
}

export enum StringTypeToLabel {
  COUNT = '$r_language.saticOP.enumType.string.count$',
  COUNTDISTINCT = '$r_language.saticOP.enumType.string.countDistinct$',
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
export enum NumberTypeToLabel {
  SUM = '$r_language.saticOP.enumType.number.sum$',
  AVG = '$r_language.saticOP.enumType.number.avg$',
  MAX = '$r_language.saticOP.enumType.number.max$',
  MIN = '$r_language.saticOP.enumType.number.min$',
  COUNT = '$r_language.saticOP.enumType.number.count$',
  COUNTDISTINCT = '$r_language.saticOP.enumType.number.countDistinct$',
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
 * 地址
 */
export enum AddressTypeToLabel {
  PROVINCE = "$r_language.saticOP.enumType.address.province$",
  CITY = "$r_language.saticOP.enumType.address.city$",
  DISTRICT= "$r_language.saticOP.enumType.address.district$",
  All= "$r_language.saticOP.enumType.address.detailed$"
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
 * 日期
 */
export enum DateTypeToLabel {
  Y = '$r_language.saticOP.enumType.date.y$',
  YQ = '$r_language.saticOP.enumType.date.yq$',
  YM = '$r_language.saticOP.enumType.date.ym$',
  YW = '$r_language.saticOP.enumType.date.yw$',
  YMD = '$r_language.saticOP.enumType.date.ymd$',
  M = '$r_language.saticOP.enumType.date.m$',
  MD = '$r_language.saticOP.enumType.date.md$',
  D = '$r_language.saticOP.enumType.date.d$',
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
    { label: '$r_language.saticOP.enumType.address.province$', value: AddressType.PROVINCE },
    { label: '$r_language.saticOP.enumType.address.city$', value: AddressType.CITY },
    { label: '$r_language.saticOP.enumType.address.district$', value: AddressType.DISTRICT },
  ],
  listAddress: [
    { label: '$r_language.saticOP.enumType.address.province$', value: AddressType.PROVINCE },
    { label: '$r_language.saticOP.enumType.address.city$', value: AddressType.CITY },
    { label: '$r_language.saticOP.enumType.address.district$', value: AddressType.DISTRICT },
    { label: '$r_language.saticOP.enumType.address.detailed$', value: AddressType.All},
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
    { label: '$r_language.saticOP.enumType.aggregateResult.default$', value: AggregateResultType.DEFAULT },
    { label: '$r_language.saticOP.enumType.aggregateResult.precent$', value: AggregateResultType.PERCENT },
    //{ label: '同时显示', value: AggregateResultType.NUMBERPERCENT },
  ],
  listNumber: [
    { label: '无', value: '' },
    { label: "$r_language.saticOP.enumType.number.sum$", value: NumberType.SUM },
    { label: "$r_language.saticOP.enumType.number.avg$", value: NumberType.AVG },
    { label: "$r_language.saticOP.enumType.number.max$", value: NumberType.MAX },
    { label: "$r_language.saticOP.enumType.number.min$", value: NumberType.MIN },
    { label: "$r_language.saticOP.enumType.number.count$", value: NumberType.COUNT },
    { label: "$r_language.saticOP.enumType.number.countDistinct$", value: NumberType.COUNTDISTINCT },
  ],
 filterRel: [
    { label: '所有', value: FilterRel.AND },
    { label: '任一', value: FilterRel.OR},
  ]
}
