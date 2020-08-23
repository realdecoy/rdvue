import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import User from '@/model/user';

@Module({ namespaced: true })
class AuthStore {
  private currentUserVal: User | null = null;

  // ------------------------------------------------------------------------
  // Getters retrieve properties from the Store.
  // ------------------------------------------------------------------------

  public get currentUser() {
    return this.currentUserVal;
  }

  // ------------------------------------------------------------------------
  // Actions are publicly accessbile wrappers to perform mutations
  // on the Store. These actions will internally call the appropriate
  // mutations to update the Store.
  //
  // Note: The returned value will be passed to the mutation handler
  // specified as the decorator's "commit" attribute.
  // ------------------------------------------------------------------------

  @Action({ commit: 'setUser' })
  public clearCurrentUser() {
    return null;
  }

  @Action({ commit: 'setUser' })
  public setCustomUser(user: User) {
    return user;
  }

  // ------------------------------------------------------------------------
  // Mutations update the properties in the Store.
  // They are internal
  // ------------------------------------------------------------------------

  @Mutation
  private setUser(user: User) {
    this.currentUserVal = user;
  }
}

export {
  AuthStore as default,
  AuthStore,
};
