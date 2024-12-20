/* istanbul ignore next */

import Vue from "vue";

const isServer = Vue.prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([:-_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

/* istanbul ignore next */
const trim = function (string) {
  const str = (string || "").replace(/^[\s\uFEFF]+/g, "");
  return str.replace(/[\s\uFEFF]+$/g, "");

};
/* istanbul ignore next */
const camelCase = function(name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, "Moz$1");
};

/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const once = function(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) {return false;}
  if (cls.indexOf(" ") !== -1) {
    throw new Error("className should not contain space.");
  }
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
}

/* istanbul ignore next */
export function addClass(el, cls) {
  if (!el) {return;}
  let curClass = el.className;
  const classes = (cls || "").split(" ");

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {continue;}

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += " " + clsName;
      }
    } 
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) {return;}
  const classes = cls.split(" ");
  let curClass = " " + el.className + " ";

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {continue;}

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(" " + clsName + " ", " ");
      }
    } 
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/* istanbul ignore next */
export const getStyle =
  ieVersion < 9
    ? function (element, styleName) {
        if (isServer) {return;}
        if (!element || !styleName) {return null;}
        let cacheStyleName = camelCase(styleName);
        if (cacheStyleName === "float") {
          cacheStyleName = "styleFloat";
        }
        try {
          switch (cacheStyleName) {
            case "opacity":
              try {
                return element.filters.item("alpha").opacity / 100;
              } catch (e) {
                return 1.0;
              }
            default:
              return element.style[cacheStyleName] || element.currentStyle
                ? element.currentStyle[cacheStyleName]
                : null;
          }
        } catch (e) {
          return element.style[cacheStyleName];
        }
      }
    : function (element, styleName) {
        if (isServer) {return;}
        if (!element || !styleName) {return null;}
        let cacheStyleName = camelCase(styleName);
        if (cacheStyleName === "float") {
          cacheStyleName = "cssFloat";
        }
        try {
          const computed = document.defaultView.getComputedStyle(element, "");
          return element.style[cacheStyleName] || computed ? computed[cacheStyleName] : null;
        } catch (e) {
          return element.style[cacheStyleName];
        }
      };

/* istanbul ignore next */
export function setStyle(element, styleName, value) {
  if (!element || !styleName) {return;}

  if (typeof styleName === "object") {
    for (const sprop in styleName) {
      if (Object.prototype.hasOwnProperty.call(styleName, sprop)) {
        setStyle(element, sprop, styleName[sprop]);
      }
    }
  } else {
    const cacheStyleName = camelCase(styleName);
    if (cacheStyleName === "opacity" && ieVersion < 9) {
      element.style.filter = isNaN(value) ? "" : "alpha(opacity=" + value * 100 + ")";
    } else {
      element.style[cacheStyleName] = value;
    }
  }
}

export const isScroll = (el, vertical) => {
  if (isServer) {return;}

  const determinedDirection = vertical !== null || vertical !== undefined;
  const overflow = determinedDirection
    ? vertical
      ? getStyle(el, "overflow-y")
      : getStyle(el, "overflow-x")
    : getStyle(el, "overflow");

  return overflow.match(/(scroll|auto)/);
};

export const getScrollContainer = (el, vertical) => {
  if (isServer) {return;}

  let parent = el;
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window;
    }
    if (isScroll(parent, vertical)) {
      return parent;
    }
    parent = parent.parentNode;
  }

  return parent;
};

export const isInContainer = (el, container) => {
  if (isServer || !el || !container) {return false;}

  const elRect = el.getBoundingClientRect();
  let containerRect;

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }

  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  );
};
