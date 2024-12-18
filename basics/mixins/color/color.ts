import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class HandleColorPicker extends Vue {
  colorWarp!: NodeList;
  colorPickerPosition(el: Element) {
    const colorBox = el.querySelector(".box") as HTMLDivElement;
    const rect: DOMRect = el.getBoundingClientRect();
    const boxWidth = 212;
    const boxHeight = 257;
    const height = window.innerHeight;
    let left = rect.left;
    colorBox.style.width = `${boxWidth}px`;
    colorBox.style.height = `${boxHeight}px`;
    colorBox.style.position = "fixed";
    if (rect.left + boxWidth > window.innerWidth) {
      left = rect.right - boxWidth;
    }
    if (rect.y > height / 2) {
      colorBox.style.top = `${rect.top - boxHeight - 12}px`;
      colorBox.style.left = `${rect.left}px`;
    } else {
      colorBox.style.top = `${rect.top + el.clientHeight}px`;
    }

    colorBox.style.left = `${left}px`;
  }

  /**
   * 批量处理
   */
  batchColorPickerPosition() {
    this.colorWarp = this.$el.querySelectorAll(".m-colorPicker");
    this.colorWarp.forEach((el: Element) => {
      if (el.parentElement) {
        this.colorPickerPosition(el.parentElement as HTMLDivElement);
        el.parentElement.addEventListener(
          "click",
          (e: Event) => {
            this.colorPickerPosition(el.parentElement as HTMLDivElement);
          },
          true
        );
      }
    });
  }

  mounted() {
    this.batchColorPickerPosition();
  }
  destroy() {
    window.removeEventListener("resize", this.batchColorPickerPosition, false);
  }
}
