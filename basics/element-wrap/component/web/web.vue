<template>
  <div :class="[prefixCls, editable ? `${prefixCls}__canEdit` : '']">
    <div class="h3-report-web-wrap__title"></div>
    <iframe
      :src="chart.content"
      frameborder="0"
      :scrolling="false"
      title="title"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ThemeColorType } from "@h3/report-mobile/basics/enum/paint";

import { Icon,message } from "@h3/antd-vue";

@Component({
  name: "h3-report-web-wrap",
  components: {
    H3Icon: Icon,
  }
})
export default class ImageWrap extends Vue {
  @Prop() chart!: H3.Report.WEB;
  @Prop() global!: H3.Report.Global;
  @Prop({ default: "design" }) status!: "design" | "report" | "preview";
  @Inject({ default: () => {} }) focus?: Function;
  @Inject({ default: () => {} }) blur?: Function;
  @Prop({ default: true }) editable!: boolean; // 是否可以编辑表盘
  loading: boolean =false;
  prefixCls: string = "h3-report-web-wrap";
  message = message;
  
  get isTransparent() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark"
  }

  /**
   * 组件背景颜色设置
   */
  get getStyles() {
    const globalCoat = this.global.styles.elementCoat ? this.global.styles.elementCoat : null;
    return { color: this.global.styles.fontSetting.fontColor };
  }
  
  
  created() {
    
  }
  
  mounted() {
  }
}
</script>

<style lang="less">
.h3-report-web-wrap {
  height:100%;
  width:100%;
  position:relative;
  iframe{
    width:100%;
    height: 100%;
  }
}
.h3-report-web-wrap__canEdit{
  padding:20px;
}
.h3-report-web-wrap__title{
  position:absolute;
  top: 0;
  left:0;
  height:20px;
  width:100%;
}
</style>
