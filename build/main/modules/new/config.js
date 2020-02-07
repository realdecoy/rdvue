"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const reusable_constants_1 = require("../../constants/reusable-constants");
exports.OPTIONS_ALL = reusable_constants_1.OPTIONS_ALL;
exports.TEMPLATE_PROJECT_URL = reusable_constants_1.TEMPLATE_PROJECT_URL;
const files = __importStar(require("../../lib/files"));
async function validate(value) {
    const done = this.async();
    if (value.length === 0 || value.match(reusable_constants_1.REGEX_PROJECT_NAME) !== null) {
        done(chalk_1.default.red(`You need to enter a valid project name`));
    } //  Directory with specified name already exists
    else if (files.directoryExists(value)) {
        done(chalk_1.default.red(`Project with the name ${value} already exists`));
    }
    else {
        done(null, true);
    }
}
function parsePrompts(config) {
    return config.arguments !== undefined ? config.arguments
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
exports.parsePrompts = parsePrompts;
const QUESTIONS = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter a name for the project:',
        default: reusable_constants_1.DEFAULT_PROJECT_NAME,
        validate,
    },
    {
        type: 'input',
        name: 'description',
        default: null,
        message: 'Enter a description of the project (optional):'
    }
];
exports.QUESTIONS = QUESTIONS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbmV3L2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsMkVBSzRDO0FBa0QxQyxzQkFyREEsZ0NBQVcsQ0FxREE7QUFEWCwrQkFsREEseUNBQW9CLENBa0RBO0FBaER0Qix1REFBeUM7QUFHekMsS0FBSyxVQUFVLFFBQVEsQ0FBWSxLQUFhO0lBQzlDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsdUNBQWtCLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbEUsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDO0tBQzNELENBQUMsZ0RBQWdEO1NBQzdDLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNyQyxJQUFJLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsS0FBSyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7S0FDbEU7U0FBTTtRQUNMLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbEI7QUFDSCxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBYztJQUNsQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUztTQUNyRCxNQUFNLENBQUMsQ0FBQyxDQUFZLEVBQUUsRUFBRTtRQUN2QixPQUFPLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDO0lBQ25DLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2QsT0FBTztZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO1lBQ1osT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ3hDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1osQ0FBQztBQXNCQyxvQ0FBWTtBQXBCZCxNQUFNLFNBQVMsR0FBVTtJQUN2QjtRQUNFLElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLCtCQUErQjtRQUN4QyxPQUFPLEVBQUUseUNBQW9CO1FBQzdCLFFBQVE7S0FDVDtJQUNEO1FBQ0UsSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsYUFBYTtRQUNuQixPQUFPLEVBQUUsSUFBSTtRQUNiLE9BQU8sRUFBRSxnREFBZ0Q7S0FDMUQ7Q0FDRixDQUFDO0FBS0EsOEJBQVMifQ==