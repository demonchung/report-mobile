let rowIndex = 1;

/**
 * 获取Object对象子集长度
 * @param obj
 * @param num
 * @param metric
 */
export function getObjectChildrenLength(
  obj: any,
  num: number,
  metric?: Array<H3.Report.FieldColumn>
) {
  if (!(obj instanceof Array)) {
    Object.values(obj).forEach((item: any) => {
      num = getObjectChildrenLength(item, num, metric);
    });
  } else {
    if (metric) {
      num += obj.length * metric.length;
    } else {
      num += obj.length;
    }
  }
  return num;
}
/**
 * 获取数组子集长度
 * @param arr
 * @param num
 */
function getChildrenLength(arr: Array<any>, num) {
  arr.forEach(item => {
    if (item.value) {
      num = getChildrenLength(item.value, num);
    } else {
      num += 1;
    }
  });
  return num;
}
/**
 * 处理行数据
 * @param columns
 * @param tableColumns
 * @param level
 * @param parent
 * @param isRowNo
 */
export function handleColumns(
  columns: any,
  tableColumns: any,
  isRowNo?: boolean,
  multiColumns?: boolean,
  level = 1,
  parent?: any,
  start: number = 0
) {
  let column;
  let rowspan;
  if (multiColumns) {
    // 行纬度大于一个
    columns.forEach(c => {
      column = parent ? Object.assign([], parent) : [];
      // 判断这个主指标有值
      rowspan = c.value ? c.value.length : 0;
      if (level === 1 && isRowNo) {
        column.push(String(c.number));
        rowIndex++;
      }
      column.push(c.key);
      const deep = c.value && c.value[0] && c.value[0].value;
      if (rowspan) {
        handleColumns(c.value, tableColumns, false, deep, level + 1, column, start);
      }
    });
  } else {
    // 行纬度只有一个时
    columns.forEach((item: any, index: number) => {
      column = parent ? Object.assign([], parent) : [];
      if (level === 1 && isRowNo) {
        column.push(String(start + rowIndex));
        rowIndex++;
      }
      if (item.key) {
        column.push(item.key);
      } else {
        column.push(item);
      }
      tableColumns.push(column);
    });
  }
}

export function handleSummaryColumns(
  columns: any,
  tableColumns: any,
  rowNo: number = 0,
  multiColumns?: boolean,
  level = 1,
  parent?: any,
  length: number = 0,
  isRowNo: boolean = false
) {
  let column;
  let rowspan;
  if (!columns) {
    columns = [
      {
        key: "",
        value: null,
        realValue: ""
      }
    ];
  }
  if (multiColumns || (isRowNo ? length + rowNo : length) > level) {
    // 行纬度大于一个
    columns.forEach(c => {
      column = parent ? Object.assign([], parent) : [];
      // 判断这个主指标有值
      rowspan = c.value ? c.value.length : 0;
      // if (level === 1 && rowNo) {
      //   column.push(String(c.number));
      //   rowIndex++;
      // }
      column.push({
        label: c.key,
        isTotal: c && (c.realValue === "_SubTotal_")
      });
      const deep = c.value && c.value[0] && c.value[0].value;
      if (rowspan || length > level) {
        handleSummaryColumns(c.value, tableColumns, rowNo, deep, level + 1, column, length);
      }
    });
  } else {
    // 行纬度只有一个时
    columns.forEach((item: any, index: number) => {
      column = parent ? Object.assign([], parent) : [];
      // if (level === 1 && rowNo) {
      //   column.push(String(start + rowIndex));
      //   rowIndex++
      // };

      if (item instanceof Object) {
        const tmpItem = {
          label: item.key,
          isTotal: item && item.realValue === "_SubTotal_"
        }
        column.push(tmpItem);
      } else {
        column.push(item);
      }
      tableColumns.push(column);
    });
  }
}
// export function handleRows(dataRows: any, metric: any, tableRows, level = 1) {
//   let children;
//   let width;
//   if (!tableRows[level - 1]) tableRows[level - 1] = [];
//   if (!(dataRows instanceof Array)) {
//     Object.keys(dataRows).forEach((colKey: string, index: number) => {
//       children = getObjectChildrenLength(dataRows[colKey], 0, metric);
//       tableRows[level - 1].push(...Array(children).fill(colKey));
//       if (children) {
//         handleRows(dataRows[colKey], metric, tableRows, level + 1);
//       }
//     });
//   } else {
//     dataRows.forEach((item: any, index: number) => {
//       tableRows[level - 1].push(...Array(metric.length).fill(item));
//       tableRows[level] = tableRows[level] || [];
//       tableRows[level].push(...metric);
//     });
//   }
// }
export function handleSummaryBodyRows(rows: any, tableRows: any,count, row?: any, level = 1) {
  let rowspan;
  if (!(rows instanceof Array)) {
    Object.keys(rows).forEach((colKey: string, index: number) => {
      rowspan = getObjectChildrenLength(rows[colKey], 0);
      if (level === 1 || index !== 0) {
        row = [];
      }
      const isTotal = !!(colKey.indexOf("__isTotal") > -1);
      const rowItem: any = {
        rowspan,
        isTotal: isTotal,
        label: isTotal ? colKey.split('__')[0] : colKey,
      }
      if(isTotal) {
        rowItem.colspan = count - level + 1;
      }
      row.push(rowItem);
      

      if ((level === 1 || index !== 0)) {
        tableRows.push(row);
      }
      if (rowspan && !isTotal) {
        handleSummaryBodyRows(rows[colKey], tableRows, count,row, level + 1);
      }
    });
  } else {
    rows.forEach((item: any, index: number) => {
      if (level === 1 || index !== 0) {
        row = [];
      }
      if(item.label) {
        row.push({ label: item.label, isTotal: item.isTotal });
      } else {
        row.push({ label: item});
      }
    
      if (level === 1 || index !== 0) {
        tableRows.push(row);
      }
    });
  }
}
export function handleBodyRows(rows: any, tableRows: any, row?: any, level = 1) {
  let rowspan;
  if (!(rows instanceof Array)) {
    Object.keys(rows).forEach((colKey: string, index: number) => {
      rowspan = getObjectChildrenLength(rows[colKey], 0);
      if (level === 1 || index !== 0) {
        row = [];
      }
      const isTotal = !!(colKey.indexOf("__isTotal") > -1);

      row.push({
        rowspan,
        isTotal: isTotal,
        label: isTotal ? colKey.split('__')[0] : colKey
      });
     

      if (level === 1 || index !== 0) {
        tableRows.push(row);
      }
      if (rowspan) {
        handleBodyRows(rows[colKey], tableRows, row, level + 1);
      }
    });
  } else {
    rows.forEach((item: any, index: number) => {
      if (level === 1 || index !== 0) {
        row = [];
      }
      if(item.label) {
        row.push({ label: item.label, isTotal: item.isTotal });
      } else {
        row.push({ label: item});
      }
    
      if (level === 1 || index !== 0) {
        tableRows.push(row);
      }
    });
  }
}

export function handleRows(
  rows: any,
  metric?: Array<H3.Report.FieldColumn>,
  tableRows?: any,
  multiRows?: boolean,
  level = 1,
  multiKeys: string = ""
) {
  let colspan;
  if (!tableRows[level - 1]) {tableRows[level - 1] = [];}
  if (multiRows) {
    rows.forEach((r, index) => {
      colspan =
        r.value && r.value.length
          ? getChildrenLength(r.value, 0) * (metric ? metric.length : 1)
          : 1;
      tableRows[level - 1].push({
        colspan,
        label: r.key || ""
      });
      const deep = r.value && r.value[0] && r.value[0].value;
      if (colspan) {
        handleRows(r.value, metric, tableRows, deep, level + 1, multiKeys + `${r.key}_`);
      }
    });
  } else {
    rows.forEach((item: any, index: number) => {
      const tmpKey = item.key ? item.key : item;
      tableRows[level - 1].push({
        label: tmpKey,
        colspan: metric ? metric.length : 1
      });
      tableRows[level] = tableRows[level] || [];
      if (metric) {
        tableRows[level].push(
          ...metric.map((field: H3.Report.FieldColumn) => {
            return {
              label: field.alias || field.name,
              key: `${multiKeys}${tmpKey}_${field.uid}#${field.alias || field.name}`
            };
          })
        );
      }
    });
  }
}
export function handleSummaryRows(
  rows: any,
  metric?: Array<H3.Report.FieldColumn>,
  tableRows?: any,
  multiRows?: boolean,
  length: number = 0,
  level = 1,
  multiKeys: string = "",
  isHide = false,
) {
  let colspan;
  let rowspan;
  if (!tableRows[level - 1]) {tableRows[level - 1] = [];}
  if (!rows) {
    rows = [
      {
        key: "",
        value: null,
        realValue: "_SubTotalitem_"
      }
    ];
  }
  if (multiRows) {
    const ml = metric ? metric.length : 1;
    rows.forEach((r, index) => {
      colspan =
        r.value && r.value.length
          ? getChildrenLength(r.value, 0) * ml
          : r.realValue === "_SubTotal_"
          ? ml
          : 1;
      const isTotal = r && r.realValue === "_SubTotal_";
      const rowItem: any = {
        isTotal,
        colspan,
        label: r.key || "",
        isHide,
      };
      if(isTotal) {
        rowItem.rowspan = length - level + 1;
      }

      tableRows[level - 1].push(rowItem);

      const deep = r.value && r.value[0] && r.value[0].value;
      if (colspan) {
        // if(!isTotal) {
          handleSummaryRows(
            r.value,
            metric,
            tableRows,
            deep,
            length,
            level + 1,
            multiKeys + `${r.key}_`,
            isTotal
          );
        // } else {
        //   if (metric) {
        //     tableRows[length].push(
        //       ...metric.map((field: H3.Report.FieldColumn) => {
        //         return {
        //           label: field.alias || field.name,
        //           key: `${multiKeys}_${field.uid}#${field.alias || field.name}`
        //         };
        //       })
        //     );
        //   }
        // }
      }
    });
  } else {
    rows.forEach((item: any, index: number) => {
      const tmpKey = item instanceof Object ? item.key : item;
      const isTotal = item && item.realValue === "_SubTotal_";
      tableRows[level - 1].push({
        isTotal: isTotal,
        label: tmpKey,
        colspan: metric ? metric.length : 1,
        isHide
      });
      tableRows[level] = tableRows[level] || [];
      if (metric) {
        tableRows[level].push(
          ...metric.map((field: H3.Report.FieldColumn) => {
            return {
              label: field.alias || field.name,
              key: `${multiKeys}${tmpKey}_${field.uid}#${field.alias || field.name}`
            };
          })
        );
      }
    });
  }
}
export function handleTableData(
  columns: Array<H3.Report.FieldColumn>,
  rows: Array<H3.Report.FieldColumn>,
  metrics: Array<H3.Report.FieldColumn>,
  data: H3.PivotTable.Data,
  isRowNo = false,
  start = 0
) {
  rowIndex = 1;
  let tableColumns: any = [];
  let tableRows: any = [];
  const multiColumns: boolean = columns && columns.length > 1;
  const multiRows: boolean = rows && rows.length > 1;
  if (columns && columns.length && data.columns) {
    handleColumns(data.columns || [], tableColumns, isRowNo, multiColumns, 1, [], start);
    // 没有列维度,表格没有footerRows(汇总)，与明细表类似
    if (!rows.length) {
      tableRows = [
        [...columns, ...metrics].map((row: H3.Report.FieldColumn, index: number) => {
          return {
            label: row.alias || row.name,
            key: `${row.uid}#${row.alias || row.name}`
          };
        })
      ];
    }
  } else if (isRowNo) {
    tableColumns = data.data.map((row: any, index) => [index + 1]);
  } else {
    tableColumns = data.data.map((row: any, index) => [""]);
  }
  if (rows && rows.length && data.rows) {
    handleRows(data.rows, metrics, tableRows, multiRows);
  }
  return {
    columns: tableColumns,
    rows: tableRows
  };
}

export function handleCrosstableData(
  columns: Array<H3.Report.FieldColumn>,
  rows: Array<H3.Report.FieldColumn>,
  metrics: Array<H3.Report.FieldColumn>,
  data: H3.PivotTable.Data,
  rowNo:number = 0,
  isRowNo: boolean = false
) {
  rowIndex = 1;
  let tableColumns: any = [];
  let tableRows: any = [];
  const multiColumns: boolean = columns && columns.length > 1;
  const multiRows: boolean = rows && rows.length > 1;
  if (columns && columns.length && data.columns) {
    handleSummaryColumns(
      data.columns || [],
      tableColumns,
      rowNo,
      multiColumns,
      1,
      [],
      columns.length,
      isRowNo
    );
    // 没有列维度,表格没有footerRows(汇总)，与明细表类似
    if (!rows.length) {
      tableRows = [
        [...columns, ...metrics].map((row: H3.Report.FieldColumn, index: number) => {
          return {
            label: row.alias || row.name,
            key: `${row.uid}#${row.alias || row.name}`
          };
        })
      ];
    }
  } else if (rowNo) {
    tableColumns = data.data.map((row: any, index) => [index + rowNo]);
  } else {
    tableColumns = data.data.map((row: any, index) => [""]);
  }
  if (rows && rows.length && data.rows) {
    handleSummaryRows(data.rows, metrics, tableRows, multiRows, rows.length);
  }
  return {
    columns: tableColumns,
    rows: tableRows
  };
}
