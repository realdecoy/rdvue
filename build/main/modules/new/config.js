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
const constants_1 = require("../../constants/constants");
exports.OPTIONS_ALL = constants_1.OPTIONS_ALL;
exports.TEMPLATE_PROJECT_URL = constants_1.TEMPLATE_PROJECT_URL;
const files = __importStar(require("../../lib/files"));
// tslint:disable-next-line
async function validate(value) {
    const done = this.async();
    if (value.length === 0 || value.match(constants_1.REGEX_PROJECT_NAME) !== null) {
        done(chalk_1.default.red(`You need to enter a valid project name`));
    } //  Directory with specified name already exists
    else if (files.directoryExists(value)) {
        done(chalk_1.default.red(`Project with the name ${value} already exists`));
    }
    else {
        done(null, true);
    }
}
// tslint:disable-next-line
function parsePrompts(config) {
    return config.arguments !== undefined ? config.arguments
        .filter((q) => {
        return q.isPrivate === undefined;
    })
        // tslint:disable-next-line
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
// tslint:disable-next-line
const QUESTIONS = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter a name for the project:',
        default: constants_1.DEFAULT_PROJECT_NAME,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbmV3L2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIseURBS21DO0FBc0RqQyxzQkF6REEsdUJBQVcsQ0F5REE7QUFEWCwrQkF0REEsZ0NBQW9CLENBc0RBO0FBcER0Qix1REFBeUM7QUFHekMsMkJBQTJCO0FBQzNCLEtBQUssVUFBVSxRQUFRLENBQVksS0FBYTtJQUM5QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLDhCQUFrQixDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2xFLElBQUksQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQztLQUMzRCxDQUFDLGdEQUFnRDtTQUM3QyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDckMsSUFBSSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMseUJBQXlCLEtBQUssaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0tBQ2xFO1NBQU07UUFDTCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQztBQUVELDJCQUEyQjtBQUMzQixTQUFTLFlBQVksQ0FBQyxNQUFjO0lBQ2xDLE9BQU8sTUFBTSxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTO1NBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQVksRUFBRSxFQUFFO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUM7SUFDbkMsQ0FBQyxDQUFDO1FBQ0YsMkJBQTJCO1NBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2QsT0FBTztZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO1lBQ1osT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ3hDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1osQ0FBQztBQXVCQyxvQ0FBWTtBQXJCZCwyQkFBMkI7QUFDM0IsTUFBTSxTQUFTLEdBQVU7SUFDdkI7UUFDRSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxhQUFhO1FBQ25CLE9BQU8sRUFBRSwrQkFBK0I7UUFDeEMsT0FBTyxFQUFFLGdDQUFvQjtRQUM3QixRQUFRO0tBQ1Q7SUFDRDtRQUNFLElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLElBQUk7UUFDYixPQUFPLEVBQUUsZ0RBQWdEO0tBQzFEO0NBQ0YsQ0FBQztBQUtBLDhCQUFTIn0=