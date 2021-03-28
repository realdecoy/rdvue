import chalk from 'chalk'
import * as inquirer from 'inquirer'
import {Lookup} from '../lib/types'
import {getProjectRoot} from './files'

/**
 * Description: determine if string is in kebab case (e.g. my-project-name)
 * @param value - a string value
 */
function isKebabCase(value: string): boolean {
  return true
}

/**
 * Description: determine if string is valid JSON string
 * @param value - a string value
 */
function isJsonString(value: string) {
    try {
        JSON.parse(value)
    } catch (e) {
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
  return value
  && (value.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) as [string])
  .map(x => x.toLowerCase())
  .join('-')
}

/**
 * Description: convert a string to kebab case (e.g. my-project-name)
 * @param value - a string value
 */
function toPascalCase(value: string): string {
  return value
  .split(/[\-_ ]+/)
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
    resultMessage = `${chalk.red('')} A project name is required`
  } else if (!charactersMatch) {
    resultMessage = `${chalk.red('')} Use letters, numbers and '-' for project names (e.g. my-project-name)`
  }

  return isValidProjectName ? true : resultMessage
}

/**
 * Description: determine if string is valid project name
 * @param value - a string value
 */
function validatePageName(value: any) {
  const isString = typeof value === 'string'
  const isNull = value === null || value.length === 0
  // characters in value are limited to alphanumeric characters and hyphens or underscores
  const charactersMatch = value.match(/^[a-zA-Z0-9.\-_]+$/i) !== null 
  const isValidPageName = isString && charactersMatch
  let resultMessage

  if (isNull) {
    resultMessage = `${chalk.red('')} A page name is required`
  } else if (!charactersMatch) {
    resultMessage = `${chalk.red('')} Use letters, numbers and '-' for page names (e.g. page-name)`
  }

  return isValidPageName ? true : resultMessage
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param value - a string value
 */
async function parseProjectName(args: Lookup): Promise<string> {
  let projectName = args['name']
  // if no project name is provided in command then prompt user
  if (!projectName) {
    let responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'my-rdvue-project',
      message: 'Enter a project name: ',
      type: 'input',
      validate: validateProjectName,
    }])
    projectName = responses.name
  }
  return projectName as string
}

/**
 * Description: parse project or prompt user to provide name for project
 * @param value - a string value
 */
async function parsePageName(args: Lookup): Promise<string> {
  let projectName = args['name']
  // if no page name is provided in command then prompt user
  if (!projectName) {
    let responses: any = await inquirer.prompt([{
      name: 'name',
      default: 'hello-world',
      message: 'Enter a page name: ',
      type: 'input',
      validate: validatePageName,
    }])
    projectName = responses.name
  }
  return projectName as string
}

/**
 * Description: determine if command is ran within a valid rdvue project
 */
function checkProjectValidity() {
  const results = {
    isValid: false,
    projectRoot: ''
  }
  let projectRoot: string | null

  projectRoot = getProjectRoot()
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
  parseProjectName,
  parsePageName,
  isJsonString,
  checkProjectValidity,
}