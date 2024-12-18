// 用于级联筛选器下拉数据
const firstArr = [
  {
    label:"当前",
    value:"",
  },{
    label:"过去",
    value:"-",
  },
  {
    label:"未来",
    value:"+",
  },
]
const thridArr:any =[
  {
    label:"天",
    value:"d",
  },
  {
    label:"周",
    value:"w",
  },
  {
    label:"月",
    value:"m",
  },
  {
    label:"季",
    value:"q",
  },
  {
    label:"年",
    value:"y",
  },
]
/**
 * isNow: 是否是 label:当前
*/
const getDateList = (isNow) => {
  const secondArr:any = [];
  const number = isNow ? 2 : 100;
  
  for(let i=1;i< number;i++){
    const nowNumber = i.toString();
    secondArr.push({
      label: nowNumber,
      value: nowNumber
    })
  }
  return [firstArr,secondArr,thridArr]
}



export default getDateList;