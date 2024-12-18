

/**
 * 处理交叉表数据
 * @param options
 */
function handleCrossTableData(options: H3.Chart.ChartOptions): H3.PivotTable.Data {
  let { data : tableData }: any = options;
  // 使用计算字段后,需要对后台返回的汇总数据做清空操作,因为后台返回的汇总数据是不准确的
  // tableData = handleComputeData(options,tableData);
  // 有汇总没数据,针对的是没有行维度,只有列维度的情况; 需要把汇总展示为主体数据
  if (tableData.summary && !tableData.data)
    {tableData.data = [JSON.parse(JSON.stringify(tableData.summary))];}
  // 使用计算字段后,需要对后台返回的汇总数据做清空操作,因为后台返回的汇总数据是不准确的
  tableData = handleComputeData(options, tableData);
  return {
    data: tableData.data, // 汇总数据
    rows: tableData.rows, // 列数据
    columns: tableData.columns, // 列数据
    summary: tableData.summary // 汇总数据
  };
}

// 处理计算字段对数据的影响
function handleComputeData(options,tableData) {
  let resData: any = tableData;
  // 计算字段的行汇总修改为null
  if (options.metric && options.metric.length) {
    options.metric.forEach((m, index) =>{
      if (m.options.isAggregate) {
        let mIndex = index;
        tableData.summary.forEach((sum, i) =>{
          if (i === mIndex) {
            tableData.summary[i] = null;
            mIndex = mIndex + options.metric.length; //先删除同个指标字段的所有汇总数据
          }
        });
      }
    });
  }
  // 计算字段的列汇总修改为null
  if (options.rows && options.rows.length ) {
   // let cLength = this.columnTotol * this.metric.length;//data中非汇总数据的长度
   if (tableData.data && tableData.data.length) {
    const cLength = tableData.data[0].length - options.metric.length;
    options.metric.forEach((m, mIndex) =>{
      //当列汇总显示位置在右侧时，减去非汇总数据
      const nullIndex = options.crossSummary.columnSummaryPosition === 1 ? mIndex : mIndex + cLength;
      if (m.options.isAggregate && options.crossSummary.columnSummary) {
        tableData.data.forEach((rowData, dIndex) =>{
        rowData.forEach((d, index) =>{
          if (index === nullIndex) {
            tableData.data[dIndex][index] = null;
          }
        });
      });
    }
    });
   }
  }
  return resData;
}




export default handleCrossTableData;
