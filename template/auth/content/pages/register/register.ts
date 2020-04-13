import Vue from 'vue';
import Component from 'vue-class-component';
import authService from '../../../service/auth';

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

   public async register (name: string, email: string, password: string): Promise<void> {
    try {
      await authService.register(name, email, password);
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
  Register
};
