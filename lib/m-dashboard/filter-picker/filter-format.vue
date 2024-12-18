<template>
  <div :class="`${prefixCls}`">
    <h3-radio-group v-model="filter.format" layout="vertical" @change="changeFormat">
      <h3-radio
        :key="item.value"
        v-for="item in turnFormatList"
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
import {dateFormatList} from "@h3/report-mobile/basics/enum/filter-type";

const ReportPro = namespace("report");
@Component({
  name: "h3-report-filter-format",
  components: {
    H3Radio,
    H3RadioGroup: H3Radio.Group
  }
})
export default class ReportFilterFormat extends Vue {
  @Prop({ default: {} }) filter!: H3.Report.FilterPicker;
  prefixCls = "h3-report-filter-format";

  get turnFormatList() {
    return this.$r_gt(dateFormatList, this.$r_languageType);
  }
  /**
   *  公式改变时的处理
   * @param value
   */
  changeFormat(value: string) {
    this.filter.format = value;
    this.filter.field.options.format = value;
    if(this.filter.dataSources.length) {
      this.filter.dataSources.forEach(item => {
        if( item.field) {
          item.field.options.format = value;
        }
      });
    } 
    this.filter.text = [];
    this.$emit("change", this.filter);
  }
}
</script>
<style lang="less">
.h3-report-filter-format {
  padding: 0 16px;
}
</style>
