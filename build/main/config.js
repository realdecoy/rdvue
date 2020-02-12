"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
const chalk_1 = __importDefault(require("chalk"));
const git_user_name_1 = __importDefault(require("git-user-name"));
const path_1 = __importDefault(require("path"));
const TEMPLATE_PROJECT_URL =
  `https://${git_user_name_1.default()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
exports.TEMPLATE_PROJECT_URL = TEMPLATE_PROJECT_URL;
const CLI_PROJECT_ROOT = __dirname;
exports.CLI_PROJECT_ROOT = CLI_PROJECT_ROOT;
const TEMPLATE_ROOT = path_1.default.join(CLI_PROJECT_ROOT, '/../../template');
exports.TEMPLATE_ROOT = TEMPLATE_ROOT;

function USAGE_TEMPLATE(service = 'rdvue', action = '<action>', feature =
  '<feature>', featureName = '<feature name>', options = '[options]') {
  return [{
      header: 'Usage:',
      content: `$ ${chalk_1.default.yellow(service)} ${chalk_1.default.green(action)} ${chalk_1.default.magenta(feature)} ${chalk_1.default.grey(featureName)} ${chalk_1.default.cyan(options)}`
    },
    {
      header: 'Actions:',
      content: [{
        name: `${chalk_1.default.green('generate')}`,
        shortcut: `${chalk_1.default.green('g')}`,
        summary: 'Creates new feature',
      }]
    },
    {
      header: 'Options:',
      content: [{
        name: `${chalk_1.default.cyan('--help')}`,
        shortcut: `${chalk_1.default.cyan('-h')}`,
        summary: 'Display Help Menu',
      }]
    }
  ];
}
exports.USAGE_TEMPLATE = USAGE_TEMPLATE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixrRUFBd0M7QUFDeEMsZ0RBQXdCO0FBR3hCLE1BQU0sb0JBQW9CLEdBQUcsV0FBVyx1QkFBVyxFQUFFLDZDQUE2QyxDQUFDO0FBdUMvRixvREFBb0I7QUF0Q3hCLE1BQU0sZ0JBQWdCLEdBQVcsU0FBUyxDQUFDO0FBd0N2Qyw0Q0FBZ0I7QUF2Q3BCLE1BQU0sYUFBYSxHQUFXLGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQXdDekUsc0NBQWE7QUF0Q2pCLFNBQVMsY0FBYyxDQUNuQixPQUFPLEdBQUcsT0FBTyxFQUNqQixNQUFNLEdBQUcsVUFBVSxFQUNuQixPQUFPLEdBQUcsV0FBVyxFQUNyQixXQUFXLEdBQUcsZ0JBQWdCLEVBQzlCLE9BQU8sR0FBRyxXQUFXO0lBQ3JCLE9BQU87UUFDSDtZQUNJLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE9BQU8sRUFBRSxLQUFLLGVBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksZUFBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxlQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksZUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtTQUMzSTtRQUNEO1lBQ0ksTUFBTSxFQUFFLFVBQVU7WUFDbEIsT0FBTyxFQUFFO2dCQUNMO29CQUNJLElBQUksRUFBRSxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ2xDLFFBQVEsRUFBRSxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQy9CLE9BQU8sRUFBRSxxQkFBcUI7aUJBQ2pDO2FBQ0o7U0FDSjtRQUNEO1lBQ0ksTUFBTSxFQUFFLFVBQVU7WUFDbEIsT0FBTyxFQUFFO2dCQUNMO29CQUNJLElBQUksRUFBRSxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQy9CLFFBQVEsRUFBRSxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQy9CLE9BQU8sRUFBRSxtQkFBbUI7aUJBQy9CO2FBQ0o7U0FDSjtLQUNKLENBQUM7QUFDTixDQUFDO0FBSUcsd0NBQWMifQ==
