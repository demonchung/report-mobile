<template>
  <table
    border="0"
    cellspacing="0"
    cellpadding="0"
    :class="prefixCls"
    :style="`width: ${tableWidth};fontSize: ${fontSize}px`"
  >
    <!-- Todo 将明细表的数据放在外部处理 done-->
    <colgroup>
      <col v-for="h in sortColumn" :key="h.key" :style="`width: ${h.width}px`" />
    </colgroup>
    <tbody>
      <tr :data-idx="index + 1" v-for="(d, index) in datasource" :key="index">
        <template v-for="(col, num) in sortColumnComputed">
          <th
            v-if="typeof d[col.key] !== 'object' || d[col.key] === null"
            :key="col.key"
            :data-key="col.key"
            :data-value="d[col.key]"
            @click="clickField($event, d, num)"
            :style="getBgColor(d[col.key], col.key, index)"
          >
            <div
              :class="[
                `${prefixCls}__cell`,
                col.type === 'number' ? `${prefixCls}__cell-right` : '',
                showBar(col) ? `${prefixCls}__cell-padding` : ''
              ]"
              :style="getBgColor(d[col.key], col.key, index)"
            >
              <template>
                <numberBar
                  v-if="col.type === 'number' && showBar(col)"
                  :col="col"
                  :value="d[col.key]"
                  :minMaxMap="minMaxMap"
                  :color="getBarColor(col, d[col.key],chart, setFontColor)"
                  :conditionOption="getOption(col.key)"
                  :textAlign="textAlign"
                />
                <!-- <span v-else>{{
                  col.key === "h3-report-list-order" ? prefixSerial + index + 1 : d[col.key]
                }}</span> -->
                <div class="content" v-else>
                  <Alias
                    :value="col.key === 'h3-report-list-order' ? prefixSerial + index + 1 : d[col.key]"
                    :field="columns.length === sortColumnComputed.length? columns[num] : num === 0? '' : columns[num - 1]"
                  />
                </div>
              </template>
            </div>
          </th>
          <th 
            v-else 
            :key="col.key" 
            :data-key="col.key"
            :data-value="d[col.key].length === 1 ? d[col.key][0]: ''" 
            :style="d[col.key].length === 1? getBgColor(d[col.key][0], col.key, index): ''"
          >
            <div class="">
              <div
                v-for="(child, cIndex) in d[col.key]"
                :key="`${index}-${cIndex}-child`"
                :class="[
                  `${prefixCls}__cell`,
                  col.type === 'number' ? `${prefixCls}__cell-right` : ''
                ]"
                @click="clickField($event, d, cIndex, true, num)"
                :style="getBgColor(child, col.key, index, cIndex,'child',col)"
              >
                <template>
                  <numberBar
                    v-if="col.type === 'number' && showBar(col)"
                    :col="col"
                    :value="child"
                    :minMaxMap="minMaxMap"
                    :color="getBarColor(col, child,chart, setFontColor)"
                    :conditionOption="getOption(col.key)"
                    :textAlign="textAlign"
                  />
                  <Alias
                    v-else
                    :value="child"
                    :field="columns.length === sortColumnComputed.length? columns[num] : num === 0? '' : columns[num - 1]"
                  />
                  <!-- <span v-else>{{ child }}</span> -->
                </template>
              </div>
            </div>
          </th>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { promisify } from "util";
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import numberBar from "./numberBar.vue";
import { StringType, AddressType } from "@h3/report-mobile/basics/enum/filter-type";
import { getStrLen } from "@h3/report-mobile/basics/utils/string";
import Alias from "@h3/report-mobile/basics/components/alias"
import colorOptions from "@h3/report-mobile/basics/components/condition-format/colorOption";
import { getGradientColor, getColorScaleColor, getDataBarColor} from "@h3/report-mobile/basics/utils/condition-format";

const prefix = "h3-report";
@Component({
  name: "h3-report-list-table-body",
  components: {
    numberBar,
    Alias
  }
})
export default class ReportListBody extends Vue {
  // 表格数据
  @Prop({ default: () => [] }) datasource!: any;
  // 格式化后原始表头数据 已排序
  @Prop({ default: () => [] }) sortColumn!: Array<any>;
  // 别名系统
  @Prop({ default: () => {} }) alias!: any;
  @Prop({ default: () => [] }) columns!: Array<H3.Report.FieldColumn>;
  @Prop({ default: () => {} }) headerColumn!: any;
  @Prop({ default: () => {} }) orderNumber!: H3.Report.OrderNumber;
  @Prop({ default: () => "" }) setFontColor!: string; //是否自定义设置字体颜色
  @Prop({ default: null }) chart!: H3.Report.Chart;
// 标签字体大小
  @Prop({ default: 12 }) fontSize!: number;
  // 分页信息
  @Prop({
    default: () => {
      return {
        pageSize: 10, // 页数大小
        pageIndex: 1 // 第几页
      };
    }
  })
  pageParams!: H3.List.pageOptions;

  prefixCls: string = `${prefix}-list-table-body`;

  // 固定的单元格高度
  staticCellHeight: number = 36;

  get textAlign() {
    let textAlign = "right";
    if (this.chart.styles.listTextAlign && this.chart.styles.listTextAlign.alignment) {
      textAlign = this.chart.styles.listTextAlign.alignment;
    } 
    return textAlign === "default" ? "right" : textAlign;
  }

  getDataHeight(dimKey, celdata: any, index) {
    const item = this.datasource[0];
    const widths = [];
    Object.keys(item).forEach((key)=> {
      if(dimKey.includes(key) && Array.isArray(item[key])){
       this.sortColumn.forEach(s => {
        if(s.key === key) {
          (widths as any).push(s.width);
        }
       });
      }
    });
    const strLen = getStrLen(celdata);
    let height = 36;
    if(strLen) {
      height = (strLen * 7 + 24) / widths[index] <= 1 ? 
      36 :  ((strLen * 7 + 24) / widths[index] <= 2 ? 52 : 66);
      return height;
    } else {
      return height;}
  }

  getCol(item,dimKey) {
    const arr = [];
    const widths = [];
    Object.keys(item).forEach((key) => {
      if (dimKey.includes(key) && Array.isArray(item[key])) {
        item[key].forEach((v, index) => {
          if (!arr[index]) {arr[index] = [];}
          (arr[index] as any).push(v);
        })
      }
    })
    return arr;
  }
  showBar(col) {
    if (col.type === "number") {
      if (col.options && col.options.conditionFormat) {
        if (this.chart.conditionFormats && this.chart.conditionFormats.length) {
          const conditionFormat = this.chart.conditionFormats.find(
            (item) => item.fieldUid === col.key,
          );
          if (conditionFormat) {
            return conditionFormat.formatType === "dataBar";
          }
        }
      }
    }
  }
  getOption(uid) {
    if (this.chart && this.chart.conditionFormats) {
      return this.chart.conditionFormats.find(item => item.fieldUid === uid);
    }
  }
  
  get CellHeights() {
    const cellDate: Array<any> = []; //维度数据
      const clumnHeights: Array<any> = []; //每列所有格子高度
      const maxHeight: any = []; //每列最大高度
      const dimKey: Array<string> = []; //获取维度key
    this.sortColumn.forEach((col, index) => {
      dimKey.push(col.key);
    })
    this.datasource.forEach((item, index) => {
      let realWidth = 0;
      let intHeight = 36;
      const c = this.getCol(item, dimKey);
      cellDate.push(c);
      for (let i = 0 ; i < cellDate[index].length ; i++) {
        for (let j = 0 ; j < cellDate[index][i].length ; j++) {
          realWidth = this.getDataHeight(dimKey, cellDate[index][i][j], j);
          intHeight = Math.max(intHeight, realWidth);
        }
        if (!maxHeight[index]) {maxHeight[index] = [];}
        maxHeight[index].push(intHeight);
      }
    });
    return maxHeight;
  }
  /**
   * 动态计算表格的宽度
   */
  get tableWidth(): string {
    return this.sortColumn.length > 0
      ? this.sortColumn.reduce((current, next) => {
          const currentWidth = current.width || current;
          return currentWidth + next.width;
        }) + "px"
      : "100%";
  }

  /**
   * 条形图数据处理
   */
  get sortColumnComputed() {
    if (this.sortColumn && this.sortColumn.length) {
      const resArr = JSON.parse(JSON.stringify(this.sortColumn));
      resArr.forEach(col => {
        const needComputed = col.type === "number" && col.options && col.options.transformBar; // 如果是进度条展示
        if (needComputed) {
          col.transformBar = true;
          col.maxNumber = this.getMaxNumber(col);
        }
      });
      return resArr;
    } else {
      return this.sortColumn;
    }
  }

  getAbsNumber(number) {
    if (typeof number === "string" && number) {
      const dotReg = /,/g;
      const percentReg = /%/g;
      number = number.replace(dotReg, "");
      number = number.replace(percentReg, "");
    }
    return Math.abs(number || 0);
  }

  getMaxForSubTable(numberArr) {
    const newNums = numberArr.map(n => {
      return this.getAbsNumber(n);
    });
    return Math.max.apply(null, newNums);
  }
  // 是否是负数
  isMinus(value) {
    if (typeof value === "number") {return value < 0;}
    return value && value.indexOf("-") > -1;
  }

  /**
   * 获取结果集中的最大数值
   */
  getMaxNumber(col) {
    if (!this.datasource.length) {return 0;}
    let maxNumber = 0;
    this.datasource.forEach(d => {
      if (d[col.key]) {
        if (typeof d[col.key] !== "object") {
          if (this.isMinus(d[col.key])) {col.transformBarType = "twoWay";} // 单向 normal ;双向：twoWay
          const nowVal = this.getAbsNumber(d[col.key]);
          if (nowVal > maxNumber) {
            maxNumber = nowVal;
          }
        } else {
          //子表数据
          const metchLow = d[col.key].find((el) => this.isMinus(el));
          if (metchLow) {col.transformBarType = "twoWay";} // 单向 normal ;双向：twoWay
          const nowMax = this.getMaxForSubTable(d[col.key]);
          if (nowMax > maxNumber) {
            maxNumber = nowMax;
          }
        }
      }
    });
    return maxNumber;
  }
  /**
   * 序号前缀
   */
  get prefixSerial() {
    return this.pageParams.pageSize * (this.pageParams.pageIndex - 1);
  }

  /**
   * 动态计算表格每一行的最大行数
   */
  get maxClomns(): Array<number> {
    return this.datasource.map(item => {
      let max: number = 1;
      for (const key in item) {
        if (Array.isArray(item[key]) && item[key].length > max) {
          max = item[key].length;
        }
      }
      return max;
    });
  }

  /**
   * 计算单元格高度和行高
   */
  calculateCellStyle(index, value) {
    // if (value && value.length === this.maxClomns[index]) return
    const height = (this.maxClomns[index] * this.staticCellHeight) / value.length;
    return {
      height: `${height}px`,
      "line-height": `${height - 16}px`
    };
  }
  /**
   *获取点击详情数据
   */
  getTableDetail(key, value) {
    const copyColumn = JSON.parse(JSON.stringify(this.headerColumn));
    // 清除多余项
    if (copyColumn.length && !copyColumn[copyColumn.length - 1].length)
      {copyColumn.splice(copyColumn.length - 1, 1);}
    for (let i = 0; i < this.headerColumn.length; i++) {
      const metch = this.headerColumn[i].find((el) => el.key === key);
      if (metch)
        {return {
          label: metch.name,
          value: value,
        };}
    }
    return {};
  }

  getText(data, uid) {
    if (data[uid + "_ADCODE"] || data[uid + "_ADCODE"] === 0) {
      return [data[uid + "_ADCODE"]];
    }
    if (data["real_" + uid] || data["real_" + uid] === 0) {
      return [data["real_" + uid]];
    }
    return [data[uid]];
  }

  /**
   * 点击单元格
   */
  clickField($event, data, index, isRelations = false, pIndex) {
    const isNO = this.orderNumber && this.orderNumber.checked;
    let colIndex = isNO ? index - 1 : index;
    if (isRelations) {colIndex = isNO ? pIndex - 1 : pIndex;}
    const col = this.columns[colIndex];
    if (!col) {return;}
    const text = this.getText(data, col.uid);
    const filters = [
      {
        field: col,
        formula:
          col.specialType && col.specialType === "address" ? AddressType.Belong : StringType.Equal,
        text: Array.isArray(text[0]) ? [text[0][index]] : text, //
        labels: data["real_" + col.uid] ? [data[col.uid]] : []
      }
    ];
    if (!data) {return;}
    if (!$event) {return;}
    const innerText = $event.target.innerText;
    const textOverFlow =
      $event.target.parentElement.scrollWidth > $event.target.parentElement.clientWidth;
    if (data.holeInfo) {
      this.$emit("drill-down", {
        ...data.holeInfo,
        params: {
          isRelations,
          tableDetail: [
            {
              label: "",
              value: innerText
            }
          ],
          chartType: "list",
          textOverFlow,
          chartClickposition: {
            x: $event.pageX,
            y: $event.pageY
          }
        },
        filters,
        metricFilter: filters // 只记录当前点击的单元格
      });
    } else {
      this.$emit("drill-down", {
        params: {
          isRelations,
          tableDetail: [
            {
              label: "",
              value: innerText
            }
          ],
          chartType: "list",
          textOverFlow,
          chartClickposition: {
            x: $event.pageX,
            y: $event.pageY
          }
        },
        filters,
        metricFilter: filters
      });
    }
  }

  /**
   * 获取图表每列最大最小值, 考虑一对多的情况
   */
  get minMaxMap() {
    const keys = this.sortColumnComputed.reduce((acc, obj) => {
      acc.push(obj["key"]);
      return acc;
    }, []);
    const regex = /%$/;
    const dotReg = /,/g;
    const reg = /[,]/; 
    const result = keys.reduce((acc, key) => {
      const values = this.datasource.flatMap(obj => {
        const value = obj[key];
        if (Array.isArray(value)) {
          const numberValues = value.map(v => typeof v === 'string' && regex.test(v) ? parseFloat(v.replace(/,/g, '').replace(/%/g, '')) / 100 : reg.test(v)? v.replace(dotReg,'') : v);
          const min = Math.min(...numberValues);
          const max = Math.max(...numberValues);
          return isNaN(min) || isNaN(max) ? [] : [min, max];
        } else if (typeof value === 'string' && regex.test(value)) {
          const numberValue = parseFloat(value.replace(/,/g, '').replace(/%/g, '')) / 100;
          return [numberValue];
        } else  if ( typeof value === 'string' && reg.test(value)){
          return [value.replace(dotReg,'')];
        } else {
          return [value];
        }
      });
      const min = Math.min(...values);
      const max = Math.max(...values);
      acc[key] = { min: isNaN(min) ? undefined : min, max: isNaN(max) ? undefined : max };
      return acc;
    }, {});
    return result;
  }
  /**
   * value: 当前单元格的值
   * uid: 当前单元格字段的uid
   * index: 当前单元格所在列的索引
   * cIndex: 当前单元格所在列的索引, 一对多的情况下, 会有多个单元格
   * key: 当前单元格所在列的key , 是否是一对多的情况
   */
  getBgColor(value, uid, index?, cIndex?, key?, col?) {
    const field = this.columns.find((el) => el.uid === uid);
    const fieldType = field && field.type;
    let color: any = {
      bgcolor: "unset",
      fontColor: "unset"
    };
    const regex = /%$/;
    const dotReg = /,/g;
    const reg = /[,]/;
    if (field && field.options.conditionFormat && this.chart.conditionFormats) {
      const option: any = this.chart.conditionFormats.find((el) => el.fieldUid === uid);
      if (option && option.formatType === "colorGradient") {
        if (value || value === 0) {
          // 当数字类型的时候, 值也可能为字符串格式, 需要先去掉千分符和百分号, 再转换为数字
          const numberValue = regex.test(value)
            ? parseFloat(value.replace(/,/g, "").replace(/%/g, "")) / 100
            : Number(reg.test(value) ? value.replace(dotReg, "") : value);
          const colortype: any = colorOptions.find((el) => el.value === option.colorType);
          const min = this.minMaxMap[uid].min;
          const max = this.minMaxMap[uid].max;
          color = getGradientColor(min, max, colortype.colors, numberValue);
        }
      }
      if (option && option.formatType === "colorScale") {
        const checkEmpty = fieldType === "string" ? true : (value || value === 0);
        const realValue = fieldType === "string" ? 
          value: 
          regex.test(value) ? parseFloat(value.replace(/,/g, '').replace(/%/g, '')) / 100 : Number(reg.test(value)?value.replace(dotReg,''): value)
        
          if (checkEmpty) {
          color = getColorScaleColor(option, this.datasource, realValue, uid, index, cIndex, key, fieldType);
        }
      }
    }
    if (key && key === "child") {
      return {
        height: this.CellHeights[index][cIndex] + "px",
        background: color.bgcolor,
        color: this.setFontColor ? "unset" : color.fontColor,
        padding: this.showBar(col) ? "8px 0px" : "",
      };
    } else {
      return {
        background: color.bgcolor,
        color: this.setFontColor ? "unset" : color.fontColor,
      };
    }
  }
  getBarColor(col, value, chart, fontcolor) {
    return getDataBarColor(col, value, chart, fontcolor);
  }

  mounted() {
    console.log(this.sortColumn);
  }
}
</script>

<style lang="less" scoped>
@import "../styles/index.less";
</style>
