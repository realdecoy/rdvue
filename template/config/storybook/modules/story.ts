import { Component, Vue, Prop } from 'vue-property-decorator';
import { ComponentOptions } from 'vue/types/umd';
import { PropOptions } from 'vue/types/options';
import { VueClass } from "@vue/test-utils";

const storySafe = new WeakMap<object, { story: StoryComponentOptions; props: StoryPropStore }>();
let props: StoryPropStore = {};

interface StoryComponentOptions {
  description?: string;
  module?: ((componentName: string) => string) | string;
  slots?: { [key: string]: string };
  playground?: boolean;
  api?: boolean;
}


interface StoryPropOptions {
  values?: string[];
  description: string;
}

interface StoryPropStore { [key: string]: StoryPropOptions; }

export interface StoryDef {
  (): unknown;
  title?: string;
}


export function StoryComponent<V extends Vue>(options: StoryComponentOptions & ComponentOptions<V> & ThisType<V>)
  : <VC extends VueClass<V>>(target: VC) => VC {
  const componentDecoratorFn = Component(options);
  return (target) => {
    const newTarget = componentDecoratorFn(target)
    storySafe.set(newTarget, { story: options, props: { ...props } });

    // Reset so next Story doesn't end up with these props.
    props = {};
    return newTarget;
  };
}

export function StoryProp<V>(options: StoryPropOptions & PropOptions & ThisType<V>)
  : <VC extends object>(target: VC, key: string) => void {
  return (target, key: string) => {
    props[key] = options;
    return Prop(options)(target, key);

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

StoryComponent.getModule = function <V extends object>(target: V) {
  return storySafe.get(target)?.story.module;
};

StoryComponent.getPlaygroundEnabled = function <V extends object>(target: V) {
  return storySafe.get(target)?.story.playground !== false;
};

StoryComponent.getApiEnabled = function <V extends object>(target: V) {
  return storySafe.get(target)?.story.api !== false;
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





