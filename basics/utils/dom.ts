/**
 * 通过选择器获取element的父元素节点
 * @param el
 * @param selector
 */
function closest(el: Element, selector: string): Element | null {
  let matchesSelector = el.matches;
  if (!matchesSelector) {
    const tEl: any = el;
    matchesSelector =
      tEl.matchesSelector ||
      tEl.mozMatchesSelector ||
      tEl.msMatchesSelector ||
      tEl.oMatchesSelector ||
      tEl.webkitMatchesSelector ||
      function(s) {
        // @ts-ignore
        const matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        // @ts-ignore
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }
  while (el) {
    if (matchesSelector.call(el, selector)) {
      break;
    }

    el = el.parentElement as Element;
  }
  return el;
}

/**
 * 获取元素index
 * @param el
 */
function elementIndex(el: HTMLElement): number {
  const current: any = el.parentElement || {};
  return Array.prototype.indexOf.call(current.children, el);
}

/**
 * 设置元素css
 * @param el
 * @param prop  属性名称 例如: width height..
 * @param val  属性值 如果不传值就是获取对应属性的值。传值就是赋值
 */
function css(el: HTMLElement, prop?: string, val?: string | number) {
  const style = el && el.style;
  if (style) {
    if (val === void 0) {
      let ret: CSSStyleDeclaration | null = null;
      if (document.defaultView && document.defaultView.getComputedStyle) {
        ret = document.defaultView.getComputedStyle(el, "");
      } else {
        if ((el as any).currentStyle) {
          ret = (el as any).currentStyle as CSSStyleDeclaration;
        }
      } 
      if (ret) {
        return prop === void 0 ? ret : ret[prop];
      }
    } else {
      if (prop && !(prop in style) && prop.indexOf("webkit") === -1) {
        prop = "-webkit-" + prop;
      }
      if (prop) {
        style[prop] = val + (typeof val === "string" ? "" : "px");
      }
    }
  }
}

export const offSet = (curEle, targetClassName?) => {
  let totalLeft = null,
    totalTop = null,
    par = curEle.offsetParent;
  //首先加自己本身的左偏移和上偏移
  totalLeft += curEle.offsetLeft;
  totalTop += curEle.offsetTop;
  let tip: boolean = false;
  //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
  while (par && !tip) {
    if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
      //累加父级参照物的边框
      totalLeft += par.clientLeft;
      totalTop += par.clientTop;
    }

    //累加父级参照物本身的偏移
    totalLeft += par.offsetLeft;
    totalTop += par.offsetTop;
    if (targetClassName) {
      tip = par.className === targetClassName;
    }
    par = par.offsetParent;
  }

  return {
    left: totalLeft,
    top: totalTop
  };
};


function getDomWidth(str, fontSize = 14) {
  const span = document.createElement('span'); // create a new span element
  span.style.fontSize = `${fontSize}px`; // set the font size
  span.style.visibility = 'hidden'; // hide the span from view
  span.textContent = str; // set the text content of the span
  document.body.appendChild(span); // append the span to the document body
  const width = span.offsetWidth; // get the width of the span
  document.body.removeChild(span); // remove the span from the document body
  return width; // return the width
}

export { closest, elementIndex, css,getDomWidth };

export default {
  closest,
  elementIndex,
  css,
  getDomWidth
};
