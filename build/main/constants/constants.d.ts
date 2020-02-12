/**
 * Reusable constants that can be used anywhere in the source code
 */
export declare const DEFAULT_PROJECT_NAME = "my-vue-app";
export declare const REGEX_PROJECT_NAME: RegExp;
export declare const GENERATE_ACTION = "generate";
export declare const TEMPLATE_PROJECT_URL: string;
export declare const OPTIONS_ALL: string[];
export declare const spinnerIcons: string[];
export declare const UTF8 = "utf-8";
export declare const TEMPLATE_FILE = "/template.json";
export declare const MANIFEST_FILE = "/manifest.json";
export declare const CORE = "core";
export declare enum featureType {
    config = "config",
    store = "store",
    project = "project",
    services = "services"
}
interface Actions {
    [key: string]: string[];
}
export declare const ACTIONS: Actions;
export {};
