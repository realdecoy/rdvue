import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';
import '@/theme/roboto.css';

Vue.use(Vuetify);

const opts = {
    icons: {
        iconfont: 'mdi', // default - only for display purposes
      },
    theme: {
      dark: false,
    },
    themes: {
      light: {
        primary: '#4682b4',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  };

export default new Vuetify(opts);
