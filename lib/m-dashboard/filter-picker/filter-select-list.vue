<template>
  <div :class="`${prefixCls}`">
    <h3-radio-group v-model="selectDateType" layout="vertical" @change="changeSelectType">
      <h3-radio
        :key="item.value"
        v-for="item in selectList"
        :value="item.value"
        :label="item.label"
      />
    </h3-radio-group>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { H3Radio } from "@h3/thinking-ui";
import FilterTypes, { DateType } from "@h3/report-mobile/basics/enum/filter-type";
import { dateSelectList } from "@h3/report-mobile/basics/utils/dateMap";
const ReportPro = namespace("report");
@Component({
  name: "h3-report-filter-select-list",
  components: {
    H3Radio,
    H3RadioGroup: H3Radio.Group
  }
})
export default class ReportFilterFormula extends Vue {
  @Prop({ default: {} }) filter!: H3.Report.FilterPicker;
  prefixCls = "h3-report-filter-formula";
  selectDateType: string = "Custom";
  get selectList() {
    //return dateSelectList;
    return this.$r_gt(dateSelectList, this.$r_languageType);
  }
  @Watch("filter.selectDateType", { deep: true, immediate: true })
  changeSelectDateType(val) {
    if (!val) {
      this.selectDateType = "Custom";
    } else {
      this.selectDateType = val;
    }
  }
  /**
   *  公式改变时的处理
   * @param value
   */
  changeSelectType(value: string) {
    if (
      this.filter.field.type === "date" &&
      this.filter.formula === DateType.Dynamic &&
      value !== "Custom"
    ) {
      this.filter.selectDateType = value;
    } else {
      this.filter.selectDateType = "";
    }
    if (value !== "Custom" && value) {
      this.filter.text = JSON.parse(value);
    }
    this.$emit("change", this.filter);
    console.log(11,this.filter)
  }
}
</script>
<style lang="less">
.h3-report-filter-formula {
  padding: 0 16px;
}
</style>
