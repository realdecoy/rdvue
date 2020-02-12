import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

@Module({ namespaced: true })
class Store {
    private __STORE_MODULE__Val: string = '';

    // ------------------------------------------------------------------------
    // Getters retrieve properties from the Store.
    // ------------------------------------------------------------------------

    public get fooBar() {
        return this.__STORE_MODULE__Val;
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
        return 'Hello World';
    }


    // ------------------------------------------------------------------------
    // Mutations update the properties in the Store.
    // They are internal
    // ------------------------------------------------------------------------

    @Mutation
    private setFooBar(value: string) {
        this.__STORE_MODULE__Val = value;
    }
}

export {
    Store as default,
    Store,
};
