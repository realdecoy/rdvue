import { Command } from '../types';

import { clear } from 'console';
import * as util from './util';

import * as files from './files';

import inquirer from 'inquirer';
import { Group } from '../types/cli';

import { concat, flatten } from 'lodash';
import { ADD_ACTION, ADD_GROUP, LIST_ACTION } from '../constants/constants';

import { CLI_DESCRIPTION } from '..';

import chalk from 'chalk';

import * as MODULE_NEW from '../modules/new';
import { readMainConfig } from './files';

/**
 * Description - Accepts a Feature Group name, prompts user to select a module from that group
 * then calls the promptQuestionByGroup() function to add the mdule to the project
 *
 * @param groupName - Name of Feature Group
 */
async function handleAddGroup(groupName: string) {
  const group = util.getFeatureGroupByName(groupName);

  if (group !== undefined) {

    // Prompt User to select Feature(s)
    const selectedModules = await promptQuestionByGroup(group);
    for (const module of selectedModules) {
      await addPlugin(module);
    }
  }
}

/**
 * Description - Accepts a feature group and Prompts the user with its question
 * and returns an array of the selected modules
 * @param group - Group to prompt by
 */
async function promptQuestionByGroup(group: Group) {
  const multiple = '(multiple)';
  const single = '(single)';
  const result = Array();
  const confirmBtn = group.isMultipleChoice ? 'Press Enter to continue' : '';

  const selectionBtn = group.isMultipleChoice ? `${chalk.blueBright('<space>')} to select,${chalk.blueBright('<a>')} to toggle all, ${chalk.blueBright('<i>')} to invert selection` : 'Enter';

  const instructions = chalk.yellow(`Use arrow keys to navigate. Press ${selectionBtn} to select an option. ${confirmBtn}`);


  const question: inquirer.QuestionCollection = {
    type: group.isMultipleChoice ? 'checkbox' : 'list',
    name: 'feature',
    prefix: '',
    message: `\n \n${instructions} \n${group.question} ${group.isMultipleChoice ? multiple : single}`,
    choices: ['None', ...group.plugins]
  };

  const selected = await inquirer.prompt(question);

  result.push(selected.feature);

  return flatten(result) as string[];
}


/**
 * Description - Accepts the name of an optional module and adds the module to project
 * @param plugin - name of module
 */
async function addPlugin(plugin: string) {
  if (isPlugin(plugin) || isDefaultPlugin(plugin)) {
    await MODULE_NEW.run(
      {
        action: ADD_ACTION,
        feature: plugin,
        options: [],
      },
      CLI_DESCRIPTION);
  }
}

/**
 * Description - Checks if the feature inputted is an optional feature
 * @param feature - name of feature
 */
function isPlugin(plugin: string): boolean {
  let found;
  const plugins = readMainConfig()?.plugins;
  found = plugins?.find((p) => p === plugin);

  return found !== undefined ? true : false;
}

/**
 * Description - Checks if the given plugin is a dafault Project plugin
 * @param plugin -name of plugin
 */
function isDefaultPlugin(plugin: string) {
  return files.readMainConfig().project.plugins
    .includes(plugin);
}
/**
 * Description - Installs default plugins into a newly created project
 */
async function installDefaultPlugins() {
  const defaultPlugins = files.readMainConfig().project?.plugins;
  for (const plugin of defaultPlugins) {
    await addPlugin(plugin);
  }
}

/**
 * Descriptions - Returns an array of the currently available plugins
 */
function getPlugins() {
  const plugins = files.readMainConfig()?.plugins;

  return plugins !== undefined ? plugins : [];
}


/**
 * Description - Processes the ACTIONS for Optional Modules
 * @param operation - Command object
 */
async function handleOptionalModulesRequests(operation: Command) {
  const { action, feature, featureName, options } = operation;
  clear();
  util.heading();

  if (action === ADD_GROUP && util.isFeatureGroupType(feature)) {
    await handleAddGroup(feature);

  }
  else if (action === ADD_ACTION && isPlugin(feature)) {
    await addPlugin(feature);
  }
  else if (action === LIST_ACTION) {
    util.displayFeatureGroupsWithPlugins();
  }
  else {
    thowError();
  }
}



/**
 * Description - prompts the user with the question and choices for each feature group
 * inside the customPreset object in the template.json.
 * Returns an array of all selected modules
 * @param featureGroups -array of feature groups
 */
async function handleFeatureGroupsQuestions(featureGroups?: Group[]) {

  let selectedmodules: string[] = [];
  let step = 1;
  if (featureGroups !== undefined) {
    for (const group of featureGroups) {
      group.question = `${chalk.greenBright(step.toString())}. ${group.question}`;
      const selections = await promptQuestionByGroup(group);

      selectedmodules = selections.length > 0 ? [...selectedmodules, ...selections]
        : [...selectedmodules];
    }
    step++;
  }

  return selectedmodules;
}

/**
 * Description - returns an array of feature groups avaialble for selection at project startup
 */
function loadFeatureGroups(): Group[] {
  const startupGroupNames = files.readMainConfig()?.customPreset?.groups;
  const startupGroups = files.readMainConfig()?.groups
    ?.filter((g) => startupGroupNames?.includes(g.name));

  return startupGroups ?? [];
}

/**
 * Description - Prompts the user with a list of presets to choose from
 * and returns the selected preset
 */
async function promptPresetOptions() {
  clear();

  // Will store the name of preset to return
  let cleanedPresetChoice = '';
  let options = Array<string>();
  const template = files.readMainConfig();

  // Gets array of presets available
  const presets = template?.presets?.filter(({ plugins }) => plugins.length > 0)
    ?.map((preset) => {
      const desc = preset.description;

      // Appends the description (if available) to the text displayed to the user
      return desc !== undefined ? `${preset.name} (${desc})` : preset.name;
    });

  // Get get custom preset option if available
  const customPreset = template?.customPreset?.name;

  if (presets !== undefined) { options = concat(presets) as []; }
  if (customPreset !== undefined) { options = concat(options, customPreset) as []; }

  if (options.length > 0) {
    const { preset } = await inquirer.prompt({
      type: 'list',
      name: 'preset',
      message: 'Pick a preset',
      choices: options
    });

    // Removes description from option selected in order to get the original preset name
    cleanedPresetChoice = preset
      .split('(')[0]
      .trim();
  }

  return cleanedPresetChoice;
}


/**
 * Description - Checks if user selected a valid preset name
 * @param name -selection
 */
function isPresetSelected(name: string): boolean {
  const presets = files.readMainConfig()?.presets
    ?.map((preset) => preset.name);

  return presets !== undefined && presets.includes(name) ? true : false;
}

function isCustomSelected(name: string): boolean {
  return files.readMainConfig()?.customPreset?.name
    .toLocaleLowerCase() === name.toLocaleLowerCase() ? true : false;
}

/**
 * Description - Returns an array of dependencies for a given preset
 * @param presetName - Name of preset
 */
function loadPresetPlugins(presetName: string): string[] {
  const plugins = files.readMainConfig()?.presets
    ?.find((preset) => preset.name === presetName)?.plugins;

  return plugins !== undefined ? plugins : [];
}

/**
 * Description - Handles presets selection process and returns array of modules to install
 * based on user selections
 */
async function requestPresetSelection() {
  const selectedPreset = await promptPresetOptions();
  let modulesToInstall: string[] = [];

  if (isPresetSelected(selectedPreset)) {
    modulesToInstall = loadPresetPlugins(selectedPreset);
  }
  else if (isCustomSelected(selectedPreset)) {
    modulesToInstall = await handleFeatureGroupsQuestions(loadFeatureGroups());
  }


  return modulesToInstall;
}

function thowError() {
  console.log(util.displayHelp(CLI_DESCRIPTION.general.menu));
  throw Error(`The command entered was invalid. Please see help menu above.`);
}

export {
  requestPresetSelection,
  handleOptionalModulesRequests,
  addPlugin,
  getPlugins,
  installDefaultPlugins,
  thowError,
  isPlugin
};
