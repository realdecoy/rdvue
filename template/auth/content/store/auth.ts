import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { getMultiParamModule, MultiParamAction } from '@/modules/core';
import User from '@/model/user';
import store from './index';

const MODULE_NAME = 'Auth';

@Module({ namespaced: true, name: MODULE_NAME, dynamic: true, store })
class Store extends VuexModule {
  private _user: User | null = null;

  // ------------------------------------------------------------------------
  // Getters
  // ------------------------------------------------------------------------

  public get user() {
    return this._user;
  }

  // ------------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------------

  @MultiParamAction()
  public clearCurrentUser() {
    return null;
  }

  @MultiParamAction()
  public login(user: String, password: String) {
    // TODO: invoke service to perform authentication.
    this.setUser(null);

    return true
  }

  // ------------------------------------------------------------------------
  // Mutations
  // ------------------------------------------------------------------------

  @Mutation
  private setUser(user: User) {
    this._user = user;
  }
}

const AuthStore = getMultiParamModule<Store>(Store, MODULE_NAME, (store as any));

export {
  AuthStore
};
