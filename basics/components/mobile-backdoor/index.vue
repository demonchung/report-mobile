<template>
  <div :class="[prefixCls, hasSlot ? '' : `${prefixCls}-free`]" @click="showVersion">
    <slot></slot>
    <h3-modal
      v-model="showModal"
      :showCancel="false"
      confirmText="确定"
      title="系统版本号"
    >
      <p>前端版本号: {{ webVersion }}</p>
      <p>后端版本号: {{ version }}</p>
      <p>代码版本: {{ pomVersion }}</p>
      <p>构建时间: {{ buildTimestamp }}</p>
    </h3-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { H3Modal } from "@h3/thinking-ui";
import fetch from "@h3/report-mobile/basics/config/fetch";
import axios from "axios";
import env from "../../config/env";

/**
 * 用法：
 * 1.嵌套使用，例如<backdoor><item></backdoor>，此时点击item即可触发
 * 2.直接使用，例如<backdoor />，此时会绝对定位在页面右下角20*20的区域，点击触发
 */

@Component({
  name: "h3-report-backdoor",
  components: {
    H3Modal
  }
})
export default class Backdoor extends Vue {
  prefixCls: string = "h3-report-backdoor";
  count: number = 0;
  countdown: any = 0;
  canGetVersion: boolean = true;
  version: string = "";
  modal: any;
  buildTimestamp: string = "";
  pomVersion: string = "";
  showModal: boolean = false;
  webVersion: string = (window as any).rx_report || "";

  get hasSlot() {
    return this.$slots.default && this.$slots.default.length > 0;
  }

  //点击开始计时，3秒内点击10次
  showVersion() {
    if (this.canGetVersion) {
      this.count++;
      if (!this.countdown) {
        this.countdown = setTimeout(() => {
          this.deleteTimeout();
        }, 3000);
      }

      if (this.count >= 10) {
        this.getVersion().then((res: any) => {
          this.version = res.version;
          this.pomVersion = res.pomVersion;
          this.buildTimestamp = res.buildTimestamp;
          this.showModal = true;
        });
      }
    }
  }

  getVersion() {
    if (this.canGetVersion) {
      this.canGetVersion = false;
      setTimeout(() => {
        this.canGetVersion = true;
      }, 5000);

      return new Promise((resolve, reject) => {
        const req = fetch<H3.ReportAPI.ProResponse>({
          url: `dashboard/v1/service/info`,
          method: "get",
          data: {}
        }).promise;

        req
          .then((res: H3.ReportAPI.ProResponse) => {
            if (res && res.data) {
              resolve(res.data);
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    } else {
      return new Promise(resolve => {
        resolve();
      });
    }
  }

  deleteTimeout() {
    this.count = 0;
    clearTimeout(this.countdown);
    this.countdown = null;
  }
}
</script>
<style lang="less">
.h3-report-backdoor {
  width: 100%;
}
.h3-report-backdoor-free {
  width: 20px;
  height: 20px;
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
