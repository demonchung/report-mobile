
const thridArr =  [
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
];
const twoArr:any = [];
for(let i=1;i<100;i++){
  const nowNumber = i.toString();
  twoArr.push({
    label: nowNumber,
    value: nowNumber,
    children:thridArr
  })
}
const mapData = [
  {
    label:'当前',
    value:'',
    children:[
      {
        label:"1",
        value:"1",
        children: thridArr,
      }
    ],
  },
  {
    label:'过去',
    value: '-',
    children:twoArr,
  },
  {
    label:'未来',
    value: '+',
    children:twoArr,
  }
]

export default mapData;