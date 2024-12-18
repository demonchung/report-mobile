import {
  createPopper,
  Instance,
  OptionsGeneric,
  Modifier,
} from '@popperjs/core';
import {
  resetTransformOrigin,
  sameWidth,
  setZIndex,
  checkOverlap,
  arrowAutoHide,
  autoHide,
} from './modifiers';
import zIndexManager from './z-index-manager';
const FakeElement = typeof Element !== 'undefined' ? Element : Object;
const popper = {
  model: {
    prop: 'visible',
    event: 'toggle',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: [Function, Array],
      default: () => [0, 0],
    },
    arrow: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      validator: (value) =>
        /^(auto|top|bottom|left|right)(-start|-end)?$/g.test(value),
      default: 'bottom-start',
    },
    transformOrigin: {
      type: [String, Boolean],
      default: true,
    },
    zIndex: {
      type: [String, Number],
    },
    strategy: {
      type: String,
      validator: (value: string) => ['absolute', 'fixed'].includes(value),
      default: 'absolute',
    },
    modifiers: {
      type: Array,
      default () {
        return [];
      },
      // default: () => [],
    },
    sameWidth: {
      type: Boolean,
      default: false,
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    getParentContainer: Function,
    getBoundaryContainer: Function,
    reference: FakeElement,
    // popper: FakeElement,
  },
  data () {
    return {
      popperVisible: false,
      popperIsOverlap: false,
      popperInstance: null,
      popperDirection: 'center',
      currentPlacement: '',
      referenceElm: null,
      popperElm: null,
      arrowElm: null,
      arrowNeedHide: false,
      innerZIndex: null,
      beforeShowCallbacks: [],
      afterShowCallbacks: [],
      beforeHideCallbacks: [],
      afterHideCallbacks: [],
    };
  },
  watch: {
    visible: {
      handler (nVal: boolean) {
        this.popperVisible = !!nVal;
      },
      immediate: true,
    },
    popperVisible (nVal: boolean) {
      this.$emit('toggle', nVal);
      if (nVal) {
        this.showPopper();
        this.$emit('show');
      } else {
        this.hidePopper();
        this.$emit('hide');
      }
    },
    placement: {
      handler (nVal: string) {
        this.updatePopper({ placement: nVal });
        const placement = nVal;
        this.popperDirection = placement.startsWith('auto')
          ? 'center'
          : placement.startsWith('right') || placement.startsWith('left')
            ? 'horizontal'
            : 'vertical';
      },
      immediate: true,
    },
    modifiers (nVal: Array<Modifier<string, any>>) {
      this.updatePopper({ modifiers: this.getInnerModifiers(nVal) });
    },
  },
  // call destroy in keep-alive mode
  deactivated () {
    this.hidePopper(true);
  },
  beforeDestroy () {
    this.hidePopper(true);
    if (this.popperElm && this.popperElm.parentNode) {
      this.popperElm.parentNode.removeChild(this.popperElm);
    }
  },
  methods: {
    getArrowOffset () {
      let offset = [0, 8];
      if (typeof this.offset === 'function') {
        offset = this.offset();
      } else {
        if (Array.isArray(this.offset)) {
          offset = this.offset;
        }
      } 
      const [skidding, distance] = offset;
      return !distance ? [skidding, 8] : offset;
    },
    getInnerModifiers (modifiers: Array<Modifier<string, any>>) {
      const boundary = this.getBoundaryContainer
        ? this.getBoundaryContainer()
        : 'clippingParents';
      return [
        {
          name: 'offset',
          options: {
            offset: this.arrow ? this.getArrowOffset : this.offset,
          },
        },
        {
          name: 'computeStyles',
          options: {
            gpuAcceleration: false,
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: 8,
            boundary,
            altAxis: true, // 尽量显示在区域内
          },
        },
        {
          name: 'flip',
          options: {
            padding: 8,
            boundary,
          },
        },
        checkOverlap,
        {
          name: 'checkOverlap',
          options: {
            callbackFn: (isOverlap: boolean) => {
              this.popperIsOverlap = isOverlap;
            },
          },
        },
        ...(this.arrow
          ? [
            {
              name: 'arrow',
              options: {
                element: this.arrowElm,
                padding: 5,
              },
            },
            arrowAutoHide,
            {
              name: 'arrowAutoHide',
              options: {
                callbackFn: (needHide: boolean) => {
                  this.arrowNeedHide = needHide;
                },
              },
            },
          ]
          : []),
        autoHide,
        {
          name: 'autoHide',
          options: {
            callbackFn: (isReferenceHidden: boolean) => {
              if (this.autoHide && isReferenceHidden) {
                this.popperVisible = false;
              }
            },
          },
        },
        resetTransformOrigin,
        {
          name: 'resetTransformOrigin',
          options: {
            transformOrigin: this.transformOrigin,
            callbackFn: (direction: string, placement: string) => {
              this.popperDirection = direction;
              this.currentPlacement = placement;
            },
          },
        },
        ...(this.sameWidth ? [sameWidth] : []),
        setZIndex,
        {
          name: 'setZIndex',
          options: {
            getZIndex: () => {
              let zIndex = this.zIndex || this.innerZIndex;
              if (zIndex === null) {
                zIndex = zIndexManager.getZIndex();
                this.innerZIndex = zIndex;
              }
              return zIndex;
            },
          },
        },
        ...modifiers,
      ];
    },
    refreshPopper (currPlacement: boolean) {
      if (this.popperInstance) {
        if (currPlacement) {
          (this.popperInstance as Instance)
            .setOptions({
              placement: this.currentPlacement,
            })
            .then(() => {
              (this
                .popperInstance as Instance).state.options.placement = this.placement;
            });
        } else {
          (this.popperInstance as Instance).update();
        }
      }
    },
    updatePopper (opitons: Partial<OptionsGeneric<Modifier<string, any>>>) {
      if (this.popperInstance) {
        (this.popperInstance as Instance).setOptions(opitons);
      }
    },
    showPopper () {
      this.popperElm = this.popperElm || /* this.popper || */ this.$refs.popper;
      this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;
      if (!this.popperElm || !this.referenceElm) {return;}
      this.portalPopper();
      this.arrowElm = this.arrow ? this.$refs.arrow : null;
      this.currentPlacement = this.placement;
      const options = {
        placement: this.placement,
        strategy: this.strategy,
        modifiers: this.getInnerModifiers(this.modifiers),
      };
      this.popperInstance = this.createPopperInstance(
        this.referenceElm,
        this.popperElm,
        options,
      );
    },
    createPopperInstance (referenceElm, popperElm, options) {
      return createPopper(referenceElm, popperElm, options);
    },
    portalPopper () {
      if (typeof this.getParentContainer === 'function') {
        const parentContainer = this.getParentContainer(
          this.referenceElm.parentNode,
        );
        if (parentContainer && this.popperElm.parentNode !== parentContainer) {
          parentContainer.appendChild(this.popperElm);
        }
      } else {
        if (this.appendToBody) {
          if (this.popperElm.parentNode !== document.body) {
            document.body.appendChild(this.popperElm);
          }
        }
      } 
    },
    hidePopper (immediate: boolean = false) {
      if (this.popperInstance) {
        if (this.innerZIndex !== null) {
          zIndexManager.restoreZIndex();
          this.innerZIndex = null;
        }
        let prevInstance = this.popperInstance;
        this.referenceElm = null;
        this.popperInstance = null;
        if (immediate) {
          prevInstance.destroy();
          prevInstance = null;
          clearTimeout(this.destroyTimer);
        } else {
          this.afterHideCallbacks.push(() => {
            prevInstance.destroy();
            prevInstance = null;
          });
        }
      }
    },
  },
};

export default popper;
