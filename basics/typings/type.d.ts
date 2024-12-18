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
       $r_gt(data: any,type: string): void;
} 
}
/** 语言配置信息 */
export interface LanguageInfo {
   normal: {
    term: string
   },
   view: {
    header: {
      filter: string,
      style: string,
      full: string,
      mobile: string,
      export: string,
      add: string,
      save: string,
      backMain: string 
    },
   }, 
}

/** 语言种类 */
export type LanguageType = "cn" | "en";

/** 语言状态 */
export interface LanguageState {
  /** 当前应用的语言类型 */
  type: LanguageType
  /** 是否需要缓存操作 */
  cache: boolean
}

