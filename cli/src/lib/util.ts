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
  displayHelp
};