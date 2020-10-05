import { VueConstructor } from 'vue';

export interface RequireVue<T extends Vue = Vue> { [key: string]: VueConstructor<T>; }
