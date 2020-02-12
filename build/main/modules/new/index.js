"use strict";
/**
 * After parsing commands and ensuring that they are valid
 * this module gets called and processes the input given and creates the necessary
 * configuration and files depending on the specific feature that the user requested.
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
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const CONFIG = __importStar(require("./config"));
const ROOT_CONFIG = __importStar(require("../../config"));
const constants_1 = require("../../constants/constants");
const files = __importStar(require("../../lib/files"));
const helper_functions_1 = require("../../lib/helper-functions");
const util = __importStar(require("../../lib/util"));
/**
 * Description: Transforms user input into Kebab and or Pascal case updating
 * nameKey prop on object 'featureNameStore'
 * @param currentConfig - current configuration for the project in use.
 * @param answers - user arguments that is returned in response to inquirer questions.
 * see: https://www.npmjs.com/package/inquirer
 */
function updateNameProp(currentConfig, answers) {
    const featureName = {};
    let nameKey = '';
    let kebabCaseKey = '';
    let pascalCaseKey = '';
    if (currentConfig.arguments !== undefined) {
        // NameKey is the variable which holds the name of the key
        // for the argument to be retrieved from user
        // Example of nameKey: "pageName" or "pageNameKebab"
        nameKey = currentConfig.arguments[0].name;
        if (nameKey !== undefined) {
            if (util.hasKebab(nameKey) === true) {
                kebabCaseKey = nameKey;
                pascalCaseKey = `${nameKey.split('Kebab')[0]}`;
            }
            else {
                kebabCaseKey = `${nameKey}Kebab`;
                pascalCaseKey = nameKey;
            }
            featureName[kebabCaseKey] = util.getKebabCase(answers[nameKey]);
            featureName[pascalCaseKey] = util.getPascalCase(answers[nameKey]);
        }
    }
    return featureName;
}
/**
 * Description: Finding the path of the source and install directories for the
 * feature being processed
 * @param directoryInput - necessessary input required to obtain install and source directory
 * for given project
 */
function getDirectories(directoryInput) {
    const kebabNameKey = directoryInput.kebabNameKey;
    const isConfig = directoryInput.isConfig;
    const isStore = directoryInput.isStore;
    const projectRoot = directoryInput.projectRoot;
    const userFeature = directoryInput.userFeature;
    const currSourceDir = directoryInput.currentConfig.sourceDirectory;
    const currInstallDir = directoryInput.currentConfig.installDirectory;
    const featureName = directoryInput.featureNameStore[kebabNameKey];
    let sourceDirectory = '';
    let installDirectory = '';
    sourceDirectory = path_1.default.join(ROOT_CONFIG.TEMPLATE_ROOT, userFeature, (currSourceDir !== './' ? currSourceDir : ''));
    if (isConfig) {
        installDirectory = `${featureName}${currInstallDir !== './' ? currInstallDir : ''}`;
    }
    else if (isStore || currInstallDir === constants_1.featureType.services) {
        installDirectory = `src/${currInstallDir !== './' ? currInstallDir : ''}`;
    }
    else {
        installDirectory = `src/${currInstallDir !== './' ? currInstallDir : ''}/${featureName}`;
    }
    if (projectRoot !== null && !isConfig) {
        installDirectory = `${projectRoot}/${installDirectory}`;
    }
    return {
        installDir: installDirectory,
        sourceDir: sourceDirectory,
    };
}
/**
 * Description: Updating the configuration to hace correct directory place for .rdvue file
 * @param featureNameStore - object holding both Kebab and Pascal cases of the feature name
 * @param directories - install and source directory
 * @param kebabNameKey - the kebab case of the feature name
 */
function updateConfig(featureNameStore, directories, kebabNameKey = '') {
    let absProjectRoot = '';
    let configFile = '';
    let projectRootConfig;
    let strProjectRootConfig = '';
    absProjectRoot = path_1.default.resolve(directories.installDir);
    configFile = path_1.default.join(absProjectRoot, '.rdvue');
    projectRootConfig = {
        projectRoot: absProjectRoot
    };
    strProjectRootConfig = JSON.stringify(projectRootConfig);
    // Writing the project root path to the .rdvue file
    files.writeFile(configFile, strProjectRootConfig);
    // Changes the current working directory to the specific feature folder
    process_1.default.chdir(`./${featureNameStore[kebabNameKey]}`);
}
// tslint:disable-next-line
async function run(operation, USAGE) {
    try {
        const userAction = operation.action;
        const userFeature = operation.feature;
        const userOptions = operation.options;
        const userFeatureName = operation.featureName;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, CONFIG.OPTIONS_ALL);
        const isValidCreateRequest = !hasHelpOption &&
            !hasInvalidOption &&
            (util.actionBeingRequested(userAction) === constants_1.GENERATE_ACTION);
        const isConfig = userFeature === constants_1.featureType.config;
        const isStore = userFeature === constants_1.featureType.store;
        const isProject = userFeature === constants_1.featureType.project;
        const currentConfig = helper_functions_1.getFeatureConfiguration(userFeature);
        const questions = CONFIG.parsePrompts(helper_functions_1.getFeatureConfiguration(userFeature));
        const projectName = '<project-name>';
        let featureNameStore = {};
        let nameKey = '';
        let answers = {};
        let kebabNameKey = '';
        let projectRoot;
        let directories;
        // [1] Check if the user did not use the generate action or had an overall invalid command
        if (!isValidCreateRequest) {
            // Show Help Menu
            const CLIPROPERTY = helper_functions_1.getFeatureMenu(operation.feature);
            // tslint:disable-next-line:no-console
            console.log(util.displayHelp(CLIPROPERTY.menu));
            return true;
        }
        // [1]b If the user used the generate actionwith a valid command and option
        // [2] Check if the user requested a new project
        if (isProject) {
            // [2]b Get required config
            await run({ options: userOptions, feature: constants_1.featureType.config,
                action: userAction, featureName: userFeatureName }, USAGE);
            // Console.log(">>>project created");
            // [2]c Create required storage for project
            await run({ options: userOptions, feature: constants_1.featureType.store,
                action: userAction, featureName: userFeatureName }, USAGE);
            util.nextSteps(projectName);
            return true;
        }
        // [3] Getting the name key used. ex: "projectName" or "componentName"
        if (currentConfig.arguments !== undefined) {
            nameKey = currentConfig.arguments[0].name;
        }
        // [4] Retrieve user response to *questions* asked.
        // *question* eg: "Please enter the name for the generated project"
        if (userFeatureName !== '') {
            answers[nameKey] = userFeatureName;
        }
        else {
            answers = await inquirer_1.default.prompt(questions);
        }
        // [5] Create a section break
        util.sectionBreak();
        // [6] Obtaining the path of the project root
        projectRoot = util.getProjectRoot();
        // [7] Obtaining the Kebab and Pascal case of the feature (eg. page) name input by user and
        // placing it in object "featureNameStore"
        featureNameStore = updateNameProp(currentConfig, answers);
        // [7]b Retrieving the Kebab case from the featureNameStore object
        kebabNameKey = (Object.keys(featureNameStore)
            .filter(f => util.hasKebab(f)))[0];
        // [8] Determine the directories in which the project files are to be stored
        directories = getDirectories({ featureNameStore,
            currentConfig,
            kebabNameKey,
            isConfig,
            isStore,
            projectRoot,
            userFeature,
        });
        // [9] Copy and update files from a source directory to a destination directory
        if (currentConfig.files !== undefined) {
            await files.copyAndUpdateFiles(directories.sourceDir, directories.installDir, currentConfig.files, featureNameStore);
        }
        // [10] If executing the 'config' feature
        if (isConfig) {
            // [10]b Updating the '.rdvue' config file to include the project root path
            if (kebabNameKey !== undefined) {
                updateConfig(featureNameStore, directories, kebabNameKey);
            }
        }
        else {
            // [10]c Create a section break
            util.sectionBreak();
            // tslint:disable-next-line:no-console
            console.log(chalk_1.default.magenta(`The ${userFeature} "${answers[nameKey]}" has been generated.`));
        }
        return true;
    }
    catch (err) {
        // TODO: Implement more contextual errors
        if (err) {
            throw new Error(err);
        }
    }
}
exports.run = run;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9uZXcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7OztBQUVILGtEQUEwQjtBQUUxQix3REFBZ0M7QUFDaEMsZ0RBQXdCO0FBQ3hCLHNEQUE4QjtBQUM5QixpREFBbUM7QUFFbkMsMERBQTRDO0FBQzVDLHlEQUF5RTtBQUN6RSx1REFBeUM7QUFDekMsaUVBQXFGO0FBQ3JGLHFEQUF1QztBQVN2Qzs7Ozs7O0dBTUc7QUFDSCxTQUFTLGNBQWMsQ0FBRSxhQUFxQixFQUFFLE9BQWdCO0lBQzVELE1BQU0sV0FBVyxHQUFzQixFQUFFLENBQUM7SUFDMUMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN0QixJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFFdkIsSUFBSSxhQUFhLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtRQUN2QywwREFBMEQ7UUFDMUQsNkNBQTZDO1FBQzdDLG9EQUFvRDtRQUNwRCxPQUFPLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDMUMsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUN6QjtZQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2pDLFlBQVksR0FBRyxPQUFPLENBQUM7Z0JBQ3ZCLGFBQWEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUVsRDtpQkFBTTtnQkFDSCxZQUFZLEdBQUcsR0FBRyxPQUFPLE9BQU8sQ0FBQztnQkFDakMsYUFBYSxHQUFHLE9BQU8sQ0FBQzthQUMzQjtZQUNELFdBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJ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