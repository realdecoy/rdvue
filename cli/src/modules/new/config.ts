import chalk from "chalk";
import files from "../../lib/files";

const DEFAULT_PROJECT_NAME = "my-vue-app";
const REGEX_PROJECT_NAME = /^\s+$/;

async function validate (this: any, value: string): Promise<any> { 
  let done = this.async();
  if (value.length == 0 || value.match(REGEX_PROJECT_NAME)) {
    done(chalk.red(`You need to enter a valid project name`));
    return;
  } // directory with specified name already exists
  else if (files.directoryExists(value)) {
    done(chalk.red(`Project with the name ${value} already exists`));
    return;
  } else {
    done(null, true);
  }
}

function parsePrompts (config: any): any[] {
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

const TEMPLATE_PROJECT_URL: string = "https://avidal_realdecoy@bitbucket.org/realdecoyteam/rd-vue-cli.git";
const TEMPLATE_PROJECT_NAME: string = "__template";
const OPTIONS_ALL: string[] = ["--new"];

const QUESTIONS: any[] = [
  {
    type: "input",
    name: "projectName",
    message: "Enter a name for the project:",
    default: DEFAULT_PROJECT_NAME,
    validate,
  },
  {
    type: "input",
    name: "description",
    default: null,
    message: "Enter a description of the project (optional):"
  }
];

export default {
  TEMPLATE_PROJECT_URL,
  TEMPLATE_PROJECT_NAME,
  OPTIONS_ALL,
  QUESTIONS,
  parsePrompts,
}