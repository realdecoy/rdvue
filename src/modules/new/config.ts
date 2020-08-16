import chalk from 'chalk';
import {
  DEFAULT_PROJECT_NAME,
  featureType,
  OPTIONS_ALL,
  REGEX_PROJECT_NAME,
  TEMPLATE_PROJECT_URL
} from '../../constants/constants';
import * as files from '../../lib/files';
import * as util from '../../lib/util';
import { CLI_DESCRIPTION } from '../../index';
import { Arguments, Config, Group, Module } from '../../types/cli';
import inquirer from 'inquirer';
import { clear } from 'console';
import { concat, flatten } from 'lodash';
// tslint:disable-next-line
async function validate(this: any, value: string): Promise<any> {
  const done = this.async();
  if (value.length === 0 || value.match(REGEX_PROJECT_NAME) !== null) {
    done(chalk.red(`You need to enter a valid project name`));
  } //  Directory with specified name already exists
  else if (files.directoryExists(value)) {
    done(chalk.red(`Project with the name ${value} already exists`));
  } else {
    done(null, true);
  }
}

// tslint:disable-next-line
function parsePrompts(config: Config): any[] {
  return config.arguments !== undefined ? config.arguments
    .filter((q: Arguments) => {
      return q.isPrivate === undefined;
    })
    // tslint:disable-next-line
    .map((p: any) => {
      return {
        type: 'input',
        name: p.name,
        message: `Please enter ${p.description}`,
        default: null,
        validate,
      };
    }) : [];
}

// tslint:disable-next-line
const QUESTIONS: any[] = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter a name for the project:',
    default: DEFAULT_PROJECT_NAME,
    validate,
  },
  {
    type: 'input',
    name: 'description',
    default: null,
    message: 'Enter a description of the project (optional):'
  }
];

/**
 * Description - accepts a feature froup and returns its questions and choices
 * to prompt user with
 * @param group - Group to prompt by
 */
function getQuestionByGroup(group: Group) {
  const multiple = '(multiple)';
  const single = '(single)';

  const question: inquirer.QuestionCollection = {
    type: group.promptType as any,
    name: 'feature',
    prefix: '',
    message: `${group.question} ${group.isMultipleChoice ? multiple : single}`,
    choices: ['None', ...group.modules]
  };

  return question;
}

/**
 * Description - Prompts the user with the question from the given feature group
 * and returns an array of the selected modules
 * @param group - Group to prompt by
 */
async function promptQuestionByGroup(group: Group) {
  const multiple = '(multiple)';
  const single = '(single)';
  const result = Array();

  const question: inquirer.QuestionCollection = {
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
 * Description - Process the feature group that the user is requesting
 * and returns the name of the selected module
 *  @param featureGroupName - name of feature group type whose question
 *  and options will be dsiplayed
 */

async function handleAddGroupRequest(featureGroupName: string) {
  // Will store the selected  module
  let choices = Array<string>();

  // Gets the questions for the group along with the modules
  const featureGroup = util.getFeatureGroupByName(featureGroupName);

  if (featureGroup !== undefined) {
    // Prompts user with question and choices(modules) from requested feature group type
    choices = await promptQuestionByGroup(featureGroup);

  } else {
    console.log(util.displayHelp(CLI_DESCRIPTION.general.menu));
    throw Error(`${featureGroupName} is not a valid group`);
  }

  return choices;
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
  const presets = imports?.presets?.map((preset) =>
    `${preset.name} ${preset?.description !== undefined ? `- ${preset.description}` : ''}`);

  // Get get custom preset option if available
  const customPreset = imports?.customPreset?.name;

  if (presets !== undefined) { options = concat(presets) as []; }
  if (customPreset !== undefined) { options = concat(options, customPreset) as []; }

  if (options !== []) {
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

export {
  TEMPLATE_PROJECT_URL,
  OPTIONS_ALL,
  QUESTIONS,
  parsePrompts,
  getQuestionByGroup,
  handleAddGroupRequest,
  promptPresetOptions,
  promptQuestionByGroup
};
