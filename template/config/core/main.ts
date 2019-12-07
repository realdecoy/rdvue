import Vue from 'vue';
import App from '@/page/app/app.vue';
import router from '@/config/router';
import store from '@/store';
import '@/config/register-service-worker';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
