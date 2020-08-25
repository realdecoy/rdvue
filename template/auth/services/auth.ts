import { AxiosResponse } from 'axios';
import { Service } from './base';
import User from '@/model/user';

class AuthService extends Service {
  // --------------------------------------------------------------------------
  // [Private] Fields
  // --------------------------------------------------------------------------

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
  public login(data: User): Promise<any> {
    // define custom request options [NB: default config found in @/services/base]
    const options = {};
    return this.api
      .post(`login`, data, options)
      .then((response: AxiosResponse<any>) => {
        // handle response here
        return response;
      });
  }

  public register(data: User): Promise<any> {
    // define custom request options [NB: default config found in @/services/base]
    const options = {};
    return this.api
      .post(`register`, data, options)
      .then((response: AxiosResponse<any>) => {
        // handle response here
        return response;
      });
  }

  public sendResetEmail(email: string): Promise<any> {
    // define custom request options [NB: default config found in @/services/base]
    const options = {};
    return this.api
      .post(`email/reset`, email, options);
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

const service = new AuthService();

export {
  service as default,
  service as AuthService,
};
