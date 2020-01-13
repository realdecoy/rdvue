import chalk from "chalk";
import files from "../../lib/files";
import util from "../../lib/util";
import path from 'path';
import inquirer from "inquirer";
import CONFIG from "./config";
import ROOT_CONFIG from "../../config";
import process from "process";

const NEW_OPTION = '--new';

async function run (operation: any, USAGE: any): Promise<any> {
    try {
        const userOptions = operation.options;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, CONFIG.OPTIONS_ALL);
        const questions = CONFIG.parsePrompts(USAGE[operation.command].config);
        const currentConfig = USAGE[operation.command].config;
        const isConfig = operation.command === 'config';
        const isStore = operation.command === 'store';
        const isProject = operation.command == 'project'
        const featureNameStore: any = {};
        let sourceDirectory = '';
        let installDirectory = '';
        let projectName = '<project-name>';
        let answers: any; 
        let kebabNameKey = '';
        let nameKey = '';
        let projectRoot: string | null; 
        let absProjectRoot: string;
        let configFile: string = '';
        let projectRootConfig: object;
        let strProjectRootConfig: string = '';
        
        
        if (!hasHelpOption && !hasInvalidOption && userOptions.includes(NEW_OPTION)) {
            if (isProject) {
                // Get required config
                await run({options: userOptions, command:'config'}, USAGE);

                // console.log(">>>project created");
                await run({options: userOptions, command:'store'}, USAGE);
                
                util.nextSteps(projectName);
            } else {

                answers = await inquirer.prompt(questions);

                if (currentConfig.arguments){
                    nameKey = currentConfig.arguments[0].name;
                    if (util.hasKebab(nameKey) === true) {
                        featureNameStore[nameKey] = util.getKebabCase(answers[nameKey])
                        featureNameStore[`${nameKey.split('Kebab')[0]}`] = util.getPascalCase(answers[nameKey]);
                    } else {
                        featureNameStore[nameKey] = util.getPascalCase(answers[nameKey]);
                        featureNameStore[`${nameKey}Kebab`] = util.getKebabCase(answers[nameKey]);
                    }
                    kebabNameKey = (Object.keys(featureNameStore).filter(f => util.hasKebab(f)))[0];
                }

                util.sectionBreak();

                projectRoot = util.getProjectRoot();

                if (isConfig) {
                    sourceDirectory = path.join(ROOT_CONFIG.TEMPLATE_ROOT,operation.command,(currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''));
                    installDirectory = `${featureNameStore[kebabNameKey]}${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}`;
                } else if (isStore){
                    sourceDirectory = path.join(ROOT_CONFIG.TEMPLATE_ROOT,operation.command,(currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''));
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}`;
                } else {
                    sourceDirectory = path.join(ROOT_CONFIG.TEMPLATE_ROOT,operation.command,(currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''));
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}/${featureNameStore[kebabNameKey]}`;
                }

                if (projectRoot !== null && !isConfig) {
                    installDirectory = `${projectRoot}/${installDirectory}`;
                }

                await files.copyAndUpdateFiles(
                    sourceDirectory, installDirectory,
                    currentConfig.files, featureNameStore);

                if (isConfig) {
                    absProjectRoot = path.resolve(installDirectory);
                    configFile = path.join(absProjectRoot, '.rdvue');
                    projectRootConfig = {
                        projectRoot: absProjectRoot
                    };
                    strProjectRootConfig = JSON.stringify(projectRootConfig);

                    // Writing the project root path to the .rdvue file
                    files.writeFile(configFile, strProjectRootConfig);

                    process.chdir(`./${featureNameStore[kebabNameKey]}`);
                } else {
                    util.sectionBreak();
                    console.log(chalk.magenta("[All Done]"));
                }
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
export default {
    run,
}