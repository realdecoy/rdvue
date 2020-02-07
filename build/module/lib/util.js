import chalk from 'chalk';
import commandLineUsage from 'command-line-usage';
import figlet from 'figlet';
import path from 'path';
import { ACTIONS } from '../constants/reusable-constants';
import { CLI_DESCRIPTION } from '../index';
import { actions } from '../modules/actions';
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
    let remainingArgs = [];
    // [1] Checking first argument <action> to see if it includes a valid actions
    // (eg. generate)
    if (args[0] !== undefined && actions.includes(args[0])) {
        returnObject.action = args[0];
        // [2] Checking second argument <feature>
        // to see if it includes a valid feature (eg. project or page)
        if (args[1] !== undefined && features.includes(args[1])) {
            returnObject.feature = args[1];
            // [3] Checking third argument <feature name> eg. "test_project"
            // If the feature name entered contains '--' at the beggining of the word
            // it is assumed that they are entering an option instead and therefore, no feature name
            // has been inputed/proccessed.
            if (args[2] !== undefined && args[2].substring(0, 2) !== '--') {
                returnObject.featureName = args[2];
            }
            // Remove the first <action> and second <feature> argument from array
            remainingArgs = args.slice(2);
            remainingArgs.filter(userinput => userinput.substring(0, 2) !== '--');
            if (remainingArgs.length > 1) {
                // TODO: Display help menu & exit
                console.log(commandLineUsage(CLI_DESCRIPTION.general.menu));
                throw new Error(chalk.red(`Please enter a valid project name; See help menu above for instructions.`));
            }
            // [4] Checking all arguments to see if they contain any options
            returnObject.options = args.filter(option => option.substring(0, 2) === '--');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxnQkFBNkIsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRCxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUU3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXJDLE1BQU0sV0FBVyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBRXJDLFNBQVMsT0FBTztJQUNkLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUNULEtBQUssQ0FBQyxNQUFNLENBQ1YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDdkIsZ0JBQWdCLEVBQUUsTUFBTTtLQUN6QixDQUFDLENBQ0gsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsWUFBWTtJQUNuQixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBRUQsU0FBUyxTQUFTO0lBQ2hCLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxXQUFtQjtJQUNwQyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxD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