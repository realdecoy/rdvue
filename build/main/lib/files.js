"use strict";
/**
 * Includes helper functions that associated with files (example: copy files, update files)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const chalk_1 = __importDefault(require("chalk"));
const clui_1 = __importDefault(require("clui"));
const fs_1 = __importDefault(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const util_1 = __importDefault(require("util"));
const utils = __importStar(require("./util"));
const config_1 = require("../config");
const constants_1 = require("../constants/constants");
const Spinner = clui_1.default.Spinner;
const fs = bluebird_1.default.promisifyAll(fs_1.default);
const copyFilePromise = util_1.default.promisify(fs.copyFile);
const getDirName = path_1.default.dirname;
/**
 * Description: Read file located at specified filePath
 * @param filePath - a path to a file
 */
function readFile(filePath) {
    return fs.readFileSync(filePath, constants_1.UTF8);
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
exports.directoryExists = directoryExists;
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
exports.fileExists = fileExists;
/**
 * Description: Get the base of the directory you are currently in.
 * Returns the last portion of the current path
 */
function getCurrentDirectoryBase() {
    return path_1.default.basename(process.cwd());
}
exports.getCurrentDirectoryBase = getCurrentDirectoryBase;
/**
 *  Description: Read main config file to determine options the tool can take
 */
function readMainConfig() {
    const filePath = path_1.default.join(config_1.TEMPLATE_ROOT, constants_1.TEMPLATE_FILE);
    return JSON.parse(readFile(filePath));
}
exports.readMainConfig = readMainConfig;
/**
 * Description: Read sub config for features to determine details about
 *              the individual features and what they are capable of
 * @param command - the command used to retrieve associated configuration
 */
function readSubConfig(command) {
    const filePath = path_1.default.join(config_1.TEMPLATE_ROOT, `/${command}`, constants_1.MANIFEST_FILE);
    return JSON.parse(readFile(filePath));
}
exports.readSubConfig = readSubConfig;
/**
 * Description: Clear temporary files at a given path
 * @param folderPath - the folder path for which you would like to clear temporary files
 */
async function clearTempFiles(folderPath) {
    rimraf_1.default.sync(folderPath);
}
exports.clearTempFiles = clearTempFiles;
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
exports.writeFile = writeFile;
async function updateFile(filePath, file, placeholder, value) {
    const r = new RegExp(placeholder, 'g');
    if (value !== '') {
        const newValue = file.replace(r, value);
        // tslint:disable-next-line:no-console
        fs.writeFileSync(filePath, newValue, constants_1.UTF8);
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
        filePath = path_1.default.join(destDir, file.target);
        // Obtaining the file name from the file path
        filename = filePath.replace(/^.*[\\\/]/, '');
        // tslint:disable-next-line
        console.log(chalk_1.default.yellow(` >> processing ${filename}`));
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
            source = path_1.default.join(srcDir, f.source);
            dest = path_1.default.join(destDir, f.target);
        }
        else {
            source = path_1.default.join(srcDir, `${srcDir.includes(constants_1.featureType.config) ? constants_1.CORE : ''}`, f);
            dest = path_1.default.join(destDir, f);
        }
        // Create all the necessary directories if they dont exist
        const dirName = getDirName(dest);
        mkdirp_1.default.sync(dirName);
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
exports.replaceTargetFileNames = replaceTargetFileNames;
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
    const status = new Spinner('updating template files from boilerplate...', constants_1.spinnerIcons);
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
        // TODO: Implement more contextual errors
        // tslint:disable-next-line:no-console
        console.log(err);
    });
    // Apply changes to generated files
    await readAndUpdateFeatureFiles(installDirectory, fileList, args);
    // tslint:disable-next-line:no-console
    console.log(`[Processed ${args[kebabNameKey] !== undefined ? args[kebabNameKey] : ''} files]`);
    status.stop();
    const promise = Promise.resolve(true);
    return promise;
}
exports.copyAndUpdateFiles = copyAndUpdateFiles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2ZpbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7Ozs7Ozs7Ozs7O0FBRUgsd0RBQXVDO0FBQ3ZDLGtEQUEwQjtBQUMxQixnREFBdUI7QUFDdkIsNENBQTRCO0FBQzVCLG9EQUE0QjtBQUM1QixnREFBd0I7QUFDeEIsb0RBQTRCO0FBQzVCLGdEQUF3QjtBQUN4Qiw4Q0FBZ0M7QUFJaEMsc0NBQTBDO0FBQzFDLHNEQUE2RztBQUs3RyxNQUFNLE9BQU8sR0FBRyxjQUFHLENBQUMsT0FBTyxDQUFDO0FBQzVCLE1BQU0sRUFBRSxHQUFHLGtCQUFlLENBQUMsWUFBWSxDQUFDLFlBQVUsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sZUFBZSxHQUFHLGNBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUM7QUFFaEM7OztHQUdHO0FBQ0gsU0FBUyxRQUFRLENBQUMsUUFBZ0I7SUFDaEMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxnQkFBSSxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxRQUFnQjtJQUN2QyxJQUFJO1FBQ0YsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQzthQUNqQixXQUFXLEVBQUUsQ0FBQztLQUMxQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osdUJBQXVCO1FBQ3ZCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7QUFDSCxDQUFDO0FBNFBDLDBDQUFlO0FBMVBqQjs7O0dBR0c7QUFDSCxTQUFTLFVBQVUsQ0FBQyxRQUFnQjtJQUNsQyxJQUFJO1FBQ0YsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2hDO0lBQUMsT0FBTyxHQUFH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