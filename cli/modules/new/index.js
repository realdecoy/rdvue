const chalk = require("chalk");
const util = require("../../lib/util");
const files = require("../../lib/files");
const repo = require("../../lib/repo");
const inquirer = require("inquirer");
const {
    OPTIONS_ALL,
    USAGE,
    QUESTIONS,
    TEMPLATE_PROJECT_URL,
    TEMPLATE_PROJECT_NAME } = require("./config");

module.exports = {
    run: async (operation) => {
        try {
            const userOptions = operation.options;
            const hasHelpOption = util.hasHelpOption(userOptions);
            const hasInvalidOption = util.hasInvalidOption(userOptions, OPTIONS_ALL);

            if(!hasHelpOption && !hasInvalidOption){
                answers = await inquirer.prompt(QUESTIONS);
                const { projectName } = answers;
                util.lineBreak();
                await repo.cloneRemoteRepo(TEMPLATE_PROJECT_URL, projectName);
                util.sectionBreak();
                await files.readWriteProjectAsync(projectName, TEMPLATE_PROJECT_NAME);
                console.log(chalk.green("\nAll done!"));
                util.sectionBreak();
                util.nextSteps(answers.projectName);
            } else {
                console.log(util.displayHelp(USAGE)); // show help menu
            }
            return true;
        } catch (err) {
            if (err) {
                throw new Error(err);
            }    
        }
    }
}