/**
 * After parsing commands and options and ensuring that they are valid
 * this module gets called and processes the input given and creates the necessary
 * configuration and files depending on the specific feature that the user requested.
 */

import chalk from 'chalk';
import { Section } from 'command-line-usage';
import inquirer from 'inquirer';
import path from 'path';
import process from 'process';
import * as CONFIG from './config';

import * as ROOT_CONFIG from '../../config';
import { featureType, GENERATE_ACTION } from '../../constants/reusable-constants';
import * as files from '../../lib/files';
import { commandAssignmentModule, menuAssignment } from '../../lib/helper-functions';
import * as util from '../../lib/util';
import { CLI, Config } from '../../types/cli';
import { Command, Directories, FeatureNameObject, GetDirectoryInput } from '../../types/index';

interface Answers{
    [key: string]: any;
}

/**
 * Description: Transforms user input into Kebab and or Pascal case updating
 * nameKey prop on object 'featureNameStore'
 * @param currentConfig - current configuration for the project in use.
 * @param answers - user arguments that is returned in response to inquirer questions.
 * see: https://www.npmjs.com/package/inquirer
 */
function updateNameProp (currentConfig: Config, answers: Answers) {
    const featureName: FeatureNameObject = {};
    let nameKey = '';
    let kebabCaseKey = '';
    let pascalCaseKey = '';

    if (currentConfig.arguments !== undefined) {
        // NameKey is the variable which holds the name of the key
        // for the argument to be retrieved from user
        // Example of nameKey: "pageName" or "pageNameKebab"
        nameKey = currentConfig.arguments[0].name;
        if (nameKey !== undefined)
        {
            if (util.hasKebab(nameKey) === true) {
                kebabCaseKey = nameKey;
                pascalCaseKey = `${nameKey.split('Kebab')[0]}`;

            } else {
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
function getDirectories( directoryInput: GetDirectoryInput ) : Directories
{
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

    sourceDirectory = path.join(
        ROOT_CONFIG.TEMPLATE_ROOT,
        userFeature,
        (currSourceDir !== './' ? currSourceDir: '')
    );

    if (isConfig) {
        installDirectory = `${featureName}${currInstallDir !== './' ? currInstallDir: ''}`;
    } else if (isStore) {
        installDirectory = `src/${currInstallDir !== './' ? currInstallDir: ''}`;
    } else {
        installDirectory = `src/${currInstallDir !== './' ? currInstallDir: ''}/${featureName}`;
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
function updateConfig (featureNameStore: FeatureNameObject, directories: Directories, kebabNameKey = '')
{
    let absProjectRoot = '';
    let configFile = '';
    let projectRootConfig: object;
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

async function run (operation: Command, USAGE: CLI): Promise<any> {
    try {
        const userAction = operation.action;
        const userFeature = operation.feature;
        const userOptions = operation.options;
        const userFeatureName = operation.featureName;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, CONFIG.OPTIONS_ALL);
        const isValidCreateRequest =
                !hasHelpOption &&
                !hasInvalidOption &&
                ( util.actionBeingRequested(userAction) === GENERATE_ACTION );
        const isConfig = userFeature === featureType.config;
        const isStore = userFeature === featureType.store;
        const isProject = userFeature === featureType.project;
        const currentConfig = commandAssignmentModule(userFeature);
        const questions = CONFIG.parsePrompts(commandAssignmentModule(userFeature));
        const projectName = '<project-name>';

        let featureNameStore: FeatureNameObject = {};
        let nameKey = '';
        let answers: Answers = {};
        let kebabNameKey = '';
        let projectRoot: string | null;
        let directories: Directories;

        // [1] Check if the user did not use the generate command or had an invalid command
        if (!isValidCreateRequest) {
             // Show Help Menu
             const CLIPROPERTY = menuAssignment(operation.feature);
             console.log(util.displayHelp(CLIPROPERTY.menu as Section[]));

             return true;
        }

        // [1]b If the user used the generate actionwith a valid command and option

        // [2] Check if the user requested a new project
        if (isProject) {

            // [2]b Get required config
            await run({options: userOptions, feature: featureType.config,
                        action: userAction, featureName: userFeatureName}, USAGE);

            // Console.log(">>>project created");
            // [2]c Create required storage for project
            await run({options: userOptions, feature: featureType.store,
                         action: userAction, featureName: userFeatureName}, USAGE);

            util.nextSteps(projectName);

            return true;
        }


        // [3] Getting the name key used. ex: "projectName" or "componentName"
        if (currentConfig.arguments !== undefined) {
            nameKey = currentConfig.arguments[0].name;
        }

        // [4] Retrieve user response to *questions* asked.
        // *question* eg: "Please enter the name for the generated project"
        if ( userFeatureName !== '' ) {
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
        directories = getDirectories( {featureNameStore,
                                        currentConfig,
                                        kebabNameKey,
                                        isConfig,
                                        isStore,
                                        projectRoot,
                                        userFeature,
                                    } );

        // [9] Copy and update files from a source directory to a destination directory
        if(currentConfig.files !== undefined){
            await files.copyAndUpdateFiles(
                directories.sourceDir, directories.installDir,
                currentConfig.files, featureNameStore);
        }

        // [10] If executing the 'config' feature
        if (isConfig) {
            // [10]b Updating the '.rdvue' config file to include the project root path
            if (kebabNameKey !== undefined)
            {
                updateConfig(featureNameStore, directories, kebabNameKey);
            }

        } else {
            // [10]c Create a section break
            util.sectionBreak();
            console.log(chalk.magenta
                        (`The ${userFeature} "${answers[nameKey]}" has been generated.`));
        }

        return true;
    } catch (err) {
        // TODO: Implement more contextual errors
        if (err) {
            throw new Error(err);
        }
    }
}
export{
    run
};
