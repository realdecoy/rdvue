/* eslint-disable max-lines */
import chalk from 'chalk';
import { log } from 'console';
import * as inquirer from 'inquirer';
import { ChangeLog, ChangelogConfigTypes, Lookup } from '../modules';
import { CLI_STATE, TEMPLATE_TAG, PLUGIN_PRESET_LIST } from './constants';
import { getProjectRoot, writeFile } from './files';

/**
 * Description: determine if string is valid JSON string
 * @param {string} value - a string value
 * @returns {boolean} -
 */
function isJsonString(value: string): boolean {
  try {
    JSON.parse(value);
  } catch (error) {
    return false;
  }

  return true;
}

/**
 * Description: check if string has a substring 'kebab' in it
 * @param {string} value - a string value
 * @returns {boolean} -
 */
function hasKebab(value = ''): boolean {
  let result = false;
  if (value.match(/kebab/gi) !== null) {
    result = true;
  }

  return result;
}

/**
 * Description: convert a string to kebab case (e.g. my-project-name)
 * @param {string} value - a
 * @returns {string} - string value
 */
function toKebabCase(value: string): string {
  return value &&
    (value.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g) ?? [''])
      .map(x => x.toLowerCase())
      .join('-');
}

/**
 * Description: convert a string to kebab case (e.g. my-project-name)
 * @param {string} value - a string value
 * @returns {string} -
 */
function toPascalCase(value: string): string {
  return value
    .split(/[-_ ]+/)
    .join(' ')
    .replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase())
    .split(' ')
    .join('');
}

/**
 * Description: determine if string is valid component name
 * @param {string} value - a string value
 * @returns {any} -
 */
function validateEnteredName(elementName: string, exampleName = '') {
  return (value: any) => {
    const isString = typeof value === 'string';
    const isNull = value === null || value.length === 0;
    // characters in value are limited to alphanumeric characters and hyphens or underscores
    const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null;
    const isValidName = isString && charactersMatch;
    let resultMessage;

    if (isNull) {
      resultMessage = `${CLI_STATE.Error} A ${elementName} name is required`;
    } else if (!charactersMatch) {
      resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for ${elementName} names (e.g. ${exampleName ? exampleName : 'my-' + elementName + '-name'})`;
    }

    return isValidName ? true : resultMessage;
  }
}

/**
 * Description: parse component or prompt user to provide name for component
 * @param {string} args - a string value
 * @returns {Lookup} -
 */
async function parseComponentName(args: Lookup): Promise<string> {
  let argName = args.name;
  const validateComponentName = validateEnteredName('component');
  // if no component name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'my-component',
      message: 'Enter a component name: ',
      type: 'input',
      validate: validateComponentName,
    }]);
    argName = responses.name;
  }

  return argName;
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param {string} args - a string value
 * @returns {Lookup} -
 */
async function parseProjectName(args: Lookup): Promise<string> {
  let argName = args.name;
  const validateProjectName = validateEnteredName('project');
  // if no project name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'my-rdvue-project',
      message: 'Enter a project name: ',
      type: 'input',
      validate: validateProjectName,
    }]);
    argName = responses.name;
  }

  return argName;
}

/**
 * Description: parse layout or prompt user to provide name for layout
 * @param {string} args  - a string value
 * @returns {Lookup} -
 */
async function parseLayoutName(args: Lookup): Promise<string> {
  let argName = args.name;
  const validateLayoutName = validateEnteredName('layout');
  // if no layout name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'my-layout',
      message: 'Enter a layout name: ',
      type: 'input',
      validate: validateLayoutName,
    }]);
    argName = responses.name;
  }

  return argName;
}

/**
 * Description: parse project or prompt user to provide name for template version
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
async function parseVersionName(args: Lookup): Promise<string> {
  let argName = args.name;
  const validateVersionName = validateEnteredName('version');
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: TEMPLATE_TAG,
      message: 'Enter a version: ',
      type: 'input',
      validate: validateVersionName,
    }]);
    argName = responses.name;
  }

  return argName;
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
async function parseProjectPresets(args: Lookup): Promise<string> {
  let argName = args.preset;
  // if no project name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'preset',
      default: 0,
      message: 'Pick a preset: ',
      type: 'list',
      choices: PLUGIN_PRESET_LIST,
    }]);
    argName = responses.preset;
  }

  return argName;
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
async function parsePageName(args: Lookup): Promise<string> {
  let argName = args.name;
  const validatePageName = validateEnteredName('page');
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'hello-world',
      message: 'Enter a page name: ',
      type: 'input',
      validate: validatePageName,
    }]);
    argName = responses.name;
  }

  return argName;
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
async function parseServiceName(args: Lookup): Promise<string> {
  let argName = args.name;
  const validateServiceName = validateEnteredName('service');
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'auth-service',
      message: 'Enter a service name: ',
      type: 'input',
      validate: validateServiceName,
    }]);
    argName = responses.name;
  }

  return argName;
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
async function parseStoreModuleName(args: Lookup): Promise<string> {
  let argName = args.name;
  const validateStoreModuleName = validateEnteredName('store', 'auth-store');
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'auth-store',
      message: 'Enter a store module name: ',
      type: 'input',
      validate: validateStoreModuleName,
    }]);
    argName = responses.name;
  }

  return argName;
}

/**
 * Description: determine if command is ran within a valid rdvue project
 * @returns {any} -
 */
function checkProjectValidity(): { isValid: boolean, projectRoot: string } {
  const results = {
    isValid: false,
    projectRoot: '',
  };

  const projectRoot: string | null = getProjectRoot();
  if (projectRoot !== null && projectRoot !== '') {
    results.isValid = true;
    results.projectRoot = projectRoot;
  } else {
    results.isValid = false;
  }

  return results;
}
/**
 * Description: generates a changelog.md file from the resource groups
 * in the changeLogData object.
 * @param {string} versionName - the version name to use in the changelog.md file
 * @param {string} changelogPath - the path where the changelog.md file will be generated
 * @param {ChangeLog} changeLogData - the data to use in the changelog.md file
 * @returns {void}
 */
function createChangelogReadme(
  versionName: string,
  changelogPath: string,
  changeLogData: ChangeLog,
): void {
  const createdChangeLogResources = changeLogData[ChangelogConfigTypes.CREATE]?.resources ?? [];
  const deletedChangeLogResources = changeLogData[ChangelogConfigTypes.DELETE]?.resources ?? [];
  const updatedChangeLogResources = changeLogData[ChangelogConfigTypes.UPDATE]?.resources ?? [];
  const createdFiles: string[] = createdChangeLogResources.map(resource => {
    if (resource.srcPath) {
      return `${resource.srcPath}/${resource.file?.target}`;
    }

    return `${resource.file?.target}`;
  });

  const deletedFiles: string[] = deletedChangeLogResources.map(resource => {
    if (resource.destPath) {
      return `${resource.destPath}/${resource.name}`;
    }

    return `${resource.name}`;
  });

  const updatedFiles: string[] = updatedChangeLogResources.map(resource => (resource.destPath));

  const readmeContent =
    `
# Changelog - ${versionName}
The \`upgrade\` command is used to upgrade a project to the latest version of the template, or to a specified version.
During the course of the upgrade files may be added, deleted or updated. When it comes to updating, .json files are updated inline. For changes to all other file types, your existing project file will not be touched, but a file will be created at the same path containing the new changes to the template's base file, in the form of ${'`<existing_filename>.update.<extension>`'}
  
## Added Files
${createdFiles.map(file => `- ${file}`).join('\n')}
 
## Deleted Files
${deletedFiles.map(file => `- ${file}`).join('\n')}
  
## Updated Files
${updatedFiles.map(file => `- ${file}`).join('\n')}
  
## Notes on the Upgrade
${changeLogData.reccomendations || 'No notes on the upgrade'}
`;
  writeFile(changelogPath, readmeContent);
  log(chalk(readmeContent));
}

export {
  hasKebab,
  toKebabCase,
  toPascalCase,
  parseComponentName,
  parseLayoutName,
  parseProjectName,
  parseProjectPresets,
  parseVersionName,
  parsePageName,
  parseServiceName,
  parseStoreModuleName,
  isJsonString,
  checkProjectValidity,
  createChangelogReadme,
};
