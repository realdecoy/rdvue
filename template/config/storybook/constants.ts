import { VueConstructor } from 'vue';

// tslint:disable-next-line:newline-per-chained-call
export const DEFAULT_MODULE = (component: string) => `@/components/${component.replace(/^(.+)([A-Z])/g, '$1-$2').toLowerCase()}.vue`;

export interface RequireVue<T extends Vue = Vue> { [key: string]: VueConstructor<T>; }

export enum Layout {
  Default = 'default',
  Minimal = 'minimal'
}
