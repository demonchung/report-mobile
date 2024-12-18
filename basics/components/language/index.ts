import Vue, { VueConstructor } from "vue";
import { LanguageInfo, LanguageState, LanguageType } from "./type";
import en from "./en";
import cn from "./cn";
import ReportConversionModule from "@h3/report-mobile/basics/instance/modules/conversion";
// 自定义的全局类型声明貌似只能写在`main.ts`或者`当前文件`才生效
declare module 'vue/types/vue' {
  interface Vue {
       /** 语言类型 */
       $r_languageType: LanguageType
       /** 当前应用的语言信息 */
       $r_language: LanguageInfo
       /**
        * 设置语言类型
        * @param val 语言类型
        */
       $r_setLanguage(val: LanguageType): void;
       $r_translate(val: string): void;
  }
}

const languageMap = {
  en,
  cn,
}

const state: LanguageState = {
  type: "cn",
  cache: false
};
const envState = {
  entry: "",
};
function translateTpl(matchStr, data) {
  const objStr = matchStr.match(/\$r_language.(\S*)\$/)[1];
  let list: Array<string> = [];
  let res: any = data;
  if(objStr) {
    list = objStr.split('.');
    list.forEach((item)=> {
      res = res[item];
    })
  }
  // console.log(matchStr,str,objStr);
  return res || '';
}

const cacheName = "language-current-type";

/** 语言切换全局配置 */
const Language = {
  install(ctx: VueConstructor<Vue>, options: Partial<LanguageState> = {}) {
    // console.log("options >>", options);
   
    if (options.type) {
      state.type = options.type;
    }
    if (options.cache) {
      state.cache = options.cache;
      const val = sessionStorage.getItem(cacheName) as LanguageType;
      if (val) {
        state.type = val;
      }
    }
    ctx.mixin({
      data() {
        return {
          r_languageState: state,
          r_env: '',
          r_envState: envState
        }
      },
      computed: {
        // 后续可以改成函数获取,实现$t
        $r_language() {
          const key = (this as any).$r_languageType as LanguageType;
          // 给js文件使用
          // (window as any).$r_language = languageMap[key];
          return languageMap[key];
        },
        $r_isWxwork: {
          get() {
            return  (this as any).r_envState.entry;
          },
          set(val) {
            (this as any).r_envState.entry = val;
          }
        },
        $r_languageType: {
          get() {
            return (this as any).r_languageState.type;
          },
          set(val: LanguageType) {
            (this as any).r_languageState.type = val;
            if (state.cache) {
              sessionStorage.setItem(cacheName, val);
            }
          }
        }
      },
      methods: {
        $r_setLanguage(type: LanguageType) {
          this.$r_languageType = type;
        },

        $r_translate(value) {
          return languageMap[this.$r_languageType][value];
        },
        $r_gt(data, type) {
          const tpl = JSON.stringify(data);
          const res = tpl.replace(/\$r_language.*?\$/g, (matchStr) => {
            return translateTpl(matchStr, languageMap[type]);
          });
          return JSON.parse(res);
        }
      }
    })
  }
}

export default Language;
