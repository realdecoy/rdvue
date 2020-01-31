import chalk from 'chalk';
import commandLineUsage, { Section } from 'command-line-usage';
import figlet from 'figlet';
import path from 'path';
import  { actions } from '../modules/actions';
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

function hasCommand(args: string[], features: string[]): boolean {
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
function parseUserInput(args: string[], features: string[])
{
  // The user input should be in the form:
  // <action> <feature> <feature name> [options]
  const returnObject = {
    action: '',
    feature: '',
    featureName: '',
    options: [''],
  };

  // [1] Checking first argument <action> to see if it includes a valid actions
  // (eg. generate)
  
  if ( actions.includes( args[0]) ) {
    
    returnObject.action = args[0];
    
    // [2] Checking second argument <feature>
    // to see if it includes a valid feature (eg. project or page)
    if ( features.includes( args[1]) ) {

      returnObject.feature = args[1];
      
      // [3] Checking third argument <feature name> eg. "test_project"
      // If the feature name entered contains '--' at the beggining of the word
      // it is assumed that they are entering an option instead and therefore, no feature name
      // has been inputed/proccessed.
      if ( args[2].substring(0, 2) !== '--') {
        returnObject.featureName = args[2];
      }
      
      // [4] Checking all arguments to see if they contain any options
      returnObject.options = args.filter(option => option.substring(0, 2) === '--');

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
  return (str.replace(/\w\S*/g, m => `${m.charAt(0)
    .toLocaleUpperCase()}${m.substr(1)
    .toLocaleLowerCase()}`));
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


export {
  heading,
  sectionBreak,
  lineBreak,
  nextSteps,
  hasCommand,
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
};
