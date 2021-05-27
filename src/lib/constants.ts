import chalk from 'chalk'

export const TEMPLATE_ROOT = '.rdvue/template'
export const TEMPLATE_REPO = 'https://github.com/realdecoy/rdvue-template'
export const TEMPLATE_TAG = 'main' // replace this with the appropriate release tag in the template repo
export const TEMPLATE_PROJECT_NAME_REGEX = /__PROJECT_NAME__/g
export const TEMPLATE_VERSIONS_SUPPORTED = [2]
export const TEMPLATE_CONFIG_FILENAME = 'manifest.json'
export const enum DYNAMIC_OBJECTS {
  Routes = 'routes',
  Store = 'store',
  Options = 'options',
  Modules = 'modules',
}
export const enum CLI_COMMANDS {
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
  PoorHelpCommand = 'add -help'
}

export const PLUGIN_PRESET_LIST = [
  'Buefy & Localization (recommended)',
  'Vuetify & Localization',
  `${chalk.magenta('[Skip presets]')}`,
]

export const TEMPLATE_REPLACEMENT_FILES = [
  'package.json',
  '.rdvue/.rdvue',
  'public/index.html',
  'public/manifest.json',
]

export const CLI_STATE = {
  Info: `${chalk.blue('[rdvue]')}`,
  Error: `${chalk.red('[rdvue]')}`,
  Warning: `${chalk.yellow('[rdvue]')}`,
  Success: `${chalk.green('[rdvue]')}`,
}
