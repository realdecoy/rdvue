import Vue from 'vue';
import Component from 'vue-class-component';
import User from '@/model/user';
import AuthService from '@/services/auth';

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
  public async login(): Promise<void> {
    const user: User = { email: this.email, password: this.password };
    try {
      await AuthService.login(user);
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
  Login,
};
