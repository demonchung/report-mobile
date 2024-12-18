<template>
  <div :class="[prefixCls]">
    <div :class="`${prefixCls}__content`" ref="chatWrap">
      <chat 
        :title="aiTitle"
        :tip="aiTip" 
        :suggests="suggests"
        position="left"
        :avatar="avatarMap.assistant"
        @chat="sendMessage($event, questionType.select)"
      >
      </chat>
      <chat 
        v-for="(message, index) in messages" 
        :key="index"
        :suggests="message.suggests"
        :chart="message.chart"
        :message="message.content" 
        :flag="message.flag"
        :position="positionMap[message.role]"
        :avatar="avatarMap[message.role]"
        :feedback="message.feedback"
        @chat="sendMessage($event, questionType.select)"
        @feedback="handleFeedback($event, index)"
      >
        <template slot="chart" slot-scope="{data}">
          <slot name="chart" :data="data"></slot>
        </template>
      </chat>
      <chat 
        v-if="loading"
        :message="loadingText" 
        :loading="loading" 
        position="left"
        :avatar="avatarMap.assistant"
      >
      </chat>
    </div>
    <div :class="`${prefixCls}__footer`">
      <div :class="[`${prefixCls}__operate`]">
        <div :class="[`${prefixCls}__operate-item`]" @click="clearMessage">
          <h3-svg 
            name="eliminate-stroke" 
            w="14" 
            h="14"
            color="#315EFB"
          ></h3-svg>
          <span class="title">清除对话</span>
        </div>
        <div v-if="suggests.length > 0" :class="[`${prefixCls}__operate-item`]" @click="sendMessage(suggestBtnMessage, questionType.select, true)">
          <h3-svg 
            name="robot-stoke" 
            w="14" 
            h="14"
            color="#0ABF5B"
          ></h3-svg>
          <span class="title"> {{ suggestBtnMessage }}</span>
        </div>
      </div>
      <dialog-input
        ref="dialogInput"
        :class="[`${prefixCls}__dialog`]"
        :placeholder="placeholder"
        :suggests="suggests"
        @chat="sendMessage($event, questionType.input)"
      ></dialog-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from "vue-property-decorator";
import { Input, Message } from "@h3/antd-vue";
import { analysisApi } from "@h3/report-mobile/basics/service/analysis";
import Chat from "./chat.vue";
import { watch } from "fs";
import DialogInput from "./dialog-input";
import { transformAIChart, checkChart } from "./create-chart";
import Svg from "@h3/report-mobile/basics/components/icon-svg/index";
import { uuid } from "@h3/report-mobile/basics/utils/uid";


@Component({
  name: "h3-report-ai-dialog",
  components: {
    Chat,
    AInput: Input,
    DialogInput,
    H3Svg: Svg
  }
})

export default class H3ReportAiDialog extends Vue {
  // 外部接口
  @Prop({ default: () => analysisApi }) api!: H3.ReportAPI.Instance;
  @Prop({ default: () => {} }) chatApi!: Function;
  @Prop({ default: () => {} }) aiConfig!: H3.Report.AiDialogConfig; // AI配置
  @Prop({ default: () => {} }) dataSource!: H3.Report.DataSource; // 表结构
  @Prop({ default: () => '' }) id!: string; // 对话id，用来匹配是否是同源，非同源清除对话
  @Prop({ default: () => '' }) sceneType!: string; // 场景类型 analysis:统计分析分析


  prefixCls: string = "report-ai-dialog";
  messages: Array<H3.Report.AiDialogContent> = []; // 对话消息的数组
  suggests: Array<string> = []; // AI的建议
  userInput: string =  ''; // 用户输入的文本
  loading:boolean =  false; // 用于表示是否在等待AI回复的状态
  loadingText = "分析中";
  aiTitle = "你好,我是AI数据分析助手,可以辅助您创建图表";
  successMessage = "已经为您完成图表生成，如果需更改图表设置,请在编辑区域进行更改";
  failMessage="抱歉，图表生成过程中出现问题，您可以尝试换一种方式进行回答，或者重新向我提问"
  aiTip = "只需要在输入框简单描述关注的数据指标或问题，即可自动为你生成相应的图表。";
  placeholder: string = "请输入您的数据分析诉求...";
  suggestText: string = "根据表结构的复杂度,生成1-5个分析问题";
  suggestMessage: string = "已经为您生成数据分析问题";
  suggestBtnMessage: string = "推荐分析问题";
  aiBusyText: string = "对话响应中,请稍等";
  errorText = '抱歉，本次问答可能触发了模型限制或者其他问题，您可以尝试用不同的方式再问一次';

  templateData: any = null;
  positionMap = { // 位置映射
    user: 'right',
    assistant: 'left',
    system: 'left'
  }
  avatarMap = {
    user: {
      shape: "circle",
      size: 32,
      src: require("../../assets/common/user-avatar.png")
    },
    assistant: {
      shape: "circle",
      size: 32,
      src: require("../../assets/common/ai-avatar.svg")
    },
  }
  // 问题类型
  questionType = {
    select: 0, // 表示系统生成的问题
    input: 1, // 表示用户输入问题
    getSuggest: 2 // 表示用户输入问题
  }
  // 问题响应成功与否
  questionResult = {
    success: 1,
    fail: 0
  }
  // 有无可用图表
  availableChart = {
    have: 1,
    nohave: 0
  }
  //当前对话是否返回图表模板，0：表示不是模板，1：表示是模板
  ischartTemplate = {
    right: 1, 
    not: 0
  }
  /**
   * 监听对话消息的变化
   * @param val 对话消息的数组
   */
  // @Watch("aiMessages", { immediate: true })
  // handleAiDialogChange(val: Array<H3.Report.AiDialogContent>) {
  //   if(val) {
  //     this.messages = val;
  //   }
  // }
  /**
   * 处理历史对话
   */
  getHistories() {
    // 只需要用户对话,且是正常请求的对话
    let histories = this.messages.filter((item) => {
      return  item.flag !== 'fail' && item.flag !== 'suggest'
    }).map((item) => {
      return {
        content: item.origin || item.content,
        role: item.role
      };
    });
    return histories;
  }
  /**
   * 滚动到底部
   */
  scrollBottom() {
      this.$nextTick(() => { 
        let chatWrap = this.$refs.chatWrap as any;
        if(chatWrap) {
          chatWrap.scrollTop = chatWrap.scrollHeight;
        }
      })
     
      
  }
  /**
   * 获取ai返回的内容转对象
   */
  getAnswerContent(res) {
    try{
      if(res && res.answer && res.answer.content) {
        let content = res.answer.content.replace(/\n/g, '');
        content = JSON.parse(content);
        return content;
      } else {
        return false;
      }
    } catch(e) {
      console.log(e,'JSON.parse失败');
      return res.answer && res.answer.content ? res.answer.content : false;
    }
  }
  /** 
   * 清除对话消息
  */
  clearMessage() {
    this.messages = [];
    // 清除aiMessages的全部数据
    sessionStorage.removeItem('aiMessages');
  }
  /**
   * 发送ai对话
   * param text 用户输入的文本
   * param isUserInput 问题类型：0：表示系统生成的问题，1：表示用户手动输入问题
   * param isGenerateSuggest 是否让AI推荐问题
   */
  sendMessage(text, isUserInput, isGenerateSuggest?) {
    console.log(text,'text==');
    const startTime = Date.now();
    if(this.loading){
      Message.warning({
        content: this.aiBusyText,
        duration: 2
      });
      return;
    }
    // 发送消息主动失焦
    this.$refs.dialogInput && (this.$refs.dialogInput as any).toBlur();
  
    // 向对话中添加用户的消息
    if (isGenerateSuggest) {
      this.addMessage({ content: text, role: 'user', flag: 'suggest' });
      const suggest = {
        content: this.suggestMessage,
        suggests: this.suggests,
        role: 'assistant',
        flag: 'suggest'
      }
      this.addMessage(suggest);
    } else {
      this.addMessage({ content: text, role: 'user' });
      // AI响应前的历史对话
      const currentHistory = this.getHistories();
      let params = {
        histories: currentHistory,
        content: text, 
        scenarioCode: 'AI_CHAT', 
        templateData: this.templateData
      };
      const messageId = uuid(5, 10);
      
      // 显示加载状态
      this.loading = true;
      this.chatApi(params).then((res) => {
        const endTime = Date.now();
        const requestTime = endTime - startTime;
        let content = this.getAnswerContent(res);
        if(content) {
          switch(content.status) {
            case 'guide':
              this.addMessage({ content: content.text, role: 'assistant', id: messageId });
              this.addLogger({
                res: res, 
                question: text,
                questionType: isUserInput, 
                questionResult: this.questionResult.success, 
                history: currentHistory, 
                id: messageId, 
                availableChart: this.availableChart.nohave, 
                ischartTemplate: this.ischartTemplate.not, 
                apiRequestTime: requestTime,
              })
              break;
            case 'chartTemplate':
              this.createChart(content,res, isUserInput, currentHistory, text, requestTime);
              break;
            default:
              this.addMessage({ content: content, role: 'assistant', id: messageId });
              this.addLogger({
                res: res, 
                questionType: isUserInput, 
                questionResult: this.questionResult.success, 
                history: currentHistory, 
                id: messageId, 
                question: text,
                apiRequestTime: requestTime,
                availableChart: this.availableChart.nohave, 
                ischartTemplate: this.ischartTemplate.not, 
              })
              break;
          }
        }
        this.loading = false;
        this.scrollBottom();
      }).catch((error) => {
        const endTime = Date.now();
        const requestTime = endTime - startTime;
        // 请求失败的对话做标识
        this.messages[this.messages.length - 1].flag = 'fail';
        this.addMessage({ content: this.errorText, role: 'assistant', id: messageId });
        this.addLogger({
          res: error, 
          questionType: isUserInput, 
          questionResult: this.questionResult.fail, 
          history: currentHistory, 
          id: messageId, 
          question: text,
          availableChart: this.availableChart.nohave, 
          ischartTemplate: this.ischartTemplate.not, 
          apiRequestTime: requestTime,
        })
        this.loading = false;
      })
    }
    
    this.scrollBottom();
  }

 

  /**
   * 生成报表图表结构
   */
  async createChart(aiChart, aiRes, isUserInput?, currentHistory?, question?, requestTime?) {
    let element = await transformAIChart(aiChart,this.dataSource);
    const messageId = uuid(5, 10);
    if(element && checkChart(element)) {
      this.addMessage({ content: this.successMessage, chart: element, role: 'assistant', origin: aiRes.answer.content, feedback: null, id: messageId });
      this.addLogger({
        res: aiRes, 
        questionType: isUserInput, 
        questionResult: this.questionResult.success, 
        availableChart: this.availableChart.have, 
        ischartTemplate: this.ischartTemplate.right, 
        history: currentHistory, 
        id: messageId,
        apiRequestTime: requestTime,
        question: question
      });
    } else {
      this.addMessage({ content: this.failMessage, role: 'assistant',flag: "fail", id: messageId });
      this.addLogger({
        res: aiRes, 
        questionType: isUserInput, 
        questionResult: this.questionResult.success, 
        availableChart: this.availableChart.nohave, 
        ischartTemplate: this.ischartTemplate.right, 
        history: currentHistory, 
        apiRequestTime: requestTime,
        id: messageId,
        question: question
      })
    }
  }

  /**
   * 添加一条埋点数据
   * @param res 接口返回数据
   * @param question：发给AI问题
   * @param questionType:   0: AI推荐问题  1: 用户输入问题  2: 获取推荐问题
   * @param questionResult: 0: 失败        1: 成功
   * @param ischartTemplate 0: 无图表模板    1: 图表模板
   * @param availableChart  0: 无图表      1: 有图表
   * @param apiRequestTime    响应时间
   * @param history 历史记录
   * todo 埋点数据的部分抽离
   */
  addLogger({res, question, questionType , questionResult, ischartTemplate = 0, availableChart, history, apiRequestTime = 0, id}) {
    const data: H3.Report.AiLoggerContent = {
      question: question,
      questionType: questionType, 
      questionResult: questionResult,
      satisfaction: null,
      chart: ischartTemplate? res.answer.content : null,
      recordTime: new Date().getTime(),
      extra: ''
    };
    let usage = res.usage || {};
    const extra: H3.Report.AiLoggerContentExtra = {
      sceneType: this.sceneType,
      availableChart: availableChart,
      ischartTemplate: ischartTemplate,
      answer: res,
      promptToken: usage.promptToken || 0,
      completionToken: usage.completionToken || 0,
      totalToken: usage.totalToken || 0,
      apiRequestTime: apiRequestTime,
      history: history,
    }
    data.extra = JSON.stringify(extra);
    console.log({data,extra}, '埋点数据');
    this.$emit('addLogger',{key: id, data: data});
  }

  /**
   * 处理用户反馈, 执行以下操作：1.缓存到sessionStorage中  2. 更新埋点数据
   * @param value 1: 满意, 0: 不满意, null: 未反馈
   * @param messageIndex 消息索引
   */
   handleFeedback(value: 0 | 1 | null, messageIndex) {
    let message = this.messages[messageIndex];
    if(message && message.id) {
      message.feedback = message.feedback === value ? null : value;
      sessionStorage.setItem('aiMessages',JSON.stringify(this.messages));

      // 更新埋点数据, 
      const updateData = {
        id: message.id,
        key: 'satisfaction',
        value: message.feedback
      }
      this.$emit('updateLogger', updateData);
    }
   }
  
  addMessage(msg) {
    this.messages.push(msg);
    sessionStorage.setItem('aiMessages',JSON.stringify(this.messages));
  }
  /**
   * 初始化头像信息
   */
  initAvatar () {
    if(this.aiConfig && this.aiConfig.userAvatar) {
      this.$set(this.avatarMap, 'user', Object.assign(this.avatarMap["user"],this.aiConfig.userAvatar))
    }
    if(this.aiConfig && this.aiConfig.aiAvatar) {
      this.$set(this.avatarMap, 'assistant', Object.assign(this.avatarMap["assistant"],this.aiConfig.aiAvatar))
    }
  }
  /**
   * 初始化推荐问题 
   */
  initSuggests() {
    if(this.templateData && this.templateData.dataSources && this.templateData.dataSources.length < 4) {
      console.log("数据源少于4个,不推荐问题");
      return;
    };
    const startTime = Date.now();
    const messageId = uuid(5, 10);
    let text = this.suggestText;
    let params = {
      histories: [],
      content: text, 
      scenarioCode: 'AI_SUGGEST', 
      templateData: this.templateData
    }
    this.chatApi(params).then((res) => {
       const endTime = Date.now();
       const requestTime = endTime - startTime;
       let content =  this.getAnswerContent(res);
       if(content) {
        this.suggests = content;
       };

       this.addLogger({
        res: res, 
        questionType: this.questionType.getSuggest, 
        questionResult: this.questionResult.success, 
        availableChart: this.availableChart.nohave, 
        ischartTemplate: this.ischartTemplate.not, 
        history: [], 
        id: messageId,
        apiRequestTime: requestTime,
        question: this.suggestText
      });
    }).catch((error) => {
      const endTime = Date.now();
      const requestTime = endTime - startTime;
      this.addLogger({
          res: error, 
          questionType: this.questionType.getSuggest, 
          questionResult: this.questionResult.fail, 
          history: [], 
          availableChart: this.availableChart.nohave, 
          ischartTemplate: this.ischartTemplate.not, 
          id: messageId, 
          question: text,
          apiRequestTime: requestTime,
        })
      console.log(error,'推荐问题失败');
    })
  }
  /**
   * 初始化数据模板
   */
  initTemplateData() {
    const dataSource = this.dataSource;
    const tableFields: any = [];
    // 需要过滤的字段--部分系统字段不参与数据分析
    const avoidFields = ['CreatedBy','OwnerId','OwnerDeptId', 'CreatedTime', 'ModifiedTime'];
    if (dataSource && dataSource.properties && dataSource.properties.length) {
    dataSource.properties.forEach((field: H3.Report.FieldColumn) => {
        if (!field.mainField && field.visible && !avoidFields.includes(field.field)) {
          tableFields.push(`${field.name} | ${field.specialType || field.type}`);
        }
      });
    }
    this.templateData = { dataSources: tableFields }
    console.log(this.templateData,'this.templateData');

  }
  /**
   * 初始化数据模板
   */
  initLocalMessages() {
    let id = sessionStorage.getItem('aiMessagesId');
    // 没有id或者id不相等,清除对话
    if(id && id !== this.id) {
      this.clearMessage();
    } 
    this.$nextTick(()=> {
      sessionStorage.setItem('aiMessagesId', this.id);
    })
    
    let localMessages = sessionStorage.getItem('aiMessages');
    if(localMessages) {
      this.messages = JSON.parse(localMessages);
    }
  }

  mounted() {
    this.initAvatar();
    this.initTemplateData();
    this.initLocalMessages();
    this.initSuggests();
    this.scrollBottom();

  }
}

</script>
<style lang="less">
@import "~@h3/report-mobile/basics/styles/components.less";

.report-ai-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  &__content {
    flex:1;
    height: calc(100% - 84px);
    padding: 20px 16px 0px 20px;
    .vertical-scrollbar();
    margin-right: 2px;
    &::-webkit-scrollbar-track {
        background-color: unset !important;
    }
    .report-ai-chat:first-child {
      .report-ai-chat__content {
        padding: 18px;
      }
    }

  }
   &__footer {
    min-height: 84px;
    padding: 18px 20px;
    .ai-input {
      // border: none;
      // background-color: #fff;
      // padding: 2px;
      // outline: none;
      // &:hover, &:focus {
      //   border-color: #e8e8e8;
      //   box-shadow: none;
      // }
    }
  }
  &__operate {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    &-item {
      padding: 5px 12px;
      background: #FFFFFF;
      border-radius: 15px;
      border: 1px solid #E6E6E6;
      margin-right: 8px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .title {
        font-size: 12px;
        color: #121933;
        line-height: 20px;
        margin-left: 4px;
      }
    }
  }
}

</style>