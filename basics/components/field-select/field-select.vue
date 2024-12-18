<template>
  <div :class="prefixCls">
    <a-select
      :placeholder="placeholder"
      :class="[`${prefixCls}__input`]"
      :value="fieldValue"
      @change="changeField"
    >
      <a-select-option
        v-for="(field) in selectFields"
        :key="field.value"
        :value="field.value"
      > 
        <div class="select-item"> 
          <h3-svg v-if="!field.isComputeField" :name="iconMapping[field.type]" class="default-icon"></h3-svg>
          <h3-svg name="aggregate-function-stoke" class="comfield-icon" v-else-if="field.isAggregate"></h3-svg>
          <h3-svg name="a-formula-stroke1" class="comfield-icon" v-else></h3-svg>
          {{ field.label }}
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Select } from '@h3/antd-vue';
import enumType,{ StringType, DateType, NumberType } from "@h3/report-mobile/basics/enum/aggregate-type";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";

@Component({
  name: 'h3-report-source-field-select',
  components: {
    ASelect: Select,
    ASelectOptGroup: Select.OptGroup,
    ASelectOption: Select.Option,
    H3Svg: Svg
  }
})
export default class DashboardFieldSelect extends Vue {
  @Prop({ default: () => '请选择' }) placeholder!: string;
  @Prop({ default: () => ([]) }) fields!: Array<H3.Report.FieldColumn>;
  // 值
  @Prop({ default: () => ({}) }) value!: H3.Report.FieldColumn;
  @Prop({ default: () => document.body }) getContainer!: () => HTMLDivElement;

  // 图标映射
  iconMapping = {
    string: "field-string-stroke",
    number: "field-number-stroke",
    date: "field-date-stroke"
  };
  prefixCls = 'h3-dashboard-field-select';

  innerValue: H3.Report.FieldColumn = this.value;
  
  /**
   * 获取字段值  组件只有value为undefined才显示提示文本
   */
  get fieldValue() {
    return  this.value.field ? `${this.value.schemaCode}${this.value.field}${this.value.uid}` : undefined;
  }
  
  
  /**
   * 字段类型映射
   */
  get selectFields() {
    return  this.fields.filter(item=> item.field).map((item)=> {
      if (item.options.isComputeField) {
        return {
        value: `${item.schemaCode}${item.field}${item.uid}`,
        label: item.alias ? item.alias : item.name,
        type: item.type,
        isComputeField: item.options.isComputeField,
        isAggregate: item.options.isAggregate
      }
      } else {
        return  {
        value: `${item.schemaCode}${item.field}${item.uid}`,
        label: item.alias ? item.alias : item.name,
        type: item.type
      }
      }
    })
  }
  
  /**
   * 修改字段
   * @param val
   */
  changeField(val: string) {
    const value = this.fields.find((item) => val === `${item.schemaCode}${item.field}${item.uid}`);
    const newField = JSON.parse(JSON.stringify(value));
    this.$emit("changeValue", newField);
  }
}
</script>
<style lang="less">
  .h3-dashboard-field-select{
    width: 100%;
    &__input{
      width: 100%;
    }
   
  } 
  .comfield-icon {
    fill: #2BCC6E !important;
    width: 14px !important;
    height: 14px !important;
    margin-right: 4px;
  }
  .default-icon {
    width: 14px !important;
    height: 14px !important;
    fill: #707481;
    margin-right: 4px;
  }
  .select-item {
    display: flex;
    align-items: center;
  }
</style>
