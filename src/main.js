import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import moment from "moment";
import 'moment/locale/zh-cn';
import 'default-passive-events';
import md5 from 'js-md5';
import * as echarts from "echarts";
//import {regionData,CodeToText} from 'element-china-area-data';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import {postRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.moment = moment
Vue.prototype.$md5 = md5
Vue.prototype.$echarts = echarts;
Vue.use(VueQuillEditor);

Vue.filter('dateFormat', function (daraStr, pattern = 'YYYY年M月D日 HH:mm:ss') {
  return moment(daraStr).format(pattern);
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
