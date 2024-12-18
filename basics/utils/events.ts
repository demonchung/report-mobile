/**
 * 注册事件监听
 * @param el
 * @param event
 * @param fn
 * @param options
 */
function on(el: HTMLElement | Document, event: keyof HTMLElementEventMap,fn: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions){
  el.addEventListener(event, fn, options);
}

/**
 * 删除事件监听
 * @param el
 * @param event
 * @param fn
 * @param options
 */
function off(el: HTMLElement | Document, event: keyof HTMLElementEventMap,fn: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
  el.removeEventListener(event, fn, options);
}

/**
 * 触发事件
 * @param el
 * @param eventName
 * @param options
 */
function dispatch (el: HTMLElement | Window, eventName: string, options?: any){
  if (document.createEvent) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    Object.assign(event, options);
    el.dispatchEvent(event);
  } else {
    if ((el as any).createEventObject) {
      (el as any).fireEvent(`on${eventName}`);
    }
  } 
}

export {
  on,
  off,
  dispatch
}

export default {
  on,
  off,
  dispatch
}
