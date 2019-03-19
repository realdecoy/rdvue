import {UserInfo} from '@/entities/user-info';

interface State {
  user: UserInfo | null;
}

export default new class {
  public namespaced = true;

  // ------------------------------------------------------------------------
  // Initialize the Store.
  // ------------------------------------------------------------------------

  public state: State = {
    user: null,
  };

  // ------------------------------------------------------------------------
  // Getters retrieve properties from the Store.
  // ------------------------------------------------------------------------

  public getters = {
    user: (state: State) => {
      return state.user;
    },
  };

  // ------------------------------------------------------------------------
  // Mutations update the properties in the Store.
  // ------------------------------------------------------------------------

  public mutations = {
    setUser(state: State, data: UserInfo) {
      state.user = data;
    },
  };

  // ------------------------------------------------------------------------
  // Actions are publicly accessbile wrappers to perform actions
  // on the Store. These actions will internally call the appropriate
  // mutations to update the Store.
  // ------------------------------------------------------------------------

  public actions = {
    setUser(context: any, data: UserInfo) {
      // Commit is used to invoke the mutation specified
      // by the named first parameter.
      context.commit('setUser', data);
    },
  };
}();
