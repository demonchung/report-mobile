<template>
  <div :class="[prefixCls, position]">
    <a-avatar v-bind="avatar" class="avatar"></a-avatar>
    <div>
      <div :class="[`${prefixCls}__wrap`, 'noChart']">
        <div :class="`${prefixCls}__content`">
          <div v-if="title" :class="`${prefixCls}__title`">
            <img :src="require('@h3/report-mobile/basics/assets/common/ai-wave.png')" style="height: 28px;width: 28px;margin-right: 8px"/> {{ title }} </div>
          <div v-if="tip" :class="`${prefixCls}__tip`"> {{ tip }} </div>
          <div v-if="message && !loading" :class="`${prefixCls}__message`"> 
            <img 
              v-if="chart"
              :src="require('@h3/report-mobile/basics/assets/common/congratulate.png')" 
              style="height:16px;width:16px;"
            />
            {{ message }}
          </div>
          <div v-if="loading" :class="`${prefixCls}__loading`"> 
            {{ loadingMessage }}
            <loading></loading>
          </div>
          <div v-if="suggests.length > 0 && flag !== 'suggest'" :class="`${prefixCls}__suggests`"> 
            <div :class="`${prefixCls}__suggests-title`"> 
              <img :src="require('@h3/report-mobile/basics/assets/common/handup.svg')"/>
              {{ suggestTitle }}
            </div>
            <div 
              v-for="(suggest) in suggests" 
              :key="suggest" 
              :class="`${prefixCls}__suggests-item`"
              @mousedown="mousedown"
              @click="handleSuggestClick(suggest)"
            >
              <span>·&nbsp;</span>
              <div>{{ suggest }}</div>
            </div>
          </div>
        </div>
      </div>
      <div :class="`${prefixCls}__wrap`" v-if="showExtra">
        <div :class="`${prefixCls}__content`" v-if="suggests.length > 0 && flag === 'suggest'">
          <div :class="[`${prefixCls}__suggests`, 'noTitle']"> 
            <div :class="`${prefixCls}__suggests-title`"> 
              <img :src="require('@h3/report-mobile/basics/assets/common/handup.svg')"/>
              {{ suggestTitle }}
            </div>
            <div 
              v-for="(suggest) in suggests" 
              :key="suggest" 
              :class="`${prefixCls}__suggests-item`"
              @mousedown="mousedown"
              @click="handleSuggestClick(suggest)"
            >
              <span>·&nbsp;</span>
              <div>{{ suggest }}</div>
            </div>
          </div>
        </div> 
        
        <slot 
          v-else-if="chart"
          name="chart"
          :data="chart"
        ></slot>
        <div v-if="chart" :class="`${prefixCls}__feedback`">
          <span @click="handleFeedbackClick($event,1)" :class="['feedback-icon', { selected: feedback === 1 }]">
            <h3-svg name="like-stroke"></h3-svg>
          </span>
          <div class="divider-line"></div>
          <span @click="handleFeedbackClick($event,0)" :class="['feedback-icon', { selected: feedback === 0 }]">
            <h3-svg name="dislike-stroke"></h3-svg>
          </span>
          
        </div>
      </div>
    </div>
   
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { Avatar } from "@h3/antd-vue";
import Loading from "@h3/report-mobile/basics/components/dot-loading/index";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";

@Component({
  name: "h3-report-ai-chat",
  components: {
    AAvatar: Avatar,
    Loading,
    H3Svg: Svg
  }
})

export default class H3ReportAiChat extends Vue {
  // 外部接口
  @Prop({ default: () => "left" }) position!: "left" | "right";
  // 总条数
  @Prop({ default: () => {} }) avatar!: H3.Report.Avatar;
  @Prop({ default: () => "" }) message!: string;
  @Prop({ default: () => false }) loading!: boolean;
  @Prop({ default: () => "" }) title!: string;
  @Prop({ default: () => "" }) tip!: string;
  @Prop({ default: () => [] }) suggests!: Array<string>;
  @Prop({ default: () => null }) chart!:  H3.Report.Chart | null;
  @Prop({ default: () => "" }) flag!: "fail" | "suggest" | "";
  @Prop({ default: () => null }) feedback!: 0 | 1 | null;

  prefixCls: string = "report-ai-chat";

  suggestTitle = "推荐数据分析问题";
  
  
  loadingMessage = "分析中";
  
  showMessage: any = "";

  get showExtra() {
    return (this.suggests.length > 0 && this.flag === "suggest") || this.chart;
  }
  
  // get showMessage() {
  //   let tmpMessage = JSON.parse(this.message)? JSON.parse(this.message) : this.message;
  //   if(tmpMessage.status) {
  //     if(tmpMessage.status === 'guide') {
  //       return tmpMessage.text;
  //     } else if(tmpMessage.status === 'chartTemplate') {
  //       return tmpMessage.chart;
  //     } else if(tmpMessage.status === 'suggest') {
  //       return tmpMessage.suggest;
  //     }
  //   }
  // }
  
  /**
   * 转换ai返回信息,是
   */
//   transformMessage() {
//     this.showMessage = this.message;
//     if(this.message) {
//       try {
//         this.showMessage = JSON.parse(this.message);
//         if(this.showMessage.status === 'guide') {
//         this.showMessage =  this.showMessage.text;
//         } 
//       if(this.showMessage.status === 'chartTemplate') {
//       // 处理图表能否被生成的逻辑

//       } 
//     } catch (error) {
//       this.showMessage = this.message
//       // 如果解析失败，捕获异常并处理
//       // console.warn('Ai JSON parsing error:', error);
//     }
//   }
// }
  mousedown(e) {
    e.preventDefault();
  }

  /**
   * 推荐问题, 获取图表模板
   */
  handleSuggestClick(text) {
    this.$emit("chat", text);
  } 

  /**
   * 反馈
   */
  handleFeedbackClick(e,value) {
      // 添加带有动画的 class
      e.target.classList.add('animation');
  
    //等待动画结束后移除 class
      setTimeout(() => {
        e.target.classList.remove('animation');
      }, 500);
    this.$emit("feedback", value);
  }
  mounted() {
    // this.transformMessage()
  }
}

</script>
<style lang="less">
.report-ai-chat.left {
  .avatar {
      margin-right: 12px;
  }
  .report-ai-chat__wrap,.report-ai-chat__content  { 
    border-radius: 3px 7px 7px 7px;
  }
  .report-ai-chat__wrap {
    background: linear-gradient(119deg, rgba(194, 164, 255, 0.53), rgba(126, 177, 250, 0.79), rgba(86, 195, 246, 0.58));
    border-radius: 4px 8px 8px 8px;
  }
  .report-ai-chat__content {
    background: #fff;
  }
}
.report-ai-chat.right {
  .avatar {
    margin-left: 12px;
  }
  .report-ai-chat__wrap,.report-ai-chat__content {
    border-radius: 8px 4px 8px 8px;
    background: #CCDFFE;
  }
  flex-direction: row-reverse;
  .report-ai-chat__message {
    img {
      display: none;
    }
  }
}
.report-ai-chat {
    display: flex;
    margin-bottom: 36px;
    .h3-chart-frame {
      border-radius: 3px 7px 7px 7px;
      background: #fff;
    }
    &__wrap {
        padding: 1px;
        margin-bottom: 6px;
        position: relative;
        max-width: 430px; // 主要限制图表的宽度
    }
    &__wrap.noChart {
      display: inline-block;
    }
    &__content {
        display: flex;
        flex-direction: column;
        padding: 12px;
        max-width: 428px;
        user-select: text;

    }
    &__chart {
      background: #fff;
    }
    &__title {
            font-size: 16px;
            font-weight: bold;
            color: #111218;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }
    &__tip {
            font-size: 13px;
            color: #707481;
            line-height: 22px;
        }
    &__message {
            font-size: 13px;
            color: #121933;
        }
    &__suggests {
            border-top: 1px dashed rgba(17,18,24,0.1);
            margin-top: 18px;
            padding-top: 18px;   
        &-title {
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 8px;
            line-height: 20px;
            color: #111218;
            display: flex;
            align-items: center;
            img {
              margin-right: 4px;
            }
        }
        &-item {
            font-size: 13px;
            color: #707481;
            line-height: 22px;
            margin-top: 10px;
            cursor: pointer;
            display: flex;
          &:hover {
            color: #121933;
          }
        }
        &-item:last-child {
            margin-bottom: 0px;
        }
    }
    &__suggests.noTitle {
      margin-top: 0px;
      padding: 6px;
      border-top: none;
    }
    &__loading {
      display: flex;
      align-items: center;
      .h3-report-loading {
        margin-left: 8px;
      }
    }
    &__feedback {
      position: absolute;
      display: flex;
      align-items: center;
      bottom: -22px;
      right: 0px;
      height: 18px;
      transition: background-color 0.3s ease; /* 添加颜色变化的过渡效果 */
      transform-origin: center bottom;
      
      .feedback-icon {
        width: 18px;
        cursor: pointer;
        display: inline-flex;
        margin-right: 12px;
        .report-icon {
          fill: #707481;
        }
          /* 添加点击动画效果 */
        .report-icon.animation {
          animation: thumbAnimation cubic-bezier(1, 0, 0, 1) 1s;

        }
        &:last-child {
          margin-right: 0px;
        }
        &:hover {
          .report-icon {
            fill: #315EFB;
            width: 18px !important;
            height: 18px !important;
          }
        }
      }
      .feedback-icon.selected {
        .report-icon {
          fill: #315EFB;
        }
      }
      .feedback-icon.disabled {
        pointer-events: none;
        &:hover {
          .report-icon {
            fill: #707481;
            width: 16px !important;
            height: 16px !important;
          }
        }
      }
      .divider-line {
        position: absolute;
        display: flex;
        left: 50%;
        margin-left: -1px;
        border-right: 1px solid rgba(209,211,228,0.61);
        height: 12px;
      }
    }
}

@keyframes thumbAnimation {
  0% {
    transform: rotate(0) translateY(0);
  }
  10% {
    transform: rotate(45deg) translateY(0);
  }
  40% {
    transform: rotate(-15deg) translateY(-3px);
  }
  60% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg) translateY(0)  scale(1.1);
  }
  100% {
    transform: rotate(0deg) translateY(0);
  }
}

</style>
