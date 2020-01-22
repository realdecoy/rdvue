import chalk from 'chalk';
import gitUserName from 'git-user-name';
import * as files from '../../lib/files';

const DEFAULT_PROJECT_NAME = 'my-vue-app';
const REGEX_PROJECT_NAME = /^\s+$/;
const NEW_OPTION = '--new';
const TEMPLATE_PROJECT_URL = `https://${gitUserName()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
const OPTIONS_ALL: string[] = [NEW_OPTION];

async function validate(this: any, value: string): Promise<any> {
  const done = this.async();
  if (value.length === 0 || value.match(REGEX_PROJECT_NAME) !== null) {
    done(chalk.red(`You need to enter a valid project name`));

    return undefined;
  } //  Directory with specified name already exists
  else if (files.directoryExists(value)) {
    done(chalk.red(`Project with the name ${value} already exists`));

    return undefined;
  } else {
    done(null, true);
  }
}

function parsePrompts(config: any): any[] {
  return config.arguments ? config.arguments
    .filter((q: any) => {
      return q.isPrivate === undefined;
    })
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

export default {
  TEMPLATE_PROJECT_URL,
  OPTIONS_ALL,
  QUESTIONS,
  parsePrompts,
};
