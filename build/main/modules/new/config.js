"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const git_user_name_1 = __importDefault(require("git-user-name"));
const chalk_1 = __importDefault(require("chalk"));
const files_1 = __importDefault(require("../../lib/files"));
const DEFAULT_PROJECT_NAME = 'my-vue-app';
const REGEX_PROJECT_NAME = /^\s+$/;
async function validate(value) {
    let done = this.async();
    if (value.length == 0 || value.match(REGEX_PROJECT_NAME)) {
        done(chalk_1.default.red(`You need to enter a valid project name`));
        return;
    } //  Directory with specified name already exists
    else if (files_1.default.directoryExists(value)) {
        done(chalk_1.default.red(`Project with the name ${value} already exists`));
        return;
    }
    else {
        done(null, true);
    }
}
function parsePrompts(config) {
    return config.arguments ? config.arguments
        .filter((q) => {
        return q.isPrivate === undefined;
    })
        .map((p) => {
        return {
            type: 'input',
            name: p.name,
            message: `Please enter ${p.description}`,
            default: null,
            validate,
        };
    }) : [];
}
const TEMPLATE_PROJECT_URL = `https://${git_user_name_1.default()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
const OPTIONS_ALL = ['--new'];
const QUESTIONS = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter a name for the project:',
        default: DEFAULT_PROJECT_NAME,
        validate,
    },
    {
        type: 'input',
        name: 'description',
        default: null,
        message: 'Enter a description of the project (optional):'
    }
];
exports.default = {
    TEMPLATE_PROJECT_URL,
    OPTIONS_ALL,
    QUESTIONS,
    parsePrompts,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbmV3L2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtFQUF1QztBQUN2QyxrREFBMEI7QUFDMUIsNERBQW9DO0FBRXBDLE1BQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQzFDLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDO0FBRW5DLEtBQUssVUFBVSxRQUFRLENBQVksS0FBYTtJQUM5QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEIsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7UUFDeEQsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDO1FBQzFELE9BQU87S0FDUixDQUFDLGdEQUFnRDtTQUM3QyxJQUFJLGVBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDckMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMseUJBQXlCLEtBQUssaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLE9BQU87S0FDUjtTQUFNO1FBQ0wsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNsQjtBQUNILENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxNQUFXO0lBQy9CLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVM7U0FDdkMsTUFBTSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUU7UUFDakIsT0FBTyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQztJQUNuQyxDQUFDLENBQUM7U0FDRCxHQUFHLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUNkLE9BQU87WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSTtZQUNaLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLFdBQVcsRUFBRTtZQUN4QyxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVE7U0FDVCxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFFRCxNQUFNLG9CQUFvQixHQUFXLFdBQVcsdUJBQVcsRUFBRSw2Q0FBNkMsQ0FBQztBQUMzRyxNQUFNLFdBQVcsR0FBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXhDLE1BQU0sU0FBUyxHQUFVO0lBQ3ZCO1FBQ0UsSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsYUFBYTtRQUNuQixPQUFPLEVBQUUsK0JBQStCO1FBQ3hDLE9BQU8sRUFBRSxvQkFBb0I7UUFDN0IsUUFBUTtLQUNUO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxhQUFhO1FBQ25CLE9BQU8sRUFBRSxJQUFJO1FBQ2IsT0FBTyxFQUFFLGdEQUFnRDtLQUMxRDtDQUNGLENBQUM7QUFFRixrQkFBZTtJQUNiLG9CQUFvQjtJQUNwQixXQUFXO0lBQ1gsU0FBUztJQUNULFlBQVk7Q0FDYixDQUFDIn0=