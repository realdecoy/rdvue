import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { getMultiParamModule, MultiParamAction } from '@/modules/core/vuex';
import User from '@/model/user';
import MainStore from './index';

const MODULE_NAME = 'Auth';

@Module({ namespaced: true, name: MODULE_NAME, dynamic: true, MainStore })
class Store extends VuexModule {
  private currentUserVal: User | null = null;

  // ------------------------------------------------------------------------
  // Getters
  // ------------------------------------------------------------------------

  public get currentUser() {
    return this.currentUserVal;
  }

  // ------------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------------

  @MultiParamAction({ commit: 'setUser' })
  public clearCurrentUser() {
    return null;
  }

  @MultiParamAction({ commit: 'setUser' })
  public setCustomUser(user: User) {
    return user;
  }

  // ------------------------------------------------------------------------
  // Mutations
  // ------------------------------------------------------------------------

  @Mutation
  private setUser(user: User) {
    this.currentUserVal = user;
  }
}

const AuthStore = getMultiParamModule<Store>(Store, MODULE_NAME, (MainStore as any));

export {
  AuthStore
};
