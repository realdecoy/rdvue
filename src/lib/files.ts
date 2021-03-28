import fileSystem from 'fs'
import bluebirdPromise from 'bluebird'
import path from 'path'
import mkdirp from 'mkdirp'
import util from 'util'
import {Files} from '../lib/types'
import {TEMPLATE_ROOT} from './constants'
const replace = require('replace-in-file')
import {hasKebab} from './utilities'

const UTF8 = 'utf-8'
const fs = bluebirdPromise.promisifyAll(fileSystem)
const copyFilePromise = util.promisify(fs.copyFile)
const getDirName = path.dirname

/**
 * Description: Read file located at specified filePath
 * @param filePath - a path to a file
 */
function readFile(filePath: string): string {
  return fs.readFileSync(filePath, UTF8)
}

/**
 * Description: Determine whether or not the given file path is a
 *              directory which exists
 * @param filePath - a path to a file
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
 * @param filePath - a path to a file
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath)
  } catch (error) {
    return false
  }
}

/**
 *  Description: Read main config file to determine options the tool can take
 */
function readConfigFile(templateFilePath: string): any {
  const filePath = path.join(TEMPLATE_ROOT, templateFilePath)

  return JSON.parse(readFile(filePath))
}

/**
 * Description: Writes given data to a file
 * @param filePath - path of file which will be created or modified to include given data
 * @param data - data written to file
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
 * @param filePath - a path to a file
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
 * @param fileName - filename to be replaced
 * @param placeholder - pattern used with specified flag in order
 *                      to created new RegExp (old file name)
 * @param value - value to replace old filename
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
 * @param files - filenames which need to be updated
 * @param featureName - the string used to update the name of the files
 */
function replaceTargetFileNames(
  files: Array<string | Files>,
  featureName: string
) {
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
 * @param srcDir - directory from which files will be copied
 * @param destDir - directory to which files will be copied
 * @param files - files to be copied
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
      if (typeof f !== 'string') {
        source = path.join(srcDir, f.source)
        dest = path.join(destDir, f.target)
      } else {
        source = path.join(
          srcDir,
          `${srcDir.includes('config') ? 'core' : ''}`,
          f
        )
        dest = path.join(destDir, f)
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
 * @param filePath - location of file to be updated
 * @param file - existing file content
 * @param placeholder - placeholder to be replaced
 * @param value - value to replace content in file
 */
async function updateFile(
  filePath: string,
  file: string,
  placeholder: string,
  value: string
) {
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
 * @param destDir - target destination
 * @param files - files to read
 * @param kebabName - name of feature in kebab case
 * @param pascalName - name of feature in pascal case
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
    isRoot = true
  }

  return isRoot
}

/**
 * Description: determine the root of the current project
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

export {
  readConfigFile,
  replaceInFiles,
  replaceTargetFileNames,
  readAndUpdateFeatureFiles,
  copyFiles,
  getProjectRoot,
  fileExists,
  writeFile,
}
