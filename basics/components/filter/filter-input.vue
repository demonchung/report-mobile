<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Select } from "@h3/antd-vue";
import FilterTypes from "@h3/report-mobile/basics/enum/filter-type";
import H3FilterElement from "./filter-element.vue";
import H3FilterFormula from "./filter-formula.vue";

@Component({
  name: "h3-report-filter-input",
  components: {
    ASelect: Select,
    H3FilterFormula,
    H3FilterElement
  }
})
export default class FilterInput extends Vue {
  @Prop({ default: {} }) filter!: H3.Report.FilterFieldColumn;
  @Prop({ default: "" }) format!: string; // 筛选方式
  @Prop({ default: false }) checkEmpty!: boolean; // 检测空值
  @Prop({ default: "" }) status?: "design" | "report" | "preview"; // 状态
  @Prop() global!: H3.Report.Global;
  @Prop({ default: false }) isExternal!: boolean; // 是否能查看所有数据
  @Prop({ default: () => {} }) filterPicker!: H3.Report.FilterPicker;
  @Prop({ default: false }) showFilterFormatSelect!: boolean; // 是否展示筛选方式下拉选择框
  @Prop({ default: false }) modalHideFilterFormatSelect!: boolean; // 弹窗时候选择隐藏 与上面的参数类似，场景不同
  @Prop({ default: '' }) showNotTipComponent!: string; // 是否显示不等于checkbox组件
  @Prop({ default: false }) showTip!: boolean;

  

  prefixCls = "h3-report-filter-input";
  activeType: string = "";
  // 过滤公式集合
  formulaOptions: Array<string> = [];
  formulaLabel: string = "";

  // 当前弹窗的过滤条件
  tmpFilter: H3.Report.FilterFieldColumn = JSON.parse(JSON.stringify(this.filter));
  @Watch("filter", { immediate: true, deep: true })
  changeFilterPicker(value: H3.Report.FilterFieldColumn) {
    this.tmpFilter = Object.assign(this.tmpFilter, value);
    if (value.field) {
      this.activeType = value.field.specialType || value.field.type;
      this.formulaLabel = this.getFormulaLabel(this.tmpFilter.formula, this.activeType);
    } else {
      let typeData = FilterTypes();
      for (const i in typeData) {
        if (
          typeData[i].find(
            (item: { label: string; value: string }) => item.value === this.tmpFilter.formula
          )
        ) {
          this.formulaLabel = typeData[i].find(
            (item: { label: string; value: string }) => item.value === this.tmpFilter.formula
          ).label;
          return;
        }
      }
    }
    this.tmpFilter.formula = this.tmpFilter.formula
      ? this.tmpFilter.formula
      : this.getDefaultFormula(this.activeType);
      this.tmpFilter.operation = this.tmpFilter.operation || '';
  }

  @Watch("activeType", { immediate: true })
  changeFilterType(value: string) {
    this.formulaOptions = value ? FilterTypes(this.tmpFilter.field)[value] : [];
  }
  /**
   *  获取默认值
   * @param type
   */
  getDefaultFormula(type) {
    return type === "address" ? "StartWith" : "Equal";
  }
  /**
   *  获取公式值
   * @param formula
   * @param type
   */
  getFormulaLabel(formula, type) {
    const tmpFormula = FilterTypes(this.tmpFilter.field)[type].find(
      (item: { label: string; value: string }) => item.value === formula
    );
    let formulaLabel = "";
    if(tmpFormula) {
      if (tmpFormula.label || type === "address") {
        formulaLabel = FilterTypes(this.tmpFilter.field)[type][0].label || "";
      }
    } else {
      formulaLabel = FilterTypes(this.tmpFilter.field)[type][0].label || "";
    }
   
    return formulaLabel;
  }
  /**
   *  更改筛选逻辑
   * @param filter
   */
  changeFilter(filter: H3.Report.FilterFieldColumn) {
    this.tmpFilter = filter;
    this.$emit("change-filter", this.tmpFilter);
  }
  /**
   *  更改筛选条件
   * @param value 值
   */
  valueChange(value: Array<any>) {
    this.tmpFilter.text = value;
    this.$emit("change-filter", this.tmpFilter);
  }
  setFilterOptions(data){
    Object.keys(data || {}).forEach((key)=>{
      this.$set(this.tmpFilter, key, data[key]);
    })
  }
  render(h: CreateElement) {
    const Formula = h(H3FilterFormula, {
      class: `${this.prefixCls}__formula`,
      props: {
        filter: this.tmpFilter
      },
      on: {
        "change-filter": this.changeFilter,
        'change-options':(data) => {
          this.$emit('change-options', data)
        }
      },
    });
    const chartId = this.filterPicker ? this.filterPicker.uid : null;
    const filterElement = h(H3FilterElement, {
      props: {
        filter: this.tmpFilter,
        format: this.format,
        status: this.status,
        isExternal: this.isExternal,
        chartId: chartId,
        showFilterFormatSelect: this.modalHideFilterFormatSelect ? false : true,
        showNotTipComponent: this.showNotTipComponent || 'show',
        showTip: this.showTip,
      },
      on: {
        "change-value": this.valueChange,
        'change-format':(value)=>{
          this.$emit('change-format',value)
        },
        'change-options':(data) => {
          this.setFilterOptions(data);
          this.$emit('change-options', data)
        }
      }
    });
    return h(
      "div",
      {
        class: this.prefixCls
      },
      [Formula, filterElement]
    );
  }
}
</script>
<style lang="less">
.h3-report-filter-input {
  &__formula {
    width: 100%;
    margin-top: 10px;
  }
}
.filterPicker {
  .h3-report-filter-input {
    padding: 3px 15px 0;
  }
}
</style>
