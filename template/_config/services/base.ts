import axios from 'axios';
import env from '@/config/env';

const baseURL = (env as any).apiUrl;

class Service {
  protected api = axios.create({
    baseURL,
    timeout: 1500,
    headers: {},
  });

  constructor() {
    /* Setup Interceptors */

    // request interceptor
    this.api.interceptors.request.use((requestConfig) => {
      return requestConfig; // continue request as usual
    }, (requestError) => {
      // Handle request errors here
      return Promise.reject(requestError);
    });

    // response interceptor
    this.api.interceptors.response.use((response) => {
      return response; // continue response as usual
    }, (error) => {
      // Handle response errors here
      return Promise.reject(error);
    });
  }
}

export {
    Service,
};
