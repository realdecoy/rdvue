import User from '../model/user';

class AuthService {
  // --------------------------------------------------------------------------
  // [Private] Fields
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Public] Constructor
  // --------------------------------------------------------------------------

  constructor() { }

  // --------------------------------------------------------------------------
  // [Public] Accessors
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Public] Methods
  // --------------------------------------------------------------------------

  public login = (email: string, password: string): Promise<User> => {
    const user: User = { fullname: '', email, password };

    // Setup method of logging in here.

    return Promise.resolve(user);
  }

  public register = (name: string, email: string, password: string): Promise<User> => {
    const user: User = { fullname: '', email, password };

    // Setup method of registration here

    return Promise.resolve(user);
  }

  public sendResetEmail = (email: string): Promise<void> => {

    // Setup method of resetting password here.

    return Promise.resolve();
  }
  // --------------------------------------------------------------------------
  // [Private] Event Handlers
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // [Private] Methods
  // --------------------------------------------------------------------------

}

// ----------------------------------------------------------------------------
// Module Exports
// ----------------------------------------------------------------------------

const service  = new AuthService();

export {
  service as default,
  service as AuthService
};
