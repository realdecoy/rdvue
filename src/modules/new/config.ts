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
import { Arguments, Config, Group } from '../../types/cli';
import inquirer from 'inquirer';
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


function getQuestionByGroup(group: Group) {
  const question: inquirer.QuestionCollection = {
    type: group.promptType as any,
    name: 'feature',
    prefix: '',
    message: group.question,
    choices: ['None', ...group.modules]
  };

  return question;
}



/**
 * Description - Prompts the user to choose modules from the given featuregroup type
 * and returns the name of of the selected module
 *  @param featureGroupName - name of feature group type whose question
 *  and options will be dsiplayed
 */

async function handleAddGroupRequest(featureGroupName: string) {
  // Will store the selected  module
  let choice = '';

  // Gets the questions for the group along with the modules
  const featureGroup = util.getFeatureGroupByName(featureGroupName);

  if (featureGroup !== undefined) {
    // Prompts user with question and choices(modules) from requested feature group type
    const selectedFeature = await inquirer.prompt(getQuestionByGroup(featureGroup));

    choice = selectedFeature.feature[0] || '';
  } else {
    console.log(util.displayHelp(CLI_DESCRIPTION.general.menu));
    throw Error(`${featureGroupName} is not a valid group`);
  }

  return choice;
}


export {
  TEMPLATE_PROJECT_URL,
  OPTIONS_ALL,
  QUESTIONS,
  parsePrompts,
  getQuestionByGroup,
  handleAddGroupRequest
};
