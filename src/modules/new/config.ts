import chalk from 'chalk';
import gitUserName from 'git-user-name';
import { directoryExists } from '../../lib/files';

const DEFAULT_PROJECT_NAME = 'my-vue-app';
const REGEX_PROJECT_NAME = /^\s+$/;

async function validate(this: any, value: string): Promise<any> {
  const done = this.async();
  if (value.length === 0 || value.match(REGEX_PROJECT_NAME)) {
    done(chalk.red(`You need to enter a valid project name`));

    return;
  } //  Directory with specified name already exists
  else if (directoryExists(value)) {
    done(chalk.red(`Project with the name ${value} already exists`));

    return;
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

const TEMPLATE_PROJECT_URL = `https://${gitUserName()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
const OPTIONS_ALL: string[] = ['--new'];

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

export{
  TEMPLATE_PROJECT_URL,
  OPTIONS_ALL,
  QUESTIONS,
  parsePrompts,
};
