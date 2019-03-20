import env from '@/configs/env';

interface State {
  theme: string | null;
}

export default new class {
  public namespaced = true;

  // ------------------------------------------------------------------------
  // Initialize the Store.
  // ------------------------------------------------------------------------

  public state: State = {
    theme: env.theme,
  };

  // ------------------------------------------------------------------------
  // Getters retrieve properties from the Store.
  // ------------------------------------------------------------------------

  public getters = {
    theme: (state: State) => {
      return state.theme;
    },
  };

  // ------------------------------------------------------------------------
  // Mutations update the properties in the Store.
  // ------------------------------------------------------------------------

  public mutations = {
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
    theme(context: any, data: string) {
      // Commit is used to invoke the mutation specified
      // by the named first parameter.
      context.commit('setTheme', data);
    },
  };
}();
