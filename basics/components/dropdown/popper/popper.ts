import Vue from "vue";
import { createPopper, Instance, OptionsGeneric, Modifier } from "@popperjs/core";
import { resetTransformOrigin, sameWidth, setZIndex } from "./modifiers";
const popper = Vue.extend({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      validator: value => /^(auto|top|bottom|left|right)(-start|-end)?$/g.test(value),
      default: "bottom-start"
    },
    transformOrigin: {
      type: [String, Boolean],
      default: true
    },
    strategy: {
      type: String,
      validator: value => ["absolute", "fixed"].includes(value),
      default: "absolute"
    },
    modifiers: {
      type: Array,
      default() {
        return [];
      }
      // default: () => [],
    },
    sameWidth: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    getParentContainer: Function,
    getBoundaryContainer: Function,
    reference: Object,
    popper: Object
  },
  data() {
    return {
      popperVisible: false,
      popperInstance: null,
      currentPlacement: "",
      referenceElm: null,
      popperElm: null,
      destroyTimer: null
    };
  },
  computed: {
    innerModifiers() {
      const boundary = this.getBoundaryContainer ? this.getBoundaryContainer() : "clippingParents";
      return [
        {
          name: "computeStyles",
          options: {
            gpuAcceleration: false
          }
        },
        {
          name: "preventOverflow",
          options: {
            padding: 10,
            boundary
          }
        },
        {
          name: "flip",
          options: {
            padding: 10,
            boundary
          }
        },
        resetTransformOrigin,
        {
          name: "resetTransformOrigin",
          options: {
            transformOrigin: this.transformOrigin
          }
        },
        ...(this.sameWidth ? [sameWidth] : []),
        setZIndex,
        ...this.modifiers
      ];
    }
  },
  watch: {
    visible(nVal: boolean) {
      this.popperVisible = nVal;
    },
    popperVisible(nVal: boolean) {
      this.$emit("toggle", nVal);
      if (nVal) {
        this.showPopper();
        this.$emit("show");
      } else {
        this.hidePopper();
        this.$emit("hide");
      }
    },
    placement(nVal: string) {
      this.updatePopper({ placement: nVal });
    },
    innerModifiers(nVal) {
      this.updatePopper({ modifiers: nVal });
    }
  },
  // call destroy in keep-alive mode
  deactivated() {
    this.hidePopper(true);
  },
  beforeDestroy() {
    this.hidePopper(true);
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      document.body.removeChild(this.popperElm);
    }
  },
  methods: {
    refreshPopper() {
      if (this.popperInstance) {
        (this.popperInstance as Instance).update();
      }
    },
    updatePopper(opitons: Partial<OptionsGeneric<Modifier<string, any>>>) {
      if (this.popperInstance) {
        (this.popperInstance as Instance).setOptions(opitons);
      }
    },
    showPopper() {
      this.popperElm = this.popperElm || this.popper || this.$refs.popper;
      this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;
      if (!this.referenceElm && this.$slots.reference && this.$slots.reference[0]) {
        this.referenceElm = this.$slots.reference[0].elm;
      }
      if (!this.popperElm || !this.referenceElm) {return;}
      const options = {
        placement: this.placement,
        strategy: this.strategy,
        modifiers: this.innerModifiers
      };
      if (typeof this.getParentContainer === "function") {
        const parentContainer = this.getParentContainer(this.referenceElm.parentNode);
        if (parentContainer && this.popperElm.parentNode !== parentContainer) {
          parentContainer.appendChild(this.popperElm);
        }
      } else {
        if (this.appendToBody) {
          this.popperElm.parentNode !== document.body && document.body.appendChild(this.popperElm);
        }
      } 
      this.popperInstance = createPopper(this.referenceElm, this.popperElm, options);
    },
    hidePopper(immediate: boolean = false) {
      if (this.popperInstance) {
        if (immediate) {
          this.popperInstance.destroy();
          this.popperInstance = null;
          clearTimeout(this.destroyTimer);
        } else {
          this.destroyTimer = setTimeout(() => {
            this.popperInstance && this.popperInstance.destroy();
            this.popperInstance = null;
          }, 300);
        }
      }
    }
  }
});

export default popper;
