<template>
  <div v-show="!reference" class="h3-dropdown">
    <div 
      ref="reference" 
      class="h3-dropdown__reference" 
      @click="visibleChange"
    ><slot></slot>
    </div>
    <transition
      :name="`h3awesome-transition-drop-${popperDirection}`"
      @before-enter="beforePopperShow"
      @after-enter="afterPopperShow"
      @before-leave="beforePopperHide"
      @after-leave="afterPopperHide"
    >
      <div
        v-show="popperVisible"
        ref="popper"
        :class="`h3-dropdown__popper ${overlayCls}`"
      >
        <div
          v-show="arrow && !arrowNeedHide"
          ref="arrow"
          class="h3-dropdown__arrow"
        ></div>
        <slot name="content">
          <!-- <div class="h3-dropdown__placeholder">
            内容
          </div> -->
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { directive as clickOutside } from 'v-click-outside-x';
import debounce from 'lodash/debounce';
import PopperMixin from '@h3/report-mobile/basics/utils/popper/index.ts';
const FakeElement = typeof Element !== 'undefined' ? Element : Object;

export default {
  name: 'H3Dropdown',
  mixins: [PopperMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    trigger: {
      type: [FakeElement, Function],
    },
    subTrigger: {
      type: [Boolean, Function],
      default: false,
    },
    control: {
      type: Boolean,
      default: false,
    },
    controlCls: {
      type: [String, Array],
    },
    overlayCls: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      innerTrigger: null,
      innerToggleTimer: null,
      captureTimer: null,
      popperHidden: false,
    };
  },
  computed: {
    innerControlCls () {
      return this.controlCls
        ? Array.isArray(this.controlCls)
          ? this.controlCls
          : [this.controlCls]
        : [];
    },
  },
  watch: {
    disabled (nVal) {
      if (!nVal && this.popperVisible) {
        this.popperVisible = false;
      }
    },
    popperVisible (nVal) {
      if (nVal) {
        if (this.referenceElm) {
          this.referenceElm.__CLICK_OUTSIDE_INIT__ = true;
        }
        clickOutside.bind(this.$el, {
          value: this.handleOutsideCaptureClick,
          modifiers: {
            capture: true,
          },
        });
        clickOutside.bind(this.$el, { value: this.handleOutsideClick });

        this.afterShowCallbacks.push(() => {
          if (this.referenceElm) {
            this.referenceElm.__CLICK_OUTSIDE_INIT__ = false;
          }
        });
      } else {
        clickOutside.unbind(this.$el, {
          value: this.handleOutsideCaptureClick,
          modifiers: {
            capture: true,
          },
        });
        clickOutside.unbind(this.$el, {
          value: this.handleOutsideClick,
        });
      }
    },
    trigger (nVal) {
      this.innerTrigger = typeof nVal === 'function' ? nVal() : nVal;
    },
  },
  created () {
    this.forcePopupAlign = debounce(
      (currPlacement) => {
        this.refreshPopper(currPlacement);
      },
      200,
      { leading: false },
    );
  },
  beforeDestroy () {
    clickOutside.unbind(this.$el, {
      value: this.handleOutsideCaptureClick,
      modifiers: {
        capture: true,
      },
    });
    clickOutside.unbind(this.$el, {
      value: this.handleOutsideClick,
    });
  },
  mounted () {
    this.innerTrigger =
      typeof this.trigger === 'function' ? this.trigger() : this.trigger;
  },
  methods: {
    forcePopupAlign () {},
    handleOutsideCaptureClick (evt) {
      // 捕获 stopPropagation 的 click 事件
      if (this.captureTimer) {
        clearTimeout(this.captureTimer);
      }
      this.captureTimer = setTimeout(() => {
        this.handleOutsideClick(evt);
      }, 50);
    },
    handleOutsideClick (evt) {
      clearTimeout(this.captureTimer);
      if (
        this.popperVisible &&
        this.referenceElm &&
        this.referenceElm.__CLICK_OUTSIDE_INIT__
      ) {
        this.referenceElm.__CLICK_OUTSIDE_INIT__ = false;
        return;
      }
      if (
        this.control ||
        this.disabled ||
        !this.popperVisible ||
        !this.popperElm ||
        // 包含 evt.target === this.popperElm
        this.popperElm.contains(evt.target) ||
        this.checkControlCls(evt.target)
      ) {
        return;
      }
      this.popperVisible = false;
    },
    checkControlCls (elem) {
      return this.innerControlCls.some((cls) => {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/closest
        return !!elem.closest(`.${cls}`);
      });
    },
    visibleChange (evt) {
      if (
        this.disabled ||
        (!this.popperVisible && !this.triggerCheck(evt.target))
      ) {
        return;
      }
      this.popperVisible = !this.popperVisible;
    },
    triggerCheck (target) {
      if (!this.innerTrigger) {
        return true;
      }

      if (this.innerTrigger.contains(target)) {
        if (typeof this.subTrigger === 'boolean') {
          return this.subTrigger ? this.innerTrigger !== target : true;
        }
        if (typeof this.subTrigger === 'function') {
          return this.subTrigger(this.innerTrigger, target);
        }
        return true;
      } else {
        return false;
      }
    },
    popperToggle (reference, listeners = {}) {
      const { show, hide } = listeners;
      if (this.popperHidden) {
        return;
      }
      if (!reference) {
        this.popperVisible = false;
        return;
      }
      if (
        this.popperVisible &&
        (!reference || this.referenceElm === reference)
      ) {
        hide && this.afterHideCallbacks.push(hide);
        this.popperVisible = false;
        return;
      }
      if (this.popperVisible) {
        this.popperHidden = true;
        this.popperVisible = false;
        this.afterHideCallbacks.push(() => {
          show && this.beforeShowCallbacks.push(show);
          hide && this.afterHideCallbacks.push(hide);
          this.referenceElm = reference;
          this.popperHidden = false;
          this.popperVisible = true;
        });
      } else {
        show && this.beforeShowCallbacks.push(show);
        hide && this.afterHideCallbacks.push(hide);
        this.referenceElm = reference;
        this.popperVisible = true;
      }
    },
    beforePopperShow () {
      const _beforeShowCallbacks = this.beforeShowCallbacks;
      this.beforeShowCallbacks = [];
      _beforeShowCallbacks.forEach((fn) => {
        fn && fn();
      });
    },
    afterPopperShow () {
      const _afterShowCallbacks = this.afterShowCallbacks;
      this.afterShowCallbacks = [];
      _afterShowCallbacks.forEach((fn) => {
        fn && fn();
      });
    },
    beforePopperHide () {
      const _beforeHideCallbacks = this.beforeHideCallbacks;
      this.beforeHideCallbacks = [];
      _beforeHideCallbacks.forEach((fn) => {
        fn && fn();
      });
    },
    afterPopperHide () {
      const _afterHideCallbacks = this.afterHideCallbacks;
      this.afterHideCallbacks = [];
      _afterHideCallbacks.forEach((fn) => {
        fn && fn();
      });
    },
  },
};
</script>

<style lang="less">
@import './style/index.less';
</style>
