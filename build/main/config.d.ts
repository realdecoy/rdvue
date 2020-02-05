import { Menu } from './types/cli';
declare const TEMPLATE_PROJECT_URL: string;
declare const CLI_PROJECT_ROOT: string;
declare const TEMPLATE_ROOT: string;
declare function USAGE_TEMPLATE(service?: string, action?: string, feature?: string, featureName?: string, options?: string): Menu[];
export { TEMPLATE_PROJECT_URL, USAGE_TEMPLATE, CLI_PROJECT_ROOT, TEMPLATE_ROOT, };
