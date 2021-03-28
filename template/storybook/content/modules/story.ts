import { Component, Prop, Vue } from 'vue-property-decorator';
import { PropOptions } from 'vue/types/options';
import { ComponentOptions } from 'vue/types/umd';

// ----------------------------------------------------------------------------
// Module Types
// ----------------------------------------------------------------------------
type StoryComponentOptions<V extends Vue> = ComponentOptions<V> & {
  description: string;
  /**
   * String or a Function which resolves the import path of the component.
   */
  import?: string | Delegate<string, string>;
  slots?: { [key: string]: string };
  enablePlayground?: boolean;
  enableApi?: boolean;
};

type StoryPropOptions<T = unknown, U = unknown, V = unknown> = PropOptions & {
  values?: T[];
  description: string;
  // tslint:disable-next-line:ban-types
  type: Function | ConstructorOf<T> | Array<ConstructorOf<unknown>>;
};

type StoryPropStore = { [key: string]: StoryPropOptions };
type ConstructorOf<C, P = unknown> = new (...args: P[]) => C;
type DecoratorTarget = { [key: string]: unknown };
type Delegate<Param, Result> = (param: Param) => Result;
type StorySafe = { story: StoryComponentOptions<never>; props: StoryPropStore };

// ----------------------------------------------------------------------------
// Module Vars
// ----------------------------------------------------------------------------
const IS_DEV = (process.env as { NODE_ENV: string }).NODE_ENV !== 'production';
const storySafe = new WeakMap<object, StorySafe>();
let storyPropAggregator: StoryPropStore = {};

// ----------------------------------------------------------------------------
// Module Functions
// ----------------------------------------------------------------------------
function StoryComponent<V extends Vue>(options: StoryComponentOptions<V>)
  : <VueClass extends typeof Vue>(target: VueClass) => VueClass {
  const componentDecoratorFn = Component(options);

  return (target) => {
    const newTarget = componentDecoratorFn(target);

    storySafe.set(newTarget, { story: options, props: { ...storyPropAggregator } });

    // Reset so the next StoryComponent doesn't end up with these props.
    storyPropAggregator = {};

    return newTarget;
  };
}

function StoryProp<T>(options: StoryPropOptions<T>)
  : <VC extends object>(target: VC, key: string) => void {
  const { values, validator } = options;

  return (target, key: string) => {
    // Store prop in aggregator until StoryComponent gets initialized
    // and pulls all props then resets the aggregator.
    mixinStoryPropValidator(target as DecoratorTarget, key, options);

    storyPropAggregator[key] = options;

    Prop(options)(target, key);
  };
}

StoryComponent.getDescription = function <V extends object>(target: V) {
  return storySafe.get(target)?.story.description;
};

StoryComponent.getSlots = function <V extends object>(target: V) {
  const slots = storySafe.get(target)?.story?.slots ?? {};

  return Object.entries(slots)
    .map(p => ({ name: p[0], description: p[1] }));
};

StoryComponent.getImportPath = function <V extends object>(target: V) {
  return storySafe.get(target)?.story.import;
};

StoryComponent.getPlaygroundEnabled = function <V extends object>(target: V) {
  return storySafe.get(target)?.story.enablePlayground !== false;
};

StoryComponent.getApiEnabled = function <V extends object>(target: V) {
  return storySafe.get(target)?.story.enableApi !== false;
};

StoryComponent.isDefined = function <V extends object>(target: V) {
  return storySafe.has(target);
};

StoryProp.getDescription = function <V extends object>(target: V, propName: string) {
  return storySafe.get(target)?.props[propName]?.description;
};

StoryProp.isDefined = function <V extends object>(target: V, propName: string) {
  return propName in (storySafe.get(target)?.props ?? {});
};

StoryProp.getValues = function <V extends object>(target: V, propName: string) {
  return storySafe.get(target)?.props[propName]?.values;
};

function mixinStoryPropValidator(target: DecoratorTarget, key: string, options: StoryPropOptions) {
  const { validator: origValidator, values } = options;
  const newOptions = { ...options };

  newOptions.validator = (value: unknown) => {
    const validatePropValuesResult = values === undefined || values.includes(value);
    const finalResult = validatePropValuesResult && (origValidator === undefined || origValidator(value));

    if (!validatePropValuesResult) {
      if (IS_DEV) {
        // tslint:disable-next-line:no-console
        console.error(`Prop ${key} was assigned out-of-bounds value ${value}.`);
      }
    }

    return finalResult;
  };

  return newOptions;
}

// ----------------------------------------------------------------------------
// Module Exports
// ----------------------------------------------------------------------------

export {
  StoryComponent,
  StoryProp,
  Vue,
};

