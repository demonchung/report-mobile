<template>
  <div :class="[prefixCls, { 'h3-report-long-text-edit': isEdit }]" :style="getStyles">
    <quill-editor
      ref="quillEditor"
      :class="['editor', $r_languageType === 'en' ? 'en' : '']"
      v-if="isEdit"
      v-model="content"
      :options="editorOption"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    >
    </quill-editor>
    <div class="ql-editor" v-else>
      <div class="ql-container" v-html="content"></div>
      <span v-show="showPlaceHolder" class="placeholder">{{
        $r_language.el.longtext.tip_empty
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { Quill, quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

@Component({
  name: "h3-report-long-text-wrap",
  components: {
    quillEditor
  }
})
export default class LongTextWrap extends Vue {
  @Prop() chart!: H3.Report.LongText;
  @Prop() global!: H3.Report.Global;
  @Prop({ default: "design" }) status!: "design" | "report" | "preview";
  @Inject({ default: () => {} }) focus?: Function;
  @Inject({ default: () => {} }) blur?: Function;
  isEdit: boolean = false;
  attachElement: Element | null = null;
  prefixCls: string = "h3-report-long-text-wrap";
  content: string = "";
  maxLength: number = 500;
  get editorOption() {
    return {
      modules: {
        toolbar: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ color: [] }, "link"],
          ["bold", "italic", "underline"],
          [{ align: "" }, { align: "center" }, { align: "right" }]
        ]
      },
      placeholder: this.$r_language.el.longtext.input_pla
    };
  }

  composing: boolean = false; // 是否处在合成输入阶段
  el: any = null;
  @Watch("chart.edit", { immediate: true })
  watchEdit(v) {
    // if (this.status !== "design") return;
    this.isEdit = v;
    this.$nextTick(() => {
      if (this.isEdit && this.$refs.quillEditor) {
        const qlEditor = this.$el.querySelector(".ql-editor") as HTMLDivElement;
        qlEditor.focus();
        // 工具栏位置调整
        const toolbar = this.$el.querySelector(".ql-toolbar");
        // todo toolbar add class, 根据type;
        if (toolbar) {
          this.attachElement = toolbar;
          this.attachElementToBody();
        }
      } else {
        this.dettachElementFromBody();
      }
    });
  }

  /**
   * 组件背景颜色设置
   */
  get getStyles() {
    const globalCoat = this.global.styles.elementCoat ? this.global.styles.elementCoat : null;

    return { color: this.global.styles.fontSetting.fontColor };
  }

  get showPlaceHolder() {
    return !this.content || this.content === this.editorOption.placeholder;
  }
  created() {
    const { content } = this.chart;
    this.content = content;

    this.$emit("register-refresh", {
      data: () => {},
      view: () => {}
    });
  }

  beforeDestroy() {
    this.dettachElementFromBody();
  }

  // 编辑状态时阻止页面滚动
  forbidScroll(e) {
    console.log(e);
    e.preventDefault && e.preventDefault();
    e.returnValue = false;
    e.stopPropagation && e.stopPropagation();
    return false;
  }

  attachElementToBody() {
    if (this.attachElement) {
      const { top, left } = this.$el.getBoundingClientRect();
      (this.attachElement as any).style.top = `${top - 36}px`;
      (this.attachElement as any).style.left = `${left}px`;
      (this.attachElement as any).style.zIndex = 1000;
      document.body.appendChild(this.attachElement);
      //document.addEventListener("mousewheel", this.forbidScroll, { passive: false });
      if ((document as any).querySelector(".h3-dashboard-container__canvas")) {
        (document as any).querySelector(".h3-dashboard-container__canvas").style.overflow =
          "hidden";
      }
      // this.el && this.el.addEventListener("mousewheel", this.forbidScroll, { passive: false })
    }
  }
  dettachElementFromBody() {
    if (this.attachElement && this.attachElement.parentNode) {
      this.attachElement.parentNode.removeChild(this.attachElement);
    }
    if ((document as any).querySelector(".h3-dashboard-container__canvas")) {
      (document as any).querySelector(".h3-dashboard-container__canvas").style.overflow = "scroll";
    }
    //document.removeEventListener("mousewheel", this.forbidScroll);
    //this.el && this.el.document.removeEventListener("mousewheel", this.forbidScroll);
  }

  onEditorFocus(v) {
    if (v.relatedTarget) {
      if (v.relatedTarget.className === "ql-link") {
        this.$nextTick(() => {
          const linkEl = this.$el.querySelector(
            ".h3-report-long-text-wrap .ql-editing"
          ) as HTMLDivElement;
          console.dir(linkEl);
          if (linkEl.style.left) {
            const left = linkEl.style.left;
            if (left.indexOf("-") === 0) {
              linkEl.style.left = "1px";
            }
          }
        });
      }
    }
    this.isEdit = true;
    if (this.focus) {
      this.focus(this.chart);
    }
  }
  onEditorKeyDown(e) {
    const { quill } = this.$refs.quillEditor as any;
    const length = quill.getLength();
    if (e.key !== "Backspace" && e.key !== "Delete" && length > this.maxLength) {
      e.cancelBubble = true;
      e.returnValue = false;
    }
  }
  onEditorPaste() {
    setTimeout(() => {
      this.maxLengthLimit();
    }, 0);
  }
  onEditorChange(v: any) {
    this.$set(this.chart, "content", v.html);
  }
  maxLengthLimit() {
    const { quill } = this.$refs.quillEditor as any;
    const length = quill.getLength();
    if (length > this.maxLength) {
      quill.deleteText(this.maxLength, length - this.maxLength);
      // const delta = quill.getContents(0, this.maxLength);
      // quill.setContents(delta);
    }
  }

  onEditorComposeStart(e) {
    this.composing = true;
  }
  onEditorInput(e) {
    if (this.composing) {
      this.maxLengthLimit();
    }
  }
  onEditorComposeEnd(e) {
    this.composing = false;
  }
  addEditEvent() {
    const qlEditor = this.$el.querySelector(".ql-editor");
    if (qlEditor) {
      qlEditor.addEventListener("focus", this.onEditorFocus, false);
      qlEditor.addEventListener("keydown", this.onEditorKeyDown, false);
      qlEditor.addEventListener("paste", this.onEditorPaste, false);
      qlEditor.addEventListener("compositionstart", this.onEditorComposeStart, false);
      qlEditor.addEventListener("input", this.onEditorInput, false);
      qlEditor.addEventListener("compositionend", this.onEditorComposeEnd, false);
    }
  }
  updated() {
    this.addEditEvent();
  }
  mounted() {
    this.addEditEvent();
  }
}
</script>

<style lang="less">
@import "~@h3/report-mobile/basics/styles/scroll.less";
@import "~@h3/report-mobile/basics/styles/components.less";

.vue-grid-item.longText {
  overflow: visible;
}
.h3-report-long-text-wrap {
  padding-right: 8px;
  padding-bottom: 8px;
  // height: calc(100% - 20px);
  height: 100%;
  position: relative;
  .editor {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .ql-editor.editor {
    -webkit-user-select: text;
  }
  .quill-editor,
  .ql-editor {
    // overflow-y: scroll;
    //.vertical-scrollbar-hide()
    .visible-scrollbar();
  }
  .ql-editor {
    padding: 10px 12px 8px 16px !important;
  }
  .ql-snow .ql-picker-options .ql-picker-item {
    outline: none;
  }
  .en {
  }
  .ql-snow .ql-tooltip::before {
    content: "请输入链接地址:";
  }
  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    content: "保存";
  }
  .ql-snow .ql-tooltip a.ql-action::after {
    content: "编辑";
  }
  .ql-snow .ql-tooltip a.ql-remove::before {
    content: "删除";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "正常";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "小号";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "大号";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "巨号";
  }
}
.h3-report-long-text-edit {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  // .ql-toolbar {
  //   position: absolute;
  //   // top: -36px;
  //   background: #fff;
  //   box-shadow: 0px 0px 8px 0px #e0e5f0;
  //   border-radius: 4px;
  //   padding: 3px 8px;
  // }
  .ql-container.ql-snow {
    border: none;
  }
}
span.placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  color: #707481;
}
.ql-toolbar {
  position: fixed;
  background: #fff;
  box-shadow: 0px 0px 8px 0px #e0e5f0;
  border-radius: 4px;
  padding-top: 3px !important;
  padding-bottom: 3px !important;
}
.ql-toolbar.ql-snow {
  padding: 0;
}
.ql-editor.ql-blank::before {
  color: #c1c3c9;
}
.ql-snow .ql-picker-label {
  padding-left: 16px;
}
.ql-toolbar .ql-formats .ql-stroke {
  stroke: #707481;
}

.ql-container {
  height: auto;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "小";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "默认";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "大";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "超大";
}
</style>
