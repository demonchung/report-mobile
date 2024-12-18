<script lang="ts">
import {CreateElement, VNode} from 'vue';
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  Modal, Button
} from '@h3/antd-vue';


@Component({
  name: 'form-confirm'
})
/**
 * 表单确认窗体
 */
export default class FormConfirm extends Vue {
  @Prop({
    default: null
  }) title!: string;// 标题
  @Prop({
    default: null
  }) content!: string | Function;// 内容
  @Prop({
    default: 600
  }) width!: number;// 宽度
  @Prop({
    default: true
  }) showMask!: boolean;// 是否显示遮罩
  @Prop({
    default: null
  }) ok!: Function;// 确定事件
  @Prop({
    default: null
  }) cancel!: Function;// 取消事件
  @Prop({
    default: () => null 
  }) buttons!: Array<H3.ReportConfirm.Button>; // 自定义按键
  @Prop({
    default: ''
  }) primaryButtonStyle!: string ;// 确认按钮的样式
  @Prop({
    default: ''
  }) wrapClassName!: string ;// wrap样式
 
  //翻译标题
  get turnTitle(){
    return this.$r_gt(this.title,this.$r_languageType)
  }

  render(h:CreateElement) {
    const self: this = this;
    const buttonsRender:any = [];
    let cops: VNode | null = null;

    if (typeof self.content === 'function') {
      cops = self.content(h);
    } else {
      cops = h('p', { ref: 'content' }, self.content);
    }
    if (this.buttons && this.buttons.length) {
    }else {
      buttonsRender.push(h(Button, {
        on: {
          click:async (e: any) => {
            if(this.cancel && cops) {
              e.contentVNode = cops.componentInstance || cops.context;
              const ret = await this.cancel(e);
              if(ret !== false) {
                self.$destroy();
              }
            }else {
              self.$destroy();
            }
          }
        }
      }, this.$r_language.normal.cancel));
      buttonsRender.push(h(Button, {
        domProps: {
          style: self.primaryButtonStyle
        },
        props: {
          type: 'primary'
        },
        on: {
          click: async (e: any) => {
            e.contentVNode = cops.componentInstance || cops.context;
            if(this.ok) {
              const ret = await this.ok(e);
              if(ret !== false) {
                self.$destroy();
              }
            }else {
              self.$destroy();
            }
          }
        }
      }, this.$r_language.normal.sure));
    }
    return h(
      Modal,
      {
        class: {
          'h3-report-form-confirm': true
        },
        props: {
          title: self.turnTitle,
          visible: true,
          width: self.width,
          maskClosable: false,
          centered:true,
          mask: self.showMask,
          wrapClassName: self.wrapClassName,
          footer: () => buttonsRender
        },
        on: {
          cancel: (e: any) => {
            self.$emit('cancel', cops);
            self.$destroy();
          }
        }
      }, [cops]
    );
  }

  destroyed() {
    this.$emit('destroy');
  }
}
</script>
