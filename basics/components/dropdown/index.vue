<template>
  <div
    v-click-outside:mousedown.capture="handleOutsideClick"
    v-click-outside:touchstart.capture="handleOutsideClick"
    v-click-outside.capture="handleOutsideClick"
    :class="prefixCls"
    :style="prefixStyle"
    class="h3-dropdown"
    @click.capture="clickButton"
  >
    <span
      :class="[
        'h3-dropdown__select-suffix',
        {
          'h3-dropdown__select-suffix--up': !suffixIcon && showPane && handleShow
        }
      ]"
    >
      <em
        v-if="suffixIcon"
        ref="suffix"
        :class="`report-icon ${suffixIcon} `"
        :style="`color: ${suffixColor}`"
        @click.stop="onClickSuffix"
      ></em>
      <a-icon
        v-else
        type="down"
        class="h3-dropdown__arrow"
      />
    </span>
    <a-select
      ref="dropdown"
      v-model="selectedData"
      :mode="mode"
      :showArrow="false"
      :placeholder="$r_language.Analysis.design.select_pla"
      :style="selectStyle"
      :allowClear="allowClear"
      style="width:100%"
      class="h3-dropdown__select"
      dropdownClassName="h3-dropdown--select-dropdown"
      @deselect="deselect"
      @search="searchChange"
      @change="change"
    >
      <!-- @visibleChange="visibleChange" -->
      <a-select-option v-for="i in value" :key="i[propLabel.key] || i">
        {{ i[propLabel.name] || i }}
      </a-select-option>
    </a-select>
    <transition name="h3-report-dropdown">
      <div
        v-show="showPane && handleShow"
        ref="contentPane"
        :style="{ width: width }"
        class="h3-dropdown-content"
      >
        <div v-if="showSearch" class="h3-dropdown-content-search">
          <a-input
            v-model="searchKey"
            :placeholder="$r_language.Analysis.design.input"
            @change="searchChange($event.target.value)"
          >
            <a-icon slot="prefix" type="search"/>
            <a-icon
              v-show="searchKey !== ''"
              slot="suffix"
              type="close-circle"
              @click="clearSearchKey"
            />
          </a-input>
        </div>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins, Provide, Vue } from "vue-property-decorator";
import { Select, Checkbox, Icon, Input } from "@h3/antd-vue";
import { directive as ClickOutside } from "v-click-outside-x";
import debounce from "lodash/debounce";
import Popper from "./vue-popper";
// todo

@Component({
  name: "H3Dropdown",
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    ACheckbox: Checkbox,
    AInput: Input,
    AIcon: Icon
  },
  directives: {
    ClickOutside
  }
})
export default class H3Dropdown extends Mixins(Popper) {
  @Provide("dropdownParent")
  dropdownParent = this;

  // prop接口
  @Prop() prefixCls!: string;

  @Prop() prefixStyle!: string;

  @Prop() selectStyle!: any;

  // 是否支持清除功能
  @Prop({
    default: true
  })
  allowClear!: boolean;
  // 是否支持清除功能
  @Prop({
    default: false
  })
  isDelay!: boolean;
  // 下拉框得模式
  @Prop({
    type: String,
    default: "multiple"
  })
  mode!: string;

  // 下拉框placehokder
  @Prop({
    default: "请选择"
  })
  selectPlaceholder!: string;
  // 下拉框值
  @Prop({
    default: () => []
  })
  value!: any[];

  // 下拉框suffixIcon 仅在mode是default模式下生效
  @Prop({})
  suffixIcon!: string;
 // 点击下拉节流的时间
 @Prop({
   default: 300
 })
  delay?: number;
  // 下拉框suffixIcon颜色
  @Prop({
    default: "#C9CCD8"
  })
  suffixColor!: string;

  // 是否显示搜索框
  @Prop({
    type: Boolean,
    default: true
  })
  showSearch!: boolean;

  // // 是否显示搜索框
  // @Prop({
  //   type: Boolean,
  //   default: true,
  // })
  // showArrow!: boolean;

  // 搜索框placehokder
  @Prop({
    default: "请输入"
  })
  searchPlaceholder!: string;

  // 手动触发下拉框关闭
  @Prop({
    type: Boolean,
    default: true
  })
  handleShow!: boolean;

  // // 下拉面板得宽度
  // @Prop({
  //   type: String,
  //   default: '100%',
  // })
  // dropdownWidth!: string;

  // 数据使用的字段
  @Prop({
    type: Object,
    default: () => {
      return {
        value: "value",
        key: "key",
        name: "name"
      };
    }
  })
  propLabel: any;

  // 搜索键值
  searchKey: string = "";

  width: string = "auto";

  $refs!: {
    contentPane: HTMLElement;
    dropdown: Vue;
    suffix: Vue;
  };
  timer: any = null; 

  showPane: boolean = false;

  get selectedData(): any {
    return this.value.map(i => (this.propLabel.key ? i[this.propLabel.key] : i));
  }

  set selectedData(val: any) {
    // this.$emit('change', val);
  }

  get debounceUpdatePopper() {
    return debounce(
      () => {
        this.updatePopper();
      },
      300,
      { leading: false }
    );
  }

  @Watch("value")
  resisePane() {
    this.showPane && this.mode === "multiple" && this.debounceUpdatePopper();
  }

  @Watch("showPane")
  showPaneHandler(val: boolean, oldVal: boolean) {
    if (val) {
      this.$emit("showPane"); // 具体是否有使用待校验
    } else {
      this.searchKey = "";
    }
    if (val !== oldVal) {
      this.width = this.$refs.dropdown.$el.getBoundingClientRect().width + "px";
    }
    this.showPopper = val;
    this.$emit(this.showPane ? "onShow" : "onHide");
  }

  mounted() {
    this.popperElm = this.$refs.contentPane;
    this.referenceElm = this.$refs.dropdown.$el;
  }

  handleOutsideClick(e) {
    if (e.target === this.popperElm || this.popperElm.contains(e.target)) {
      return;
    }
    this.showPane = false;
  }

  // throttle(fn,delay = 1000) {
  //   let timer: any =null;
  //   return function() {
  //     if(timer) return 
  //     timer = setTimeout(()=> {
  //       fn.apply(this,arguments);
  //       timer = null
  //     },delay)
  //   }
  // }
  clickButton(e) {
    if (this.isDelay) {
      if (this.timer) {return;}
      this.timer = setTimeout(() => {
        this.timer = null;
        this.visibleChange(e);
      }, this.delay);
    } else {
      this.visibleChange(e);
    }
  }
  /**
   * 选择框聚焦事件
   */
  visibleChange(e) {
    // span.ant-select-selection__choice__remove > i > svg > path
    const tagCloseCls = "ant-select-selection__choice__remove";
    function checkTagClick(target, limit) {
      const result = target ? target.classList.contains(tagCloseCls) : false;
      return !result && target && limit > 0 ? checkTagClick(target.parentNode, limit - 1) : result;
    }
    if (
      e &&
      (e.target === this.$refs.suffix ||
        (["span", "i", "svg", "path"].includes((e.target.tagName || "").toLowerCase()) &&
          checkTagClick(e.target, 3)))
    ) {
      return;
    }
    this.showPane = !this.showPane;
  }

  /**
   * 搜索框变化事件
   */
  searchChange(val: string) {
    this.searchKey = val;
    this.$nextTick(() => {
      this.$emit("onSearch", this.searchKey);
    });
  }

  /**
   * change
   */
  change(value) {
    this.$emit("change", value);
    this.showPane && this.mode === "multiple" && this.debounceUpdatePopper();
  }

  deselect(value) {
    this.$emit("deselect", value);
    this.showPane && this.mode === "multiple" && this.debounceUpdatePopper();
  }

  clearSearchKey() {
    this.searchKey = "";
    this.$emit("onSearch", "");
  }

  onClickSuffix() {
    this.showPane = false;
    this.$emit("onClickSuffix");
  }
}
</script>

<style lang="less">
@import "./style/index.less";
</style>
