import figlet from "figlet";
import chalk from "chalk";
import commandLineUsage, { Section } from 'command-line-usage';

const helpOptions = ['--help', '-h'];

function heading(): void {
  console.log(
    chalk.yellow(
      figlet.textSync("rdvue", {
        horizontalLayout: "full"
      })
    )
  );
}
function sectionBreak(): void {
  console.log(chalk.gray("********************************"));
}
function lineBreak(): void {
  console.log('\n');
}
function nextSteps(featureName: string): void {
  console.log(chalk.magenta('\nNext Steps:'));
  console.log(` - cd ${featureName}\n - npm install\n - npm run-script serve`);
}
function hasCommand(args: string[], commands: string[]): boolean {
  // console.log(`hasCommand: ${commands}`);
  const found = commands.some((r) => args.includes(r));
  return found;
}
function hasOptions(args: string[], options: string[]): boolean {
  // console.log(`hasOptions: ${options}`);
  const found = options.some((r) => args.includes(r));
  return found;
}
function hasHelpOption(args: string[]): boolean {
  // console.log(`hasHelpOptions: ${helpOptions}`);
  const found = helpOptions.some((r) => args.includes(r));
  return found;
}
function hasInvalidOption(args: string[], options: string[]): boolean {
  // console.log(`hasInvalidOption: ${args}`);
  const found = args.some((r) => !options.includes(r) && !helpOptions.includes(r));
  return found;
}
function parseCommand(args: string[], commands: string[]): string {
  return args.filter(x => commands.includes(x))[0];
}
function parseOptions(args: string[], commands: string[]): string[] { 
  return args.filter(x => !commands.includes(x));
}
function displayHelp(sections: Section[]): string{
  return commandLineUsage(sections);
}
function getKebabCase(str: string) {

  const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
  const match = str.match(regex);
  let result = '';
  if(match){
    result = match.map(x=> x.toLowerCase()).join('-');
  }

  return result;
}
function getPascalCase(str:string) {
  return (str.replace(/\w\S*/g, m => `${m.charAt(0).toLocaleUpperCase()}${m.substr(1).toLocaleLowerCase()}`))
}
function hasKebab(str = '') {
  let result = false;
  if (str.match(/kebab/gi) !== null) {
    result = true;
  }

  return result;
}

export default {
  heading,
  sectionBreak,
  lineBreak,
  nextSteps,
  hasCommand,
  hasOptions,
  hasHelpOption,
  hasInvalidOption,
  parseCommand,
  parseOptions,
  displayHelp,
  hasKebab,
  getKebabCase,
  getPascalCase
};