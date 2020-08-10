import { Vue, Emit } from 'vue-property-decorator';
import { StoryProp } from '.storybook/modules';
class Auth0 extends Vue {
  // --------------------------------------------------------------------------
  // [Private] Fields
  // --------------------------------------------------------------------------
  // @StoryProp({
  //   description: '',
  //   values: [true,false]
  // })
  // private isAuthenticated: false

  // --------------------------------------------------------------------------
  // [Public] Constructor
  // --------------------------------------------------------------------------

  constructor() {
    super();
  }

  // --------------------------------------------------------------------------
  // [Public] Accessors
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Public] Methods
  // --------------------------------------------------------------------------
  @Emit()
  addToCount(n: number) {
    // this.$auth.login();
  }

  @Emit()
  logout() {
    // this.$auth.logOut();
  }

  @Emit()
  handleLoginEvent(data:string) {
    // this.isAuthenticated = data.loggedIn;
    // this.profile = data.profile;
  }
  // --------------------------------------------------------------------------
  // [Private] Event Handlers
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Private] Methods
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Private] Lifecycle Hooks
  // --------------------------------------------------------------------------

  private mounted() {
    // TODO: stuff to do when this component loads.

  }

  private async created() {
    try {
      // await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  }


}

export {
  Auth0 as default,
  Auth0,
};
