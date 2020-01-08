"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const files_1 = __importDefault(require("../../lib/files"));
const util_1 = __importDefault(require("../../lib/util"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const config_1 = __importDefault(require("./config"));
const config_2 = __importDefault(require("../../config"));
const process_1 = __importDefault(require("process"));
async function run(operation, USAGE) {
    try {
        const userOptions = operation.options;
        const hasHelpOption = util_1.default.hasHelpOption(userOptions);
        const hasInvalidOption = util_1.default.hasInvalidOption(userOptions, config_1.default.OPTIONS_ALL);
        const questions = config_1.default.parsePrompts(USAGE[operation.command].config);
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
                util_1.default.nextSteps(projectName);
            }
            else {
                const isNewProject = operation.command === 'config';
                const answers = await inquirer_1.default.prompt(questions);
                if (currentConfig.arguments) {
                    nameKey = currentConfig.arguments[0].name;
                    if (util_1.default.hasKebab(nameKey) === true) {
                        featureNameStore[nameKey] = util_1.default.getKebabCase(answers[nameKey]);
                        featureNameStore[`${nameKey.split('Kebab')[0]}`] = util_1.default.getPascalCase(answers[nameKey]);
                    }
                    else {
                        featureNameStore[nameKey] = util_1.default.getPascalCase(answers[nameKey]);
                        featureNameStore[`${nameKey}Kebab`] = util_1.default.getKebabCase(answers[nameKey]);
                    }
                    kebabNameKey = (Object.keys(featureNameStore).filter(f => util_1.default.hasKebab(f)))[0];
                }
                util_1.default.sectionBreak();
                const projectRoot = util_1.default.getProjectRoot();
                if (isNewProject) {
                    sourceDirectory = path_1.default.join(config_2.default.TEMPLATE_ROOT, operation.command, (currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory : ''));
                    installDirectory = `${featureNameStore[kebabNameKey]}${currentConfig.installDirectory !== './' ? currentConfig.installDirectory : ''}`;
                }
                else if (operation.command === 'store') {
                    sourceDirectory = path_1.default.join(config_2.default.TEMPLATE_ROOT, operation.command, (currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory : ''));
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory : ''}`;
                }
                else {
                    sourceDirectory = path_1.default.join(config_2.default.TEMPLATE_ROOT, operation.command, (currentConfig.sourceDirectory !== './' ? currentConfig.sourceDirectory : ''));
                    installDirectory = `src/${currentConfig.installDirectory !== './' ? currentConfig.installDirectory : ''}/${featureNameStore[kebabNameKey]}`;
                }
                if (projectRoot !== null && !isNewProject) {
                    installDirectory = `${projectRoot}/${installDirectory}`;
                }
                await files_1.default.copyAndUpdateFiles(sourceDirectory, installDirectory, currentConfig.files, featureNameStore);
                if (isNewProject) {
                    const absProjectRoot = path_1.default.resolve(installDirectory);
                    const configFile = path_1.default.join(absProjectRoot, '.rdvue');
                    const projectRootConfig = {
                        projectRoot: absProjectRoot
                    };
                    const strProjectRootConfig = JSON.stringify(projectRootConfig);
                    // Writing the project root path to the .rdvue file
                    files_1.default.writeFile(configFile, strProjectRootConfig);
                    process_1.default.chdir(`./${featureNameStore[kebabNameKey]}`);
                }
                else {
                    util_1.default.sectionBreak();
                    console.log(chalk_1.default.magenta("[All Done]"));
                }
            }
        }
        else {
            console.log(util_1.default.displayHelp(USAGE[operation.command].menu)); // show help menu
        }
        return true;
    }
    catch (err) {
        if (err) {
            throw new Error(err);
        }
    }
}
exports.default = {
    run,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9uZXcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsNERBQW9DO0FBQ3BDLDBEQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsd0RBQWdDO0FBQ2hDLHNEQUE4QjtBQUM5QiwwREFBdUM7QUFDdkMsc0RBQThCO0FBRTlCLEtBQUssVUFBVSxHQUFHLENBQUUsU0FBYyxFQUFFLEtBQVU7SUFDMUMsSUFBSTtRQUNBLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDdEMsTUFBTSxhQUFhLEdBQUcsY0FBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RCxNQUFNLGdCQUFnQixHQUFHLGNBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRixNQUFNLFNBQVMsR0FBRyxnQkFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3RELElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQztRQUNuQyxNQUFNLGdCQUFnQixHQUFRLEVBQUUsQ0FBQztRQUNqQyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUcsQ0FBQyxhQUFhLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFDO1lBQ3BFLElBQUcsU0FB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