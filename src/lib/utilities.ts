import * as inquirer from 'inquirer'
import { Lookup } from '../modules'
import { CLI_STATE, TEMPLATE_TAG, PLUGIN_PRESET_LIST } from './constants'
import { getProjectRoot } from './files'

/**
 * Description: determine if string is valid JSON string
 * @param value - a string value
 */
function isJsonString(value: string) {
  try {
    JSON.parse(value)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Description: check if string has a substring 'kebab' in it
 * @param value - a string value
 */
function hasKebab(value = ''): boolean {
  let result = false
  if (value.match(/kebab/gi) !== null) {
    result = true
  }

  return result
}

/**
 * Description: convert a string to kebab case (e.g. my-project-name)
 * @param value - a string value
 */
function toKebabCase(value: string): string {
  return value &&
    (value.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g) as [string])
      .map(x => x.toLowerCase())
      .join('-')
}

/**
 * Description: convert a string to kebab case (e.g. my-project-name)
 * @param value - a string value
 */
function toPascalCase(value: string): string {
  return value
    .split(/[-_ ]+/)
    .join(' ')
    .replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase())
    .split(' ')
    .join('')
}

/**
 * Description: determine if string is valid project name
 * @param value - a string value
 */
function validateProjectName(value: any) {
  const isString = typeof value === 'string'
  const isNull = value === null || value.length === 0
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null
  const isValidProjectName = isString && charactersMatch
  let resultMessage

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A project name is required`
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for project names (e.g. my-project-name)`
  }

  return isValidProjectName ? true : resultMessage
}

/**
 * Description: determine if string is valid component name
 * @param value - a string value
 */
function validateComponentName(value: any) {
  const isString = typeof value === 'string'
  const isNull = value === null || value.length === 0
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null
  const isValidComponentName = isString && charactersMatch
  let resultMessage

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A component name is required`
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for component names (e.g. my-component-name)`
  }

  return isValidComponentName ? true : resultMessage
}

/**
 * Description: determine if string is valid version name
 * @param value - a string value
 */
function validateVersionName(value: any) {
  const isString = typeof value === 'string'
  const isNull = value === null || value.length === 0
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null
  const isValidVersionName = isString && charactersMatch
  let resultMessage

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A version name is required`
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for version names (e.g. my-version-name)`
  }

  return isValidVersionName ? true : resultMessage
}

/**
 * Description: determine if string is valid page name
 * @param value - a string value
 */
function validatePageName(value: any) {
  const isString = typeof value === 'string'
  const isNull = value === null || value.length === 0
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null
  const isValidArgName = isString && charactersMatch
  let resultMessage

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A page name is required`
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for page names (e.g. page-name)`
  }

  return isValidArgName ? true : resultMessage
}

/**
 * Description: determine if string is valid service name
 * @param value - a string value
 */
function validateServiceName(value: any) {
  const isString = typeof value === 'string'
  const isNull = value === null || value.length === 0
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null
  const isValidArgName = isString && charactersMatch
  let resultMessage

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A service name is required`
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for service names (e.g. service-name)`
  }

  return isValidArgName ? true : resultMessage
}

/**
 * Description: determine if string is valid store module name
 * @param value - a string value
 */
function validateStoreModuleName(value: any) {
  const isString = typeof value === 'string'
  const isNull = value === null || value.length === 0
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null
  const isValidArgName = isString && charactersMatch
  let resultMessage

  if (isNull) {
    resultMessage = `${CLI_STATE.Error} A store module name is required`
  } else if (!charactersMatch) {
    resultMessage = `${CLI_STATE.Error} Use letters, numbers and '-' for store module names (e.g. auth-store)`
  }

  return isValidArgName ? true : resultMessage
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param value - a string value
 */
async function parseComponentName(args: Lookup): Promise<string> {
  let argName = args.name
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'my-component',
      message: 'Enter a component name: ',
      type: 'input',
      validate: validateComponentName,
    }])
    argName = responses.name
  }
  return argName as string
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param value - a string value
 */
async function parseProjectName(args: Lookup): Promise<string> {
  let argName = args.name
  // if no project name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'my-rdvue-project',
      message: 'Enter a project name: ',
      type: 'input',
      validate: validateProjectName,
    }])
    argName = responses.name
  }
  return argName as string
}

/**
 * Description: parse project or prompt user to provide name for template version
 * @param value - a string value
 */
async function parseVersionName(args: Lookup): Promise<string> {
  let argName = args.name
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: TEMPLATE_TAG,
      message: 'Enter a version: ',
      type: 'input',
      validate: validateVersionName,
    }])
    argName = responses.name
  }
  return argName as string
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param value - a string value
 */
async function parseProjectPresets(args: Lookup): Promise<string> {
  let argName = args.preset
  // if no project name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'preset',
      default: 0,
      message: 'Pick a preset: ',
      type: 'list',
      choices: PLUGIN_PRESET_LIST,
    }])
    argName = responses.preset
  }
  return argName as string
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param value - a string value
 */
async function parsePageName(args: Lookup): Promise<string> {
  let argName = args.name
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'hello-world',
      message: 'Enter a page name: ',
      type: 'input',
      validate: validatePageName,
    }])
    argName = responses.name
  }
  return argName as string
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param value - a string value
 */
async function parseServiceName(args: Lookup): Promise<string> {
  let argName = args.name
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'auth-service',
      message: 'Enter a service name: ',
      type: 'input',
      validate: validateServiceName,
    }])
    argName = responses.name
  }
  return argName as string
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param value - a string value
 */
async function parseStoreModuleName(args: Lookup): Promise<string> {
  let argName = args.name
  // if no page name is provided in command then prompt user
  if (!argName) {
    const responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'auth-store',
      message: 'Enter a store module name: ',
      type: 'input',
      validate: validateStoreModuleName,
    }])
    argName = responses.name
  }
  return argName as string
}

/**
 * Description: determine if command is ran within a valid rdvue project
 */
function checkProjectValidity() {
  const results = {
    isValid: false,
    projectRoot: '',
  }

  const projectRoot: string | null = getProjectRoot()
  if (projectRoot !== null && projectRoot !== '') {
    results.isValid = true
    results.projectRoot = projectRoot
  } else {
    results.isValid = false
  }

  return results
}

export {
  hasKebab,
  toKebabCase,
  toPascalCase,
  parseComponentName,
  parseProjectName,
  parseProjectPresets,
  parseVersionName,
  parsePageName,
  parseServiceName,
  parseStoreModuleName,
  isJsonString,
  checkProjectValidity,
}
