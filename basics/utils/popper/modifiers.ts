import { Modifier, ModifierArguments } from '@popperjs/core';

type EmptyOptions = {};

type ResetTransformOriginOptions = {
  transformOrigin?: string | boolean;
  callbackFn?: (
    direction: 'vertical' | 'center' | 'horizontal',
    placement: string,
  ) => void;
};

export const resetTransformOrigin: Modifier<
  'resetTransformOrigin',
  ResetTransformOriginOptions
> = {
  name: 'resetTransformOrigin',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['flip', 'checkOverlap'],
  options: {
    transformOrigin: true,
  },
  fn (params: ModifierArguments<ResetTransformOriginOptions>) {
    const { state, options } = params;
    const { transformOrigin = true, callbackFn } = options;
    if (!transformOrigin) {
      return;
    }
    const { isOverlap = false } = state.modifiersData.checkOverlap || {};
    const placementMap: {
      top: string;
      bottom: string;
      left: string;
      right: string;
    } = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };
    const placement = state.placement.split('-')[0];
    const origin: string = placementMap[placement];
    const _transformOrigin: string =
      typeof transformOrigin === 'string'
        ? transformOrigin
        : isOverlap
          ? 'center center'
          : ['top', 'bottom'].includes(placement)
            ? `center ${origin}`
            : `${origin} center`;
    state.styles.popper.transformOrigin = _transformOrigin;
    if (callbackFn) {
      const directionMap = {
        top: 'vertical',
        bottom: 'vertical',
        left: 'horizontal',
        right: 'horizontal',
      };
      callbackFn(
        isOverlap ? 'center' : directionMap[placement],
        state.placement,
      );
    }
  },
};

export const sameWidth: Modifier<'sameWidth', EmptyOptions> = {
  name: 'sameWidth',
  enabled: true,
  requires: ['computeStyles'],
  phase: 'beforeWrite',
  fn: (params: ModifierArguments<EmptyOptions>) => {
    const { state } = params;
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: (params: ModifierArguments<EmptyOptions>) => {
    const { state } = params;
    // const width = state.elements.popper.style.width;
    state.elements.popper.style.width = `${
      (state.elements.reference as HTMLElement).offsetWidth
    }px`;
    return () => {
      // cleanup side effects
    };
  },
};

export type SetZIndexOptions = {
  getZIndex: () => number;
};

export const setZIndex: Modifier<'setZIndex', SetZIndexOptions> = {
  name: 'setZIndex',
  enabled: true,
  requires: ['computeStyles'],
  phase: 'beforeWrite',
  fn: (params: ModifierArguments<SetZIndexOptions>) => {
    const { state, options } = params;
    const { getZIndex = () => 1000 } = options;
    state.styles.popper.zIndex = `${getZIndex()}`;
  },
};

export type CheckOverlapOptions = {
  callbackFn?: (isOverlap: boolean) => void;
};

export const checkOverlap: Modifier<'checkOverlap', CheckOverlapOptions> = {
  name: 'checkOverlap',
  enabled: true,
  phase: 'main',
  requires: ['preventOverflow'],
  fn: (params: ModifierArguments<CheckOverlapOptions>) => {
    const { name, state, options } = params;
    const { callbackFn } = options;
    const { reference, popper } = state.rects;
    const referenceRect = {
      left: reference.x,
      right: reference.x + reference.width,
      top: reference.y,
      bottom: reference.y + reference.height,
    };
    const {
      x: popperOffsetsX,
      y: popperOffsetsY,
    } = state.modifiersData.popperOffsets;
    const popperX =
      Math.abs(popperOffsetsX - popper.x) < 1 ? popper.x : popperOffsetsX;
    const popperY =
      Math.abs(popperOffsetsY - popper.y) < 1 ? popper.y : popperOffsetsY;
    const popperRect = {
      left: popperX,
      right: popperX + popper.width,
      top: popperY,
      bottom: popperY + popper.height,
    };
    const isOverlap = !(
      referenceRect.right <= popperRect.left + 1 ||
      referenceRect.left + 1 >= popperRect.right ||
      referenceRect.bottom <= popperRect.top + 1 ||
      referenceRect.top + 1 >= popperRect.bottom
    );
    callbackFn && callbackFn(isOverlap);
    state.modifiersData[name] = { isOverlap };
  },
};

export type ArrowAutoHideOptions = {
  callbackFn?: (needHide: boolean) => void;
};

export const arrowAutoHide: Modifier<'arrowAutoHide', ArrowAutoHideOptions> = {
  name: 'arrowAutoHide',
  enabled: true,
  phase: 'write',
  requires: ['checkOverlap'],
  fn (params: ModifierArguments<ArrowAutoHideOptions>) {
    const { state, options } = params;
    const { callbackFn } = options;
    const { elements, modifiersData } = state;
    const { arrow } = elements;
    if (arrow) {
      const needHide =
        modifiersData.checkOverlap.isOverlap ||
        modifiersData.arrow.centerOffset !== 0;
      callbackFn && callbackFn(needHide);
    }
  },
};

export type AutoHideOptions = {
  callbackFn?: (isReferenceHidden: boolean) => void;
};

export const autoHide: Modifier<'autoHide', AutoHideOptions> = {
  name: 'autoHide',
  enabled: true,
  phase: 'main',
  requires: ['hide'],
  fn: (params: ModifierArguments<AutoHideOptions>) => {
    const { state, options } = params;
    const { callbackFn } = options;
    const { isReferenceHidden } = state.modifiersData.hide;
    callbackFn && callbackFn(isReferenceHidden);
  },
};
