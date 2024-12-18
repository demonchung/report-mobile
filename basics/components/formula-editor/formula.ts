import CodeMirror from 'codemirror';
import { options } from './options';

/**
 * 处理字符串
 * @param stream
 * @param marks
 */
function handleString(stream: CodeMirror.StringStream, marks: string) {
  let result = false;
  let tmpStr: string = stream.next();
  while (tmpStr != null) {
    if (tmpStr === marks && !result) {
      return true;
    }
    result = tmpStr === "\\";
    tmpStr = stream.next();
  }
  return false;
}
/**
 * 处理字符串
 * @param stream 字符串流
 * @param state  // 初始状态
 */
function token(stream: CodeMirror.StringStream, state: { [key: string]: any}) {
  // 判断是否空格
  if(stream.eatSpace()) {
    return 'spaces'
  }
  const str: string = stream.next();
  if (str === '"' || str === "'") {
    return handleString(stream, str) ? 'string' : 'negative'
  }
  if (/\d/.test(str)) {
    stream.eatWhile(/[\d\.]/);
    return 'number';
  }
  if (/[\[\],\(\)]/.test(str)) {
    return "bracket"
  }
  if (/[+\-*\/=<>!&|]/.test(str)) {
    return "special"
  }
  stream.eatWhile(/[\w]/);
  const current = stream.current();
  if (['true', 'false'].includes(current)) {
    return "atom"
  }
  if (options.keywords && options.formulas && options.keywords.concat(options.formulas).includes(current)) {
    return 'keyword'
  }
  return "negative"
  
}


CodeMirror.defineMode("formula", function () {
  return {
    startState: function () {
      return {tokens: []}
    }, 
    token: token, 
    fold: "brace"
  }
});
CodeMirror.defineMIME("text/fx-formula", "formula");
