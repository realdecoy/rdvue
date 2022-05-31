import chalk from 'chalk';

export const TEMPLATE_ROOT = '.rdvue/template';
export const TEMPLATE_REPO = 'https://github.com/realdecoy/rdvue-template';
export const MOBILE_TEMPLATE_REPO =
  'https://github.com/realdecoy/rdvue-mobile-template';
export const TEMPLATE_TAG = 'react-native-integration'; // replace this with the appropriate release tag in the template repo
export const TEMPLATE_PROJECT_NAME_REGEX = /__PROJECT_NAME__/g;
export const TEMPLATE_MOBILE_PROJECT_SCEHEM_REGEX = /__PROJECT_SCHEME__/g;
export const TEMPLATE_MOBILE_PROJECT_BUNLDE_IDNEITIFIER_REGEX = /__BUNDLE_IDENTIFIER__/g;
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
  AddLayout = 'add:layout',
  AddPage = 'add:page',
  AddService = 'add:service',
  AddStore = 'add:store',
  // AddCICD= 'add:cicd',
  AddModule = 'add',
  PluginBuefy = 'plugin:buefy',
  PluginLocalization = 'plugin:localization',
  PluginVuetify = 'plugin:vuetify',
  PluginLibrary = 'plugin',
  PoorHelpCommand = 'add-help',
}
export const CLI_COMMANDS = CLI_COMMANDS_ENUM;

enum DOCUMENTATION_LINKS_ENUM {
  Rdvue = 'https://realdecoy.github.io/rdvue/#/',
  Component = 'https://realdecoy.github.io/rdvue/#/Components',
  Page = 'https://realdecoy.github.io/rdvue/#/Pages',
  Layout = 'https://realdecoy.github.io/rdvue/#/Layouts',
  Service = 'https://realdecoy.github.io/rdvue/#/Services',
  Store = 'https://realdecoy.github.io/rdvue/#/Stores',
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

export const MOBILE_TEMPLATE_REPLACEMENT_FILES = [
  'package.json',
  'package-lock.json',
  '.rdvue/.rdvue',
  'app.json',
];

export const MOBILE_TEMPLATE_CI_CD_REPLACEMENT_FILES = [
  'bitrise.yml',
  'app.json',
];


export const CLI_STATE = {
  Info: `${chalk.blue('[rdvue]')}`,
  Error: `${chalk.red('[rdvue]')}`,
  Warning: `${chalk.yellow('[rdvue]')}`,
  Success: `${chalk.green('[rdvue]')}`,
};


// export const BITRISE_CONFIGS = {
//   baseURL: "https://api.bitrise.io/v0.1",
// }

// export const REQUEST_TIMEOUT_MILLISECONDS = 3600