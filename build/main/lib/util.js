"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const figlet_1 = __importDefault(require("figlet"));
const path_1 = __importDefault(require("path"));
const reusable_constants_1 = require("../constants/reusable-constants");
const index_1 = require("../index");
const actions_1 = require("../modules/actions");
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
    let remainingArgs = [];
    // [1] Checking first argument <action> to see if it includes a valid actions
    // (eg. generate)
    if (args[0] !== undefined && actions_1.actions.includes(args[0])) {
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
                console.log(command_line_usage_1.default(index_1.CLI_DESCRIPTION.general.menu));
                throw new Error(chalk_1.default.red(`Please enter a valid project name; See help menu above for instructions.`));
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
    return (str.replace(/\w\S*/g, m => `${m.charAt(0)
        .toLocaleUpperCase()}${m.substr(1)
        .toLocaleLowerCase()}`));
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
    const actionProperties = Object.keys(reusable_constants_1.ACTIONS);
    /**
     * @param elem property on the actions object being checked currently
     * @param index the index of the object being checked
     */
    actionProperties.forEach((elem, index) => {
        // If the action keyword the user entered in found inside the array
        // the action is assigned to the variable to be returned
        if (reusable_constants_1.ACTIONS[elem].includes(enteredAction)) {
            actionReturn = actionProperties[index];
        }
    });
    return actionReturn;
}
exports.actionBeingRequested = actionBeingRequested;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQiw0RUFBK0Q7QUFDL0Qsb0RBQTRCO0FBQzVCLGdEQUF3QjtBQUN4Qix3RUFBMEQ7QUFDMUQsb0NBQTJDO0FBQzNDLGdEQUE2QztBQUU3QyxtQ0FBcUM7QUFFckMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFckMsU0FBUyxPQUFPO0lBQ2Qsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQ1QsZUFBSyxDQUFDLE1BQU0sQ0FDVixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDdkIsZ0JBQWdCLEVBQUUsTUFBTTtLQUN6QixDQUFDLENBQ0gsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQStQQywwQkFBTztBQTdQVCxTQUFTLFlBQVk7SUFDbkIsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQTJQQyxvQ0FBWTtBQXpQZCxTQUFTLFNBQVM7SUFDaEIsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQXVQQyw4QkFBUztBQXJQWCxTQUFTLFNBQVMsQ0FBQyxXQUFtQjtJQUNwQyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxXQUFXLDJDQUEyQyxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQWlQQyw4QkFBUztBQS9PWCxTQUFTLFVBQVUsQ0FBQyxJQUFjLEVBQUUsUUFBa0I7SUFDcEQsMENBQTBDO0lBQzFDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUEyT0MsZ0NBQVU7QUF6T1osU0FBUyxVQUFVLENBQUMsSUFBYyxFQUFFLE9BQWlCO0lBQ25ELHlDQUF5QztJQUN6QyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBcU9DLGdDQUFVO0FBbk9aLFNBQVMsYUFBYSxDQUFDLElBQWM7SUFDbkMsaURBQWlEO0lBQ2pELE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV4RCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUErTkMsc0NBQWE7QUE3TmYsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFjLEVBQUUsT0FBaUI7SUFDekQsNENBQTRDO0lBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRixPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUF5TkMsNENBQWdCO0FBdk5sQixTQUFTLFlBQVksQ0FBQyxJQUFjLEVBQUUsUUFBa0I7SUFDdEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFzTkMsb0NBQVk7QUFwTmQ7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxJQUFjO0lBQ2xDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBZ05DLG9DQUFZO0FBOU1kOzs7OztHQUtHO0FBQ0gsU0FBUyxjQUFjLENBQUMsSUFBYyxFQUFFLFFBQWtCO0lBRXhELHdDQUF3QztJQUN4Qyw4Q0FBOEM7SUFDOUMsTUFBTSxZQUFZLEdBQUc7UUFDbkIsTUFBTSxFQUFFLEVBQUU7UUFDVixPQUFPLEVBQUUsRUFBRTtRQUNYLFdBQVcsRUFBRSxFQUFFO1FBQ2YsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0tBQ2QsQ0FBQztJQUNGLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUV2Qiw2RUFBNkU7SUFDN0UsaUJBQWlCO0lBRWpCLElBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsSUFBSSxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRztRQUV4RCxZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5Qix5Q0FBeUM7UUFDekMsOERBQThEO1FBQzlELElBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFHO1lBRXpELFlBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRS9CLGdFQUFnRTtZQUNoRSx5RUFBeUU7WUFDekUsd0ZBQXdGO1lBQ3hGLCtCQUErQjtZQUMvQixJQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFHO2dCQUMvRCxZQUFZLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwQztZQUVELHFFQUFxRTtZQUNyRSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixhQUFhLENBQUMsTUFBTSxDQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDdkUsSUFBSyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDN0I7Z0JBQ0UsaUNBQWlDO2dCQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUFnQixDQUFDLHVCQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQywwRUFBMEUsQ0FBQyxDQUFDLENBQUM7YUFDeEc7WUFFRCxnRUFBZ0U7WUFDaEUsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7U0FFL0U7S0FDRjtTQUFNO1FBQ0wscUZBQXFGO1FBQ3JGLGtEQUFrRDtRQUNsRCxZQUFZLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDckQ7SUFFRCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBbUpDLHdDQUFjO0FBakpoQixTQUFTLFdBQVcsQ0FBQyxRQUFtQjtJQUN0QyxPQUFPLDRCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFnSkMsa0NBQVc7QUE5SWIsU0FBUyxZQUFZLENBQUMsR0FBVztJQUUvQixNQUFNLEtBQUssR0FBRyxvRUFBb0UsQ0FBQztJQUNuRixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7UUFDbEIsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1o7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBcUlDLG9DQUFZO0FBbklkLFNBQVMsYUFBYSxDQUFDLEdBQVc7SUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUM5QyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2pDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQWdJQyxzQ0FBYTtBQTlIZixTQUFTLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRTtJQUN4QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDbkIsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNqQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBQ2Y7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBcUhDLDRCQUFRO0FBbkhWLFNBQVMsZUFBZSxDQUFDLFdBQTBCLElBQUk7SUFDckQsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ25CLElBQUk7UUFDRixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ3JCLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDOUI7UUFFRCxJQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7WUFDekIsS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQzthQUNmO1NBQ0Y7S0FDRjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1osc0NBQXNDO1FBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM5QyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBQ2Y7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBaUdDLDBDQUFlO0FBL0ZqQixTQUFTLGNBQWM7SUFDckIsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDO0lBQ2hDLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUV2QixJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEMsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztJQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFFaEIsT0FBTyxJQUFJLEVBQUU7UUFDWCxXQUFXLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlCLGVBQWUsSUFBSSxDQUFDLENBQUM7UUFFckIsSUFBSSxrQkFBVSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDLEVBQUU7WUFDdEQsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMxQixNQUFNO1NBQ1A7YUFBTSxJQUFJLGVBQWUsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUN2QyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLE1BQU07U0FDUDthQUFNLElBQUksZUFBZSxHQUFHLFdBQVcsRUFBRTtZQUN4QyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25CLE1BQU07U0FDUDtLQUNGO0lBRUQsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQXFFQyx3Q0FBYztBQW5FaEIsU0FBUyxvQkFBb0IsQ0FBQyxTQUFrQjtJQUM5QyxNQUFNLE9BQU8sR0FBRztRQUNkLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUFFLEVBQUU7S0FDaEIsQ0FBQztJQUNGLElBQUksV0FBMEIsQ0FBQztJQUUvQixJQUFJLFNBQVMsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ3hCO1NBQU07UUFFTCxXQUFXLEdBQUcsY0FBYyxFQUFFLENBQUM7UUFDL0IsSUFBSSxXQUFXLEtBQUssSUFBSSxJQUFJLFdBQVcsS0FBSyxFQUFFLEVBQUU7WUFDOUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDdkIsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7U0FDbkM7YUFBTTtZQUNMLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO0tBRUY7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBMkNDLG9EQUFvQjtBQXpDdEIsaURBQWlEO0FBQ2pELHVEQUF1RDtBQUN2RCxTQUFTLG9CQUFvQixDQUFDLGFBQXFCO0lBRWpELDBDQUEwQztJQUMxQyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFFdEIsZ0ZBQWdGO0lBQ2hGLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBTyxDQUFDLENBQUM7SUFFOUM7OztPQUdHO0lBQ0gsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3ZDLG1FQUFtRTtRQUNuRSx3REFBd0Q7UUFDdEQsSUFBRyw0QkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBQztZQUNyQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFxQkMsb0RBQW9CIn0=