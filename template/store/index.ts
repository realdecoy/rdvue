import Vue from 'vue';
import Vuex, { ModuleTree } from 'vuex';
import app from './app';
/* tslint:disable-next-line */
const { stores } = require('../../.rdvue/stores.js');

Vue.use(Vuex);

export default new Vuex.Store({
  modules: Object.assign(
    {},
      stores,
    {
      app,
    /* Import other custom modules here. */
    }) as unknown as ModuleTree<unknown>,
});

