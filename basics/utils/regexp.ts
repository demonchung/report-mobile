/**
 * 常用的正则公式
 */
const regexps:any = {
  NUMBER: '^-?(\\.|(0|\\d+))?(\\.?\\d{0,6})?$'
};
/**
 * 正则匹配
 * @param type regexps的类型或者正则表达式
 * @param val  匹配值
 * @param empty 是否允许为空字符串
 */
export default function regexp(type:string | RegExp, val: any, empty:boolean = false) {
  return val === '' && empty ? true : new RegExp(typeof type === 'string' ? regexps[type] : type).test(val);
}
