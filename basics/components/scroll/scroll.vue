<template>
  <div :class="[prefixCls, isTransparent && `${prefixCls}__transparent`]">
    <div ref="scroll" :class="[`${prefixCls}__content`]">
      <slot ref="content"></slot>
    </div>
    <div ref="scrollYWarp" :class="scrollYStyles">
      <div ref="scrollY" :class="[`${prefixCls}__axis`, `${prefixCls}__axis--y`]"></div>
    </div>
    <div ref="scrollXWarp" :class="scrollXStyles">
      <div ref="scrollX" :class="[`${prefixCls}__axis`, `${prefixCls}__axis--x`]"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import { addWheelListener } from "../../utils/global";
@Component({
  name: "h3-scroll"
})
export default class H3Scroll extends Vue {
  @Prop({ default: true }) scrollYBtn!: boolean;
  @Prop({ default: true }) scrollXBtn!: boolean;
  @Prop({ default: "right" }) scrollYBtnDirection!: string;
  @Prop({ default: "bottom" }) scrollXBtnDirection!: string;
  @Prop({ default: "transparent" }) backgroundColor!: string;
  @Prop({ default: "#eee" }) buttonColor!: string;
  @Prop({ default: true }) resize!: boolean;
  @Prop({ default: false }) disableWheel!: boolean;
  @Prop({ default: false }) autoHideMode!: boolean;
  @Prop({ default: true }) animate!: boolean;
  @Prop({ default: false }) landscape!: boolean;// 兼容手机端 是否横屏

  // 是否深色透明
  @Prop({ default: () => false }) isTransparent!: boolean;
  prefixCls = "h3-scroll";
  top: number = 0; // Y
  left: number = 0; // X
  sX: number = 0; // 初始X坐标
  sY: number = 0; // 初始Y坐标
  tX: number = 0; // 临时X坐标
  tY: number = 0; // 临时Y坐标
  eX: number = 0; // 元素的最后X坐标
  eY: number = 0; // 元素的最后Y坐标
  maxX: number = 0; // 最大X
  maxY: number = 0; // 最大Y
  scaleX: number = 0;
  scaleY: number = 0;
  eventType = "x";
  scrollState = false;
  scroll: HTMLDivElement = this.$refs.scroll as HTMLDivElement;
  scrollYWarp = this.$refs.scrollYWarp as HTMLDivElement;
  scrollXWarp = this.$refs.scrollXWarp as HTMLDivElement;
  scrollY: HTMLDivElement = this.$refs.scrollY as HTMLDivElement;
  scrollX: HTMLDivElement = this.$refs.scrollX as HTMLDivElement;
  timer = 0;
  timer2 = 0;
  onScroll: Function | undefined;

  get scrollXStyles() {
    const style = {};
    style[`${this.prefixCls}__axis--warp`] = true;
    style[`${this.prefixCls}__axis--warp-x`] = true;
    style[`${this.prefixCls}__axis--warp-t-x`] = this.scrollXBtnDirection === "top";
    style[`${this.prefixCls}__axis--warp-leave`] = this.autoHideMode;
    return style;
  }
  get scrollYStyles() {
    const style = {};
    style[`${this.prefixCls}__axis--warp`] = true;
    style[`${this.prefixCls}__axis--warp-y`] = true;
    style[`${this.prefixCls}__axis--warp-l-y`] = this.scrollYBtnDirection === "left";
    style[`${this.prefixCls}__axis--warp-leave`] = this.autoHideMode;
    return style;
  }

  setScrollBar(e?: Event, refresh: any = false) {
    if (!this.resize) {return false;}
    let scaleY = 0;
    let scaleX = 0;
    if (!refresh) {
      scaleY = isNaN(this.eY / this.scaleY) ? 0 : this.eY / this.scaleY;
      scaleX = isNaN(this.eX / this.scaleX) ? 0 : this.eX / this.scaleX;
    }
    setTimeout(() => {
      const contHeight = this.$el.clientHeight as any;
      const contWidth = this.$el.clientWidth as any;
      const scrollHeight = this.scroll.scrollHeight as any;
      const scrollWidth = this.scroll.scrollWidth as any;
      const yHeight = parseInt(((contHeight / scrollHeight) * contHeight).toFixed(0), 10);
      const xWidth = parseInt(((contWidth / scrollWidth) * contWidth).toFixed(0), 10);
      const dffYHeight = 20 - yHeight;
      const dffXWidth = 20 - xWidth;
      const clientHeight = dffYHeight > 0 ? contHeight - dffYHeight : contHeight;
      const clientWidth = dffXWidth > 0 ? contWidth - dffXWidth : contWidth;

      if (scrollHeight > clientHeight && this.scrollYBtn) {
        this.scrollYWarp.style.display = "block";
        this.scrollY.style.height = `${dffYHeight >= 0 ? 20 : yHeight}px`;
      } else {
        this.scrollYWarp.style.display = "none";
      }
      if (scrollWidth > clientWidth && this.scrollXBtn) {
        this.scrollXWarp.style.display = "block";
        this.scrollX.style.width = `${dffXWidth >= 0 ? 20 : xWidth}px`;
      } else {
        this.scrollXWarp.style.display = "none";
      }
      this.maxY = (scrollHeight - clientHeight) * (clientHeight / scrollHeight);
      this.maxX = (scrollWidth - clientWidth) * (clientWidth / scrollWidth);
      this.scaleY = clientHeight / scrollHeight;
      this.scaleX = clientWidth / scrollWidth;
      this.eY = scaleY * this.scaleY;
      this.eX = scaleX * this.scaleX;
      this.eY = this.eY > this.maxY ? this.maxY : this.eY;
      this.eX = this.eX > this.maxX ? this.maxX : this.eX;
      this.scrollY.style.transform = `translate3d(0px,${this.eY}px,0px)`;
      this.scrollX.style.transform = `translate3d(${this.eX}px,0px,0px)`;
      // this.scroll.style.transform = `translate3d(-${this.eX / this.scaleX}px,-${this.eY / this.scaleY}px,0px)`;
      this.scroll.scrollTop = this.eY / this.scaleY;
      this.scroll.scrollLeft = this.eX / this.scaleX;
      this.$emit("scroll", { x: this.scroll.scrollLeft, y: this.scroll.scrollTop });
    }, 0);
  }

  bindEvents() {
    window.addEventListener("resize", this.setScrollBar, false);
    if (this.scrollYBtn) {
      this.scrollY.addEventListener("mousedown", this.scrollEvent, false);
      addWheelListener(this.$el as HTMLElement, this.mousewheel, false);
    }
    if (this.scrollXBtn) {
      this.scrollX.addEventListener("mousedown", this.scrollEvent, false);
    }
    this.$el.addEventListener("touchstart", this.touchstart, false);
    this.$el.addEventListener("touchmove", this.touchmove, false);
    this.$el.addEventListener("touchend", this.touchend, false);
  }

  /**
   * 手机的touch开始事件
   */
  touchstart(e: TouchEvent) {
    if (this.disableWheel) {return;}
    this.scrollState = true;
    this.sX = e.targetTouches[0].pageX;
    this.sY = e.targetTouches[0].pageY;
  }
  touchmove(e: TouchEvent) {
    if (!this.scrollState) {return;}
    if (this.disableWheel) {return;}
    const pageX = e.targetTouches[0].pageX as number;
    const pageY = e.targetTouches[0].pageY as number;
    //  this.tY = this.sY - pageY + this.eY;
    // this.tX = this.sX - pageX + this.eX;
    // this.tY = this.sY - pageY + this.eY;
    // this.tX = this.sX - pageX + this.eX;
    // 是否伪横屏 如果是就要调换手势方向
    if (this.landscape) {
      this.tY = this.sY - pageY + this.eY;
      this.tX = -(this.sX - pageX + this.eX);
      this.tY = this.tY > this.maxX ? this.maxX : this.tY < 0 ? 0 : this.tY;
      this.tX = this.tX > this.maxY ? this.maxY : this.tX < 0 ? 0 : this.tX;
      this.changeScroll(this.tY, this.tX);
    } else {
      this.tY = this.sY - pageY + this.eY;
      this.tX = this.sX - pageX + this.eX;
      
      this.tY = this.tY > this.maxY ? this.maxY : this.tY < 0 ? 0 : this.tY;
      this.tX = this.tX > this.maxX ? this.maxX : this.tX < 0 ? 0 : this.tX;
      this.changeScroll(this.tX, this.tY);
    }

    if ((this.maxX === 0 || this.tX < this.maxX) && this.tY < this.maxY && this.tY > 0) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  touchend() {
    if (this.disableWheel) {return;}
    this.scrollState = false;
    if (this.landscape) {
      this.eX = -this.tX;
      this.eY = this.tY;
    } else {
      this.eX = this.tX;
      this.eY = this.tY;
    }
  }
  mousewheel(e: WheelEvent) {
    if (this.disableWheel) {return;}
    const deltaY = e.deltaY;
    const deltaX = e.deltaX;
    // this.eY = this.eY + (deltaY > 0 ? 100 * this.scaleY : -100 * this.scaleY);
    // const bool = e.deltaY;
    if(deltaY !== 0) {
      this.eY = this.eY + (deltaY > 0 ? 20 * this.scaleY : -20 * this.scaleY);
      this.eY = this.eY > this.maxY ? this.maxY : this.eY < 0 ? 0 : this.eY;
    }
   
     if(deltaX !== 0) { 
      this.eX = this.eX + (deltaX > 0 ? 50 * this.scaleX : -50 * this.scaleX);
      this.eX = this.eX > this.maxX ? this.maxX : this.eX < 0 ? 0 : this.eX;
     }
  

    if (this.animate) {
      this.scrollY.style.transition = "transform 0.1s ease-out";
      this.scroll.style.transition = "transform 0.1s ease-out";
    }
    this.changeScroll(this.eX, this.eY);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.scrollY.style.transition = "none";
      this.scroll.style.transition = "none";
    }, 100);
    if (this.maxY) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  onmousemove(e: MouseEvent) {
    if (!this.scrollState) {return;}
    if (this.eventType === "y") {
      this.tX = this.eX;
      this.tY = e.pageY - this.sY + this.eY;
      this.tY = this.tY > this.maxY ? this.maxY : this.tY < 0 ? 0 : this.tY;
    } else {
      this.tY = this.eY;
      this.tX = e.pageX - this.sX + this.eX;
      this.tX = this.tX > this.maxX ? this.maxX : this.tX < 0 ? 0 : this.tX;
    }
    this.changeScroll(this.tX, this.tY, "onmousemove");
  }
  getScrollY(y: number) {
    this.scrollY.style.transform = `translate3d(0px,${y}px,0px)`;
    const maxScrollHeight = this.scroll.scrollHeight - this.$el.clientHeight;
    let transformY = y / this.scaleY > maxScrollHeight ? maxScrollHeight : y / this.scaleY;
    transformY = parseFloat(transformY.toFixed(2));
    return transformY;
  }
  getScrollX(x: number) {
    this.scrollX.style.transform = `translate3d(${x}px,0px,0px)`;
    const maxScrollWidth = this.scroll.scrollWidth - this.$el.clientWidth;
    let transformX = x / this.scaleX > maxScrollWidth ? maxScrollWidth : x / this.scaleX;
    transformX = parseFloat(transformX.toFixed(2));
    return transformX;
  }
  changeScroll(x: number, y: number, type = "") {
    const transformX: number = this.getScrollX(x);
    const transformY: number = this.getScrollY(y);
    this.scroll.scrollTop = transformY;
    this.scroll.scrollLeft = transformX;
    this.$emit("scroll", { x: transformX, y: transformY, type: type });
  }
  onmouseup(e: MouseEvent) {
    this.scrollState = false;
    this.eX = this.tX;
    this.eY = this.tY;
    this.changeScroll(this.tX, this.tY);
    window.document.removeEventListener("mousemove", this.onmousemove, false);
    window.document.removeEventListener("mouseup", this.onmouseup, false);
  }

  scrollEvent(e: MouseEvent) {
    e.preventDefault();
    this.scrollState = true;
    const target = e.target as HTMLDivElement;
    this.sX = e.pageX;
    this.sY = e.pageY;
    if (target.classList.contains(`${this.prefixCls}__axis--y`)) {
      this.eventType = "y";
    } else {
      this.eventType = "x";
    }
    window.document.addEventListener("mousemove", this.onmousemove, false);
    window.document.addEventListener("mouseup", this.onmouseup, false);
  }
  mounted() {
    this.scroll = this.$refs.scroll as HTMLDivElement;
    this.scrollYWarp = this.$refs.scrollYWarp as HTMLDivElement;
    this.scrollYWarp.style.backgroundColor = this.backgroundColor;
    this.scrollXWarp = this.$refs.scrollXWarp as HTMLDivElement;
    this.scrollXWarp.style.backgroundColor = this.backgroundColor;
    this.scrollY = this.$refs.scrollY as HTMLDivElement;
    this.scrollY.style.backgroundColor = this.buttonColor;
    this.scrollX = this.$refs.scrollX as HTMLDivElement;
    this.scrollX.style.backgroundColor = this.buttonColor;
    setTimeout(() => {
      this.setScrollBar();
      this.bindEvents();
    }, 100);
  }
  /**
   * 设置滚动条 外部API
   * @param x
   * @param y
   */
  setScroll(x: number, y: number) {
    this.eX = x * this.scaleX < this.maxX ? x * this.scaleX : this.maxX;
    this.eY = y * this.scaleY < this.maxY ? y * this.scaleY : this.maxY;
    this.changeScroll(this.eX, this.eY);
  }
  /**
   * 强制设置滚动条 外部API
   * @param x
   * @param y
   */
  setForceScroll(x: number, y: number) {
    this.eX = x;
    this.eY = y;
    this.changeScroll(Math.floor(x), Math.floor(y));
  }
  destroyed() {
    window.removeEventListener("resize", this.setScrollBar, false);
    this.scrollY.removeEventListener("mousedown", this.scrollEvent, false);
    this.scrollX.removeEventListener("mousedown", this.scrollEvent, false);
  }
}
</script>
<style lang="less">
.h3-scroll {
  display: flex;
  position: relative;
  overflow: hidden !important;
  &__content {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  &__axis,
  &__axis--warp {
    position: absolute;
    background-color: #eee;
    opacity: 0.7;
    border-radius: 4px;
  }
  &__axis--y,
  &__axis--warp-y {
    top: 0;
    width: 7px;
    min-height: 20px;
  }
  &__axis--warp-y {
    right: 0;
    height: 100%;
    display: none;
  }
  &__axis--x,
  &__axis--warp-x {
    height: 8px;
    left: 0;
  }
  &__axis--warp-x {
    bottom: 0;
    width: 100%;
    display: none;
  }
  &:hover &__axis--warp-leave {
    opacity: 1;
  }
  &__axis--warp-leave {
    opacity: 0;
    transition: opacity 0.1s;
  }
  &__axis--warp-t-x {
    top: 3px;
    bottom: auto;
  }
  &__axis--warp-l-y {
    left: 3px;
    right: auto;
  }
  // 深色主题下
  &__transparent {
    .h3-scroll {
      &__axis--x,
      &__axis--y {
        background-color: rgba(255,255,255,0.5) !important;
      }
    }
  }
}
</style>
