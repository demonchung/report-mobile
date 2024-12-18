import moment from 'moment'
import { DateFormatType } from '../enum/date-type';

const acronymMounth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'];
const lowercaseMounth = ['January', 'February', 'March', 'April', 'May', 'June', 'Aguest', 'Agu', 'September', 'October', 'November', 'December'];
const weekDay=['日','一','二','三','四','五','六'];
// getDateRange('2019-9-17', 3);  // FOR TEST
const getDateRange = (date: any, range: string | number, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  const monentDate: any = moment(date);
  let startDate: string = '';
  let endDate: string = '';
  if (typeof (range) === 'number') {
    switch (range) {
      case 0:
        range = 'year';
        break;
      case 1:
        range = 'quarter';
        break;
      case 2:
        range = 'month';
        break;
      case 3:
        range = 'week';
        break;
      case 4:
        range = 'day';
        break;
      default:
        break;
    }
  }
  switch (range) {
    case 'year':
    case 'quarter':
    case 'month':
    case 'week':
    case 'day':
      startDate = monentDate.startOf(range).format(format);
      endDate = monentDate.endOf(range).format(format);
      break;
    default:
      break;
  }
  return [startDate, endDate];
};

/**
 * 计算格式化后的明细表格式
 * @param date 
 */
export const convertDate = (value: string | Date | Array<string>, options: H3.Report.DateFormat):string | Array<string> => {
  let dateObj = value as Date;
  if (value instanceof Array) {
    // 如果是字符串数组 那么递归返回
    return value.map(d => {
      return d ? convertDate(d, options) as string : '';
    });
  }
  if (typeof value === "string") {
    const dateArray = value.split(" ");
    const date = dateArray.length > 0 ? dateArray[0] : "";
    const time = dateArray.length > 0 ? dateArray[1] : "";
    let year, month, day, hour, minite, second;
    year = date.split('-')[0];
    month = date.split('-')[1];
    day = date.split('-')[2];
    hour = time.split(':')[0];
    minite = time.split(':')[1];
    second = time.split(':')[2];

    dateObj = new Date(year, month - 1, day, hour, minite, second);
  }

  if (options.isCustom) {
    return dateFormat(dateObj, options.customFormat);
  } else {
      if (options.formatType && options.formatType !== '') {
      let style = '';
      switch (options.formatType) {
        case DateFormatType.Type1:
          style = "YYYY年M月D日";
          break;
        case DateFormatType.Type2:
          style = "YYYY年M月";
          break;
        case DateFormatType.Type3:
          style = "M月D日";
          break;
        case DateFormatType.Type4:
          style = "YYYY/M/D";
          break;
        case DateFormatType.Type5:
          style = "YYYY/M/D H:mm";
          break;
        case DateFormatType.Type6:
          style = "YY/M/D";
          break;
        case DateFormatType.Type7:
          style = "M/D";
          break;
        case DateFormatType.Type8:
          style = `D-EEE-YYYY`;
          break;
        case DateFormatType.Type9:
          style = `EEE-YYYY`;
          // style = `${acronymMounth[dateObj.getMonth()]}-YYYY`;
          break;
        case DateFormatType.Type10:
          style = `YYYY年M月D日 星期dddd`;
          break;
          case DateFormatType.Type11:
          style = `星期dddd`;
          break;
        default :
          style = "YYYY-MM-DD";
          break;
      }
      return dateFormat(dateObj, style);
    }
  }
  return value as string;
}

/**
 * 处理 2019年 2019年第3季度 2019年5月 2019年第7周 2019年第123日（年 季度 月 周 日）
 * @param date
 * dateCNFormat('2019年第7周');
 */
export const dateCNFormat = (date: string) => {
  let res: Array<any> = [];
  if (date) {
    const comp: any = date.match(/(\d*)年?[^\d]?(\d*)(月(\d*)(日)|(季|月|周|日|天))?/);
    if (comp && comp.length > 0) {
      const year = comp[1];
      const dateMoment = moment().year(year);
      if (comp[5] || comp[3]) {
        const num = comp[2];
        switch (comp[5] || comp[3]) {
          case '季':
            dateMoment.quarter(num);
            res = getDateRange(dateMoment, 1);
            break;
          case '月':
            dateMoment.month(num - 1);
            res = getDateRange(dateMoment, 2);
            break;
          case '周':
            dateMoment.week(num);
            res = getDateRange(dateMoment, 3);
            break;
          case '日':
          case '天':
            dateMoment.month(comp[2]-1).date(comp[4]);
            res = getDateRange(dateMoment, 4);
            break;
          default:
            break;
        }
      } else {
        res = getDateRange(dateMoment, 0);
      }
    }
  }
  return res;
};
/**
 * 新增(年季度月周日)
 * @param date
 * @param number 新增后面的日期
 * @param type 
 */
const getAddDateRange = (date: any, number, type, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  const momentDate: any = moment(date);
  let fmt:string = '';
  const res:any = [];
  
  if(number) {
    for(let i = 0; i< number; i ++) {
      switch (type) {
        case 'year':
          fmt = "YYYY年";
          momentDate.add(1,'y');
          break;
        case 'quarter':
          fmt = "YYYY年第q季度";
          momentDate.add(1,'Q');
          break;
        case 'month':
          momentDate.add(1,'M');
          fmt = "YYYY年M月";
          break;
        case 'week':
          momentDate.add(1,'w');
          fmt = "YYYY年第W周";
          break;
        case 'day':
          momentDate.add(1,'d');
          fmt = "YYYY年M月D日";
          break;
      }

      const tmpDate = dateFormat(momentDate.toDate(), fmt);
      res.push(tmpDate);
    }
  }
  return res;
};
/**
 * 新增(年季度月周日)
 * @param date
 * @param number
 */
export const addCNFormat = (date: string,number) => {
  let res: Array<any> = [];
  if (date) {
    const comp: any = date.match(/(\d*)年?[^\d]?(\d*)(月(\d*)(日)|(季|月|周|日|天))?/);
    if (comp && comp.length > 0) {
      const year = comp[1];
      const dateMoment = moment().year(year);
      if (comp[5] || comp[3]) {
        const num = comp[2];
        switch (comp[5] || comp[3]) {
          case '季':
            dateMoment.quarter(num);
            res = getAddDateRange(dateMoment, number,'quarter');
            break;
          case '月':
            dateMoment.month(num - 1);
            res = getAddDateRange(dateMoment, number,'month');
            break;
          case '周':
            dateMoment.week(num);
            res = getAddDateRange(dateMoment, number,'week');
            break;
          case '日':
          case '天':
            dateMoment.month(comp[2]-1).date(comp[4]);
            res = getAddDateRange(dateMoment, number,'day');
            break;
          default:
            break;
        }
      } else {
        res = getAddDateRange(dateMoment, number,'year');
      }
    }
  }
  return res;
};

/**
 * 时间转换
 * @param date  时间对象
 * @param fmt  YYYY-MM-DD HH:mm:ss q季度
 */
export const dateFormat = (date: Date, fmt: string) => {
  const o: any = {
    "M+": date.getMonth() + 1, //月份
    "D+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
     "S": date.getMilliseconds(), //毫秒
    "W+": Math.ceil((moment(date).dayOfYear()) / 7), // 周
  };
  if (/(Y+)/.test(fmt)) {fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));}
  for (const k in o)
    {if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }}
  // 过滤英文月份
  if (/(E+)/.test(fmt)) {fmt = fmt.replace(RegExp.$1, acronymMounth[date.getMonth()]);}
  if (/(d+)/.test(fmt)) {fmt = fmt.replace(RegExp.$1, weekDay[date.getDay()]);}
  return fmt;
};

export default {
  dateFormat
}

