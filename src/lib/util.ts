import chalk from 'chalk';
import commandLineUsage, { Section } from 'command-line-usage';
import figlet from 'figlet';
import path from 'path';
import colors from 'colors'
import npm from 'npm-programmatic';
import logSymbols from 'log-symbols';
import { Group, NpmProgrammaticConfiguration } from '../types/cli';
import { ACTIONS, ADD_ACTION, ADD_GROUP, DYNAMIC_OBJECTS, INDEX_FILE, LIST_ACTION, LOG_TYPES } from '../constants/constants';
import { CLI_DESCRIPTION } from '../index';
import { Command } from '../types/index';
import cliProgress from 'cli-progress'
import {
  appendToFile,
  directoryExists,
  fileExists,
  readFile,
  readMainConfig,
  writeFile
} from './files';
import { getFeatureConfiguration } from './helper-functions';
import { isPlugin } from './optional-modules';

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
  const found = features.some(r => args.includes(r));

  return found;
}

function hasOptions(args: string[], options: string[]): boolean {
  // Console.log(`hasOptions: ${options}`);
  const found = options.some(r => args.includes(r));

  return found;
}

function hasHelpOption(args: string[]): boolean {
  // Console.log(`hasHelpOptions: ${helpOptions}`);
  const found = helpOptions.some(r => args.includes(r));

  return found;
}

function hasInvalidOption(args: string[], options: string[]): boolean {
  // Console.log(`hasInvalidOption: ${args}`);
  const found = args.some(
    r => !options.includes(r) && !helpOptions.includes(r)
  );

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
  const feature = readMainConfig()?.groups?.find(g => g.name === name);

  return feature;
}
/**
 * Checks if the feature given by the user is a feature group type
 * @param feature - name of feature
 */
function isFeatureGroupType(feature: string): boolean {
  const featureGroups = readMainConfig()?.groups;
  let isGroup;
  if (featureGroups !== undefined) {
    isGroup = featureGroups.find(featureGroup => featureGroup.name === feature);
  }

  return isGroup === undefined ? false : true;
}

/**
 * Description - Accepts a string representing an ACTION and checks
 * if that string is a Command (ACTION) relating to optional modules
 * @param command - Name of ACTION
 */
function isOptionalModuleAction(command: string) {
  const isTrue =
    command === ADD_ACTION || command === ADD_GROUP || command === LIST_ACTION;

  return isTrue;
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

  // This holds the argument that is expected after <rdvue list>
  const isPlugins = 'plugins';

  // Magic numbers are not allowed: used to check third argument
  const argIndex = 2;
  let remainingArgs = [];

  // [1] Checking first argument <action> to see if it includes a valid actions
  // (eg. generate)
  if (args[0] !== undefined && actionBeingRequested(args[0]).length > 0) {
    returnObject.action = args[0];

    // [2] Checking second argument <feature>
    // to see if it includes a valid feature (eg. project or page)
    // OR a Plugin or a Feature Group Type
    // OR if its 'features' which was passed - 'features' is used to list optional modules/features
    if (
      args[1] !== undefined &&
      (features.includes(args[1]) ||
        isFeatureGroupType(args[1]) ||
        isPlugin(args[1]))
    ) {
      returnObject.feature = args[1];

      // [3] Checking third argument <feature name> eg. "test_project"
      // If the feature name entered contains '--' at the beggining of the word
      // it is assumed that they are entering an option instead and therefore, no feature name
      // has been inputed/proccessed.
      if (
        args[argIndex] !== undefined &&
        args[argIndex].substring(0, argIndex) !== '--'
      ) {
        returnObject.featureName = args[argIndex];
      }

      // Remove the first <action> and second <feature> argument from array and put remaining
      // arguments into remainingArgs array
      remainingArgs = args.slice(argIndex);
      remainingArgs.filter(
        userinput => userinput.substring(0, argIndex) !== '--'
      );

      // If there is more than one argument and none of these include the help option
      // Assume incorrect name has been inputed.
      if (remainingArgs.length > 1 && !hasHelpOption(remainingArgs)) {
        // TODO: Display help menu & exit
        // tslint:disable-next-line
        console.log(commandLineUsage(CLI_DESCRIPTION.general.menu));
        throw new Error(
          chalk.red(
            `Please enter a valid feature name; See help menu above for instructions.`
          )
        );
      }

      // [4] Checking all arguments to see if they contain any options
      returnObject.options = args.filter(
        option => option.substring(0, argIndex) === '--'
      );
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
    result = match.map(x => x.toLowerCase()).join('-');
  }

  return result;
}

function getPascalCase(str: string) {
  const word = str.replace(/([-_][a-z0-9])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });

  return `${word.charAt(0).toLocaleUpperCase()}${word.substring(1)}`;
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
  const configFolderName = '.rdvue';
  const maxTraverse = 20;

  let currentPath = process.cwd();
  let currentTraverse = 0;
  let projectRoot = null;
  let back = './';

  while (true) {
    currentPath = path.join(process.cwd(), back);
    back = path.join(back, '../');
    currentTraverse += 1;

    if (directoryExists(path.join(currentPath, configFolderName))) {
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
    projectRoot: ''
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

function parseDynamicObjects(
  jsonData: string,
  objectName: string,
  hasBrackets?: boolean
): void {
  let filePathOfObjectInsideProject;
  let objectInProject;
  let objectStringToBeWritten = '';

  // 1[a] Check for the root of the project
  const PROJECT_ROOT = getProjectRoot();

  // 1[b] Once inside of a project values are assigned to be used
  if (PROJECT_ROOT !== null) {
    // Allocate the location of the <OBJECT>.js file
    filePathOfObjectInsideProject = path.join(
      PROJECT_ROOT,
      '.rdvue',
      `${objectName}.js`
    );

    // Read files to be modified
    objectInProject = readFile(filePathOfObjectInsideProject);

    // Replace brackets & ("/`) quotations in string
    let modifiedJSONData = jsonData.replace(/[\[\]"`]+/g, '');

    // Remove beginning and closing brackets if its an option to be modified
    if (hasBrackets) {
      modifiedJSONData = modifiedJSONData.substring(
        1,
        modifiedJSONData.length - 1
      );
    }

    // Removed closers from files to append information
    const originalObjectString = objectInProject.slice(0, -2);

    // Append the new information and close files after changes
    objectStringToBeWritten = `${originalObjectString}${modifiedJSONData.trim()},${
      objectName === DYNAMIC_OBJECTS.routes ? ']' : '}'
    };`;
  }

  // 1[c] Once everything is clear write the updated file into the ./rdvue foldler
  if (
    filePathOfObjectInsideProject !== undefined &&
    objectStringToBeWritten !== ''
  ) {
    writeFile(filePathOfObjectInsideProject, objectStringToBeWritten);
  } else {
    // console.log(feature);
  }
}

async function dependencyInstaller(
  script: string[],
  featureName: string | undefined,
  config: NpmProgrammaticConfiguration
) {
  const projectroot = getProjectRoot();

  if (projectroot !== null) {
    config.cwd = projectroot;
   
    // new line to maintain cli output
    console.log('\n')    
   // initialize loading state instance
    const loading = new cliProgress.SingleBar({
    format: `Installing ${featureName} packages [{bar}] {percentage}% | `+ colors.magenta('ETA: ') + `{eta}s | `+ colors.magenta('Duration: ') +`{duration}s` ,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: null
   }, cliProgress.Presets.legacy);
 
    dependencyProgressStatus(loading);

    await npm
      .install(script, config)
      .then(function() {
        if (config.save) {   
          // forces the loading status to completion by the time npm finishes installing the dependecies
          dependencyProgressComplete(loading, 250)
          console.log(
            `${logSymbols.success} Successfully installed required package/s ${[...script]}`
          );
        }

        if (config.saveDev) {
          dependencyProgressComplete(loading, 250)
          console.log(
            `${logSymbols.success} Successfully installed required dev package/s ${[...script]}`
          );
        }
      })
      .catch(function() {
        if (config.save) {
          dependencyProgressComplete(loading, 250)
          console.log(`${logSymbols.error} Unable to install required package/s ${[...script]}`);
        }

        if (config.saveDev) {
          dependencyProgressComplete(loading, 250)
          console.log(
            `${logSymbols.error} Unable to install required dev package/s ${[...script]}`
          );
        }
      });
  } else {
    console.log('Project location not found');
  }
}

function dependencyProgressComplete(loading: cliProgress.SingleBar, completed: number){
  loading.update(completed)
  loading.stop();
}

async function dependencyProgressStatus(loading: cliProgress.SingleBar) {

  // starts the loading animation
  loading.start(250, 0);

  for(let i = 0; i == i; i++) {
    // update the current value in your application..
    loading.update(i);
    loading.updateETA();
    // wait periodically to simulate a realistic loading animation
    await wait(150);
  }

  function wait(ms: number) {
    return  new Promise((resolve: any) => setTimeout(resolve, ms)); 
  }
}

function displayFeatureGroupsWithPlugins() {
  const groups = readMainConfig()?.groups;

  if (groups !== undefined) {
    console.log(chalk.green('Feature Groups'));

    for (const group of groups) {
      if (group.plugins.length > 0) {
        console.log(commandLineUsage([{ header: group.name }] as Section));

        for (const module of group.plugins) {
          const details = getFeatureConfiguration(module);

          console.log(
            commandLineUsage([
              {
                content: [
                  {
                    name: chalk.magenta(details?.name as string),
                    summary: details.description
                  }
                ]
              }
            ])
          );
        }
      }
    }
  }
}

async function updateDynamicImportsAndExports(
  folderName: string,
  featuredata: string | string[],
  fileName: string
) {
  const projectroot = getProjectRoot();
  const SOURCE_DIRECTORY = 'src';

  if (projectroot !== null) {
    const fileLocation = path.join(projectroot, SOURCE_DIRECTORY, folderName, fileName);

    if (fileExists(fileLocation)) {
      await appendToFile(fileLocation, featuredata);
    } else {
      console.log(`${fileLocation} - Does not exist`);
    }
  } else {
    console.log('Project location was not found');
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
  parseDynamicObjects,
  dependencyInstaller,
  getFeatureGroupByName,
  displayFeatureGroupsWithPlugins,
  isOptionalModuleAction,
  isFeatureGroupType,
  updateDynamicImportsAndExports
};
