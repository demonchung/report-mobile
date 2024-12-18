// dataSource  图表计算字段数组
//根据formula获取所用到的字段, 并且从数组匹配相关信息

const getUsedFields = (formula, dataSource) => {
    let fields: Array<H3.DashboardAPI.FormulaFieldModel> = []; //字段信息
    let keyArray: any = []; //公式所含所有key
    let keyFields: any = []; //key已拆开为对象
  //  keyArray = formula.match(/[A-Za-z0-9]+#[A-Za-z0-9_&%]+/g);
  //  keyArray = formula.match(/@@([A-Za-z0-9_#]*)/g);
    keyArray = formula.match(/@@([A-Za-z0-9_#$]*)/g);
    if (keyArray && keyArray.length) {
      keyArray.forEach(item => {
      //  let str: any = [];
      //  str = item.replace(/@@/g, '');
      //  let breakKey = str.split('#');

      // const regex = /^([^\#]+)\#([^\&]+)\&([^\%]+)?$/;
      // const match = item.match(regex);
      // const breakKey = [match[1], match[2], match[3] || ""];
        
        const str = item.replace(/@@/g, '');
        const regex = /([^\#\$\s]+)/g;
        const breakKey = str.match(regex);
        if (breakKey.length === 2) {breakKey.push("");}
        
        keyFields.push({field: breakKey[0], tableId: breakKey[1], mainField: breakKey[2]});
      });
    }
    if (dataSource && dataSource.length) {
      if (keyFields && keyFields.length) {
        keyFields.forEach(k =>{
            dataSource.forEach(f => {
            if (f.field === k.field && f.tableId === k.tableId && f.mainField === k.mainField) {
            const same = fields.find(i =>i.field === f.field);
            if (!same) {
              fields.push({
                field: f.field,
                mainField: f.mainField,
                name: f.name,
                schemaCode: f.schemaCode,
                tableId: f.tableId,
                type: f.type,
                alias: f.alias,
                dataType: f.dataType,
                needAlias: f.needAlias,
              });
            }
            }
      });
        });
      }
    }
  return fields;
  };
/**
 * 
 * @param formula 公式中的字段子串包含  $mainfield  ,请求接口前需要删除
 * @returns 
 */
  const deleteMainField = (formula) => {
    const substrings = formula.match(/@@([A-Za-z0-9_#$]*)/g) || []; // 匹配符合规则的子串
    let output = formula;
    for (const substring of substrings) {
      const replacement = substring.replace(/\$[A-Za-z0-9_]+|\$/g, ''); // 去掉在$后面的字符
      output = output.replace(substring, replacement); // 替换子串
    }
    return output;
  };

  /**
   * 
   * @param 公式反显时，需要将$mainfield 恢复, 用于公式编辑器 
   */
  const addMainField = (fieldObject: H3.Report.computeField) => {
    let formula = fieldObject.expression;
    let fields = fieldObject.fields;
    const substrings = formula.match(/@@([A-Za-z0-9_#]*)/g) || []; // 匹配符合规则的子串
    let output = formula;
    let processedFields = {};
    for (const substring of substrings) {
      let str: any = [];
       str = substring.replace(/@@/g, '');
       let breakKey = str.split('#');
      let foundField = fields.find(i => i.field === breakKey[0] && i.tableId === breakKey[1]);
      if (foundField && foundField.mainField) {
        //有mianField,则需要加上$mainField信息
        let replacement = substring.replace(/\$[A-Za-z0-9_]+|\$/g, ''); // 去掉在$后面的字符
        replacement = `${substring}$${foundField.mainField}`; // 替换的子串
        if (!processedFields[replacement]) {
          // 避免重复替换，因为公式中有可能出现多个相同的字段，子串会重复
          processedFields[replacement] = true;
          output = output.replaceAll(substring, replacement); // 替换子串
        }
      }
    }
    return output;
  }
  
  export default getUsedFields;

  export { deleteMainField , addMainField};
  