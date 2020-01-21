import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import process from 'process';
import CONFIG from './config';

import * as ROOT_CONFIG from '../../config';
import * as files from '../../lib/files';
import { commandAssignmentModule } from '../../lib/index_functions';
import * as util from '../../lib/util';
import { Command } from '../../types/index';
import { Usage } from '../../types/usage';

// TO DO: MOVE THESE DECLARATIONS TO NEW FILE
const NEW_OPTION = '--new';
interface Directories {
    sourceDir: string;
    installDir: string;
}

interface GetDirectoryInput {
    featureNameStore: any;
    currentConfig: any;
    kebabNameKey: any;
    isConfig: boolean;
    isStore: boolean;
    projectRoot: string | null;
    userCommand: string;
}

enum command {
    config = 'config',
    store = 'store',
    project = 'project'
}

/**
 * Description: Transforms user input into Kebab and or Pascal case updating
 * nameKey prop on object 'featureNameStore'
 * @param currentConfig - current configuration for the project in use.
 * @param answers - user arguments that is returned in response to inquirer questions.
 * see: https://www.npmjs.com/package/inquirer
 */
function updateNameProp (currentConfig: any, answers: any) {
    const featureName: any = {};
    let nameKey = '';
    let kebabCase = '';
    let pascalCase = '';

    if (currentConfig.arguments) {
        // NameKey is the variable which holds the name of the argument to be retrieved from user
        // Example of nameKey: "pageName" or "pageNameKebab"
        nameKey = currentConfig.arguments[0].name;

        if (util.hasKebab(nameKey) === true) {
            kebabCase = nameKey;
            pascalCase = `${nameKey.split('Kebab')[0]}`;

            featureName[kebabCase] = util.getKebabCase(answers[nameKey])
            featureName[pascalCase] = util.getPascalCase(answers[nameKey]);
        } else {
            kebabCase = `${nameKey}Kebab`;
            pascalCase = nameKey;

            featureName[pascalCase] = util.getPascalCase(answers[nameKey]);
            featureName[kebabCase] = util.getKebabCase(answers[nameKey]);
        }
    }

    return featureName;
}

/**
 * Description: Finding the path of the source and install directories for the
 * feature being processed
 * @param dirInput - necessessary input required to obtain install and source directory 
 * for given project
 */
function getDirectories( dirInput: GetDirectoryInput ) : Directories
{
    const featureNameStore = dirInput.featureNameStore;
    const currentConfig = dirInput.currentConfig;
    const kebabNameKey = dirInput.kebabNameKey;
    const isConfig = dirInput.isConfig;
    const isStore = dirInput.isStore;
    const projectRoot = dirInput.projectRoot;
    const command = dirInput.userCommand;
    const currSourceDir = currentConfig.sourceDirectory;
    const currInstallDir = currentConfig.installDirectory;
    const featName = featureNameStore[kebabNameKey];
    let sourceDirectory = '';
    let installDirectory = '';

    if (isConfig) {
        sourceDirectory = path.join(
            ROOT_CONFIG.TEMPLATE_ROOT,
            command,
            (currSourceDir !== './' ? currSourceDir: '')
        );
        installDirectory = `${featName}${currInstallDir !== './' ? currInstallDir: ''}`;
    } else if (isStore) {
        sourceDirectory = path.join(
            ROOT_CONFIG.TEMPLATE_ROOT,
            command,
            (currSourceDir !== './' ? currSourceDir: '')
        );
        installDirectory = `src/${currInstallDir !== './' ? currInstallDir: ''}`;
    } else {
        sourceDirectory = path.join(
            ROOT_CONFIG.TEMPLATE_ROOT,
            command,
            (currSourceDir !== './' ? currSourceDir: '')
        );
        installDirectory = `src/${currInstallDir !== './' ? currInstallDir: ''}/${featName}`;
    }

    if (projectRoot !== null && !isConfig) {
        installDirectory = `${projectRoot}/${installDirectory}`;
    }

    return {
        installDir: installDirectory,
        sourceDir: sourceDirectory,
    }

}

/**
 * Description: Updating the configuration to hace correct directory place for .rdvue file
 * @param featureNameStore - object holding both Kebab and Pascal cases of the feature name
 * @param directories - install and source directory
 * @param kebabNameKey - the kebab case of the feature name
 */
function updateConfig (featureNameStore: any, directories: any, kebabNameKey = '') // void function
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

    // Changes the current working directory to 
    process.chdir(`./${featureNameStore[kebabNameKey]}`);
}

async function run (operation: Command, USAGE: Usage): Promise<any> {
    try {
        const userOptions = operation.options;
        const userCommand = operation.command;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, CONFIG.OPTIONS_ALL);
        const isValidCreateRequest =
                !hasHelpOption &&
                !hasInvalidOption &&
                userOptions.includes(NEW_OPTION);
        const isConfig = userCommand === command.config;
        const isStore = userCommand === command.store;
        const isProject = userCommand === command.project;
        const currentConfig = commandAssignmentModule(userCommand);
        const questions = CONFIG.parsePrompts(commandAssignmentModule(userCommand));
        const projectName = '<project-name>';

        let featureNameStore: any = {};
        let answers: any;
        let kebabNameKey = '';
        let projectRoot: string | null;
        let directories: Directories;
        let dirInput: GetDirectoryInput;

        // If the user did not use the '--new' option or had an invalid command or option
        if (!isValidCreateRequest) {
             // Show Help Menu
             // TODO: Re Enable and Fix
             // console.log(util.displayHelp(USAGE[operation.command].menu));

             return true;
        }
        // If the user used the '--new' option with a valid command and option
        if (isProject) {
            // Get required config
            await run({options: userOptions, command:'config'}, USAGE);

            // Console.log(">>>project created");
            await run({options: userOptions, command:'store'}, USAGE);

            util.nextSteps(projectName);

            return true;
        }

        answers = await inquirer.prompt(questions);

        // Create a section break
        util.sectionBreak();

        // Obtaining the path of the project root
        projectRoot = util.getProjectRoot();

        // Obtaining the Kebab and Pascal case of the feature name input by user and
        // placing it in object "featureNameStore"
        featureNameStore = updateNameProp(currentConfig, answers);
        // Retrieving the Kebab case from the featureNameStore object
        kebabNameKey = (Object.keys(featureNameStore).filter(f => util.hasKebab(f)))[0];

        // Input object for getDirectories() function
        dirInput = {
            featureNameStore,
            currentConfig,
            kebabNameKey,
            isConfig,
            isStore,
            projectRoot,
            userCommand,
        };

        // Determine the directories in which the project files are to be stored
        directories = getDirectories( dirInput );
        await files.copyAndUpdateFiles(
            directories.sourceDir, directories.installDir,
            currentConfig.files, featureNameStore);

        // If executing the 'config' command
        if (isConfig) {
            // Updating the '.rdvue' config file to include the project root path
            updateConfig(featureNameStore, directories, kebabNameKey);

        } else {
            // Create a section break
            util.sectionBreak();
            console.log(chalk.magenta('[All Done]'));
        }

        return true;
    } catch (err) {
        // TO DO: Implement more contextual errors
        if (err) {
            throw new Error(err);
        }
    }
}
export{
    run
};
