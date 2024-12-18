<template>
  <div :class="prefixCls">
    <div class="input-items-wrap">
      <div
        class="input-item"
        v-for="(item, index) in items"
        :key="index"
      >
        <span>{{ item }}</span>
        <span @click="removeInput(index)" style="margin-left:8px"> 
          <h3-svg name="cross-stroke" color="#707481" w="12" h="12"></h3-svg>
        </span>
      </div>
      <div
        class="input-btn"
        v-if="!showIpt"
        @click="showInput"
      >
        {{ $r_language.Ddesign.stage_filter.pla_strIn }}
      </div>
    </div>

    <div
      class="input-area-wrap"
      v-if="showIpt"
      :class="{'red': currLen == maxLen}"
    >
      <div
        class="input-area-txt"
        contenteditable="true"
        ref="ipt"
        @keydown.enter="onEnter($event)"
        @input="onInput($event)"
        @blur="onEnter($event)"
      ></div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { getCursortPosition, setCaretPosition } from '@h3/report-mobile/basics/utils/global';
// eslint-disable-next-line import/first
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";

@Component({
  name: 'h3-multi-input',
  components: {
    H3Svg: Svg
  }
})
export default class MultiInput extends Vue {
    @Prop() items!: string[];

    prefixCls = 'h3-report-multi-input';
    showIpt: boolean = false;
    currLen: number = 0;
    maxLen: number = 200;
    tipStart: number = 150;

    showInput() {
      this.showIpt = true;
      this.$nextTick(() => {
        (this.$refs.ipt as HTMLElement).focus();
      });
    }

    closeInput() {
      this.showIpt = false;
    }

    removeInput(i) {
      this.items.splice(i, 1);
      this.$emit('multi-input', this.items);
    }

    onEnter(e) {
      let value = e.target.innerText.trim();
      value = value.replaceAll("\u00a0","\u0020");
      if (value) {
        this.items.push(value);
      }

      e.target.innerText = '';
      e.cancelBubble = true;
      e.returnValue = false;

      this.closeInput();
      this.$emit('multi-input', this.items);

      return false;
    }

    onInput(e) {
      const len = e.target.innerText.length;
      if (len > this.maxLen) {
        let pos = getCursortPosition(e.target);
        if (pos > this.maxLen) {
          pos = this.maxLen;
        }
        e.target.innerText = e.target.innerText.substr(0, this.maxLen);
        setCaretPosition(e.target, pos);
      }

      this.currLen = e.target.innerText.length;
      let tip: string = '';
      if (this.currLen > this.tipStart) {
        tip = ` ${this.currLen}/${this.maxLen}`;
      }
      (this.$refs.ipt as HTMLElement).dataset.afterdata = tip;
    }
}
</script>

<style lang="less">
@import "~@h3/report-mobile/basics/styles/theme.less";
.h3-report-multi-input {
  border: 1px solid #D4D7E0;
  background-color: #fff;
  border-radius: 4px;
  padding: 0px 12px;

  .input-items-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -4px;

    .input-item {
      position: relative;
      display: inline-block;
      height: 22px;
      line-height: 20px;
      background: @report-background-color;
      border: 1px solid #D4D7E0;
      border-radius: 4px;
      padding: 0 8px;
      margin: 4px;

      max-width: calc(100% - 8px);
      overflow: hidden;

      span {
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      em {
        position: absolute;
        top: 0;
        right: 4px;
        font-size: 12px;
        line-height: 20px;
        margin-left: 4px;
        transform: scale(0.8);
        color: #8893A7;
        cursor: pointer;
      }
    }
  }

  .input-btn {
    display: inline-block;
    margin: 4px;
    width: 150px;
    height: 22px;
    line-height: 20px;
    border-radius: 4px;
    border: 1px dashed #D4D7E0;
    font-size: 12px;
    font-weight: 400;
    color: #C9CCD8;
    text-align: center;
    cursor: pointer;
  }

  .input-area-wrap {
    position: relative;
    border-radius: 4px;
    border: 1px dashed #D4D7E0;
    padding: 5px 8px;
    margin: 4px 0;
    font-size: 14px;
    min-width: 200px;
    &.red {
      border: 1px dashed #FF4384;

      .input-area-txt::after {
        color: #FF4384;
      }
    }

    .input-area-txt {
      color: #304265;
      line-height: 26px;
      outline: none;
      min-height: 52px;

    }

    .input-area-txt::after {
      content: attr(data-afterdata);
      line-height: 26px;
    }

    .clearfix {
      clear: both;
      font-size: 0;
    }
  }

  // .input-area-wrap::after{
  //     clear: both;
  //     font-size: 0;
  // }
}
</style>
