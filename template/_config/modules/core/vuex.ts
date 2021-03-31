import { Store } from 'vuex';
import { Action, getModule, VuexModule } from 'vuex-module-decorators';
import { ActionDecoratorParams } from 'vuex-module-decorators/dist/types/action';

interface Lookup<Result = unknown> {
  [key: number]: Result;
  [key: string]: Result;
}

interface VuexModuleDef {
  getModule(): { [key: string]: unknown };
  getModuleName(): string;
}

// tslint:disable-next-line:no-any
type ConstructorOf<C> = new (...args: any[]) => C;
type UnknownFunction = (...args: unknown[]) => unknown;

/**
 * Performs the relevant magic to make Vuex Actions and Mutations support
 * multiple parameters.
 */
export function MultiParamAction<V>(options: ActionDecoratorParams = {}) {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    // Save original function.
    const originalFn = descriptor.value as UnknownFunction;

    const actionFn = Action(options);

    // Override method. We expect a single Array param which we will spread
    // to invoke the underlying original method. The single array param is
    // produce by getMultiParamModule via not spreading the supplied args
    // but just passing the Array. This is necessary to allow Vuex actions
    // which support multiple arguments (one 1 'payload' by default design).
    descriptor.value = function(this: ThisParameterType<unknown>, args: unknown[]) {
      return originalFn.call(this, ...args);
    };

    // Override method once more with @Action decorator.
    const result = actionFn(target, property, descriptor);

    return result;
  };
}

export function getMultiParamModule<StoreType extends VuexModule>(
  moduleClass: ConstructorOf<StoreType>,
  moduleName: string,
  store: Store<StoreType>,
) {
  return new Proxy<StoreType>(getModule(moduleClass, store), {
    // tslint:disable-next-line:no-any
    get(target: Lookup<any>, prop: string | number | symbol) {
      const targetValue = target[prop as string] as unknown;
      let result: unknown;

      if (typeof targetValue === 'function') {
        result = function(this: ThisParameterType<unknown>, ...args: unknown[]) {
          // Call the original function with the arguments as a single
          // parameter (do not spread array). Vuex expects a single params.
          // We will use the MultiParamAction decorator to handle spreading
          // just before the underlying method gets invoked.
          return (targetValue as UnknownFunction).call(this, args);
        };
      } else {
        result = targetValue;
      }

      return result;
    },
  });
}

