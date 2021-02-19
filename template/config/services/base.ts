import env from '@/config/env';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// ----------------------------------------------------------------------------
// Module Vars
// ----------------------------------------------------------------------------
const { API_TIMEOUT_MS } = env.settings; // 15 seconds


class BaseService {
  protected api: AxiosInstance;

  // --------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------

  constructor(api: AxiosRequestConfig | string) {
    const baseURL = typeof api === 'string' ? api : undefined; const overrides = typeof api === 'object' ? api : {};

    const options = {
      timeout: API_TIMEOUT_MS,
      headers: {},
      baseURL,
    };

    this.api = axios.create({ ...options, ...overrides });

    this.init();
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  protected onRequest(config: AxiosRequestConfig) {
    // TODO: override
  }

  protected onRequestError(error: unknown) {
    // TODO: override
  }

  protected onResponse(response: AxiosResponse) {
    // TODO: override
  }

  protected onResponseError(error: unknown) {
    // TODO: override
  }

  // --------------------------------------------------------------------------
  // Methods
  // --------------------------------------------------------------------------

  private init() {
    const { interceptors } = this.api;

    interceptors.request.use((config) => {
      this.onRequest(config);

      return config;
    }, async (error: unknown) => {
      this.onRequestError(error);

      return Promise.reject(error);
    });

    interceptors.response.use((response) => {
      this.onResponse(response);

      return response;
    }, async (error: unknown) => {
      this.onResponseError(error);

      return Promise.reject(error);
    });
  }


}

export {
  BaseService,
};
