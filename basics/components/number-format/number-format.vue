<template>
  <div :class="prefixCls">
    <div class="format-items-wrap">
      <div class="format-item">
        <a-checkbox @change="onCheck(0)" :checked="checked[0]">{{ $r_language.config.NumberFormat.check_comma }}</a-checkbox>
      </div>
      <div class="format-item">
        <a-checkbox @change="onCheck(1)" :checked="checked[1]">{{ $r_language.config.NumberFormat.check_percent }}</a-checkbox>
      </div>
      <div class="format-item">
        <a-checkbox @change="onCheck(2)" :checked="checked[2]">{{ $r_language.config.NumberFormat.check_fraction }}</a-checkbox>
        <a-input-number
          v-if="checked[2]"
          ref="numberIpt"
          style="width: 73px;"
          :placeholder="$r_language.config.NumberFormat.fraInput_pla"
          v-model="bit"
          :min="bitMin"
          :max="bitMax"
          @change="onBitChange"
        />
      </div>
    </div>
    <div class="format-sample">{{ sample }}</div>
  </div>
</template>

<script lang="ts">
import { commaFormat } from "@h3/report-mobile/basics/utils/number";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { Tooltip, Popconfirm, Modal, Checkbox, InputNumber } from "@h3/antd-vue";
Vue.use(Modal);

const ReportPro = namespace("report");
@Component({
  name: "h3-report-number-format",
  components: {
    ATooltip: Tooltip,
    APopconfirm: Popconfirm,
    AModal: Modal,
    ACheckbox: Checkbox,
    AInputNumber: InputNumber
  }
})
export default class NumberFormat extends Vue {
  @Prop() value!: string | number;
  @Prop() numberFormat!: H3.Report.NumberFormat;

  prefixCls = "h3-report-number-format";
  show: boolean = false;
  checked: boolean[] = [false, false, false];
  bit: any = 0; // 位数
  bitMin: number = 0; // 最小位数
  bitMax: number = 6; // 最大位数

  created() {
    if (this.numberFormat) {
      this.checked[0] = this.numberFormat.comma || false;
      this.checked[1] = this.numberFormat.percent || false;
      this.checked[2] = !!(this.numberFormat.fraction === 0 || this.numberFormat.fraction);
      this.bit = this.numberFormat.fraction || 0;
    }
  }

  get sample() {
    let number: number = parseFloat(this.value as any);
    let res: string = String(number);
    
    // 百分号时，按照百分比个数*100%
    if (this.checked[1]) {
      number = number * 100;
    }
    // 小数位
    if (this.checked[2]) {
      res = number.toFixed(this.getRestrictBit());
    } else {
      res = number.toFixed(this.bit);
    }
    // 千分符
    if (this.checked[0]) {
      res = commaFormat(res);
    }
    // 百分号
    if (this.checked[1]) {
      res += "%";
    }

    const format: any = {
      comma: this.checked[0],
      percent: this.checked[1],
      fraction: this.checked[2] ? this.bit : false
    };

    this.$emit("set-format", format);
    this.$emit("set-example", res);
    return res;
  }

  onCheck(i) {
    this.$set(this.checked, i, !this.checked[i]);
    this.$nextTick(() => {
      if (i === 2) {
        if (this.checked[2]) {
          (this.$refs.numberIpt as any).focus();
        } else {
          this.bit = 0;
        }
      }
    });
  }

  onBitChange(val) {
    this.bit = this.getRestrictBit();
  }

  getRestrictBit() {
    const bit = parseInt(this.bit as any, 10);
    if (isNaN(bit)) {
      return 0;
    }
    return bit > 6 ? 6 : bit < 0 ? 0 : bit;
  }
  //获取最终需要的数据
  getResultData(){
    return {
      comma: this.checked[0],
      percent:this.checked[1],
      fraction: this.checked[2] ? this.bit: this.checked[2]
    }
  }
}
</script>

<style lang="less">
.h3-report-number-format {
  .format-items-wrap {
    height: 34px;
    line-height: 34px;
    margin-bottom: 20px;

    .format-item {
      margin-right: 20px;
      display: inline-block;
    }
  }

  .format-sample {
    text-align: center;
    height: 50px;
    padding-bottom: 20px;
    color: #304265;
    font-size: 20px;
  }
}

/**兼容氚云**/
.h3-report-number-format__modal {
  &.h3-report-confirm__modal {
    .ant-modal-body {
      padding: 0 !important;
      .ant-modal-confirm-body-wrapper {
        .ant-modal-confirm-btns {
          padding: 10px 16px;
          line-height: 0;
        }
      }
    }

    label {
      font-weight: normal;
    }
  }
}
</style>
