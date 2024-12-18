//计算字段转化为标准字段

const unifiedField = (cfield) => {
    return  {
        alias: "",
        associationCode: "",
        canUsed: true,
        dataType: null,
        field: cfield.id,
        mainField: "",
        name: cfield.title,
        needAlias: cfield.needAlias,
        options: {
          isAggregate: cfield.aggregate, //汇总字段标识
          isComputeField: true, ///计算字段标识
        },
        parentSchemaCode: "",
        primaryKey: false,
        relation: false,
        schemaCode: "",
        specialType: "",
        tableId: "",
        tableName: "",
        type: cfield.type.toLowerCase(),
        uid: "",
        visible: true
      }
  };
  
  export default unifiedField;
  