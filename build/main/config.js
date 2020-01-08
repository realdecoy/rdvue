"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const git_user_name_1 = __importDefault(require("git-user-name"));
const TEMPLATE_PROJECT_URL = `https://${git_user_name_1.default()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
const CLI_PROJECT_ROOT = __dirname;
const TEMPLATE_ROOT = path_1.default.join(CLI_PROJECT_ROOT, '/../../template');
function USAGE_TEMPLATE(action = 'rdvue', command = '<feature>', options = '[options]') {
    return [
        {
            header: 'Usage:',
            content: `$ ${chalk_1.default.yellow(action)} ${chalk_1.default.magenta(command)} ${chalk_1.default.cyan(options)}`,
        },
        {
            header: 'Options:',
            optionList: [
                {
                    name: `${chalk_1.default.cyan('new')}`,
                    description: 'explicitly create a new feature (optional).'
                },
                {
                    name: `${chalk_1.default.cyan('help')}`,
                    description: 'Show this usage guide.'
                }
            ]
        }
    ];
}
exports.default = {
    TEMPLATE_PROJECT_URL,
    USAGE_TEMPLATE,
    CLI_PROJECT_ROOT,
    TEMPLATE_ROOT,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixnREFBd0I7QUFDeEIsa0VBQXdDO0FBRXhDLE1BQU0sb0JBQW9CLEdBQUcsV0FBVyx1QkFBVyxFQUFFLDZDQUE2QyxDQUFDO0FBQ25HLE1BQU0sZ0JBQWdCLEdBQVcsU0FBUyxDQUFDO0FBQzNDLE1BQU0sYUFBYSxHQUFXLGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUU3RSxTQUFTLGNBQWMsQ0FDbkIsTUFBTSxHQUFHLE9BQU8sRUFDaEIsT0FBTyxHQUFHLFdBQVcsRUFDckIsT0FBTyxHQUFHLFdBQVc7SUFDckIsT0FBTztRQUNIO1lBQ0ksTUFBTSxFQUFFLFFBQVE7WUFDaEIsT0FBTyxFQUFFLEtBQUssZUFBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxlQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7U0FDeEY7UUFDRDtZQUNJLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFVBQVUsRUFBRTtnQkFDUjtvQkFDSSxJQUFJLEVBQUUsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUM1QixXQUFXLEVBQUUsNkNBQTZDO2lCQUM3RDtnQkFDRDtvQkFDSSxJQUFJLEVBQUUsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUM3QixXQUFXLEVBQUUsd0JBQXdCO2lCQUN4QzthQUNKO1NBQ0o7S0FDSixDQUFDO0FBQ04sQ0FBQztBQUVELGtCQUFlO0lBQ1gsb0JBQW9CO0lBQ3BCLGNBQWM7SUFDZCxnQkFBZ0I7SUFDaEIsYUFBYTtDQUNoQixDQUFDIn0=