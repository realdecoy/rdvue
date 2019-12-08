import _ from 'lodash';
import chalk from 'chalk';
import bluebirdPromise from 'bluebird';
import fileSystem from 'fs';
import path from 'path';
import CLI from 'clui';
import rimraf from 'rimraf';
import util from 'util';
import mkdirp from 'mkdirp';
import configs from '../config';
import localUtils from './util';


const Spinner = CLI.Spinner;
const fs = bluebirdPromise.promisifyAll(fileSystem);
const copyFilePromise = util.promisify(fs.copyFile);
const getDirName = path.dirname;

function readFile(filePath: string) {
  return fs.readFileSync(filePath, 'utf-8');
}

function directoryExists(filePath: string) {
  try {
    return fs.statSync(filePath).isDirectory();
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
function readMainConfig(): any {
  const filePath = path.join(configs.TEMPLATE_ROOT, '/template.json');
  return JSON.parse(readFile(filePath));
}

/**
 *  Read sub config for features to determine details about the individual
 * features and what they are capable of
 */
function readSubConfig(command: string): any {
  const filePath = path.join(configs.TEMPLATE_ROOT, `/${command}`, '/manifest.json');
  return JSON.parse(readFile(filePath));
}

async function clearTempFiles(folderPath: string) {
  await rimraf.sync(folderPath);
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
async function updateFile(filePath: string, file: any, placeholder: string, value: string) {
  const r = new RegExp(placeholder, 'g');
  if(value){
    var newValue = file.replace(r, value);
    console.log(chalk.yellow(` >> processing ${filePath}`));
    fs.writeFileSync(filePath, newValue, 'utf-8');
  }
}

/**
 * Read files that have been copied to target destination
 * and replace template values with input recieved form user
 * through prompts
 */
async function readAndUpdateFeatureFiles(destDir: string, files: any[], args: any) {
  const kebabNameKey = (Object.keys(args).filter(f => localUtils.hasKebab(f)))[0];
  const pascalNameKey = (Object.keys(args).filter(f => !localUtils.hasKebab(f)))[0];

  for (const file of files) {
    let filePath = '';
    if(typeof file !== 'string'){
      filePath = path.join(destDir, file.target);
      if (file.content && Array.isArray(file.content)) {
        for (const contentBlock of file.content) {

          if(contentBlock && contentBlock.matchRegex){
            const fileContent = readFile(filePath);
            await updateFile(filePath, fileContent, contentBlock.matchRegex, ( localUtils.hasKebab(contentBlock.replace) === true ? args[kebabNameKey] : (contentBlock.replace.includes('${')) ? args[pascalNameKey] : contentBlock.replace));
          }
        }
      }else if(file.content){
        console.log(`[INTERNAL : failed to match and replace  for :${args[kebabNameKey]} files]`);
      }
    }
  }
}

/**
 * Copy files 
 */
async function copyFiles(srcDir: string, destDir: string, files: []) {
  return Promise.all(files.map((f: any) => {
    let source = '';
    let dest = '';
    // get source and destination paths
    if(typeof f !== 'string'){
      source = path.join(srcDir, f.source);
      dest = path.join(destDir, f.target);
    } else {
      source = path.join(srcDir, `${srcDir.includes('config') ? 'core' : ''}`, f);
      dest = path.join(destDir, f);
    }
    
    // create all the necessary directories if they dont exist
    const dirName = getDirName(dest);
    mkdirp.sync(dirName);
    return copyFilePromise(source, dest);
  }));
}

function replaceTargetFileNames(files: any[], featureName: string){
  if(featureName){
    files.forEach((file:any)=>{
      if(file.target != file.source){
        file.target = replaceFileName(file.target, /(\${.*?\})/, featureName);
      }
    });
  }
}

/**
 * Copy and update files
 */
async function copyAndUpdateFiles(sourceDirectory: string, installDirectory: string, fileList: any, args: any): Promise<any> {
  const kebabNameKey = (Object.keys(args).filter(f => localUtils.hasKebab(f)))[0];
  const status = new Spinner('updating template files from boilerplate...', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
  status.start();

  replaceTargetFileNames(fileList, args[kebabNameKey]);

  // copy files from template and place in target destination
  await copyFiles(sourceDirectory, installDirectory, fileList).then(() => {
      console.log(`[Processing ${args[kebabNameKey] !== undefined ? args[kebabNameKey] : ''} files]`);
  }).catch((err: any) => {
      console.log(err);
  });

  // apply changes to generated files
  await readAndUpdateFeatureFiles(installDirectory, fileList, args);
  console.log(`[Processed ${args[kebabNameKey] !== undefined ? args[kebabNameKey] : ''} files]`);
  status.stop();
}

export default {
  directoryExists,
  fileExists,
  clearTempFiles,
  getCurrentDirectoryBase,
  replaceTargetFileNames,
  copyAndUpdateFiles,
  readMainConfig,
  readSubConfig,
}
