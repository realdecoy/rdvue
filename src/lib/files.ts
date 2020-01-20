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
import { Files } from '../types/index';
import { Config } from '../types/usage';

const Spinner = CLI.Spinner;
const fs = bluebirdPromise.promisifyAll(fileSystem);
const copyFilePromise = util.promisify(fs.copyFile);
const getDirName = path.dirname;

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function directoryExists(filePath: string) {
  try {
    return fs.statSync(filePath)
              .isDirectory();
  } catch (err) {
    return false;
  }
}

function fileExists(filePath: string) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

function getCurrentDirectoryBase(): string {
  return path.basename(process.cwd());
}

/**
 *  Read main config file to determine options the tool can take
 */
function readMainConfig(): Config {
  const filePath = path.join(TEMPLATE_ROOT, '/template.json');

  return JSON.parse(readFile(filePath)) as Config;
}

/**
 *  Read sub config for features to determine details about the individual
 * features and what they are capable of
 */
function readSubConfig(command: string): Config {
  const filePath = path.join(TEMPLATE_ROOT, `/${command}`, '/manifest.json');

  return JSON.parse(readFile(filePath)) as Config;
}

async function clearTempFiles(folderPath: string) {
   rimraf.sync(folderPath);
}

/**
 * Replace filename
 */
function replaceFileName(fileName: string, placeholder: RegExp, value: string): string {
  const r = new RegExp(placeholder, 'g');
  const response = fileName.replace(r, value);

  return response;
}

/**
 * Write files
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

async function updateFile(filePath: string, file: string, placeholder: string, value: string) {
  const r = new RegExp(placeholder, 'g');
  if(value !== ''){
    const newValue = file.replace(r, value);
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow(` >> processing ${filePath}`));
    fs.writeFileSync(filePath, newValue, 'utf-8');
  }
}

/**
 * Read files that have been copied to target destination
 * and replace template values with input recieved form user
 * through prompts
 */
async function readAndUpdateFeatureFiles(destDir: string, files: any, args: any) {
  const kebabNameKey = (Object.keys(args)
  .filter(f => utils.hasKebab(f)))[0];

  const pascalNameKey = (Object.keys(args)
  .filter(f => !utils.hasKebab(f)))[0];

  for (const file of files) {
    let filePath = '';
    if(typeof file !== 'string'){
      filePath = path.join(destDir, file.target);
      if (file.content && Array.isArray(file.content)) {
        for (const contentBlock of file.content) {

          if(contentBlock && contentBlock.matchRegex){
            const fileContent = readFile(filePath);
            await updateFile(filePath, fileContent, contentBlock.matchRegex,
              ( utils.hasKebab(contentBlock.replace) === true ?
              args[kebabNameKey] : (contentBlock.replace.includes('${')) ?
              args[pascalNameKey] : contentBlock.replace));
          }
        }
      }else if(file.content){
        // tslint:disable-next-line:no-console
        console.log(`[INTERNAL : failed to match and replace  for :${args[kebabNameKey]} files]`);
      }
    }
  }
}

/**
 * Copy files
 */
async function copyFiles(srcDir: string, destDir: string, files: []) {
  return Promise.all(files.map(
    async (f: any) => {
    let source = '';
    let dest = '';
    // Get source and destination paths
    if(typeof f !== 'string'){
      source = path.join(srcDir, f.source);
      dest = path.join(destDir, f.target);
    } else {
      source = path.join(srcDir, `${srcDir.includes('config') ? 'core' : ''}`, f);
      dest = path.join(destDir, f);
    }

    // Create all the necessary directories if they dont exist
    const dirName = getDirName(dest);
    mkdirp.sync(dirName);

    return copyFilePromise(source, dest);
  }));
}

function replaceTargetFileNames(files: Files[], featureName: string){
  if(featureName !== ''){
    files.forEach((file:Files)=>{
      if(file.target !== file.source){
        file.target = replaceFileName(file.target, /(\${.*?\})/, featureName);
      }
    });
  }
}

/**
 * Copy and update files
 */
async function copyAndUpdateFiles(
  sourceDirectory: string, installDirectory: string, fileList: any, args: any
  ): Promise<any> {
  const kebabNameKey = (Object.keys(args)
  .filter(f => utils.hasKebab(f)))[0];
  // Spinner animation
  const status = new Spinner('updating template files from boilerplate...',
  ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
  status.start();

  replaceTargetFileNames(fileList, args[kebabNameKey]);

  // Copy files from template and place in target destination
  await copyFiles(sourceDirectory, installDirectory, fileList)
  .then(() => {
    const kebabName = args[kebabNameKey] !== undefined ? args[kebabNameKey] : '';

    // tslint:disable-next-line:no-console
    console.log(`[Processing ${kebabName} files]`);
  })
  .catch((err: any) => {
    // tslint:disable-next-line:no-console
    console.log(err);
  });

  // Apply changes to generated files
  await readAndUpdateFeatureFiles(installDirectory, fileList, args);
  // tslint:disable-next-line:no-console
  console.log(`[Processed ${args[kebabNameKey] !== undefined ? args[kebabNameKey] : ''} files]`);
  status.stop();
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
};

