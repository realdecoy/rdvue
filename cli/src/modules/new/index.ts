import chalk from "chalk";
import files from "../../lib/files";
import util from "../../lib/util";
// import repo from "../../lib/repo";
import inquirer from "inquirer";
import CONFIG from "./config";
import process from "process";

async function run (operation: any, USAGE: any): Promise<any> {
    try {
        const userOptions = operation.options;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, CONFIG.OPTIONS_ALL);
        const questions = CONFIG.parsePrompts(USAGE[operation.command].config);
        const currentConfig = USAGE[operation.command].config;
        let sourceDirectory = '';
        let installDirectory = '';
        const featureNameStore: any = {};
        let nameKey = '';

        if(!hasHelpOption && !hasInvalidOption && userOptions.includes('--new')){
            if(operation.command == 'project'){
                // get required config
                await run({options: userOptions, command:'config'}, USAGE);
                // console.log(">>>project created");
                await run({options: userOptions, command:'store'}, USAGE);
                util.nextSteps("<project-name>");
            } else {
                const isNewProject = operation.command === 'config';
                const answers: any = await inquirer.prompt(questions);
                if(currentConfig.arguments) {

                    nameKey = currentConfig.arguments[0].name;
                    featureNameStore[nameKey] = util.hasKebab(nameKey) === true ? util.getKebabCase(answers[nameKey]) : util.getPascalCase(answers[nameKey]);

                }

                const kebabNameKey = (Object.keys(featureNameStore).filter(f => util.hasKebab(f)))[0];
                
                util.lineBreak();
                util.sectionBreak();
                if(isNewProject){

                    sourceDirectory = `__template/template/${operation.command}${currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''}`;
                    installDirectory = `${featureNameStore[kebabNameKey]}${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}`;
                    
                } else if (operation.command === 'store'){


                    sourceDirectory = `../__template/template/${operation.command}${currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''}`;
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}`;

                    
                } else {

                    sourceDirectory = `__template/template/${operation.command}${currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory: ''}`
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory: ''}/${featureNameStore[kebabNameKey]}`;
                    
                }
                await files.copyAndUpdateFiles(sourceDirectory, installDirectory, currentConfig.files, featureNameStore);
                if(isNewProject){
                    process.chdir(`./${featureNameStore[kebabNameKey]}`);
                } else {
                    util.sectionBreak();
                    util.lineBreak();
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