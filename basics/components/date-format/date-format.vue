<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__format`">
      <div :class="`${prefixCls}__format__view`">
        {{ formatResult }}
      </div>
      <div
        :class="
          `${prefixCls}__format__option ${isCustom ? `${prefixCls}__format__option--disabled` : ''}`
        "
      >
        <div
          :class="`${prefixCls}__format__option--item`"
          v-for="item in dateFormatList"
          :key="item.key"
          @click="selecFormat(item)"
        >
          {{ item.label }}
          <span v-if="item.check" :class="`${prefixCls}__format__option--item-check`">
            <h3-svg name="tick-stroke" w="14" h="14" class="check"></h3-svg>
          </span>
        </div>
      </div>
    </div>
    <div :class="`${prefixCls}__custom`">
      <div :class="`${prefixCls}__custom__check`">
        <a-checkbox :checked="isCustom" @change="onChange">{{ $r_language.config.dateFormat.custom }}</a-checkbox>
      </div>
      <div :class="`${prefixCls}__custom__input`">
        <a-input
          placeholder="YYYY-MM-DD HH:mm"
          :disabled="!isCustom"
          v-model="customFormat"
          @change="onCustomChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { DateFormatType } from "@h3/report-mobile/basics/enum/date-type";
import { dateFormat, convertDate } from "@h3/report-mobile/basics/utils/date";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import { Checkbox, Input } from "@h3/antd-vue";

@Component({
  name: "h3-report-date-format",
  components: {
    ACheckbox: Checkbox,
    AInput: Input,
    H3Svg: Svg
  }
})
export default class DateFormat extends Vue {
  @Prop() value!: H3.Report.DateFormat;
  // @Prop() dateFormat!: H3.Report.DateFormat;

  prefixCls = "h3-report-date-format";

  // 默认自定义格式
  customFormat: string = "YYYY-MM-DD HH:mm";
  // 是否开启自定义配置
  isCustom: boolean = false;
  // 被选中的格式
  selectedFormat: any = null;
  // 被选中的结果
  formatResult: string = dateFormat(new Date(), this.customFormat);

  dateFormatList: Array<any> = [
    {
      key: DateFormatType.Type1,
      value: DateFormatType.Type1,
      label: "2010年5月7日"
    },
    {
      key: DateFormatType.Type2,
      value: DateFormatType.Type2,
      label: "2010年5月"
    },
    {
      key: DateFormatType.Type3,
      value: DateFormatType.Type3,
      label: "5月7日"
    },
    {
      key: DateFormatType.Type4,
      value: DateFormatType.Type4,
      label: "2010/5/7"
    },
    {
      key: DateFormatType.Type5,
      value: DateFormatType.Type5,
      label: "2010/5/7 0:00"
    },
    {
      key: DateFormatType.Type6,
      value: DateFormatType.Type6,
      label: "10/5/7"
    },
    {
      key: DateFormatType.Type7,
      value: DateFormatType.Type7,
      label: "5/7"
    },
    {
      key: DateFormatType.Type8,
      value: DateFormatType.Type8,
      label: "7-May-2010"
    },
    {
      key: DateFormatType.Type9,
      value: DateFormatType.Type9,
      label: "May-2010"
    },
    {
      key: DateFormatType.Type10,
      value: DateFormatType.Type10,
      label: "2016年1月1日 星期五"
    },
     {
      key: DateFormatType.Type11,
      value: DateFormatType.Type11,
      label: "星期五"
    }
  ];

  get result(): H3.Report.DateFormat {
    return {
      formatType: this.selectedFormat ? this.selectedFormat.key : "",
      isCustom: this.isCustom,
      customFormat: this.customFormat
    };
  }

  /**
   * 选择已有的格式
   */
  selecFormat(item) {
    if (this.isCustom) {return;}
    if (this.selectedFormat) {
      this.selectedFormat.check = false;
    }
    this.$set(item, "check", true);
    this.selectedFormat = item;
    this.$emit("input", this.result);
    this.formatResult = convertDate(new Date(), this.result);
  }

  /**
   * 开启其定义格式
   */
  onChange(e) {
    const check = e.target.checked;
    this.isCustom = check;
    if (this.isCustom && this.selectedFormat) {
      this.selectedFormat.check = false;
      this.selectedFormat = null;
      this.formatResult = dateFormat(new Date(), this.customFormat);
    }
    this.$emit("input", this.result);
  }

  /**
   * 自定义格式
   */
  onCustomChange() {
    this.formatResult = dateFormat(new Date(), this.customFormat);
    this.$emit("input", this.result);
  }

  created() {
    if (this.value) {
      // 如果有值的话
      if (this.value.formatType !== "") {
        const item = this.dateFormatList.find((i) => i.key === this.value.formatType);
        this.$set(item, "check", true);
        this.selectedFormat = item;
      }
      this.isCustom = this.value.isCustom;
      this.customFormat = this.value.customFormat;
      this.formatResult = convertDate(new Date(), this.result);
    }
  }
}
</script>

<style lang="less">
.h3-report-date-format__modal {
  .ant-modal-confirm-content {
    height: 323px;
    max-height: 323px !important;
    overflow: hidden;
  }
}
.h3-report-date-format {
  &__format {
    &__view {
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
      border-radius: 4px;
      border: 1px solid #d4d7e0;
      margin-bottom: 8px;
    }
    &__option {
      width: 100%;
      height: 160px;
      padding: 4px 0;
      overflow-y: scroll;
      background: #ffffff;
      border-radius: 4px;
      margin-bottom: 8px;
      border: 1px solid #d4d7e0;
      &--item {
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        &:hover {
          background: #f4f8fc;
        }
        &-check {
          float: right;
          fill: #107fff;
        }
      }

      &--disabled {
        color: #c9ccd8;
        overflow: hidden;
        .h3-report-date-format__format__option {
          &--item:hover {
            background: none;
          }
        }
      }
    }
  }
  &__custom {
    &__check {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
