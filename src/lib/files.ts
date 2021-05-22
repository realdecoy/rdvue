import fileSystem from 'fs'
import bluebirdPromise from 'bluebird'
import path from 'path'
import mkdirp from 'mkdirp'
import util from 'util'
import chalk from 'chalk'
import {Files, InjectOptions} from '../modules'
const replace = require('replace-in-file')
import {hasKebab} from './utilities'
import {DYNAMIC_OBJECTS, TEMPLATE_CONFIG_FILENAME, TEMPLATE_ROOT} from './constants'

const UTF8 = 'utf-8'
const fs = bluebirdPromise.promisifyAll(fileSystem)
const copyFilePromise = util.promisify(fs.copyFile)
const getDirName = path.dirname

/**
 * Description: Read file located at specified filePath
 * @param {string} filePath - a path to a file
 * @returns {string} -
 */
function readFile(filePath: string): string {
  return fs.readFileSync(filePath, UTF8)
}

/**
 * Description: Determine whether or not the given path is a
 *              directory which exists
 * @param {string} filePath - a path to a file
 * @returns {boolean} -
 */
function directoryExists(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isDirectory()
  } catch (error) {
    return false
  }
}

/**
 * Description: Determine whether or not the given file exists
 * @param {string} filePath - a path to a file
 * @returns {boolean} -
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath)
  } catch (error) {
    return false
  }
}

/**
 * Description: Read main config file to determine options the tool can take
 * @param {string} filePath -
 * @returns {any} -
 */
function readConfigFile(filePath: string): any {
  const isExistingFile = fileExists(filePath)
  if (isExistingFile === false) {
    throw new Error(
      JSON.stringify({
        code: 'missing-template-file',
        message: `template file not found, run ${chalk.whiteBright('npx rdvue repair')} to continue`,
      })
    )
  }
  return JSON.parse(readFile(filePath))
}

/**
 *  Description: parse config files required for scaffolding this module
 * @param {string[]} folderList -
 * @param {string} projectRoot -
 * @returns {any} -
 */
function parseModuleConfig(folderList: string[], projectRoot: string) {
  return folderList.map(folder => {
    const moduleTemplatePath = path.join(projectRoot, TEMPLATE_ROOT, folder)
    const configFilePath = path.join(moduleTemplatePath, TEMPLATE_CONFIG_FILENAME)
    return {
      name: folder,
      moduleTemplatePath,
      manifest: readConfigFile(configFilePath),
    }
  })
}

/**
 * Description: Writes given data to a file
 * @param {string} filePath - path of file which will be created or modified to include given data
 * @param {string} data - data written to file
 * @returns {boolean} -
 */
function writeFile(filePath: string, data: string): boolean {
  let success = true
  try {
    fs.writeFileSync(filePath, data)
  } catch (error) {
    // eslint:disable-next-line:no-console
    success = false
    throw new Error('failed to write to file')
  }

  return success
}

/**
 * Description: Replace content in list of files based on configs passed in
 * @param {string|string[]} files -
 * @param {RegExp} from -
 * @param {string} to -
 * @returns {Promise<boolean>} -
 */
async function replaceInFiles(files: string | string[], from: RegExp, to: string): Promise<boolean> {
  let result = false
  let replaceResults
  let failedFiles
  const options = {
    files,
    from,
    to,
  }

  try {
    replaceResults = await replace(options)
    failedFiles = replaceResults
    .filter((result: { file: string; hasChanged: boolean }) => !result.hasChanged)
    .map((result: { file: string; hasChanged: boolean }) => result.file)
    result = failedFiles.length === 0
  } catch (error) {
    throw new Error(
      JSON.stringify({
        code: 'file-not-changed',
        message: error.message,
      })
    )
  }

  return result
}

/**
 * Description: Replace filename with a given value
 * @param {string} fileName - filename to be replaced
 * @param {RegExp} placeholder - pattern used with specified flag in order
 *                      to created new RegExp (old file name)
 * @param {string} value - value to replace old filename
 * @returns {string} -
 */
function replaceFileName(
  fileName: string,
  placeholder: RegExp,
  value: string
): string {
  const r = new RegExp(placeholder, 'g')
  const response = fileName.replace(r, value)

  return response
}

/**
 * Description: Update target filenames to include feature name
 * @param {Array<string|Files>} files - filenames which need to be updated
 * @param {string} featureName - the string used to update the name of the files
 * @returns {void} -
 */
function replaceTargetFileNames(
  files: Array<string | Files>,
  featureName: string
): void {
  if (featureName !== '') {
    files.forEach((file: string | Files) => {
      if (typeof file !== 'string') {
        if (file.target !== file.source) {
          file.target = replaceFileName(
            file.target,
            /(\${.*?\})/,
            featureName ?? ''
          )
        }
      }
    })
  }
}

/**
 * Description: Copy files from a source directory to a destination directory
 * @param {string} srcDir - directory from which files will be copied
 * @param {string} destDir - directory to which files will be copied
 * @param {Array<string|Files>} files - files to be copied
 * @returns {Promise<any>} -
 */
async function copyFiles(
  srcDir: string,
  destDir: string,
  files: Array<string | Files>
) {
  return Promise.all(
    files.map(async (f: Files | string) => {
      let source = ''
      let dest = ''
      // Get source and destination paths
      if (typeof f === 'string') {
        source = path.join(
          srcDir,
          `${srcDir.includes('config') ? 'core' : ''}`,
          f
        )
        dest = path.join(destDir, f)
      } else {
        source = path.join(srcDir, f.source)
        dest = path.join(destDir, f.target)
      }

      // Create all the necessary directories if they dont exist
      const dirName = getDirName(dest)
      mkdirp.sync(dirName)

      return copyFilePromise(source, dest)
    })
  )
}

/**
 * Description: Write changes to a file
 * @param {string} filePath - location of file to be updated
 * @param {string} file - existing file content
 * @param {string} placeholder - placeholder to be replaced
 * @param {string} value - value to replace content in file
 * @returns {Promise<void>} -
 */
async function updateFile(
  filePath: string,
  file: string,
  placeholder: string,
  value: string
): Promise<void> {
  const r = new RegExp(placeholder, 'g')

  if (value !== '') {
    const newValue = file.replace(r, value)
    // tslint:disable-next-line:no-console

    fs.writeFileSync(filePath, newValue, UTF8)
  }
}

/**
 * Read files that have been copied to target destination
 * and replace template values with input recieved form user
 * through prompts
 * @param {string} destDir - target destination
 * @param {Files[] | Array<string | Files>} files - files to read
 * @param {string} kebabName - name of feature in kebab case
 * @param {string} pascalName - name of feature in pascal case
 * @returns {Promise<void>} -
 */
async function readAndUpdateFeatureFiles(
  destDir: string,
  files: Files[] | Array<string | Files>,
  kebabName: string,
  pascalName: string,
) {
  let filename = ''
  let filePath = ''

  // [3] For each file in the list
  for (const file of files) {
    if (typeof file === 'string') {
      continue
    }

    // [3b] Add the target file to the path of the desired destination directory
    filePath = path.join(destDir, file.target)

    // Obtaining the file name from the file path
    filename = filePath.replace(/^.*[\\\/]/, '')

    // [3c] Check if the contents of the file is defined
    if (file.content !== undefined && Array.isArray(file.content)) {
      // [3d] For each content block in the file contnet array
      for (const contentBlock of file.content) {
        if (contentBlock && contentBlock.matchRegex) {
          // [4] Get the content at the desired file path
          const fileContent = readFile(filePath)

          // [5] Update the contents of the file at given filePath
          await updateFile(
            filePath,
            fileContent,
            contentBlock.matchRegex,
            hasKebab(contentBlock.replace) === true ?
              kebabName :
              contentBlock.replace.includes('${') ?
                pascalName :
                contentBlock.replace
          )
        }
      }
    } else if (file.content) {
      throw new Error(
        JSON.stringify({
          code: 'failed-match-and-replace',
          message: `failed to match and replace  for :${kebabName} files`,
        })
      )
    }
  }
}

/**
 * Description: determine if is root directory of rdvue project
 * @param {string|null} location defaults to null
 * @returns {boolean} -
 */
function isRootDirectory(location: string | null = null): boolean {
  let isRoot = false
  try {
    let paths = []
    let testLocation = location
    if (location === null) {
      testLocation = process.cwd()
    }

    if (testLocation !== null) {
      paths = testLocation.split(path.sep)
      if (paths.length > 0 && paths[1] === '') {
        isRoot = true
      }
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    throw new Error('Error checking root directory')
  }

  return isRoot
}

/**
 * Description: determine the root of the current project
 * @returns {string} -
 */
function getProjectRoot() {
  const configFolderName = '.rdvue'
  const maxTraverse = 20

  let currentPath = process.cwd()
  let currentTraverse = 0
  let projectRoot = null
  let back = './'

  while (true) {
    currentPath = path.join(process.cwd(), back)
    back = path.join(back, '../')
    currentTraverse += 1

    if (directoryExists(path.join(currentPath, configFolderName))) {
      projectRoot = currentPath
      break
    } else if (isRootDirectory(currentPath)) {
      projectRoot = null
      break
    } else if (currentTraverse > maxTraverse) {
      projectRoot = null
      break
    }
  }

  return projectRoot
}

/**
 * Description: Determine whether or not the given file path is a
 *              directory which exists
 * @param {string} folderPath - a path to a folder
 * @returns {void} -
 */
function checkIfFolderExists(folderPath: string) {
  const isExistingFolder = directoryExists(folderPath)
  // block command if project folder already exists
  if (isExistingFolder === true) {
    throw new Error(
      JSON.stringify({
        code: 'existing-folder',
        message: `folder named ${chalk.whiteBright(folderPath)} already exists`,
      })
    )
  }
}

/**
 * Description: Determine whether or not the given folder path is a
 *              directory which exists
 * @param {string} folderPath - a path to a folder
 * @returns {void} -
 */
function verifyTemplateFolderExists(folderPath: string) {
  const isExistingFolder = directoryExists(folderPath)
  // block command if project folder already exists
  if (isExistingFolder === false) {
    throw new Error(
      JSON.stringify({
        code: 'missing-template-folder',
        message: `template folder not found, run ${chalk.whiteBright('npx rdvue repair')} to continue`,
      })
    )
  }
}

/**
 * Description: Inject dynamic objects into project files
 * @param {string} projectRoot -
 * @param {string} jsonData - stringified json data from file
 * @param {string} objectName - property name to be injected
 * @param {boolean?} hasBrackets - injected object has brackets
 * @returns {void} -
 */
function parseDynamicObjects(
  projectRoot: string,
  jsonData: string,
  objectName: string,
  hasBrackets?: boolean
): void {
  let filePathOfObjectInsideProject
  let objectInProject
  let objectStringToBeWritten = ''

  // 1[b] Once inside of a project values are assigned to be used
  if (projectRoot !== null) {
    // Allocate the location of the <OBJECT>.js file
    filePathOfObjectInsideProject = path.join(
      projectRoot,
      '.rdvue',
      `${objectName}.js`
    )

    // Read files to be modified
    objectInProject = readFile(filePathOfObjectInsideProject)

    // Replace brackets & ("/`) quotations in string
    let modifiedJSONData = jsonData.replace(/[\[\]"`]+/g, '')

    // Remove beginning and closing brackets if its an option to be modified
    if (hasBrackets) {
      modifiedJSONData = modifiedJSONData.substring(
        1,
        modifiedJSONData.length - 1
      )
    }

    // Removed closers from files to append information
    const originalObjectString = objectInProject.slice(0, -2)

    // Append the new information and close files after changes
    objectStringToBeWritten = `${originalObjectString}${modifiedJSONData.trim()},${objectName === DYNAMIC_OBJECTS.Routes ? ']' : '}'
    };`
  }

  // 1[c] Once everything is clear write the updated file into the ./rdvue foldler
  if (
    filePathOfObjectInsideProject !== undefined &&
    objectStringToBeWritten !== ''
  ) {
    writeFile(filePathOfObjectInsideProject, objectStringToBeWritten)
  }
}

/**
 * Injects the content into the targetted file.
 * @param {string} targetPath full path to the file you are injecting into
 * @param {string} content The content to inject
 * @param {InjectOptions?} options see InjectOptions type
 */
function inject(targetPath: string, content: string, options?: InjectOptions): void {
  const encoding = options?.encoding ?? 'utf-8'
  let index = options?.index ?? 0

  let targetContent = fs.readFileSync(targetPath, {encoding})
  const lines = targetContent.split(/\r?\n/g).reverse()
  if (typeof index === 'function') {
    index = index(lines)
  }
  lines[index] += content
  targetContent = lines.reverse().join('\n')
  fs.writeFileSync(targetPath, targetContent, {encoding})
}

/**
 * Description:
 * @param {string} projectRoot -
 * @param {string} folderName -
 * @param {string|string[]} featuredata -
 * @param {string} fileName -
 * @returns {void}
 */
async function updateDynamicImportsAndExports(
  projectRoot: string,
  folderName: string,
  featuredata: string | string[],
  fileName: string
) {
  const SOURCE_DIRECTORY = 'src'

  if (projectRoot === null) {
    // eslint-disable-next-line no-console
    console.log('Project location was not found')
  } else {
    const fileLocation = path.join(projectRoot, SOURCE_DIRECTORY, folderName, fileName)
    if (fileExists(fileLocation)) {
      if (typeof featuredata === 'string') {
        fs.appendFileSync(fileLocation, featuredata)
      } else {
        featuredata.forEach(data => {
          fs.appendFileSync(fileLocation, data)
        })
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(`${fileLocation} - Does not exist`)
    }
  }
}

export {
  updateDynamicImportsAndExports,
  parseDynamicObjects,
  verifyTemplateFolderExists,
  checkIfFolderExists,
  parseModuleConfig,
  replaceInFiles,
  replaceTargetFileNames,
  readAndUpdateFeatureFiles,
  copyFiles,
  getProjectRoot,
  fileExists,
  writeFile,
  inject,
}
