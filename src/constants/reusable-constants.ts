/**
 * Reusable constants that can be used anywhere in the source code
 */

import gitUserName from 'git-user-name';

export const DEFAULT_PROJECT_NAME = 'my-vue-app';
export const REGEX_PROJECT_NAME = /^\s+$/;
export const NEW_OPTION = '--new';
export const TEMPLATE_PROJECT_URL = `https://${gitUserName()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
export const OPTIONS_ALL: string[] = [NEW_OPTION];
export const spinnerIcons = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
export const UTF8 = 'utf-8';
export const TEMPLATE_FILE = '/template.json';
export const MANIFEST_FILE = '/manifest.json';
export const CORE = 'core';

export enum commandType {
    config = 'config',
    store = 'store',
    project = 'project'
}

