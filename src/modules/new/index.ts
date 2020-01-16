import chalk from 'chalk';
import path from 'path';
import process from 'process';

import { copyAndUpdateFiles, writeFile } from '../../lib/files';
import util from '../../lib/util';

import { OPTIONS_ALL, parsePrompts } from './config';

import inquirer from 'inquirer';
import { TEMPLATE_ROOT } from '../../config';




async function run (operation: any, USAGE: any): Promise<any> {
    try {
        const userOptions = operation.options;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, OPTIONS_ALL);
        const questions = parsePrompts(USAGE[operation.command].config);
        const currentConfig = USAGE[operation.command].config;
        let sourceDirectory = '';
        let installDirectory = '';
        let projectName = '<project-name>';
        const featureNameStore: any = {};
        let kebabNameKey = '';
        let nameKey = '';

        if(!hasHelpOption && !hasInvalidOption && userOptions.includes('--new')){
            if(operation.command == 'project'){
                // get required config
                await run({options: userOptions, command:'config'}, USAGE);
                // console.log(">>>project created");
                await run({options: userOptions, command:'store'}, USAGE);
                
                util.nextSteps(projectName);
            } else {
                const isNewProject = operation.command === 'config';
                const answers: any = await inquirer.prompt(questions);
                if(currentConfig.arguments){
                    nameKey = currentConfig.arguments[0].name;
                    if (util.hasKebab(nameKey) === true) {
                        featureNameStore[nameKey] = util.getKebabCase(answers[nameKey])
                        featureNameStore[`${nameKey.split('Kebab')[0]}`] = util.getPascalCase(answers[nameKey]);
                    }else{
                        featureNameStore[nameKey] = util.getPascalCase(answers[nameKey]);
                        featureNameStore[`${nameKey}Kebab`] = util.getKebabCase(answers[nameKey]);
                    }
                    kebabNameKey = (Object.keys(featureNameStore).filter(f => util.hasKebab(f)))[0];
                }
                util.sectionBreak();

                const projectRoot = util.getProjectRoot();

                if(isNewProject){
                    sourceDirectory = path.join(TEMPLATE_ROOT,operation.command,(currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''));
                    installDirectory = `${featureNameStore[kebabNameKey]}${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}`;
                } else if (operation.command === 'store'){
                    sourceDirectory = path.join(TEMPLATE_ROOT,operation.command,(currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''));
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}`;
                } else {
                    sourceDirectory = path.join(TEMPLATE_ROOT,operation.command,(currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''));
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}/${featureNameStore[kebabNameKey]}`;
                }

                if (projectRoot !== null && !isNewProject) {
                    installDirectory = `${projectRoot}/${installDirectory}`;
                }

                await copyAndUpdateFiles(
                    sourceDirectory, installDirectory,
                    currentConfig.files, featureNameStore);

                if(isNewProject){
                    const absProjectRoot = path.resolve(installDirectory);
                    const configFile = path.join(absProjectRoot, '.rdvue');
                    const projectRootConfig = {
                        projectRoot: absProjectRoot
                    };
                    const strProjectRootConfig = JSON.stringify(projectRootConfig);

                    // Writing the project root path to the .rdvue file
                    writeFile(configFile, strProjectRootConfig);

                    process.chdir(`./${featureNameStore[kebabNameKey]}`);
                } else {
                    util.sectionBreak();
                    console.log(chalk.magenta("[All Done]"));
                }
            }
        } else {
            console.log(util.displayHelp(USAGE[operation.command].menu)); // show help menu
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