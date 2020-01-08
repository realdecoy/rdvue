"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const figlet_1 = __importDefault(require("figlet"));
const chalk_1 = __importDefault(require("chalk"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const path_1 = __importDefault(require("path"));
const files_1 = __importDefault(require("./files"));
const helpOptions = ['--help', '-h'];
function heading() {
    console.log(chalk_1.default.yellow(figlet_1.default.textSync("rdvue", {
        horizontalLayout: "full"
    })));
}
function sectionBreak() {
    console.log(chalk_1.default.gray("********************************"));
}
function lineBreak() {
    console.log('\n');
}
function nextSteps(featureName) {
    console.log(chalk_1.default.magenta('\nNext Steps:'));
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
    return command_line_usage_1.default(sections);
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
            paths = testLocation.split(path_1.default.sep);
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
        currentPath = path_1.default.join(process.cwd(), back);
        back = path_1.default.join(back, '../');
        currentTraverse += 1;
        if (files_1.default.fileExists(path_1.default.join(currentPath, configFileName))) {
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
exports.default = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUM1QixrREFBMEI7QUFDMUIsNEVBQStEO0FBQy9ELGdEQUF3QjtBQUN4QixvREFBNEI7QUFFNUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFckMsU0FBUyxPQUFPO0lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FDVCxlQUFLLENBQUMsTUFBTSxDQUNWLGdCQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN2QixnQkFBZ0IsRUFBRSxNQUFNO0tBQ3pCLENBQUMsQ0FDSCxDQUNGLENBQUM7QUFDSixDQUFDO0FBQ0QsU0FBUyxZQUFZO0lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUNELFNBQVMsU0FBUztJQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFDRCxTQUFTLFNBQVMsQ0FBQyxXQUFtQjtJQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsV0FBVywyQ0FBMkMsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxJQUFjLEVBQUUsUUFBa0I7SUFDcEQsMENBQTBDO0lBQzFDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FB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