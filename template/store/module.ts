import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import { getMultiParamModule, MultiParamAction } from '@/modules/core';
import store from './index';

const MODULE_NAME = '__STORE_MODULE__';

@Module({ namespaced: true, name: MODULE_NAME, dynamic: true, store })
class Store extends VuexModule {

    // ------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Mutations
    // ------------------------------------------------------------------------

}

const __STORE_MODULE__ = getMultiParamModule<Store>(Store, MODULE_NAME, (store as any));

export {
    __STORE_MODULE__
};
