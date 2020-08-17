import chalk from 'chalk';
import commandLineUsage, { Section } from 'command-line-usage';
import figlet from 'figlet';
import path from 'path';
import { TEMPLATE_ROOT } from '../config';
import { ACTIONS, featureType } from '../constants/constants';
import { CLI_DESCRIPTION } from '../index';
import { Command } from '../types/index';
import { fileExists, readFile, writeFile, readMainConfig } from './files';
import { Group } from '../types/cli';
import { getFeatureConfiguration } from './helper-functions';

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
 * Description - Finds and returns the feature group that has the given name
 * @param name - name of the feature group
 */
function getFeatureGroupByName(name: string): Group | undefined {
  const feature = readMainConfig().import?.groups
    .find((g) => g.name === name);

  return feature;
}
/**
 * Checks if the feature given by the user is a feature group type
 * @param feature - name of feature
 */
function isFeatureGroupType(feature: string): boolean {
  const featureGroups = readMainConfig().import?.groups;
  let isGroup;
  if (featureGroups !== undefined) {
    isGroup = featureGroups.find(featureGroup => featureGroup.name === feature);
  }

  return isGroup === undefined ? false : true;
}

/**
 * Description - Checks if the feature inputted is an optional feature
 * @param feature - name of feature
 */
function isOptionalFeature(feature: string): boolean {
  let found;
  const featureGroups = readMainConfig().import?.groups;

  if (featureGroups !== undefined) {

    // Gets multidemensional array of optional modules
    const optionalModules = featureGroups.map((g) => g.modules);
    // Flatten array into one
    const flatArr = [].concat.apply([], optionalModules as []);

    if (flatArr.length > 0) {
      found = flatArr.find((el) => el === feature);
    }
  }

  return found !== undefined ? true : false;
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
    options: [''],
  };

  // This holds the argument that is expected after <rdvue list>
  const isFeatures = 'features';
  // Magic numbers are not allowed: used to check third argument
  const argIndex = 2;
  let remainingArgs = [];


  // [1] Checking first argument <action> to see if it includes a valid actions
  // (eg. generate)
  if (args[0] !== undefined && actionBeingRequested(args[0]).length > 0) {

    returnObject.action = args[0];



    // [2] Checking second argument <feature>
    // to see if it includes a valid feature (eg. project or page)
    // OR a Optional Feature or a Feature Group Type
    // OR if its 'features' which was passed - 'features' is used to list optional modules/features
    if (args[1] !== undefined && (features.includes(args[1]) || isFeatureGroupType(args[1])
      || isOptionalFeature(args[1]) || args[1] === isFeatures)) {

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
  const configFileName = '.rdvue/.rdvue';
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

/**
 * Description - displays all feature group types and their respective modules
 */
function displayModulesByFeatureGroup() {
  const groups = readMainConfig().import?.groups;
  if (groups !== undefined) {
    console.log(chalk.green('Feature Groups'));

    for (const group of groups) {
      console.log(commandLineUsage([{ header: group.name }] as Section));

      for (const module of group.modules) {
        const details = getFeatureConfiguration(module);
        console.log(commandLineUsage([{
          content: [{
            name: chalk.magenta(details?.name as string),
            summary: details.description
          }]
        }]));
      }
    }
  }
}
// Function to update the .rdvue/routes.json file when a new feature group is added
function parseDynamicRoutes(feature: string): void {
  let PROJECT_ROUTES_FILE_PATH;
  let PROJECT_STORE_FILE_PATH;
  let FEATURE_GROUP_ROUTES;
  let FEATURE_GROUP_STORES;
  let rdRoutes;
  let rdStores;
  let rdRoutesStringToBeWritten = '';
  let rdStoresStringToBeWritten = '';

  // 1[a] Check for the root of the project
  const projectroot = getProjectRoot();

  // 1[b] Once inside of a project values are assigned to be used
  if (projectroot !== null) {
    // Allocate the location of the routes.js file
    PROJECT_ROUTES_FILE_PATH = path.join(projectroot, '.rdvue', 'routes.js');
    PROJECT_STORE_FILE_PATH = path.join(projectroot, '.rdvue', 'stores.js');
    FEATURE_GROUP_ROUTES = path.join(TEMPLATE_ROOT, feature, 'routes', `${feature}.json`);
    FEATURE_GROUP_STORES = path.join(TEMPLATE_ROOT, feature, 'store', `${feature}.json`);

    // Read files to be modified
    rdRoutes = readFile(PROJECT_ROUTES_FILE_PATH);
    rdStores = readFile(PROJECT_STORE_FILE_PATH);

    // Read json files to be written
    const jsonRoutes = readFile(FEATURE_GROUP_ROUTES);
    const jsonStores = readFile(FEATURE_GROUP_STORES);

    // Replace brackets & ("/`) quotations in string
    const editedRoutesString = jsonRoutes.replace(/[\[\]"`]+/g, '');
    const editedStoresString = jsonStores.replace(/[\[\]"`]+/g, '');

    // Removed closers from files to append information
    const rdRoutesModified = rdRoutes.slice(0, -2);
    const rdStoresModified = rdStores.slice(0, -1);

    // Append the new information and close files after changes
    rdRoutesStringToBeWritten = `${rdRoutesModified}${editedRoutesString}];`;
    rdStoresStringToBeWritten = `${rdStoresModified}${editedStoresString}}`;
  }

  // 1[c] Once everything is clear write the updated file into the ./rdvue foldler
  if (
    rdRoutes !== undefined &&
    PROJECT_ROUTES_FILE_PATH !== undefined && rdRoutesStringToBeWritten !== '' &&
    PROJECT_STORE_FILE_PATH !== undefined && rdStoresStringToBeWritten !== ''
  ) {
    writeFile(PROJECT_ROUTES_FILE_PATH, rdRoutesStringToBeWritten);
    writeFile(PROJECT_STORE_FILE_PATH, rdStoresStringToBeWritten);
  } else {
    console.log(feature);
  }
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
  actionBeingRequested,
  parseDynamicRoutes,
  getFeatureGroupByName,
  isOptionalFeature,
  displayModulesByFeatureGroup
};
