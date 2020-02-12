import chalk from 'chalk';
import commandLineUsage from 'command-line-usage';
import figlet from 'figlet';
import path from 'path';
import { ACTIONS } from '../constants/constants';
import { CLI_DESCRIPTION } from '../index';
import { fileExists } from './files';
const helpOptions = ['--help', '-h'];
function heading() {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow(figlet.textSync('rdvue', {
        horizontalLayout: 'full'
    })));
}
function sectionBreak() {
    // tslint:disable-next-line:no-console
    console.log(chalk.gray('********************************'));
}
function lineBreak() {
    // tslint:disable-next-line:no-console
    console.log('\n');
}
function nextSteps(featureName) {
    // tslint:disable-next-line:no-console
    console.log(chalk.magenta('\nNext Steps:'));
    // tslint:disable-next-line:no-console
    console.log(` - cd ${featureName}\n - npm install\n - npm run-script serve`);
}
function hasFeature(args, features) {
    // Console.log(`hasCommand: ${commands}`);
    const found = features.some((r) => args.includes(r));
    return found;
}
function hasOptions(args, options) {
    // Console.log(`hasOptions: ${options}`);
    const found = options.some((r) => args.includes(r));
    return found;
}
function hasHelpOption(args) {
    // Console.log(`hasHelpOptions: ${helpOptions}`);
    const found = helpOptions.some((r) => args.includes(r));
    return found;
}
function hasInvalidOption(args, options) {
    // Console.log(`hasInvalidOption: ${args}`);
    const found = args.some((r) => !options.includes(r) && !helpOptions.includes(r));
    return found;
}
function parseFeature(args, features) {
    return args.filter(x => features.includes(x))[0];
}
/**
 * Get the options that have been input by the user
 */
function parseOptions(args) {
    return args.filter(option => option.includes('--'));
}
/**
 * Description - seperates the user input into <service> <action> <feature>
 * <featureName> [options]
 * @param args - the arguments that the user provided in the command line
 * @param features - the predefined features that can be created with rdvue
 */
function parseUserInput(args, features) {
    // The user input should be in the form:
    // <action> <feature> <feature name> [options]
    const returnObject = {
        action: '',
        feature: '',
        featureName: '',
        options: ['']
    };
    // Magic numbers are not allowed: used to check third argument
    const argIndex = 2;
    let remainingArgs = [];
    // [1] Checking first argument <action> to see if it includes a valid actions
    // (eg. generate)
    if (args[0] !== undefined && actionBeingRequested(args[0]).length > 0) {
        returnObject.action = args[0];
        // [2] Checking second argument <feature>
        // to see if it includes a valid feature (eg. project or page)
        if (args[1] !== undefined && features.includes(args[1])) {
            returnObject.feature = args[1];
            // [3] Checking third argument <feature name> eg. "test_project"
            // If the feature name entered contains '--' at the beggining of the word
            // it is assumed that they are entering an option instead and therefore, no feature name
            // has been inputed/proccessed.
            if (args[argIndex] !== undefined && args[argIndex].substring(0, argIndex) !== '--') {
                returnObject.featureName = args[argIndex];
            }
            // Remove the first <action> and second <feature> argument from array and put remaining 
            // arguments into remainingArgs array
            remainingArgs = args.slice(argIndex);
            remainingArgs.filter(userinput => userinput.substring(0, argIndex) !== '--');
            // If there is more than one argument and none of these include the help option
            // Assume incorrect name has been inputed.
            if (remainingArgs.length > 1 && !hasHelpOption(remainingArgs)) {
                // TODO: Display help menu & exit
                // tslint:disable-next-line
                console.log(commandLineUsage(CLI_DESCRIPTION.general.menu));
                throw new Error(chalk.red(`Please enter a valid feature name; See help menu above for instructions.`));
            }
            // [4] Checking all arguments to see if they contain any options
            returnObject.options = args.filter(option => option.substring(0, argIndex) === '--');
        }
    }
    else {
        // [1b] If there is no action in the user input then search for a predefined feature.
        // If found, return the feature found in the input
        returnObject.feature = parseFeature(args, features);
    }
    return returnObject;
}
function displayHelp(sections) {
    return commandLineUsage(sections);
}
function getKebabCase(str) {
    const regex = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
    const match = str.match(regex);
    let result = '';
    if (match !== null) {
        result = match.map(x => x.toLowerCase())
            .join('-');
    }
    return result;
}
function getPascalCase(str) {
    const word = str.replace(/([-_][a-z0-9])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
    return `${word.charAt(0)
        .toLocaleUpperCase()}${word
        .substring(1)}`;
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
            if (paths.length > 0 && paths[1] === '') {
                isRoot = true;
            }
        }
    }
    catch (e) {
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
        projectRoot: '',
    };
    let projectRoot;
    if (operation.feature === 'project') {
        results.isValid = true;
    }
    else {
        projectRoot = getProjectRoot();
        if (projectRoot !== null && projectRoot !== '') {
            results.isValid = true;
            results.projectRoot = projectRoot;
        }
        else {
            results.isValid = false;
        }
    }
    return results;
}
// Function to iterate through the actions object
// and check for the matching action to the users input
function actionBeingRequested(enteredAction) {
    // To be returned after finding the action
    let actionReturn = '';
    // Assign the properties of the action object to an array to be iterated through
    const actionProperties = Object.keys(ACTIONS);
    /**
     * @param elem property on the actions object being checked currently
     * @param index the index of the object being checked
     */
    actionProperties.forEach((elem, index) => {
        // If the action keyword the user entered in found inside the array
        // the action is assigned to the variable to be returned
        if (ACTIONS[elem].includes(enteredAction)) {
            actionReturn = actionProperties[index];
        }
    });
    return actionReturn;
}
export { heading, sectionBreak, lineBreak, nextSteps, hasFeature, hasOptions, hasHelpOption, hasInvalidOption, parseFeature, parseOptions, parseUserInput, displayHelp, hasKebab, getKebabCase, getPascalCase, checkProjectValidity, isRootDirectory, getProjectRoot, actionBeingRequested };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxnQkFBNkIsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRCxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFckMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFckMsU0FBUyxPQUFPO0lBQ2Qsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQ1QsS0FBSyxDQUFDLE1BQU0sQ0FDVixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN2QixnQkFBZ0IsRUFBRSxNQUFNO0tBQ3pCLENBQUMsQ0FDSCxDQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxZQUFZO0lBQ25CLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRCxTQUFTLFNBQVM7SUFDaEIsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLFdBQW1CO0lBQ3BDLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM1QyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcs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