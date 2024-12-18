/**
 * 处理透视表
 * @param options
 */
function handleTableData(options: H3.Chart.ChartOptions): H3.PivotTable.Data {
  let { data: tableData }: any = options;

  if (tableData.summary && !tableData.data)
    {tableData.data = [JSON.parse(JSON.stringify(tableData.summary))];}
  // 使用计算字段后,需要对后台返回的汇总数据做清空操作,因为后台返回的汇总数据是不准确的
  tableData = handleComputeData(options,tableData);
  return {
    data: tableData.data, // 汇总数据
    rows: tableData.rows, // 列数据
    columns: tableData.columns, // 列数据
    summary: tableData.summary // 汇总数据
  };
}

// 处理计算字段对数据的影响
function handleComputeData(options,tableData) {
  // 计算字段的行汇总修改为null
  if (options.metric && options.metric.length) {
    options.metric.forEach((m, index) => {
      if (m.options.isAggregate) {
        let mIndex = index;
        tableData.summary.forEach((sum, i) => {
          if (i === mIndex) {
            tableData.summary[i] = null;
            mIndex = mIndex + options.metric.length; //先删除同个指标字段的所有汇总数据
          }
        });
      }
    });
  }
  // 计算字段的列汇总修改为null
  if (options.rows && options.rows.length) {
    if (tableData && tableData.data && tableData.data.length) {
      const cLength = tableData.data[0].length - options.metric.length; //data中非汇总数据的长度
    options.metric.forEach((m, mIndex) => {
      //列汇总显示位置在右侧，减去非汇总数据
      const nullIndex = mIndex + cLength;
      if (m.options.isAggregate) {
        tableData.data.forEach((rowData, dIndex) => {
          rowData.forEach((d, index) => {
            if (index === nullIndex) {
              tableData.data[dIndex][index] = null;
            }
          });
        });
      }
    });
    }
    
  }
  return tableData;
}
export default handleTableData;
