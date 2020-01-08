import chalk from "chalk";
import files from "../../lib/files";
import util from "../../lib/util";
import path from 'path';
import inquirer from "inquirer";
import CONFIG from "./config";
import ROOT_CONFIG from "../../config";
import process from "process";
async function run(operation, USAGE) {
    try {
        const userOptions = operation.options;
        const hasHelpOption = util.hasHelpOption(userOptions);
        const hasInvalidOption = util.hasInvalidOption(userOptions, CONFIG.OPTIONS_ALL);
        const questions = CONFIG.parsePrompts(USAGE[operation.command].config);
        const currentConfig = USAGE[operation.command].config;
        let sourceDirectory = '';
        let installDirectory = '';
        let projectName = '<project-name>';
        const featureNameStore = {};
        let kebabNameKey = '';
        let nameKey = '';
        if (!hasHelpOption && !hasInvalidOption && userOptions.includes('--new')) {
            if (operation.command == 'project') {
                // get required config
                await run({ options: userOptions, command: 'config' }, USAGE);
                // console.log(">>>project created");
                await run({ options: userOptions, command: 'store' }, USAGE);
                util.nextSteps(projectName);
            }
            else {
                const isNewProject = operation.command === 'config';
                const answers = await inquirer.prompt(questions);
                if (currentConfig.arguments) {
                    nameKey = currentConfig.arguments[0].name;
                    if (util.hasKebab(nameKey) === true) {
                        featureNameStore[nameKey] = util.getKebabCase(answers[nameKey]);
                        featureNameStore[`${nameKey.split('Kebab')[0]}`] = util.getPascalCase(answers[nameKey]);
                    }
                    else {
                        featureNameStore[nameKey] = util.getPascalCase(answers[nameKey]);
                        featureNameStore[`${nameKey}Kebab`] = util.getKebabCase(answers[nameKey]);
                    }
                    kebabNameKey = (Object.keys(featureNameStore).filter(f => util.hasKebab(f)))[0];
                }
                util.sectionBreak();
                const projectRoot = util.getProjectRoot();
                if (isNewProject) {
                    sourceDirectory = path.join(ROOT_CONFIG.TEMPLATE_ROOT, operation.command, (currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory : ''));
                    installDirectory = `${featureNameStore[kebabNameKey]}${currentConfig.installDirectory !== './' ? currentConfig.installDirectory : ''}`;
                }
                else if (operation.command === 'store') {
                    sourceDirectory = path.join(ROOT_CONFIG.TEMPLATE_ROOT, operation.command, (currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory : ''));
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory : ''}`;
                }
                else {
                    sourceDirectory = path.join(ROOT_CONFIG.TEMPLATE_ROOT, operation.command, (currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory : ''));
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory : ''}/${featureNameStore[kebabNameKey]}`;
                }
                if (projectRoot !== null && !isNewProject) {
                    installDirectory = `${projectRoot}/${installDirectory}`;
                }
                await files.copyAndUpdateFiles(sourceDirectory, installDirectory, currentConfig.files, featureNameStore);
                if (isNewProject) {
                    const absProjectRoot = path.resolve(installDirectory);
                    const configFile = path.join(absProjectRoot, '.rdvue');
                    const projectRootConfig = {
                        projectRoot: absProjectRoot
                    };
                    const strProjectRootConfig = JSON.stringify(projectRootConfig);
                    // Writing the project root path to the .rdvue file
                    files.writeFile(configFile, strProjectRootConfig);
                    process.chdir(`./${featureNameStore[kebabNameKey]}`);
                }
                else {
                    util.sectionBreak();
                    console.log(chalk.magenta("[All Done]"));
                }
            }
        }
        else {
            console.log(util.displayHelp(USAGE[operation.command].menu)); // show help menu
        }
        return true;
    }
    catch (err) {
        if (err) {
            throw new Error(err);
        }
    }
}
export default {
    run,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9uZXcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sS0FBSyxNQUFNLGlCQUFpQixDQUFDO0FBQ3BDLE9BQU8sSUFBSSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xDLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBQzlCLE9BQU8sV0FBVyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLE9BQU8sTUFBTSxTQUFTLENBQUM7QUFFOUIsS0FBSyxVQUFVLEdBQUcsQ0FBRSxTQUFjLEVBQUUsS0FBVTtJQUMxQyxJQUFJO1FBQ0EsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUN0QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEYsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3RELElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQztRQUNuQyxNQUFNLGdCQUFnQixHQUFRLEVBQUUsQ0FBQztRQUNqQyxJQUFJLFlB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