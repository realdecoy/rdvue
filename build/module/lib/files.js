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
import { TEMPLATE_ROOT } from '../config';
import { CORE, featureType, MANIFEST_FILE, spinnerIcons, TEMPLATE_FILE, UTF8 } from '../constants/reusable-constants';
const Spinner = CLI.Spinner;
const fs = bluebirdPromise.promisifyAll(fileSystem);
const copyFilePromise = util.promisify(fs.copyFile);
const getDirName = path.dirname;
/**
 * Description: Read file located at specified filePath
 * @param filePath - a path to a file
 */
function readFile(filePath) {
    return fs.readFileSync(filePath, UTF8);
}
/**
 * Description: Determine whether or not the given file path is a
 *              directory which exists
 * @param filePath - a path to a file
 */
function directoryExists(filePath) {
    try {
        return fs.statSync(filePath)
            .isDirectory();
    }
    catch (err) {
        // TODO: log error here
        return false;
    }
}
/**
 * Description: Determine whether or not the given file exists
 * @param filePath - a path to a file
 */
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        // TODO: log error here
        return false;
    }
}
/**
 * Description: Get the base of the directory you are currently in.
 * Returns the last portion of the current path
 */
function getCurrentDirectoryBase() {
    return path.basename(process.cwd());
}
/**
 *  Description: Read main config file to determine options the tool can take
 */
function readMainConfig() {
    const filePath = path.join(TEMPLATE_ROOT, TEMPLATE_FILE);
    return JSON.parse(readFile(filePath));
}
/**
 * Description: Read sub config for features to determine details about
 *              the individual features and what they are capable of
 * @param command - the command used to retrieve associated configuration
 */
function readSubConfig(command) {
    const filePath = path.join(TEMPLATE_ROOT, `/${command}`, MANIFEST_FILE);
    return JSON.parse(readFile(filePath));
}
/**
 * Description: Clear temporary files at a given path
 * @param folderPath - the folder path for which you would like to clear temporary files
 */
async function clearTempFiles(folderPath) {
    rimraf.sync(folderPath);
}
/**
 * Description: Replace filename with a given value
 * @param fileName - filename to be replaced
 * @param placeholder - pattern used with specified flag in order
 *                      to created new RegExp (old file name)
 * @param value - value to replace old filename
 */
function replaceFileName(fileName, placeholder, value) {
    const r = new RegExp(placeholder, 'g');
    const response = fileName.replace(r, value);
    return response;
}
/**
 * Description: Writes given data to a file
 * @param filePath - path of file which will be created or modified to include given data
 * @param data - data written to file
 */
function writeFile(filePath, data) {
    let success = true;
    try {
        fs.writeFileSync(filePath, data);
    }
    catch (error) {
        // tslint:disable-next-line:no-console
        console.log('Failed to write to file');
        success = false;
    }
    return success;
}
async function updateFile(filePath, file, placeholder, value) {
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
async function readAndUpdateFeatureFiles(destDir, files, args) {
    let filename = '';
    let filePath = '';
    // [1] Get the kebab name key from arugments
    const kebabNameKey = (Object.keys(args)
        .filter(f => utils.hasKebab(f)))[0];
    // [2] Get the pascal name key from arguments
    const pascalNameKey = (Object.keys(args)
        .filter(f => !utils.hasKebab(f)))[0];
    // [3] For each file in the list
    for (const file of files) {
        if (typeof file === 'string') {
            continue;
        }
        // [3b] Add the target file to the path of the desired destination directory
        filePath = path.join(destDir, file.target);
        // Obtaining the file name from the file path
        filename = filePath.replace(/^.*[\\\/]/, '');
        console.log(chalk.yellow(` >> processing ${filename}`));
        // [3c] Check if the contents of the file is defined
        if (file.content !== undefined && Array.isArray(file.content)) {
            // [3d] For each content block in the file contnet array
            for (const contentBlock of file.content) {
                if (contentBlock && contentBlock.matchRegex) {
                    // [4] Get the content at the desired file path
                    const fileContent = readFile(filePath);
                    // [5] Update the contents of the file at given filePath
                    await updateFile(filePath, fileContent, contentBlock.matchRegex, (utils.hasKebab(contentBlock.replace) === true ?
                        args[kebabNameKey] : (contentBlock.replace.includes('${')) ?
                        args[pascalNameKey] : contentBlock.replace));
                }
            }
        }
        else if (file.content) {
            // tslint:disable-next-line:no-console
            console.log(`[INTERNAL : failed to match and replace  for :${args[kebabNameKey]} files]`);
        }
    }
}
/**
 * Description: Copy files from a source directory to a destination directory
 * @param srcDir - directory from which files will be copied
 * @param destDir - directory to which files will be copied
 * @param files - files to be copied
 */
async function copyFiles(srcDir, destDir, files) {
    return Promise.all(files.map(async (f) => {
        let source = '';
        let dest = '';
        // Get source and destination paths
        if (typeof f !== 'string') {
            source = path.join(srcDir, f.source);
            dest = path.join(destDir, f.target);
        }
        else {
            source = path.join(srcDir, `${srcDir.includes(featureType.config) ? CORE : ''}`, f);
            dest = path.join(destDir, f);
        }
        // Create all the necessary directories if they dont exist
        const dirName = getDirName(dest);
        mkdirp.sync(dirName);
        return copyFilePromise(source, dest);
    }));
}
/**
 * Description: Update target filenames to include feature name
 * @param files - filenames which need to be updated
 * @param featureName - the string used to update the name of the files
 */
function replaceTargetFileNames(files, featureName) {
    if (featureName !== '') {
        files.forEach((file) => {
            if (typeof file !== 'string') {
                if (file.target !== file.source) {
                    file.target = replaceFileName(file.target, /(\${.*?\})/, featureName);
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
async function copyAndUpdateFiles(sourceDirectory, installDirectory, fileList, args) {
    const kebabNameKey = (Object.keys(args)
        .filter(f => utils.hasKebab(f)))[0];
    // Spinner animation
    const status = new Spinner('updating template files from boilerplate...', spinnerIcons);
    status.start();
    replaceTargetFileNames(fileList, args[kebabNameKey]);
    // Copy files from template and place in target destination
    await copyFiles(sourceDirectory, installDirectory, fileList)
        .then(() => {
        const kebabName = args[kebabNameKey] !== undefined ? args[kebabNameKey] : '';
        // tslint:disable-next-line:no-console
        console.log(`[Processing ${kebabName} files]`);
    })
        .catch((err) => {
        // tslint:disable-next-line:no-console
        // TODO: Implement more contextual errors
        console.log(err);
    });
    // Apply changes to generated files
    await readAndUpdateFeatureFiles(installDirectory, fileList, args);
    // tslint:disable-next-line:no-console
    console.log(`[Processed ${args[kebabNameKey] !== undefined ? args[kebabNameKey] : ''} files]`);
    status.stop();
}
export { directoryExists, fileExists, clearTempFiles, getCurrentDirectoryBase, replaceTargetFileNames, copyAndUpdateFiles, readMainConfig, readSubConfig, writeFile, };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2ZpbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsT0FBTyxlQUFlLE1BQU0sVUFBVSxDQUFDO0FBQ3ZDLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUM7QUFDdkIsT0FBTyxVQUFVLE1BQU0sSUFBSSxDQUFDO0FBQzVCLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLEtBQUssS0FBSyxNQUFNLFFBQVEsQ0FBQztBQUloQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzFDLE9BQU8sRUFBRyxJQUFJLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBS3RILE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDNUIsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBRWhDOzs7R0FHRztBQUNILFNBQVMsUUFBUSxDQUFDLFFBQWdCO0lBQ2hDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxRQUFnQjtJQUN2QyxJQUFJO1FB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