import Vue from 'vue';
import Component from 'vue-class-component';
import authService from '../../../service/auth';

@Component({
  components: {},
  name: 'login',
})
class Login extends Vue {
  // --------------------------------------------------------------------------
  // [Private] Fields
  // --------------------------------------------------------------------------
  private email: string = '';
  private password: string = '';
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

  /**
   * GENERATED FUNCTION:
   * This is used to authenticate a user
   */
  public async login(email: string, password: string): Promise<void> {
    try {
      await authService.login(email, password);
    } catch (error) {
      // Handle error is login failed here
    }
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
}

export {
  Login as default,
  Login
};
