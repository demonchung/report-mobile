<template>
  <div :class="prefixCls">
    <span class="left-title">值</span>
    <a-cascader
      placeholder=""
      :style="cascaderStyle"
      :allowClear="false"
      :class="`${prefixCls}__formula`"
      :options="cascaderMenuList"
      :display-render="displayRender"
      :value="getValue(option.formula)"
      @change="changeFormula($event)"
    />
    <a-select
      v-if="selectValueType"
      style="width: 84px"
      :class="`${prefixCls}__type`"
      :options="valueTypeList"
      v-model="option.valueType"
      @change="changeValueType($event)"
    ></a-select>
    <div v-show="isMultipleInput" :class="[`${prefixCls}__multipleInput`]">
      <template v-if="inputType === 'inputNumber'">
        <a-input-number
          placeholder="无限制"
          :style="InputNumberStyle"
          v-model="option.value[0]"
          :step="0"
          @change="changeNumber($event,0)"
        />
        <span :class="[`range-title`, isLarge? 'largeSpace': 'smallSpace']">{{ rangeTypeMap[option.formula] }}</span>
        <a-input-number
          placeholder="无限制"
          :style="InputNumberStyle"
          v-model="option.value[1]"
          :step="0"
          @change="changeNumber($event,1)"
        />
      </template>
      <template v-if="inputType === 'select'">
        <a-select
          :style="selectStyle"
          :options="fieldList"
          v-model="option.value[0]"
          @change="changeField($event)"
        ></a-select>
        <span :class="[`range-title`, isLarge? 'largeSpace': 'smallSpace']">{{ rangeTypeMap[option.formula] }}</span>
        <a-select
          :style="selectStyle"
          :options="fieldList"
          v-model="option.value[1]"
          @change="changeField($event)"
        ></a-select>
      </template>
    </div>
    <div v-show="!isMultipleInput && canInput" :class="[`${prefixCls}__singleInput`]">
      <a-input-number
        v-if="inputType === 'inputNumber'"
        placeholder="请输入数值"
        :style="InputNumberStyle"
        v-model="option.value[0]"
        :step="0"
        @change="changeNumber($event,0)"
      />
      <a-select
        v-if="inputType === 'select'"
        :style="selectStyle"
        :options="fieldList"
        v-model="option.value[0]"
        @change="changeField($event)"
      ></a-select>
      <a-input
        v-if="inputType === 'input'"
        style="width: 284px"
        :maxLength="32"
        placeholder="请输入"
        v-model="option.value[0]"
        @change="changeInput"
      />
    </div>
    <div :class="`${prefixCls}__color-picker`">
      <h3-dropdown
        :controlCls="['h3-report-color-picker']"
        :appendToBody="true"
        :offset="[0, 4]"
        :autoHide="false" 
        overlayCls="dashboard-dropdown"
        placement="bottom-start"
        :class="`${prefixCls}__color-picker-dropdown`"
      >
        <div :class="`${prefixCls}__color-picker-colorbox`"> 
          <div class="bg" :style="{ background: option.color }"></div>
          <span class="select"> 
            <h3-svg name="bevel-left-stroke" position="left" class="down" color="#707481"></h3-svg>
          </span>
        </div>   
        <template slot="content">
          <h3-color-picker :color="option.color" @change="changeColor($event)"></h3-color-picker>
        </template>
      </h3-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Radio, InputNumber, Select, Switch, cascader, Dropdown, Input } from "@h3/antd-vue";
import H3Dropdown from "@h3/report-mobile/basics/components/simple-dropdown/index.vue";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import H3ColorPicker from "../color-picker";
import { rangeType } from "./formulaType";

@Component({
  name: "h3-report-condition-row",
  components: {
    H3Svg: Svg,
    AInputNumber: InputNumber,
    ASelect: Select,
    ASelectOption: Select.Option,
    ASelectOptGroup: Select.OptGroup,
    ASwitch: Switch,
    ACascader:cascader,
    H3ColorPicker,
    H3Dropdown,
    AInput: Input
  }
})
export default class RowSelect extends Vue {
  @Prop({ default: "" }) formatType!: string; // dataBar | colorScale 
  @Prop({ default: () => {} }) field!: H3.Report.FieldColumn; ; //字段
  @Prop() option!: any; //条件格式设置项
  @Prop({ default: () => [] }) cascaderMenuList!: Array<any>; //公式下拉菜单
  @Prop({ default: () => [] }) valueTypeList!: Array<any>; //值类型下拉菜单
  @Prop({ default: () => [] }) fieldList!: Array<any>; //字段下拉菜单
  @Prop({ default: () => {} }) rangeTypeMap!: any; //范围公式映射


  prefixCls: string = "h3-report-condition-row";

  rangeType = rangeType;

  // 是否显示大号组件
  get isLarge() {
    return this.formatType === 'dataBar' || (this.formatType === 'colorScale' && this.field.type === 'string');
  }

  get canInput() {
    return this.option.formula !== 'None' && this.option.formula !== 'NotNone';
  }

  // 是否显示值类型下拉菜单
  get selectValueType() {
    return this.formatType !== 'dataBar' && this.field.type !== 'string';
  }
  // cascader样式
  get cascaderStyle() {
    return {
      width: this.isLarge ? '96px' : '72px'
    }
  }

  // inputNumber样式
  get InputNumberStyle() {
    return {
      width: this.rangeType.includes(this.option.formula) ? 
      (this.isLarge ? '118px' : '88px') : 
      (this.isLarge ? '284px' : '214px')
    }
  }

  // select样式
  get selectStyle() {
    return {
      width: this.rangeType.includes(this.option.formula) ? '88px' : '214px'
    }
  }

  // 是否是多个输入框 , 仅在范围类型时显示
  get isMultipleInput() {
    return this.rangeType.includes(this.option.formula);
  }

  // 输入框类型
  get inputType() {
   // 动态值是渲染select组件
    if (this.option.valueType === 'dynamic') {
      return 'select';
    } else {
      return this.field.type === 'number' ? 'inputNumber' : 'input';
    }
  }


  changeColor(val) {
    this.$emit('changeColor', val);
  }
  // 修改公式
  changeFormula(val) {
    this.$emit('changeFormula', val);
  }
  changeNumber(val, key) {
    const data = {
      value: val,
      key: key
    }
    this.$emit('changeNumber', data);
  }
  // 修改值 -- 文本字段
  changeInput(val) {
    const value = val.target.value;
    this.$emit('changeInput', value);
  }
  // 修改值类型 --动态值/固定值
  changeValueType(val) {
    this.$emit('changeValueType', val);
  }
  // 动态值--修改字段
  changeField(val) {
    this.$emit('changeField', val);
  }

  displayRender({ labels }) {
    if (labels.length) {
      // return labels[labels.length - 1];
      return labels[0];
    }
  }

  getValue(formula) {
    const value: any = [];
    if (this.rangeType.includes(formula)) {
      value.push('range');
      value.push(formula);
    } else {
      value.push(formula);
    }
    return value;
  }
  
}
</script>
<style lang="less">
.h3-report-condition-row {
  display: flex;
  align-items: center;
  height: 36px;

  .left-title {
    font-weight: 400;
    color: #121933;
    line-height: 22px;
    font-size: 13px;
    margin-right: 8px;
  }
  &__formula {
    margin-right: 8px;
  }
  &__type {
    margin-right: 8px;
  }
  &__multipleInput {
    margin-right: 8px;
    display: flex;
    .range-title {
      font-size: 12px;
      line-height: 20px;
      color: #121933;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    .smallSpace {
      width: 38px;
    }
    .largeSpace {
      width: 48px;
    }
  }
  &__singleInput {
    margin-right: 8px;
  }
  &__color-picker { 
    margin-right: 12px;
    min-width: 66px;
    height: 32px;
    border: 1px solid #DEE0EA;
    border-radius: 4px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    &-dropdown {
      height: 100%;
      .h3-dropdown__reference {
        height: 100%;
      }
    }
    &-colorbox {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      .bg {
        width: 20px;
        height: 20px;
        border: 1px solid #D1D3E4;
        border-radius: 4px;
        margin: 1px 10px 0 11px;
      }
      .select {
        .report-icon {
          width: 11px !important;
          height: 12px !important;
        }
      }
    }
  }
  .ant-input-number {
    transition: none;
  }
}
</style>
