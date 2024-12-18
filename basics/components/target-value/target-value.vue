<template>
  <div :class="prefixCls">
    <div>
      <label :class="`${prefixCls}__label`">{{ $r_language.config.TargetValue.typeTitle }}</label>
      <a-radio-group
        buttonStyle="solid"
        v-model="activeType"
        :options="typeOptions"
      >
      </a-radio-group>
    </div>
    <!-- 固定值 -->
    <div v-if="activeType === 'fixed'">
      <label :class="`${prefixCls}__label`">{{ $r_language.config.TargetValue.labal_fixed }}</label>
      <a-input-number :value="constValue" @blur="onConstChange" @change="changeNumber"></a-input-number>
    </div>
    <!-- 计算值 -->
    <div v-else>
      <label :class="`${prefixCls}__label`">{{ $r_language.config.TargetValue.innerFieldTitle }}</label>
      <a-select
        placeholder="请选择字段"
        v-model="innerField"
        @change="setField"
      >
        <a-select-opt-group v-for="(schema, index) in fields" :key="schema.parentSchemaCode + index">
          <span slot="label" style="font-size: 14px;">{{ schema.tableName }}</span>
          <a-select-option
            v-for="(field, i) in schema.children"
            :key="`${field.field}__${field.schemaCode}__${field.mainField}`"
            :value="`${field.field}__${field.schemaCode}__${field.mainField}`"
          >
            <div style="display:flex; align-items:center"> 
              <h3-svg 
                :name="fieldIconMapping[field.type]" 
                :key="`${field.field}__${field.schemaCode}__${field.mainField}`"
                w="14"
                h="14"
                color="#707481"
                :class="`${prefixCls}__field-icon`"
              ></h3-svg>
              {{ field.name }}
            </div>
          </a-select-option>
        </a-select-opt-group>
        <a-select-opt-group v-if="computeFields">
          <span slot="label" style="font-size: 14px;">计算字段</span>
          <a-select-option
            v-for="(field, i) in computeFields"
            :key="`${field.field}__${field.schemaCode}__${field.mainField}`"
            :value="`${field.field}__${field.schemaCode}__${field.mainField}`"
          >
            <h3-svg name="a-formula-stroke1" :class="`${prefixCls}__formulaIcon`"></h3-svg>
            {{ field.name }}
          </a-select-option>
        </a-select-opt-group>
      </a-select>

      <label :class="`${prefixCls}__label`">{{ $r_language.config.TargetValue.aggTypeTitle }}</label>
      <a-select
        v-model="aggregateType"
        :options="option"
        @change="onChange"
      ></a-select>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Radio, InputNumber, Select } from "@h3/antd-vue";
import aggregateTypes from "@h3/report-mobile/basics/enum/aggregate-type";
import { uuid } from "../../utils/uid";
import unifiedField from "@h3/report-mobile/basics/utils/unifiedField";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
@Component({
  name: "h3-report-target-value",
  components: {
    ARadioGroup: Radio.Group,
    AInputNumber: InputNumber,
    ASelect: Select,
    ASelectOption: Select.Option,
    ASelectOptGroup: Select.OptGroup,
    H3Svg: Svg
  }
})
export default class H3TargetValue extends Vue {
  @Prop({ default: () => {} }) targetOptions!: H3.Report.TargetValue;

  @Prop() dataSource!: H3.Report.DataSource;
  @Prop() formulas!: any;

  prefixCls = "h3-report-target-value";
  // 设定方式
  activeType: any = "fixed";

  get option(){
    return this.$r_gt(this.aggregateTypes,this.$r_languageType)
  }
  get typeOptions() {
    return [
    {
      label: this.$r_language.config.TargetValue.labal_fixed,
      value: "fixed"
    },
    {
      label: this.$r_language.config.TargetValue.labal_dynamic,
      value: "dynamic"
    }
  ]
  }
  // 字段Icon映射
  fieldIconMapping: { [key: string]: string } = {
    string: "field-string-stroke",
    date: "field-date-stroke",
    number: "field-number-stroke"
  };
  // 固定值数值
  constValue: number | null = null;

  // 字段列表
  fields: {
    [key: string]: {
      tableName: string;
      open?: boolean;
      parentSchemaCode: string;
      relation: boolean;
      children: Array<H3.Report.FieldColumn>;
    };
  } = {};
  innerField: string = "";
  // 选中的字段
  field: H3.Report.FieldColumn | null = null;
  // 统计方式选项
  aggregateTypes: Array<any> = [];
  // 统计方式
  aggregateType: string | undefined = "";

  /**
   * 监听默认初始化配置变化
   */
  @Watch("targetOptions", { deep: true })
  onOptionsChange() {
    this.initSettings();
  }

  initSettings() {
    if (!this.targetOptions) {
      return;
    }
    this.activeType = this.targetOptions.valueType;
    if (this.targetOptions.valueType === "fixed") {
      this.constValue = this.targetOptions.constValue || null;
      this.field = null;
      this.aggregateType = "";
    } else {
      this.constValue = null;
      if (this.targetOptions.field) {
        this.field = this.targetOptions.field;
        this.aggregateType = this.targetOptions.field.options.aggregateType;
        this.innerField = this.field.field + "__" + this.field.schemaCode +"__"+ this.field.mainField;
        this.setAggregateOptions();
      } else {
        this.field = null;
        this.aggregateType = "";
        this.innerField = "";
        this.aggregateTypes = [];
      }
    }
  }

  get computeFields() {
    const computeArr: any = [];
    if (this.formulas && this.formulas.length) {
      this.formulas.forEach(formula => {
        if (!formula.aggregate) {
          const changefield = unifiedField(formula);
          computeArr.push(changefield);
        }
      });
    }
    return computeArr;
  }
  /**
   * 改变数字
   */
  changeNumber(val) {
    this.constValue = val;
  }
  /**
   *
   */
  setAggregateOptions() {
    if (this.field) {
      if (this.field.type === "date") {
        this.aggregateTypes = aggregateTypes["string"];
      } else {
        this.aggregateTypes = aggregateTypes[this.field.type];
      }
    }
  }

  /**
   * 选中字段
   * @param payload 选中的字段信息 field+schemaCode+mainfield
   */
  setField(payload: string) {
    const str = payload.split("__");
    if (str[1] === "" && str[2] === "") {
      this.field = this.computeFields.find(
        item => item.field === str[0] ) || null;
    } else {
      this.field =
      this.dataSource.properties.find(
        item => item.field === str[0] && item.schemaCode === str[1]
      ) || null;
    }
    this.aggregateType = "";
    if (this.field && this.field.type) {
      this.innerField = payload;
      this.setAggregateOptions();
      this.aggregateType = this.aggregateTypes[0].value;
      this.onChange();
    } else {
      this.aggregateTypes = [];
    }
  }

  /**
   * 固定值设定
   */
  onConstChange(e) {
    this.constValue = e.target.value;
    this.onChange();
  }

  /**
   * 设置变化时，向外传参
   */
  onChange() {
    const settings: H3.Report.TargetValue = {
      valueType: this.activeType
    };
    if (this.activeType === "fixed") {
      settings.constValue = this.constValue;
    } else if (this.field && this.aggregateType) {
      settings.field = JSON.parse(JSON.stringify(this.field)) as H3.Report.FieldColumn;
      settings.field.uid = uuid(8, 16);
      settings.field.options.aggregateType = this.aggregateType;
    } else {
      console.log("config not complete.");
      return;
    }
    this.$emit("set-target", settings);
  }

  getDataSource() {
    if (this.dataSource.dataSourceId) {
      this.fields = this.dataSourceFilter(this.dataSource);
    } else {
      this.fields = {};
    }
  }

  /**
   * 数据源数据转换
   */
  dataSourceFilter(dataSource) {
    const fields: {
      [key: string]: {
        tableName: string;
        open?: boolean;
        parentSchemaCode: string;
        relation: boolean;
        children: Array<H3.Report.FieldColumn>;
      };
    } = {};
    dataSource.properties.forEach((field: H3.Report.FieldColumn) => {
      if (field.visible && field.type !== "other") {
        if (!fields[field.schemaCode])
          {fields[field.schemaCode] = Object.assign(
            {},
            {
              tableName: field.tableName,
              parentSchemaCode: field.parentSchemaCode || "",
              open: true,
              relation: field.relation,
              children: []
            }
          );}
        fields[field.schemaCode].children.push(field);
      }
    });
    return fields;
  }

  mounted() {
    this.initSettings();
    this.getDataSource();
  }
}
</script>
<style lang="less" scoped>
.h3-report-target-value {
  font-size: 13px;
  color: #121933;
  &__label {
    display: block;
    margin-top: 20px;
    margin-bottom: 4px;
    color: #707481;
  }
  &__field-icon {
    margin-right: 4px;
  }
  /deep/.ant-select,
  /deep/.ant-input-number {
    width: 100%;
  }
  &__formulaIcon {
    fill: #2BCC6E;
    width: 14px !important;
    height: 14px !important;
  }
}
</style>
<style lang="less">
.h3-report-target-value__modal {
  .ant-modal-confirm-title {
    border-bottom: 0 none;
  }
  .ant-modal-confirm-content {
    max-height: 368px !important;
  }
}
</style>
