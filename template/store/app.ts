import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import MainStore from './index';
import { getMultiParamModule, MultiParamAction } from '@/modules/core/vuex';

const MODULE_NAME = '__STORE__';

@Module({ namespaced: true, name: MODULE_NAME, dynamic: true, MainStore })
class __STORE__ extends VuexModule {
  private fooBarVal: string = '';

  // ------------------------------------------------------------------------
  // Getters
  // ------------------------------------------------------------------------

  public get fooBar() {
    return this.fooBarVal;
  }

  // ------------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------------

  @MultiParamAction({ commit: 'setFooBar' })
  public initializeFooBar() {
    return 'Hello World';
  }

  @MultiParamAction({ commit: 'setFooBar' })
  public resetFooBar() {
    return null;
  }

  @MultiParamAction({ commit: 'setFooBar' })
  public setCustomFooBar(value: string) {
    return value;
  }

  // ------------------------------------------------------------------------
  // Mutations
  // ------------------------------------------------------------------------

  @Mutation
  private setFooBar(value: string) {
    this.fooBarVal = value;
  }
}

const result = getMultiParamModule<__STORE__>(__STORE__, MODULE_NAME, (MainStore as any));

export {
  result
}
