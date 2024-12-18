export const options: H3.FormulaEditor.Options = {
  assignRegex: />=|<=|==|!=/,
  puncRegex: /[(){},:+\-*%^\/><=]/,
  fieldRegex:/(\$\$[0-9a-zA-Z]+)/g,
  keywords: [],
  formulas: ["ABS","AVERAGE","CEILING","FLOOR","INT","MAX","MIN","MOD","POWER","ROUND","SQRT","AND","FALSE","IF","IFS","NOT","OR","TRUE","XOR","DATEDELTA","DAY","DAYS","HOUR","ISOWEEKNUM","MINUTE","MONTH","SECOND","YEAR","NULL"]
};
