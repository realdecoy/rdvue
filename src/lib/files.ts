/**
 * Includes helper functions that associated with files (example: copy files, update files)
 */

import bluebirdPromise from 'bluebird';
import chalk from 'chalk';
import CLI from 'clui';
import fileSystem from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import rimraf from 'rimraf';
import util from 'util';
import * as utils from './util';

import _ from 'lodash';

import { TEMPLATE_ROOT } from '../config';
import {
  CORE,
  featureType,
  MANIFEST_FILE,
  spinnerIcons,
  TEMPLATE_FILE,
  UTF8
} from '../constants/constants';
import { Config } from '../types/cli';
import { FeatureNameObject, Files } from '../types/index';

const Spinner = CLI.Spinner;
const fs = bluebirdPromise.promisifyAll(fileSystem);
const copyFilePromise = util.promisify(fs.copyFile);
const getDirName = path.dirname;

/**
 * Description: Read file located at specified filePath
 * @param filePath - a path to a file
 */
function readFile(filePath: string): string {
  return fs.readFileSync(filePath, UTF8);
}

/**
 * Description: Determine whether or not the given file path is a
 *              directory which exists
 * @param filePath - a path to a file
 */
function directoryExists(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (err) {
    // TODO: log error here
    return false;
  }
}

/**
 * Description: Determine whether or not the given file exists
 * @param filePath - a path to a file
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    // TODO: log error here
    return false;
  }
}

/**
 * Description: Get the base of the directory you are currently in.
 * Returns the last portion of the current path
 */
function getCurrentDirectoryBase(): string {
  return path.basename(process.cwd());
}

/**
 *  Description: Read main config file to determine options the tool can take
 */
function readMainConfig(): Config {
  const filePath = path.join(TEMPLATE_ROOT, TEMPLATE_FILE);

  return JSON.parse(readFile(filePath)) as Config;
}

/**
 * Description: Read sub config for features to determine details about
 *              the individual features and what they are capable of
 * @param command - the command used to retrieve associated configuration
 */
function readSubConfig(command: string): Config {
  const filePath = path.join(TEMPLATE_ROOT, `/${command}`, MANIFEST_FILE);

  return JSON.parse(readFile(filePath)) as Config;
}

/**
 * Description: Clear temporary files at a given path
 * @param folderPath - the folder path for which you would like to clear temporary files
 */
async function clearTempFiles(folderPath: string) {
  rimraf.sync(folderPath);
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
  const r = new RegExp(placeholder, 'g');
  const response = fileName.replace(r, value);

  return response;
}

/**
 * Description: Writes given data to a file
 * @param filePath - path of file which will be created or modified to include given data
 * @param data - data written to file
 */
function writeFile(filePath: string, data: string): boolean {
  let success = true;
  try {
    fs.writeFileSync(filePath, data);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log('Failed to write to file');
    success = false;
  }

  return success;
}

async function updateFile(
  filePath: string,
  file: string,
  placeholder: string,
  value: string
) {
  const r = new RegExp(placeholder, 'g');

  if (value !== '') {
    const newValue = file.replace(r, value);
    // tslint:disable-next-line:no-console

    fs.writeFileSync(filePath, newValue, UTF8);
  }
}

/**
 * Read files that have been copied to target destination
 * and replace template values with input recieved form user
 * through prompts
 * @param destDir - target destination
 * @param files - files to read
 * @param args - input received from user
 */
async function readAndUpdateFeatureFiles(
  destDir: string,
  files: Files[] | Array<string | Files>,
  args: FeatureNameObject
) {
  let filename = '';
  let filePath = '';

  // [1] Get the kebab name key from arugments
  const kebabNameKey = Object.keys(args).filter(f => utils.hasKebab(f))[0];

  // [2] Get the pascal name key from arguments
  const pascalNameKey = Object.keys(args).filter(f => !utils.hasKebab(f))[0];

  // [3] For each file in the list
  for (const file of files) {
    if (typeof file === 'string') {
      continue;
    }

    // [3b] Add the target file to the path of the desired destination directory
    filePath = path.join(destDir, file.target);

    // Obtaining the file name from the file path
    filename = filePath.replace(/^.*[\\\/]/, '');
    // tslint:disable-next-line
    console.log(chalk.yellow(` >> processing ${filename}`));

    // [3c] Check if the contents of the file is defined
    if (file.content !== undefined && Array.isArray(file.content)) {
      // [3d] For each content block in the file contnet array
      for (const contentBlock of file.content) {
        if (contentBlock && contentBlock.matchRegex) {
          // [4] Get the content at the desired file path
          const fileContent = readFile(filePath);

          // [5] Update the contents of the file at given filePath
          await updateFile(
            filePath,
            fileContent,
            contentBlock.matchRegex,
            utils.hasKebab(contentBlock.replace) === true
              ? args[kebabNameKey]
              : contentBlock.replace.includes('${')
              ? args[pascalNameKey]
              : contentBlock.replace
          );
        }
      }
    } else if (file.content) {
      // tslint:disable-next-line:no-console
      console.log(
        `[INTERNAL : failed to match and replace  for :${args[kebabNameKey]} files]`
      );
    }
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
      let source = '';
      let dest = '';
      // Get source and destination paths
      if (typeof f !== 'string') {
        source = path.join(srcDir, f.source);
        dest = path.join(destDir, f.target);
      } else {
        source = path.join(
          srcDir,
          `${srcDir.includes(featureType.config) ? CORE : ''}`,
          f
        );
        dest = path.join(destDir, f);
      }

      // Create all the necessary directories if they dont exist
      const dirName = getDirName(dest);
      mkdirp.sync(dirName);

      return copyFilePromise(source, dest);
    })
  );
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
          );
        }
      }
    });
  }
}

/**
 * Description: Copy and update files from a source directory to a destination
 *              (install) directory
 * @param sourceDirectory - directory in which files are stored
 * @param installDirectory - destination directory or directory in which
 *                           has generated files
 * @param fileList - files to be copied and updated
 */
async function copyAndUpdateFiles(
  sourceDirectory: string,
  installDirectory: string,
  fileList: Files[] | Array<string | Files>,
  args: FeatureNameObject
): Promise<boolean> {
  const kebabNameKey = Object.keys(args).filter(f => utils.hasKebab(f))[0];

  // Spinner animation
  const status = new Spinner(
    'updating template files from boilerplate...',
    spinnerIcons
  );
  status.start();

  replaceTargetFileNames(fileList, args[kebabNameKey]);

  // Copy files from template and place in target destination
  await copyFiles(sourceDirectory, installDirectory, fileList)
    .then(() => {
      const kebabName =
        args[kebabNameKey] !== undefined ? args[kebabNameKey] : '';

      // tslint:disable-next-line:no-console
      console.log(`[Processing ${kebabName} files]`);
    })
    .catch(err => {
      // TODO: Implement more contextual errors
      // tslint:disable-next-line:no-console
      console.log(err);
    });

  // Apply changes to generated files
  await readAndUpdateFeatureFiles(installDirectory, fileList, args);
  // tslint:disable-next-line:no-console
  console.log(
    `[Processed ${
      args[kebabNameKey] !== undefined ? args[kebabNameKey] : ''
    } files]`
  );
  status.stop();

  const promise = Promise.resolve(true);

  return promise;
}

async function appendToFile(location: string, data: any) {
  await fs.appendFile(location, data, err => {
    if(err instanceof Error){
      console.log(err);
    }
  });
}

export {
  directoryExists,
  fileExists,
  clearTempFiles,
  getCurrentDirectoryBase,
  replaceTargetFileNames,
  copyAndUpdateFiles,
  readMainConfig,
  readSubConfig,
  writeFile,
  copyFiles,
  readFile,
  updateFile,
  appendToFile
};
