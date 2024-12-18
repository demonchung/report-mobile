import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class Transition extends Vue implements H3.Report.AnimationGroup {
  // 注入动画
  @Prop({ default: () => {} }) animations!: H3.Report.AnimationGroup | boolean;

  /**
   * zoomin
   */
  zoomIn() {
    if (typeof this.animations === "object" && this.animations.zoomIn) {
      this.animations.zoomIn(this.$el);
    } else {
      if (this.animations && this.$el) {
        this.$el.setAttribute("style", "transform:translate3d(0, 0, 0);");
      }
    }
  }

  /**
   * zoomout
   */
  zoomOut() {
    if (typeof this.animations === "object" && this.animations.zoomOut) {
      this.animations.zoomOut(this.$el);
    } else {
      if (this.animations && this.$el) {
        this.$el.setAttribute("style", "transform:translate3d(100%, 0, 0);");
      }
    }
  }
}
