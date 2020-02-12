"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const figlet_1 = __importDefault(require("figlet"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants/constants");
const index_1 = require("../index");
const files_1 = require("./files");
const helpOptions = ['--help', '-h'];
function heading() {
    // tslint:disable-next-line:no-console
    console.log(chalk_1.default.yellow(figlet_1.default.textSync('rdvue', {
        horizontalLayout: 'full'
    })));
}
exports.heading = heading;
function sectionBreak() {
    // tslint:disable-next-line:no-console
    console.log(chalk_1.default.gray('********************************'));
}
exports.sectionBreak = sectionBreak;
function lineBreak() {
    // tslint:disable-next-line:no-console
    console.log('\n');
}
exports.lineBreak = lineBreak;
function nextSteps(featureName) {
    // tslint:disable-next-line:no-console
    console.log(chalk_1.default.magenta('\nNext Steps:'));
    // tslint:disable-next-line:no-console
    console.log(` - cd ${featureName}\n - npm install\n - npm run-script serve`);
}
exports.nextSteps = nextSteps;
function hasFeature(args, features) {
    // Console.log(`hasCommand: ${commands}`);
    const found = features.some((r) => args.includes(r));
    return found;
}
exports.hasFeature = hasFeature;
function hasOptions(args, options) {
    // Console.log(`hasOptions: ${options}`);
    const found = options.some((r) => args.includes(r));
    return found;
}
exports.hasOptions = hasOptions;
function hasHelpOption(args) {
    // Console.log(`hasHelpOptions: ${helpOptions}`);
    const found = helpOptions.some((r) => args.includes(r));
    return found;
}
exports.hasHelpOption = hasHelpOption;
function hasInvalidOption(args, options) {
    // Console.log(`hasInvalidOption: ${args}`);
    const found = args.some((r) => !options.includes(r) && !helpOptions.includes(r));
    return found;
}
exports.hasInvalidOption = hasInvalidOption;
function parseFeature(args, features) {
    return args.filter(x => features.includes(x))[0];
}
exports.parseFeature = parseFeature;
/**
 * Get the options that have been input by the user
 */
function parseOptions(args) {
    return args.filter(option => option.includes('--'));
}
exports.parseOptions = parseOptions;
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
            remainingArgs = args.slice(2);
            remainingArgs.filter(userinput => userinput.substring(0, 2) !== '--');
            // If there is more than one argument and none of these include the help option
            // Assume incorrect name has been inputed.
            if (remainingArgs.length > 1 && !hasHelpOption(remainingArgs)) {
                // TODO: Display help menu & exit
                // tslint:disable-next-line
                console.log(command_line_usage_1.default(index_1.CLI_DESCRIPTION.general.menu));
                throw new Error(chalk_1.default.red(`Please enter a valid feature name; See help menu above for instructions.`));
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
exports.parseUserInput = parseUserInput;
function displayHelp(sections) {
    return command_line_usage_1.default(sections);
}
exports.displayHelp = displayHelp;
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
exports.getKebabCase = getKebabCase;
function getPascalCase(str) {
    const word = str.replace(/([-_][a-z0-9])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
    return `${word.charAt(0).toLocaleUpperCase()}${word.substring(1)}`;
}
exports.getPascalCase = getPascalCase;
function hasKebab(str = '') {
    let result = false;
    if (str.match(/kebab/gi) !== null) {
        result = true;
    }
    return result;
}
exports.hasKebab = hasKebab;
function isRootDirectory(location = null) {
    let isRoot = false;
    try {
        let paths = [];
        let testLocation = location;
        if (location === null) {
            testLocation = process.cwd();
        }
        if (testLocation !== null) {
            paths = testLocation.split(path_1.default.sep);
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
exports.isRootDirectory = isRootDirectory;
function getProjectRoot() {
    const configFileName = '.rdvue';
    const maxTraverse = 20;
    let currentPath = process.cwd();
    let currentTraverse = 0;
    let projectRoot = null;
    let back = './';
    while (true) {
        currentPath = path_1.default.join(process.cwd(), back);
        back = path_1.default.join(back, '../');
        currentTraverse += 1;
        if (files_1.fileExists(path_1.default.join(currentPath, configFileName))) {
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
exports.getProjectRoot = getProjectRoot;
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
exports.checkProjectValidity = checkProjectValidity;
// Function to iterate through the actions object
// and check for the matching action to the users input
function actionBeingRequested(enteredAction) {
    // To be returned after finding the action
    let actionReturn = '';
    // Assign the properties of the action object to an array to be iterated through
    const actionProperties = Object.keys(constants_1.ACTIONS);
    /**
     * @param elem property on the actions object being checked currently
     * @param index the index of the object being checked
     */
    actionProperties.forEach((elem, index) => {
        // If the action keyword the user entered in found inside the array
        // the action is assigned to the variable to be returned
        if (constants_1.ACTIONS[elem].includes(enteredAction)) {
            actionReturn = actionProperties[index];
        }
    });
    return actionReturn;
}
exports.actionBeingRequested = actionBeingRequested;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQiw0RUFBK0Q7QUFDL0Qsb0RBQTRCO0FBQzVCLGdEQUF3QjtBQUN4QixzREFBaUQ7QUFDakQsb0NBQTJDO0FBRTNDLG1DQUFxQztBQUVyQyxNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVyQyxTQUFTLE9BQU87SUFDZCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FDVCxlQUFLLENBQUMsTUFBTSxDQUNWLGdCQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN2QixnQkFBZ0IsRUFBRSxNQUFNO0tBQ3pCLENBQUMsQ0FDSCxDQUNGLENBQUM7QUFDSixDQUFDO0FBdVFDLDBCQUFPO0FBclFULFNBQVMsWUFBWTtJQUNuQixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBbVFDLG9DQUFZO0FBalFkLFNBQVMsU0FBUztJQUNoQixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBK1BDLDhCQUFTO0FBN1BYLFNBQVMsU0FBUyxDQUFDLFdBQW1CO0lBQ3BDLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM1QyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLFdBQVcsMkNBQTJDLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBeVBDLDhCQUFTO0FBdlBYLFNBQVMsVUFBVSxDQUFDLElBQWMsRUFBRSxRQUFrQjtJQUNwRCwwQ0FBMEM7SUFDMUMsTUFBTSxL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