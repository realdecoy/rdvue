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
function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}
function directoryExists(filePath) {
    try {
        return fs.statSync(filePath).isDirectory();
    }
    catch (err) {
        return false;
    }
}
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    }
    catch (err) {
        return false;
    }
}
function getCurrentDirectoryBase() {
    return path.basename(process.cwd());
}
/**
 *  Read main config file to determine options the tool can take
 */
function readMainConfig() {
    const filePath = path.join(configs.TEMPLATE_ROOT, '/template.json');
    return JSON.parse(readFile(filePath));
}
/**
 *  Read sub config for features to determine details about the individual
 * features and what they are capable of
 */
function readSubConfig(command) {
    const filePath = path.join(configs.TEMPLATE_ROOT, `/${command}`, '/manifest.json');
    return JSON.parse(readFile(filePath));
}
async function clearTempFiles(folderPath) {
    await rimraf.sync(folderPath);
}
/**
 * Replace filename
 */
function replaceFileName(fileName, placeholder, value) {
    const r = new RegExp(placeholder, 'g');
    const response = fileName.replace(r, value);
    return response;
}
/**
 * Write files
 */
function writeFile(filePath, data) {
    let success = true;
    try {
        fs.writeFileSync(filePath, data);
    }
    catch (error) {
        console.warn('Failed to write to file');
        success = false;
    }
    return success;
}
async function updateFile(filePath, file, placeholder, value) {
    const r = new RegExp(placeholder, 'g');
    if (value) {
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
async function readAndUpdateFeatureFiles(destDir, files, args) {
    const kebabNameKey = (Object.keys(args).filter(f => localUtils.hasKebab(f)))[0];
    const pascalNameKey = (Object.keys(args).filter(f => !localUtils.hasKebab(f)))[0];
    for (const file of files) {
        let filePath = '';
        if (typeof file !== 'string') {
            filePath = path.join(destDir, file.target);
            if (file.content && Array.isArray(file.content)) {
                for (const contentBlock of file.content) {
                    if (contentBlock && contentBlock.matchRegex) {
                        const fileContent = readFile(filePath);
                        await updateFile(filePath, fileContent, contentBlock.matchRegex, (localUtils.hasKebab(contentBlock.replace) === true ? args[kebabNameKey] : (contentBlock.replace.includes('${')) ? args[pascalNameKey] : contentBlock.replace));
                    }
                }
            }
            else if (file.content) {
                console.log(`[INTERNAL : failed to match and replace  for :${args[kebabNameKey]} files]`);
            }
        }
    }
}
/**
 * Copy files
 */
async function copyFiles(srcDir, destDir, files) {
    return Promise.all(files.map((f) => {
        let source = '';
        let dest = '';
        // get source and destination paths
        if (typeof f !== 'string') {
            source = path.join(srcDir, f.source);
            dest = path.join(destDir, f.target);
        }
        else {
            source = path.join(srcDir, `${srcDir.includes('config') ? 'core' : ''}`, f);
            dest = path.join(destDir, f);
        }
        // create all the necessary directories if they dont exist
        const dirName = getDirName(dest);
        mkdirp.sync(dirName);
        return copyFilePromise(source, dest);
    }));
}
function replaceTargetFileNames(files, featureName) {
    if (featureName) {
        files.forEach((file) => {
            if (file.target != file.source) {
                file.target = replaceFileName(file.target, /(\${.*?\})/, featureName);
            }
        });
    }
}
/**
 * Copy and update files
 */
async function copyAndUpdateFiles(sourceDirectory, installDirectory, fileList, args) {
    const kebabNameKey = (Object.keys(args).filter(f => localUtils.hasKebab(f)))[0];
    const status = new Spinner('updating template files from boilerplate...', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
    status.start();
    replaceTargetFileNames(fileList, args[kebabNameKey]);
    // copy files from template and place in target destination
    await copyFiles(sourceDirectory, installDirectory, fileList).then(() => {
        console.log(`[Processing ${args[kebabNameKey] !== undefined ? args[kebabNameKey] : ''} files]`);
    }).catch((err) => {
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
    writeFile,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2ZpbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLGVBQWUsTUFBTSxVQUFVLENBQUM7QUFDdkMsT0FBTyxVQUFVLE1BQU0sSUFBSSxDQUFDO0FBQzVCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUM7QUFDdkIsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFDO0FBQ2hDLE9BQU8sVUFBVSxNQUFNLFFBQVEsQ0FBQztBQUdoQyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQzVCLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUVoQyxTQUFTLFFBQVEsQ0FBQyxRQUFnQjtJQUNoQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxRQUFnQjtJQUN2QyxJQUFJO1FBQ0YsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQzVDO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0gsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLFFBQWdC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