import { Vue, Component, Prop } from "vue-property-decorator";
import { ElementType } from "@h3/report-mobile/basics/enum/chart-type";
import { LanguageInfo, LanguageState, LanguageType } from "@h3/report-mobile/basics/components/language/type";
import en from "@h3/report-mobile/basics/components/language/en";
import cn from "@h3/report-mobile/basics/components/language/cn";


const languageMap = {
  en,
  cn,
}

const state: LanguageState = {
  type: "cn",
  cache: false
}


const cacheName = "language-current-type";
@Component({
  name: "h3-i18-mixin"
})
export default class i18nMixin extends Vue {
  // @Prop({ default: () => 'cn' }) language!: 'en' | 'cn';
  r_languageState: LanguageState = state;
  get $r_language() {
    const key = this.$r_languageType as LanguageType;
    return languageMap[key];
  }
   get $r_languageType(){
      return (this as any).r_languageState.type;
  }
  set $r_languageType(val: LanguageType){
    (this as any).r_languageState.type = val;
      if (state.cache) {
      sessionStorage.setItem(cacheName, val);
    }
  }

  $r_setLanguage(type: LanguageType) {
    this.$r_languageType = type;
  }

  $r_translate(value) {
      return languageMap[this.$r_languageType][value];
  }

  beforeDestroy () {
    console.log('beforeDestroy==')
  }
  beforeMount() {
    console.log('beforeMounte==')
  }
  beforeCreate() {
    console.log('beforeCreate==')
  }

}
