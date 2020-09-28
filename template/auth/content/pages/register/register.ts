import Vue from 'vue';
import Component from 'vue-class-component';
import User from '@/model/user';
import AuthService from '@/services/auth';

@Component({
  components: {},
  name: 'register',
})
class Register extends Vue {
  // --------------------------------------------------------------------------
  // [Private] Fields
  // --------------------------------------------------------------------------
  private fullname = '';
  private email = '';
  private password = '';
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
   * This is used to register a new user
   */

  public async register(): Promise<void> {
    const user: User = { fullname: this.fullname, email: this.email, password: this.password };
    try {
      await AuthService.register(user);
    } catch (error) {
      // Handle registration errors here.
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
  Register as default,
  Register,
};
