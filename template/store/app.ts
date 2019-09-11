import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true })
class __STORE__ {
  private _fooBar: string = null;

  // ------------------------------------------------------------------------
  // Getters retrieve properties from the Store.
  // ------------------------------------------------------------------------

  public get fooBar() {
    return this._fooBar;
  }

  // ------------------------------------------------------------------------
  // Actions are publicly accessbile wrappers to perform mutations
  // on the Store. These actions will internally call the appropriate
  // mutations to update the Store.
  //
  // Note: The returned value will be passed to the mutation handler
  // specified as the decorator's "commit" attribute.
  // ------------------------------------------------------------------------

  @Action({ commit: 'setFooBar' })
  public initializeFooBar() {
    return "Hello World";
  }

  @Action({ commit: 'setFooBar' })
  public resetFooBar() {
    return null;
  }

  @Action({ commit: 'setFooBar' })
  public setCustomFooBar(value: string) {
    return value;
  }

  // ------------------------------------------------------------------------
  // Mutations update the properties in the Store.
  // They are internal 
  // ------------------------------------------------------------------------

  @Mutation
  private setFooBar(value: string) {
    this.fooBar = value;
  }
};

export {
  __STORE__ as default,
  __STORE__
}