import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { PopupManager } from "@h3/report-mobile/basics/utils/popup";

import PopperJS from "popper.js";
import debounce from "lodash/debounce";
const stop = (e: Event) => e.stopPropagation();

/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end),left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */

@Component({
  name: "VuePopper"
})
export default class VuePopper extends Vue {
  @Prop({
    type: [Boolean, String],
    default: true
  })
  transformOrigin!: boolean | string;

  @Prop({
    type: String,
    default: "bottom-start"
  })
  placement!: string;

  @Prop({
    type: Number,
    default: 5
  })
  boundariesPadding!: number;

  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  reference!: any;

  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  popper!: any;

  @Prop({
    type: Number,
    default: 0
  })
  offset!: number;

  @Prop({
    type: Boolean
  })
  visibleArrow!: boolean;

  @Prop({
    type: Number,
    default: 35
  })
  arrowOffset!: number;

  @Prop({
    type: Boolean,
    default: true
  })
  appendToBody!: boolean;

  @Prop({
    type: Function
  })
  getParentContainer!: any;

  @Prop({
    type: Function
  })
  getOverflowContainer!: any;

  @Prop({
    type: Object,
    default() {
      return {};
    }
  })
  popperOptions!: any;

  showPopper: boolean = false;

  currentPlacement: string = "";

  referenceElm: any = null;

  popperElm: any = null;

  popperJS: any = null;

  appended: any = null;

  @Watch("showPopper")
  showPopperHandler(val: boolean) {
    val ? this.updatePopper() : this.destroyPopper();
  }

  @Watch("placement")
  placementChange(val: string) {
    if (val) {
      const popperJS = this.popperJS;
      if (popperJS) {
        this.currentPlacement = "";
        this.createPopper();
      }
    }
  }

  createPopper() {
    if (this.$isServer) {return;}
    this.currentPlacement = this.currentPlacement || this.placement;
    if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
      return;
    }

    const options = this.popperOptions;
    const popper = (this.popperElm = this.popperElm || this.popper || this.$refs.popper);
    let reference = (this.referenceElm =
      this.referenceElm || this.reference || this.$refs.reference);

    if (!reference && this.$slots.reference && this.$slots.reference[0]) {
      reference = this.referenceElm = this.$slots.reference[0].elm;
    }
    if (!popper || !reference) {return;}
    if (this.visibleArrow) {this.appendArrow(popper);}

    if (typeof this.getParentContainer === "function") {
      const parentContainer = this.getParentContainer(reference.parentNode);
      if (parentContainer) {
        parentContainer.appendChild(this.popperElm);
      }
    } else {
      if (this.appendToBody) {
        document.body.appendChild(this.popperElm);
      }
    } 
    if (this.popperJS && this.popperJS.destroy) {
      this.popperJS.destroy();
    }
    options.placement = this.currentPlacement;
    options.offset = { offset: this.offset };
    let boundariesElement = "window";
    if (typeof this.getOverflowContainer === "function") {
      boundariesElement = this.getOverflowContainer();
    }
    options.modifiers = {
      computeStyle: {
        gpuAcceleration: false
      },
      preventOverflow: {
        boundariesElement: boundariesElement
      }
    };
    options.arrowOffset = this.arrowOffset;
    options.onCreate = () => {
      this.$emit("created", this);
      this.resetTransformOrigin();
      this.$nextTick(this.updatePopper);
    };
    options.onUpdate = debounce(
      () => {
        this.resetTransformOrigin();
      },
      300,
      { leading: false }
    );
    this.popperJS = new PopperJS(reference, popper, options);
    this.popperJS.popper.style.zIndex = PopupManager.nextZIndex();
    this.popperElm.addEventListener("click", stop);
  }

  updatePopper() {
    const popperJS = this.popperJS;
    if (popperJS) {
      popperJS.update();
      if (popperJS.popper) {
        popperJS.popper.style.zIndex = PopupManager.nextZIndex();
      }
    } else {
      this.createPopper();
    }
  }

  doDestroy(forceDestroy: boolean) {
    /* istanbul ignore if */
    if (!this.popperJS || (this.showPopper && !forceDestroy)) {return;}
    this.popperJS.destroy();
    this.popperJS = null;
  }

  destroyPopper() {
    if (this.popperJS) {
      this.resetTransformOrigin();
    }
  }

  resetTransformOrigin() {
    if (!this.transformOrigin) {return;}
    const placementMap: {
      top: string;
      bottom: string;
      left: string;
      right: string;
    } = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    };
    const placement: string = this.popperJS.popper.getAttribute("x-placement").split("-")[0];
    const origin: string = placementMap[placement];
    this.popperJS.popper.style.transformOrigin =
      typeof this.transformOrigin === "string"
        ? this.transformOrigin
        : ["top", "bottom"].indexOf(placement) > -1
        ? `center ${origin}`
        : `${origin} center`;
  }

  appendArrow(element: Element) {
    let hash;
    if (this.appended) {
      return;
    }

    this.appended = true;

    for (const item in element.attributes) {
      if (/^_v-/.test(element.attributes[item].name)) {
        hash = element.attributes[item].name;
        break;
      }
    }

    const arrow: HTMLDivElement = document.createElement("div");

    if (hash) {
      arrow.setAttribute(hash, "");
    }
    arrow.setAttribute("x-arrow", "");
    arrow.className = "popper__arrow";
    element.appendChild(arrow);
  }

  beforeDestroy() {
    this.doDestroy(true);
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener("click", stop);
      document.body.removeChild(this.popperElm);
    }
  }

  // call destroy in keep-alive mode
  deactivated() {
    (this.$options as any).beforeDestroy[0].call(this);
  }
}
