interface State {
  navigation: string[];
  theme: string | null;
}

export default new class {
  public namespaced = true;

  // ------------------------------------------------------------------------
  // Initialize the Store.
  // ------------------------------------------------------------------------

  public state: State = {
    navigation: [],
    theme: null,
  };

  // ------------------------------------------------------------------------
  // Getters retrieve properties from the Store.
  // ------------------------------------------------------------------------

  public getters = {
    navigation: (state: State) => {
      return state.navigation;
    },
    theme: (state: State) => {
      return state.theme;
    },
  };

  // ------------------------------------------------------------------------
  // Mutations update the properties in the Store.
  // ------------------------------------------------------------------------

  public mutations = {
    setNavigation(state: State, data: string[]) {
      state.navigation = data || [];
    },
    setTheme(state: State, data: string) {
      state.theme = data || null;
    },
  };

  // ------------------------------------------------------------------------
  // Actions are publicly accessbile wrappers to perform actions
  // on the Store. These actions will internally call the appropriate
  // mutations to update the Store.
  // ------------------------------------------------------------------------

  public actions = {
    setNavigation(context: any, data: string[]) {
      // Commit is used to invoke the mutation specified
      // by the named first parameter.
      context.commit('setNavigation', data);
    },
    setTheme(context: any, data: string) {
      // Commit is used to invoke the mutation specified
      // by the named first parameter.
      context.commit('setTheme', data);
    },
  };
}();
