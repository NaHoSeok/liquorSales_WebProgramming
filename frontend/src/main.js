import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import axios from 'axios'
import VueAxios from 'vue-axios'

import io from 'socket.io-client'

const socket = io('http://localhost:8000');
Vue.prototype.$socket = socket;

Vue.prototype.$axios = axios;
Vue.use(VueAxios, axios)

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()  // 이벤트 버스용 빈 인스턴스

const originalPush = router.push;
router.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
