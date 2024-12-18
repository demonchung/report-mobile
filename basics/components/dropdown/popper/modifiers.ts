import { Modifier, ModifierArguments } from "@popperjs/core";

type resetTransformOriginOptions = {
  transformOrigin?: string | boolean;
};

export const resetTransformOrigin: Modifier<string, any> = {
  name: "resetTransformOrigin",
  enabled: true,
  phase: "beforeWrite",
  requires: ["flip"],
  options: {
    transformOrigin: true
  },
  fn(params: ModifierArguments<resetTransformOriginOptions>) {
    const { state, options } = params;
    const { transformOrigin = true } = options;
    if (!transformOrigin) {
      return;
    }
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
    const placement = state.placement.split("-")[0];
    const origin: string = placementMap[placement];
    state.styles.popper.transformOrigin =
      typeof transformOrigin === "string"
        ? transformOrigin
        : ["top", "bottom"].indexOf(placement) > -1
        ? `center ${origin}`
        : `${origin} center`;
  }
};

export const sameWidth = {
  name: "sameWidth",
  enabled: true,
  requires: ["computeStyles"],
  phase: "beforeWrite",
  fn: (params: ModifierArguments<any>) => {
    const { state } = params;
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: (params: ModifierArguments<any>) => {
    const { state } = params;
    state.elements.popper.style.width = `${
      (state.elements.reference as HTMLElement).offsetWidth
    }px`;
  }
};

let hasInitZIndex = false;
let zIndex: number;

const PopupManager = {
  nextZIndex() {
    return this.zIndex++;
  }
};
Object.defineProperty(PopupManager, "zIndex", {
  configurable: true,
  get() {
    if (!hasInitZIndex) {
      zIndex = zIndex || 2000;
      hasInitZIndex = true;
    }
    return zIndex;
  },
  set(value) {
    zIndex = value;
  }
});

export const setZIndex = {
  name: "setZIndex",
  enabled: true,
  requires: ["computeStyles"],
  phase: "beforeWrite",
  fn: (params: ModifierArguments<any>) => {
    const { state } = params;
    state.styles.popper.zIndex = `${PopupManager.nextZIndex()}`;
  }
};
