<template>
  <div :class="prefixCls">
    <a-select
      :class="`${this.prefixCls}__select`"
      :options="formulaList"
      :value="formulaLabel"
      placeholder="请设置过滤条件"
      @change="changeFormula"
    ></a-select>
    <a-select
      v-if="tmpFilter.formula === 'Dynamic'"
      :class="`${this.prefixCls}__select dynamic__select`"
      :options="EqualAndNotList"
      placeholder="请设置条件"
      :value="EqualAndNotValue"
      @change="changeFilterOperation"
    ></a-select>
    <div :class="`${this.prefixCls}__mask`" v-show="prevent"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Select } from "@h3/antd-vue";
import FilterTypes from "@h3/report-mobile/basics/enum/filter-type";

@Component({
  name: "h3-report-filter-formula",
  components: {
    ASelect: Select
  }
})
export default class FilterFormula extends Vue {
  prefixCls = "h3-report-filter-formula";
  @Prop({ default: "" }) status!: "design" | "report" | "preview";
  @Prop({ default: {} }) filter!: H3.Report.FilterFieldColumn;
  // 过滤逻辑集合
  formulaList: Array<string> = [];

  get newFilterTypes() {
    return this.$r_gt(FilterTypes(this.filter.field), this.$r_languageType);
  }
  // EqualAndNotList: Array<any> = [
  //   {
  //     label:'等于1',
  //     value:'',
  //   },
  //   {
  //     label:'不等于',
  //     value:'NotEqual'
  //   }
  // ]
  get EqualAndNotList() {
    return [
      {
        label: this.$r_language.saticOP.FilterType.date.Equal,
        value: "Equal"
      },
      {
        label: this.$r_language.saticOP.FilterType.date.NotEqual,
        value: "NotEqual"
      }
    ];
  }
  EqualAndNotValue: string = "等于";
  // get EqualAndNotValue(){
  //   return this.$r_language.saticOP.FilterType.date.Equal
  // }
  // 过滤逻辑展示值
  formulaLabel: string = "";
  activeType: "date" | "number" | "string" | string = "";
  // 当前弹窗的过滤条件
  tmpFilter: H3.Report.FilterFieldColumn = {};

  get prevent() {
    return this.status === "design";
  }
  @Watch("filter", { immediate: true, deep: true })
  changeFilterPicker(value: H3.Report.FilterFieldColumn, old) {
    this.tmpFilter = Object.assign(this.tmpFilter, value);
    if (value.field) {
      this.activeType = value.field.specialType || value.field.type;
      const formula = this.newFilterTypes[this.activeType].find(
        (item: { label: string; value: string }) => item.value === this.tmpFilter.formula
      );
      this.formulaLabel = formula ? formula.label : this.newFilterTypes[this.activeType][0].label;
      //this.EqualAndNotValue = this.tmpFilter.operation ? '不等于' : '等于';
      this.EqualAndNotValue = this.tmpFilter.operation === "NotEqual"
        ? this.$r_language.saticOP.FilterType.date.NotEqual
        : this.$r_language.saticOP.FilterType.date.Equal;
      // this.formulaLabel =
      //   formula?.label || this.activeType === "address"
      //     ? FilterTypes[this.activeType][0].label
      //     : "";
    } else {
      // 兼容字段被删除后的反显
      for (const i in FilterTypes()) {
        if (
          this.newFilterTypes[i].find(
            (item: { label: string; value: string }) => item.value === this.tmpFilter.formula
          )
        ) {
          this.formulaLabel = this.newFilterTypes[i].find(
            (item: { label: string; value: string }) => item.value === this.tmpFilter.formula
          ).label;
          //this.EqualAndNotValue = this.tmpFilter.operation ? '不等于' : '等于';
          this.EqualAndNotValue = this.tmpFilter.operation === "NotEqual"
            ? this.$r_language.saticOP.FilterType.date.NotEqual
            : this.$r_language.saticOP.FilterType.date.Equal;
          return;
        }
      }
    }
    this.tmpFilter.formula = this.tmpFilter.formula ? this.tmpFilter.formula : "Equal";
  }
  @Watch("activeType", { immediate: true })
  changeFilterType(value: string) {
    this.formulaList = value ? this.newFilterTypes[value] : [];
  }

  /**
   *  公式改变时的处理
   * @param value
   */
  changeFormula(value: string) {
    this.tmpFilter.formula = value;
    this.tmpFilter.text = [""];
    this.tmpFilter.selectDateType = undefined;
    if (this.tmpFilter.formula !== "Dynamic") {
      this.tmpFilter.operation = "";
    } 
    if (this.tmpFilter.formula === "Dynamic") {
      this.tmpFilter.operation = "Equal";
    }
    this.formulaLabel = this.newFilterTypes[this.activeType].find(
      (item: any) => item.value === this.tmpFilter.formula
    ).label;
    if (["None", "NotNone", "In", "NotIn"].includes(value)) {
      this.tmpFilter.text = [];
    }
    if (this.tmpFilter && this.tmpFilter.field && this.tmpFilter.field.type === "date") {
      if (["Equal", "NotEqual","Range","Above","NotBelow","Below","NotAbove"].includes(value) 
          && !this.tmpFilter.field.options.format) {
        this.tmpFilter.field.options.format = "YMD";
      }
    }

    this.$emit("change-filter", this.tmpFilter);
  }

  changeFilterOperation(value) {
    // this.EqualAndNotValue = value ? '不等于' :'等于';
    this.EqualAndNotValue = value === "NotEqual"
      ? this.$r_language.saticOP.FilterType.date.NotEqual
      : this.$r_language.saticOP.FilterType.date.Equal;
    this.tmpFilter.operation = value;
    this.$emit("change-options", {
      operation: value
    });
  }
  created() {
     this.tmpFilter= JSON.parse(JSON.stringify(this.filter));
  }
}
</script>
<style lang="less">
.h3-report-filter-formula {
  position: relative;
  &__select {
    width: 100%;
  }
  &__mask {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .dynamic__select {
    margin-top: 10px;
  }
}
.h3-dashboard-element-wrap__head {
  .dynamic__select {
    margin-left: 10px;
    margin-top: 0;
  }
}
</style>
