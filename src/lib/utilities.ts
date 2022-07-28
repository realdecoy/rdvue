/* eslint-disable max-lines */
import { AxiosRequestConfig, AxiosInstance } from 'axios';
import * as inquirer from 'inquirer';
import { Lookup } from '../modules';
import { CLI_STATE, TEMPLATE_TAG, PLUGIN_PRESET_LIST } from './constants';
import { getProjectRoot, readConfigFile } from './files';

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
 * Description: convert a string to english case (e.g. My Project Name)
 * @param {string} value - a string value
 * @returns {string} -
 */
function toEnglishCase(value: string): string {
  return value
    .split(/[-_ ]+/)
    .join(' ')
    .replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase());
}

/**
 * Description: determine if string is valid project name
 * @param {string} value - a string value
 * @returns {any} -
 */
function validateProjectName(value: any) {
  const isString = typeof value === 'string';
  const isNull = value === null || value.length === 0;
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null;
  const isValidProjectName = isString && charactersMatch;
  let resultMessage;

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A project name is required`;
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for project names (e.g. my-project-name)`;
  }

  return isValidProjectName ? true : resultMessage;
}


/**
 * Description: determine if string is valid project name
 * @param {string} value - a string value
 * @returns {any} -
 */
 function validateDomain(value: string) {
  const isString = typeof value === 'string';
  const isNull = value === null || value.length === 0;
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/) !== null;
  const isValid = isString && charactersMatch;
  let resultMessage;

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A bundleIdentifier is required`;
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} bundleIdenifiter should be a valid domain. Normally this is the reverse of you website's domain (e.g. com.company.app)`;
  }

  return isValid ? true : resultMessage;
}

/**
 * Description: determine if string is valid component name
 * @param {string} value - a string value
 * @returns {any} -
 */
function validateComponentName(value: any) {
  const isString = typeof value === 'string';
  const isNull = value === null || value.length === 0;
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null;
  const isValidComponentName = isString && charactersMatch;
  let resultMessage;

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A component name is required`;
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for component names (e.g. my-component-name)`;
  }

  return isValidComponentName ? true : resultMessage;
}

/**
 * Description: determine if string is valid version name
 * @param {string} value - a string value
 * @returns {any} -
 */
function validateVersionName(value: any) {
  const isString = typeof value === 'string';
  const isNull = value === null || value.length === 0;
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null;
  const isValidVersionName = isString && charactersMatch;
  let resultMessage;

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A version name is required`;
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for version names (e.g. my-version-name)`;
  }

  return isValidVersionName ? true : resultMessage;
}

/**
 * Description: determine if string is valid page name
 * @param {string} value - a string value
 * @returns {any} -
 */
function validatePageName(value: any) {
  const isString = typeof value === 'string';
  const isNull = value === null || value.length === 0;
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null;
  const isValidArgName = isString && charactersMatch;
  let resultMessage;

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A page name is required`;
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for page names (e.g. page-name)`;
  }

  return isValidArgName ? true : resultMessage;
}

/**
 * Description: determine if string is valid service name
 * @param {string} value - a string value
 * @returns {any} -
 */
function validateServiceName(value: any) {
  const isString = typeof value === 'string';
  const isNull = value === null || value.length === 0;
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null;
  const isValidArgName = isString && charactersMatch;
  let resultMessage;

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A service name is required`;
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for service names (e.g. service-name)`;
  }

  return isValidArgName ? true : resultMessage;
}

/**
 * Description: determine if string is valid store module name
 * @param {string | null} value - a string value
 * @returns {any} -
 */
function validateStoreModuleName(value: any) {
  const isString = typeof value === 'string';
  const isNull = value === null || value.length === 0;
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null;
  const isValidArgName = isString && charactersMatch;
  let resultMessage;

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A store module name is required`;
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for store module names (e.g. auth-store)`;
  }

  return isValidArgName ? true : resultMessage;
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
async function parseLayoutName(args: Lookup): Promise<string> {
  let argName = args.name;
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'my-layout',
      message: 'Enter a layout name: ',
      type: 'input',
      validate: validateComponentName,
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
async function parseComponentName(args: Lookup): Promise<string> {
  let argName = args.name;
  // if no page name is provided in command then prompt user
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
 * Description: parse project or prompt user to provide name for template version
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
async function parseVersionName(args: Lookup): Promise<string> {
  let argName = args.name;
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
async function parseScreenName(args: Lookup): Promise<string> {
  let argName = args.name;
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
 * Description: parse project or prompt user to provide name for project
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
 async function parseBundleIdentifier(args: Lookup): Promise<string> {
  let argName = args.bundleIdenifier;
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: '',
      message: 'Enter app\'s Bundle Idenifier (eg. com.company.app): ',
      type: 'input',
      validate: validateDomain
    }]);
    console.log(responses);

    argName = responses.name;
  }
  
  return argName;
}



/**
 * Description: parse project or prompt user to provide name for project
 * @param {Lookup} args - a string value
 * @returns {string} -
 */
 async function parseProjectScheme(args: Lookup): Promise<string> {
  let argName = args.name;
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: '',
      message: 'Enter a name for the project scheme (eg. ProjectName): ',
      type: 'input'
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
 async function parseBitriseAuthorizationKey(args: Lookup): Promise<string> {
  let argName = args.name;
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: '',
      message: 'Enter your Bitrise Authorization Key: ',
      type: 'input'
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
 async function parseGitProviderUrl(args: Lookup): Promise<string> {
  let argName = args.name;
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: '',
      message: 'Enter SSH version of your repository URL (eg. git@github.com:demo_owner/example-repository.git"): ',
      type: 'input'
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
 async function parseRepoOwner(args: Lookup): Promise<string> {
  let argName = args.name;
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: '',
      message: 'Enter the owner of the repository (eg. demo_owner"): ',
      type: 'input'
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
 async function parseGitSlug(args: Lookup): Promise<string> {
  let argName = args.name;
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: '',
      message: 'Enter your repository slug (eg. example-repository.git"): ',
      type: 'input'
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
 async function parseGitProvider(args: Lookup): Promise<string> {
  let argName = args.name;
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: '',
      message: 'Enter GIT provider (eg. Github, bitbucket or Gitlab "): ',
      type: 'input'
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

interface ProjectConfig { 
  projectRoot: string, 
  isMobile: boolean,
  cicd: string,
}


/**
 * Description: determine if command is ran within a valid rdvue project
 * @returns {any} -
 */
 function getProjectConfig(): ProjectConfig {
  const projectRoot: string | null = getProjectRoot();
  return readConfigFile(`${projectRoot}/.rdvue/.rdvue`);
}


export enum RequestMethod {
  post,
  put,
  delete,
  get,
  patch,
  option,
}

async function sendRequest(type: RequestMethod, url: string, axiosInstance?: AxiosInstance, data: any = undefined, config?: AxiosRequestConfig) {
  let response = null;

  switch (type) {
    case RequestMethod.post:
      response = await axiosInstance?.post(url, data, config);
      break;
    case RequestMethod.put:
      response = await axiosInstance?.put(url, data, config);
      break;
    case RequestMethod.get:
      response = await axiosInstance?.get(url, config);
      break;
    case RequestMethod.delete:
      response = await axiosInstance?.delete(url, config);
      break;
    case RequestMethod.patch:
      response = await axiosInstance?.patch(url, data, config);
      break;
    default:
      throw new Error("Unknown request method");
  }
  return response;
};

export {
  hasKebab,
  toKebabCase,
  toPascalCase,
  toEnglishCase,
  parseLayoutName,
  parseComponentName,
  parseProjectName,
  parseProjectPresets,
  parseVersionName,
  parseScreenName,
  parseServiceName,
  parseStoreModuleName,
  isJsonString,
  checkProjectValidity,
  parseBitriseAuthorizationKey,
  parseGitProviderUrl,
  parseGitProvider,
  parseGitSlug,
  parseRepoOwner,
  sendRequest,
  getProjectConfig,
  parseProjectScheme,
  parseBundleIdentifier,
};