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
      await addOptionalModule(module);
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

  const question: inquirer.QuestionCollection = {
    // tslint:disable-next-line: no-any
    type: group.promptType as any,
    name: 'feature',
    prefix: '',
    message: `${group.question} ${group.isMultipleChoice ? multiple : single}`,
    choices: ['None', ...group.modules]
  };

  const selected = await inquirer.prompt(question);
  result.push(selected.feature);

  return flatten(result) as string[];
}


/**
 * Description - Accepts the name of an optional module and adds the module to project
 * @param featureName - name of module
 */
async function addOptionalModule(featureName: string) {
  if (util.isOptionalFeature(featureName)) {
    await MODULE_NEW.run(
      {
        action: ADD_ACTION,
        feature: featureName,
        options: [],
      },
      CLI_DESCRIPTION);
  }
}

function getOptionalFeatures() {
  const optionalFeatures = files.readMainConfig().import?.groups
    .map((g) => g.modules);

  return flatten(optionalFeatures);
}
/**
 * Description - Processes the ACTIONS for Optional Modules
 * @param operation - Command object
 */
async function handleOptionalModulesRequests(operation: Command) {
  const { action, feature, featureName, options } = operation;
  clear();
  util.heading();

  if (action === ADD_GROUP) {
    // Code for add action
    await handleAddGroup(feature);
  }
  else if (action === ADD_ACTION && util.isOptionalFeature(feature)) {
    await addOptionalModule(feature);
  }
  else if (action === LIST_ACTION) {
    // List features here
    util.displayModulesByFeatureGroup();
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

  if (featureGroups !== undefined) {
    for (const group of featureGroups) {

      const currStep = featureGroups.indexOf(group) + 1;
      group.question = `${chalk.yellowBright(currStep.toString())}. ${group.question}`;
      const selections = await promptQuestionByGroup(group);

      selectedmodules = selections.length > 0 ? [...selectedmodules, ...selections]
        : [...selectedmodules];
    }
  }

  return selectedmodules;
}

/**
 * Description - returns an array of feature groups avaialble for selection at project startup
 */
function loadFeatureGroups(): Group[] {
  const imports = files.readMainConfig().import;
  const startupGroupNames = imports?.customPreset?.groups;
  const startupGroups = imports?.groups?.filter((g) => startupGroupNames?.includes(g.name));

  return startupGroups ?? [];
}

/**
 * Description - Prompts the user with a list of presets to choose from
 * and returns the selected preset
 */
async function promptPresetOptions() {
  clear();
  let options = Array<string>();
  const imports = files.readMainConfig().import;

  // Gets array of presets available
  const presets = imports?.presets?.map((preset) => preset.name);

  // Get get custom preset option if available
  const customPreset = imports?.customPreset?.name;

  if (presets !== undefined) { options = concat(presets) as []; }
  if (customPreset !== undefined) { options = concat(options, customPreset) as []; }

  if (options.length > 0) {
    const { preset } = await inquirer.prompt({
      type: 'list',
      name: 'preset',
      prefix: '',
      message: 'Pick a preset',
      choices: options
    });

    return preset;
  }
}


/**
 * Description - Checks if user selected a valid preset name
 * @param name -selection
 */
function isPresetSelected(name: string): boolean {
  const presets = files.readMainConfig().import?.presets
    ?.map((preset) => preset.name);

  return presets !== undefined && presets.includes(name) ? true : false;
}

function isCustomSelected(name: string): boolean {
  return files.readMainConfig().import?.customPreset?.name === name ? true : false;
}

/**
 * Description - Returns an array of dependencies for a given preset
 * @param presetName - Name of preset
 */
function loadPresetDependencies(presetName: string): string[] {
  const dependencies = files.readMainConfig().import?.presets
    ?.find((preset) => preset.name === presetName)?.dependencies;

  return dependencies !== undefined ? dependencies : [];
}

/**
 * Description - Handles presets selection process and returns array of modules to install
 * based on user selections
 */
async function requestPresetSelection() {
  const selectedPreset = await promptPresetOptions() as string;
  let modulesToInstall: string[] = [];

  if (isPresetSelected(selectedPreset)) {
    modulesToInstall = loadPresetDependencies(selectedPreset);
  }
  else if (isCustomSelected(selectedPreset)) {
    modulesToInstall = await handleFeatureGroupsQuestions(loadFeatureGroups());
  }

  return modulesToInstall;
}

export {
  requestPresetSelection,
  handleOptionalModulesRequests,
  addOptionalModule,
  getOptionalFeatures
};
