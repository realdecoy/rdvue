import Vue from 'vue';
import Vuex, { ModuleTree } from 'vuex';
import app from './app';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    /* Import other custom modules here. */
  } as unknown as ModuleTree<unknown>,
});

