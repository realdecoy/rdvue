/**
 * After parsing commands and ensuring that they are valid
 * this module gets called and processes the input given and creates the necessary
 * configuration and files depending on the specific feature that the user requested.
 */
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import process from 'process';
import * as CONFIG from './config';
import * as ROOT_CONFIG from '../../config';
import { featureType, GENERATE_ACTION } from '../../constants/constants';
import * as files from '../../lib/files';
import { getFeatureConfiguration, getFeatureMenu } from '../../lib/helper-functions';
import * as util from '../../lib/util';
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
    sourceDirectory = path.join(ROOT_CONFIG.TEMPLATE_ROOT, userFeature, (currSourceDir !== './' ? currSourceDir : ''));
    if (isConfig) {
        installDirectory = `${featureName}${currInstallDir !== './' ? currInstallDir : ''}`;
    }
    else if (isStore || currInstallDir === featureType.services) {
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
    absProjectRoot = path.resolve(directories.installDir);
    configFile = path.join(absProjectRoot, '.rdvue');
    projectRootConfig = {
        projectRoot: absProjectRoot
    };
    strProjectRootConfig = JSON.stringify(projectRootConfig);
    // Writing the project root path to the .rdvue file
    files.writeFile(configFile, strProjectRootConfig);
    // Changes the current working directory to the specific feature folder
    process.chdir(`./${featureNameStore[kebabNameKey]}`);
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
            (util.actionBeingRequested(userAction) === GENERATE_ACTION);
        const isConfig = userFeature === featureType.config;
        const isStore = userFeature === featureType.store;
        const isProject = userFeature === featureType.project;
        const currentConfig = getFeatureConfiguration(userFeature);
        const questions = CONFIG.parsePrompts(getFeatureConfiguration(userFeature));
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
            const CLIPROPERTY = getFeatureMenu(operation.feature);
            // tslint:disable-next-line:no-console
            console.log(util.displayHelp(CLIPROPERTY.menu));
            return true;
        }
        // [1]b If the user used the generate actionwith a valid command and option
        // [2] Check if the user requested a new project
        if (isProject) {
            // [2]b Get required config
            await run({ options: userOptions, feature: featureType.config,
                action: userAction, featureName: userFeatureName }, USAGE);
            // Console.log(">>>project created");
            // [2]c Create required storage for project
            await run({ options: userOptions, feature: featureType.store,
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
            answers = await inquirer.prompt(questions);
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
            console.log(chalk.magenta(`The ${userFeature} "${answers[nameKey]}" has been generated.`));
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
export { run };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9uZXcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUVILE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUxQixPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUM5QixPQUFPLEtBQUssTUFBTSxNQUFNLFVBQVUsQ0FBQztBQUVuQyxPQUFPLEtBQUssV0FBVyxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pFLE9BQU8sS0FBSyxLQUFLLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3JGLE9BQU8sS0FBSyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFTdkM7Ozs7OztHQU1HO0FBQ0gsU0FBUyxjQUFjLENBQUUsYUFBcUIsRUFBRSxPQUFnQjtJQUM1RCxNQUFNLFdBQVcsR0FBc0IsRUFBRSxDQUFDO0lBQzFDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNqQixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDdEIsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBRXZCLElBQUksYUFBYSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7UUFDdkMsMERBQTBEO1FBQzFELDZDQUE2QztRQUM3QyxvREFBb0Q7UUFDcEQsT0FBTyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzFDLElBQUksT0FBTyxLQUFLLFNBQVMsRUFDekI7WUFDSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxD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