
const numberArr:any = [];
for(let i=1;i<100;i++){
  const nowNumber = i.toString();
  numberArr.push({
    label: nowNumber,
    value: nowNumber
  })
}
const dateMap = [
  [
    {
      label:"$r_language.Doptions.dateMap.current$",
      value:"",
    },{
      label:"$r_language.Doptions.dateMap.last$",
      value:"-"
    },
    {
      label:"$r_language.Doptions.dateMap.next$",
      value:"+"
    },
  ],
  numberArr,
  [
    {
      label:"$r_language.Doptions.dateMap.day$",
      value:"d",
    },
    {
      label:"$r_language.Doptions.dateMap.week$",
      value:"w",
    },
    {
      label:"$r_language.Doptions.dateMap.month$",
      value:"m",
    },
    {
      label:"$r_language.Doptions.dateMap.quarter$",
      value:"q",
    },
    {
      label:"$r_language.Doptions.dateMap.year$",
      value:"y",
    },
  ]
]
const  DateFilterType = {
  Custom : "Custom", // 自定义
  Today :"Today", // 今天
  Yesterday : "Yesterday", // 昨天
  Tomorrow : "Tomorrow", // 明天
  ThisWeek : "ThisWeek", // 这周
  LastWeek :"LastWeek", // 上周
  NextWeek : "NextWeek", // 下周
  ThisMonth : "ThisMonth", // 这个月
  LastMonth : "LastMonth", // 上个月
  NextMonth : "NextMonth", // 下个月
  ThisQuarter : "ThisQuarter", // 本季度
  LastQuarter : "LastQuarter", // 上季度
  NextQuarter : "NextQuarter", // 下季度
  ThisYear : "ThisYear", // 今年
  LastYear : "LastYear", // 去年
  NextYear : "NextYear" // 明年
}
export const dateSelectList = [
  { label: "$r_language.Doptions.dateMapList.Custom$", value:"Custom", codeLabel:DateFilterType.Custom},
  { label: "$r_language.Doptions.dateMapList.Today$", value:'["1d","1d"]', codeLabel:DateFilterType.Today},
  { label: "$r_language.Doptions.dateMapList.Yesterday$", value: '["-1d","-1d"]', codeLabel:DateFilterType.Yesterday},
  { label: "$r_language.Doptions.dateMapList.Tomorrow$", value: '["+1d","+1d"]', codeLabel: DateFilterType.Tomorrow},
  { label: "$r_language.Doptions.dateMapList.ThisWeek$", value: '["1w","1w"]' , codeLabel:DateFilterType.ThisWeek},
  { label: "$r_language.Doptions.dateMapList.LastWeek$", value:'["-1w","-1w"]', codeLabel:DateFilterType.LastWeek},
  { label: "$r_language.Doptions.dateMapList.NextWeek$", value: '["+1w","+1w"]' , codeLabel:DateFilterType.NextWeek},
  { label: "$r_language.Doptions.dateMapList.ThisMonth$", value: '["1m","1m"]', codeLabel:DateFilterType.ThisMonth},
  { label: "$r_language.Doptions.dateMapList.LastMonth$", value: '["-1m","-1m"]' , codeLabel:DateFilterType.LastMonth},
  { label: "$r_language.Doptions.dateMapList.NextMonth$", value: '["+1m","+1m"]' , codeLabel:DateFilterType.NextMonth},
  { label: "$r_language.Doptions.dateMapList.ThisQuarter$", value: '["1q","1q"]', codeLabel:DateFilterType.ThisQuarter },
  { label: "$r_language.Doptions.dateMapList.LastQuarter$", value: '["-1q","-1q"]' , codeLabel:DateFilterType.LastQuarter},
  { label: "$r_language.Doptions.dateMapList.NextQuarter$", value: '["+1q","+1q"]', codeLabel:DateFilterType.NextQuarter },
  { label: "$r_language.Doptions.dateMapList.ThisYear$", value: '["1y","1y"]' , codeLabel:DateFilterType.ThisYear},
  { label: "$r_language.Doptions.dateMapList.LastYear$", value: '["-1y","-1y"]' , codeLabel:DateFilterType.LastYear},
  { label: "$r_language.Doptions.dateMapList.NextYear$", value: '["+1y","+1y"]' , codeLabel:DateFilterType.NextYear}
]
export default dateMap;