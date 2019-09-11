import Vue from 'vue';
import App from '@/views/app/app.vue';
import router from '@/configs/router';
import store from '@/store';
import '@/configs/register-service-worker';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
