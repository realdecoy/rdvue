import chalk from 'chalk';

export const TEMPLATE_ROOT = '.rdvue/template';
export const TEMPLATE_REPO = 'https://github.com/realdecoy/rdvue-template';
export const DESIGN_TEMPLATE_REPO = 'https://github.com/realdecoy/design-system-components';
export const TEMPLATE_TAG = 'main'; // replace this with the appropriate release tag in the template repo
export const DESIGN_TEMPLATE_FOLDER = 'library';
export const TEMPLATE_PROJECT_NAME_REGEX = /__PROJECT_NAME__/g;
export const TEMPLATE_VERSIONS_SUPPORTED = [2];
export const TEMPLATE_CONFIG_FILENAME = 'manifest.json';

enum DYNAMIC_OBJECTS_ENUM {
  Routes = 'routes',
  Store = 'store',
  Options = 'options',
  Modules = 'modules',
}
export const DYNAMIC_OBJECTS = DYNAMIC_OBJECTS_ENUM;

enum CLI_COMMANDS_ENUM {
  CreateProject = 'create-project',
  Upgrade = 'upgrade',
  AddComponent = 'add:component',
  AddPage = 'add:page',
  AddService = 'add:service',
  AddStore = 'add:store',
  AddModule = 'add',
  PluginBuefy = 'plugin:buefy',
  PluginLocalization = 'plugin:localization',
  PluginVuetify = 'plugin:vuetify',
  PluginLibrary = 'plugin',
  PoorHelpCommand = 'add-help'
}
export const CLI_COMMANDS = CLI_COMMANDS_ENUM;

enum DOCUMENTATION_LINKS_ENUM {
  Rdvue = 'https://realdecoy.github.io/rdvue/#/',
  Component = 'https://realdecoy.github.io/rdvue/#/Features?id=components',
  Page = 'https://realdecoy.github.io/rdvue/#/Features?id=pages',
  Service = 'https://realdecoy.github.io/rdvue/#/Features?id=services',
  Store = 'https://realdecoy.github.io/rdvue/#/Features?id=stores',
}
export const DOCUMENTATION_LINKS = DOCUMENTATION_LINKS_ENUM;

export const PLUGIN_PRESET_LIST = [
  'Buefy & Localization (recommended)',
  'Vuetify & Localization',
  `${chalk.magenta('[Skip presets]')}`,
];

export const TEMPLATE_REPLACEMENT_FILES = [
  'package.json',
  '.rdvue/.rdvue',
  'public/index.html',
  'public/manifest.json',
];

export const CLI_STATE = {
  Info: `${chalk.blue('[rdvue]')}`,
  Error: `${chalk.red('[rdvue]')}`,
  Warning: `${chalk.yellow('[rdvue]')}`,
  Success: `${chalk.green('[rdvue]')}`,
};
