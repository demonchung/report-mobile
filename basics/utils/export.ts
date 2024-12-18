import XLSX from 'xlsx';
import {dateFormat} from '@h3/report-mobile/basics/utils/date';
import getAliaValue from './alias';

let merges: Array<any> = [];
//将带，的数字转化为number
function transNumber(number){
  if(number){
    const dotReg = /,/g;
    number = (number+'').replace(dotReg,'');
  }
//  return Number(number)|| number;
  return (Number(number) || Number(number) === 0) ? Number(number) : number;
}
/**
 * Table导出Excel
 * @param data
 * 参数所需数据接口： headRows, headColumns, bodyRows, summary, alias, title, colWidth
 */
function exportExcel(data: any) {
  if (!data) {return;}
  merges = [];
  let {headRows, headColumns, bodyRows, summary, alias, title, colWidth, columns, rows, metric, showSerialNumber } = data;
  bodyRows && bodyRows.length && bodyRows.forEach((tArr,index)=>{
    if(tArr && tArr.length){
      bodyRows[index] = tArr.map((v)=> (transNumber(v) || transNumber(v) === 0)? transNumber(v) : v)
    }
  })
  if (headColumns && headColumns.length) {
    summary && summary.length && summary.forEach((t,index)=>{
      summary[index] = transNumber(t)||t;
    })
    summary = new Array(headColumns[0].length - 1).fill(null).concat(summary);
  }
  summary = [['汇总'].concat(summary)];

  const workbook = { SheetNames: [], Sheets: {} };
  const wsName = 'report';

  const wsColHeadData = makeColHead(headRows, rows, alias,showSerialNumber);
  const wsRowHeadData = makeRowHead(headColumns, columns, alias, headRows.length, showSerialNumber);
  const ws = XLSX.utils.aoa_to_sheet(wsColHeadData);
  XLSX.utils.sheet_add_aoa(ws, wsRowHeadData, { origin: -1 });
  const dataOriginC = (headColumns.length && headColumns[0].length) || 0;
  const dataOriginR = headRows.length;
  XLSX.utils.sheet_add_aoa(ws, bodyRows, { origin: { r: dataOriginR, c: dataOriginC } });
  XLSX.utils.sheet_add_aoa(ws, summary, { origin: -1 });
  XLSX.utils.book_append_sheet(workbook, ws, wsName);

  // const allCollNum = wsColHeadData[0].length;
  // const headRowsNum = wsColHeadData.length;
  // const headRange = { s: { r: 0, c: 0 }, e: { r: headRowsNum - 1, c: allCollNum - 1 } };
  // setRangeSytle(headRange, ws);
  if (dataOriginC > 0) {
    const summaryR = dataOriginR + bodyRows.length;
    merges.push({ s: { r: summaryR, c: 0 }, e: { r: summaryR, c: dataOriginC - 1 } });

    // const footRange = { s: { r: summaryR, c: 0 }, e: { r: summaryR, c: allCollNum - 1 } };
    // setRangeSytle(footRange, ws);
  }

  ws['!merges'] = merges;
  // ws['!cols'] = [...new Array(allCollNum).fill({ wpx: 100 })];
  ws['!cols'] = [...colWidth.map((item) => { return { wpx: item * 1.2 } })];
  const dateStr = dateFormat(new Date(), 'YYYYMMDD');
  XLSX.writeFile(workbook, `${title}${dateStr}.xlsx`);
}

/**
 * 格式化Excel表头数据
 * @param headData
 * @param columns
 * @param alias
 * @param showSerialNumber
 */
function makeColHead(headData: Array<Array<any>>, columns:Array<H3.Report.FieldColumn> = [], alias: object = {},showSerialNumber: boolean = false) {
  const res: Array<Array<string | null>> = [];
  headData.forEach((row, i) => {
    const resRow: Array<string | null> = [];
    let currentCol = 0;
    row.forEach((cell: any, j) => {
      if (typeof cell === "object") {
        let aliaName = "";
        const index = i;
        const item = columns[index];
        
        if(cell.label && item ? item.needAlias : '') {
          aliaName = getAliaValue(item.uid, cell.label, alias);
        }
        resRow.push(aliaName || cell.label);
        if (cell.rowspan && cell.rowspan > 1) {
          merges.push({ s: { r: i, c: currentCol }, e: { r: i + cell.rowspan - 1, c: currentCol + cell.colspan - 1 } });
        } else if (cell.colspan && cell.colspan > 1) {
          merges.push({ s: { r: i, c: currentCol }, e: { r: i, c: currentCol + cell.colspan - 1 } });
          for (let k = 1; k < cell.colspan; k++) {
            resRow.push(null);
          }
          currentCol += cell.colspan;
        } else {
          currentCol++;
        }
      } else {
        resRow.push(alias[cell] || cell);
        currentCol++;
      }
    });
    res.push(resRow);
  });
  return res;
}

/**
 * 格式化Excel表头数据
 * @param headData
 * @param rows
 * @param alias
 * @param headRowNum
 * @param showSerialNumber
 */
function makeRowHead(headData: Array<Array<any>>, rows, alias: object = {}, headRowNum: number, showSerialNumber: boolean = false) {
  const res: Array<Array<string | null>> = [];
  const innerMerges: Array<object> = [];
  let preRow: Array<string | null> = [];
  headData.forEach((row, i) => {
    const resRow: Array<string | null> = [];
    let isSameRoot = true;
    row.forEach((cell, j) => {
      // 合并规则应该是 所有父级均相同时 才合并
      const sameRoot = row.join() === preRow.join();
      if(j> 0) {
        isSameRoot = isSameRoot ?  (row[j - 1] === preRow[j - 1]) : false;
      }
      if (cell && preRow[j] === cell && (j === 0 || sameRoot || isSameRoot)) {
        // 最后一个单元格的合并存在问题
        resRow.push(null);
        addRowSpan(innerMerges, i - 1, j, cell);
      } else {
        let aliaName = "";
        const index = showSerialNumber ? j - 1 : j;
        const item = rows[index];

        if(cell && item ? item.needAlias : '') {
          aliaName = getAliaValue(item.uid, cell, alias);
        }
        resRow.push(aliaName || cell);

        if (!innerMerges[i]) {
          innerMerges[i] = { [j]: { v: cell, r: i, c: j, rowspan: 1 } };
        } else {
          innerMerges[i][j] = { v: cell, r: i, c: j, rowspan: 1 };
        }
      }
    });
    res.push(resRow);
    preRow = row;
  });

  innerMerges.forEach((row) => {
    let i : any;
    for (i in row) {
      if (row.hasOwnProperty(i)) {
        const cell = row[i];
        if (cell.rowspan > 1) {
          merges.push({ s: { r: cell.r + headRowNum, c: cell.c }, e: { r: cell.r + headRowNum + cell.rowspan - 1, c: cell.c } });
        }
      }
    }
  });
  return res;
}

/**
 * 合并纵向单元格
 * @param merges
 * @param i
 * @param j
 * @param cell
 */
function addRowSpan(merges: Array<any>, i, j, cell) {
  for (i; i >= 0; i--) {
    if (merges[i][j] && merges[i][j].v === cell) {
      merges[i][j].rowspan++;
      break;
    }
  }
}

/**
 * 转换单元格地址到Excel表示法： 如 {c: 5 列, r: 0 行} 到 A6
 * @param cell
 */
function encode_cell(cell: {c: number, r: number}) {
  function encode_row(row) { return "" + (row + 1); }
  function encode_col(col) { let s=""; for(++col; col; col=Math.floor((col-1)/26)) {s = String.fromCharCode(((col-1)%26) + 65) + s;} return s; }
  return encode_col(cell.c) + encode_row(cell.r);
}

/**
 * 设置区域范围内的单元格样式
 * @param range
 * @param ws
 */
function setRangeSytle(range: any, ws: any) {
  for(let R = range.s.r; R <= range.e.r; ++R) {
    for(let C = range.s.c; C <= range.e.c; ++C) {
      const _address = encode_cell({ c: C, r: R });
      if (ws[_address]) {
        ws[_address].s = {
          font: {
            color: {
              rgb: '8893A700'
            }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrap_text: true
          },
        };
      }
    }
  }
}

export default exportExcel;

export const downloadFile = function(url, name) {
  let a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.target = '_self';
  a.click();
}
