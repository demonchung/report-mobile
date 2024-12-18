<template>
  <h3-accordion :class="prefixCls">
    <h3-accordion-item v-for="(item, index) in filters" :key="index" position="right" icon="right">
      <div slot="title" :class="`${prefixCls}__title-wrap`">
        <span :class="`${prefixCls}__title`"> {{ item.title }} </span>
        <span :class="`${prefixCls}__tip`"> {{ isSetFilter(item) }} </span>
      </div>
      <h3-accordion>
        <h3-accordion-item position="right" icon="right">
          <div slot="title" :class="`${prefixCls}__title-wrap`">
            <span> 筛选逻辑 </span>
            <span :class="`${prefixCls}__tip`"> {{ getFormulaLabel(item) }} </span>
          </div>
          <div :class="`${prefixCls}__item`">
            <filter-formula :filter="item" @change="changeFilter"> </filter-formula>
          </div>
        </h3-accordion-item>

        <!-- 等于不等于 -->
        <h3-accordion-item position="right" icon="right" v-if="item.formula === 'Dynamic'">
          <div slot="title" :class="`${prefixCls}__title-wrap`">
            <span> </span>
            <span :class="`${prefixCls}__tip`"> {{ getOperationLabel(item) }} </span>
          </div>
          <div :class="`${prefixCls}__item`">
            <filter-operation :filter="item" @change="changeFilter"> </filter-operation>
          </div>
        </h3-accordion-item>
        <!-- // 动态筛选快捷条件：昨天，今天，自定义... -->
        <h3-accordion-item position="right" icon="right" v-if="item.formula === 'Dynamic'">
          <div slot="title" :class="`${prefixCls}__title-wrap`">
            <span> 筛选条件 </span>
            <span :class="`${prefixCls}__tip`"> {{ getSelectDateTypeLabel(item) }} </span>
          </div>
          <div :class="`${prefixCls}__item`">
            <filter-select-list :filter="item" @change="changeFilter"> </filter-select-list>
          </div>
        </h3-accordion-item>
        <!-- //动态筛选自定义值 -->
        <h3-accordion-item
          v-if="
            item.formula === 'Dynamic' && (!item.selectDateType || item.selectDateType === 'Custom')
          "
          position="right"
          icon="right"
        >
          <div slot="title" :class="`${prefixCls}__title-wrap`">
            <span> </span>
            <span :class="`${prefixCls}__tip`"> {{ isSetFilterText(item) }} </span>
          </div>
          <div :class="`${prefixCls}__item`">
            <filter-element
              :filter="item"
              @change="changeFilter"
              @change-options="changeFilterOptions($event, index)"
            >
            </filter-element>
          </div>
        </h3-accordion-item>
        <h3-accordion-item
          v-if= "showFormat(item)"
          position="right"
          icon="right"
        >
          <div slot="title" :class="`${prefixCls}__title-wrap`">
            <span> 日期格式 </span>
            <span :class="`${prefixCls}__tip`"> {{ getFormatLabel(item) }} </span>
          </div>
          <div :class="`${prefixCls}__item`">
            <filter-format
              :filter="item"
              @change="changeFilter"
            >
            </filter-format>
          </div>
        </h3-accordion-item>
        <h3-accordion-item
          v-if="item.formula !== 'Dynamic' && !['None', 'NotNone'].includes(item.formula)"
          position="right"
          icon="right"
        >
          <div slot="title" :class="`${prefixCls}__title-wrap`">
            <span> 筛选条件 </span>
            <span :class="`${prefixCls}__tip`"> {{ isSetFilterText(item) }} </span>
          </div>
          <div :class="`${prefixCls}__item`">
            <filter-element
              :filter="item"
              @change="changeFilter"
              @change-options="changeFilterOptions($event, index)"
            >
            </filter-element>
          </div>
        </h3-accordion-item>
      </h3-accordion>
    </h3-accordion-item>
  </h3-accordion>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { H3Accordion } from "@h3/thinking-ui";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import FilterTypes, {dateFormatList} from "@h3/report-mobile/basics/enum/filter-type";
import FilterFormula from "./filter-formula.vue";
import FilterElement from "./filter-element.vue";
import FilterOperation from "./filter-operation.vue";
import FilterSelectList from "./filter-select-list.vue";
import FilterFormat from "./filter-format.vue"
import { dateSelectList } from "@h3/report-mobile/basics/utils/dateMap";

const ReportPro = namespace("report");
@Component({
  name: "h3-report-filter-wrap",
  components: {
    H3Accordion,
    H3AccordionItem: H3Accordion.Item,
    FilterFormula,
    FilterElement,
    FilterOperation,
    FilterSelectList,
    FilterFormat
  }
})
export default class ReportFilterWrap extends Vue {
  @Prop({ default: () => false }) value!: boolean;
  @Prop({ default: () => [] }) filters!: Array<H3.Report.FilterPicker>;
  prefixCls: string = "h3-report-mobile-filter-wrap";

  isSetFilter(filter: H3.Report.FilterPicker) {
    if (filter.formula === "Dynamic") {
      return filter.text[0] || filter.text[1] ? "已设置" : "";
    }
    if (
      filter.formula &&
      (["None", "NotNone"].includes(filter.formula) ||
        (filter.formula === "Range" && filter.text[0] && filter.text[1]) ||
        (filter.formula !== "Range" && filter.text[0]))
    ) {
      return "已设置";
    }
    return "";
  }

  isSetFilterText(filter: H3.Report.FilterPicker) {
    return (filter.formula === "Range" && filter.text[0] && filter.text[1]) ||
      (filter.formula !== "Range" && filter.text[0])
      ? "已设置"
      : "";
  }
  showFormat(item) {
    if (
      item.field.type === "date" &&
      item.formula !== "Dynamic" &&
      !["None", "NotNone"].includes(item.formula)
    ) {
      return true;
    } else {return false;}
  }

  /**
   *  获取公式显示字段
   *  @filter
   */
  getFormulaLabel(filter: H3.Report.FilterPicker) {
    let filterTypes: any;
    filterTypes = FilterTypes(filter.field)[
      filter.field.specialType ? filter.field.specialType : filter.field.type
    ].find((item: { label: string; value: string }) => item.value === filter.formula).label;
    return this.$r_gt(filterTypes, this.$r_languageType);
  }
  //获取日期格式显示字段
  getFormatLabel(filter: H3.Report.FilterPicker) {
    const format = filter.field.options.format;
    const formatType = dateFormatList.find((item) => item.value === format);
    if (formatType) {
      return this.$r_gt(formatType.label, this.$r_languageType);
    } else {return "";}
  }

  getOperationLabel(filter) {
    if (filter.operation === "NotEqual") {return "不等于";}
    return "等于";
  }

  getSelectDateTypeLabel(filter) {
    const selectDateType = filter.selectDateType;
    console.log(111, selectDateType);
    if (!selectDateType) {return "自定义";}
    const metch = dateSelectList.find((el) => el.value == selectDateType);
    if (metch) {
      return this.$r_gt(metch.label, this.$r_languageType);
    }
    return "1";
  }

  /**
   *  更改筛选
   *  @filter
   */
  changeFilter(filter: H3.Report.FilterPicker) {
    const index = this.filters.findIndex((item: H3.Report.FilterPicker) => {
      return item.uid === filter.uid;
    });
    if (index || index === 0) {
      this.$set(this.filters, index, filter);
      this.$emit("change", this.filters);
    }
  }
  //改变filter 属性
  changeFilterOptions(data, index) {
    Object.keys(data || {}).forEach(key => {
      this.$set(this.filters[index], key, data[key]);
    });
  }
  created() {}
  destroyed() {}
}
</script>
<style lang="less">
.h3-report-mobile-filter-wrap {
  &__title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title {
    max-width: 80%;
    overflow: hidden;
  }
  &__tip {
    color: #107fff;
    font-size: 12px;
  }
  &__item {
    background: rgba(245, 247, 249, 1);
  }
  .h3think-accordion {
    .h3think-accordion-item__header {
      margin-left: 16px;
    }
  }
}
</style>
