<template>
  <div :class="prefixCls">
    <div v-if="imageUrl" :class="`${prefixCls}__img`" :style="getImgStyles"></div>
    <h3-upload
      v-else-if="!isMobile && editable"
      name="file"
      list-type="picture"
      :class="[`${prefixCls}-upload`]"
      :show-upload-list="false"
      :action="actionAddress"
      :customRequest="customRequest"
      :accept="acceptData"
      :before-upload="beforeUpload"
    >
      <div :class="[`${prefixCls}-box`]" :style="getStyles" v-if="!loading">
        <!-- #121933;  #707481; -->
        <div style="font-size: 50px;color: #315EFB;line-height: 60px">+</div>
        <div style="font-size: 13px;">{{ $r_language.el.image.tip_empty }}</div>
        <div style="font-size: 12px;line-height:20px">{{ $r_language.el.image.tip_size }}</div>
      </div>
      <h3-loading v-else :message="$r_language.el.image.message"></h3-loading>
    </h3-upload>
    <div v-else :class="[`${prefixCls}-box`]" :style="getStyles">
      <div style="font-size: 13px;">暂无图片</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import { Mutation, Action, State, namespace } from "vuex-class";
import { ThemeColorType } from "@h3/report-mobile/basics/enum/paint";
import { getBase64, checkImage } from "@h3/report-mobile/basics/utils/image";
import { dashboardApi } from "@h3/report-mobile/basics/service/dashboard";

import { Icon, Upload, message } from "@h3/antd-vue";
import H3Loading from "@h3/report-mobile/basics/components/loading";
import { isMobile } from "@h3/report-mobile/basics/utils/browser";
import options from "@h3/report-mobile/dist/options.js";
@Component({
  name: "h3-report-image-wrap",
  components: {
    H3Icon: Icon,
    H3Upload: Upload,
    H3Loading
  }
})
export default class ImageWrap extends Vue {
  @Prop() chart!: H3.Report.Image;
  @Prop() global!: H3.Report.Global;
  @Prop({ default: "design" }) status!: "design" | "report" | "preview";
  @Inject({ default: () => {} }) focus?: Function;
  @Inject({ default: () => {} }) blur?: Function;
  @Prop({ default: true }) editable!: boolean; // 是否可以编辑表盘

  actionAddress: any = null;
  imageUrl: string = "";
  fileName: string = "";
  loading: boolean = false;
  prefixCls: string = "h3-report-image-wrap";
  message = message;
  showMode: string | undefined = "originCenter";
  isMobile = isMobile;
  acceptData = ".jpg, .jpeg, .png, .gif";
  @Watch("chart.showMode", { immediate: true })
  watchShowMode(newV, oldV) {
    this.showMode = newV;
  }

  get isTransparent() {
    return ThemeColorType[this.global.styles.paintCoatTheme] === "dark";
  }
  get getImgStyles() {
    if (this.imageUrl) {
      switch (this.showMode) {
        case "origin": //原图裁剪
          return {
            "background-image": `url(${this.imageUrl})`,
            "background-size": "cover",
            "background-repeat": " no-repeat",
            "background-position": "center"
          };
        case "originCenter": //原图居中
          return {
            "background-image": `url(${this.imageUrl})`,
            "background-size": "contain",
            "background-repeat": "no-repeat",
            "background-position": "center"
          };
        default:
          //拉伸
          return {
            "background-image": `url(${this.imageUrl})`,
            "background-size": "100% 100%",
            height: "100%"
          };
      }
    } else {
      return {};
    }
  }

  /**
   * 组件背景颜色设置
   */
  get getStyles() {
    return { color: this.global.styles.fontSetting.fontColor };
  }

  async customRequest(params) {
    if (!this.editable) {
      this.message.warning(this.$r_language.el.image.warn_fail);
      return;
    }
    const key = "onlyKey";
    this.message.loading({ content: this.$r_language.el.image.tip_loading, key });

    if(options.imageComponentConfig && options.imageComponentConfig.customUpdata) {
      options.imageComponentConfig.customUpdata(params).then(data=> {
        this.updataImage({name: params.file.name, url: data,showMode: 'originCenter'});
        this.message.success({ content: this.$r_language.el.image.tip_success, key, duration: 1 });
      });
    } else {
      const res = await dashboardApi.getAttachment(
      params.file.name,
      this.chart.uid,
      this.$r_languageType
      );
      const formData = new FormData();
      formData.append("file", params.file);
      dashboardApi.uploadFile(res, formData, this.$r_languageType).then(data => {
        this.updataImage({name: params.file.name, url: data,showMode: 'originCenter'});
        this.message.success({ content: this.$r_language.el.image.tip_success, key, duration: 1 });
      });
    }
  }

  updataImage({name, url, showMode}) {
    if(url) {
      this.imageUrl = url;
      this.$set(this.chart, "content", url);
    }
    if(name) {
      this.$set(this.chart, "fileName", name);
    }
    if(showMode) { 
      this.$set(this.chart, "showMode", showMode);
    }
    this.$emit("upload-chart", this.chart);
  }
  /**
   * 处理上传
   */
  // handleChange(info) {
  //   console.log(info,'info====');
  //   if(!this.editable) return;
  //   if (info.file.status === 'uploading') {
  //     this.loading = true;
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // todo
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, imageUrl => {
  //       console.log(imageUrl,'11111111111111');
  //       this.$set(this.chart, "content",this.imageUrl);
  //       this.$set(this.chart, "fileName",info.file.name);
  //       this.loading = false;
  //     });
  //   }
  // }
  /**
   * 组件背景颜色设置
   */
  beforeUpload(file) {
    const res = checkImage(file);
    if (!res.check) {
      const tip = this.$r_gt(res.message, this.$r_languageType);
      //this.message.error(res.message);
      this.message.error(tip);
    }
    return res.check;
  }

  created() {
    const { content, fileName, showMode } = this.chart;
    if(options.imageComponentCongfig && options.imageComponentCongfig.imageType) {
      this.acceptData = options.imageComponentCongfig.imageType.map(item => `.${item}`).join(",");
    }
    this.actionAddress = "";
    this.imageUrl = content;
    this.fileName = fileName;
    this.showMode = showMode || "originCenter";
    this.$emit("register-refresh", {
      data: () => {
        this.imageUrl = this.chart.content;
      },
      view: () => {
        this.imageUrl = this.chart.content;
      }
    });
  }

  mounted() {
    setTimeout(() => {});
  }
}
</script>

<style lang="less">
.h3-report-image-wrap {
  height: 100%;
  &-upload {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  &__img {
    height: 98%;
  }
}
</style>
