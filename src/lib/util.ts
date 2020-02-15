import chalk from 'chalk';
import commandLineUsage, { Section } from 'command-line-usage';
import figlet from 'figlet';
import path from 'path';
import { ACTIONS } from '../constants/constants';
import { CLI_DESCRIPTION } from '../index';
import { Command } from '../types/index';
import { fileExists } from './files';

const helpOptions = ['--help', '-h'];

function heading(): void {
  // tslint:disable-next-line:no-console
  console.log(
    chalk.yellow(
      figlet.textSync('rdvue', {
        horizontalLayout: 'full'
      })
    )
  );
}

function sectionBreak(): void {
  // tslint:disable-next-line:no-console
  console.log(chalk.gray('********************************'));
}

function lineBreak(): void {
  // tslint:disable-next-line:no-console
  console.log('\n');
}

function nextSteps(featureName: string): void {
  // tslint:disable-next-line:no-console
  console.log(chalk.magenta('\nNext Steps:'));
  // tslint:disable-next-line:no-console
  console.log(` - cd ${featureName}\n - npm install\n - npm run-script serve`);
}

function hasFeature(args: string[], features: string[]): boolean {
  // Console.log(`hasCommand: ${commands}`);
  const found = features.some((r) => args.includes(r));

  return found;
}

function hasOptions(args: string[], options: string[]): boolean {
  // Console.log(`hasOptions: ${options}`);
  const found = options.some((r) => args.includes(r));

  return found;
}

function hasHelpOption(args: string[]): boolean {
  // Console.log(`hasHelpOptions: ${helpOptions}`);
  const found = helpOptions.some((r) => args.includes(r));

  return found;
}

function hasInvalidOption(args: string[], options: string[]): boolean {
  // Console.log(`hasInvalidOption: ${args}`);
  const found = args.some((r) => !options.includes(r) && !helpOptions.includes(r));

  return found;
}

function parseFeature(args: string[], features: string[]): string {
  return args.filter(x => features.includes(x))[0];
}

/**
 * Get the options that have been input by the user
 */
function parseOptions(args: string[]): string[] {
  return args.filter(option => option.includes('--'));
}

/**
 * Description - seperates the user input into <service> <action> <feature>
 * <featureName> [options]
 * @param args - the arguments that the user provided in the command line
 * @param features - the predefined features that can be created with rdvue
 */
function parseUserInput(args: string[], features: string[]) {
  // The user input should be in the form:
  // <action> <feature> <feature name> [options]
  const returnObject = {
    action: '',
    feature: '',
    featureName: '',
    options: ['']
  };
  // Magic numbers are not allowed: used to check third argument
  const argIndex = 2;
  let remainingArgs = [];


  // [1] Checking first argument <action> to see if it includes a valid actions
  // (eg. generate)
  if (args[0] !== undefined && actionBeingRequested(args[0]).length > 0) {

    returnObject.action = args[0];

    // [2] Checking second argument <feature>
    // to see if it includes a valid feature (eg. project or page)
    if (args[1] !== undefined && features.includes(args[1])) {

      returnObject.feature = args[1];

      // [3] Checking third argument <feature name> eg. "test_project"
      // If the feature name entered contains '--' at the beggining of the word
      // it is assumed that they are entering an option instead and therefore, no feature name
      // has been inputed/proccessed.
      if (args[argIndex] !== undefined && args[argIndex].substring(0, argIndex) !== '--') {
        returnObject.featureName = args[argIndex];
      }

      // Remove the first <action> and second <feature> argument from array and put remaining
      // arguments into remainingArgs array
      remainingArgs = args.slice(argIndex);
      remainingArgs.filter(userinput => userinput.substring(0, argIndex) !== '--');

      // If there is more than one argument and none of these include the help option
      // Assume incorrect name has been inputed.
      if (remainingArgs.length > 1 && !hasHelpOption(remainingArgs)) {
        // TODO: Display help menu & exit
        // tslint:disable-next-line
        console.log(commandLineUsage(CLI_DESCRIPTION.general.menu));
        throw new Error(chalk.red(`Please enter a valid feature name; See help menu above for instructions.`));
      }

      // [4] Checking all arguments to see if they contain any options
      returnObject.options = args.filter(option => option.substring(0, argIndex) === '--');

    }
  } else {
    // [1b] If there is no action in the user input then search for a predefined feature.
    // If found, return the feature found in the input
    returnObject.feature = parseFeature(args, features);
  }

  return returnObject;
}

function displayHelp(sections: Section[]): string {
  return commandLineUsage(sections);
}

function getKebabCase(str: string) {

  const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
  const match = str.match(regex);
  let result = '';
  if (match !== null) {
    result = match.map(x => x.toLowerCase())
      .join('-');
  }

  return result;
}

function getPascalCase(str: string) {
  const word = str.replace(/([-_][a-z0-9])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });

  return `${word.charAt(0)
    .toLocaleUpperCase()}${word
      .substring(1)}`;
}

function hasKebab(str = '') {
  let result = false;
  if (str.match(/kebab/gi) !== null) {
    result = true;
  }

  return result;
}

function isRootDirectory(location: string | null = null): boolean {
  let isRoot = false;
  try {
    let paths = [];
    let testLocation = location;
    if (location === null) {
      testLocation = process.cwd();
    }

    if (testLocation !== null) {
      paths = testLocation.split(path.sep);
      if (paths.length > 0 && paths[1] === '') {
        isRoot = true;
      }
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.warn('Error checking root directory');
    isRoot = true;
  }

  return isRoot;
}

function getProjectRoot() {
  const configFileName = '.rdvue';
  const maxTraverse = 20;

  let currentPath = process.cwd();
  let currentTraverse = 0;
  let projectRoot = null;
  let back = './';

  while (true) {
    currentPath = path.join(process.cwd(), back);
    back = path.join(back, '../');
    currentTraverse += 1;

    if (fileExists(path.join(currentPath, configFileName))) {
      projectRoot = currentPath;
      break;
    } else if (isRootDirectory(currentPath)) {
      projectRoot = null;
      break;
    } else if (currentTraverse > maxTraverse) {
      projectRoot = null;
      break;
    }
  }

  return projectRoot;
}

function checkProjectValidity(operation: Command) {
  const results = {
    isValid: false,
    projectRoot: '',
  };
  let projectRoot: string | null;

  if (operation.feature === 'project') {
    results.isValid = true;
  } else {

    projectRoot = getProjectRoot();
    if (projectRoot !== null && projectRoot !== '') {
      results.isValid = true;
      results.projectRoot = projectRoot;
    } else {
      results.isValid = false;
    }

  }

  return results;
}

// Function to iterate through the actions object
// and check for the matching action to the users input
function actionBeingRequested(enteredAction: string): string {

  // To be returned after finding the action
  let actionReturn = '';

  // Assign the properties of the action object to an array to be iterated through
  const actionProperties = Object.keys(ACTIONS);

  /**
   * @param elem property on the actions object being checked currently
   * @param index the index of the object being checked
   */
  actionProperties.forEach((elem, index) => {
    // If the action keyword the user entered in found inside the array
    // the action is assigned to the variable to be returned
    if (ACTIONS[elem].includes(enteredAction)) {
      actionReturn = actionProperties[index];
    }
  });

  return actionReturn;
}

export {
  heading,
  sectionBreak,
  lineBreak,
  nextSteps,
  hasFeature,
  hasOptions,
  hasHelpOption,
  hasInvalidOption,
  parseFeature,
  parseOptions,
  parseUserInput,
  displayHelp,
  hasKebab,
  getKebabCase,
  getPascalCase,
  checkProjectValidity,
  isRootDirectory,
  getProjectRoot,
  actionBeingRequested
};
