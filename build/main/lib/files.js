"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const bluebird_1 = __importDefault(require("bluebird"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const clui_1 = __importDefault(require("clui"));
const rimraf_1 = __importDefault(require("rimraf"));
const util_1 = __importDefault(require("util"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const config_1 = __importDefault(require("../config"));
const util_2 = __importDefault(require("./util"));
const Spinner = clui_1.default.Spinner;
const fs = bluebird_1.default.promisifyAll(fs_1.default);
const copyFilePromise = util_1.default.promisify(fs.copyFile);
const getDirName = path_1.default.dirname;
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
    return path_1.default.basename(process.cwd());
}
/**
 *  Read main config file to determine options the tool can take
 */
function readMainConfig() {
    const filePath = path_1.default.join(config_1.default.TEMPLATE_ROOT, '/template.json');
    return JSON.parse(readFile(filePath));
}
/**
 *  Read sub config for features to determine details about the individual
 * features and what they are capable of
 */
function readSubConfig(command) {
    const filePath = path_1.default.join(config_1.default.TEMPLATE_ROOT, `/${command}`, '/manifest.json');
    return JSON.parse(readFile(filePath));
}
async function clearTempFiles(folderPath) {
    await rimraf_1.default.sync(folderPath);
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
        console.log(chalk_1.default.yellow(` >> processing ${filePath}`));
        fs.writeFileSync(filePath, newValue, 'utf-8');
    }
}
/**
 * Read files that have been copied to target destination
 * and replace template values with input recieved form user
 * through prompts
 */
async function readAndUpdateFeatureFiles(destDir, files, args) {
    const kebabNameKey = (Object.keys(args).filter(f => util_2.default.hasKebab(f)))[0];
    const pascalNameKey = (Object.keys(args).filter(f => !util_2.default.hasKebab(f)))[0];
    for (const file of files) {
        let filePath = '';
        if (typeof file !== 'string') {
            filePath = path_1.default.join(destDir, file.target);
            if (file.content && Array.isArray(file.content)) {
                for (const contentBlock of file.content) {
                    if (contentBlock && contentBlock.matchRegex) {
                        const fileContent = readFile(filePath);
                        await updateFile(filePath, fileContent, contentBlock.matchRegex, (util_2.default.hasKebab(contentBlock.replace) === true ? args[kebabNameKey] : (contentBlock.replace.includes('${')) ? args[pascalNameKey] : contentBlock.replace));
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
            source = path_1.default.join(srcDir, f.source);
            dest = path_1.default.join(destDir, f.target);
        }
        else {
            source = path_1.default.join(srcDir, `${srcDir.includes('config') ? 'core' : ''}`, f);
            dest = path_1.default.join(destDir, f);
        }
        // create all the necessary directories if they dont exist
        const dirName = getDirName(dest);
        mkdirp_1.default.sync(dirName);
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
    const kebabNameKey = (Object.keys(args).filter(f => util_2.default.hasKebab(f)))[0];
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
exports.default = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2ZpbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0RBQTBCO0FBQzFCLHdEQUF1QztBQUN2Qyw0Q0FBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLGdEQUF1QjtBQUN2QixvREFBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLG9EQUE0QjtBQUM1Qix1REFBZ0M7QUFDaEMsa0RBQWdDO0FBR2hDLE1BQU0sT0FBTyxHQUFHLGNBQUcsQ0FBQyxPQUFPLENBQUM7QUFDNUIsTUFBTSxFQUFFLEdBQUcsa0JBQWUsQ0FBQyxZQUFZLENBQUMsWUFBVSxDQUFDLENBQUM7QUFDcEQsTUFBTSxlQUFlLEdBQUcsY0FBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEQsTUFBTSxVQUFVLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQztBQUVoQyxTQUFTLFFBQVEsQ0FBQyxRQUFnQjtJQUNoQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxRQUFnQjtJQUN2QyxJQUFJO1FBQ0YsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQzVDO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0gsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLFFBQWdCO0lBQ2xDLElBQUk7UUFDRixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDaEM7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7QUFDSCxDQUFDO0FBRUQsU0FBUyx1QkFBdUI7SUFDOUIsT0FBTyxjQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsY0FBYztJQUNyQixNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFPLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDcEUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLGFBQWEsQ0FBQyxPQUFlO0lBQ3BDLE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxPQUFPLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBRW5GLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQsS0FBSyxVQUFVLGNBQWMsQ0FBQyxVQUFrQjtJQUM5QyxNQUFNLGdCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZUFBZSxDQUFDLFFBQWdCLEVBQUUsV0FBbUIsRUFBRSxLQUFhO0lBQzNFLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN2QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1QyxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBRUQ7O0dBRUc7QUFFSCxTQUFTLFNBQVMsQ0FBQyxRQUFnQixFQUFFLElBQVk7SUFDL0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ25CLElBQUk7UUFDRixFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNsQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDakI7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRUQsS0FBSyxVQUFVLFVBQVUsQ0FBQyxRQUFnQixFQUFFLElBQVMsRUFBRSxXQUFtQixFQUFFLEtBQWE7SUFDdkYsTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLElBQUcsS0FBSyxFQUFDO1FBQ1AsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUFDLGtCQUFrQixRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQy9DO0FBQ0gsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxLQUFLLFVBQVUseUJBQXlCLENBQUMsT0FBZSxFQUFFLEtBQVksRUFBRSxJQUFTO0lBQy9FLE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxjQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRixNQUFNLGFBQWEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtRQUN4QixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUM7WUFDMUIsUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQy9DLEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFFdkMsSUFBRyxZQUFZLElBQUksWUFBWSxDQUFDLFVBQVUsRUFBQzt3QkFDekMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUN2QyxNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBRSxjQUFVLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3FCQUNuTztpQkFDRjthQUNGO2lCQUFLLElBQUcsSUFBSSxDQUFDLE9BQU8sRUFBQztnQkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpREFBaUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMzRjtTQUNGO0tBQ0Y7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxLQUFLLFVBQVUsU0FBUyxDQUFDLE1BQWMsRUFBRSxPQUFlLEVBQUUsS0FBUztJQUNqRSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ3RDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxtQ0FBbUM7UUFDbkMsSUFBRyxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUM7WUFDdkIsTUFBTSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyQyxJQUFJLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDTCxNQUFNLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVFLElBQUksR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM5QjtRQUVELDBEQUEwRDtRQUMxRCxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsT0FBTyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBQyxLQUFZLEVBQUUsV0FBbUI7SUFDL0QsSUFBRyxXQUFXLEVBQUM7UUFDYixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBUSxFQUFDLEVBQUU7WUFDeEIsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUM7Z0JBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQ3ZFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxlQUF1QixFQUFFLGdCQUF3QixFQUFFLFFBQWEsRUFBRSxJQUFTO0lBQzNHLE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxjQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRixNQUFNLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyw2Q0FBNkMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BILE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUVmLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUVyRCwyREFBMkQ7SUFDM0QsTUFBTSxTQUFTLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRTtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBRUgsbUNBQW1DO0lBQ25DLE1BQU0seUJBQXlCLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0YsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxrQkFBZTtJQUNiLGVBQWU7SUFDZixVQUFVO0lBQ1YsY0FBYztJQUNkLHVCQUF1QjtJQUN2QixzQkFBc0I7SUFDdEIsa0JBQWtCO0lBQ2xCLGNBQWM7SUFDZCxhQUFhO0lBQ2IsU0FBUztDQUNWLENBQUMifQ==