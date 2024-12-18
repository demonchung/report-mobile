declare namespace H3 {
  namespace LazyLoad {
    interface Options {
      /**
       * 是否延时操作
       * 默认值 200毫秒
       */
      delay?: number 
      /**
       * 监听的选择器
       * 默认值 .lazyload
       */
      selector: string
      /**
       * 监听元素的祖先元素Element对象，其边界盒将被视作视口。目标在根的可见区域的的任何不可见部分都会被视为不可见。
       * 默认值 null
       */
      root?: HTMLElement | null
      /**
       * 加载后删除监听事件
       * 默认 false
       */
      delAfterListening?: boolean
      /**
       * 一个在计算交叉值时添加至根的边界盒(bounding_box)中的一组偏移量，类型为字符串(string) ，可以有效的缩小或扩大根的判定范围从而满足计算需要。语法大致和CSS 中的margin 属性等同; 
       * 默认值 '0px 0px 0px 0px'
       */
      rootMargin?: string
      /**
       * 规定了一个监听目标与边界盒交叉区域的比例值，可以是一个具体的数值或是一组0.0到1.0之间的数组。若指定值为0.0，则意味着监听元素即使与根有1像素交叉，此元素也会被视为可见. 若指定值为1.0，则意味着整个元素都是可见的(此段英文原文直译，正确性有待验证) 。
       * 默认值 [0, 0]
       */
      threshold?: Array<number>
      /**
       * 当元素可见比例超过指定阈值后，会调用一个回调函数，此回调函数接受两个参数：
       * Array
       * 当前触发的元素
       * isIntersecting
       *  返回一个布尔值, 如果目标元素与交叉区域观察者对象(intersection observer) 的根相交，则返回 true .如果返回 true, 则 IntersectionObserverEntry 描述了变换到交叉时的状态; 如果返回 false, 那么可以由此判断,变换是从交叉状态到非交叉状态.
       */
      callback?: Function | null
    }
  }
}
