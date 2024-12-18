import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
import LazyLoad from '../../utils/lazy-load';



const directive: DirectiveOptions = {
  bind(el: HTMLElement, bind: VNodeDirective, vnode: VNode) {
   
  },
  inserted(el: HTMLElement, bind: VNodeDirective, vnode: VNode) {
   new LazyLoad(el, bind.value);
  },
  unbind() {
    
  }
};

export default directive;
