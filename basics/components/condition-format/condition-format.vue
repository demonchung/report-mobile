<template>
  <div :class="prefixCls" ref="conditionFormatModal">
    <div :class="`${prefixCls}__switch`"> 
      <a-switch :checked="isApply" @change="changeApply" size="small"/>
      <span v-if="isApply">已开启</span>
      <span v-else>已关闭</span>
    </div>
    
    <div :class="`${prefixCls}__radio`"> 
      <a-radio-group
        class="format-type-select"
        buttonStyle="solid"
        v-model="activeFormatType"
        :options="formatTypeOptions"
      >
      </a-radio-group>
    </div>
    <div v-if="activeFormatType === 'colorGradient'" :class="`${prefixCls}__colorGradient`"> 
      <a-select
        class="select-box"
        :value="colorType"
        :getPopupContainer="getPopupContainer"
        @change="onChange"
      >
        <a-select-option v-for="item in colorTypeOptions" :key="item.value" :class="`${prefixCls}__colorGradient-group`">
          <div
            :class="`${prefixCls}__colorGradient-item`"
            :style="{ background: `linear-gradient(to right, ${item.colors[0]}, ${item.colors[1]})`}"
          >
          </div>
        </a-select-option>
      </a-select>
    </div>
    <div v-if="activeFormatType === 'dataBar'" :class="`${prefixCls}__dataBar`">
      <h3-draggable
        v-model="tmpDataBar"
        id="tmpDataBar"
        handle=".drag"
        class="dragging-wrap"
        :options="dataBarDragOptions"
      >
        <div
          v-for="(item, index) in tmpDataBar"
          :key="index"
          :class="[`${prefixCls}__item`]"
        >
          <div :class="[`${prefixCls}__labelItem`]"> 
            <h3-svg name="drag-o" class="drag" color="#707481"></h3-svg>
            <ConditionRow
              :field="field"
              :formatType="activeFormatType"
              :option="item"
              :cascaderMenuList="formulaTypeOptions"
              :rangeTypeMap="rangeTypeMap"
              @changeFormula="changeFormula($event, index, activeFormatType)"
              @changeNumber="changeNumber($event, index, activeFormatType)"
              @changeColor="changeColor($event, index, activeFormatType)"
            ></ConditionRow>
            <span :class="[`${prefixCls}__delete`]" @click="deleteCondition($event, index, activeFormatType)"> 
              <h3-svg name="delete-stroke" :class="`label-delete`"></h3-svg>
            </span>
          </div>
          <span v-if="item.status" :class="[`${prefixCls}__error`]">{{ errorMsgs[item.status] }}</span>
        </div>
      </h3-draggable>
      <div :class="`${prefixCls}__warn`"> 
        <h3-svg name="exclamation-circle-stroke" color="#707481" class="warn-icon"></h3-svg>
        <span>顺序靠前的规则优先满足</span>
      </div>
      <span v-if="canAdd" :class="`${prefixCls}__add`" @click="addCondition(activeFormatType)">
        <h3-svg name="plus-stroke" color="#315EFB" class="add-icon"></h3-svg>
        添加条件
      </span>
    </div>
    <div v-if="activeFormatType === 'colorScale'" :class="`${prefixCls}__colorScale`">
      <h3-draggable
        v-model="tmpColorScale"
        id="tmpColorScale"
        handle=".drag"
        class="dragging-wrap"
        :options="colorScaleDragOptions"
      >
        <div
          v-for="(item, index) in tmpColorScale"
          :key="index"
          :class="[`${prefixCls}__item`]"
        >
          <div :class="[`${prefixCls}__labelItem`]"> 
            <h3-svg name="drag-o" class="drag" color="#707481"></h3-svg>
            <ConditionRow
              :field="field"
              :formatType="activeFormatType"
              :option="item"
              :cascaderMenuList="formulaTypeOptions"
              :valueTypeList="valueTypeOptions"
              :fieldList="getFieldList()"
              :rangeTypeMap="rangeTypeMap"
              @changeFormula="changeFormula($event, index, activeFormatType)"
              @changeNumber="changeNumber($event, index, activeFormatType)"
              @changeInput="changeInput($event, index, activeFormatType)"
              @changeColor="changeColor($event, index, activeFormatType)"
              @changeValueType="changeValueType($event, index)"
              @changeField="changeField($event, index)"
            ></ConditionRow>
            <span :class="[`${prefixCls}__delete`]" @click="deleteCondition($event, index, activeFormatType)"> 
              <h3-svg name="delete-stroke" :class="`label-delete`"></h3-svg>
            </span>
          </div>
          <span v-if="item.status" :class="[`${prefixCls}__error`]">{{ errorMsgs[item.status] }}</span>
        </div>
      </h3-draggable>
      <div :class="`${prefixCls}__warn`"> 
        <h3-svg name="exclamation-circle-stroke" color="#707481" class="warn-icon"></h3-svg>
        <span>顺序靠前的规则优先满足</span>
      </div>
      <span v-if="canAdd" :class="`${prefixCls}__add`" @click="addCondition(activeFormatType)">
        <h3-svg name="plus-stroke" color="#315EFB" class="add-icon"></h3-svg>
        添加条件
      </span>
    </div>
    <div v-if="activeFormatType === 'dataBar'" :class="`${prefixCls}__showDetail`"> 
      <span class="check-box" @click="changeNeedDetail"> 
        <h3-svg :name="!needDetail?'danxuan1changtaibeifen' : 'fuxuankuangbiankuang'"></h3-svg>
      </span>
      <span class="check-title">仅显示数据条</span>
    </div>
    <div v-if="!isApply" :class="`${prefixCls}__mask`"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import { Radio, InputNumber, Select, Switch, cascader, Dropdown } from "@h3/antd-vue";
import H3Draggable from "vuedraggable";
import {formulaOptions, stringFormulas} from "./formulaType";
import ClickOutSide from 'vue-v-clickoutside';
import colorTypeOptions from "./colorOption";
import H3ColorPicker from "../color-picker";
import H3Dropdown from "@h3/report-mobile/basics/components/simple-dropdown/index.vue";
import ConditionRow from './condition-row.vue';

@Component({
  name: "h3-report-condition-format",
  components: {
    H3Svg: Svg,
    ARadioGroup: Radio.Group,
    AInputNumber: InputNumber,
    ASelect: Select,
    ASelectOption: Select.Option,
    ASelectOptGroup: Select.OptGroup,
    ASwitch: Switch,
    H3Draggable,
    ACascader:cascader,
    H3ColorPicker,
    ADropdown:Dropdown,
    H3Dropdown,
    ConditionRow
  }
})
export default class ConditionFormat extends Vue {
  @Prop() conditionOptions!: H3.Report.ConditionFormat; //条件格式设置项
  @Prop() conditionFormat!: boolean; //条件格式设置开关
  @Prop() field!: H3.Report.FieldColumn; 
  @Prop() chart!: H3.Report.Chart;

  prefixCls = "h3-report-condition-format";
  
  activeFormatType: any = "dataBar"; // 所选条件格式类型
  colorType: string = "theme1"; //渐变色类型
  needDetail: boolean = true;//是否展示具体数据
  isApply: boolean = false; // 是否应用到单元格

  tmpDataBar: Array<any> = [];
  tmpColorScale: Array<any> = [];

  // 拖拽配置信息
  dataBarDragOptions: any = {
    group: "tmpDataBar",
    forceFallback: true,
    animation: 150,
    touchStartThreshold: 5,
    delay: 50,
    filter: ".undrag"
  }
  colorScaleDragOptions: any = {
    group: "tmpColorScale",
    forceFallback: true,
    animation: 150,
    touchStartThreshold: 5,
    delay: 50,
    filter: ".undrag"
  }
  
  valueTypeOptions = [
    {
      label: "固定值",
      value: "fixed"
    },
    {
      label: "动态值",
      value: "dynamic"
    }
  ];
  // 条件格式类型映射
  defaultFormatTypeOptions = [ 
    {
    label: "数据条",
    value: "dataBar"
    },
    {
      label: "区间色",
      value: "colorScale"
    },
    {
      label: "渐变色",
      value: "colorGradient"
    }
  ];
  
  get formatTypeOptions() {
    // 字符串类型只能使用渐区间色
    const map = {
      string: ["colorScale"],
      number: ["dataBar", "colorScale", "colorGradient"]
    };
    return this.defaultFormatTypeOptions.filter(item => map[this.field.type].includes(item.value));
  }
  //公式选项枚举
  get formulaTypeOptions() {
    return this.field.type === 'string' ? stringFormulas : formulaOptions;
  }

  rangeType = ['BelowBelow','BelowNotAbove','NotAboveBelow','NotAboveNotAbove'];
  rangeTypeMap = {
    BelowBelow: '<值<',
    BelowNotAbove: '<值≤',
    NotAboveBelow: '≤值<',
    NotAboveNotAbove: '≤值≤'
  };
  // 数字字段公式选项枚举映射, 用于获取公式选项值
  formulaMap = {
    Above: 0,
    NotBelow: 0,
    Below: 0,
    NotAbove: 0,
    Equal: 0,
    NotEqual: 0,
    BelowBelow: 1,
    BelowNotAbove: 1,
    NotAboveBelow: 1,
    NotAboveNotAbove: 1
  };
  //渐变色颜色选项
  colorTypeOptions = colorTypeOptions;

  errorMsgs: any = {
    "empty-data": "请设置正确数值区间", // 无数据
    "error-data": "请设置正确数值区间", //数据矛盾
    "error-field": "原数据被删除请重新添加", //字段被删除
    "error-string": "请设置文本内容" // 文本字段--区间色设置时--字符串(值)为空
  };

  get canAdd() {
    if (this.activeFormatType === "dataBar") {
      return this.tmpDataBar.length < 15;
    }
    if (this.activeFormatType === "colorScale") {
      return this.tmpColorScale.length < 15;
    }
  }
  get resultValue() {
    const conditions =
      this.activeFormatType === "dataBar"
        ? this.tmpDataBar
        : this.activeFormatType === "colorScale"
        ? this.tmpColorScale
        : [];
    const colorType = this.activeFormatType === "colorGradient" ? this.colorType : "";
    const options: H3.Report.ConditionFormat = {
      fieldUid: this.field.uid,
      formatType: this.activeFormatType,
      conditions: conditions,
      colorType: colorType,
      needDetail: this.needDetail,
    };
    return {
      options: options,
      isApply: this.isApply
    };
  }
  
  @Watch("resultValue", { deep: true })
  onResultValue() {
    const resultValue = {
      options: this.resultValue.options,
      isApply: this.resultValue.isApply
    }
    this.$emit("set-condition", resultValue);
  }


  getFieldList() {
    const fieldArr = this.chart.data.dimension;
    const options: any = [];
    const activeUid = this.field.uid;
    fieldArr.forEach((item, idx) => {
      if (item.uid !== activeUid 
        && item.type === 'number' 
        && (item.tableId === this.field.tableId 
        || (this.field.options.isComputeField && !item.mainField)
        || (!this.field.mainField && item.options.isComputeField)) ) {
        // if (!this.tmpColorScale[index].value.includes(item.uid)) {
          options.push({
            label: item.alias || item.name,
            value: item.uid
          });
        // }
      }
    });
    return options;
  }

/**
 * 是否应用到单元格
 */
  changeApply() {
    this.isApply = !this.isApply;
  }
  /**
   * 选择渐变色颜色类型
   */
  onChange(value) {
    this.colorType = value;
    console.log(111, value);
  }
  // 
  changeInput(e, index, type) {
    const tmpRow = this.tmpColorScale[index];
    tmpRow.value[0] = e;
    this.tmpColorScale.splice(index, 1, tmpRow);
    const status = this.checkValue(
        this.tmpColorScale[index].formula,
        this.tmpColorScale[index].value
      );
      if (!status && this.tmpColorScale[index].hasOwnProperty("status")) {
        delete this.tmpColorScale[index]["status"];
      }
  }
  changeNumber(data, index, type) {
    const e = data.value;
    const key = data.key;
    // 一起初始化
    if (type === 'dataBar') {
      const itemData = this.tmpDataBar[index];
      itemData.value[key] = e;
      this.tmpDataBar.splice(index, 1, itemData);
      const status = this.checkValue(this.tmpDataBar[index].formula, this.tmpDataBar[index].value);
      if (!status && this.tmpDataBar[index].hasOwnProperty("status")) {
        delete this.tmpDataBar[index]["status"];
      }
    }
    if (type === 'colorScale') {
      const tmpData = this.tmpColorScale[index];
      tmpData.value[key] = e;
      this.tmpColorScale.splice(index, 1, tmpData);
      const status = this.checkValue(
        this.tmpColorScale[index].formula,
        this.tmpColorScale[index].value
      );
      if (!status && this.tmpColorScale[index].hasOwnProperty("status")) {
        delete this.tmpColorScale[index]["status"];
      }
    }
  }
  changeField(e, index) {
    if (this.activeFormatType === "colorScale" && this.tmpColorScale[index].valueType === "dynamic") {
      const value = this.checkField(this.tmpColorScale[index].value, this.tmpColorScale[index].formula);
      if (!value && this.tmpColorScale[index].hasOwnProperty('status')) {
        delete this.tmpColorScale[index]['status'];
      }
    }
  }
  /**
   * 数据条是否显示数据
   */
  changeNeedDetail() {
    this.needDetail = !this.needDetail;
  }
  changeColor(val, index,key) {
    if (key === "dataBar") {
      this.tmpDataBar[index].color = val;
    }
    if (key === "colorScale") {
      this.tmpColorScale[index].color = val;
    }
  }
  /**
   * 添加条件
   */
   addCondition(type) {
    if (type === 'dataBar') {
      this.tmpDataBar.push({
        value: [null, null],
        color: "#9FE9C6",
        formula: this.formulaTypeOptions[0].value,
        valueType: ""
      });
    }
    if (type === 'colorScale') {
      this.tmpColorScale.push({
        value: [null, null],
        color: "#FFFFFF",
        formula: this.formulaTypeOptions[0].value,
        valueType: "fixed"
      });
    }
  }
  
  /**
   * 删除条件
   */
   deleteCondition(e, index, type) {
    if (type === 'dataBar') {
      if (this.tmpDataBar.length === 1) {
        const defVal = {
          value: [null, null],
          color: "#9FE9C6",
          formula: this.formulaTypeOptions[0].value,
          valueType: "",
        };
        this.tmpDataBar.splice(index, 1, defVal);
      } else {this.tmpDataBar.splice(index, 1);}
    }
    if (type === 'colorScale') {
      if (this.tmpColorScale.length === 1) {
        const defValue = {
          value: [null, null],
          color: "#FFFFFF",
          formula: this.formulaTypeOptions[0].value,
          valueType: "fixed",
        };
        this.tmpColorScale.splice(index, 1, defValue);
      } else {
        this.tmpColorScale.splice(index, 1);
      }
    }
  }
  
  changeFormula(e, index, type) {
    if (type === "dataBar") {
      if (this.formulaMap[this.tmpDataBar[index].formula] !== this.formulaMap[e[e.length - 1]]) {
        this.tmpDataBar[index].value = [null, null];
      }
      this.tmpDataBar[index].formula = e[e.length - 1];
    }
    if (type === "colorScale") {
      if (this.formulaMap[this.tmpColorScale[index].formula] !== this.formulaMap[e[e.length - 1]]) {
        this.tmpColorScale[index].value = [null, null];
      }
      this.tmpColorScale[index].formula = e[e.length - 1];
    }
  }
  changeValueType(e, index) {
    this.tmpColorScale[index].valueType = e;
    this.tmpColorScale[index].value = [null, null];
    
  }
  getPopupContainer() {
    return this.$el;
  }

  checkValue(formula, value) {
    const fieldType = this.field.type.toLowerCase();
    switch (fieldType) {
      case "number":
        if (this.rangeType.includes(formula)) {
          if (value[0] === null && value[1] === null) {
            return "empty-data";
          } else {
            if (value[0] !== null && value[1] !== null && value[0] >= value[1]) {
              return "error-data";
            }
          }
        } else {
          if (value[0] === null) {
            return "empty-data";
          }
        }
        break;
      case "string":
        if (!["None", "NotNone"].includes(formula)) {
          if (!value[0]) {
            return "error-string";
          }
        }
        break;
      default:
        break;
    }
  }
  checkField(value, formula) {
    const value1 = this.chart.data.dimension.find((c) => c.uid === value[0]);
    const value2 = this.chart.data.dimension.find((c) => c.uid === value[1]);
    if (this.rangeType.includes(formula)) {
      if (!value1 && !value2) {
        return "error-field";
      } 
    } else {
      if (!value1) {
        return "error-field";
      }
    }
  }

  /**
   * 初始化设置项
   */
  initSettings() {
    this.isApply = this.conditionFormat? JSON.parse(JSON.stringify(this.conditionFormat)) : this.isApply;
    if (this.field && this.field.type === "string") {
      this.activeFormatType = "colorScale";
    }
    if (this.conditionOptions) {
      const copyData = JSON.parse(JSON.stringify(this.conditionOptions));
      this.activeFormatType = copyData.formatType;
      this.colorType = copyData.colorType || this.colorType;
      this.needDetail = copyData.needDetail;
      if (this.activeFormatType === "dataBar") {
        this.tmpDataBar = copyData.conditions;
      } 
      if (this.activeFormatType === "colorScale") {
        this.tmpColorScale = copyData.conditions;
      }
    }
    if (!this.tmpDataBar.length) {
      this.tmpDataBar = [
        {
          value: [0, null],
          color: "#9FE9C6",
          formula: this.formulaTypeOptions[0].value,
          valueType: ""
        },
        {
          value: [0, null],
          color: "#FFBFBF",
          formula: this.formulaTypeOptions[2].value,
          valueType: ""
        }
      ];
    }
    if (!this.tmpColorScale.length) {
      this.tmpColorScale = [
        {
          value: [null, null],
          color: "#FFFFFF",
          formula: this.formulaTypeOptions[0].value,
          valueType: "fixed"
        }
      ];
    } 
  }
  
  checkEmptyField() {
    if (this.activeFormatType === "colorScale") {
      this.tmpColorScale.forEach((item, index) => {
        if (item.valueType === "dynamic") {
          const status = this.checkField(item.value, item.formula);
          if (status === "error-field") {
            this.$set(this.tmpColorScale[index], "value", [null, null]);
            this.$set(this.tmpColorScale[index], "status", status);
          }
        }
      });
    }
  }
  @Watch("conditionOptions", { deep: true }) 
  changeInit() {
    this.initSettings();
  }
  created() {
  }
  mounted() {
    this.initSettings();
    this.checkEmptyField();
  }
}
</script>

<style lang="less">
@import "~@h3/report-mobile/basics/styles/components";
.h3-report-condition-format__modal {
  .ant-modal-confirm-content {
    max-height: 432px !important;
    min-height: 432px !important;
     overflow: inherit !important;
  }
}
.h3-report-condition-format {
  position: relative;
  height: 364px;
  &__switch {
    display: flex;
    align-items: center;
    line-height: 22px;
    font-size: 13px;
    padding-bottom: 16px;
    border-bottom: 1px solid #F4F5F7;
    span {
      margin-left: 8px;
    }
  }
 &__radio {
  width: 100%;
  margin-top: 16px;
  margin-bottom: 12px;
  font-weight: 400 !important;
  .format-type-select {
    .ant-radio-wrapper {
      margin-right: 12px;
      line-height: 22px;
      font-size: 13px;
    }
  }
 }
 &__dataBar, &__colorScale {
  padding: 16px 0px 16px 8px;
  background: #F5F6F9;
  border-radius: 4px;
  .dragging-wrap {
    margin-bottom: 8px;
    max-height: 180px;
    overflow-x: hidden;
    overflow-y: auto;
    .visible-scrollbar();
    &::-webkit-scrollbar-thumb {
      background: rgba(18, 25, 51, 0.25);
    }
  }
 }
 &__colorGradient {
  width: 252px;
  background: #F5F6F9;
  border-radius: 4px;
  padding: 12px;
  &-group {
    .h3-report-condition-format__colorGradient-item {
      width: 100%;
      margin: 0;
    }
  }
  &-item {
    width: calc(100% - 48px);
    height: 20px;
    margin: 8px 0 8px 12px;
    border-radius: 2px;
    border: 1px solid #D1D3E4;
  }
  .ant-select {
    width: 100%;
  }
  .ant-select-selection--single {
    height: 36px;
  }
  .ant-select-selection__rendered {
    margin: 0 !important;
  }
  .ant-select-selection-selected-value {
    width: 100%;
  }
 }
 &__showDetail {
  margin: 4px 0;
  display: flex;
  align-items: center;
  .check-box {
    display: flex;
    margin-right: 8px;
  }
  .check-title {
    color: #121933;
    line-height: 22px;
    font-size: 13px;
  }
 }
 &__warn {
  margin-bottom: 12px;
  line-height: 20px;
  color: #707481;
  font-size: 12px;
  display: flex;
  align-items: center;
  .warn-icon {
    width: 13px !important;
    height: 14px !important;
    margin-right: 6px;
  }
 }
 &__add {
  line-height: 22px;
  color: #315EFB;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  .add-icon {
    width: 14px !important;
    height: 14px !important;
    margin-right: 6px;
  }
 }
 &__delete {
  display: flex;
  align-items: center;
  .label-delete {
    width: 14px !important;
    height: 14px !important;
    fill: #707481;
  }
  &:hover {
    .label-delete {
      fill: #121933;
    }
  }
 }
 &__labelItem {
  display: flex;
  align-items: center;
  width: 100%;
  .drag {
    margin-right: 8px;
  }
  .item-title {
    margin-right: 8px;
    line-height: 22px;
    font-size: 13px;
    color: #121933;
  }
 }
 
  &__mask {
    position: absolute;
    width: 100%;
    height: calc(100% - 40px);
    background: #FFFFFF;
    opacity: 0.7;
    z-index: 1;
    top: 40px;
  }
  &__item {
    margin-top: 12px;
    &:first-child {
      margin-top: 0;
    }
  }
  &__error {
    font-size: 12px;
    line-height: 20px;
    color: #FF3640;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
}

</style>
