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
            remainingArgs = args.slice(argIndex);
            remainingArgs.filter(userinput => userinput.substring(0, argIndex) !== '--');
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
    return `${word.charAt(0)
        .toLocaleUpperCase()}${word
        .substring(1)}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQiw0RUFBK0Q7QUFDL0Qsb0RBQTRCO0FBQzVCLGdEQUF3QjtBQUN4QixzREFBaUQ7QUFDakQsb0NBQTJDO0FBRTNDLG1DQUFxQztBQUVyQyxNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVyQyxTQUFTLE9BQU87SUFDZCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FDVCxlQUFLLENBQUMsTUFBTSxDQUNWLGdCQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN2QixnQkFBZ0IsRUFBRSxNQUFNO0tBQ3pCLENBQUMsQ0FDSCxDQUNGLENBQUM7QUFDSixDQUFDO0FBMFFDLDBCQUFPO0FBeFFULFNBQVMsWUFBWTtJQUNuQixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBc1FDLG9DQUFZO0FBcFFkLFNBQVMsU0FBUztJQUNoQixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBa1FDLDhCQUFTO0FBaFFYLFNBQVMsU0FBUyxDQUFDLFdBQW1CO0lBQ3BDLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM1QyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLFdBQVcsMkNBQTJDLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBNFBDLDhCQUFTO0FBMVBYLFNBQVMsVUFBVSxDQUFDLElBQWMsRUFBRSxRQUFrQjtJQUNwRCwwQ0FBMEM7SUFDMUMsTUFBTSxL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