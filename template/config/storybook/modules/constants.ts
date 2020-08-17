import { VueConstructor } from 'vue';

export enum Category {
  COMPONENT = 'Components',
  DEMO = 'Demos',
  PAGE = 'Pages',
  STYLES = 'Styles',
}


export const DEFAULT_MODULE = (component: string) => `@/components/${component.replace(/^(.+)([A-Z])/g, '$1-$2').toLowerCase()}.vue`;

export interface RequireVue<T extends Vue = Vue> { [key: string]: VueConstructor<T>; }

export enum Layout {
  Default = 'default',
  Minimal = 'minimal'
}
