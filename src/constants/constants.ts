/**
 * Reusable constants that can be used anywhere in the source code
 */

import gitUserName from 'git-user-name';

export const DEFAULT_PROJECT_NAME = 'my-vue-app';
export const REGEX_PROJECT_NAME = /^\s+$/;
export const GENERATE_ACTION = 'generate';
export const ADD_ACTION = 'add';
export const TEMPLATE_PROJECT_URL = `https://${gitUserName()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
export const OPTIONS_ALL: string[] = [GENERATE_ACTION];
export const spinnerIcons = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
export const UTF8 = 'utf-8';
export const TEMPLATE_FILE = '/template.json';
export const MANIFEST_FILE = '/manifest.json';
export const CORE = 'core';

export enum featureType {
    config = 'config',
    store = 'store',
    storybook ='storybook',
    project = 'project',
    services = 'services',
    auth = 'auth',
    localization = 'localization'
}

export enum featureGroup {
    auth = 'auth',
    auth0 = 'auth0',
}

export enum featuresWithNoNames {
    auth = 'auth',
    localization = 'localization'
}

interface Actions {
    [key: string]: string[];
}

export const ACTIONS: Actions = {
    generate: ['generate', 'g'],
    add: ['add']
};

export enum DYNAMIC_OBJECTS {
    routes = 'routes',
    stores = 'stores',
    options = 'options',
    modules = 'modules'
}
