/**
 * 返回值匹配别名，兼容别名key_value及直接使用value两种方式
 * @param key
 * @param value
 * @param alias
 */
const getAliaValue = (key: string, value: string, alias: any) => {
  const keyLowerCase = key.toLowerCase();
  const k = `${keyLowerCase}_${value}`;
  return alias ? (alias[k] !== undefined ? alias[k] : value) : value;
};

export default getAliaValue;
