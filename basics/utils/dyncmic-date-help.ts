import dateMap from '@h3/report-mobile/basics/utils/dateMap';
 
 // 按照规则给数据 ['1d']=>['','1','d'] ;['+1d']=>['+',1,'d'];
 export const fomatterValue = (value) => {
  if(value && value.length){
    const defaultV:any = [];
    value.forEach((str,index)=>{
      if(str== null){
        defaultV[index] = [null,null,null]
      }else{
        const reg = /[-|+]/g;
        if(reg.test(str)){
          const arr:any = [],length = str.length;
          arr[0] = str.substring(0,1);
          arr[1] = str.substring(1,length-1)
          arr[2] = str.substring(length-1,length);
          defaultV[index] = arr;
        }else{
          const arr:any = [],length = str.length;
          arr[0] = '';
          arr[1] = str.substring(0,length-1)
          arr[2] = str.substring(length-1,length);
          defaultV[index] = arr;
        }
      }
    })
    return defaultV;
  }else{
    return [[null,null,null],[null,null,null]]
  }
}

/**
 * arr :['+',"1","d"] => 当前1天
*/
export const fomaaterToLabel = (arr) => {
  let str = '';
  arr.forEach((val,index)=>{
    const metch = dateMap[index].find(el=>el.value == val);
    if(metch){
      str += metch.label;
    }
  })
  return str;
}