import chalk from 'chalk';
import commandLineUsage, { Section } from 'command-line-usage';
import figlet from 'figlet';
import path from 'path';
import { fileExists } from './files';

const helpOptions = ['--help', '-h'];

function heading(): void {
  // tslint:disable-next-line:no-console
  console.log(
    chalk.yellow(
      figlet.textSync('rdvue', {
        horizontalLayout: 'full'
      })
    )
  );
}

function sectionBreak(): void {
  // tslint:disable-next-line:no-console
  console.log(chalk.gray('********************************'));
}

function lineBreak(): void {
  // tslint:disable-next-line:no-console
  console.log('\n');
}

function nextSteps(featureName: string): void {
  // tslint:disable-next-line:no-console
  console.log(chalk.magenta('\nNext Steps:'));
  // tslint:disable-next-line:no-console
  console.log(` - cd ${featureName}\n - npm install\n - npm run-script serve`);
}

function hasCommand(args: string[], commands: string[]): boolean {
  // Console.log(`hasCommand: ${commands}`);
  const found = commands.some((r) => args.includes(r));

  return found;
}

function hasOptions(args: string[], options: string[]): boolean {
  // Console.log(`hasOptions: ${options}`);
  const found = options.some((r) => args.includes(r));

  return found;
}

function hasHelpOption(args: string[]): boolean {
  // Console.log(`hasHelpOptions: ${helpOptions}`);
  const found = helpOptions.some((r) => args.includes(r));

  return found;
}

function hasInvalidOption(args: string[], options: string[]): boolean {
  // Console.log(`hasInvalidOption: ${args}`);
  const found = args.some((r) => !options.includes(r) && !helpOptions.includes(r));

  return found;
}

function parseCommand(args: string[], commands: string[]): string {
  return args.filter(x => commands.includes(x))[0];
}

function parseOptions(args: string[], commands: string[]): string[] {
  return args.filter(x => !commands.includes(x));
}

function displayHelp(sections: Section[]): string {
  return commandLineUsage(sections);
}

function getKebabCase(str: string) {

  const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
  const match = str.match(regex);
  let result = '';
  if (match !== null) {
    result = match.map(x => x.toLowerCase())
    .join('-');
  }

  return result;
}

function getPascalCase(str: string) {
  return (str.replace(/\w\S*/g, m => `${m.charAt(0)
    .toLocaleUpperCase()}${m.substr(1)
    .toLocaleLowerCase()}`));
}

function hasKebab(str = '') {
  let result = false;
  if (str.match(/kebab/gi) !== null) {
    result = true;
  }

  return result;
}

function isRootDirectory(location: string | null = null): boolean {
  let isRoot = false;
  try {
    let paths = [];
    let testLocation = location;
    if (location === null) {
      testLocation = process.cwd();
    }

    if (testLocation !== null) {
      paths = testLocation.split(path.sep);
      if (paths.length > 0 && paths[1] === '') {
        isRoot = true;
      }
    }
  } catch (e) {
  // tslint:disable-next-line:no-console
    console.warn('Error checking root directory');
    isRoot = true;
  }

  return isRoot;
}

function getProjectRoot() {
  const configFileName = '.rdvue';
  const maxTraverse = 20;

  let currentPath = process.cwd();
  let currentTraverse = 0;
  let projectRoot = null;
  let back = './';

  while (true) {
    currentPath = path.join(process.cwd(), back);
    back = path.join(back, '../');
    currentTraverse += 1;

    if (fileExists(path.join(currentPath, configFileName))) {
      projectRoot = currentPath;
      break;
    } else if (isRootDirectory(currentPath)) {
      projectRoot = null;
      break;
    } else if (currentTraverse > maxTraverse) {
      projectRoot = null;
      break;
    }
  }

  return projectRoot;
}

function checkProjectValidity(operation: any) {
  const results = {
    isValid: false,
    projectRoot: null as any,
  };
  let projectRoot: string | null;

  if (operation.command === 'project') {
    results.isValid = true;
  } else {

    projectRoot = getProjectRoot();
    if (projectRoot !== null) {
      results.isValid = true;
      results.projectRoot = projectRoot;
    } else {
      results.isValid = false;
    }

  }

  return results;
}


export {
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
  getPascalCase,
  checkProjectValidity,
  isRootDirectory,
  getProjectRoot,
};
