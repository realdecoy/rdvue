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

// MOVE THIS TO NEW FILE
const NEW_OPTION = '--new';
interface Directories {
    sourceDir: string,
    installDir: string,
}

function getDirectories( featureNameStore: any, currentConfig: any, kebabNameKey: string, 
    isConfig: boolean, isStore: boolean, projectRoot: string | null, command: string ) : Directories
{
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

function updateConfig (featureNameStore: any, directories: any, kebabNameKey: string)
// Void function
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
        const validCreateRequest =
                !hasHelpOption &&
                !hasInvalidOption &&
                userOptions.includes(NEW_OPTION);

        const questions = CONFIG.parsePrompts(commandAssignmentModule(userCommand));
        const currentConfig = commandAssignmentModule(userCommand);
        const featureNameStore: any = {};
        const isConfig = userCommand === 'config'; // USE ENUM INSTEAD
        const isStore = userCommand === 'store';
        const isProject = userCommand === 'project';
        const projectName = '<project-name>';

        let answers: any;
        let kebabNameKey = '';
        let nameKey = '';
        let projectRoot: string | null;
        let directories: Directories;


        // If the user used the '--new' option with a valid command and option
        if (validCreateRequest) {

            if (isProject) {
                // Get required config
                await run({options: userOptions, command:'config'}, USAGE);

                // Console.log(">>>project created");
                await run({options: userOptions, command:'store'}, USAGE);

                util.nextSteps(projectName);

                return true;
            }

            answers = await inquirer.prompt(questions);

            // Places the Kebab and Pascal case of user input into an object 'featureNameStore'
            if (currentConfig.arguments !== undefined) {
                nameKey = currentConfig.arguments[0].name;
                if (util.hasKebab(nameKey) === true) {
                    featureNameStore[nameKey] = util.getKebabCase(answers[nameKey])
                    featureNameStore[`${nameKey.split('Kebab')[0]}`] = util.getPascalCase(answers[nameKey]);
                } else {
                    featureNameStore[nameKey] = util.getPascalCase(answers[nameKey]);
                    featureNameStore[`${nameKey}Kebab`] = util.getKebabCase(answers[nameKey]);
                }
                kebabNameKey = (Object.keys(featureNameStore)
                                        .filter(f => util.hasKebab(f)))[0];
            }

            // Create a section break
            util.sectionBreak();

            // Obtaining the path of the project root
            projectRoot = util.getProjectRoot();

            // Determine the directories in which the project files are to be stored
            directories = getDirectories(
                featureNameStore,
                currentConfig,
                kebabNameKey,
                isConfig,
                isStore,
                projectRoot,
                userCommand
                );

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

        } else {
            // Show Help Menu
            console.log(util.displayHelp(USAGE[operation.command].menu)); 
        }

        return true;
    } catch (err) {
        if (err) {
            throw new Error(err);
        }
    }
}
export{
    run
};
