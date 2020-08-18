/**
 * Reusable constants that can be used anywhere in the source code
 */

import gitUserName from 'git-user-name';

export const DEFAULT_PROJECT_NAME = 'my-vue-app';
export const REGEX_PROJECT_NAME = /^\s+$/;
export const GENERATE_ACTION = 'generate';
export const ADD_ACTION = 'add';
export const LIST_ACTION = 'list';
export const ADD_GROUP = 'add-group';
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
    project = 'project',
    services = 'services',
    auth = 'auth',
    features = 'features' // For listing feature groups
}


interface Actions {
    [key: string]: string[];
}

export const ACTIONS: Actions = {
    generate: ['generate', 'g'],
    add: ['add'],
    'add-group': ['add-group'],
    list: ['list']
};
