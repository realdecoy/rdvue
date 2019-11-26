import chalk from "chalk";
import files from "../../lib/files";
import util from "../../lib/util";
// import repo from "../../lib/repo";
import inquirer from "inquirer";

import config from "./config";


  
async function run (operation: any, USAGE: any): Promise<any> {
    try {
        const userOptions = operation.options;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, config.OPTIONS_ALL);
        const questions = config.parsePrompts(USAGE[operation.command].config);

        if(!hasHelpOption && !hasInvalidOption){
            // console.log(hasHelpOption, hasInvalidOption);
            
            if(operation.command == 'project' && operation.options.includes('--new')){
                await run({options: userOptions, command:'config'}, USAGE);
                // for (const c in USAGE[operation.command].config.import){

                // }
            }else {
                const answers: any = await inquirer.prompt(questions);
                const nameKey = `${USAGE[operation.command].config.name}Name`;
                const featureName = answers[nameKey];
                console.log(featureName);
                util.lineBreak();
                util.sectionBreak();
                await files.readWriteFeatureAsync(USAGE[operation.command].config.name, featureName, USAGE[operation.command].config.installDirectory, nameKey, USAGE[operation.command].config.files.filter((p: any) => {return p.source !== undefined && p.target !== undefined}), false);
                console.log(chalk.green("\nAll done!"));
                util.sectionBreak();
                util.nextSteps(answers.featureName);
            }
            console.log(chalk.green("\nAll done!"));
            util.sectionBreak();
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