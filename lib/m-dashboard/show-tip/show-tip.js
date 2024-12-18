import Vue from 'vue';
import Toast from "@h3/report-mobile/basics/components/toast";
Vue.use(Toast);

export default {
    error(msg){
        if(msg){
            Vue.prototype.$toasts(msg);
        }
    },
}
