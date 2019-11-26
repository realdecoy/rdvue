const figlet = require("figlet");
const chalk = require("chalk");
const arg = require("arg");
const commandLineUsage = require('command-line-usage');

const helpOptions = ['--help', '-h'];

module.exports = {
  heading: () => {
    console.log(
      chalk.yellow(
        figlet.textSync("rdvue", {
          horizontalLayout: "full"
        })
      )
    );
  },
  sectionBreak: () => {
    console.log(chalk.gray("********************************"));
  },
  lineBreak: () => {
    console.log('\n');
  },
  nextSteps: (projectName) => {
    console.log(chalk.magenta('\nNext Steps:'));
    console.log(` - npm install`);
    console.log(` - cd ${projectName}\n - npm run-script serve`);
  },
  hasCommand: (args, commands) => {
    const found = commands.some((r) => args.includes(r));
    return found;
  },
  hasOptions: (args, options) => {
    const found = options.some((r) => args.includes(r));
    return found;
  },
  hasHelpOption: (args) => {
    const found = helpOptions.some((r) => args.includes(r));
    return found;
  },
  hasInvalidOption: (args, options) => {
    const found = args.some((r) => !options.includes(r) && !helpOptions.includes(r));
    return found;
  },
  parseCommand: (args, commands) => {
    return args.filter(x => commands.includes(x))[0];
  },
  parseOptions: (args, commands) => { 
    return args.filter(x => !commands.includes(x));
  },  
  displayHelp: (sections)=>{
    return commandLineUsage(sections);
  },
}
