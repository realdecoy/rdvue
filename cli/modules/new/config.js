const chalk = require('chalk');
const files = require("../../lib/files");

const DEFAULT_PROJECT_NAME = 'my-vue-app';
const DEFAULT_PROJECT_DESCRIPTION = 'This is a vue application';
const REGEX_PROJECT_NAME = /^\s+$/;

module.exports = {
  TEMPLATE_PROJECT_URL: "https://avidal_realdecoy@bitbucket.org/realdecoyteam/rd-vue-starter.git",
  TEMPLATE_PROJECT_NAME: 'vue-starter',
  OPTIONS_ALL: ['--test'],
  USAGE: [
    {
      header: 'Synopsis:',
      content: `$ ${chalk.yellow('rdvue')} ${chalk.magenta('new')} ${chalk.cyan('[options]')}`,
    },
    {
      header: 'Options:',
      optionList: [
        {
          name: `${chalk.cyan('help')}`,
          description: 'Print this usage guide.'
        },
        {
          name: `${chalk.cyan('test')}`,
          description: 'test option for demonstration purposes.'
        },
      ]
    }
  ],
  QUESTIONS: [
    {
      type: "input",
      name: "projectName",
      message: "Enter a name for the project:",
      default: DEFAULT_PROJECT_NAME,
      validate: function(value) { 
        let done = this.async();
        if (value.length == 0 || value.match(REGEX_PROJECT_NAME)) {
          done(chalk.red(`You need to enter a valid project name`));
          return;
        } // directory with specified name already exists
        else if (files.directoryExists(value)) {
          done(chalk.red(`Project with the name ${value} already exists`));
          return;
        } else {
          done(null, true);
        }
      }
    },
    {
      type: "input",
      name: "description",
      default: null,
      message: "Enter a description of the project (optional):"
    }
  ],
}