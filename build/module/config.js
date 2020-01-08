import chalk from 'chalk';
import path from 'path';
import gitUserName from "git-user-name";
const TEMPLATE_PROJECT_URL = `https://${gitUserName()}@bitbucket.org/realdecoyteam/rd-vue-cli.git`;
const CLI_PROJECT_ROOT = __dirname;
const TEMPLATE_ROOT = path.join(CLI_PROJECT_ROOT, '/../../template');
function USAGE_TEMPLATE(action = 'rdvue', command = '<feature>', options = '[options]') {
    return [
        {
            header: 'Usage:',
            content: `$ ${chalk.yellow(action)} ${chalk.magenta(command)} ${chalk.cyan(options)}`,
        },
        {
            header: 'Options:',
            optionList: [
                {
                    name: `${chalk.cyan('new')}`,
                    description: 'explicitly create a new feature (optional).'
                },
                {
                    name: `${chalk.cyan('help')}`,
                    description: 'Show this usage guide.'
                }
            ]
        }
    ];
}
export default {
    TEMPLATE_PROJECT_URL,
    USAGE_TEMPLATE,
    CLI_PROJECT_ROOT,
    TEMPLATE_ROOT,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sV0FBVyxNQUFNLGVBQWUsQ0FBQztBQUV4QyxNQUFNLG9CQUFvQixHQUFHLFdBQVcsV0FBVyxFQUFFLDZDQUE2QyxDQUFDO0FBQ25HLE1BQU0sZ0JBQWdCLEdBQVcsU0FBUyxDQUFDO0FBQzNDLE1BQU0sYUFBYSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUU3RSxTQUFTLGNBQWMsQ0FDbkIsTUFBTSxHQUFHLE9BQU8sRUFDaEIsT0FBTyxHQUFHLFdBQVcsRUFDckIsT0FBTyxHQUFHLFdBQVc7SUFDckIsT0FBTztRQUNIO1lBQ0ksTUFBTSxFQUFFLFFBQVE7WUFDaEIsT0FBTyxFQUFFLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7U0FDeEY7UUFDRDtZQUNJLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFVBQVUsRUFBRTtnQkFDUjtvQkFDSSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUM1QixXQUFXLEVBQUUsNkNBQTZDO2lCQUM3RDtnQkFDRDtvQkFDSSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUM3QixXQUFXLEVBQUUsd0JBQXdCO2lCQUN4QzthQUNKO1NBQ0o7S0FDSixDQUFDO0FBQ04sQ0FBQztBQUVELGVBQWU7SUFDWCxvQkFBb0I7SUFDcEIsY0FBYztJQUNkLGdCQUFnQjtJQUNoQixhQUFhO0NBQ2hCLENBQUMifQ==