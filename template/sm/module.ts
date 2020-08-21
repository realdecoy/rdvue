import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import { getMultiParamModule, MultiParamAction } from '@/modules/core';
import store from './index';

const MODULE_NAME = '__STORE_MODULE__';

@Module({ namespaced: true, name: MODULE_NAME, dynamic: true, store })
class Store extends VuexModule {
    private __STORE_MODULE__Val: string = '';

    // ------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------

    public get fooBar() {
        return this.__STORE_MODULE__Val;
    }

    // ------------------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------------------

    @MultiParamAction()
    public initializeFooBar() {
        return 'Hello World';
    }


    // ------------------------------------------------------------------------
    // Mutations
    // ------------------------------------------------------------------------

    @Mutation
    private setFooBar(value: string) {
        this.__STORE_MODULE__Val = value;
    }
}

const __STORE_MODULE__ = getMultiParamModule<Store>(Store, MODULE_NAME, (MainStore as any));

export {
    __STORE_MODULE__
};
