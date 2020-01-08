import figlet from "figlet";
import chalk from "chalk";
import commandLineUsage from 'command-line-usage';
import path from 'path';
import files from './files';
const helpOptions = ['--help', '-h'];
function heading() {
    console.log(chalk.yellow(figlet.textSync("rdvue", {
        horizontalLayout: "full"
    })));
}
function sectionBreak() {
    console.log(chalk.gray("********************************"));
}
function lineBreak() {
    console.log('\n');
}
function nextSteps(featureName) {
    console.log(chalk.magenta('\nNext Steps:'));
    console.log(` - cd ${featureName}\n - npm install\n - npm run-script serve`);
}
function hasCommand(args, commands) {
    // console.log(`hasCommand: ${commands}`);
    const found = commands.some((r) => args.includes(r));
    return found;
}
function hasOptions(args, options) {
    // console.log(`hasOptions: ${options}`);
    const found = options.some((r) => args.includes(r));
    return found;
}
function hasHelpOption(args) {
    // console.log(`hasHelpOptions: ${helpOptions}`);
    const found = helpOptions.some((r) => args.includes(r));
    return found;
}
function hasInvalidOption(args, options) {
    // console.log(`hasInvalidOption: ${args}`);
    const found = args.some((r) => !options.includes(r) && !helpOptions.includes(r));
    return found;
}
function parseCommand(args, commands) {
    return args.filter(x => commands.includes(x))[0];
}
function parseOptions(args, commands) {
    return args.filter(x => !commands.includes(x));
}
function displayHelp(sections) {
    return commandLineUsage(sections);
}
function getKebabCase(str) {
    const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
    const match = str.match(regex);
    let result = '';
    if (match) {
        result = match.map(x => x.toLowerCase()).join('-');
    }
    return result;
}
function getPascalCase(str) {
    return (str.replace(/\w\S*/g, m => `${m.charAt(0).toLocaleUpperCase()}${m.substr(1).toLocaleLowerCase()}`));
}
function hasKebab(str = '') {
    let result = false;
    if (str.match(/kebab/gi) !== null) {
        result = true;
    }
    return result;
}
function isRootDirectory(location = null) {
    let isRoot = false;
    try {
        let paths = [];
        let testLocation = location;
        if (location === null) {
            testLocation = process.cwd();
        }
        if (testLocation !== null) {
            paths = testLocation.split(path.sep);
            if (paths && paths.length > 0 && paths[1] === '') {
                isRoot = true;
            }
        }
    }
    catch (e) {
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
        if (files.fileExists(path.join(currentPath, configFileName))) {
            projectRoot = currentPath;
            break;
        }
        else if (isRootDirectory(currentPath)) {
            projectRoot = null;
            break;
        }
        else if (currentTraverse > maxTraverse) {
            projectRoot = null;
            break;
        }
    }
    return projectRoot;
}
function checkProjectValidity(operation) {
    const results = {
        isValid: false,
        projectRoot: null,
    };
    if (operation.command === 'project') {
        results.isValid = true;
    }
    else {
        const projectRoot = getProjectRoot();
        if (projectRoot !== null) {
            results.isValid = true;
            results.projectRoot = projectRoot;
        }
        else {
            results.isValid = false;
        }
    }
    return results;
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
    getPascalCase,
    checkProjectValidity,
    isRootDirectory,
    getProjectRoot,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sZ0JBQTZCLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUU1QixNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVyQyxTQUFTLE9BQU87SUFDZCxPQUFPLENBQUMsR0FBRyxDQUNULEtBQUssQ0FBQyxNQUFNLENBQ1YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDdkIsZ0JBQWdCLEVBQUUsTUFBTTtLQUN6QixDQUFDLENBQ0gsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQUNELFNBQVMsWUFBWTtJQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFDRCxTQUFTLFNBQVM7SUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBQ0QsU0FBUyxTQUFTLENBQUMsV0FBbUI7SUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLFdBQVcsMkNBQTJDLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBQ0QsU0FBUyxVQUFVLENBQUMsSUFBYyxFQUFFLFFBQWtCO0lBQ3BELDBDQUEwQztJQUMxQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJ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