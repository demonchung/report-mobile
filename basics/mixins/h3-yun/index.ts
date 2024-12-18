import {Component, Vue} from 'vue-property-decorator';
import {loginAccount} from './login';
import './style.less';
import {closest} from '@h3/report-mobile/basics/utils/dom';

@Component({
  name: 'h3-yun-login-utils'
})
export default class H3YunLoginUtils extends Vue {
  prefixCls = 'h3-dashboard-dev';
  corpId = 'mq9lled9hm7aeq7dhj1v14495'; // 开发环境
  reportId = 'u8dd91d7c89654e0cb36d8d7c54f984ac';
  // 开发环境有
  config: any = {
    token: '2959425970274ae0ad6b21e35a8449fe',
    userId: 'de6b554a-b319-4916-9ead-66202039bdfb'
  };

  getCookie(name: string) {
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    const arr = document.cookie.match(reg);
    if (arr) {
      return unescape(arr[2]);
    }
    return null;
  }

  setOptions() {
    this.corpId = this.getCookie('h3_EngineCode') as string;
    this.config.token = this.getCookie('h3_Session') as string;
    this.config.userId = this.config.userId || (this.getCookie('gr_user_id') as string);

    if (!this.corpId)
      // 开发环境
      {this.config.extra = {
        appCode: "A6804c3b3fcfc419aa3e03d65e4d7ffd9",
        isAppSetting: false,
        icon: "icon-cgfk",
        parentCode: null,
      };}
  }

  created() {
    this.setOptions();
    if (!this.corpId) {
      loginAccount('infrastructure').then(() => {
        this.setOptions();
      });
    }
  }

  mounted() {
    const parentNode = closest(this.$el, '.theme-default-content');
    if (parentNode) {
      parentNode.classList.add('demo-content');
    }
  }
}
