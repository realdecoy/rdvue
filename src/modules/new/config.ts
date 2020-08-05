import chalk from 'chalk';
import {
  DEFAULT_PROJECT_NAME,
  featureType,
  OPTIONS_ALL,
  REGEX_PROJECT_NAME,
  TEMPLATE_PROJECT_URL
} from '../../constants/constants';
import * as files from '../../lib/files';
import { Arguments, Config } from '../../types/cli';
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

const optionalModulesPrompt = () => {
  const optFeatures = files.readSubConfig(featureType.config)?.optionalModules ?? null;
  let inquirerObj;
  if (optFeatures !== null) {
    const choices = optFeatures.map((feature) => feature.name);
    inquirerObj = [{
      type: 'checkbox',
      name: 'optionalModules',
      message: 'Select Optional Modules to install',
      choices
    }];
  }

  return inquirerObj ?? null;
};

export {
  TEMPLATE_PROJECT_URL,
  OPTIONS_ALL,
  QUESTIONS,
  parsePrompts,
  optionalModulesPrompt
};
